# Apex Music Latino — Product Requirements Document (PRD)
> Last updated: 2026-08-25
> Status: Phase 1 MVP (Live) → Phase 2 (In Progress)

---

## 0. Infrastructure & Connection Status (2026-08-25 audit)

### 0.1 Connected / Working
| Connection | Status | Notes |
|------------|--------|-------|
| GitHub (`apex-universe-latino/apex-music-latino`) | CONNECTED | Working branch: `claude/hopeful-clarke-a83is8`; push access confirmed |
| Vercel hosting | LIVE | Auto-deploy on push to `main` |
| Zoho CRM / Mail / Bookings (MCP) | CONNECTED | Available for CRM automation |
| Gmail (MCP) | CONNECTED | Available for email flows |

### 0.2 NOT Connected / Blockers
| Connection | Status | Action Needed |
|------------|--------|---------------|
| Supabase MCP (`supabase-apex`) | NOT AUTHENTICATED | Authorize via claude.ai connector settings or `/mcp` in an interactive session — migrations cannot run until then |
| Analytics (GA4 / Vercel Analytics) | NOT INSTALLED | No tracking script on the main site. Only a stray GA-like ID fragment in `alissontrigos/Instagram.html`. Decide: GA4 vs Vercel Analytics, then add site-wide snippet |
| Quo (MCP) | NOT AUTHENTICATED | Authorize if phone/SMS workflows are needed |

### 0.3 CRITICAL: Supabase project ref mismatch
Four different Supabase project refs exist across the ecosystem — these must be reconciled before any backend work:

| Ref | Where it appears |
|-----|------------------|
| `xtfmwtzjbudqmenfmhim` | 17 references in live site JS (leads capture, artist portal) — the de facto production DB |
| `laykneyclcirdionugxt` | 1 stray reference in site code |
| `iaycaynevtumrqoknemk` | `.mcp.json` (the project the Supabase MCP server points at) |
| `kkumwjwvirccvmlgvowi` | Six1Trey book blueprint (separate project, separate repo) |
| `cyxghqoxsygexrpeldcf` | **Six1Trey book project (confirmed 2026-08-25) — NOT for Apex.** A cutover to it was applied and reverted in PR #7 |

**Decision needed**: which project is canonical for Apex Music Latino, then align `.mcp.json` and site JS to it. Note the code's URL/key pairs are currently MISMATCHED (e.g. `xtfm…` URLs signed with `iayc…` keys → 401s), so lead capture is silently falling back to localStorage.

**⚠️ SECURITY — action required**: a `service_role` key (full admin) for `iaycaynevtumrqoknemk` was hard-coded in public HTML (arcoiristango/*, alissontrigos EPK) in this public repo. It has been replaced with the anon key in current code, but it remains in git history — **rotate that project's JWT secret / service_role key in the Supabase dashboard**, and set the key only as a Vercel env var (`SUPABASE_SERVICE_ROLE_KEY`).

### 0.4 Repos visible to this GitHub connection
`apex-music-latino` (this one), `apex-p2p-portal`, `i-luv-medallo`, `i-luv-santa-rosa`, `gringhos`.
**The Six1Trey book repo is NOT in this list** — to work on the book, grant the Claude GitHub app access to that repo (GitHub settings → Claude app → repository access), or confirm where the book code lives.

---

## 1. Executive Summary

**Apex Music Latino** is a data-driven music ecosystem that combines a record label, artist incubator, digital distribution platform, influencer marketplace, fan CRM, and education platform — all targeting the Latin American music market, starting from Colombia.

**Mission**: "We don't just sign artists. We turn them into companies."

**Parent Company**: Datos Maestros (data intelligence)
**Data Engine**: CUBO (proprietary CRM/matching)
**First Client**: Arcoiris (tango group, Bucaramanga show March 25, 2026)

---

## 2. What's Been Built (Phase 1 — LIVE)

### 2.1 Public Website (19+ pages)
| Page | URL | Status |
|------|-----|--------|
| Main Landing | `/` | LIVE — genre chooser, ecosystem overview, featured artists |
| Reggaeton Landing | `/genre/reggaeton/` | LIVE — pink/magenta theme |
| Tango Landing | `/genre/tango/` | LIVE — crimson red theme |
| Rap Landing | `/genre/rap/` | LIVE — cyan/blue theme |
| Rock Landing | `/genre/rock/` | LIVE — amber/fire theme |
| Electronic Landing | `/genre/electronic/` | LIVE — teal/neon theme |
| Afro-Latin Landing | `/genre/afro-latin/` | LIVE — gold/warm theme |
| Joey B EPK | `/genre/rap/joey-b/` | LIVE — full artist profile |
| Arcoiris EPK | `/genre/tango/arcoiris/` | LIVE — EPK + lead gate + carousel + show data |
| Artist Directory | `/artists/` | LIVE — 6 artists with EPK links |
| Marketplace | `/marketplace/` | LIVE — artist discovery + booking |
| Academy | `/academy/` | LIVE — education platform |
| Dashboard (public) | `/dashboard/` | LIVE — Artist OS preview |
| Studio | `/studio/` | LIVE — CUBO AI tools |
| Onboarding | `/onboarding/` | LIVE — artist signup form |
| Blog (EN) | `/blog/` | LIVE — 6 bilingual articles |
| Blog (ES) | `/blog/es/` | LIVE — Spanish blog |
| Terms & Conditions | `/legal/terms.html` | LIVE — bilingual, Colombia law compliant |

### 2.2 Lead Capture Gate (Arcoiris)
| Feature | Status |
|---------|--------|
| QR-only trigger (`?qr=1`) | LIVE |
| Video background (real Arcoiris promo) | LIVE |
| Parallax mouse effect | LIVE |
| Form: name, email, phone, title | LIVE |
| Fan Universal ID (AML-TN-ARC-001) | LIVE |
| Master internal ID (APEX-{ts}-{seq}) | LIVE |
| Device data collection (type, browser, screen, OS) | LIVE |
| Geolocation (with permission) | LIVE |
| Terms & conditions link | LIVE |
| Success screen with Fan ID | LIVE |
| Social follow links (IG, YT, TikTok, Spotify) | LIVE |
| March 31 offer deadline | LIVE |
| localStorage fallback if Supabase fails | LIVE |
| 30-day gate bypass cookie | LIVE |
| Data saves to Supabase `leads_capture` | LIVE — 3 records captured |

### 2.3 Admin CMS
| Feature | URL | Status |
|---------|-----|--------|
| Admin Dashboard | `/admin/` | LIVE — stats, artist editor |
| QR Code Generator | `/admin/qr.html` | LIVE — download PNG, custom colors |
| Artist Profile Editor | `/admin/` → Artists | LIVE — bio, images, releases, shows |
| Blog Management | `/admin/` → Blog | Placeholder (Decap CMS coming) |
| Flyer/Media Upload | `/admin/` → Flyers | LIVE — localStorage (Supabase Storage coming) |

### 2.4 Artist Portal (Self-Service Backend)
| Feature | URL | Status |
|---------|-----|--------|
| Artist Login | `/artist-portal/` | LIVE — slug-based auth |
| Dashboard | Sidebar → Dashboard | LIVE — stats from Supabase |
| FRM (Fan Data) | Sidebar → FRM | LIVE — real Supabase data in table |
| EPK Editor | Sidebar → EPK | LIVE — 8 section visual editor |
| Asset Generator | Sidebar → Asset Generator | LIVE — QR code + download |
| Marketing Hub | Sidebar → Marketing Hub | Coming Soon (locked) |
| Subscription | Sidebar → Subscription | Coming Soon (Stripe) |
| Royalties | Sidebar → Royalties | Coming Soon |
| Legal | Sidebar → Legal | Coming Soon |

### 2.5 Technical Infrastructure
| Component | Technology | Status |
|-----------|-----------|--------|
| Frontend | Static HTML + Tailwind CSS + Vanilla JS | LIVE |
| Hosting | Vercel (auto-deploy on push) | LIVE |
| Database | Supabase (leads_capture table) | LIVE |
| Source Control | GitHub (apex-universe-latino) | LIVE |
| Genre Theming | CSS custom properties + data-genre | LIVE |
| i18n | JS-based EN/ES toggle + localStorage | LIVE |
| Navigation | Shared nav.js injection | LIVE |
| Blog Engine | JS-rendered from blog-data.js | LIVE |
| URL Routing | Vercel rewrites (vercel.json) | LIVE |

### 2.6 Content
| Content | Count | Status |
|---------|-------|--------|
| Genre pages | 6 | LIVE |
| Artist EPKs | 2 (Joey B, Arcoiris) | LIVE |
| Blog articles (bilingual) | 6 | LIVE |
| Real artist images | 8 (Bucaramanga show) | LIVE |
| Real promo video | 1 (compressed 3.7MB) | LIVE |
| Image carousel | 8 slides | LIVE |

### 2.7 Architecture Documentation
| Document | Path | Purpose |
|----------|------|---------|
| gemini.md | `/gemini.md` | Project constitution — schemas, rules, invariants |
| task_plan.md | `/task_plan.md` | B.L.A.S.T. phase checklist |
| findings.md | `/findings.md` | Research & discoveries |
| progress.md | `/progress.md` | Execution log |
| Genre Page SOP | `/architecture/genre-page-creation.md` | How to create genre pages |
| Artist EPK SOP | `/architecture/artist-epk-flow.md` | EPK creation workflow |
| Fan Capture SOP | `/architecture/fan-data-capture.md` | Data pipeline |
| Fan ID SOP | `/architecture/fan-id-system.md` | Universal ID + progressive profiling |
| Supabase Schema | `/architecture/supabase-schema.sql` | Full DB schema (ready to run) |
| Email System SOP | `/architecture/email-system.md` | Auto-reply + 24-step journeys |
| Subscription Model | `/architecture/subscription-model.md` | Pricing, Stripe, cron jobs |
| Fan App Model | `/architecture/fan-app-model.md` | PWA, subscriptions, AI agents |

---

## 3. Phase 2 — Immediate Priorities (Next Sprint)

### 3.1 Email Auto-Reply System
- Fan submits gate form → receives welcome email with Fan ID
- Service: Resend.com (free tier) or dedicated SMTP
- Email template: bilingual, branded, includes social links
- **Blocker**: Need email service API key

### 3.2 Supabase Schema Upgrade
- Run `architecture/supabase-schema.sql` to create:
  - `artists` table (profiles)
  - `fan_captures` table (structured data + dedup)
  - `social_connections` table (OAuth tokens)
  - `master_fans` table (golden records)
- Enables: proper FRM, dedup, progressive profiling
- **Blocker**: Need to run SQL in Supabase dashboard

### 3.3 Enhanced Artist Dashboard
- Social media fan counts (FB, IG, TikTok, YouTube, Spotify)
- Golden records count (deduplicated fans)
- Sentiment analysis widget (positive/negative from comments)
- Email campaign stats
- Scraping results (leads from marketing outreach)
- War room / command center view

### 3.4 OAuth Social Login
- Google Sign-In on gate form
- Apple Sign-In
- Facebook Login
- Captures additional profile data automatically
- More data without more form fields

### 3.5 Enhanced Asset Generator
- Customizable gate form (choose which questions to ask)
- Background image/video selection
- Color theming per QR campaign
- Short URL generation (Bitly or custom)
- Campaign tracking (which QR code / link generated which leads)
- Multiple QR codes per artist (different campaigns)

### 3.6 Enhanced FRM
- Spreadsheet-style scrollable table
- Columns: Fan ID, Master ID, Score, Sentiment, Followers, Device, Location, all captured fields
- Sort, filter, search
- Export (Pro tier only)
- Fan profile detail view (click a row → see full profile)
- Deduplication status (staged → merged → golden)

### 3.7 CMS for Artist EPK
- Visual WYSIWYG editor for EPK pages
- Upload images directly (Supabase Storage)
- Change banner video
- Edit text inline
- Preview changes before publish
- Community manager access (separate login)

### 3.8 Review Center (concept — needs scoping)
- GasBuddy-style structure/layout inspiration: clean card grid, prominent scores, icon-driven navigation
- Aggregate public reviews per artist/venue from multiple sources (Google, Yelp, Angi) into one unified score
- Fuzzy matching to join the same entity across sources; averaged/weighted composite score
- Contact info gated — inquiries route through the Apex platform
- **Compliance gate before build**: Google/Yelp/Angi ToS restrict scraping and republishing reviews. Prefer official APIs (Google Places API returns rating + up to 5 reviews legitimately; Yelp Fusion API similar). Scraping-based ingestion is a legal/ToS risk — decision needed before any cron job is built.

### 3.9 Six1Trey Book Platform (separate repo — not in this codebase)
- Chapter comments (guest + authenticated) and global audio player are specced for the Six1Trey React app, Supabase project `kkumwjwvirccvmlgvowi`
- Blocked here: that repo is not accessible to this GitHub connection (see §0.4)

---

## 4. Phase 3 — Growth Features

### 4.1 Marketing Hub
- Email campaigns (Resend/SendGrid)
- SMS/WhatsApp broadcasts (Twilio)
- Social media scheduler
- A/B testing for subject lines
- 24-step automated journey builder
- Audience segmentation (CUBO)

### 4.2 Digital Distribution
- Music upload + distribution to Spotify, Apple Music, etc.
- Competing with OneRPM
- Royalty tracking + transparent dashboards
- ISRC code management

### 4.3 Subscription & Payments
- Stripe integration
- Freemium / Pro ($300) / Enterprise ($500) tiers
- Layaway plan option ($100/mo build-as-you-go)
- Feature gating based on tier
- Commission on merch/booking sales

### 4.4 AI Agents (OpenCloud)
- Community manager bots per artist
- Auto-reply to DMs and comments
- Content generation (captions, emails, press releases)
- Sentiment analysis (positive/negative comment tracking)
- Fan scoring (ambassador detection, hot leads)
- Scheduled cron jobs for scraping + outreach

### 4.5 Progressive Profiling
- Each fan visit asks ONE new question
- Build complete fan profiles over time
- Custom questions per artist subscription tier
- Lookalike audience generation for advertising

### 4.6 Fan App (PWA → Native)
- Artist-branded micro-apps
- Superfan subscriptions ($4.99-$49.99/mo)
- Video peer-to-peer (WebRTC)
- Giveaways, raffles using Fan ID
- Push notifications
- Gamification (points for follows, shares, comments)
- Ambassador program

### 4.7 Sentiment Analysis / War Room
- Scrape comments from YouTube, IG, FB, TikTok
- NLP classification (positive/negative/neutral)
- Alert system for negative trends
- Ambassador detection (positive superfans)
- Troll blocking automation
- Real-time dashboard

### 4.8 Data Scraping Pipeline
- Marketing agency outreach (DJs, A&Rs, clubs, venues)
- Mass email campaigns for cold outreach
- Lead enrichment from public data
- Cron job architecture for scheduled scrapes
- Bucket storage for raw scraped data
- Dedup + merge into master_fans via CUBO IQ

---

## 5. Business Model Summary

### Revenue Streams
1. **Artist Subscriptions**: $0-$1000+/mo per artist
2. **Commission**: % on merch, booking, brand deals through platform
3. **Data Services**: Fan analytics, audience insights, lookalike generation
4. **Marketing Services**: Email campaigns, social management, outreach
5. **Digital Distribution**: Music distribution + royalty tracking
6. **Fan Subscriptions**: Superfan tiers via artist micro-apps
7. **AI Agents**: Per-agent/month add-on pricing

### Artist Tier Comparison
| Feature | Freemium | Pro ($300/mo) | Enterprise ($500+/mo) |
|---------|----------|--------------|----------------------|
| EPK Page | 1 | Unlimited | Unlimited + custom domain |
| QR Codes | 1/month | Unlimited | Unlimited + analytics |
| Fan Data | View only | Export CSV | Full API + webhooks |
| Gate Questions | 4 (fixed) | +1 custom/mo | Unlimited |
| Email Campaigns | 0 | 1000/mo | Unlimited |
| AI Agents | 0 | 1 bot | Unlimited |
| Distribution | No | Basic | Full + priority |
| Support | Community | Email | Dedicated manager |

---

## 6. Technical Roadmap

### Now (Week 1)
- [x] Static website (19 pages)
- [x] Genre theming (6 themes)
- [x] Lead capture gate with Fan ID
- [x] Artist portal with FRM
- [x] QR code generator
- [x] Blog (bilingual)
- [x] i18n (EN/ES)
- [ ] Run Supabase schema SQL
- [ ] Email auto-reply (need API key)

### Week 2-3
- [ ] OAuth social login (Google, Apple, FB)
- [ ] Enhanced FRM (spreadsheet view, scoring)
- [ ] Image upload to Supabase Storage
- [ ] CMS visual EPK editor
- [ ] Short URL service
- [ ] Supabase Auth for real artist login

### Month 2
- [ ] Email campaign builder (Resend/SendGrid)
- [ ] SMS/WhatsApp (Twilio)
- [ ] Progressive profiling engine
- [ ] Sentiment analysis MVP
- [ ] Stripe subscription billing

### Month 3
- [ ] AI agents (OpenCloud)
- [ ] Digital distribution pipeline
- [ ] Fan app (PWA)
- [ ] Data scraping cron jobs
- [ ] War room dashboard

### Month 4+
- [ ] Native mobile app
- [ ] Video peer-to-peer
- [ ] Full CUBO IQ matching engine
- [ ] Lookalike audience generator
- [ ] Ambassador/gamification system

---

## 7. Key Metrics to Track

| Metric | Current | Target (Month 1) | Target (Month 3) |
|--------|---------|-------------------|-------------------|
| Artists signed | 3 | 10 | 50 |
| Fan captures | 3 | 500 | 5,000 |
| Golden records | 0 | 300 | 3,000 |
| QR scans | ~5 | 200 | 2,000 |
| Email open rate | — | 40% | 50% |
| Artist retention | — | 80% | 90% |

---

## 8. Competitors & Differentiation

| Competitor | What They Do | How Apex Differs |
|-----------|-------------|-----------------|
| OneRPM | Distribution + royalties | + FRM + AI agents + marketplace |
| Linktree | Link pages | + Data capture + CRM + Fan ID |
| Mailchimp | Email marketing | + Music-specific + CUBO intelligence |
| Spotify for Artists | Analytics | + Action tools + marketing + distribution |
| RealFluencers | Influencer marketplace | + Artist focus + data ownership |

**Apex's moat**: The combination of FRM + Fan ID + progressive profiling + CUBO matching that NO other platform offers to Latin artists.

---

*This PRD is a living document. Updated after every sprint.*
*Generated from the Apex Music Latino codebase. B.L.A.S.T. protocol active.*
