# Apex Music Latino — Project Memory & SOP Ledger
> The living operational brain of Apex Music Latino. Updated by agents and operators.
> Source of Truth for Skills, SOPs, Agent Logic, and Architectural Patterns.

---

## 🏗️ Architectural Foundations

- **Nucleus Pattern**: Every artist site is a self-contained "Golden Template" embedding `cubo-engine.js`.
- **Data-First EPK**: Separating content (JSON) from shell (HTML) for rapid multi-artist scaling.
- **VS Code Layout**: 3-column architecture — Activity Bar (48px) | Explorer Sidebar (240px) | Editor Canvas.
- **Template Philosophy**: Artist portals are plug-and-play instances spawned from a master template. Each connects back to Apex/CUBO as the data spine.
- **Powered by CUBO**: The matching engine, data backbone, and intelligence layer. Built by Datos Maestros.

---

## 🤖 Agent Roster (The Apex Pack)

Each agent is a specialized AI bot with a defined role in the artist's career ecosystem.

| Agent | Role | Tier | Description |
|-------|------|------|-------------|
| **CUBO** | Platform Heart | — | The data engine. Not an agent — the nervous system. All agents feed from and report to CUBO. Built by Datos Maestros. |
| **Kujo** | The Closer / Booking | 🥇 Gold | Hunts venues and closes deals. Runs 12-step outreach sequences. Never tires, follows up 10x. |
| **Benji** | Revenue Intelligence | 🥇 Gold | Focused on the Benjamins. Monitors income, royalties, monetization triggers, fan purchase signals. |
| **Fido** | Fiduciary / Legal | 🥈 Silver | Watches overhead, costs, taxes. Warns artists before they become the next rapper who lost it all. Publishing rights, contract red flags. |
| **Roxy** | PR & Image Maker | 🥇 Gold | Publicist bot. Generates EPKs, manages brand image, press releases, social narrative. |
| **Scout** | A&R Intelligence | 🥈 Silver | Watches genre trends, venue heat maps, emerging talent signals. Reports to talent team. |
| **Nextel** | Intercom / Agent Relay | 🔧 System | Chirp-style notification system between agents and the artist. "You've got a Hot Lead — chirp!" |

### Agent Token Tier System
Agents consume AI tokens at different rates. Pricing tier reflects token intensity:
- 🥇 **Gold** — Full autonomous execution, multi-step reasoning, content generation.
- 🥈 **Silver** — Triggered responses, data lookups, single-step actions.
- 🥉 **Bronze** — Monitoring, alerts, read-only intelligence.

### Future Agent Names (Reserved)
Additional naming families under consideration:
- **Gem Family**: Onyx, Jade, Opal, Quartz (data purity tiers)
- **Element Family**: Titan, Carbon, Flux, Neon (technical role agents)

---

## 📊 Process Audit (Skill Meter)

| Process Category | Frequency | Friction | Status | Skill Mapping |
|------------------|-----------|----------|--------|---------------|
| Artist EPK Setup | High | Medium | Manual | `EPK_GEN_v1` |
| Lead Gate Implementation | High | Low | Template | `LEAD_CAPTURE_v2` |
| Branding Standardization | Medium | Low | Manual | `BRAND_SYNC_v1` |
| Trello/Memory Logging | High | Low | Agentic | `ADMIN_LOG_v1` |
| CUBO Bot Deployment | Low | High | Research | `BOT_DEPLOY_v1` |
| Artist Onboarding | High | Medium | Skill-Ready | `ONBOARDING_PROSPECT_v1` |
| Asset History Tracking | Medium | Low | Live | Built into Portal |
| Venue Outreach (CRM) | High | Medium | Partial | `KUJO_OUTREACH_v1` |
| Royalty Transparency | Low | High | Planned | `FIDO_AUDIT_v1` |

---

## 🧠 Skill Definitions

### `EPK_GEN_v1`
**Description**: Takes raw artist assets (Bio, Repertoire, Videos) and generates a high-fidelity branded site.
**Current SOP**: Manual extraction from `/genre/` → migration to standalone directory.

### `LEAD_CAPTURE_v2`
**Description**: Progressive profiling gate triggered by `?qr=1` on landing pages.
**Current SOP**: QR scan → form → `leads_capture` Supabase table → LocalStorage fallback if offline.

### `ONBOARDING_PROSPECT_v1`
**Description**: Automated workflow guiding new artists from first touch to active portal user.
**Implementation**: Spotlight UI + Progress Tracker (0-100%) + Admin Dashboard approval gate.
**Steps**: Profile fill → EPK publish → First fan pull → Asset generation.

### `KUJO_OUTREACH_v1`
**Description**: 12-step automated venue outreach sequence using AI-generated templates.
**Implementation**: CRM → Template Engine → Journey Builder → Auto-send via SMTP proxy.

### `FIDO_AUDIT_v1` (Planned)
**Description**: Royalty split calculator + cost tracker + publishing rights monitor for artists.
**Goal**: Solve the "opaque accounting" problem that destroyed careers at legacy labels.

---

## 🖥️ UI/UX Patterns

- **VS Code Layout**: Activity Bar | Explorer | Editor Canvas | AI Sidebar (Right) | Status Bar (Bottom).
- **Glassmorphism**: `rgba(255,255,255,0.05)` backgrounds, 1px borders, `backdrop-filter: blur(8px)`.
- **Accent System**: Per-artist/genre accent color drives all glow, border, and highlight states.
- **Onboarding Spotlight**: Dimmed overlay + pulsing ring highlights the next action for new artists.
- **Asset History Panel**: `localStorage` log of all generated QR codes and shareable links per artist.

---

## ⚙️ Infrastructure

- **Supabase Project**: `iaycaynevtumrqoknemk` (Active)
- **Supabase Proxy**: `api/supabase-proxy.js` — all DB sync routes through here. SERVICE_ROLE_KEY server-side only.
- **Hosting**: Vercel (apex-universe-latinos-projects)
- **Asset History**: Persisted in `localStorage` per artist slug. Key: `asset_history_{slug}`.
- **Onboarding Tracking**: Calculated via JS polling `localStorage` + `sbProxy` state every 5s.
- **Error Recovery**: Proxy detects "Paused" Supabase state (503/504) and surfaces UI warning. Local dev warned via `showLocalDevWarning()` on `file://` access.

---

## 🌐 Server Infrastructure Recommendation (CTO Advice)

**Current situation**: 2 servers — GSD 500 BPO (n8n + email) + VPS (OpenClaw bots, SEO, Antigravity).

**Recommendation**: Keep the Apex Universe on the existing VPS. Do NOT mix into GSD 500 BPO server (different business, different risk profile). Deploy another 5 OpenClaw bots for Apex Universe on the existing VPS — they share the same Claw runtime. Separate logical environments (namespaced in n8n), not separate physical servers. Cost-efficient and manageable.

**Future**: As Apex Universe scales (Modelos, Music, Sports, News), evaluate a dedicated Apex VPS. Not yet.

---

## 📓 Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-23 | Initial constitution created. 15 pages built. | Foundation |
| 2026-04-21 | Separated Lead Gen into `booking.html`. | Maximize conversion tracking per client. |
| 2026-04-21 | Implemented `GITHUB_REPO_TOKEN` sync. | Automated repository ops. |
| 2026-04-28 | Supabase proxy hardened. Detects "Paused" state. | Prevent silent data loss. |
| 2026-04-28 | VS Code 3-column layout shipped to Artist Portal. | Productivity + visibility improvement. |
| 2026-04-28 | Asset History engine added. QR logs persisted. | Artists can see all generated codes. |
| 2026-04-28 | CUBO defined as platform heart, not agent name. | Brand clarity. Agents are the Pack. |
| 2026-04-28 | Agent roster established: Kujo, Benji, Fido, Roxy, Scout, Nextel. | AI-first label infrastructure. |
