---
name: Supabase schema — actual tables confirmed live
description: Definitive list of tables that exist in Supabase project iaycaynevtumrqoknemk as of March 2026
type: project
---

Tables confirmed via OpenAPI introspection (GET /rest/v1/):

| Table | Status | Notes |
|---|---|---|
| leads_capture | EXISTS, has data | 14 records, fan QR scan data. Key fields: id, created_at, artist_name, genre, email, mood_preference (JSONB), marketing_source |
| artists | EXISTS, has data | 3 artists: Arcoiris, Joey B, Andrade. fan_count/stream_count are placeholder mock values |
| artists_config | EXISTS, has data | EPK config per artist slug. Arcoiris config includes shows, music, videography |
| master_fans | EXISTS, empty | MDM fan master table — schema exists but no data yet |
| fan_captures | EXISTS, empty | Second fan capture table — no data, no created_at column |
| social_connections | EXISTS, empty | No data |

Tables that DO NOT EXIST (referenced in code but not created):
- email_campaigns — PGRST205 error
- scheduled_emails — PGRST205 error
- email_events — PGRST205 error
- venue_leads — PGRST205 error

**Why:** The Marketing Hub, Campaigns, Journeys, and Booking CRM features are fully built in the portal UI but their backing Supabase tables have never been created via migration.

**How to apply:** Any work touching campaigns, venue outreach, scheduling, or email analytics will fail at DB layer. These tables must be created before those features can be tested end-to-end.
