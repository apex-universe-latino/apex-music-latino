# Apex Music Latino — Task Plan (B.L.A.S.T. Protocol)

---

## Phase 0: Initialization
- [x] Create gemini.md (Project Constitution)
- [x] Create task_plan.md (this file)
- [x] Create findings.md
- [x] Create progress.md
- [x] Create architecture/, tools/, .tmp/ directories

## Phase 1: B — Blueprint (Vision & Logic)

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

### Layer 1: Architecture (SOPs)
- [ ] SOP: Genre page creation workflow
- [ ] SOP: Artist EPK onboarding flow
- [ ] SOP: Fan data capture pipeline
- [ ] SOP: QR code generation & tracking
- [ ] SOP: Lead-to-artist conversion funnel

### Layer 2: Navigation (Decision Making)
- [x] Genre detection via URL path
- [x] Theme application via data-genre attribute
- [x] Shared nav injection via nav.js
- [ ] Form submission routing to Supabase
- [ ] QR code → EPK → fan capture flow

### Layer 3: Tools (Execution)
- [ ] tools/qr_generator.py — Generate branded QR codes for artist EPKs
- [ ] tools/fan_capture.py — Process and store fan data from forms
- [ ] tools/social_scraper.py — Pull metrics from Spotify/IG/TikTok
- [ ] tools/epk_builder.py — Generate artist EPK pages from data
- [ ] tools/analytics_sync.py — Sync data to CUBO dashboard

## Phase 4: S — Stylize (Refinement)
- [x] Genre-adaptive CSS theme system (6 themes)
- [x] Glassmorphism + dark UI design language
- [x] Higgsfield.ai-inspired aesthetic
- [x] Mobile responsive layouts
- [ ] Animated transitions between genre switches
- [ ] Loading states and micro-interactions
- [ ] Form validation UX (inline errors, success states)
- [ ] QR code branded styling

## Phase 5: T — Trigger (Deployment)
- [x] Vercel deployment active (auto-deploy on push)
- [x] GitHub CI pipeline (push to master → deploy)
- [ ] Cron: Daily social metrics sync
- [ ] Webhook: Form submission → Supabase → notification
- [ ] Webhook: New artist signup → Slack/email alert
- [ ] Monitoring: Uptime + error tracking

---

## Current Status: Phase 3 (Architect) — Layer 1 SOPs needed
**Next Action**: Define SOPs in architecture/ for the core workflows, then build tools/
