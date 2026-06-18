// Mindset Caro — Lead capture
// POST /api/lead  ← called by the three conversion handlers on the landing pages.
//
// Bodies (source determines which fields are present):
//   flip-form:  { source:'flip-form', objective, nombre, email, whatsapp }
//   roulette:   { source:'roulette',  prize, nombre, email, whatsapp }
//   calculator: { source:'calculator', email, ingreso, age, dependientes, coverageCOP, monthlyCOP }
//
// Tracking fields (optional, sent by apex-track.js): visitor_id, utm{}, referrer.
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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function clientIp(req) {
  const xf = req.headers['x-forwarded-for'];
  return (Array.isArray(xf) ? xf[0] : (xf || '')).split(',')[0].trim() || null;
}

const toInt = (v) => {
  if (v === undefined || v === null || v === '') return null;
  const n = parseInt(String(v).replace(/[^0-9-]/g, ''), 10);
  return Number.isNaN(n) ? null : n;
};

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed. Use POST.' });

  const SUPABASE_URL = supabaseUrl();
  const SERVICE_KEY = process.env.MODELOS_SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return res.status(500).json({ error: 'Modelos Latino Supabase not configured. Set MODELOS_SUPABASE_URL (or MODELOS_SUPABASE_PROJECT_ID) and MODELOS_SUPABASE_SERVICE_ROLE_KEY.' });
  }

  const b = req.body || {};
  const source = b.source;
  if (!['flip-form', 'roulette', 'calculator'].includes(source)) {
    return res.status(400).json({ error: "Invalid 'source'. Expected flip-form | roulette | calculator." });
  }

  const utm = (typeof b.utm === 'object' && b.utm) || {};
  const row = {
    source,
    objective: b.objective || null,
    prize: b.prize || null,
    nombre: b.nombre || null,
    email: b.email || null,
    whatsapp: b.whatsapp || null,
    ingreso: toInt(b.ingreso),
    age: toInt(b.age),
    dependientes: toInt(b.dependientes),
    coverage_cop: toInt(b.coverageCOP ?? b.coverage_cop),
    monthly_cop: toInt(b.monthlyCOP ?? b.monthly_cop),
    visitor_id: b.visitor_id || null,
    utm_source: utm.source || b.utm_source || null,
    utm_medium: utm.medium || b.utm_medium || null,
    utm_campaign: utm.campaign || b.utm_campaign || null,
    referrer: b.referrer || req.headers['referer'] || null,
    ip_address: clientIp(req),
    user_agent: req.headers['user-agent'] || null,
  };

  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/mc_leads`, {
      method: 'POST',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(row),
    });

    if (r.status === 503 || r.status === 504) {
      return res.status(503).json({ error: 'Supabase project is paused or starting up.', code: 'PROJECT_PAUSED' });
    }

    const data = await r.json();
    if (r.status >= 400) return res.status(r.status).json({ error: 'Insert failed', details: data });

    // Mirror into the ingest stream so leads also show up in the incoming-data tracker.
    fetch(`${SUPABASE_URL}/rest/v1/mc_ingest_events`, {
      method: 'POST',
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_app: 'mindset-caro-site',
        event: `lead.${source}`,
        visitor_id: row.visitor_id,
        payload: row,
        url: row.referrer,
        utm,
        ip_address: row.ip_address,
        user_agent: row.user_agent,
      }),
    }).catch(() => {});

    const saved = Array.isArray(data) ? data[0] : data;
    return res.status(200).json({ ok: true, id: saved?.id });
  } catch (e) {
    return res.status(503).json({ error: 'Supabase unreachable', details: e.message });
  }
}
