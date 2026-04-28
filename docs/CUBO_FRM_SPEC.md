# CUBO FRM — System Design & Wireframe Spec
> Version: 0.1 DRAFT | Phase 3 | Author: Datos Maestros / Antigravity
> This is the master product spec for the CUBO Fan Relationship Management system.

---

## What Is CUBO FRM?

CUBO FRM is the **sovereign fan data engine** for artists on the Apex platform. It unifies signals from every platform an artist touches — QR codes, Spotify, Instagram, TikTok, WhatsApp — and creates a permanent, portable, AI-enriched fan profile that the artist owns forever.

**Core Value**: "If Instagram bans you tomorrow, you still have every fan's email, phone, engagement history, and purchase score."

---

## The Fan 360° Profile (Master Fan ID)

Every fan across all sources gets merged into one identity:

```
Master Fan ID: FAN-{uuid}
├── Display Name (best guess from signals)
├── Email (primary key — verified)
├── Phone (WhatsApp-preferred)
├── Social Handles:
│   ├── Instagram: @handle | DM count | last active
│   ├── TikTok: @handle | view count
│   └── Spotify: listener_id | streams | top track
├── Engagement Signals:
│   ├── QR scans (which code, when, where)
│   ├── Form submissions (EPK, event, merch)
│   ├── DM responses (IG, WA, TG)
│   ├── Purchase history (merch, tickets, VIP)
│   └── Stream history (Spotify, YT)
├── CUBO Intelligence:
│   ├── Fan Value Score: 0-100
│   ├── Purchase Probability: 0-100%
│   ├── Tier: cold | warm | hot | vip | superfan
│   └── Recommended Action: (e.g., "Send VIP offer", "Re-engage")
├── Location: city, country, timezone
└── Data Sources: [ list of channels that contributed ]
```

---

## Data Ingestion Pipeline

```
QR Scan (fan scans printed QR)
    ↓ ?qr=1 parameter detected
Progressive Profiling Gate
    ↓ Email capture → optional profile enrichment
leads_capture (Supabase) ← PRIMARY
    ↓ Matching Engine (CUBO)
fan_captures (Supabase) ← MERGED PROFILE
    ↓
Artist Portal FRM View ← VISIBLE TO ARTIST
    ↓ (future)
CUBO FRM Desktop App / Mobile Rolodex
```

### Omni-Channel Sources (Roadmap)
| Source | Method | Status |
|--------|--------|--------|
| QR Code Scan | `?qr=1` → form → Supabase | ✅ Live |
| EPK Form | Embedded form → Supabase | ✅ Live |
| Instagram DM | Graph API → n8n → Supabase | 🔄 Planned |
| TikTok | API → n8n → Supabase | 🔄 Planned |
| Spotify | API → artist listener match | 🔄 Planned |
| WhatsApp Business | Business API → n8n → Supabase | 🔄 Planned |
| Event Check-in | QR scan at venue | 🔄 Planned |

---

## Product Surfaces

### 1. Artist Portal (Web — Current)
Already built. FRM tab shows:
- Fan table with filters (source, date, score)
- Search by name/email
- Export CSV
- Source badges (QR, Direct, Social)

**Next**: Add Fan Value Score column + Tier badge.

### 2. CUBO FRM Desktop App (Windows/Mac — Phase 3)
Full-featured artist command center:

**Left Panel**: Navigation
- 📊 Dashboard (revenue + fan stats)
- 👥 Rolodex (full fan list)
- 📧 Campaigns (message builder + journey)
- 📦 Assets (QR codes, EPKs, merch links)
- 🤖 Agent Hub (Kujo, Benji, Fido status)
- 📡 Nextel Feed (agent chirps)

**Center Panel**: Content Canvas (context-sensitive)

**Right Panel**: AI Sidebar
- Active agent responses
- Recommended actions
- Nextel chirp history

**Status Bar**: Connection status | Agent activity | Token usage meter

### 3. Mobile App (iOS/Android — Phase 4)
- **Rolodex View**: Scroll fan list, swipe to see score
- **Hot Lead Alerts**: Push notification (Nextel chirp) when high-probability fan detected
- **Quick Actions**: 
  - Tap fan → see 360° profile
  - Tap "Reply" → Kujo drafts a message
  - Tap "Offer" → Send VIP package

---

## Nextel Chirp System

The **Nextel Chirp** is the agent-to-artist notification layer. Named after the iconic Nextel push-to-talk radio — because when agents have intel, they chirp and the artist acts.

### Chirp Types
| Chirp | Agent | Trigger | Message Example |
|-------|-------|---------|-----------------|
| 🔴 Hot Lead | Kujo | Fan score > 85 | "Jonathan Suarez just viewed your EPK 3 times. He's hot. Reply now?" |
| 💰 Revenue Alert | Benji | New purchase detected | "New VIP sale: $50 from @john_123. Total today: $230." |
| ⚖️ Contract Flag | Fido | Venue contract reviewed | "This venue clause limits your rights. Review before signing." |
| 📣 PR Moment | Roxy | Trending mention detected | "You're trending in Bogotá. Post now to capture the wave." |
| 🔍 Trend Alert | Scout | Genre signal detected | "Afro-Latin fusion is up 340% this week in your region." |

### Technical Spec (MVP)
- **MVP**: In-portal notification feed (polling every 30s)
- **V2**: Push notifications via PWA service worker
- **V3**: Native push (mobile app) + optional Telegram bot

---

## QR Code Strategy

### The Rules (Critical)
1. **One QR per artist per context** — do NOT generate new QRs for the same URL (the printed one must stay live forever)
2. **QR URL structure**: `https://apexmusiclatino.com/genre/{genre}/{slug}/?qr=1`
3. **The `?qr=1` parameter is the trigger** for the progressive profiling gate
4. **If the URL changes**, the printed QR breaks. NEVER change the slug after printing.
5. **Asset History** tracks every generated QR + URL + date so the artist always knows what's live

### Multiple QR Use Cases (Future)
- `?qr=1` → General fan capture (homepage)
- `?qr=venue` → Venue-specific tracking
- `?qr=merch` → Merchandise table scan
- `?qr=event-{id}` → Event-specific capture

---

## Template Architecture for Multi-Artist Scaling

The artist portal is a **Golden Template**. To onboard a new artist:

1. Copy `artist-portal/index.html`
2. Update `ARTISTS` config object (name, slug, genre, accent color)
3. Add artist record to Supabase `artists` table
4. Generate and print their QR code
5. Artist logs in → Onboarding Spotlight walks them through the portal

**Time to launch**: Target < 30 minutes per artist.

---

## Revenue Model (Token Tiers in FRM Context)

| Action | Tier | Token Cost |
|--------|------|-----------|
| View fan list | Bronze | 0 |
| Export CSV | Bronze | Low |
| Kujo: draft outreach message | Gold | Medium |
| Benji: revenue analysis | Gold | Medium |
| Roxy: EPK regeneration | Gold | High |
| Fido: contract review | Silver | High |
| Full campaign with AI | Gold | Very High |

Token packs sold as add-ons to subscription tiers (Freemium / Pro $500/mo / Enterprise).
