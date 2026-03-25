// Vercel Serverless Function — Schedule Multi-Step Journey via Resend Native Scheduling
// POST /api/schedule-journey
// Body: {
//   artist_slug, journey_type, recipients: [{ email, name, company_name }],
//   base_time, steps: [{ delay_hours, step }]
// }
// - Schedules an entire journey sequence for all recipients
// - Each step is offset from base_time by delay_hours
// - Uses Resend's scheduled_at for delivery (up to 72h window)
// - Steps beyond 72h are logged as 'pending_reschedule' for later pickup
//
// TODO: For journeys > 72 hours, build a lightweight re-scheduler that runs daily
//       to pick up 'pending_reschedule' rows and schedule them with Resend when
//       they fall within the 72h window. This replaces the old cron-based queue
//       with a much simpler "promote to Resend" pattern.

export default async function handler(req, res) {
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

  const { artist_slug, journey_type, recipients, base_time, steps } = req.body;

  // Validation
  if (!artist_slug) return res.status(400).json({ error: 'Missing artist_slug' });
  if (!journey_type || !['fan_nurture', 'venue_outreach', 'show_reminder'].includes(journey_type)) {
    return res.status(400).json({ error: 'Invalid journey_type. Must be: fan_nurture, venue_outreach, or show_reminder' });
  }
  if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({ error: 'recipients must be a non-empty array' });
  }
  if (!base_time) return res.status(400).json({ error: 'Missing base_time (ISO 8601 timestamp)' });
  if (!steps || !Array.isArray(steps) || steps.length === 0) {
    return res.status(400).json({ error: 'steps must be a non-empty array of { delay_hours, step }' });
  }

  const baseDate = new Date(base_time);
  if (isNaN(baseDate.getTime())) {
    return res.status(400).json({ error: 'Invalid base_time format. Use ISO 8601.' });
  }

  const sbHeaders = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  try {
    // 1. Fetch unsubscribes to filter out opted-out recipients
    const unsubRes = await fetch(
      `${SUPABASE_URL}/rest/v1/unsubscribes?select=email`,
      { headers: sbHeaders }
    );
    const unsubSet = new Set();
    if (unsubRes.ok) {
      const unsubs = await unsubRes.json();
      unsubs.forEach(u => unsubSet.add((u.email || '').toLowerCase()));
    }

    // Filter and deduplicate recipients
    const seen = new Set();
    const validRecipients = recipients.filter(r => {
      const email = (r.email || '').toLowerCase().trim();
      if (!email || seen.has(email) || unsubSet.has(email)) return false;
      seen.add(email);
      return true;
    });

    if (validRecipients.length === 0) {
      return res.status(200).json({
        total_scheduled: 0,
        recipients: 0,
        steps: steps.length,
        message: 'All recipients are unsubscribed or invalid'
      });
    }

    // 2. Process each recipient x step combination
    const now = new Date();
    const MAX_RESEND_HOURS = 72;

    let totalScheduled = 0;
    let totalDeferred = 0;
    let totalFailed = 0;
    const errors = [];

    // Determine the internal endpoint base URL for generating content
    // In Vercel, we can call our own functions via the VERCEL_URL
    const selfBaseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://apexmusiclatino.com';

    for (const stepDef of steps) {
      const sendAt = new Date(baseDate.getTime() + stepDef.delay_hours * 60 * 60 * 1000);
      const hoursFromNow = (sendAt - now) / (1000 * 60 * 60);
      const withinResendWindow = hoursFromNow > 0 && hoursFromNow <= MAX_RESEND_HOURS;

      for (const recipient of validRecipients) {
        try {
          // Generate email content based on journey type
          const emailContent = await generateStepContent({
            journey_type,
            step: stepDef.step,
            artist_slug,
            recipient,
            selfBaseUrl,
            sbHeaders,
            SUPABASE_URL
          });

          const fromAddress = emailContent.from_label
            ? `${emailContent.from_label} <booking@apexmusiclatino.com>`
            : 'Apex Music Latino <booking@apexmusiclatino.com>';

          if (withinResendWindow) {
            // Schedule via Resend natively
            const resendPayload = {
              from: fromAddress,
              to: [recipient.email],
              subject: emailContent.subject,
              html: emailContent.html,
              scheduled_at: sendAt.toISOString()
            };

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

            // Log to scheduled_emails
            await logToScheduledEmails(SUPABASE_URL, sbHeaders, {
              recipient_email: recipient.email,
              recipient_name: recipient.name || recipient.company_name || null,
              subject: emailContent.subject,
              body_html: emailContent.html,
              from_label: emailContent.from_label || null,
              artist_slug,
              campaign_type: journey_type,
              journey_step: stepDef.step,
              resend_message_id: resendData.id,
              send_at: sendAt.toISOString(),
              status: 'scheduled',
              scheduling_method: 'resend_native'
            });

            totalScheduled++;
          } else if (hoursFromNow > MAX_RESEND_HOURS) {
            // Beyond 72h window — save to DB for later re-scheduling
            // TODO: A daily cron should pick up 'pending_reschedule' rows
            //       that are now within the 72h window and schedule them with Resend
            await logToScheduledEmails(SUPABASE_URL, sbHeaders, {
              recipient_email: recipient.email,
              recipient_name: recipient.name || recipient.company_name || null,
              subject: emailContent.subject,
              body_html: emailContent.html,
              from_label: emailContent.from_label || null,
              artist_slug,
              campaign_type: journey_type,
              journey_step: stepDef.step,
              resend_message_id: null,
              send_at: sendAt.toISOString(),
              status: 'pending_reschedule',
              scheduling_method: 'deferred'
            });

            totalDeferred++;
          } else {
            // send_at is in the past — skip
            totalFailed++;
            errors.push({ email: recipient.email, step: stepDef.step, error: 'send_at is in the past' });
          }

          // Rate limit: 100ms between Resend API calls
          if (withinResendWindow) {
            await new Promise(r => setTimeout(r, 100));
          }

        } catch (err) {
          totalFailed++;
          errors.push({ email: recipient.email, step: stepDef.step, error: err.message });
        }
      }
    }

    return res.status(200).json({
      total_scheduled: totalScheduled,
      total_deferred: totalDeferred,
      total_failed: totalFailed,
      recipients: validRecipients.length,
      steps: steps.length,
      skipped_unsubscribed: recipients.length - validRecipients.length,
      errors: errors.slice(0, 10)
    });

  } catch (err) {
    console.error('[schedule-journey] Error:', err);
    return res.status(500).json({ error: err.message });
  }
}

// ─────────────────────────────────────────────────────────────
// Generate email content for a journey step
// ─────────────────────────────────────────────────────────────
async function generateStepContent({ journey_type, step, artist_slug, recipient, selfBaseUrl, sbHeaders, SUPABASE_URL }) {
  const name = recipient.name || recipient.company_name || 'Fan';

  if (journey_type === 'venue_outreach') {
    // Use the generate-outreach endpoint for venue content
    try {
      const genRes = await fetch(`${selfBaseUrl}/api/generate-outreach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venue_name: recipient.company_name || name,
          category: recipient.category || 'Event Venues',
          city: recipient.city || 'Bucaramanga',
          artist_name: artistSlugToName(artist_slug),
          artist_genre: 'tango',
          epk_url: `https://apexmusiclatino.com/genre/tango/${artist_slug}/`,
          tone: 'professional',
          step
        })
      });

      if (genRes.ok) {
        const data = await genRes.json();
        return {
          subject: data.subject,
          html: data.body_html,
          from_label: 'Ariel Hanasi — Apex Music Latino'
        };
      }
    } catch (e) {
      console.error('[schedule-journey] generate-outreach call failed, using fallback:', e.message);
    }

    // Fallback: simple template
    return {
      subject: `${artistSlugToName(artist_slug)} — Step ${step} for ${name}`,
      html: buildFallbackHtml(name, step, artist_slug),
      from_label: 'Ariel Hanasi — Apex Music Latino'
    };
  }

  if (journey_type === 'show_reminder') {
    // Show reminder steps (1 = morning, 2 = midday, 3 = final)
    const stepLabels = {
      1: { subject: `Esta noche! ${artistSlugToName(artist_slug)} en vivo`, prefix: 'Hoy es el dia!' },
      2: { subject: `Faltan pocas horas — ${artistSlugToName(artist_slug)} LIVE`, prefix: 'La cuenta regresiva comenzo.' },
      3: { subject: `Ya casi! — ${artistSlugToName(artist_slug)}, puertas abren pronto`, prefix: 'Ya casi es hora.' }
    };
    const label = stepLabels[step] || stepLabels[1];

    return {
      subject: label.subject,
      html: buildShowReminderHtml(name, step, artist_slug, label.prefix),
      from_label: artistSlugToName(artist_slug)
    };
  }

  if (journey_type === 'fan_nurture') {
    // Fan nurture journey
    const nurtureSeries = {
      1: { subject: `Bienvenido/a a la comunidad de ${artistSlugToName(artist_slug)}`, tone: 'welcome' },
      2: { subject: `Conoce la historia de ${artistSlugToName(artist_slug)}`, tone: 'story' },
      3: { subject: `Nuevo contenido exclusivo — ${artistSlugToName(artist_slug)}`, tone: 'content' },
      4: { subject: `Proximos shows de ${artistSlugToName(artist_slug)}`, tone: 'events' },
      5: { subject: `Gracias por ser parte — ${artistSlugToName(artist_slug)}`, tone: 'gratitude' }
    };
    const series = nurtureSeries[step] || nurtureSeries[1];

    return {
      subject: series.subject,
      html: buildFanNurtureHtml(name, step, artist_slug, series.tone),
      from_label: artistSlugToName(artist_slug)
    };
  }

  // Generic fallback
  return {
    subject: `${artistSlugToName(artist_slug)} — Update ${step}`,
    html: buildFallbackHtml(name, step, artist_slug),
    from_label: 'Apex Music Latino'
  };
}

// ─────────────────────────────────────────────────────────────
// Log email to scheduled_emails table
// ─────────────────────────────────────────────────────────────
async function logToScheduledEmails(supabaseUrl, headers, row) {
  try {
    await fetch(`${supabaseUrl}/rest/v1/scheduled_emails`, {
      method: 'POST',
      headers,
      body: JSON.stringify(row)
    });
  } catch (err) {
    console.error('[schedule-journey] Failed to log to scheduled_emails:', err.message);
  }
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function artistSlugToName(slug) {
  const map = { arcoiris: 'Arcoiris' };
  return map[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
}

function buildFallbackHtml(name, step, artist_slug) {
  const artistName = artistSlugToName(artist_slug);
  const epkUrl = `https://apexmusiclatino.com/genre/tango/${artist_slug}/`;

  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0c0c0c;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0c0c;padding:40px 20px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:16px;overflow:hidden;border:1px solid rgba(230,0,0,0.15);">
<tr><td style="height:4px;background:linear-gradient(90deg,#e60000,#8b0000);"></td></tr>
<tr><td style="padding:32px 40px 0;">
<p style="color:#ccc;font-size:15px;line-height:1.6;margin:0;">Hola <strong style="color:#fff;">${name}</strong>,</p>
<p style="color:#aaa;font-size:14px;line-height:1.7;margin:16px 0 0;">Le escribimos desde Apex Music Latino con una actualización sobre <strong style="color:#fff;">${artistName}</strong>.</p>
</td></tr>
<tr><td style="padding:16px 40px 24px;">
<a href="${epkUrl}" style="display:block;background:linear-gradient(135deg,#e60000,#8b0000);color:#fff;padding:16px;border-radius:12px;text-decoration:none;font-size:15px;font-weight:700;text-align:center;">Ver EPK de ${artistName} &rarr;</a>
</td></tr>
<tr><td style="padding:32px 40px;background:#0c0c0c;border-top:1px solid #222;text-align:center;">
<img src="https://apexmusiclatino.com/assetts/apex_music_latino_logo.jpg" alt="Apex Music Latino" width="60" height="60" style="border-radius:50%;margin-bottom:12px;border:2px solid #222;filter:invert(1);" />
<p style="color:#666;font-size:11px;margin:0 0 4px;"><strong style="color:#999;">Apex Music Latino</strong></p>
<p style="color:#555;font-size:10px;margin:0 0 4px;">Booking & Management</p>
<p style="color:#444;font-size:9px;margin:0;">booking@apexmusiclatino.com</p>
</td></tr>
</table></td></tr></table></body></html>`;
}

function buildShowReminderHtml(name, step, artist_slug, prefix) {
  const artistName = artistSlugToName(artist_slug);
  const epkUrl = `https://apexmusiclatino.com/genre/tango/${artist_slug}/`;

  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0c0c0c;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0c0c;padding:40px 20px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:16px;overflow:hidden;border:1px solid rgba(230,0,0,0.15);">
<tr><td style="height:4px;background:linear-gradient(90deg,#e60000,#8b0000);"></td></tr>
<tr><td style="padding:32px 40px;text-align:center;">
<p style="color:#e60000;font-size:11px;letter-spacing:4px;text-transform:uppercase;font-weight:700;margin:0 0 8px;">SHOW REMINDER</p>
<h1 style="color:#fff;font-size:28px;font-weight:800;margin:0 0 4px;">${artistName} en Vivo</h1>
</td></tr>
<tr><td style="padding:0 40px 24px;">
<p style="color:#ccc;font-size:15px;line-height:1.6;margin:0;">Hola <strong style="color:#fff;">${name}</strong>,</p>
<p style="color:#aaa;font-size:14px;line-height:1.7;margin:12px 0 0;">${prefix} Te esperamos para una experiencia unica con <strong style="color:#fff;">${artistName}</strong>.</p>
</td></tr>
<tr><td style="padding:0 40px 16px;">
<a href="${epkUrl}" style="display:block;background:linear-gradient(135deg,#e60000,#8b0000);color:#fff;padding:16px;border-radius:12px;text-decoration:none;font-size:15px;font-weight:700;text-align:center;">Ver Detalles del Show &rarr;</a>
</td></tr>
<tr><td style="padding:32px 40px;background:#0c0c0c;border-top:1px solid #222;text-align:center;">
<img src="https://apexmusiclatino.com/assetts/apex_music_latino_logo.jpg" alt="Apex Music Latino" width="60" height="60" style="border-radius:50%;margin-bottom:12px;border:2px solid #222;filter:invert(1);" />
<p style="color:#666;font-size:11px;margin:0 0 4px;"><strong style="color:#999;">Apex Music Latino</strong></p>
<p style="color:#555;font-size:10px;margin:0;">Powered by CUBO Data Engine</p>
</td></tr>
</table></td></tr></table></body></html>`;
}

function buildFanNurtureHtml(name, step, artist_slug, tone) {
  const artistName = artistSlugToName(artist_slug);
  const epkUrl = `https://apexmusiclatino.com/genre/tango/${artist_slug}/`;

  const toneMessages = {
    welcome: `Bienvenido/a a la comunidad de ${artistName}! Estamos emocionados de tenerte.`,
    story: `Queremos compartir contigo la historia detras de ${artistName} — como nacio este proyecto y hacia donde vamos.`,
    content: `Tenemos contenido exclusivo para ti — videos, fotos del backstage y mas de ${artistName}.`,
    events: `No te pierdas los proximos shows de ${artistName}. Aqui te dejamos las fechas.`,
    gratitude: `Gracias por ser parte de este viaje. Tu apoyo significa todo para ${artistName}.`
  };

  const message = toneMessages[tone] || toneMessages.welcome;

  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0c0c0c;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0c0c;padding:40px 20px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:16px;overflow:hidden;border:1px solid rgba(230,0,0,0.15);">
<tr><td style="height:4px;background:linear-gradient(90deg,#e60000,#8b0000);"></td></tr>
<tr><td style="padding:32px 40px 0;">
<p style="color:#ccc;font-size:15px;line-height:1.6;margin:0;">Hola <strong style="color:#fff;">${name}</strong>,</p>
<p style="color:#aaa;font-size:14px;line-height:1.7;margin:16px 0 0;">${message}</p>
</td></tr>
<tr><td style="padding:16px 40px 24px;">
<a href="${epkUrl}" style="display:block;background:linear-gradient(135deg,#e60000,#8b0000);color:#fff;padding:16px;border-radius:12px;text-decoration:none;font-size:15px;font-weight:700;text-align:center;">Descubrir ${artistName} &rarr;</a>
</td></tr>
<tr><td style="padding:32px 40px;background:#0c0c0c;border-top:1px solid #222;text-align:center;">
<img src="https://apexmusiclatino.com/assetts/apex_music_latino_logo.jpg" alt="Apex Music Latino" width="60" height="60" style="border-radius:50%;margin-bottom:12px;border:2px solid #222;filter:invert(1);" />
<p style="color:#666;font-size:11px;margin:0 0 4px;"><strong style="color:#999;">Apex Music Latino</strong></p>
<p style="color:#555;font-size:10px;margin:0;">Powered by CUBO Data Engine</p>
</td></tr>
</table></td></tr></table></body></html>`;
}
