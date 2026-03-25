// Vercel Serverless Function — Booking Notification
// POST /api/send-booking-notification
// Sends a notification email to booking@apexmusiclatino.com when a new booking inquiry arrives.
// Also saves the booking to Supabase leads_capture via service role key.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://apexmusiclatino.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const SUPABASE_URL = `https://${process.env.SUPABASE_PROJECT_ID || 'iaycaynevtumrqoknemk'}.supabase.co`;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'RESEND_API_KEY not configured' });
  }

  const { name, email, phone, organization, event_type, message, artist, timestamp } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Missing required fields: name, email' });
  }

  const ts = timestamp || new Date().toISOString();

  // 1. Save to Supabase leads_capture (server-side with service key)
  if (SUPABASE_KEY) {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/leads_capture`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          artist_name: artist || 'Arcoiris',
          genre: 'tango',
          email: email,
          mood_preference: {
            name,
            phone: phone || '',
            title: organization || '',
            source: 'booking_form',
            event_type: event_type || '',
            message: message || '',
            timestamp: ts
          },
          marketing_source: 'EPK_BOOKING',
          source: 'booking_form'
        })
      });
    } catch (e) {
      console.error('[booking-notification] Supabase save error:', e.message);
    }
  }

  // 2. Send notification email to booking@
  const notificationHtml = `<div style="font-family:Arial;max-width:600px;background:#131313;color:#ccc;padding:32px;border-radius:16px;border:1px solid rgba(230,0,0,0.15);">
    <h2 style="color:#e60000;margin:0 0 16px;">New Booking Request</h2>
    <p><strong style="color:#fff;">Name:</strong> ${escHtml(name)}</p>
    <p><strong style="color:#fff;">Email:</strong> ${escHtml(email)}</p>
    <p><strong style="color:#fff;">Phone:</strong> ${escHtml(phone || 'N/A')}</p>
    <p><strong style="color:#fff;">Organization:</strong> ${escHtml(organization || 'N/A')}</p>
    <p><strong style="color:#fff;">Type:</strong> ${escHtml(event_type || 'N/A')}</p>
    <p><strong style="color:#fff;">Message:</strong></p>
    <p style="background:#0c0c0c;padding:16px;border-radius:8px;border:1px solid #222;">${escHtml(message || '')}</p>
    <p style="margin-top:24px;font-size:11px;color:#666;">Source: EPK Booking Form | ${ts}</p>
  </div>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Booking Alert <booking@apexmusiclatino.com>',
        to: ['booking@apexmusiclatino.com'],
        subject: `New Booking Inquiry: ${event_type || 'General'} — ${name}`,
        html: notificationHtml,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      return res.status(200).json({ success: true, id: data.id });
    } else {
      return res.status(500).json({ error: data.message || 'Email send failed' });
    }
  } catch (err) {
    console.error('[booking-notification] Email error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function escHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
