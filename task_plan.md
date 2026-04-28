# Apex Music Latino — Task Plan (B.L.A.S.T. Protocol)

---

## Phase 0: Initialization
- [x] Create gemini.md (Project Constitution)
- [x] Create task_plan.md (this file)
- [x] Create findings.md
- [x] Create progress.md
- [x] Create architecture/, tools/, .tmp/ directories

## Phase 1: B — Blueprint (Vision & Logic)

### 2026-03-25 — Artist Portal CRM & Branding Finalization
*   **Booking CRM Finish**: Completed Pipeline stages, Venue Inbox (Search/Filter), CSV Import, and Template/Journey infrastructure.
*   **Arcoiris EPK verified**: Added five-track YouTube repertoire with detailed artist credits (Linhardt/Acevedo/Lissantheia).
*   **Global Logo Sync**: Standardized `aml_favicon.svg` and "Apex" text across ecosystem (Home, Marketplace, Academy, Dashboard, Pors, Gate).
*   **Booking Notification**: Configured `/api/send-booking-notification.js` to message `booking@apexmusiclatino.com`.
*   **Status**: Phase 4 COMPLETED. Ready for Phase 5 (Automation).
### Discovery Questions (5 of 5 answered)
1. **North Star**: Build a category-defining platform that turns Latin artists into companies — label + SaaS + marketplace + data engine
2. **Integrations**: Supabase (active), Vercel (active), GitHub (active), Spotify/Instagram/TikTok/WhatsApp (planned)
3. **Source of Truth**: Supabase database + CUBO data engine (owned by Datos Maestros)
4. **Delivery Payload**: Live website at Vercel + artist EPK pages as QR destinations + fan data flowing into Supabase
5. **Behavioral Rules**: Transparency-first, artist-owned data, genre-adaptive UI, bilingual (ES/EN), premium tone

### Data Schema
- [x] Lead Capture schema defined in gemini.md
- [x] Artist Profile schema defined in gemini.md
- [x] Fan Data Capture schema defined in gemini.md
- [x] Genre Theme Config defined in gemini.md

### Blueprint Deliverables
- [x] 15-page site structure defined
- [x] URL routing convention established
- [x] Genre theming system designed
- [x] Shared navigation architecture designed

## Phase 2: L — Link (Connectivity)
- [x] Supabase connection verified (anon key in apex-engine.js)
- [x] GitHub SSH verified (push successful)
- [x] Vercel deployment pipeline active
- [ ] Spotify API connection — NOT YET (keys needed)
- [ ] Instagram Graph API — NOT YET (keys needed)
- [ ] TikTok API — NOT YET (keys needed)
- [ ] WhatsApp Business API — NOT YET (keys needed)

## Phase 3: A — Architect (3-Layer Build)
- [x] Artist Portal Branding (aml_favicon.svg, Dark Mode)
- [x] CRM Infrastructure (Supabase `venue_leads`, `email_events`)
- [x] CRM Pipeline Stages (New, Contacted, Responded, Interested, Booked, Declined)
- [x] CRM Template Library (8+ category-specific outreach templates)
- [x] CRM Journey Builder (12-step automated sequence draft)
- [x] CRM CSV Import with Column Mapping & Duplication Check 
- [x] CRM Search & Advanced Filtering (Genre, City, Category)

### Layer 1: Architecture (SOPs)
- [x] SOP: Genre page creation workflow
- [x] SOP: Artist EPK onboarding flow
- [x] SOP: Fan data capture pipeline
- [x] SOP: QR code generation & tracking
- [x] SOP: Lead-to-artist conversion funnel

### Layer 2: Navigation (Decision Making)
- [x] Genre detection via URL path
- [x] Theme application via data-genre attribute
- [x] Shared nav injection via nav.js
- [x] Form submission routing to Supabase
- [x] QR code → EPK → fan capture flow (?qr=1 gated flow)

### Layer 3: Tools (Execution)
- [x] tools/qr_generator.py — Branded QR codes (integrated in Portal)
- [x] tools/fan_capture.py — Lead Capture flow (integrated in EPKs)
- [ ] tools/social_scraper.py — Pull metrics from Spotify/IG/TikTok
- [x] tools/epk_builder.py — EPK Layouts (Arcoiris, Joey B examples)
- [ ] tools/analytics_sync.py — Sync CRM status to CUBO dashboard

## Phase 4: S — Stylize (Refinement)
- [x] Genre-adaptive CSS theme system (6 themes)
- [x] Arcoiris EPK branding: `aml_favicon.svg` (White on Dark)
- [x] Arcoiris Media: 5 verified Youtube IDs with artist credits
- [x] Portal: CRM Pipeline + Inbox + Journey Builder + CSV Import
- [x] Branding: `/Branding /aml_favicon.svg` + "Apex" text standardization (19+ pages)
- [x] Glassmorphism + dark UI design (Portal + EPKs)
- [x] Higgsfield.ai-inspired aesthetic
- [x] Mobile responsive layouts
- [x] Branding: `aml_favicon.svg` white-on-dark logo standard
- [x] QR code branded styling (White background for legibility)
- [ ] Animated transitions between genre switches
- [x] Micro-animations (hover effects, card glows)
- [x] Form validation UX (Booking form validation)

## Phase 5: Automation & Deployment (T - Trigger)
- [ ] 📧 **Email Integration**: Fan Welcome Email (Fan ID delivery via Resend)
- [ ] 📊 **Dynamic Dashboard**: Live Social Stats (Spotify/YT scraper & API)
- [ ] 🚀 **CRM Outreach**: Launch automated "Venue Discovery" journeys
- [ ] 🔒 **Security Hardening**: Move `SERVICE_KEY` and `RESEND_API_KEY` to Vercel Env Vars
- [ ] 📅 **Campaign Reminders**: March 25 show & March 31 offer countdown notifications
- [x] Vercel deployment active (auto-deploy on push)
- [x] GitHub CI pipeline (push to master → deploy)
- [ ] Cron: Daily social metrics sync
- [ ] Webhook: Form submission → Supabase → notification
- [ ] Webhook: New artist signup → Slack/email alert
- [ ] Monitoring: Uptime + error tracking

---

## Current Status: Phase 5 (Trigger) — Final Deployment & Automation 
**Next Action**: Finalize analytics dashboard in Artist Portal and schedule daily syncs for CRM outreach statuses.
