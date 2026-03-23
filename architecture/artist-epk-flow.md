# SOP: Artist EPK (Electronic Press Kit) Flow

## Goal
Create a shareable artist profile page that serves as a digital business card, QR code destination, and fan data capture point.

## URL Pattern
`/genre/{genre-slug}/{artist-slug}/`

## Inputs
- Artist stage name
- Genre (must match existing genre)
- Location (city, country)
- Bio (Spanish, 2-3 sentences)
- Stats: fan count, stream count, top territory, engagement rate
- Music releases (3-4 items: title, type, year)
- Social links: Spotify, Apple Music, YouTube, TikTok, Instagram
- Merch items (3 items: name, price)
- Profile image URL

## Required Sections (in order)
1. **Hero** — Full-screen background, artist name, tagline, location, genre badge
2. **Stats Bar** — 4 metrics in a grid
3. **Bio** — Artist photo + bio text + genre tags
4. **Music** — Release cards with play overlay and streaming links
5. **Video** — Cinematic placeholder with play button
6. **Digital Hub** — Platform link cards (Spotify, Apple, YouTube, TikTok, Instagram) with `target="_blank"`
7. **Fan Signup** — Email form + QR code visual + "Escanea para contenido exclusivo"
8. **Merch** — 3 product cards with prices
9. **Booking CTA** — Contact button + press kit download
10. **Footer** — Standard Apex footer (injected by nav.js)

## Data Flow
```
QR Code Scan → EPK Page → Fan enters email → apex-engine.js → Supabase leads_capture
                                                                ↓
                                                    {artist_name, email, genre, source: "QR_CODE"}
```

## Technical Requirements
- `data-genre="{genre}"` on `<html>` tag
- Include: themes.css, nav.js, apex-engine.js
- All social links: `target="_blank"` + `rel="noopener noreferrer"`
- Email form must have `required` attribute
- Mobile-first responsive design
- Grayscale-to-color hover transitions on images

## Verification
- Page renders correctly on mobile (primary use case — QR scan from phone)
- Fan email form submits to Supabase
- All social links open in new tabs
- Genre theme colors applied correctly
- Zero broken internal links
