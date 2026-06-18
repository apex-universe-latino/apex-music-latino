# Mindset Caro — React drop-in components

Standalone Tailwind + TypeScript components for Antigravity to import into the React app
(`mindset-caro-app`). No external deps beyond React. All wire to the existing endpoints.

| Component | Purpose | Endpoints used |
|-----------|---------|----------------|
| `Roulette.tsx` | "Gira y Gana" prize wheel → lead | `POST /api/lead` (source:`roulette`), `POST /api/ingest`, reads `game.prizes` from `/api/mc-content?site=diagnostico` |
| `IndependenceCalculator.tsx` | Protection/independence calculator → lead | `POST /api/lead` (source:`calculator`), reads `calc.constants` from `/api/mc-content?site=diagnostico` |
| `BlogList.tsx` | Blog index | `GET /api/posts` |
| `BlogPost.tsx` | Single post | `GET /api/posts?slug=…` |

All accept `apiBase` (default `''` = same origin; on `mindsetcaro.com` the relative
`/api/*` paths already route correctly). Example:

```tsx
import Roulette from './Roulette';
import IndependenceCalculator from './IndependenceCalculator';
import BlogList from './BlogList';
import BlogPost from './BlogPost';

<Roulette />
<IndependenceCalculator />
// routes:  /blog → <BlogList />   ·   /blog/:slug → <BlogPost slug={slug} />
```

## Blog
- Table: `mc_posts` (run the updated `architecture/mindset-caro-schema.sql`).
- Posts appear automatically in `https://mindsetcaro.com/sitemap.xml`.
- **Authoring** (until a CMS tab exists): upsert via the gateway —
  ```bash
  curl -X POST https://mindsetcaro.com/api/posts \
    -H 'Content-Type: application/json' \
    -d '{"admin_key":"<MC_ADMIN_KEY>","post":{"slug":"primer-post","title":"Mi primer post","excerpt":"...","body":"<p>HTML…</p>","status":"published","tags":["finanzas"]}}'
  ```
- `body` renders as HTML in `BlogPost.tsx`. For real SEO on post pages, set the document
  `<title>` + `<link rel="canonical">` per-route in the app's head manager.

## SEO endpoints (host-aware, no new serverless function)
- `GET /sitemap.xml` and `/robots.txt` are served by `api/data.js` and switch content by host
  (mindsetcaro.com vs apexmusiclatino.com).
