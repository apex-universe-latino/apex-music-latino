# Mindset Caro — CMS + Data "Open Door"

Backend setup for the **Mindset Caro** brand (Diana Carolina), built on the same
stack as the rest of this repo: **Supabase + Vercel serverless functions + a static
admin**. Two capabilities:

1. **CMS** — edit every piece of copy / image / video / game data on the landing pages
   without touching code.
2. **Open Door** — one public endpoint (`/api/ingest`) that any external application
   (React or otherwise) connects to in order to **push and track incoming data**.

```
mindset-caro/
├── admin/index.html        # CMS editor + incoming-data tracker (admin-key gated)
├── embed/
│   ├── apex-track.js       # drop-in <script> SDK for any site
│   ├── ApexTracker.jsx     # React provider + useApexTracker() hook
│   └── README.md           # how another app connects (the "via React" door)
└── design/                 # source design files + original HANDOFF.md (reference)

api/
├── ingest.js              # ← the open door (POST write, GET admin read)
├── lead.js                # landing-page lead capture (flip-form/roulette/calculator)
└── mc-content.js          # CMS read (public) + write (admin)

architecture/
└── mindset-caro-schema.sql # tables: mc_content, mc_leads, mc_ingest_events
```

## Setup (3 steps)

1. **Run the schema.** Supabase Dashboard → SQL Editor → paste
   `architecture/mindset-caro-schema.sql` → Run. Creates `mc_content`, `mc_leads`,
   `mc_ingest_events` (+ RLS and seed content).

2. **Set env vars** on Vercel (same project as the rest of the site):

   | Var | Purpose |
   |-----|---------|
   | `SUPABASE_SERVICE_ROLE_KEY` | required — server-side DB access |
   | `MC_ADMIN_KEY` | gate CMS writes + admin panel |
   | `INGEST_ADMIN_KEY` | gate reading incoming data |
   | `INGEST_PUBLIC_KEY` | *(optional)* require `x-ingest-key` from senders |
   | `INGEST_FORWARD_URL` | *(optional)* fan out each event to Cubo CDP / Zoho / webhook |

3. **Open the panel:** `/mindset-caro/admin/` → enter your admin key.
   - **Contenido (CMS)** tab → edit & save copy/assets/prizes/calculator constants.
   - **Datos entrantes** tab → watch data arriving from connected apps in real time.

## Wiring the landing pages

The design files in `design/` have three stubbed handlers. Point them at `/api/lead`:

| Handler | Payload |
|---------|---------|
| `submit()` (flip-form) | `{ source:'flip-form', objective, nombre, email, whatsapp }` |
| `claimWheel()` (roulette) | `{ source:'roulette', prize, nombre, email, whatsapp }` |
| `sendCalc()` (calculator) | `{ source:'calculator', email, ingreso, age, dependientes, coverageCOP, monthlyCOP }` |

To read content at runtime: `GET /api/mc-content?site=landing` → `{ content: { "hero.title": "...", ... } }`.

## Connecting another application

See **`embed/README.md`**. Short version — in the other app's React code:

```jsx
import { ApexProvider, useApexTracker } from './ApexTracker';
<ApexProvider sourceApp="carolina-app" endpoint="https://YOUR-DOMAIN/api/ingest"><App/></ApexProvider>
// ...
const track = useApexTracker();
track('signup', { email });
```

Everything it sends lands in `mc_ingest_events` and shows up in the admin tracker.

## Live page

`mindset-caro/index.html` is the deployable landing — served at
**`/mindset-caro/`** on the existing Apex domain (e.g.
`https://apexmusiclatino.com/mindset-caro/`). No domain setup needed to preview/show.

- Self-contained (Inter + inline CSS, dark/crimson). Works out of the box.
- The 3-step diagnostic form POSTs to `/api/lead`.
- Fires a pageview into `/api/ingest` via `embed/apex-track.js`.
- Pulls live copy from `/api/mc-content?site=landing` if the CMS has been populated;
  otherwise the built-in defaults render.

### Still to do
- Port the **Diagnostico** funnel page (roulette + calculator) from
  `design/Diagnostico Landing.dc.html` to a real page (next build step).
- Drop in real assets (hero portrait, reel covers) + real credentials/testimonials.
