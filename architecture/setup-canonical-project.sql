-- ============================================================
-- Apex Music Latino — Canonical Supabase Project Setup
-- Project: RUN IN THE CANONICAL APEX MUSIC PROJECT (still to be chosen — see PRD §0.3).
-- NOTE: cyxghqoxsygexrpeldcf is the Six1Trey book project. Do NOT use it for Apex.
-- Run this in the Supabase SQL Editor of the NEW project,
-- then run architecture/supabase-schema.sql (artists / fan_captures /
-- social_connections / master_fans).
--
-- Access model:
--   - anon key (public, in client pages): INSERT into leads_capture,
--     SELECT artists_config — nothing else.
--   - service_role key (Vercel env var only): full access, bypasses RLS.
-- ============================================================

-- ------------------------------------------------------------
-- 1. leads_capture — QR gate / lead forms (arcoiris, alissontrigos, engine)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leads_capture (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    artist_name VARCHAR,
    email VARCHAR,
    genre VARCHAR,
    mood_preference JSONB,          -- name, phone, title, source, fan_id, master_id, device, geo, ...
    marketing_source VARCHAR,        -- e.g. 'QR_CODE'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.leads_capture ENABLE ROW LEVEL SECURITY;

-- Public pages insert leads with the anon key; they never read them back.
DROP POLICY IF EXISTS "anon can insert leads" ON public.leads_capture;
CREATE POLICY "anon can insert leads"
ON public.leads_capture FOR INSERT
TO anon
WITH CHECK (true);

-- ------------------------------------------------------------
-- 2. artists_config — per-artist portal/EPK config (read by slug)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.artists_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug VARCHAR UNIQUE NOT NULL,
    config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.artists_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone can read artist config" ON public.artists_config;
CREATE POLICY "anyone can read artist config"
ON public.artists_config FOR SELECT
USING (true);

-- ------------------------------------------------------------
-- 3. unsubscribes — email opt-outs (written via service role in api/*)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.unsubscribes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    source VARCHAR,
    unsubscribed_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.unsubscribes ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- 4. venue_leads — venue/booking outreach targets (service role only)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.venue_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_name VARCHAR,
    email VARCHAR,
    phone VARCHAR,
    city VARCHAR,
    category VARCHAR,
    status VARCHAR DEFAULT 'new',
    notes TEXT,
    raw JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.venue_leads ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- 5. scheduled_emails — journey/cadence queue (service role only)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.scheduled_emails (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    artist_slug VARCHAR,
    campaign_type VARCHAR,
    journey_step INT,
    recipient_email VARCHAR NOT NULL,
    recipient_name VARCHAR,
    from_label VARCHAR,
    subject VARCHAR,
    send_at TIMESTAMPTZ,
    status VARCHAR DEFAULT 'pending',   -- pending | sent | failed | cancelled
    resend_message_id VARCHAR,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.scheduled_emails ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_scheduled_emails_due
    ON public.scheduled_emails (status, send_at);

-- ------------------------------------------------------------
-- 6. email_campaigns / email_events — blast + engagement tracking
--    (allowed through api/data.js proxy; service role only)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.email_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    artist_slug VARCHAR,
    name VARCHAR,
    subject VARCHAR,
    body TEXT,
    status VARCHAR DEFAULT 'draft',
    sent_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.email_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES public.email_campaigns(id) ON DELETE SET NULL,
    recipient_email VARCHAR,
    event VARCHAR,                      -- delivered | opened | clicked | bounced | complained
    payload JSONB,
    occurred_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.email_events ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- 7. fan_leads — legacy/alternate lead stream allowed by the proxy
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.fan_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    artist_slug VARCHAR,
    name VARCHAR,
    email VARCHAR,
    phone VARCHAR,
    payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.fan_leads ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- NOTE: tables 3-7 have RLS enabled with NO anon policies on purpose:
-- only the service_role key (Vercel serverless functions) touches them.
-- The service_role key bypasses RLS. NEVER put it in client code.
-- ============================================================
