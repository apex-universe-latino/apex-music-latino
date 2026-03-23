# SOP: Fan Universal ID System

## Goal
Every fan who enters the Apex ecosystem gets a permanent, sequential Universal ID that follows them across all touchpoints.

## ID Format
- Pattern: `AML-XXXX` (Apex Music Latino)
- Sequential: first fan = AML-0001, second = AML-0002, etc.
- Globally unique across all artists
- Never recycled, never changes

## Current Implementation (MVP)
- Generated client-side via localStorage counter
- Stored in Supabase `leads_capture.mood_preference.fan_id`
- Shown to fan immediately after form submission
- Fan asked to save their ID number

## Future: Platform IDs
Each fan will have multiple platform-specific IDs linked to their master AML-ID:
```
AML-0042 (Master ID)
├── FB-839271 (Facebook ID)
├── IG-4829103 (Instagram ID)
├── TT-2918374 (TikTok ID)
├── SP-abc123 (Spotify listener ID)
└── WA-573187173584 (WhatsApp number)
```

## Future: Supabase Schema Addition
```sql
ALTER TABLE public.master_fans ADD COLUMN fan_id TEXT UNIQUE;
-- Generate: 'AML-' || LPAD(CAST(nextval('fan_id_seq') AS TEXT), 4, '0')
CREATE SEQUENCE fan_id_seq START 1;
```

## Use Cases (Phase 2+)
1. **Roulette/Giveaways**: Random selection from Fan IDs at events
2. **Push Notifications**: Twilio SMS/WhatsApp by Fan ID
3. **Crowdfunding**: Fan IDs linked to investment/support amounts
4. **Loyalty**: Track interactions, reward top fans
5. **Events**: Check-in by Fan ID, VIP access tiers
6. **Analytics**: Fan journey tracking across touchpoints

## Twilio Architecture (Future)
```
Fan captures → Supabase → Edge Function → Twilio
                                          ├── SMS welcome
                                          ├── WhatsApp opt-in
                                          └── Email confirmation
```

## Data Export Rules (Business Model)
- **Freemium**: Artists can VIEW fan data, cannot export
- **Pro**: Artists can export CSV, limited API access
- **Enterprise**: Full API, webhooks, real-time sync

## Progressive Profiling (CUBO IQ)
After initial capture (name, email, phone, title), each subsequent interaction asks ONE new question:
1. Visit 2: "¿Fumas?" / Do you smoke?
2. Visit 3: "¿Tienes hijos?" / Do you have kids?
3. Visit 4: Age range
4. Visit 5: Preferred genres
5. Visit 6: Concert frequency
6. Visit 7: Merch buying habits

Questions stored in Supabase, served dynamically, never repeat.
