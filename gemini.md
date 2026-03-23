# Apex Music Latino — Project Constitution (gemini.md)
> This file is LAW. All schemas, rules, and architectural invariants live here.
> Only update when: a schema changes, a rule is added, or architecture is modified.

---

## 1. Project Identity

**Name**: Apex Music Latino
**Mission**: "We don't just sign artists. We turn them into companies."
**Type**: Music Label + SaaS Platform + Marketplace + Data Engine
**Region**: Colombia-first, LATAM expansion
**Owner**: Datos Maestros (parent company), CUBO (data engine)

---

## 2. Data Schemas

### 2.1 Lead Capture (Supabase: `leads_capture`)
```json
{
  "id": "uuid",
  "artist_name": "string",
  "email": "string",
  "genre": "enum: reggaeton | tango | rap | rock | electronic | afro-latin | general",
  "mood_preference": {
    "source": "string",
    "timestamp": "ISO 8601"
  },
  "marketing_source": "enum: QR_CODE | WEBSITE | SOCIAL | REFERRAL",
  "created_at": "timestamp"
}
```

### 2.2 Artist Profile (Future: Supabase `artists`)
```json
{
  "id": "uuid",
  "stage_name": "string",
  "legal_name": "string",
  "email": "string",
  "genre": "enum",
  "country": "string (ISO 3166-1 alpha-2)",
  "city": "string",
  "role": "enum: artist | manager | producer | brand",
  "instagram_handle": "string | null",
  "spotify_url": "string | null",
  "fan_count": "integer",
  "stream_count": "integer",
  "engagement_rate": "float",
  "top_territory": "string",
  "status": "enum: applied | incubator | signed | graduated",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### 2.3 Fan Data Capture (Future: Supabase `fan_captures`)
```json
{
  "id": "uuid",
  "artist_id": "uuid (FK → artists)",
  "fan_email": "string",
  "source": "enum: QR_SCAN | EPK_FORM | EVENT | MERCH_PAGE",
  "genre_context": "string",
  "captured_at": "timestamp"
}
```

### 2.4 Genre Theme Config
```json
{
  "genre_id": "string",
  "accent": "hex color",
  "accent_glow": "rgba",
  "accent_dark": "hex color",
  "gradient_start": "hex color",
  "gradient_end": "hex color"
}
```
**Current themes**: reggaeton (#ff007b), tango (#e60000), rap (#00d4ff), rock (#ff6b00), electronic (#00ffcc), afro-latin (#ffb800)

---

## 3. Behavioral Rules

### 3.1 DO Rules
- All artist data must be owned by the artist (transparency-first)
- Fan data captured via QR/EPK must always include `source` field
- Every page must include: nav.js, themes.css, apex-engine.js
- Genre theming must be driven by `data-genre` attribute on `<html>`
- All internal links must resolve to existing pages (zero broken links policy)
- All forms must validate email before submission
- Copyright year: 2026

### 3.2 DO NOT Rules
- Never expose Supabase service_role_key in client-side code
- Never sell or share artist fan data with third parties
- Never hardcode API keys in HTML/JS files (use .env)
- Never create pages without including shared nav system
- Never use href="#" for primary navigation (only acceptable for placeholder CTAs)

### 3.3 Tone & Voice
- English + Spanish bilingual (Spanish-first for artist-facing, English for brand-facing)
- Premium, elite, data-driven, empowering
- Never condescending — artists are partners, not products

---

## 4. Architectural Invariants

### 4.1 Tech Stack
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Static HTML + Tailwind CSS (CDN) + Vanilla JS | Site pages |
| Data | Supabase (iaycaynevtumrqoknemk) | Lead capture, artist profiles, fan data |
| Hosting | Vercel (team: apex-universe-latinos-projects) | Deployment |
| Source | GitHub (apex-universe-latino/apex-music-latino) | Version control |
| Design | Space Grotesk + Inter + Material Symbols | Typography & icons |
| Theming | CSS custom properties via data-genre attribute | Genre-adaptive UI |

### 4.2 File Architecture
```
├── index.html                    # Main landing
├── genre/{genre}/index.html      # Genre landing pages (6)
├── genre/{genre}/{artist}/       # Artist EPK pages
├── academy/index.html            # Education platform
├── marketplace/index.html        # Artist discovery marketplace
├── dashboard/index.html          # Artist OS dashboard
├── studio/index.html             # CUBO AI studio
├── onboarding/index.html         # Artist signup
├── artists/index.html            # Artist directory
├── css/themes.css                # Genre theme system
├── js/nav.js                     # Shared navigation injection
├── js/apex-engine.js             # Lead capture + Supabase
├── sitemap.xml                   # SEO
├── gemini.md                     # THIS FILE (constitution)
├── task_plan.md                  # Phase planning
├── findings.md                   # Research & discoveries
├── progress.md                   # Execution log
├── architecture/                 # SOPs
├── tools/                        # Python scripts
└── .tmp/                         # Temporary workbench
```

### 4.3 URL Routing Convention
- Genre pages: `/genre/{genre-slug}/`
- Artist EPKs: `/genre/{genre-slug}/{artist-slug}/`
- Platform pages: `/{page-slug}/`
- All routes end with `/` (Vercel serves index.html from directories)

---

## 5. Integration Registry

| Service | Status | Key Location | Purpose |
|---------|--------|-------------|---------|
| Supabase | ACTIVE | .env (SUPABASE_ANON_KEY) | Database, auth, lead capture |
| Vercel | ACTIVE | .env (VERCEL_API_TOKEN) | Hosting & deployment |
| GitHub | ACTIVE | SSH (Claude_Code_Antigravit) | Version control |
| Spotify API | PLANNED | — | Artist metrics, listener data |
| Instagram Graph | PLANNED | — | Social data, content pull |
| TikTok API | PLANNED | — | Engagement metrics |
| WhatsApp Business | PLANNED | — | Fan CRM messaging |

---

## 6. Changelog
| Date | Change | Author |
|------|--------|--------|
| 2026-03-23 | Initial constitution created. 15 pages built, all links verified. | System Pilot |
