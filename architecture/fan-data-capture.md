# SOP: Fan Data Capture Pipeline

## Goal
Capture fan contact information from multiple touchpoints and store in Supabase for artist CRM usage.

## Capture Points
1. **Artist EPK pages** — Email form on `/genre/{genre}/{artist}/`
2. **Onboarding form** — Full signup on `/onboarding/`
3. **QR code scans** — Redirect to EPK with `?source=qr` param
4. **Event check-ins** — Future: mobile capture form
5. **Merch purchases** — Future: checkout email capture

## Data Schema (Supabase: `leads_capture`)
```json
{
  "artist_name": "string (from form or page context)",
  "email": "string (validated)",
  "genre": "string (from data-genre attribute)",
  "mood_preference": {
    "source": "string (button_click | form_submit | qr_scan)",
    "timestamp": "ISO 8601"
  },
  "marketing_source": "string (QR_CODE | WEBSITE | SOCIAL | EVENT)"
}
```

## Flow
```
Fan Action → Form Submit → Client-side validation → apex-engine.js → Supabase REST API
                                                                        ↓
                                                              leads_capture table (RLS protected)
                                                                        ↓
                                                              Future: CUBO sync → Artist Dashboard
```

## Validation Rules
- Email: Must match RFC 5322 format
- Artist name: Required, min 2 characters
- Genre: Auto-detected from page context (data-genre attribute)
- Source: Auto-set based on capture point

## Security
- Only SUPABASE_ANON_KEY used client-side (RLS protects data)
- SUPABASE_SERVICE_ROLE_KEY stays in .env (server-side only)
- No PII logged to console in production

## Edge Cases
- If Supabase is unreachable: show friendly error, log to console, do NOT lose the email
- If duplicate email for same artist: Supabase should handle via unique constraint
- If genre cannot be detected: default to "general"

## Verification
- Submit test lead from each EPK page
- Verify data appears in Supabase dashboard
- Verify RLS prevents unauthorized reads
- Test on mobile (primary use case)
