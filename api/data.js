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
// Public anon key of CUBO FRM prod (laykneyclcirdionugxt). It is the same key the CUBO web app
// ships to every browser; RLS + the capture RPCs gate what it can do. Env var still wins.
const CUBO_PUBLIC_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxheWtuZXljbGNpcmRpb251Z3h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NDQ1NjYsImV4cCI6MjA5NjAyMDU2Nn0.ysDxUEJ9Decl6P8-6PdEUBNJX0INdRGu60BOFVZNCdk';

function modelosUrl() {
  if (process.env.MODELOS_SUPABASE_URL) return process.env.MODELOS_SUPABASE_URL.replace(/\/$/, '');
  if (process.env.MODELOS_SUPABASE_PROJECT_ID) return `https://${process.env.MODELOS_SUPABASE_PROJECT_ID}.supabase.co`;
  return null;
}

function modelosServiceKey() {
  return process.env.MODELOS_SUPABASE_SERVICE_ROLE_KEY || null;
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
  if (action === 'blogpage') return handleBlogPage(req, res);
  if (action === 'notfound') return handleNotFound(req, res);
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
// Payload (new front end, 2026-11 "Blindaje Patrimonial"):
//   { source: 'blindaje-diagnostico'|'bot'|'whatsapp-cta'|..., nombre, whatsapp, email?,
//     answers: { <question_key>: <value>, ... },
//     result?: { score, gap_cop, projection_cop }, utm?: {...},
//     consent: { datos: true, mayor_edad: true, marketing: boolean, ts } }
// Legacy fields (objective, educacion/education, ingreso, age, dependientes,
// coverageCOP, monthlyCOP, prize) are still accepted.
//
// Every lead goes to: mc_leads (+ mc_ingest_events mirror) in the Modelos
// project, an email to Carolina (skipped for @gsd500bpo.com test leads), and
// CUBO FRM prod (artist mindset-caro) through the same public RPCs the fan app
// uses: ingest_lead -> fan_access_redeem -> record_profiling_answers_by_key.
const LEGACY_LEAD_SOURCES = ['flip-form', 'roulette', 'calculator'];
const LEAD_SOURCE_RE = /^[a-z0-9][a-z0-9_-]{1,39}$/;
const TEST_EMAIL_RE = /@gsd500bpo\.com$/i;

function leadAnswers(b) {
  const out = {};
  const src = (b.answers && typeof b.answers === 'object' && !Array.isArray(b.answers)) ? b.answers : {};
  for (const [k, v] of Object.entries(src)) {
    if (!/^[a-z][a-z0-9_]{1,39}$/.test(k)) continue;
    if (typeof v === 'number' || typeof v === 'boolean') out[k] = v;
    else if (typeof v === 'string' && v.trim() && v.length <= 200) out[k] = v.trim();
  }
  // Legacy fields -> ladder keys, only when the new payload did not say it.
  if (out.meta_blindaje === undefined && b.objective === 'familia') out.meta_blindaje = 'Mi familia';
  const dep = toInt(b.dependientes);
  if (out.dependientes === undefined && dep !== null) out.dependientes = dep;
  const age = toInt(b.age);
  if (out.rango_edad === undefined && age !== null && age >= 18) {
    out.rango_edad = age < 25 ? '18 a 24' : age < 35 ? '25 a 34' : age < 45 ? '35 a 44' : age < 55 ? '45 a 54' : '55 o más';
  }
  const ing = toInt(b.ingreso);
  if (out.ingreso_mensual === undefined && ing !== null && ing > 0) {
    const m = ing / 1e6;
    out.ingreso_mensual = m < 3 ? 'Menos de 3 millones' : m < 6 ? '3 – 6 millones' : m < 12 ? '6 – 12 millones'
      : m < 25 ? '12 – 25 millones' : 'Más de 25 millones';
  }
  // CUBO option for dependientes is "0" | "1" | "2" | "3+".
  if (out.dependientes !== undefined) {
    const n = toInt(out.dependientes);
    if (n !== null) out.dependientes = n >= 3 ? '3+' : String(Math.max(0, n));
  }
  return out;
}

function leadResult(b) {
  const r = (b.result && typeof b.result === 'object') ? b.result : {};
  const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : (toInt(v)));
  const out = { score: num(r.score), gap_cop: num(r.gap_cop), projection_cop: num(r.projection_cop) };
  return Object.values(out).some((v) => v !== null) ? out : null;
}

// The Modelos project can be paused or gone (2026-11: the old project stopped resolving).
// Every Modelos call gets a short timeout so a dead project never hangs the function.
function modelosFetch(url, opts = {}, ms = 3500) {
  return withTimeout((signal) => fetch(url, { ...opts, signal }), ms);
}

async function withTimeout(promiseFn, ms) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try { return await promiseFn(ctrl.signal); } finally { clearTimeout(t); }
}

// ---------- CUBO FRM forward (server side, public anon RPCs only) ----------
let cuboArtistIdCache = null;

async function cuboRpc(fn, args) {
  const url = (process.env.CUBO_SUPABASE_URL || 'https://laykneyclcirdionugxt.supabase.co').replace(/\/$/, '');
  const key = process.env.CUBO_SUPABASE_ANON_KEY || CUBO_PUBLIC_ANON_KEY;
  const r = await withTimeout((signal) => fetch(`${url}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
    signal,
  }), 6000);
  const text = await r.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!r.ok) {
    const err = new Error(`${fn} ${r.status}: ${(data && data.message) || text}`.slice(0, 300));
    err.status = r.status;
    throw err;
  }
  return data;
}

function cuboPlatform(source, utm) {
  if (source === 'whatsapp-cta') return 'wa';
  const s = String(utm.source || '').toLowerCase();
  if (/^(fb|facebook|meta)/.test(s)) return 'fb';
  if (/^(ig|instagram)/.test(s)) return 'ig';
  if (/^(tt|tiktok)/.test(s)) return 'tt';
  if (/^(yt|youtube)/.test(s)) return 'yt';
  return 'email';   // the FRM app's own label for a plain web visit
}

async function forwardLeadToCubo({ source, nombre, email, whatsapp, answers, result, consent, utm, userAgent }) {
  if (!(process.env.CUBO_SUPABASE_ANON_KEY || CUBO_PUBLIC_ANON_KEY)) return { status: 'not_configured' };
  if (process.env.CUBO_FORWARD_DISABLED === '1') return { status: 'disabled' };
  // CUBO stores evidence, not a flag: data-processing AND age 18+ must both be true.
  const adult = consent.mayor_edad === true || consent.age_18_plus === true;
  if (consent.datos !== true || !adult) return { status: 'skipped_consent' };
  if (!email && !whatsapp) return { status: 'skipped_no_contact' };

  if (!cuboArtistIdCache) {
    cuboArtistIdCache = process.env.CUBO_ARTIST_ID
      || (await cuboRpc('artist_by_slug', { p_slug: process.env.CUBO_ARTIST_SLUG || 'mindset-caro' }))?.id
      || null;
  }
  if (!cuboArtistIdCache) return { status: 'artist_not_found' };

  const ts = typeof consent.ts === 'string' || typeof consent.ts === 'number'
    ? new Date(consent.ts).toISOString() : new Date().toISOString();
  const reply = await cuboRpc('ingest_lead', {
    p_artist_id: cuboArtistIdCache,
    p_name: nombre || null,
    p_email: email || null,
    p_phone: whatsapp || null,
    p_city: typeof answers.ciudad === 'string' ? answers.ciudad.slice(0, 120) : null,
    p_platform: cuboPlatform(source, utm),
    p_external_id: null,
    p_raw: {
      creator_slug: process.env.CUBO_ARTIST_SLUG || 'mindset-caro',
      attribution: { surface: 'mindsetcaro.com', partner: source, campaign: utm.campaign || null },
      consent: {
        version: 'mindsetcaro-2026-11',
        granted_at: ts,
        age_18_plus: { granted: true, text: 'Soy mayor de 18 años' },
        data_processing: { granted: true, text: 'Autorizo el tratamiento de mis datos personales (mindsetcaro.com)' },
        marketing_whatsapp: { granted: consent.marketing === true, text: 'Acepto recibir información de Mindset Caro por WhatsApp y email' },
      },
      device: { channel: 'web', via: 'mindsetcaro-api-lead', ua: (userAgent || '').slice(0, 160) },
    },
  });

  const ticket = reply?.verify?.ticket;
  if (!ticket) return { status: 'ingested_no_ticket' };
  const access = await cuboRpc('fan_access_redeem', { p_ticket: ticket });
  // A returning contact gets a challenge: answers wait until she verifies (by design, 055).
  if (access?.status !== 'ok' || !access.fan_id) return { status: 'ingested_returning' };
  if (!Object.keys(answers).length && !result) return { status: 'ok', answers: {} };
  const saved = await cuboRpc('record_profiling_answers_by_key', {
    p_fan_id: access.fan_id,
    p_answers: answers,
    p_result: result ? { ...result, source } : null,
  });
  return { status: 'ok', answers: saved?.answers || {} };
}

async function handleLead(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed. Use POST.' });

  const SUPABASE_URL = modelosUrl();
  const SERVICE_KEY = modelosServiceKey();

  const b = req.body || {};
  const source = typeof b.source === 'string' ? b.source.trim().toLowerCase() : '';
  if (!LEGACY_LEAD_SOURCES.includes(source) && !LEAD_SOURCE_RE.test(source)) {
    return res.status(400).json({ error: "Invalid 'source'. Expected flip-form | roulette | calculator | blindaje-diagnostico | bot | whatsapp-cta | <slug>." });
  }

  const utm = (typeof b.utm === 'object' && b.utm) || {};
  const answers = leadAnswers(b);
  const result = leadResult(b);
  const consent = (typeof b.consent === 'object' && b.consent) || {};
  const row = {
    source,
    objective: b.objective || (typeof answers.meta_blindaje === 'string' ? answers.meta_blindaje : null),
    prize: b.prize || null,
    nombre: b.nombre || null,
    email: b.email || null,
    whatsapp: b.whatsapp || b.phone || null,
    education: b.education || b.educacion || null,
    ingreso: toInt(b.ingreso),
    age: toInt(b.age),
    dependientes: toInt(b.dependientes ?? answers.dependientes),
    coverage_cop: toInt(b.coverageCOP ?? b.coverage_cop ?? result?.gap_cop),
    monthly_cop: toInt(b.monthlyCOP ?? b.monthly_cop),
    visitor_id: b.visitor_id || null,
    utm_source: utm.source || b.utm_source || null,
    utm_medium: utm.medium || b.utm_medium || null,
    utm_campaign: utm.campaign || b.utm_campaign || null,
    referrer: b.referrer || req.headers['referer'] || null,
    ip_address: clientIp(req),
    user_agent: req.headers['user-agent'] || null,
  };
  const isTest = TEST_EMAIL_RE.test(String(row.email || '').trim());
  const sbHeaders = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' };

  // Sinks, each best-effort: Modelos mc_leads (if configured + reachable), Carolina's email,
  // CUBO FRM. The lead counts as delivered when at least one sink took it, so a paused or
  // deleted Modelos project no longer loses leads.
  const tasks = [];
  let saved = null;
  let modelos = 'not_configured';
  if (SUPABASE_URL && SERVICE_KEY) {
    try {
      const insert = (r) => modelosFetch(`${SUPABASE_URL}/rest/v1/mc_leads`, {
        method: 'POST', headers: { ...sbHeaders, Prefer: 'return=representation' }, body: JSON.stringify(r),
      });
      let r = await insert(row);
      let data = await r.json().catch(() => null);
      // mc_leads.source has CHECK (flip-form|roulette|calculator). Until that
      // constraint is widened, file new sources as the diagnostic ('flip-form');
      // the real source is kept in mc_ingest_events and in CUBO.
      if (r.status >= 400 && data?.code === '23514' && !LEGACY_LEAD_SOURCES.includes(source)) {
        r = await insert({ ...row, source: 'flip-form' });
        data = await r.json().catch(() => null);
      }
      if (r.ok) {
        modelos = 'ok';
        saved = Array.isArray(data) ? data[0] : data;
        // Mirror into the ingest stream so leads also show up in the incoming-data tracker.
        tasks.push(modelosFetch(`${SUPABASE_URL}/rest/v1/mc_ingest_events`, {
          method: 'POST',
          headers: sbHeaders,
          body: JSON.stringify({
            source_app: 'mindset-caro-site',
            event: `lead.${source}`,
            visitor_id: row.visitor_id,
            payload: { ...row, mc_lead_id: saved?.id || null, answers, result, consent, test: isTest || undefined },
            url: row.referrer,
            utm,
            ip_address: row.ip_address,
            user_agent: row.user_agent,
          }),
        }));
      } else {
        modelos = `error_${r.status}`;
        console.error('[mindset-caro] mc_leads insert failed:', r.status, JSON.stringify(data).slice(0, 300));
      }
    } catch (e) {
      modelos = 'unreachable';
      console.error('[mindset-caro] Modelos unreachable:', e.message);
    }
  }

  // Notify Carolina — a copy of every lead to her inbox (best-effort, via Resend).
  // Test leads (@gsd500bpo.com) never reach her.
  let emailTask = Promise.resolve(isTest ? 'skipped_test' : 'not_configured');
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const notifyTo = process.env.LEAD_NOTIFY_EMAIL || 'info@mindsetcaro.com';
  if (RESEND_API_KEY && !isTest) {
    const label = {
      'flip-form': 'Diagnóstico', roulette: 'Ruleta', calculator: 'Calculadora',
      'blindaje-diagnostico': 'Diagnóstico Blindaje Patrimonial', bot: 'Caro IA (bot)', 'whatsapp-cta': 'Botón WhatsApp',
    }[source] || source;
    const esc = (v) => String(v).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const rows = [
      ['Fuente', label],
      ['Nombre', row.nombre],
      ['Email', row.email],
      ['WhatsApp', row.whatsapp],
      ['Educación', row.education],
      ['Objetivo', row.objective],
      ['Premio', row.prize],
      ['Ingreso', row.ingreso],
      ['Edad', row.age],
      ['Dependientes', row.dependientes],
      ['Cobertura sugerida (COP)', row.coverage_cop],
      ['Estimado mensual (COP)', row.monthly_cop],
      ...Object.entries(answers).filter(([k]) => k !== 'meta_blindaje' && k !== 'dependientes').map(([k, v]) => [k.replace(/_/g, ' '), v]),
      ['Puntaje blindaje', result?.score],
      ['Brecha de protección (COP)', result?.gap_cop],
      ['Proyección 10 años (COP, ilustrativa)', result?.projection_cop],
      ['Acepta marketing', consent.marketing === true ? 'Sí' : consent.marketing === false ? 'No' : null],
    ].filter(([, v]) => v !== null && v !== undefined && v !== '')
     .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#888">${esc(k)}</td><td style="padding:4px 0"><b>${esc(v)}</b></td></tr>`)
     .join('');
    emailTask = fetch('https://api.resend.com/emails', {
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
          <p style="color:#999;font-size:12px;margin-top:18px">Este lead también quedó guardado en tu CUBO FRM.</p>
        </div>`,
      }),
    }).then((r) => (r.ok ? 'ok' : `error_${r.status}`)).catch((e) => `error: ${e.message}`);
    tasks.push(emailTask);
  }

  // CUBO FRM: the lead + answers land in Carolina's Rolodex.
  const cuboTask = forwardLeadToCubo({
    source, nombre: row.nombre, email: row.email, whatsapp: row.whatsapp,
    answers, result, consent, utm, userAgent: row.user_agent,
  }).catch((e) => ({ status: 'error', error: e.message }));
  tasks.push(cuboTask);

  // Serverless: finish the side effects before answering, or they may be cut off.
  await Promise.allSettled(tasks);
  const cubo = await cuboTask;
  const email = await emailTask;
  if (cubo.status === 'error') console.error('[mindset-caro] CUBO forward failed:', cubo.error);

  const delivered = modelos === 'ok' || email === 'ok' || /^(ok|ingested)/.test(cubo.status);
  const sinks = { modelos, email, cubo: cubo.status };
  if (!delivered) return res.status(503).json({ ok: false, error: 'No lead sink available', sinks });
  return res.status(200).json({ ok: true, id: saved?.id, cubo: cubo.status, sinks });
}

export const __test = { leadAnswers, leadResult, forwardLeadToCubo, cuboPlatform };

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
// Mindset Caro site store — CUBO FRM prod (migration 064), read with the public anon key.
//   mc_content: site copy overrides (public read)
//   mc_posts:   blog (anon sees status=published only — RLS)
// Writes no longer go through this function: the /cms editor signs Carolina in with a
// 6-digit email code and writes to Supabase as her (RLS: site_editors allow-list).
// ============================================================
function cuboRestUrl() {
  return (process.env.CUBO_SUPABASE_URL || 'https://laykneyclcirdionugxt.supabase.co').replace(/\/$/, '');
}
function cuboRead(pathAndQuery, ms = 4000) {
  const key = process.env.CUBO_SUPABASE_ANON_KEY || CUBO_PUBLIC_ANON_KEY;
  return withTimeout((signal) => fetch(`${cuboRestUrl()}/rest/v1/${pathAndQuery}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    signal,
  }), ms);
}

const MC_SITE = 'https://www.mindsetcaro.com';
const MC_POST_FIELDS = 'slug,title,excerpt,body,cover_url,cover_alt,seo_title,seo_description,author,tags,status,published_at,updated_at';

// ---------- tiny Markdown renderer (same rules as the /cms preview) ----------
// Headings (#–####), paragraphs, **bold**, *italic*, [links](url), ![img](url), lists,
// > quotes, --- rules, `code`. All text is HTML-escaped first: raw HTML is not passed through.
function mdEscape(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function mdSafeUrl(u) {
  const url = String(u || '').trim();
  return /^(https?:\/\/|\/|#|mailto:)/i.test(url) ? url : '#';
}
function mdSlug(s) {
  return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}
function mdInline(text) {
  let s = mdEscape(text);
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, alt, u) => `<img src="${mdSafeUrl(u)}" alt="${alt}" loading="lazy">`);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => {
    const href = mdSafeUrl(u.replace(/&amp;/g, '&'));
    const ext = /^https?:\/\//i.test(href) && !/mindsetcaro\.com/i.test(href);
    return `<a href="${mdEscape(href)}"${ext ? ' target="_blank" rel="noopener"' : ''}>${t}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, '$1<em>$2</em>');
  s = s.replace(/(^|[^_\w])_([^_\n]+)_(?!\w)/g, '$1<em>$2</em>');
  return s;
}
function mdToHtml(md) {
  const lines = String(md || '').replace(/\r\n?/g, '\n').split('\n');
  const out = [];
  let para = [];
  let list = null; // { tag, items }
  let quote = [];
  const flushPara = () => { if (para.length) { out.push(`<p>${mdInline(para.join(' '))}</p>`); para = []; } };
  const flushList = () => { if (list) { out.push(`<${list.tag}>${list.items.map((i) => `<li>${mdInline(i)}</li>`).join('')}</${list.tag}>`); list = null; } };
  const flushQuote = () => { if (quote.length) { out.push(`<blockquote><p>${mdInline(quote.join(' '))}</p></blockquote>`); quote = []; } };
  const flushAll = () => { flushPara(); flushList(); flushQuote(); };
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) { flushAll(); continue; }
    let m;
    if ((m = line.match(/^(#{1,4})\s+(.*)$/))) {
      flushAll();
      const level = Math.min(4, Math.max(2, m[1].length));
      out.push(`<h${level} id="${mdSlug(m[2])}">${mdInline(m[2])}</h${level}>`);
    } else if (/^\s*(-{3,}|\*{3,})\s*$/.test(line)) {
      flushAll(); out.push('<hr>');
    } else if ((m = line.match(/^>\s?(.*)$/))) {
      flushPara(); flushList(); quote.push(m[1]);
    } else if ((m = line.match(/^\s*[-*•]\s+(.*)$/))) {
      flushPara(); flushQuote();
      if (!list || list.tag !== 'ul') { flushList(); list = { tag: 'ul', items: [] }; }
      list.items.push(m[1]);
    } else if ((m = line.match(/^\s*\d+[.)]\s+(.*)$/))) {
      flushPara(); flushQuote();
      if (!list || list.tag !== 'ol') { flushList(); list = { tag: 'ol', items: [] }; }
      list.items.push(m[1]);
    } else if (list && /^\s{2,}\S/.test(raw)) {
      list.items[list.items.length - 1] += ' ' + line.trim();
    } else {
      flushList(); flushQuote(); para.push(line.trim());
    }
  }
  flushAll();
  return out.join('\n');
}
const looksLikeHtml = (s) => /^\s*<(p|h[1-6]|div|ul|ol|figure|section|article)[\s>]/i.test(String(s || ''));
function postBodyHtml(body) {
  return looksLikeHtml(body) ? String(body) : mdToHtml(body);
}
function withBodyHtml(p) {
  return p ? { ...p, body_html: postBodyHtml(p.body) } : p;
}

// ============================================================
// action=content  — CMS read (public). Writes happen in /cms, straight to Supabase.
// ============================================================
async function handleContent(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const site = (req.query.site || 'landing').toString();
    const raw = req.query.raw === '1';
    // The public site renders fully from in-code defaults; the CMS only overrides. When the
    // store is missing or down, answer 200 with empty content (degraded) instead of a 5xx.
    const degraded = (reason) => {
      res.setHeader('Cache-Control', 'public, max-age=60');
      return res.status(200).json(raw ? [] : { site, content: {}, degraded: reason });
    };
    try {
      const r = await cuboRead(`mc_content?select=site,field,grp,value_text,value_json,asset_url,updated_at&site=eq.${encodeURIComponent(site)}&order=field.asc`);
      const rows = await r.json().catch(() => null);
      if (!r.ok || !Array.isArray(rows)) {
        console.error('[mindset-caro] mc_content read failed:', r.status);
        return degraded(`error_${r.status}`);
      }
      res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=300');
      if (raw) return res.status(200).json(rows);
      const map = {};
      for (const row of rows) {
        const v = row.value_json ?? row.asset_url ?? row.value_text ?? null;
        if (v === null || v === '') continue;
        // Never hand out assets from the retired Apex Music project (paused, DNS gone).
        if (typeof v === 'string' && v.includes('iaycaynevtumrqoknemk')) continue;
        map[row.field] = v;
      }
      return res.status(200).json({ site, content: map });
    } catch (e) {
      console.error('[mindset-caro] mc_content unreachable:', e.message);
      return degraded('unreachable');
    }
  }

  return res.status(405).json({ error: 'Read-only. Edit the site copy at https://www.mindsetcaro.com/cms' });
}

// ============================================================
// action=posts  — Blog (published only; drafts are visible to editors inside /cms)
//   GET  /api/posts              → list published posts (no body)
//   GET  /api/posts?slug=xxx     → single published post (+ body_html)
// ============================================================
async function fetchPublishedPosts({ slug = null, withBody = false } = {}) {
  const sel = withBody ? MC_POST_FIELDS : MC_POST_FIELDS.replace(',body,', ',');
  const bySlug = slug ? `&slug=eq.${encodeURIComponent(slug)}` : '';
  const r = await cuboRead(`mc_posts?select=${sel}${bySlug}&status=eq.published&order=published_at.desc.nullslast`);
  const rows = await r.json().catch(() => null);
  if (!r.ok || !Array.isArray(rows)) throw new Error(`mc_posts ${r.status}`);
  return rows;
}

async function handlePosts(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Read-only. Write posts at https://www.mindsetcaro.com/cms' });

  const slug = req.query.slug ? String(req.query.slug) : null;
  try {
    const rows = await fetchPublishedPosts({ slug, withBody: !!slug });
    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=300');
    if (slug) return res.status(200).json(withBodyHtml(rows[0] || null));
    return res.status(200).json(rows);
  } catch (e) {
    console.error('[mindset-caro] posts read failed:', e.message);
    return res.status(200).json(slug ? null : []);
  }
}

// ============================================================
// action=blogpage  — server-rendered head + article for /blog and /blog/<slug> on
// mindsetcaro.com. Takes the static SPA shell, swaps in per-post <title>, description,
// canonical, OG/Twitter and JSON-LD, and pre-renders the article inside #root so crawlers
// and link previews see the real text. React then mounts over it as usual.
// ============================================================
let mcShellCache = { html: null, at: 0 };
async function mcShell(req) {
  if (mcShellCache.html && Date.now() - mcShellCache.at < 5 * 60 * 1000) return mcShellCache.html;
  const host = (req.headers['x-forwarded-host'] || req.headers.host || 'www.mindsetcaro.com').toString().split(',')[0].trim();
  const r = await withTimeout((signal) => fetch(`https://${host}/mindset-caro/index.html`, { signal }), 4000);
  if (!r.ok) throw new Error(`shell ${r.status}`);
  const html = await r.text();
  if (!html.includes('<div id="root">')) throw new Error('shell without #root');
  mcShellCache = { html, at: Date.now() };
  return html;
}

function setHead(html, { title, description, canonical, image, type = 'website', robots = null, jsonld = null }) {
  const a = mdEscape;
  let h = html;
  const swapMeta = (attr, name, value) => {
    const re = new RegExp(`<meta\\s+${attr}="${name}"\\s+content="[^"]*"\\s*/?>`, 'i');
    const tag = `<meta ${attr}="${name}" content="${a(value)}" />`;
    h = re.test(h) ? h.replace(re, () => tag) : h.replace('</head>', () => `    ${tag}\n  </head>`);
  };
  h = h.replace(/<title>[\s\S]*?<\/title>/i, () => `<title>${a(title)}</title>`);
  swapMeta('name', 'description', description);
  h = h.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, () => `<link rel="canonical" href="${a(canonical)}" />`);
  swapMeta('property', 'og:title', title);
  swapMeta('property', 'og:description', description);
  swapMeta('property', 'og:type', type);
  swapMeta('property', 'og:url', canonical);
  swapMeta('property', 'og:image', image);
  swapMeta('name', 'twitter:title', title);
  swapMeta('name', 'twitter:description', description);
  swapMeta('name', 'twitter:image', image);
  if (robots) swapMeta('name', 'robots', robots);
  if (jsonld) h = h.replace('</head>', () => `  <script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>\n  </head>`);
  return h;
}

const absUrl = (u) => (!u ? `${MC_SITE}/mindset-caro/og-blindaje.png` : /^https?:\/\//i.test(u) ? u : `${MC_SITE}${u.startsWith('/') ? '' : '/'}${u}`);
const fmtDate = (d) => { try { return new Date(d).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Bogota' }); } catch { return ''; } };

const notFoundHtml = (msg) => `<section class="mx-auto max-w-2xl px-6 py-24 text-center text-white">
<p class="eyebrow">Error 404</p><h1 class="mt-3 text-4xl font-black tracking-tight">Página no encontrada</h1>
<p class="mt-4 text-lg">${mdEscape(msg)}</p>
<p class="mt-8"><a href="/blog" class="btn-primary">Ir al blog</a> <a href="/diagnostico">Haz tu diagnóstico gratis</a></p></section>`;

// action=notfound — every mindsetcaro.com path that is not a real page (vercel.json sends the
// host catch-all here). Real HTTP 404 + noindex instead of a soft 404, so old/lost URLs drop
// out of Google. The SPA still mounts and shows its own NotFound page.
async function handleNotFound(req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=300');
  let shell;
  try { shell = await mcShell(req); } catch {
    return res.status(404).send('<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><title>Página no encontrada | Mindset Caro</title><p>Página no encontrada. <a href="/blog">Blog</a> · <a href="/diagnostico">Diagnóstico</a></p>');
  }
  const html = setHead(shell, {
    title: 'Página no encontrada | Mindset Caro', description: 'La página que buscas no existe o cambió de dirección.',
    canonical: `${MC_SITE}/`, robots: 'noindex',
  });
  return res.status(404).send(html.replace('<div id="root"></div>', () => `<div id="root"><main class="pt-[65px]">${notFoundHtml('La página que buscas no existe o cambió de dirección.')}</main></div>`));
}

async function handleBlogPage(req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  let shell;
  try { shell = await mcShell(req); } catch (e) {
    console.error('[mindset-caro] blog shell failed:', e.message);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send('<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/mindset-caro/blog/"><title>Blog | Mindset Caro</title>');
  }
  const slug = req.query.slug ? String(req.query.slug).replace(/\/+$/, '').toLowerCase() : '';
  const fill = (h, inner) => h.replace('<div id="root"></div>', () => `<div id="root"><main class="pt-[65px]">${inner}</main></div>`);

  if (!slug) {
    let posts = [];
    try { posts = await fetchPublishedPosts(); } catch { /* render an empty list */ }
    const html = setHead(shell, {
      title: 'Blog | Mindset Caro — Seguros de vida, ahorro e inversión en Colombia',
      description: 'Artículos de Mindset Caro sobre blindaje patrimonial, seguros de vida con ahorro, el índice S&P 500, liquidez para la familia y ahorro de largo plazo en Colombia.',
      canonical: `${MC_SITE}/blog`,
      jsonld: {
        '@context': 'https://schema.org', '@type': 'Blog', name: 'Blog de Mindset Caro', url: `${MC_SITE}/blog`, inLanguage: 'es-CO',
        blogPost: posts.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: `${MC_SITE}/blog/${p.slug}`, datePublished: p.published_at })),
      },
    });
    const items = posts.map((p) => `<li><a href="/blog/${mdEscape(p.slug)}"><h2>${mdEscape(p.title)}</h2></a>${p.excerpt ? `<p>${mdEscape(p.excerpt)}</p>` : ''}</li>`).join('');
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=600');
    return res.status(200).send(fill(html, `<section class="mx-auto max-w-5xl px-6 py-16 text-white"><h1 class="text-4xl font-extrabold">Aprende conmigo</h1><ul>${items}</ul></section>`));
  }

  let post = null;
  try { post = (await fetchPublishedPosts({ slug, withBody: true }))[0] || null; } catch (e) {
    console.error('[mindset-caro] blog post read failed:', e.message);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(shell); // store down: let the SPA try on its own
  }
  if (!post) {
    res.setHeader('Cache-Control', 'public, s-maxage=30');
    return res.status(404).send(fill(setHead(shell, {
      title: 'Página no encontrada | Mindset Caro', description: 'Este artículo no existe o ya no está publicado.',
      canonical: `${MC_SITE}/blog`, robots: 'noindex',
    }), notFoundHtml('Este artículo no existe o ya no está publicado.')));
  }
  const canonical = `${MC_SITE}/blog/${post.slug}`;
  const title = post.seo_title || `${post.title} | Mindset Caro`;
  const description = (post.seo_description || post.excerpt || '').slice(0, 300);
  // Social previews: brand covers ship a .jpg twin (WebP og:image is not read everywhere).
  const image = absUrl(/^\/mindset-caro\/media\/blog\/[a-z0-9-]+\.webp$/.test(post.cover_url || '') ? post.cover_url.replace(/\.webp$/, '.jpg') : post.cover_url);
  const html = setHead(shell, {
    title, description, canonical, image, type: 'article',
    jsonld: {
      '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description,
      image, url: canonical, mainEntityOfPage: canonical, inLanguage: 'es-CO',
      datePublished: post.published_at, dateModified: post.updated_at || post.published_at,
      author: { '@type': 'Organization', name: post.author || 'Mindset Caro', url: MC_SITE },
      publisher: { '@type': 'Organization', name: 'Mindset Caro', url: MC_SITE },
    },
  });
  const article = `<article class="mx-auto max-w-2xl px-6 py-16 text-white">
<a href="/blog">← Blog</a>
<h1 class="mt-2 text-4xl font-extrabold leading-tight tracking-tight">${mdEscape(post.title)}</h1>
<p>${mdEscape(post.author || 'Mindset Caro')}${post.published_at ? ` · ${fmtDate(post.published_at)}` : ''}</p>
${post.cover_url ? `<img src="${mdEscape(absUrl(post.cover_url))}" alt="${mdEscape(post.cover_alt || post.title)}" class="mt-8 w-full rounded-2xl">` : ''}
${post.excerpt ? `<p class="mt-8 text-lg">${mdEscape(post.excerpt)}</p>` : ''}
<div class="mc-prose">${postBodyHtml(post.body)}</div>
</article>`;
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=600');
  return res.status(200).send(fill(html, article));
}

// ============================================================
// action=robots / action=sitemap  — host-aware (served at /robots.txt, /sitemap.xml)
// ============================================================
function isMindsetHost(req) {
  return (req.headers.host || '').toLowerCase().includes('mindsetcaro');
}

function handleRobots(req, res) {
  const mindset = isMindsetHost(req);
  const base = mindset ? 'https://www.mindsetcaro.com' : 'https://apexmusiclatino.com';
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
    const B = 'https://www.mindsetcaro.com';
    urls.push({ loc: `${B}/`, priority: '1.0' });
    urls.push({ loc: `${B}/diagnostico`, priority: '0.9' });
    urls.push({ loc: `${B}/blog`, priority: '0.7' });
    urls.push({ loc: `${B}/privacidad`, priority: '0.2' });
    urls.push({ loc: `${B}/terminos`, priority: '0.2' });
    try {
      for (const p of await fetchPublishedPosts()) {
        urls.push({ loc: `${B}/blog/${p.slug}`, priority: '0.6', lastmod: (p.updated_at || p.published_at || '').slice(0, 10) });
      }
    } catch { /* posts optional */ }
  } else {
    urls = APEX_SITEMAP.map(([path, priority]) => ({ loc: `https://apexmusiclatino.com${path}`, priority }));
  }
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((u) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}<priority>${u.priority}</priority></url>`).join('\n') +
    '\n</urlset>\n';
  return res.status(200).send(xml);
}
