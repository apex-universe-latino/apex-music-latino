// Mindset Caro — INGEST "Open Door"
// The single endpoint another application connects to, to push & track data.
//
//   POST /api/ingest      → record an incoming event
//   GET  /api/ingest?admin_key=...&limit=50  → read recent events (dashboard/tracker)
//
// POST body (all optional except source_app + event):
//   {
//     "source_app": "carolina-app",        // which app is sending this
//     "event": "signup",                   // event name
//     "visitor_id": "v_abc123",            // anon client id (apex-track.js sets this)
//     "session_id": "s_xyz",
//     "payload": { ... },                  // any structured data you want stored
//     "url": "https://...", "referrer": "https://...",
//     "utm": { "source": "...", "medium": "...", "campaign": "..." }
//   }
//
// CORS is open (*) on purpose — this is a public collector, like an analytics beacon.
// Optional hard auth: set INGEST_PUBLIC_KEY and send it as header `x-ingest-key`.
// Optional fan-out: set INGEST_FORWARD_URL to also POST each event to e.g. Cubo CDP / a webhook.
//
// DB: the Apex Modelos Latino Supabase project (separate from Apex Music Latino).
//   Set MODELOS_SUPABASE_URL (or MODELOS_SUPABASE_PROJECT_ID) + MODELOS_SUPABASE_SERVICE_ROLE_KEY.

function supabaseUrl() {
  if (process.env.MODELOS_SUPABASE_URL) return process.env.MODELOS_SUPABASE_URL.replace(/\/$/, '');
  if (process.env.MODELOS_SUPABASE_PROJECT_ID) return `https://${process.env.MODELOS_SUPABASE_PROJECT_ID}.supabase.co`;
  return null;
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-ingest-key');
}

function clientIp(req) {
  const xf = req.headers['x-forwarded-for'];
  return (Array.isArray(xf) ? xf[0] : (xf || '')).split(',')[0].trim() || null;
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const SUPABASE_URL = supabaseUrl();
  const SERVICE_KEY = process.env.MODELOS_SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return res.status(500).json({ error: 'Modelos Latino Supabase not configured. Set MODELOS_SUPABASE_URL (or MODELOS_SUPABASE_PROJECT_ID) and MODELOS_SUPABASE_SERVICE_ROLE_KEY.' });
  }

  const sbHeaders = {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
  };

  // ---- READ (dashboard / tracker) ----
  if (req.method === 'GET') {
    const adminKey = process.env.INGEST_ADMIN_KEY || process.env.MC_ADMIN_KEY;
    if (adminKey && req.query.admin_key !== adminKey) {
      return res.status(401).json({ error: 'Invalid admin_key' });
    }
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 500);
    const source = req.query.source_app ? `&source_app=eq.${encodeURIComponent(req.query.source_app)}` : '';
    const url = `${SUPABASE_URL}/rest/v1/mc_ingest_events?select=*${source}&order=received_at.desc&limit=${limit}`;
    try {
      const r = await fetch(url, { headers: sbHeaders });
      const data = await r.json();
      return res.status(r.status).json(data);
    } catch (e) {
      return res.status(503).json({ error: 'Supabase unreachable', details: e.message });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST or GET.' });
  }

  // ---- Optional hard auth ----
  const requiredKey = process.env.INGEST_PUBLIC_KEY;
  if (requiredKey && req.headers['x-ingest-key'] !== requiredKey) {
    return res.status(401).json({ error: 'Invalid or missing x-ingest-key' });
  }

  const b = req.body || {};
  const source_app = (b.source_app || '').toString().slice(0, 120);
  const event = (b.event || '').toString().slice(0, 120);
  if (!source_app || !event) {
    return res.status(400).json({ error: 'Missing required fields: source_app, event' });
  }

  const visitor_id = b.visitor_id || `v_${Math.random().toString(36).slice(2, 12)}`;

  const row = {
    source_app,
    event,
    visitor_id,
    session_id: b.session_id || null,
    payload: typeof b.payload === 'object' && b.payload !== null ? b.payload : {},
    url: b.url || req.headers['referer'] || null,
    referrer: b.referrer || null,
    utm: typeof b.utm === 'object' && b.utm !== null ? b.utm : {},
    ip_address: clientIp(req),
    user_agent: req.headers['user-agent'] || null,
  };

  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/mc_ingest_events`, {
      method: 'POST',
      headers: { ...sbHeaders, Prefer: 'return=representation' },
      body: JSON.stringify(row),
    });

    if (r.status === 503 || r.status === 504) {
      return res.status(503).json({ error: 'Supabase project is paused or starting up.', code: 'PROJECT_PAUSED' });
    }

    const data = await r.json();
    if (r.status >= 400) {
      return res.status(r.status).json({ error: 'Insert failed', details: data });
    }

    // Optional fan-out to another system (Cubo CDP, Zoho webhook, etc.) — best effort.
    const fwd = process.env.INGEST_FORWARD_URL;
    if (fwd) {
      fetch(fwd, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(row),
      }).catch(() => {});
    }

    const saved = Array.isArray(data) ? data[0] : data;
    return res.status(200).json({ ok: true, id: saved?.id, visitor_id });
  } catch (e) {
    return res.status(503).json({ error: 'Supabase unreachable', details: e.message });
  }
}
