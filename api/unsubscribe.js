// Vercel Serverless Function — Unsubscribe Handler
// GET /api/unsubscribe?email=user@example.com&token=BASE64_OF_EMAIL&source=show-reminder
//
// SQL to create the unsubscribes table in Supabase:
// -------------------------------------------------
// CREATE TABLE IF NOT EXISTS unsubscribes (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   email TEXT NOT NULL UNIQUE,
//   unsubscribed_at TIMESTAMPTZ DEFAULT now(),
//   source TEXT
// );
// CREATE INDEX idx_unsubscribes_email ON unsubscribes(email);
// -------------------------------------------------

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'GET') {
    return res.status(405).send('Method not allowed');
  }

  const { email, token, source } = req.query;

  if (!email || !token) {
    return res.status(400).send(renderPage('Error', 'Missing email or token parameter.'));
  }

  // Simple verification: token must be base64 of the email
  let decoded;
  try {
    decoded = Buffer.from(token, 'base64').toString('utf-8');
  } catch (e) {
    return res.status(400).send(renderPage('Error', 'Invalid token.'));
  }

  if (decoded.toLowerCase() !== email.toLowerCase()) {
    return res.status(400).send(renderPage('Error', 'Token does not match email.'));
  }

  const SUPABASE_URL = `https://${process.env.SUPABASE_PROJECT_ID || 'iaycaynevtumrqoknemk'}.supabase.co`;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_KEY) {
    return res.status(500).send(renderPage('Error', 'Server configuration error.'));
  }

  try {
    // Upsert into unsubscribes table
    const response = await fetch(`${SUPABASE_URL}/rest/v1/unsubscribes`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        unsubscribed_at: new Date().toISOString(),
        source: source || 'unknown'
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[unsubscribe] Supabase error:', errText);
      return res.status(500).send(renderPage('Error', 'Could not process unsubscription. Please try again later.'));
    }

    return res.status(200).send(renderPage(
      'Unsubscribed',
      'You have been successfully unsubscribed.<br><br>Te has dado de baja exitosamente.<br><br>You will no longer receive emails from Apex Music Latino.<br>Ya no recibirás correos de Apex Music Latino.'
    ));
  } catch (err) {
    console.error('[unsubscribe] Error:', err);
    return res.status(500).send(renderPage('Error', 'Something went wrong. Please try again later.'));
  }
}

function renderPage(title, message) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Apex Music Latino</title>
  <style>
    body { margin:0; padding:40px 20px; background:#0c0c0c; font-family:'Helvetica Neue',Arial,sans-serif; color:#ccc; display:flex; justify-content:center; align-items:center; min-height:100vh; }
    .card { background:#131313; border-radius:16px; padding:48px; max-width:500px; text-align:center; border:1px solid rgba(230,0,0,0.15); }
    h1 { color:#fff; font-size:24px; margin:0 0 16px; }
    p { color:#aaa; font-size:14px; line-height:1.6; margin:0; }
    .logo { width:60px; height:60px; border-radius:50%; border:2px solid #222; filter:invert(1); margin-bottom:16px; }
    a { color:#e60000; text-decoration:none; }
  </style>
</head>
<body>
  <div class="card">
    <img src="https://apexmusiclatino.com/assetts/apex_music_latino_logo.jpg" alt="Apex Music Latino" class="logo" />
    <h1>${title}</h1>
    <p>${message}</p>
    <p style="margin-top:24px;"><a href="https://apexmusiclatino.com">apexmusiclatino.com</a></p>
  </div>
</body>
</html>`;
}
