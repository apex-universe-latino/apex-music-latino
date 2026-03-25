---
name: Critical security issues found in March 2026 audit
description: Hardcoded Supabase service role key exposed in two public frontend HTML files
type: project
---

**SERVICE ROLE KEY hardcoded in public frontend — HIGH SEVERITY**

Files containing exposed service role key (full key hardcoded in JS):
1. `/genre/tango/arcoiris/index.html` line ~1716 — `SB_KEY = 'eyJ...service_role...'`
2. `/artist-portal/index.html` line 1231 — `SERVICE_KEY = 'eyJ...service_role...'`

The service role key bypasses ALL Row Level Security policies and grants full admin access to the database. Anyone who views source on either page can extract this key.

The anon key is also hardcoded in the EPK page (3 occurrences), which is acceptable for public-facing data but should be noted.

**Why:** These were shipped for speed during initial build. The portal uses the service key to read leads_capture and artists_config from the browser.

**How to apply:** When building any feature that touches DB reads/writes from the frontend, proxy through a serverless API function instead. The service role key must NEVER be in client-side code. Priority fix before any public promotion of the artist portal URL.
