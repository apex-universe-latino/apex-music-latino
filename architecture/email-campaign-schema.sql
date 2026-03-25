-- ============================================================
-- EMAIL CAMPAIGN ENGINE — Supabase Schema
-- Run this in Supabase SQL Editor for project iaycaynevtumrqoknemk
-- ============================================================

-- 1. EMAIL CAMPAIGNS (blast, sequence, show_reminder, venue_outreach)
CREATE TABLE IF NOT EXISTS public.email_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    artist_slug TEXT NOT NULL,
    campaign_name TEXT NOT NULL,
    campaign_type TEXT NOT NULL CHECK (campaign_type IN ('blast', 'sequence', 'show_reminder', 'venue_outreach')),
    subject_template TEXT NOT NULL,
    body_html_template TEXT NOT NULL DEFAULT '',
    from_label TEXT,
    audience_filter JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled')),
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    total_recipients INTEGER DEFAULT 0,
    total_sent INTEGER DEFAULT 0,
    total_failed INTEGER DEFAULT 0,
    total_opened INTEGER DEFAULT 0,
    total_clicked INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_artist ON public.email_campaigns(artist_slug);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.email_campaigns(status);

ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on email_campaigns" ON public.email_campaigns
    FOR ALL USING (auth.role() = 'service_role');

-- 2. SCHEDULED EMAILS (the work queue — cron processor polls this)
CREATE TABLE IF NOT EXISTS public.scheduled_emails (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES public.email_campaigns(id),
    sequence_id UUID,
    step_id UUID,
    recipient_email TEXT NOT NULL,
    recipient_name TEXT,
    recipient_type TEXT DEFAULT 'fan' CHECK (recipient_type IN ('fan', 'venue')),
    subject TEXT NOT NULL,
    body_html TEXT NOT NULL,
    from_label TEXT,
    send_at TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sending', 'sent', 'failed', 'cancelled')),
    resend_message_id TEXT,
    error_message TEXT,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scheduled_pending ON public.scheduled_emails(status, send_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_scheduled_campaign ON public.scheduled_emails(campaign_id);

ALTER TABLE public.scheduled_emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on scheduled_emails" ON public.scheduled_emails
    FOR ALL USING (auth.role() = 'service_role');

-- 3. EMAIL EVENTS (opens, clicks, bounces — populated by Resend webhooks)
CREATE TABLE IF NOT EXISTS public.email_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    scheduled_email_id UUID REFERENCES public.scheduled_emails(id),
    campaign_id UUID REFERENCES public.email_campaigns(id),
    event_type TEXT NOT NULL CHECK (event_type IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained', 'unsubscribed')),
    recipient_email TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    occurred_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_campaign ON public.email_events(campaign_id);
CREATE INDEX IF NOT EXISTS idx_events_email ON public.email_events(recipient_email);

ALTER TABLE public.email_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on email_events" ON public.email_events
    FOR ALL USING (auth.role() = 'service_role');

-- 4. VENUE LEADS (scraped venue/org contacts)
CREATE TABLE IF NOT EXISTS public.venue_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    artist_slug TEXT,
    company_name TEXT NOT NULL,
    category TEXT,
    city TEXT DEFAULT 'Bucaramanga',
    country TEXT DEFAULT 'CO',
    website TEXT,
    phone TEXT,
    email TEXT,
    contact_name TEXT,
    outreach_status TEXT DEFAULT 'new' CHECK (outreach_status IN ('new', 'contacted', 'responded', 'interested', 'booked', 'declined', 'no_response')),
    last_contacted_at TIMESTAMPTZ,
    notes TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    source TEXT DEFAULT 'scrape',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_venue_city ON public.venue_leads(city);
CREATE INDEX IF NOT EXISTS idx_venue_category ON public.venue_leads(category);
CREATE INDEX IF NOT EXISTS idx_venue_status ON public.venue_leads(outreach_status);

ALTER TABLE public.venue_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on venue_leads" ON public.venue_leads
    FOR ALL USING (auth.role() = 'service_role');

-- 5. EMAIL SEQUENCES (journey builder backbone)
CREATE TABLE IF NOT EXISTS public.email_sequences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    artist_slug TEXT NOT NULL,
    sequence_name TEXT NOT NULL,
    description TEXT,
    trigger_event TEXT NOT NULL CHECK (trigger_event IN ('fan_capture', 'show_reminder', 'manual', 'venue_import')),
    is_active BOOLEAN DEFAULT false,
    total_steps INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.email_sequences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on email_sequences" ON public.email_sequences
    FOR ALL USING (auth.role() = 'service_role');

-- 6. SEQUENCE STEPS (individual emails in a journey)
CREATE TABLE IF NOT EXISTS public.sequence_steps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sequence_id UUID REFERENCES public.email_sequences(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    delay_minutes INTEGER NOT NULL DEFAULT 0,
    subject_template TEXT NOT NULL,
    body_html_template TEXT NOT NULL,
    from_label TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_steps_sequence ON public.sequence_steps(sequence_id, step_number);

ALTER TABLE public.sequence_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on sequence_steps" ON public.sequence_steps
    FOR ALL USING (auth.role() = 'service_role');

-- Helper function: increment campaign sent counter
CREATE OR REPLACE FUNCTION public.increment_campaign_sent(cid UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.email_campaigns
    SET total_sent = total_sent + 1, updated_at = NOW()
    WHERE id = cid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
