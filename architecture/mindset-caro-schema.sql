-- Mindset Caro — Supabase Schema
-- Brand: Mindset Caro (Diana Carolina) · Apex MODELOS Latino (influencer world)
-- ⚠ Run this in the dedicated APEX MODELOS LATINO Supabase project — NOT the music one.
--    Supabase Dashboard (Modelos project) → SQL Editor → New Query → paste → Run
--
-- Creates three tables:
--   1. mc_content        → the CMS (every data-cms-field from the design files)
--   2. mc_leads          → captured leads (flip-form / roulette / calculator)
--   3. mc_ingest_events  → the "open door": tracked data coming in from ANY external app

-- ============================================
-- 1. CMS CONTENT  (key/value — the field name IS the schema)
-- ============================================
CREATE TABLE IF NOT EXISTS public.mc_content (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    site        TEXT NOT NULL DEFAULT 'landing',   -- 'landing' | 'diagnostico' | 'global'
    field       TEXT NOT NULL,                     -- e.g. 'hero.title', 'pillar.1.body'
    grp         TEXT,                              -- e.g. 'hero', 'pillar', 'media', 'game'
    value_text  TEXT,                              -- plain copy
    value_json  JSONB,                             -- arrays/objects (prizes, footer links, calc constants)
    asset_url   TEXT,                              -- images / video loops
    updated_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (site, field)
);

CREATE INDEX IF NOT EXISTS idx_mc_content_site ON public.mc_content(site);

-- ============================================
-- 2. LEADS  (the 3 conversion handlers)
-- ============================================
CREATE TABLE IF NOT EXISTS public.mc_leads (
    id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    source        TEXT CHECK (source IN ('flip-form','roulette','calculator')),
    objective     TEXT,            -- 'familia' | 'ventas' | 'mindset'
    prize         TEXT,            -- roulette reward
    nombre        TEXT,
    email         TEXT,
    whatsapp      TEXT,
    ingreso       BIGINT,          -- calculator: monthly income (COP)
    age           INT,
    dependientes  INT,
    coverage_cop  BIGINT,          -- calculator: suggested coverage
    monthly_cop   BIGINT,          -- calculator: estimated monthly
    -- tracking
    visitor_id    TEXT,            -- ties back to mc_ingest_events / apex-track.js
    utm_source    TEXT,
    utm_medium    TEXT,
    utm_campaign  TEXT,
    referrer      TEXT,
    ip_address    TEXT,
    user_agent    TEXT,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mc_leads_email   ON public.mc_leads(email);
CREATE INDEX IF NOT EXISTS idx_mc_leads_created ON public.mc_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mc_leads_visitor ON public.mc_leads(visitor_id);

-- ============================================
-- 3. INGEST EVENTS  (the open door — data coming in from external apps)
-- ============================================
CREATE TABLE IF NOT EXISTS public.mc_ingest_events (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    source_app  TEXT NOT NULL,        -- which application sent this (free text id)
    event       TEXT NOT NULL,        -- event name: 'pageview' | 'signup' | 'custom' | ...
    visitor_id  TEXT,                 -- anonymous client id (set by apex-track.js)
    session_id  TEXT,
    payload     JSONB DEFAULT '{}'::jsonb,  -- arbitrary structured data
    url         TEXT,
    referrer    TEXT,
    utm         JSONB DEFAULT '{}'::jsonb,
    ip_address  TEXT,
    user_agent  TEXT,
    received_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mc_ingest_app     ON public.mc_ingest_events(source_app);
CREATE INDEX IF NOT EXISTS idx_mc_ingest_event   ON public.mc_ingest_events(event);
CREATE INDEX IF NOT EXISTS idx_mc_ingest_visitor ON public.mc_ingest_events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_mc_ingest_time    ON public.mc_ingest_events(received_at DESC);

-- ============================================
-- 3b. BLOG POSTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.mc_posts (
    id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug         TEXT UNIQUE NOT NULL,
    title        TEXT NOT NULL,
    excerpt      TEXT,
    body         TEXT,                 -- markdown or HTML
    cover_url    TEXT,
    author       TEXT DEFAULT 'Carolina',
    tags         JSONB DEFAULT '[]'::jsonb,
    status       TEXT DEFAULT 'draft' CHECK (status IN ('draft','published')),
    published_at TIMESTAMPTZ,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_mc_posts_status ON public.mc_posts(status, published_at DESC);

-- ============================================
-- 4. ROW LEVEL SECURITY
-- All writes go through serverless functions using the SERVICE_ROLE key,
-- so anon needs no direct access. Service role bypasses RLS.
-- ============================================
ALTER TABLE public.mc_content       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mc_leads         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mc_ingest_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mc_posts         ENABLE ROW LEVEL SECURITY;

-- Public site needs to READ published content:
CREATE POLICY "Public read mc_content" ON public.mc_content
    FOR SELECT TO anon USING (true);

CREATE POLICY "Service role all mc_content" ON public.mc_content
    FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role all mc_leads" ON public.mc_leads
    FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role all mc_ingest_events" ON public.mc_ingest_events
    FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role all mc_posts" ON public.mc_posts
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================
-- 5. SEED CONTENT  (defaults pulled from the design files)
-- ============================================
INSERT INTO public.mc_content (site, field, grp, value_text) VALUES
  ('landing','hero.eyebrow','hero','MINDSET CARO · FINANZAS CON PROPÓSITO'),
  ('landing','hero.title','hero','El Mindset Correcto para Blindar tu Futuro.'),
  ('landing','hero.subtitle','hero','Finanzas, Seguros y Ventas con propósito.'),
  ('landing','hero.cta','hero','Inicia tu Diagnóstico Gratuito'),
  ('landing','nav.cta','nav','Diagnóstico'),
  ('landing','form.cta','form','Desbloquear mi Lead Magnet'),
  ('landing','diagnostico.cta','cta','Inicia tu Diagnóstico Gratuito'),
  ('landing','community.title','community','Únete a la comunidad'),
  ('landing','community.subtitle','community','Tips diarios y networking en Discord.'),
  ('landing','community.cta','community','Entrar gratis'),
  ('landing','pillar.1.title','pillar','Proteger a mi familia'),
  ('landing','pillar.1.body','pillar','Seguros de vida y ahorro para blindar a quienes más amas ante lo inesperado.'),
  ('landing','pillar.2.title','pillar','Multiplicar mis ventas'),
  ('landing','pillar.2.body','pillar','Estrategia y mentalidad de cierre para vender más, con método y sin improvisar.'),
  ('landing','pillar.3.title','pillar','Cambiar mi mentalidad'),
  ('landing','pillar.3.body','pillar','La mentalidad financiera que transforma tu relación con el dinero y tu futuro.'),
  ('diagnostico','pitch.eyebrow','pitch','DIAGNÓSTICO 101'),
  ('diagnostico','pitch.title','pitch','Tu plan para blindar tu futuro, en 3 pasos.'),
  ('diagnostico','pitch.subtitle','pitch','Gira, calcula y recibe tu plan — sin compromiso.'),
  ('diagnostico','pitch.cta','pitch','Empezar'),
  ('diagnostico','calc.cta','calc','Recibir mi plan detallado')
ON CONFLICT (site, field) DO NOTHING;

-- Game + calculator data (editable JSON blobs)
INSERT INTO public.mc_content (site, field, grp, value_json) VALUES
  ('diagnostico','game.prizes','game',
    '["Guía: Blinda tu Futuro","20% en tu 1ª póliza","Sesión 1:1 gratis","Playbook de Ventas","Audio Mindset","Masterclass gratis"]'::jsonb),
  ('landing','game.giveaways','game',
    '{"familia":{"fmt":"GUÍA PDF","title":"Los 3 Pilares para Blindar tu Futuro","desc":"El checklist para proteger a tu familia ante lo inesperado."},"ventas":{"fmt":"PLAYBOOK","title":"7 Cierres que Multiplican tus Ventas","desc":"Los guiones y la mentalidad para vender con método."},"mindset":{"fmt":"AUDIO TRAINING","title":"El Mindset Correcto para tus Finanzas","desc":"30 min para reprogramar tu relación con el dinero."}}'::jsonb),
  ('diagnostico','calc.constants','calc',
    '{"coverageMultiplier":120,"dependentFactor":0.15,"baseRate":0.005,"ageBaseline":30,"ageFactor":0.03}'::jsonb)
ON CONFLICT (site, field) DO NOTHING;
