# Mindset Caro — The "Open Door" (connect another app & track data)

This folder is what an **external application** uses to push data into Apex and have
it tracked. It talks to one endpoint: **`POST /api/ingest`**.

Think of it like a private analytics/lead beacon you control.

```
 external React app ──> apex-track.js / ApexTracker.jsx ──> POST /api/ingest ──> Supabase (mc_ingest_events)
                                                                            └──> (optional) forward to Cubo CDP / Zoho / webhook
```

Every event is stamped with a persistent `visitor_id`, a `session_id`, the page URL,
referrer and UTM params, then stored in `mc_ingest_events`. You read it back in the
admin tracker (`/mindset-caro/admin/`) or via `GET /api/ingest?admin_key=...`.

---

## Option A — Plain `<script>` (any site)

```html
<script src="https://YOUR-DOMAIN/mindset-caro/embed/apex-track.js"
        data-source-app="carolina-app"
        data-endpoint="https://YOUR-DOMAIN/api/ingest"
        data-auto-pageview="true"></script>

<script>
  // fire anywhere
  ApexTrack.track('signup', { email: 'a@b.com', plan: 'pro' });
  ApexTrack.identify({ email: 'a@b.com', name: 'Ana' });
</script>
```

## Option B — React (the "via React" door)

Copy `ApexTracker.jsx` into the other app, then:

```jsx
import { ApexProvider, useApexTracker } from './ApexTracker';

// wrap once, near the root
<ApexProvider sourceApp="carolina-app" endpoint="https://YOUR-DOMAIN/api/ingest">
  <App />
</ApexProvider>

// use anywhere
function SignupButton() {
  const track = useApexTracker();
  return <button onClick={() => track('signup', { email })}>Crear cuenta</button>;
}
```

## Option C — Raw HTTP (any language/backend)

```bash
curl -X POST https://YOUR-DOMAIN/api/ingest \
  -H 'Content-Type: application/json' \
  -d '{"source_app":"carolina-app","event":"signup","payload":{"email":"a@b.com"}}'
```

Response: `{ "ok": true, "id": "<uuid>", "visitor_id": "v_..." }`

---

## Reading the data back

```bash
# recent events (admin-gated if INGEST_ADMIN_KEY is set)
curl "https://YOUR-DOMAIN/api/ingest?admin_key=SECRET&limit=100&source_app=carolina-app"
```

Or open the visual tracker: **`/mindset-caro/admin/`** → "Datos entrantes" tab.

---

## Security / config (env vars on Vercel)

| Var | Purpose | Required |
|-----|---------|----------|
| `SUPABASE_SERVICE_ROLE_KEY` | server-side DB writes | ✅ |
| `SUPABASE_PROJECT_ID` | defaults to `iaycaynevtumrqoknemk` | optional |
| `INGEST_PUBLIC_KEY` | if set, callers must send header `x-ingest-key` | optional |
| `INGEST_ADMIN_KEY` | gate `GET /api/ingest` reads | recommended |
| `INGEST_FORWARD_URL` | also POST every event to Cubo CDP / Zoho / a webhook | optional |
| `MC_ADMIN_KEY` | gate CMS writes (`POST /api/mc-content`) | recommended |

The endpoint is **CORS-open (`*`) by design** — it's a public collector. Lock it down
with `INGEST_PUBLIC_KEY` if you only want known apps writing to it.
