# Apex Music Latino — Project Memory & SOP Ledger
> The living operational brain of Apex Music Latino. Updated by agents and operators.
> Source of Truth for Skills, SOPs, Agent Logic, and Architectural Patterns.

---

## 🏗️ Architectural Foundations

- **CUBO OS (FRM)**: The Sovereign Fan Data Engine. Unifies signals from QR, Social (IG, TT, SP), and Direct into a permanent Master Fan ID.
- **Nucleus Pattern**: Every artist site is a self-contained "Golden Template" embedding `cubo-engine.js`.
- **Data-First EPK**: Separating content (JSON) from shell (HTML) for rapid multi-artist scaling.
- **VS Code Layout**: 3-column architecture — Activity Bar (48px) | Explorer Sidebar (240px) | Editor Canvas.
- **Template Philosophy**: Artist portals are plug-and-play instances spawned from a master template. Each connects back to Apex/CUBO as the data spine.

---

## 🔴 Guardrails

1. **Sovereignty**: Artist data is **owned by the artist**. Always. Data is portable and exportable.
2. **Attribution**: Fan data captured via QR/EPK must include a `source` field (e.g., `?qr=1`).
3. **Transparency**: No opaque accounting. Royalty splits are transparent and auditable.
4. **Security**: `SERVICE_ROLE_KEY` and secret tokens **never** touch client-side code. Use Proxy logic.
5. **Brand Integrity**: Respect "G-d" spelling in all public-facing narratives and artist copy.
6. **Persistence**: One QR per artist per context. Printed QRs must stay live forever (No slug changes).

---

## 🤖 Agent Roster (The Apex Pack)

Each agent is a specialized AI bot with a defined role in the artist's career ecosystem.

| Agent | Role | Tier | Nextel Chirp Trigger |
|-------|------|------|----------------------|
| **CUBO** | Platform Heart | — | *The Nervous System. Not an agent.* |
| **Kujo** | The Closer / Booking | 🥇 Gold | 🔴 **Hot Lead**: Fan score > 85 detected. |
| **Benji** | Revenue Intelligence | 🥇 Gold | 💰 **Revenue Alert**: New purchase/monetization. |
| **Fido** | Fiduciary / Legal | 🥈 Silver | ⚖️ **Contract Flag**: Clause risk or royalty split issue. |
| **Roxy** | PR & Image Maker | 🥇 Gold | 📣 **PR Moment**: Trending mention or EPK update. |
| **Scout** | A&R Intelligence | 🥈 Silver | 🔍 **Trend Alert**: Genre/Venue heat map signal. |
| **Nextel** | Intercom / Agent Relay | 🔧 System | *The Chirp Feed: Connects the Pack to the Artist.* |

---

## 🧠 Fan 360° Profile (Master Fan ID)
The "Golden Record" for every fan:
- **FAN-{uuid}**: Unified identity across Spotify, IG, TikTok, and WA.
- **Engagement History**: Scans, views, DMs, and purchases.
- **Intelligence Layer**: Fan Value Score (0-100) and Purchase Probability.

---

## 📊 Process Audit (Skill Meter)

| Process Category | Frequency | Friction | Status | Skill Mapping |
|------------------|-----------|----------|--------|---------------|
| Artist EPK Setup | High | Medium | Manual | `EPK_GEN_v1` |
| Lead Gate Implementation | High | Low | Template | `LEAD_CAPTURE_v2` |
| Nextel Chirp MVP | High | Medium | 🔄 Planned | `NEXTEL_CHIRP_v1` |
| Social Data Sync | Medium | High | 🔄 Planned | `FRM_SYNC_v1` |
| Branding Standardization | Medium | Low | Live | `BRAND_SYNC_v1` |
| Trello/Memory Logging | High | Low | Agentic | `ADMIN_LOG_v1` |

---

## 🧠 Skill Definitions

### `EPK_GEN_v1`
**Description**: Takes raw artist assets (Bio, Repertoire, Videos) and generates a high-fidelity branded site.
**Current SOP**: Manual extraction from `/genre/` → migration to standalone directory.

### `NEXTEL_CHIRP_v1` (Planned)
**Description**: Real-time agent-to-artist notification layer. 
**Implementation**: Polling feed → PWA Push → Native Mobile Alerts.

### `LEAD_CAPTURE_v2`
**Description**: Progressive profiling gate triggered by `?qr=1` on landing pages.
**Implementation**: QR scan → form → `leads_capture` Supabase table.

---

## 🖥️ UI/UX Patterns (CUBO FRM)

- **Three Nesting Levels**: L1 (Glass Outer) | L2 (Bezel Inner/Screen) | L3 (Rainbow Border - CTA).
- **Golden Record Card**: Animated rainbow border wrapping the Master Fan ID profile.
- **Text Effects**: `.text-gradient` (Hero), `.text-foil` (Revenue), `.text-brand` (Statements).
- **Badge System**: `.badge-pink` (Hot Lead), `.badge-purple` (AI/Engine), `.badge-gold` (Pulsing VIP).

---

## 📓 Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-28 | VS Code 3-column layout shipped to Artist Portal. | Productivity + visibility improvement. |
| 2026-04-28 | CUBO defined as platform heart, not agent name. | Brand clarity. Agents are the Pack. |
| 2026-04-29 | Phase 3: CUBO FRM development started. | Official project kickoff for sovereign data engine. |
| 2026-04-30 | CUBO OS Vision Alignment. | Formalized Sovereign Fan Data Engine as the core product (CUBO OS). |

---

## 🚀 Work to Do (Phase 3 Accelerants)

1. [ ] **`ARTIST_SPAWN` Skill**: Automate folder creation for `genre/{genre}/{slug}/`.
2. [ ] **Social Media Scrapers**: Finalize Spotify/IG/TikTok ingestion logic into `leads_capture`.
3. [ ] **Nextel Chirp Service Worker**: Implement PWA push notifications for "Hot Leads".
4. [ ] **Desktop Shell**: Initialize Electron/Tauri wrapper for CUBO FRM Windows/Mac app.
5. [ ] **Trello Sync**: Update the [CUBO FRM Dev Board](https://trello.com/b/M9yABXan/cubo-frm-dev-bug-tracker) with these milestones.

