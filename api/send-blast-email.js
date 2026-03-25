// Vercel Serverless Function — Blast Email via Resend
// POST /api/send-blast-email
// Body: { artist_name, subject, body_html, test_email? }
// - If test_email is provided, sends only to that address
// - Otherwise fetches all leads for artist_name from Supabase and sends to all

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://apexmusiclatino.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const SUPABASE_URL = `https://${process.env.SUPABASE_PROJECT_ID || 'iaycaynevtumrqoknemk'}.supabase.co`;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'RESEND_API_KEY not configured' });
  }
  if (!SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ error: 'SUPABASE_SERVICE_ROLE_KEY not configured' });
  }

  const { artist_name, subject, body_html, test_email, from_label } = req.body;

  if (!artist_name || !subject || !body_html) {
    return res.status(400).json({ error: 'Missing required fields: artist_name, subject, body_html' });
  }

  const fromAddress = from_label
    ? `${from_label} <booking@apexmusiclatino.com>`
    : 'Apex Music Latino <booking@apexmusiclatino.com>';

  // If test_email, send only to that address (skip unsub check for internal notifications)
  if (test_email) {
    try {
      const htmlWithFooter = appendUnsubscribeFooter(body_html, test_email, 'blast');
      const result = await sendEmail(RESEND_API_KEY, fromAddress, test_email, subject, htmlWithFooter);
      return res.status(200).json({ sent: 1, failed: 0, test: true, id: result.id });
    } catch (err) {
      return res.status(500).json({ sent: 0, failed: 1, test: true, error: err.message });
    }
  }

  // Fetch all leads for this artist from Supabase
  let leads = [];
  try {
    const sbRes = await fetch(
      `${SUPABASE_URL}/rest/v1/leads_capture?artist_name=eq.${encodeURIComponent(artist_name)}&select=email,mood_preference&order=created_at.desc`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        }
      }
    );
    if (!sbRes.ok) {
      const errText = await sbRes.text();
      return res.status(500).json({ error: 'Supabase fetch failed: ' + errText });
    }
    leads = await sbRes.json();
  } catch (err) {
    return res.status(500).json({ error: 'Supabase connection error: ' + err.message });
  }

  if (!leads.length) {
    return res.status(200).json({ sent: 0, failed: 0, message: 'No leads found for this artist' });
  }

  // Deduplicate by email
  const seen = new Set();
  const uniqueLeads = leads.filter(l => {
    if (!l.email || seen.has(l.email.toLowerCase())) return false;
    seen.add(l.email.toLowerCase());
    return true;
  });

  // Fetch unsubscribes list
  const unsubscribed = await getUnsubscribedEmails(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Filter out unsubscribed
  const eligibleLeads = uniqueLeads.filter(l => !unsubscribed.has(l.email.toLowerCase().trim()));

  // Send to all eligible leads with rate limiting
  let sent = 0;
  let failed = 0;
  let skipped = uniqueLeads.length - eligibleLeads.length;
  const errors = [];

  for (const lead of eligibleLeads) {
    try {
      // Personalize: replace {{name}} placeholder if present
      const mp = typeof lead.mood_preference === 'string'
        ? JSON.parse(lead.mood_preference || '{}')
        : (lead.mood_preference || {});
      const fanName = mp.name || mp.fan_name || '';
      const fanId = mp.fan_id || '';
      let personalizedHtml = body_html
        .replace(/\{\{name\}\}/g, fanName || 'Fan')
        .replace(/\{\{fan_id\}\}/g, fanId)
        .replace(/\{\{email\}\}/g, lead.email);

      personalizedHtml = appendUnsubscribeFooter(personalizedHtml, lead.email, 'blast');

      await sendEmail(RESEND_API_KEY, fromAddress, lead.email, subject, personalizedHtml);
      sent++;
    } catch (err) {
      failed++;
      errors.push({ email: lead.email, error: err.message });
    }
    // Rate limit: 200ms between sends
    await new Promise(r => setTimeout(r, 200));
  }

  return res.status(200).json({ sent, failed, skipped_unsubscribed: skipped, total: uniqueLeads.length, errors: errors.slice(0, 10) });
}

async function sendEmail(apiKey, from, to, subject, html) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Resend API error');
  }
  return data;
}

async function getUnsubscribedEmails(supabaseUrl, serviceKey) {
  const unsubs = new Set();
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/unsubscribes?select=email`, {
      headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` }
    });
    if (res.ok) {
      const rows = await res.json();
      rows.forEach(r => unsubs.add(r.email.toLowerCase().trim()));
    }
  } catch (e) {
    console.warn('[unsubscribe] Could not fetch unsubscribes list:', e.message);
  }
  return unsubs;
}

function appendUnsubscribeFooter(html, email, source) {
  const token = Buffer.from(email).toString('base64');
  const unsubUrl = `https://apexmusiclatino.com/api/unsubscribe?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}&source=${encodeURIComponent(source)}`;
  const footerLink = `<p style="margin-top:12px;"><a href="${unsubUrl}" style="color:#444;font-size:9px;text-decoration:underline;">Cancelar suscripci\u00f3n / Unsubscribe</a></p>`;

  // Insert before the closing </body> or </html> tag, or append at end
  if (html.includes('</body>')) {
    return html.replace('</body>', footerLink + '</body>');
  } else if (html.includes('</html>')) {
    return html.replace('</html>', footerLink + '</html>');
  }
  return html + footerLink;
}
