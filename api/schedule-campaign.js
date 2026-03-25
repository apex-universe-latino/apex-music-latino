// Vercel Serverless Function — Schedule Campaign Emails
// POST /api/schedule-campaign
// Body: { campaign_id } — hydrates scheduled_emails from campaign definition

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SUPABASE_URL = `https://${process.env.SUPABASE_PROJECT_ID || 'iaycaynevtumrqoknemk'}.supabase.co`;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_KEY) return res.status(500).json({ error: 'SUPABASE_SERVICE_ROLE_KEY not configured' });

  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  const { campaign_id } = req.body;
  if (!campaign_id) return res.status(400).json({ error: 'Missing campaign_id' });

  try {
    // 1. Fetch campaign
    const campRes = await fetch(`${SUPABASE_URL}/rest/v1/email_campaigns?id=eq.${campaign_id}&limit=1`, { headers });
    const campaigns = await campRes.json();
    if (!campaigns.length) return res.status(404).json({ error: 'Campaign not found' });
    const campaign = campaigns[0];

    // 2. Determine audience
    const filter = campaign.audience_filter || {};
    const table = filter.table || 'leads_capture';
    let audienceUrl;

    if (table === 'venue_leads') {
      audienceUrl = `${SUPABASE_URL}/rest/v1/venue_leads?email=neq.&email=not.is.null`;
      if (filter.category) audienceUrl += `&category=eq.${encodeURIComponent(filter.category)}`;
      if (filter.city) audienceUrl += `&city=eq.${encodeURIComponent(filter.city)}`;
    } else {
      audienceUrl = `${SUPABASE_URL}/rest/v1/leads_capture?email=not.is.null&order=created_at.desc`;
      if (filter.artist_name) audienceUrl += `&artist_name=eq.${encodeURIComponent(filter.artist_name)}`;
    }

    const audRes = await fetch(audienceUrl, { headers });
    const audience = await audRes.json();

    // 3. Deduplicate by email
    const seen = new Set();
    const recipients = audience.filter(r => {
      const email = (r.email || '').toLowerCase().trim();
      if (!email || seen.has(email)) return false;
      seen.add(email);
      return true;
    });

    // 4. Create scheduled_emails for each recipient
    const sendAt = campaign.scheduled_at || new Date().toISOString();
    const rows = recipients.map(r => {
      let name = r.company_name || r.contact_name || '';
      if (table === 'leads_capture') {
        const mp = typeof r.mood_preference === 'string' ? JSON.parse(r.mood_preference || '{}') : (r.mood_preference || {});
        name = mp.name || mp.fan_name || '';
      }

      let subject = campaign.subject_template
        .replace(/\{\{name\}\}/g, name || 'Fan')
        .replace(/\{\{email\}\}/g, r.email);
      let body = campaign.body_html_template
        .replace(/\{\{name\}\}/g, name || 'Fan')
        .replace(/\{\{email\}\}/g, r.email);

      return {
        campaign_id: campaign.id,
        recipient_email: r.email,
        recipient_name: name,
        recipient_type: table === 'venue_leads' ? 'venue' : 'fan',
        subject,
        body_html: body,
        from_label: campaign.from_label,
        send_at: sendAt,
        status: 'pending'
      };
    });

    // Insert in batches
    let scheduled = 0;
    for (let i = 0; i < rows.length; i += 20) {
      const batch = rows.slice(i, i + 20);
      const insRes = await fetch(`${SUPABASE_URL}/rest/v1/scheduled_emails`, {
        method: 'POST', headers, body: JSON.stringify(batch)
      });
      if (insRes.ok) {
        const result = await insRes.json();
        scheduled += result.length;
      }
    }

    // Update campaign
    await fetch(`${SUPABASE_URL}/rest/v1/email_campaigns?id=eq.${campaign_id}`, {
      method: 'PATCH', headers,
      body: JSON.stringify({ status: 'scheduled', total_recipients: scheduled })
    });

    return res.status(200).json({ scheduled, total_audience: audience.length, deduplicated: recipients.length });

  } catch (err) {
    console.error('[schedule-campaign] Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
