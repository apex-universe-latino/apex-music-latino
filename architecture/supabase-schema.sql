-- Apex Music Latino — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- This creates all tables needed for the fan data pipeline + artist backend

-- ============================================
-- 1. ARTISTS TABLE (artist profiles + EPK data)
-- ============================================
CREATE TABLE IF NOT EXISTS public.artists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stage_name TEXT NOT NULL,
    legal_name TEXT,
    email TEXT UNIQUE,
    genre TEXT NOT NULL DEFAULT 'general',
    country TEXT,
    city TEXT,
    role TEXT DEFAULT 'artist',
    bio_en TEXT,
    bio_es TEXT,
    profile_image TEXT,
    banner_image TEXT,
    fan_count INTEGER DEFAULT 0,
    stream_count INTEGER DEFAULT 0,
    engagement_rate NUMERIC(5,2) DEFAULT 0,
    top_territory TEXT,
    releases JSONB DEFAULT '[]'::jsonb,
    social_links JSONB DEFAULT '{}'::jsonb,
    merch_items JSONB DEFAULT '[]'::jsonb,
    upcoming_shows JSONB DEFAULT '[]'::jsonb,
    video_url TEXT,
    slug TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'incubator', 'signed', 'graduated')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert seed data for existing artists
INSERT INTO public.artists (stage_name, genre, city, country, slug, bio_en, bio_es, fan_count, stream_count, engagement_rate, top_territory, status, social_links, releases)
VALUES
    ('Arcoiris', 'tango', 'Buenos Aires', 'AR', 'arcoiris',
     'Arcoiris redefines tango for the digital era. A collective fusing traditional bandoneón with cutting-edge electronic production.',
     'Arcoiris redefine el tango para la era digital. Un colectivo que fusiona la tradición del bandoneón con producción electrónica de vanguardia.',
     845000, 5200000, 6.1, 'Argentina', 'signed',
     '{"spotify":"https://spotify.com","instagram":"https://instagram.com","youtube":"https://youtube.com","tiktok":"https://tiktok.com"}'::jsonb,
     '[{"title":"Noches de Fuego","type":"Single","year":"2026"},{"title":"Abrazo Digital","type":"EP","year":"2025"},{"title":"Milonga Eléctrica","type":"Single","year":"2025"},{"title":"Pasión Algoritmica","type":"Album","year":"2025"}]'::jsonb
    ),
    ('Joey B', 'rap', 'Mexico City', 'MX', 'joey-b',
     'Joey B is the emerging voice of Latin rap. Rooted in Mexico City, he fuses raw storytelling with avant-garde beats.',
     'Joey B es la voz emergente del rap latino. Con raíces en Ciudad de México, fusiona el storytelling crudo con beats de vanguardia.',
     1200000, 8400000, 4.7, 'Mexico', 'signed',
     '{"spotify":"https://spotify.com","instagram":"https://instagram.com","youtube":"https://youtube.com","tiktok":"https://tiktok.com"}'::jsonb,
     '[{"title":"Sombras Digitales","type":"Single","year":"2026"},{"title":"Calles de Cristal","type":"EP","year":"2025"},{"title":"Noche Eterna","type":"Single","year":"2025"},{"title":"Imperio","type":"Album","year":"2025"}]'::jsonb
    ),
    ('Andrade', 'reggaeton', 'Medellin', 'CO', 'andrade',
     'Andrade brings the fire of Medellin to global stages. Pure reggaeton energy powered by data intelligence.',
     'Andrade trae el fuego de Medellín a escenarios globales. Energía pura de reggaeton impulsada por inteligencia de datos.',
     2100000, 12300000, 5.8, 'Colombia', 'signed',
     '{"spotify":"https://spotify.com","instagram":"https://instagram.com","youtube":"https://youtube.com","tiktok":"https://tiktok.com"}'::jsonb,
     '[{"title":"Fuego Eterno","type":"Single","year":"2026"},{"title":"Calor de Medallo","type":"EP","year":"2025"}]'::jsonb
    )
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 2. FAN CAPTURES TABLE (QR scan + form data)
-- ============================================
CREATE TABLE IF NOT EXISTS public.fan_captures (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    artist_id UUID REFERENCES public.artists(id),
    artist_slug TEXT NOT NULL,
    fan_name TEXT,
    fan_email TEXT NOT NULL,
    fan_phone TEXT,
    fan_title TEXT,
    source TEXT DEFAULT 'website' CHECK (source IN ('qr_scan', 'epk_form', 'event', 'merch_page', 'website', 'social')),
    offer TEXT,
    genre_context TEXT,
    ip_address TEXT,
    user_agent TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    is_duplicate BOOLEAN DEFAULT FALSE,
    merged_to UUID,
    captured_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for dedup queries
CREATE INDEX IF NOT EXISTS idx_fan_captures_email ON public.fan_captures(fan_email);
CREATE INDEX IF NOT EXISTS idx_fan_captures_artist ON public.fan_captures(artist_slug);
CREATE INDEX IF NOT EXISTS idx_fan_captures_date ON public.fan_captures(captured_at DESC);

-- ============================================
-- 3. SOCIAL CONNECTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.social_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    artist_id UUID REFERENCES public.artists(id),
    platform TEXT NOT NULL CHECK (platform IN ('spotify', 'instagram', 'tiktok', 'facebook', 'youtube', 'twitter')),
    platform_user_id TEXT,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMPTZ,
    followers_count INTEGER DEFAULT 0,
    engagement_rate NUMERIC(5,2) DEFAULT 0,
    last_synced_at TIMESTAMPTZ,
    raw_data JSONB DEFAULT '{}'::jsonb,
    connected_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. MASTER FAN PROFILES (deduplicated, merged)
-- ============================================
CREATE TABLE IF NOT EXISTS public.master_fans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    phone TEXT,
    city TEXT,
    country TEXT,
    preferred_genre TEXT,
    source_platforms JSONB DEFAULT '[]'::jsonb,
    artist_connections JSONB DEFAULT '[]'::jsonb,
    total_interactions INTEGER DEFAULT 0,
    first_seen_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    cubo_score NUMERIC(5,2) DEFAULT 0,
    tags JSONB DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_master_fans_email ON public.master_fans(email);

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS on all tables
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fan_captures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_fans ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts to fan_captures (for QR form submissions)
CREATE POLICY "Allow anonymous fan capture inserts" ON public.fan_captures
    FOR INSERT TO anon WITH CHECK (true);

-- Allow anonymous inserts to leads_capture (existing table)
-- (This should already exist, but just in case)
CREATE POLICY "Allow anonymous lead inserts" ON public.leads_capture
    FOR INSERT TO anon WITH CHECK (true);

-- Allow authenticated users to read their own artist data
CREATE POLICY "Artists can read own data" ON public.artists
    FOR SELECT TO authenticated USING (email = auth.email());

-- Allow service role full access (for admin operations)
CREATE POLICY "Service role full access artists" ON public.artists
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access fan_captures" ON public.fan_captures
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access social_connections" ON public.social_connections
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access master_fans" ON public.master_fans
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================
-- 6. FUNCTIONS
-- ============================================

-- Function to deduplicate fan captures into master_fans
CREATE OR REPLACE FUNCTION public.merge_fan_capture(capture_id UUID)
RETURNS UUID AS $$
DECLARE
    cap RECORD;
    master_id UUID;
BEGIN
    SELECT * INTO cap FROM public.fan_captures WHERE id = capture_id;

    -- Check if email already exists in master_fans
    SELECT id INTO master_id FROM public.master_fans WHERE email = cap.fan_email;

    IF master_id IS NULL THEN
        -- Create new master fan
        INSERT INTO public.master_fans (email, name, phone, preferred_genre, artist_connections, total_interactions)
        VALUES (cap.fan_email, cap.fan_name, cap.fan_phone, cap.genre_context,
                jsonb_build_array(cap.artist_slug), 1)
        RETURNING id INTO master_id;
    ELSE
        -- Update existing master fan
        UPDATE public.master_fans SET
            name = COALESCE(cap.fan_name, name),
            phone = COALESCE(cap.fan_phone, phone),
            total_interactions = total_interactions + 1,
            last_seen_at = NOW(),
            artist_connections = CASE
                WHEN NOT artist_connections ? cap.artist_slug
                THEN artist_connections || jsonb_build_array(cap.artist_slug)
                ELSE artist_connections
            END
        WHERE id = master_id;
    END IF;

    -- Mark capture as merged
    UPDATE public.fan_captures SET merged_to = master_id WHERE id = capture_id;

    RETURN master_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
