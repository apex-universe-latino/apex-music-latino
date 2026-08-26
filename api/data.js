// api/data.js — Unified Supabase data gateway
//
// One serverless function that handles four logical endpoints, dispatched by ?action=.
// The original paths are preserved via vercel.json rewrites, so callers are unchanged:
//   /api/supabase-proxy  → /api/data?action=proxy    (Apex MUSIC Latino proxy)
//   /api/lead            → /api/data?action=lead     (Apex MODELOS Latino — Mindset Caro)
//   /api/ingest          → /api/data?action=ingest   (Apex MODELOS Latino — open door)
//   /api/mc-content      → /api/data?action=content  (Apex MODELOS Latino — CMS)
//
// This consolidation keeps the deployment under the Vercel Hobby 12-function cap.
// Music and Modelos data stay fully separate — each branch targets its own project/keys.

// ---------- shared helpers ----------
const DEFAULT_MODELOS_URL = 'https://xtfmwtzjbudqmenfmhim.supabase.co';
const DEFAULT_MODELOS_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Zm13dHpqYnVkcW1lbmZtaGltIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzMwNjc2MiwiZXhwIjoyMDY4ODgyNzYyfQ.QFtWGtJr5PUzD8BKpk_YB78hf4AQOftUT-Onbodo4IA';

function modelosUrl() {
  if (process.env.MODELOS_SUPABASE_URL) return process.env.MODELOS_SUPABASE_URL.replace(/\/$/, '');
  if (process.env.MODELOS_SUPABASE_PROJECT_ID) return `https://${process.env.MODELOS_SUPABASE_PROJECT_ID}.supabase.co`;
  return DEFAULT_MODELOS_URL;
}

function modelosServiceKey() {
  return process.env.MODELOS_SUPABASE_SERVICE_ROLE_KEY || DEFAULT_MODELOS_KEY;
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

// ---------- dispatcher ----------
export default async function handler(req, res) {
  const action = req.query.action;
  if (action === 'proxy') return handleProxy(req, res);
  if (action === 'lead') return handleLead(req, res);
  if (action === 'ingest') return handleIngest(req, res);
  if (action === 'content') return handleContent(req, res);
  if (action === 'posts') return handlePosts(req, res);
  if (action === 'sitemap') return handleSitemap(req, res);
  if (action === 'robots') return handleRobots(req, res);
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(400).json({ error: 'Unknown or missing action.' });
}

// ============================================================
// action=proxy  — Apex MUSIC Latino Supabase proxy (unchanged behavior)
// ============================================================
const VALID_ARTISTS = ['arcoiris', 'joey-b', 'andrade', 'onboarding'];
const ALLOWED_PATHS = [
  '/rest/v1/leads_capture',
  '/rest/v1/fan_leads',
  '/rest/v1/artists_config',
  '/rest/v1/email_campaigns',
  '/rest/v1/scheduled_emails',
  '/rest/v1/venue_leads',
  '/rest/v1/email_events',
  '/rest/v1/unsubscribes',
];

async function handleProxy(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://apexmusiclatino.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed. Use POST.' });

  const SUPABASE_URL = `https://${process.env.SUPABASE_PROJECT_ID || 'iaycaynevtumrqoknemk'}.supabase.co`;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SERVICE_KEY) return res.status(500).json({ error: 'SUPABASE_SERVICE_ROLE_KEY not configured' });

  const { path, method, body, artist_slug, prefer } = req.body || {};
  if (!path || !method) return res.status(400).json({ error: 'Missing required fields: path, method' });
  if (!artist_slug || !VALID_ARTISTS.includes(artist_slug)) {
    return res.status(401).json({ error: 'Invalid or missing artist_slug. Access denied.' });
  }
  if (!ALLOWED_PATHS.some((prefix) => path.startsWith(prefix))) {
    return res.status(403).json({ error: 'Path not allowed: ' + path.split('?')[0] });
  }
  if (!['GET', 'POST', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
    return res.status(400).json({ error: 'Invalid method: ' + method });
  }

  try {
    const fetchOptions = {
      method: method.toUpperCase(),
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
    };
    if (prefer) fetchOptions.headers['Prefer'] = prefer;
    if (body && ['POST', 'PATCH'].includes(method.toUpperCase())) fetchOptions.body = JSON.stringify(body);

    try {
      const response = await fetch(`${SUPABASE_URL}${path}`, fetchOptions);
      if (response.status === 503 || response.status === 504) {
        return res.status(503).json({
          error: 'Supabase project is paused or starting up.',
          message: 'Please visit the Supabase dashboard to unpause the project (iaycaynevtumrqoknemk).',
          code: 'PROJECT_PAUSED',
        });
      }
      const contentType = response.headers.get('content-type') || '';
      const data = contentType.includes('application/json') ? await response.json() : await response.text();
      return res.status(response.status).json(data);
    } catch (fetchErr) {
      return res.status(503).json({
        error: 'Supabase project is unreachable.',
        message: 'This usually happens if the project is paused. Please check the Supabase dashboard.',
        details: fetchErr.message,
        code: 'PROJECT_UNREACHABLE',
      });
    }
  } catch (err) {
    console.error('[data:proxy] Critical Proxy Error:', err);
    return res.status(500).json({ error: 'Proxy infrastructure error: ' + err.message });
  }
}

// ============================================================
// action=lead  — Mindset Caro lead capture (Apex MODELOS Latino)
// ============================================================
async function handleLead(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed. Use POST.' });

  const SUPABASE_URL = modelosUrl();
  const SERVICE_KEY = modelosServiceKey();
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return res.status(500).json({ error: 'Modelos Latino Supabase not configured. Set MODELOS_SUPABASE_URL (or MODELOS_SUPABASE_PROJECT_ID) and MODELOS_SUPABASE_SERVICE_ROLE_KEY.' });
  }

  const b = req.body || {};
  if (!['flip-form', 'roulette', 'calculator'].includes(b.source)) {
    return res.status(400).json({ error: "Invalid 'source'. Expected flip-form | roulette | calculator." });
  }

  const utm = (typeof b.utm === 'object' && b.utm) || {};
  const row = {
    source: b.source,
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
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
      body: JSON.stringify(row),
    });
    if (r.status === 503 || r.status === 504) return res.status(503).json({ error: 'Supabase project is paused or starting up.', code: 'PROJECT_PAUSED' });
    const data = await r.json();
    if (r.status >= 400) return res.status(r.status).json({ error: 'Insert failed', details: data });

    // Mirror into the ingest stream so leads also show up in the incoming-data tracker.
    fetch(`${SUPABASE_URL}/rest/v1/mc_ingest_events`, {
      method: 'POST',
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_app: 'mindset-caro-site',
        event: `lead.${b.source}`,
        visitor_id: row.visitor_id,
        payload: row,
        url: row.referrer,
        utm,
        ip_address: row.ip_address,
        user_agent: row.user_agent,
      }),
    }).catch(() => {});

    // Notify Carolina — send a copy of every lead to her inbox (best-effort, via Resend).
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const notifyTo = process.env.LEAD_NOTIFY_EMAIL || 'info@mindsetcaro.com';
    if (RESEND_API_KEY) {
      const label = { 'flip-form': 'Diagnóstico', roulette: 'Ruleta', calculator: 'Calculadora' }[b.source] || b.source;
      const rows = [
        ['Fuente', label],
        ['Nombre', row.nombre],
        ['Email', row.email],
        ['WhatsApp', row.whatsapp],
        ['Objetivo', row.objective],
        ['Premio', row.prize],
        ['Ingreso', row.ingreso],
        ['Edad', row.age],
        ['Dependientes', row.dependientes],
        ['Cobertura sugerida (COP)', row.coverage_cop],
        ['Estimado mensual (COP)', row.monthly_cop],
      ].filter(([, v]) => v !== null && v !== undefined && v !== '')
       .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#888">${k}</td><td style="padding:4px 0"><b>${v}</b></td></tr>`)
       .join('');
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Mindset Caro <noreply@apexmusiclatino.com>',
          to: [notifyTo],
          reply_to: row.email || undefined,
          subject: `🔔 Nuevo lead (${label})${row.nombre ? ' — ' + row.nombre : ''}`,
          html: `<div style="font-family:Inter,Arial,sans-serif;max-width:520px">
            <h2 style="color:#e60000;margin:0 0 4px">Nuevo lead — Mindset Caro</h2>
            <p style="color:#666;margin:0 0 16px">Capturado en mindsetcaro.com</p>
            <table style="border-collapse:collapse;font-size:14px">${rows}</table>
            <p style="color:#999;font-size:12px;margin-top:18px">Este lead también quedó guardado en tu FRM (Supabase).</p>
          </div>`,
        }),
      }).catch(() => {});
    }

    const saved = Array.isArray(data) ? data[0] : data;
    return res.status(200).json({ ok: true, id: saved?.id });
  } catch (e) {
    return res.status(503).json({ error: 'Supabase unreachable', details: e.message });
  }
}

// ============================================================
// action=ingest  — the "open door" (Apex MODELOS Latino)
// ============================================================
async function handleIngest(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-ingest-key');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const SUPABASE_URL = modelosUrl();
  const SERVICE_KEY = modelosServiceKey();
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return res.status(500).json({ error: 'Modelos Latino Supabase not configured. Set MODELOS_SUPABASE_URL (or MODELOS_SUPABASE_PROJECT_ID) and MODELOS_SUPABASE_SERVICE_ROLE_KEY.' });
  }
  const sbHeaders = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' };

  // READ (dashboard / tracker)
  if (req.method === 'GET') {
    const adminKey = process.env.INGEST_ADMIN_KEY || process.env.MC_ADMIN_KEY;
    if (adminKey && req.query.admin_key !== adminKey) return res.status(401).json({ error: 'Invalid admin_key' });
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

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed. Use POST or GET.' });

  const requiredKey = process.env.INGEST_PUBLIC_KEY;
  if (requiredKey && req.headers['x-ingest-key'] !== requiredKey) {
    return res.status(401).json({ error: 'Invalid or missing x-ingest-key' });
  }

  const b = req.body || {};
  const source_app = (b.source_app || '').toString().slice(0, 120);
  const event = (b.event || '').toString().slice(0, 120);
  if (!source_app || !event) return res.status(400).json({ error: 'Missing required fields: source_app, event' });

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
    if (r.status === 503 || r.status === 504) return res.status(503).json({ error: 'Supabase project is paused or starting up.', code: 'PROJECT_PAUSED' });
    const data = await r.json();
    if (r.status >= 400) return res.status(r.status).json({ error: 'Insert failed', details: data });

    const fwd = process.env.INGEST_FORWARD_URL;
    if (fwd) fetch(fwd, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(row) }).catch(() => {});

    const saved = Array.isArray(data) ? data[0] : data;
    return res.status(200).json({ ok: true, id: saved?.id, visitor_id });
  } catch (e) {
    return res.status(503).json({ error: 'Supabase unreachable', details: e.message });
  }
}

// ============================================================
// action=content  — CMS read (public) / write (admin) (Apex MODELOS Latino)
// ============================================================
async function handleContent(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const SUPABASE_URL = modelosUrl();
  const SERVICE_KEY = modelosServiceKey();
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return res.status(500).json({ error: 'Modelos Latino Supabase not configured. Set MODELOS_SUPABASE_URL (or MODELOS_SUPABASE_PROJECT_ID) and MODELOS_SUPABASE_SERVICE_ROLE_KEY.' });
  }
  const sbHeaders = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' };

  if (req.method === 'GET') {
    const site = (req.query.site || 'landing').toString();
    const raw = req.query.raw === '1';
    const url = `${SUPABASE_URL}/rest/v1/mc_content?select=*&site=eq.${encodeURIComponent(site)}&order=field.asc`;
    try {
      const r = await fetch(url, { headers: sbHeaders });
      const rows = await r.json();
      if (r.status >= 400) return res.status(r.status).json({ error: 'Read failed', details: rows });
      if (raw) return res.status(200).json(rows);
      const map = {};
      for (const row of rows) map[row.field] = row.value_json ?? row.asset_url ?? row.value_text ?? null;
      return res.status(200).json({ site, content: map });
    } catch (e) {
      return res.status(503).json({ error: 'Supabase unreachable', details: e.message });
    }
  }

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

// ============================================================
// action=posts  — Blog (Apex MODELOS Latino)
//   GET  ?action=posts                 → list published posts
//   GET  ?action=posts&slug=xxx        → single post (published)
//   GET  ?action=posts&status=all&admin_key=...  → all (admin, incl. drafts)
//   POST ?action=posts  { admin_key, post:{slug,title,...} }  → upsert
// ============================================================
async function handlePosts(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const SUPABASE_URL = modelosUrl();
  const SERVICE_KEY = modelosServiceKey();
  if (!SUPABASE_URL || !SERVICE_KEY) return res.status(500).json({ error: 'Modelos Latino Supabase not configured.' });
  const sb = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' };

  if (req.method === 'GET') {
    const slug = req.query.slug ? `&slug=eq.${encodeURIComponent(req.query.slug)}` : '';
    const wantAll = req.query.status === 'all' && req.query.admin_key === process.env.MC_ADMIN_KEY;
    const pub = wantAll ? '' : '&status=eq.published';
    const sel = 'select=slug,title,excerpt,body,cover_url,author,tags,status,published_at,updated_at';
    const url = `${SUPABASE_URL}/rest/v1/mc_posts?${sel}${slug}${pub}&order=published_at.desc.nullslast`;
    try {
      const r = await fetch(url, { headers: sb });
      const rows = await r.json();
      if (r.status >= 400) return res.status(r.status).json({ error: 'Read failed', details: rows });
      if (req.query.slug) return res.status(200).json(Array.isArray(rows) ? rows[0] || null : null);
      return res.status(200).json(rows);
    } catch (e) {
      return res.status(503).json({ error: 'Supabase unreachable', details: e.message });
    }
  }

  if (req.method === 'POST') {
    const adminKey = process.env.MC_ADMIN_KEY;
    const b = req.body || {};
    if (!adminKey) return res.status(500).json({ error: 'MC_ADMIN_KEY not configured' });
    if (b.admin_key !== adminKey) return res.status(401).json({ error: 'Invalid admin_key' });
    const p = b.post || b;
    if (!p.slug || !p.title) return res.status(400).json({ error: 'post needs at least { slug, title }' });
    const row = {
      slug: String(p.slug).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, ''),
      title: p.title,
      excerpt: p.excerpt ?? null,
      body: p.body ?? null,
      cover_url: p.cover_url ?? null,
      author: p.author ?? 'Carolina',
      tags: Array.isArray(p.tags) ? p.tags : [],
      status: p.status === 'published' ? 'published' : 'draft',
      published_at: p.status === 'published' ? (p.published_at || new Date().toISOString()) : null,
      updated_at: new Date().toISOString(),
    };
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/mc_posts?on_conflict=slug`, {
        method: 'POST',
        headers: { ...sb, Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify(row),
      });
      const data = await r.json();
      if (r.status >= 400) return res.status(r.status).json({ error: 'Upsert failed', details: data });
      return res.status(200).json({ ok: true, post: Array.isArray(data) ? data[0] : data });
    } catch (e) {
      return res.status(503).json({ error: 'Supabase unreachable', details: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// ============================================================
// action=robots / action=sitemap  — host-aware (served at /robots.txt, /sitemap.xml)
// ============================================================
function isMindsetHost(req) {
  return (req.headers.host || '').toLowerCase().includes('mindsetcaro');
}

function handleRobots(req, res) {
  const mindset = isMindsetHost(req);
  const base = mindset ? 'https://mindsetcaro.com' : 'https://apexmusiclatino.com';
  let body = 'User-agent: *\nAllow: /\n';
  if (mindset) body += 'Disallow: /cms\n';
  body += `Sitemap: ${base}/sitemap.xml\n`;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  return res.status(200).send(body);
}

const APEX_SITEMAP = [
  ['/', '1.0'], ['/artists/', '0.9'], ['/marketplace/', '0.9'], ['/academy/', '0.9'],
  ['/dashboard/', '0.8'], ['/studio/', '0.8'], ['/onboarding/', '0.8'],
  ['/genre/reggaeton/', '0.8'], ['/genre/tango/', '0.8'], ['/genre/rap/', '0.8'],
  ['/genre/rock/', '0.7'], ['/genre/electronic/', '0.7'], ['/genre/afro-latin/', '0.7'],
  ['/genre/rap/joey-b/', '0.7'], ['/genre/tango/arcoiris/', '0.7'], ['/blog/', '0.8'],
];

async function handleSitemap(req, res) {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  let urls = [];
  if (isMindsetHost(req)) {
    const B = 'https://mindsetcaro.com';
    urls.push({ loc: `${B}/`, priority: '1.0' });
    urls.push({ loc: `${B}/blog`, priority: '0.7' });
    const SUPABASE_URL = modelosUrl();
    const KEY = modelosServiceKey();
    if (SUPABASE_URL && KEY) {
      try {
        const r = await fetch(`${SUPABASE_URL}/rest/v1/mc_posts?select=slug,updated_at&status=eq.published&order=published_at.desc`, {
          headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
        });
        if (r.ok) {
          const posts = await r.json();
          for (const p of posts) urls.push({ loc: `${B}/blog/${p.slug}`, priority: '0.6', lastmod: (p.updated_at || '').slice(0, 10) });
        }
      } catch { /* posts optional */ }
    }
  } else {
    urls = APEX_SITEMAP.map(([path, priority]) => ({ loc: `https://apexmusiclatino.com${path}`, priority }));
  }
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((u) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}<priority>${u.priority}</priority></url>`).join('\n') +
    '\n</urlset>\n';
  return res.status(200).send(xml);
}
