// Vercel Serverless Function — Schedule Email via Resend Native Scheduling
// POST /api/schedule-email
// Body: { to, subject, html, from_label?, send_at?, artist_slug, campaign_type }
// - If send_at is provided, uses Resend's scheduled_at parameter (up to 72h ahead)
// - If send_at is omitted, sends immediately
// - Checks unsubscribes table before sending
// - Logs to scheduled_emails table with Resend message ID

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://apexmusiclatino.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const SUPABASE_URL = `https://${process.env.SUPABASE_PROJECT_ID || 'iaycaynevtumrqoknemk'}.supabase.co`;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!RESEND_API_KEY) return res.status(500).json({ error: 'RESEND_API_KEY not configured' });
  if (!SUPABASE_KEY) return res.status(500).json({ error: 'SUPABASE_SERVICE_ROLE_KEY not configured' });

  const { to, subject, html, from_label, send_at, artist_slug, campaign_type } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, html' });
  }

  if (!campaign_type || !['show_reminder', 'venue_outreach', 'blast', 'journey'].includes(campaign_type)) {
    return res.status(400).json({ error: 'Invalid campaign_type. Must be: show_reminder, venue_outreach, blast, or journey' });
  }

  const sbHeaders = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  try {
    // 1. Check unsubscribes table — skip if recipient has unsubscribed
    const unsubRes = await fetch(
      `${SUPABASE_URL}/rest/v1/unsubscribes?email=eq.${encodeURIComponent(to.toLowerCase())}&limit=1`,
      { headers: sbHeaders }
    );

    if (unsubRes.ok) {
      const unsubs = await unsubRes.json();
      if (unsubs.length > 0) {
        return res.status(200).json({
          success: false,
          skipped: true,
          reason: 'recipient_unsubscribed',
          email: to
        });
      }
    }
    // If unsubscribes table doesn't exist yet, proceed anyway

    // 2. Build Resend API payload
    const fromAddress = from_label
      ? `${from_label} <booking@apexmusiclatino.com>`
      : 'Apex Music Latino <booking@apexmusiclatino.com>';

    const resendPayload = {
      from: fromAddress,
      to: [to],
      subject,
      html
    };

    // Add scheduled_at if send_at is provided (Resend native scheduling)
    // Resend supports scheduling up to 72 hours in advance
    if (send_at) {
      const scheduledTime = new Date(send_at);
      const now = new Date();
      const hoursAhead = (scheduledTime - now) / (1000 * 60 * 60);

      if (scheduledTime <= now) {
        return res.status(400).json({ error: 'send_at must be in the future' });
      }

      if (hoursAhead > 72) {
        return res.status(400).json({
          error: 'Resend scheduling supports up to 72 hours in advance. Use /api/schedule-journey for longer sequences.',
          max_send_at: new Date(now.getTime() + 72 * 60 * 60 * 1000).toISOString()
        });
      }

      resendPayload.scheduled_at = scheduledTime.toISOString();
    }

    // 3. Call Resend API
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(resendPayload)
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      throw new Error(resendData.message || 'Resend API error');
    }

    // 4. Log to scheduled_emails table
    const logRow = {
      recipient_email: to,
      subject,
      body_html: html,
      from_label: from_label || null,
      artist_slug: artist_slug || null,
      campaign_type,
      resend_message_id: resendData.id,
      send_at: send_at || new Date().toISOString(),
      status: send_at ? 'scheduled' : 'sent',
      sent_at: send_at ? null : new Date().toISOString(),
      scheduling_method: 'resend_native'
    };

    await fetch(`${SUPABASE_URL}/rest/v1/scheduled_emails`, {
      method: 'POST',
      headers: sbHeaders,
      body: JSON.stringify(logRow)
    }).catch(err => {
      // Non-critical — log error but don't fail the request
      console.error('[schedule-email] Failed to log to scheduled_emails:', err.message);
    });

    // 5. Return success
    return res.status(200).json({
      success: true,
      resend_id: resendData.id,
      scheduled_at: send_at || null,
      sent_immediately: !send_at,
      email: to
    });

  } catch (err) {
    console.error('[schedule-email] Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
