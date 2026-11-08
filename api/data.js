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
// action=content  — CMS read (public) / write (admin) (Apex MODELOS Latino)
// ============================================================
async function handleContent(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const SUPABASE_URL = modelosUrl();
  const SERVICE_KEY = modelosServiceKey();
  const sbHeaders = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' };

  if (req.method === 'GET') {
    const site = (req.query.site || 'landing').toString();
    const raw = req.query.raw === '1';
    // The public site renders fully from in-code defaults; the CMS only overrides. When the
    // store is missing or down, answer 200 with empty content (degraded) instead of a 5xx.
    const degraded = (reason) => {
      res.setHeader('Cache-Control', 'public, max-age=60');
      return res.status(200).json(raw ? [] : { site, content: {}, degraded: reason });
    };
    if (!SUPABASE_URL || !SERVICE_KEY) return degraded('not_configured');
    const url = `${SUPABASE_URL}/rest/v1/mc_content?select=*&site=eq.${encodeURIComponent(site)}&order=field.asc`;
    try {
      const r = await modelosFetch(url, { headers: sbHeaders });
      const rows = await r.json().catch(() => null);
      if (!r.ok || !Array.isArray(rows)) {
        console.error('[mindset-caro] mc_content read failed:', r.status);
        return degraded(`error_${r.status}`);
      }
      if (raw) return res.status(200).json(rows);
      const map = {};
      for (const row of rows) {
        const v = row.value_json ?? row.asset_url ?? row.value_text ?? null;
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

  if (!SUPABASE_URL || !SERVICE_KEY) {
    return res.status(503).json({ error: 'CMS store not configured. Set MODELOS_SUPABASE_URL (or MODELOS_SUPABASE_PROJECT_ID) and MODELOS_SUPABASE_SERVICE_ROLE_KEY.' });
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
  const emptyRead = () => res.status(200).json(req.query.slug ? null : []);
  if (req.method === 'GET' && (!SUPABASE_URL || !SERVICE_KEY)) return emptyRead();
  if (!SUPABASE_URL || !SERVICE_KEY) return res.status(503).json({ error: 'Modelos Latino Supabase not configured.' });
  const sb = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' };

  if (req.method === 'GET') {
    const slug = req.query.slug ? `&slug=eq.${encodeURIComponent(req.query.slug)}` : '';
    const wantAll = req.query.status === 'all' && req.query.admin_key === process.env.MC_ADMIN_KEY;
    const pub = wantAll ? '' : '&status=eq.published';
    const sel = 'select=slug,title,excerpt,body,cover_url,author,tags,status,published_at,updated_at';
    const url = `${SUPABASE_URL}/rest/v1/mc_posts?${sel}${slug}${pub}&order=published_at.desc.nullslast`;
    try {
      const r = await modelosFetch(url, { headers: sb });
      const rows = await r.json().catch(() => null);
      if (!r.ok || !Array.isArray(rows)) return emptyRead();
      if (req.query.slug) return res.status(200).json(rows[0] || null);
      return res.status(200).json(rows);
    } catch {
      return emptyRead();
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
    const B = 'https://www.mindsetcaro.com';
    urls.push({ loc: `${B}/`, priority: '1.0' });
    urls.push({ loc: `${B}/diagnostico`, priority: '0.9' });
    urls.push({ loc: `${B}/blog`, priority: '0.7' });
    urls.push({ loc: `${B}/privacidad`, priority: '0.2' });
    urls.push({ loc: `${B}/terminos`, priority: '0.2' });
    const SUPABASE_URL = modelosUrl();
    const KEY = modelosServiceKey();
    if (SUPABASE_URL && KEY) {
      try {
        const r = await modelosFetch(`${SUPABASE_URL}/rest/v1/mc_posts?select=slug,updated_at&status=eq.published&order=published_at.desc`, {
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
