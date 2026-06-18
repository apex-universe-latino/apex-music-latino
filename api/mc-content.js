// Mindset Caro — CMS content API
//   GET  /api/mc-content?site=landing            → public, returns { field: value } map for the site
//   POST /api/mc-content   (admin)               → upsert one or many fields
//
// POST body: { admin_key, fields: [ { site, field, grp?, value_text?, value_json?, asset_url? }, ... ] }
// Protect writes with MC_ADMIN_KEY env var.
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
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

  // ---- READ (public) ----
  if (req.method === 'GET') {
    const site = (req.query.site || 'landing').toString();
    const raw = req.query.raw === '1';
    const url = `${SUPABASE_URL}/rest/v1/mc_content?select=*&site=eq.${encodeURIComponent(site)}&order=field.asc`;
    try {
      const r = await fetch(url, { headers: sbHeaders });
      const rows = await r.json();
      if (r.status >= 400) return res.status(r.status).json({ error: 'Read failed', details: rows });
      if (raw) return res.status(200).json(rows);
      // Flatten to a simple { field: value } map for the site to consume.
      const map = {};
      for (const row of rows) {
        map[row.field] = row.value_json ?? row.asset_url ?? row.value_text ?? null;
      }
      return res.status(200).json({ site, content: map });
    } catch (e) {
      return res.status(503).json({ error: 'Supabase unreachable', details: e.message });
    }
  }

  // ---- WRITE (admin) ----
  if (req.method === 'POST') {
    const adminKey = process.env.MC_ADMIN_KEY;
    const b = req.body || {};
    if (!adminKey) return res.status(500).json({ error: 'MC_ADMIN_KEY not configured' });
    if (b.admin_key !== adminKey) return res.status(401).json({ error: 'Invalid admin_key' });

    const fields = Array.isArray(b.fields) ? b.fields : (b.field ? [b] : null);
    if (!fields || !fields.length) return res.status(400).json({ error: 'Provide fields: [{ site, field, ... }]' });

    const rows = fields.map((f) => ({
      site: f.site || 'landing',
      field: f.field,
      grp: f.grp ?? (f.field ? String(f.field).split('.')[0] : null),
      value_text: f.value_text ?? null,
      value_json: f.value_json ?? null,
      asset_url: f.asset_url ?? null,
      updated_at: new Date().toISOString(),
    }));
    if (rows.some((r) => !r.field)) return res.status(400).json({ error: 'Every field row needs a "field" name' });

    try {
      // Upsert on the (site, field) unique constraint.
      const r = await fetch(`${SUPABASE_URL}/rest/v1/mc_content?on_conflict=site,field`, {
        method: 'POST',
        headers: { ...sbHeaders, Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify(rows),
      });
      const data = await r.json();
      if (r.status >= 400) return res.status(r.status).json({ error: 'Upsert failed', details: data });
      return res.status(200).json({ ok: true, saved: Array.isArray(data) ? data.length : 1 });
    } catch (e) {
      return res.status(503).json({ error: 'Supabase unreachable', details: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
