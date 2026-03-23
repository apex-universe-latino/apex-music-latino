// Vercel Serverless Function — Welcome Email via Resend
// POST /api/send-welcome-email
// Body: { name, email, fan_id, artist_name, artist_slug, genre }

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
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  const { name, email, fan_id, artist_name, artist_slug, genre } = req.body;

  if (!email || !fan_id || !name) {
    return res.status(400).json({ error: 'Missing required fields: name, email, fan_id' });
  }

  // Build the HTML email
  const artistDisplay = artist_name || 'Arcoiris';
  const epkUrl = `https://apexmusiclatino.com/genre/${genre || 'tango'}/${artist_slug || 'arcoiris'}/`;
  const welcomeUrl = `https://apexmusiclatino.com/docs/arcoiris-welcome.html`;

  const htmlEmail = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background:#0c0c0c; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0c0c; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#131313; border-radius:16px; overflow:hidden; border:1px solid rgba(230,0,0,0.15);">

          <!-- Header accent bar -->
          <tr>
            <td style="height:4px; background:linear-gradient(90deg, #e60000, #8b0000);"></td>
          </tr>

          <!-- Logo + Badge -->
          <tr>
            <td style="padding:32px 40px 0 40px; text-align:center;">
              <p style="color:#e60000; font-size:11px; letter-spacing:4px; text-transform:uppercase; font-weight:700; margin:0 0 8px 0;">Apex Music Latino</p>
              <h1 style="color:#ffffff; font-size:28px; font-weight:800; margin:0 0 4px 0; line-height:1.2;">
                ¡Bienvenido al Universo de ${artistDisplay}!
              </h1>
              <p style="color:#888; font-size:13px; margin:0;">Welcome to the ${artistDisplay} Universe</p>
            </td>
          </tr>

          <!-- Fan ID Card -->
          <tr>
            <td style="padding:24px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a; border-radius:12px; border:1px solid rgba(230,0,0,0.2);">
                <tr>
                  <td style="padding:24px; text-align:center;">
                    <p style="color:#888; font-size:10px; letter-spacing:3px; text-transform:uppercase; margin:0 0 8px 0;">Tu Fan ID / Your Fan ID</p>
                    <p style="color:#e60000; font-size:32px; font-weight:800; letter-spacing:3px; margin:0; font-family:'Courier New',monospace;">${fan_id}</p>
                    <p style="color:#666; font-size:11px; margin:8px 0 0 0;">Guarda este número — Save this number</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:0 40px 16px 40px;">
              <p style="color:#ccc; font-size:15px; line-height:1.6; margin:0;">
                Hola <strong style="color:#fff;">${name}</strong>,
              </p>
              <p style="color:#aaa; font-size:14px; line-height:1.6; margin:12px 0 0 0;">
                ¡Felicitaciones! Ya eres parte de la familia ${artistDisplay}. Tu Fan ID es tu pasaporte a beneficios exclusivos, sorteos y acceso anticipado a eventos.
              </p>
              <p style="color:#888; font-size:12px; line-height:1.6; margin:8px 0 0 0; font-style:italic;">
                Congratulations! You're now part of the ${artistDisplay} family. Your Fan ID is your passport to exclusive benefits, giveaways, and early access to events.
              </p>
            </td>
          </tr>

          <!-- Benefits -->
          <tr>
            <td style="padding:0 40px 24px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:12px 16px; background:#1a1a1a; border-radius:8px 8px 0 0; border-bottom:1px solid #222;">
                    <span style="color:#e60000; font-size:16px;">✅</span>
                    <span style="color:#ddd; font-size:13px; margin-left:8px;"><strong>Clase de tango GRATIS</strong> — FREE tango class (hasta 31 de Marzo)</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px; background:#1a1a1a; border-bottom:1px solid #222;">
                    <span style="color:#e60000; font-size:16px;">✅</span>
                    <span style="color:#ddd; font-size:13px; margin-left:8px;"><strong>Curso de 24 pasos de tango</strong> — 24-step tango course (próximamente)</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px; background:#1a1a1a; border-radius:0 0 8px 8px;">
                    <span style="color:#e60000; font-size:16px;">✅</span>
                    <span style="color:#ddd; font-size:13px; margin-left:8px;"><strong>Sorteos exclusivos</strong> — Exclusive giveaways with your Fan ID</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Social Links -->
          <tr>
            <td style="padding:0 40px 24px 40px; text-align:center;">
              <p style="color:#888; font-size:10px; letter-spacing:3px; text-transform:uppercase; margin:0 0 16px 0;">Síguenos / Follow Us</p>
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="padding:0 6px;">
                    <a href="https://instagram.com/arcoiris.tango" style="display:inline-block; background:linear-gradient(135deg, #833AB4, #E1306C, #F77737); color:#fff; padding:10px 18px; border-radius:8px; text-decoration:none; font-size:12px; font-weight:600;">📷 Instagram</a>
                  </td>
                  <td style="padding:0 6px;">
                    <a href="https://youtube.com/@arcoiristango" style="display:inline-block; background:#FF0000; color:#fff; padding:10px 18px; border-radius:8px; text-decoration:none; font-size:12px; font-weight:600;">▶ YouTube</a>
                  </td>
                  <td style="padding:0 6px;">
                    <a href="https://tiktok.com/@arcoiristango" style="display:inline-block; background:#000; color:#fff; padding:10px 18px; border-radius:8px; text-decoration:none; font-size:12px; font-weight:600; border:1px solid #333;">🎵 TikTok</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Buttons -->
          <tr>
            <td style="padding:0 40px 16px 40px;">
              <a href="${epkUrl}" style="display:block; background:linear-gradient(135deg, #e60000, #8b0000); color:#fff; padding:16px; border-radius:12px; text-decoration:none; font-size:15px; font-weight:700; text-align:center; letter-spacing:0.5px;">
                Explorar el EPK de ${artistDisplay} →
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 32px 40px;">
              <a href="${welcomeUrl}" style="display:block; background:#1a1a1a; color:#e60000; padding:14px; border-radius:12px; text-decoration:none; font-size:13px; font-weight:600; text-align:center; border:1px solid rgba(230,0,0,0.2);">
                📄 Descargar Welcome Kit / Download Welcome Kit
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px; background:#0c0c0c; border-top:1px solid #222; text-align:center;">
              <p style="color:#555; font-size:11px; margin:0 0 4px 0;">
                <strong style="color:#888;">Apex Music Latino</strong> — A Datos Maestros Company
              </p>
              <p style="color:#444; font-size:10px; margin:0 0 4px 0;">
                NIT: 9013995485 · Tel: +57 318 717 3584
              </p>
              <p style="color:#444; font-size:10px; margin:0 0 8px 0;">
                Powered by CUBO Data Engine
              </p>
              <p style="color:#444; font-size:9px; margin:0;">
                Recibiste este email porque te registraste en apexmusiclatino.com ·
                You received this email because you registered at apexmusiclatino.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Apex Music Latino <noreply@apexmusiclatino.com>',
        to: [email],
        subject: `🎵 ¡Bienvenido al Universo de ${artistDisplay}! Tu Fan ID: ${fan_id}`,
        html: htmlEmail,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({ success: true, id: data.id });
    } else {
      console.error('Resend error:', data);
      return res.status(response.status).json({ error: data.message || 'Email send failed' });
    }
  } catch (err) {
    console.error('Email send error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
