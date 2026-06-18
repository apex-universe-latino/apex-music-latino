# Cubo Client Record — Mindset Caro

New Cubo client, onboarded with the **same setup as Arcoiris** (slug identity →
structured Fan Universal ID → lead capture → CMS → tracking). This is the client
profile + the conventions that make Carolina a first-class client on the platform.

## Identity
| Field | Value |
|-------|-------|
| Brand | **Mindset Caro** |
| Principal | Diana Carolina Cepeda |
| Vertical | Finanzas · Seguros · Ventas (not music) |
| Client slug | `mindset-caro` |
| Status | onboarding |
| Domain | *(at GoDaddy — see "Domain" below; point DNS to host)* |

## Fan Universal ID convention (mirrors Arcoiris)
Arcoiris uses `AML-{GENRE}-{ARTIST}-{SEQ}-{SALT}` → e.g. `AML-TN-ARC-001-x7k2`.

For a non-music vertical we keep the **same format**, swapping the genre slot for a
vertical code and the artist slot for the client code:

```
AML-FIN-CARO-{SEQ}-{SALT}
        │     │      │      └ 4-char random salt (distributed-uniqueness)
        │     │      └ zero-padded sequential counter (001, 002, ...)
        │     └ CARO  = client code (Carolina / Mindset Caro)
        └ FIN  = vertical code (Finanzas)         → example: AML-FIN-CARO-001-9f3a
```

- Master internal ID stays identical to Arcoiris: `APEX-{base36 ts}-{seq:5}`.
- `AML-` prefix kept for one shared Apex namespace across every client.

> Generator code is the same routine used in `genre/tango/arcoiris/index.html`
> (`generateFanId()`), with `VERTICAL_CODE='FIN'` and `CLIENT_CODE='CARO'`.

## Platform registration (done in this commit)
- `api/supabase-proxy.js` → `VALID_ARTISTS` now includes `mindset-caro`, and the
  path allowlist includes `mc_content`, `mc_leads`, `mc_ingest_events`. So the
  client's frontend talks to Supabase through the same secured proxy as Arcoiris.

## Data model (same capabilities as Arcoiris, namespaced per client)
| Capability | Arcoiris | Mindset Caro |
|-----------|----------|--------------|
| Lead capture | `leads_capture` | `mc_leads` (+ mirrored to `mc_ingest_events`) |
| CMS / editable content | admin editor | `mc_content` + `/mindset-caro/admin/` |
| Incoming-data tracking | — | `mc_ingest_events` (the "open door") |
| Schema | `architecture/supabase-schema.sql` | `architecture/mindset-caro-schema.sql` |

> Carolina is finance, not music — keeping her capture in `mc_leads` (rather than the
> shared `leads_capture` fan pool) keeps the two verticals clean while still living in
> the same Cubo project + same proxy. If you'd rather pool everyone into
> `leads_capture`, that's a one-line change in the capture handler — say the word.

## Domain (GoDaddy)
The registrar login is **not** needed from me, and please don't share the password —
rotate it and enable 2FA. To connect the domain yourself once the site is deployed:

1. Deploy the site (Vercel — same project/account as the rest of Apex).
2. Vercel → Project → **Settings → Domains → Add** her domain.
3. Vercel shows the exact records. In **GoDaddy → Domain → DNS**, set:
   - Apex/root `@` → **A record** → Vercel's IP (`76.76.21.21`), or an `ALIAS`/`ANAME` to `cname.vercel-dns.com` if GoDaddy supports it.
   - `www` → **CNAME** → `cname.vercel-dns.com`.
4. Wait for propagation (minutes–hours); Vercel auto-issues SSL.

(If the site is hosted somewhere other than Vercel, the host will give you the
equivalent A/CNAME targets — same procedure.)

## Remaining to go live
- [ ] Run `architecture/mindset-caro-schema.sql` in Supabase.
- [ ] Set env vars (`MC_ADMIN_KEY`, `INGEST_ADMIN_KEY`, etc. — see `mindset-caro/README.md`).
- [ ] Port `mindset-caro/design/*.dc.html` to the live page (or ship as-is) and wire the 3 handlers to `/api/lead`.
- [ ] Connect domain (steps above).
