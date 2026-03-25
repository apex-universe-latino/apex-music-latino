// Vercel Serverless Function — Supabase Proxy
// POST /api/supabase-proxy
// Body: { path: "/rest/v1/...", method: "GET"|"POST"|"PATCH"|"DELETE", body?: {...}, artist_slug: "arcoiris" }
//
// This proxy keeps the Supabase SERVICE_ROLE_KEY server-side only.
// The frontend sends requests here instead of directly to Supabase with the service key.
// Auth: the request must include an artist_slug that matches a valid ARTISTS config entry.

const VALID_ARTISTS = ['arcoiris', 'joey-b', 'andrade', 'onboarding'];

// Allowlist of path prefixes that the proxy can access
const ALLOWED_PATHS = [
  '/rest/v1/leads_capture',
  '/rest/v1/artists_config',
  '/rest/v1/email_campaigns',
  '/rest/v1/scheduled_emails',
  '/rest/v1/venue_leads',
  '/rest/v1/email_events',
  '/rest/v1/unsubscribes',
];

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://apexmusiclatino.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const SUPABASE_URL = `https://${process.env.SUPABASE_PROJECT_ID || 'iaycaynevtumrqoknemk'}.supabase.co`;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SERVICE_KEY) {
    return res.status(500).json({ error: 'SUPABASE_SERVICE_ROLE_KEY not configured' });
  }

  const { path, method, body, artist_slug, prefer } = req.body;

  if (!path || !method) {
    return res.status(400).json({ error: 'Missing required fields: path, method' });
  }

  // Session check: artist_slug must be a valid artist
  if (!artist_slug || !VALID_ARTISTS.includes(artist_slug)) {
    return res.status(401).json({ error: 'Invalid or missing artist_slug. Access denied.' });
  }

  // Validate path against allowlist
  const pathAllowed = ALLOWED_PATHS.some(prefix => path.startsWith(prefix));
  if (!pathAllowed) {
    return res.status(403).json({ error: 'Path not allowed: ' + path.split('?')[0] });
  }

  // Validate method
  const allowedMethods = ['GET', 'POST', 'PATCH', 'DELETE'];
  if (!allowedMethods.includes(method.toUpperCase())) {
    return res.status(400).json({ error: 'Invalid method: ' + method });
  }

  try {
    const fetchOptions = {
      method: method.toUpperCase(),
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
      }
    };

    // Add Prefer header if specified (e.g., 'return=representation')
    if (prefer) {
      fetchOptions.headers['Prefer'] = prefer;
    }

    if (body && ['POST', 'PATCH'].includes(method.toUpperCase())) {
      fetchOptions.body = JSON.stringify(body);
    }

    const targetUrl = `${SUPABASE_URL}${path}`;
    const response = await fetch(targetUrl, fetchOptions);

    const contentType = response.headers.get('content-type') || '';
    let data;

    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return res.status(response.status).json(data);
  } catch (err) {
    console.error('[supabase-proxy] Error:', err);
    return res.status(500).json({ error: 'Proxy error: ' + err.message });
  }
}
