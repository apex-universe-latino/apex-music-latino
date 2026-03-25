// Vercel Cron Function — Process Email Queue
// Runs every 5 minutes via vercel.json crons config
// Picks up pending scheduled_emails and sends via Resend

export default async function handler(req, res) {
  // Verify cron secret (Vercel sets CRON_SECRET automatically for cron invocations)
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    // Allow manual trigger in dev with service key
    if (req.headers['x-manual-trigger'] !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const SUPABASE_URL = `https://${process.env.SUPABASE_PROJECT_ID || 'iaycaynevtumrqoknemk'}.supabase.co`;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!RESEND_API_KEY || !SUPABASE_KEY) {
    return res.status(500).json({ error: 'Missing RESEND_API_KEY or SUPABASE_SERVICE_ROLE_KEY' });
  }

  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  try {
    // 1. Fetch pending emails ready to send (max 10 per batch)
    const now = new Date().toISOString();
    const fetchUrl = `${SUPABASE_URL}/rest/v1/scheduled_emails?status=eq.pending&send_at=lte.${now}&order=send_at.asc&limit=10`;
    const fetchRes = await fetch(fetchUrl, { headers });

    if (!fetchRes.ok) {
      const err = await fetchRes.text();
      return res.status(500).json({ error: 'Failed to fetch queue: ' + err });
    }

    const pending = await fetchRes.json();

    if (pending.length === 0) {
      return res.status(200).json({ processed: 0, message: 'No pending emails' });
    }

    let sent = 0;
    let failed = 0;
    const errors = [];

    // 2. Process each email
    for (const email of pending) {
      // Mark as sending
      await fetch(`${SUPABASE_URL}/rest/v1/scheduled_emails?id=eq.${email.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: 'sending' })
      });

      try {
        // Send via Resend
        const fromAddress = email.from_label
          ? `${email.from_label} <booking@apexmusiclatino.com>`
          : 'Apex Music Latino <booking@apexmusiclatino.com>';

        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [email.recipient_email],
            subject: email.subject,
            html: email.body_html
          })
        });

        const resendData = await resendRes.json();

        if (resendRes.ok) {
          // Mark as sent
          await fetch(`${SUPABASE_URL}/rest/v1/scheduled_emails?id=eq.${email.id}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({
              status: 'sent',
              resend_message_id: resendData.id,
              sent_at: new Date().toISOString()
            })
          });

          // Record event
          await fetch(`${SUPABASE_URL}/rest/v1/email_events`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              scheduled_email_id: email.id,
              campaign_id: email.campaign_id,
              event_type: 'sent',
              recipient_email: email.recipient_email
            })
          });

          // Update campaign counters
          if (email.campaign_id) {
            await fetch(`${SUPABASE_URL}/rest/v1/rpc/increment_campaign_sent`, {
              method: 'POST',
              headers,
              body: JSON.stringify({ cid: email.campaign_id })
            }).catch(() => {}); // Non-critical if function doesn't exist yet
          }

          sent++;
        } else {
          throw new Error(resendData.message || 'Resend API error');
        }
      } catch (err) {
        // Mark as failed
        await fetch(`${SUPABASE_URL}/rest/v1/scheduled_emails?id=eq.${email.id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({
            status: 'failed',
            error_message: err.message
          })
        });
        failed++;
        errors.push({ id: email.id, email: email.recipient_email, error: err.message });
      }

      // Rate limit: 200ms between sends
      await new Promise(r => setTimeout(r, 200));
    }

    return res.status(200).json({
      processed: pending.length,
      sent,
      failed,
      errors: errors.slice(0, 5),
      next_check: '5 minutes'
    });

  } catch (err) {
    console.error('[cron/process-email-queue] Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
