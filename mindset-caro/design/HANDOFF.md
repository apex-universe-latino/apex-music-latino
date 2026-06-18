# Mindset Caro — Developer Handoff

Two pages, design-complete. This doc tells the next agent (Claude Code) exactly what to wire.

## Files
- `Mindset Caro Landing.dc.html` — main site (hero, pillars, benefits, media, testimonials, flip-form diagnostic, CTA → diagnostic page, community, footer).
- `Diagnostico Landing.dc.html` — dedicated funnel page: 101 pitch → **Ruleta (Gira y Gana)** → **Calculadora de Protección** → capture.
- `Mindset Caro Wireframes.dc.html` — original 3-layout exploration (reference only).
- `support.js` — DC runtime. **Do not edit.**

> `.dc.html` files are Design Components. To ship as a plain React/Next/Vite app, ask Claude Code to port the markup + logic — the structure maps 1:1 (template → JSX, `renderVals()` → component state/derived values).

## Order of operations
1. **Export this project** (download zip).
2. Open in **Antigravity / VS Code**.
3. Run **Claude Code** (`claude --dangerously-skip-permissions`) for steps A–C below.
4. **Deploy** (Vercel/Netlify) + connect domain.

---

## A. Backend / lead capture
Three submit handlers are stubbed in the logic class — each currently just sets a "done" state. Wire each to POST to your CDP/DB:

| Page | Handler | Fires when | Payload |
|---|---|---|---|
| Main | `submit()` | flip-form step 2 CTA | `{ objective, nombre, email, whatsapp }` |
| Diagnostico | `claimWheel()` | roulette prize claim | `{ prize, nombre, email, whatsapp }` |
| Diagnostico | `sendCalc()` | calculator email CTA | `{ email, ingreso, age, dependientes, coverageCOP, monthlyCOP }` |

**Prompt for Claude Code:**
> "In both .dc.html logic classes, replace the body of `submit()`, `claimWheel()`, and `sendCalc()` so they `await fetch('/api/lead', { method:'POST', body: JSON.stringify(payload) })` before setting the success state. Read the input values from the form fields above each button. Then keep the existing `setState` success transition."

## B. Database (recommended: Supabase — fastest to stand up)
One table:
```sql
create table leads (
  id uuid primary key default gen_random_uuid(),
  source text,            -- 'flip-form' | 'roulette' | 'calculator'
  objective text,
  prize text,
  nombre text,
  email text,
  whatsapp text,
  ingreso int,
  age int,
  dependientes int,
  coverage_cop bigint,
  monthly_cop bigint,
  created_at timestamptz default now()
);
```
Env vars: `SUPABASE_URL`, `SUPABASE_ANON_KEY` (or Mongo `MONGODB_URI`).
If routing to **Cubo CDP**, swap the `/api/lead` target for the Cubo ingestion endpoint + API key.

## C. CMS / editable content
Every editable element is tagged `data-cms-field="..."`. The **field name IS the schema.** Toggle "Modo edición" (the `editMode` prop) to see them outlined in the preview.

Field groups:
- `hero.*`, `pitch.*` — headlines, subtitles, CTAs, photo
- `authority.1–4` — credentials (⚠ placeholder)
- `pillar.1–3.title|body` — the 3 verticals
- `benefit.1–4` — benefits checklist
- `media.reel.1–6`, `media.podcast.*` — content cards
- `testimonial.1–2(.name)` — testimonials (⚠ placeholder)
- `step.1–3` — the 101 steps
- `nav.cta`, `form.cta`, `calc.cta`, `diagnostico.cta`, `community.*`, `footer.links`

Game data lives in the logic class (animated, so not DOM-editable):
- `prizes[]` — the 6 roulette rewards
- giveaway copy in `giveaways{}` (main flip-form)
- calculator math constants in `renderVals()` (`coverageCOP`, `monthlyCOP`)

**Prompt for Claude Code:**
> "Build a CMS schema + admin from every `data-cms-field` attribute across both files, plus the `prizes[]` array and calculator constants. Generate a content collection so the client can edit copy, swap images/videos, edit prizes, and tune the calculator without touching code."

---

## D. Assets to drop in (you generate these)
- **Stills** (Nano Banana 2, plain black bg, remove text): hero portrait, 6 reel covers, podcast cover, testimonial avatars.
- **Background loops** (Kling 3.0 / Seedance, no camera move) — make a **day** + **night** version of any hero loop for the theme toggle. Host on Mux/Cloudflare Stream; paste URLs.
- Replace all `⚠ placeholder` content (credentials, testimonials) with real material.

## E. Already built-in (no work needed)
- Light/dark theme (CSS variables, on-page toggle)
- 3 futuristic style treatments (`style` prop: neon / chrome / editorial)
- Responsive layout, glow/glass system, working roulette physics + live calculator
