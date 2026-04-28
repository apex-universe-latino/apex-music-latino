# HEARTBEAT.md — Apex Music Latino
> Real-time operational pulse of the platform. Updated every session.
> Think of this as the dashboard for the humans running the machine.

---

## ⚡ Current Sprint (Week of 2026-04-28)

### 🔴 CRITICAL / Unblocked
- [x] Supabase project `iaycaynevtumrqoknemk` restored (was paused)
- [x] Proxy hardened to detect paused state + surface UI error
- [x] Artist Portal restructured to VS Code 3-column layout
- [x] Asset History engine built (localStorage-backed per artist)
- [x] Onboarding Progress Tracker live (0-100% scoring)
- [x] AI Sidebar injected (structural — logic pending)

### 🟡 IN PROGRESS
- [ ] Arcoiris Tango — verify live data pull is working post-proxy fix
- [ ] Homepage Mega Menu — agent showcase + genre nav (see Phase 2 below)
- [ ] CUBO FRM System Design — wireframe for artist desktop app + mobile Rolodex

### 🟢 NEXT UP
- [ ] Nextel Chirp System — agent-to-artist notification prototype
- [ ] AI Sidebar Logic — hook up Kujo as the first active agent in sidebar
- [ ] Admin Portal — multi-artist master view with per-artist status

---

## 📡 Live System Status

| System | Status | Last Checked |
|--------|--------|--------------|
| Supabase `iaycaynevtumrqoknemk` | ✅ Active | 2026-04-28 |
| Vercel Deployment | ✅ Active | 2026-04-28 |
| Supabase Proxy (`/api/supabase-proxy`) | ✅ Active | 2026-04-28 |
| GitHub Sync | ✅ Active | 2026-04-28 |
| Artist Portal (`/artist-portal/`) | ✅ Rebuilt | 2026-04-28 |
| Admin Portal (`/admin/`) | ✅ Supabase-backed | 2026-04-28 |
| Trello Board (Arco Iris) | ✅ Updated | 2026-04-28 |

---

## 🗺️ Product Roadmap (Phased)

### Phase 1 — Foundation (NOW)
**Goal**: Artist portal stable, data flowing, onboarding working.
- [x] VS Code 3-column Artist Portal
- [x] QR code generation + asset history
- [x] FRM (fan data) visible and filterable
- [x] Supabase proxy stable
- [ ] Live test: Arcoiris scans real QR → data appears in FRM

### Phase 2 — Mega Menu + Homepage Upgrade
**Goal**: Homepage feels like a real ecosystem hub with CUBO front and center.
- [ ] Mega Menu: Genres | AI Agents | Marketplace | Artist OS | Academy
- [ ] Homepage: Add agent roster section (Kujo, Benji, Fido, Roxy, Scout)
- [ ] Homepage: Add "Own Your Data Forever" moat section
- [ ] Homepage: CUBO Data Engine stats block with live counters
- [ ] Homepage: Featured Artist cards with live fan count pull
- Detailed prompt for Stitch generation → see `docs/HOMEPAGE_PROMPT.md`

### Phase 3 — CUBO FRM Desktop App Wireframe
**Goal**: Define the full product spec for the artist-side CUBO FRM application.
- [ ] Wireframe: Mobile Rolodex (fan list, 360° profile, engagement score)
- [ ] Wireframe: Desktop App (full analytics, campaign manager, royalty tracker)
- [ ] Spec: QR → Progressive Profiling → Fan Profile → CUBO FRM pipeline
- [ ] Spec: Omni-channel data ingestion (Spotify, IG, TikTok, WhatsApp, QR)
- [ ] Spec: Nextel Chirp notification from agents to artist

### Phase 4 — Agent Activation
**Goal**: First live AI agent (Kujo) operating in the portal sidebar.
- [ ] Kujo v1: Venue search + outreach draft generation
- [ ] Benji v1: Revenue summary from Supabase data
- [ ] Nextel v1: Push notification on new hot lead detected
- [ ] Token metering system (Gold / Silver / Bronze tier billing)

### Phase 5 — Apex Universe Expansion
**Goal**: Template the portal for other artists and other verticals.
- [ ] Arcoiris template → Joey B instance → Andrade instance
- [ ] Template-ize: 1 Apex Music artist portal in <30 mins
- [ ] Apex Modelos Latino: Adapt CUBO FRM for creator monetization
- [ ] Apex Sports Latino: Athlete profile + agent outreach
- [ ] Apex News Latino: Editorial dashboard

---

## 🏗️ CUBO FRM — System Design Brief
*(For the wireframe team and the CTO)*

### What It Is
CUBO FRM is the fan relationship engine. It unifies fan data from:
- QR scans (our own)
- Instagram DMs (via Graph API)
- TikTok engagement (via API)
- Spotify listener data
- WhatsApp Business signals
- Event check-ins (future)

### Fan 360° Profile (Master Fan ID)
Each fan gets a unified profile that merges fragmented identities:
```
Master Fan ID: FAN-{uuid}
├── fan_email (primary key)
├── social_handles: { ig, tiktok, spotify }
├── engagement_signals: [ likes, dms, purchases, streams ]
├── fan_value_score: float (0-100)
├── purchase_probability: float (0-100)
├── tier: enum: cold | warm | hot | vip | superfan
├── city, country, language
└── last_active: timestamp
```

### Artist View (Desktop App)
- Full Rolodex: searchable, filterable fan list
- Fan profile drill-down: 360° view + timeline
- Campaign launcher: "Send to Hot Leads" button
- Revenue dashboard: streams × rate + merch + ticket sales
- Agent chirps: Kujo/Benji/Roxy notifications in sidebar

### Mobile View
- Compact Rolodex: scroll fan list, tap to see score
- Push notifications: Nextel chirp when hot lead detected
- Quick action: reply via WhatsApp / approve AI draft

---

## 🎯 Naming Conventions Reference

### The Pack (AI Agents)
| Name | Domain | Tier |
|------|--------|------|
| CUBO | Platform Heart / Data Engine | System |
| Kujo | Booking / Outreach / Closing | Gold |
| Benji | Revenue / Monetization | Gold |
| Fido | Fiduciary / Legal / Taxes | Silver |
| Roxy | PR / Image / EPK | Gold |
| Scout | A&R / Trend Watching | Silver |
| Nextel | Intercom / Notifications | System |

### Token Tier (Monetization)
- 🥇 **Gold** — Full reasoning, multi-step actions, content generation
- 🥈 **Silver** — Triggered responses, single-step data lookups
- 🥉 **Bronze** — Passive monitoring, read-only alerts

---

## 📝 Session Log

| Date | Key Actions | Agent |
|------|------------|-------|
| 2026-04-28 | Supabase restored, proxy hardened | Antigravity |
| 2026-04-28 | Artist Portal → VS Code layout | Antigravity |
| 2026-04-28 | Asset History + Onboarding Progress built | Antigravity |
| 2026-04-28 | Agent Roster defined (Kujo, Benji, Fido, Roxy, Scout, Nextel) | Antigravity |
| 2026-04-28 | SOUL.md + HEARTBEAT.md + MEMORY.MD updated | Antigravity |
| 2026-04-28 | Trello bugs acknowledged (Arco Iris publish, server pull, data visibility) | Antigravity |
