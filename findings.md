# Apex Music Latino — Findings & Research

---

## 2026-03-23: Label Industry Research

### What the great labels had in common (Def Jam, Roc-A-Fella, G-Unit, Death Row, Rap-A-Lot)
1. **Movements first, labels second** — identity + sound + "enemy" (mainstream gatekeepers)
2. **Independent leverage → major distribution** — prove demand, then negotiate
3. **Fan access + scarcity** — mixtapes, street teams, DJs, controlled drops
4. **Monetized beyond music early** — merch, fashion, licensing (Rocawear sold for $204M)
5. **Talent incubators, not just signers** — production access, features, image building, media training

### Crash patterns (what to avoid)
1. **Opaque accounting** → internal wars (Ruthless/N.W.A.)
2. **One-superstar dependency** → roster pipeline must be real
3. **Legal/brand ownership fights** → clean IP chain from day 1
4. **Chaos leadership** → culture code + conduct policies needed

### Apex differentiators vs. traditional labels
- Radical transparency (dashboards, statements, auditability)
- Artist-owned data (fan CRM belongs to artist)
- Education layer (Academy) — contracts, publishing, branding
- AI tooling (Kujo) — contract generation, royalty splits, marketing
- Tech infrastructure (CUBO) — data intelligence from day 1

---

## 2026-03-23: Technical Discoveries

### Stitch Templates
- 14 HTML templates exported from Stitch
- All used href="#" placeholder links
- Mix of English and Spanish content
- Two distinct design systems: dark (most pages) and light (onboarding/KUBO)
- Tailwind CSS via CDN with custom theme configs per page

### Vercel Deployment
- Auto-deploys from master branch
- Static HTML served from directory structure (index.html per folder)
- Team: apex-universe-latinos-projects

### Supabase
- Project ID: iaycaynevtumrqoknemk
- Has `leads_capture` table active
- Anon key exposed in client JS (acceptable for RLS-protected tables)
- Service role key in .env (must NEVER be client-side)

---

## 2026-03-23: Design Decisions

### Genre Theme System
- CSS custom properties on `:root` with `[data-genre="X"]` overrides
- 6 genres: reggaeton (pink), tango (red), rap (cyan), rock (orange), electronic (teal), afro-latin (gold)
- nav.js detects genre from URL path and sets data-genre attribute
- Each genre page has its own Tailwind config with matching color tokens

### Navigation Architecture
- nav.js replaces existing `<nav>` and `<footer>` elements on every page
- Consistent top bar: logo + genre selector + page links + Join Apex CTA
- Consistent footer: company info + platform links + genre links + legal
- Mobile hamburger menu included
