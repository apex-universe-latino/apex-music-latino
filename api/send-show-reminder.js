// Vercel Serverless Function — Send Show Reminder
// GET /api/send-show-reminder?step=1&key=arcoiris2026
// Step 1 = 8AM morning excitement
// Step 2 = 12PM midday countdown
// Step 3 = 3PM final reminder
// Also: GET /api/send-show-reminder?step=test&key=arcoiris2026&email=your@email.com

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { step, key, email: testEmail } = req.query;

  // Simple auth key to prevent random hits
  if (key !== 'arcoiris2026') {
    return res.status(401).json({ error: 'Invalid key' });
  }

  if (!step || !['1', '2', '3', 'test'].includes(step)) {
    return res.status(400).json({ error: 'Missing step param. Use ?step=1, ?step=2, ?step=3, or ?step=test&email=you@email.com' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const SUPABASE_URL = `https://${process.env.SUPABASE_PROJECT_ID || 'iaycaynevtumrqoknemk'}.supabase.co`;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!RESEND_API_KEY || !SUPABASE_KEY) {
    return res.status(500).json({ error: 'Missing RESEND_API_KEY or SUPABASE_SERVICE_ROLE_KEY' });
  }

  // Email templates per step
  const templates = {
    '1': {
      subject: '🎵 ¡Esta noche! Arcoiris en vivo — Casa del Libro Total, 5:30 PM',
      build: (name) => `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0c0c0c;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0c0c;padding:40px 20px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:16px;overflow:hidden;border:1px solid rgba(230,0,0,0.15);">
<tr><td style="height:4px;background:linear-gradient(90deg,#e60000,#8b0000);"></td></tr>
<tr><td style="padding:32px 40px 0;text-align:center;">
<p style="color:#e60000;font-size:11px;letter-spacing:4px;text-transform:uppercase;font-weight:700;margin:0 0 8px;">🎵 ESTA NOCHE</p>
<h1 style="color:#fff;font-size:28px;font-weight:800;margin:0 0 4px;line-height:1.2;">Arcoiris en Vivo</h1>
<p style="color:#888;font-size:13px;margin:0;">Casa del Libro Total · Bucaramanga</p>
</td></tr>
<tr><td style="padding:24px 40px;">
<table width="100%" style="background:#1a1a1a;border-radius:12px;border:1px solid rgba(230,0,0,0.2);">
<tr><td style="padding:24px;text-align:center;">
<p style="color:#888;font-size:10px;letter-spacing:3px;text-transform:uppercase;margin:0 0 8px;">HOY · MARZO 26, 2026</p>
<p style="color:#e60000;font-size:48px;font-weight:800;margin:0;">5:30 PM</p>
<p style="color:#aaa;font-size:13px;margin:8px 0 0;">Cra 35 #9-81, Centro, Bucaramanga</p>
</td></tr></table>
</td></tr>
<tr><td style="padding:0 40px 16px;">
<p style="color:#ccc;font-size:15px;line-height:1.6;margin:0;">Hola <strong style="color:#fff;">${name}</strong>,</p>
<p style="color:#aaa;font-size:14px;line-height:1.6;margin:12px 0 0;">¡Hoy es el día! Te esperamos esta noche para una experiencia única de tango contemporáneo con <strong style="color:#fff;">Arcoiris</strong>. John Acevedo, Alisson Trigos y el ensamble completo te esperan.</p>
<p style="color:#888;font-size:12px;margin:8px 0 0;font-style:italic;">Tonight is the night! Join us for an unforgettable contemporary tango experience.</p>
</td></tr>
<tr><td style="padding:0 40px 16px;">
<a href="https://maps.google.com/?q=Casa+del+Libro+Total+Bucaramanga+Cra+35+9-81" style="display:block;background:linear-gradient(135deg,#e60000,#8b0000);color:#fff;padding:16px;border-radius:12px;text-decoration:none;font-size:15px;font-weight:700;text-align:center;">📍 Ver Ubicación en Google Maps</a>
</td></tr>
<tr><td style="padding:0 40px 32px;text-align:center;">
<p style="color:#666;font-size:12px;margin:0;">Recuerda: tu clase gratis de tango te espera 🎶</p>
<a href="https://apexmusiclatino.com/genre/tango/arcoiris/" style="color:#e60000;font-size:13px;text-decoration:none;">Ver EPK de Arcoiris →</a>
</td></tr>
<tr><td style="padding:32px 40px;background:#0c0c0c;border-top:1px solid #222;text-align:center;">
<img src="https://apexmusiclatino.com/assetts/apex_music_latino_logo.jpg" alt="Apex Music Latino" width="80" height="80" style="border-radius:50%;margin-bottom:12px;border:2px solid #222;filter:invert(1);" />
<p style="color:#666;font-size:11px;margin:0 0 4px;"><strong style="color:#999;">Apex Music Latino</strong></p>
<p style="color:#555;font-size:10px;margin:0 0 4px;">Powered by CUBO Data Engine</p>
<p style="color:#444;font-size:9px;margin:0;">Recibiste este email porque te registraste en apexmusiclatino.com</p>
<p style="margin:12px 0 0;"><a href="https://apexmusiclatino.com" style="color:#e60000;font-size:10px;text-decoration:none;font-weight:600;">apexmusiclatino.com</a></p>
</td></tr>
</table></td></tr></table></body></html>`
    },
    '2': {
      subject: '⏰ Faltan 5 horas — Arcoiris LIVE en Bucaramanga',
      build: (name) => `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0c0c0c;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0c0c;padding:40px 20px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:16px;overflow:hidden;border:1px solid rgba(230,0,0,0.15);">
<tr><td style="height:4px;background:linear-gradient(90deg,#e60000,#8b0000);"></td></tr>
<tr><td style="padding:32px 40px;text-align:center;">
<p style="color:#e60000;font-size:48px;font-weight:800;margin:0;">⏰</p>
<h1 style="color:#fff;font-size:24px;font-weight:800;margin:12px 0 4px;">Faltan 5 horas</h1>
<p style="color:#aaa;font-size:15px;margin:0;">Arcoiris LIVE en Bucaramanga</p>
</td></tr>
<tr><td style="padding:0 40px 24px;">
<p style="color:#ccc;font-size:15px;line-height:1.6;margin:0;">${name}, la cuenta regresiva comenzó.</p>
<p style="color:#aaa;font-size:14px;line-height:1.6;margin:12px 0 0;">📍 <strong style="color:#fff;">Casa del Libro Total</strong> — Cra 35 #9-81, Centro<br>🕐 <strong style="color:#fff;">5:30 PM</strong><br>🎻 John Acevedo, Alisson Trigos y el ensamble Arcoiris</p>
<p style="color:#888;font-size:12px;margin:16px 0 0;font-style:italic;">The countdown is on. 5 hours until Arcoiris takes the stage!</p>
</td></tr>
<tr><td style="padding:0 40px 16px;">
<table width="100%" cellpadding="0" cellspacing="0"><tr>
<td width="48%" style="padding-right:8px;">
<a href="https://maps.google.com/?q=Casa+del+Libro+Total+Bucaramanga+Cra+35+9-81" style="display:block;background:#1a1a1a;color:#e60000;padding:14px;border-radius:12px;text-decoration:none;font-size:13px;font-weight:600;text-align:center;border:1px solid rgba(230,0,0,0.2);">📍 Cómo Llegar</a>
</td>
<td width="48%" style="padding-left:8px;">
<a href="https://apexmusiclatino.com/genre/tango/arcoiris/" style="display:block;background:linear-gradient(135deg,#e60000,#8b0000);color:#fff;padding:14px;border-radius:12px;text-decoration:none;font-size:13px;font-weight:700;text-align:center;">🎵 Ver Artistas</a>
</td>
</tr></table>
</td></tr>
<tr><td style="padding:8px 40px 32px;text-align:center;">
<p style="color:#666;font-size:12px;margin:0;">¿Vienes con amigos? Comparte 👇</p>
<p style="margin:8px 0 0;">
<a href="https://wa.me/?text=Hoy%20Arcoiris%20en%20vivo%20en%20Casa%20del%20Libro%20Total%2C%205%3A30%20PM%20%F0%9F%8E%BB%20https%3A%2F%2Fapexmusiclatino.com%2Fgenre%2Ftango%2Farcoiris%2F" style="color:#25d366;font-size:13px;text-decoration:none;font-weight:600;">WhatsApp</a>
<span style="color:#333;"> · </span>
<a href="https://instagram.com/arcoiris.tango" style="color:#e1306c;font-size:13px;text-decoration:none;font-weight:600;">Instagram</a>
</p>
</td></tr>
<tr><td style="padding:32px 40px;background:#0c0c0c;border-top:1px solid #222;text-align:center;">
<img src="https://apexmusiclatino.com/assetts/apex_music_latino_logo.jpg" alt="Apex Music Latino" width="80" height="80" style="border-radius:50%;margin-bottom:12px;border:2px solid #222;filter:invert(1);" />
<p style="color:#666;font-size:11px;margin:0 0 4px;"><strong style="color:#999;">Apex Music Latino</strong></p>
<p style="color:#555;font-size:10px;margin:0 0 4px;">Powered by CUBO Data Engine</p>
<p style="color:#444;font-size:9px;margin:0;">Recibiste este email porque te registraste en apexmusiclatino.com</p>
<p style="margin:12px 0 0;"><a href="https://apexmusiclatino.com" style="color:#e60000;font-size:10px;text-decoration:none;font-weight:600;">apexmusiclatino.com</a></p>
</td></tr>
</table></td></tr></table></body></html>`
    },
    '3': {
      subject: '🔥 2.5 horas para Arcoiris — ¡puertas abren pronto!',
      build: (name) => `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0c0c0c;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0c0c;padding:40px 20px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:16px;overflow:hidden;border:1px solid rgba(230,0,0,0.15);">
<tr><td style="height:4px;background:linear-gradient(90deg,#e60000,#8b0000);"></td></tr>
<tr><td style="padding:32px 40px;text-align:center;">
<p style="color:#e60000;font-size:56px;font-weight:800;margin:0;">🔥</p>
<h1 style="color:#fff;font-size:22px;font-weight:800;margin:12px 0 4px;">¡EN 2 HORAS Y MEDIA!</h1>
<p style="color:#aaa;font-size:14px;margin:0;">Puertas abren pronto — no te lo pierdas</p>
</td></tr>
<tr><td style="padding:0 40px 24px;">
<p style="color:#ccc;font-size:15px;line-height:1.6;margin:0;">${name}, ya casi es hora.</p>
<table width="100%" style="margin:16px 0;"><tr><td style="padding:12px 16px;border-bottom:1px solid #222;">
<span style="color:#e60000;font-weight:700;">📍 LUGAR</span><br><span style="color:#fff;">Casa del Libro Total — Cra 35 #9-81, Centro</span>
</td></tr><tr><td style="padding:12px 16px;border-bottom:1px solid #222;">
<span style="color:#e60000;font-weight:700;">🕐 HORA</span><br><span style="color:#fff;">5:30 PM</span>
</td></tr><tr><td style="padding:12px 16px;">
<span style="color:#e60000;font-weight:700;">🎻 ARTISTAS</span><br><span style="color:#fff;">John Acevedo, Alisson Trigos, y el ensamble Arcoiris</span>
</td></tr></table>
<p style="color:#888;font-size:12px;margin:0;font-style:italic;">2.5 hours to go! Doors open soon. See you there!</p>
</td></tr>
<tr><td style="padding:0 40px 16px;">
<a href="https://maps.google.com/?q=Casa+del+Libro+Total+Bucaramanga+Cra+35+9-81" style="display:block;background:linear-gradient(135deg,#e60000,#8b0000);color:#fff;padding:16px;border-radius:12px;text-decoration:none;font-size:15px;font-weight:700;text-align:center;">📍 ABRIR GOOGLE MAPS</a>
</td></tr>
<tr><td style="padding:8px 40px 32px;text-align:center;">
<p style="color:#666;font-size:11px;margin:0;">Presenta tu Fan ID en la entrada para beneficios exclusivos 🎶</p>
</td></tr>
<tr><td style="padding:32px 40px;background:#0c0c0c;border-top:1px solid #222;text-align:center;">
<img src="https://apexmusiclatino.com/assetts/apex_music_latino_logo.jpg" alt="Apex Music Latino" width="80" height="80" style="border-radius:50%;margin-bottom:12px;border:2px solid #222;filter:invert(1);" />
<p style="color:#666;font-size:11px;margin:0 0 4px;"><strong style="color:#999;">Apex Music Latino</strong></p>
<p style="color:#555;font-size:10px;margin:0 0 4px;">Powered by CUBO Data Engine</p>
<p style="color:#444;font-size:9px;margin:0;">Recibiste este email porque te registraste en apexmusiclatino.com</p>
<p style="margin:12px 0 0;"><a href="https://apexmusiclatino.com" style="color:#e60000;font-size:10px;text-decoration:none;font-weight:600;">apexmusiclatino.com</a></p>
</td></tr>
</table></td></tr></table></body></html>`
    }
  };

  try {
    // Fetch all Arcoiris leads
    const leadsUrl = `${SUPABASE_URL}/rest/v1/leads_capture?artist_name=eq.Arcoiris&select=email,mood_preference&order=created_at.desc`;
    const leadsRes = await fetch(leadsUrl, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    const leads = await leadsRes.json();

    // Deduplicate
    const seen = new Set();
    const unique = leads.filter(l => {
      const e = (l.email || '').toLowerCase().trim();
      if (!e || seen.has(e)) return false;
      seen.add(e);
      return true;
    });

    // If test mode, only send to test email
    const recipients = step === 'test'
      ? [{ email: testEmail, mood_preference: { name: 'Test User' } }]
      : unique;

    const template = templates[step === 'test' ? '1' : step];
    let sent = 0;
    let failed = 0;
    const errors = [];

    for (const lead of recipients) {
      const mp = typeof lead.mood_preference === 'string' ? JSON.parse(lead.mood_preference || '{}') : (lead.mood_preference || {});
      const name = mp.name || mp.fan_name || 'Fan';

      try {
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Arcoiris <booking@apexmusiclatino.com>',
            to: [lead.email],
            subject: template.subject,
            html: template.build(name)
          })
        });

        const data = await emailRes.json();
        if (emailRes.ok) {
          sent++;
        } else {
          failed++;
          errors.push({ email: lead.email, error: data.message });
        }
      } catch (err) {
        failed++;
        errors.push({ email: lead.email, error: err.message });
      }

      // Rate limit
      await new Promise(r => setTimeout(r, 200));
    }

    return res.status(200).json({
      step: step === 'test' ? 'test' : parseInt(step),
      sent,
      failed,
      total_recipients: recipients.length,
      errors: errors.slice(0, 5)
    });

  } catch (err) {
    console.error('[send-show-reminder] Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
