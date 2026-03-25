---
name: API endpoint test results — March 25, 2026 audit
description: Live test results for all 7 Vercel serverless API endpoints
type: project
---

Tested against https://apexmusiclatino.com (production)

| Endpoint | Test | Result | Notes |
|---|---|---|---|
| GET /api/send-show-reminder?step=test&key=arcoiris2026&email=X | Happy path | PASS | sent=1 |
| GET /api/send-show-reminder?key=WRONG | Bad auth | PASS | 401 Invalid key |
| GET /api/send-show-reminder?key=arcoiris2026 | Missing step | PASS | 400 error |
| GET /api/send-show-reminder?step=99&key=arcoiris2026 | Invalid step | FAIL | Returns "Missing step param" instead of "Invalid step: 99" — silent fallthrough |
| GET /api/send-show-reminder?step=test&key=arcoiris2026 (no email) | Missing email | FAIL | Resend API error: "The `to` field must be a `string`" — unhandled, leaks internal error |
| GET /api/send-venue-outreach?step=test&key=arcoiris2026&email=X | Happy path | PASS | sent=1 |
| GET /api/send-venue-outreach?step=99&key=arcoiris2026 | Invalid step | PASS | Returns "Invalid step: 99" |
| POST /api/generate-outreach (Theaters, step 1) | Happy path | PASS | Returns subject + body_html + talking_points |
| POST /api/generate-outreach (Universities, step 3) | Category variation | PASS | Category-specific copy |
| POST /api/generate-outreach {} | Missing fields | PASS | 400 "Missing required field: venue_name" |
| POST /api/generate-outreach invalid step 99 | Out of range step | PASS | 400 "step must be between 1 and 12" |
| POST /api/generate-outreach invalid category | Unknown category | WARN | Falls back to generic template silently (no error) |
| POST /api/import-venues (empty array) | Empty input | PASS | 400 "Missing or empty venues array" |
| POST /api/import-venues (valid venue) | Table missing | FAIL | PGRST205 — venue_leads table doesn't exist |
| POST /api/schedule-campaign {} | Missing campaign_id | PASS | 400 "Missing campaign_id" |
| POST /api/schedule-campaign {campaign_id: x} | Table missing | FAIL | email_campaigns table doesn't exist |
| POST /api/send-blast-email | General | PASS | Works; CORS locked to apexmusiclatino.com |
| POST /api/create-checkout | Stripe not configured | FAIL (expected) | TODO price IDs |

**Key bugs found:**
1. send-show-reminder: step=99 returns "Missing step param" (wrong error message) because `!['1','2','3','test'].includes('99')` is true but error message says "missing" not "invalid"
2. send-show-reminder?step=test without email param: crashes into Resend with `to: undefined`, returns 422 from Resend
3. send-blast-email: SUPABASE_URL constructed as `https://${process.env.SUPABASE_PROJECT_ID}.supabase.co` — NO fallback. If env var missing, URL becomes `https://undefined.supabase.co` and silently fails
4. All campaign/venue/email_events operations fail because tables don't exist in Supabase
