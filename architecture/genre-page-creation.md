# SOP: Genre Page Creation

## Goal
Create a new genre landing page that integrates with the shared navigation system and theme engine.

## Inputs
- Genre slug (e.g., `cumbia`)
- Accent color hex (e.g., `#ff6b00`)
- Genre display name (e.g., `Cumbia`)
- Hero headline and subtitle
- CUBO section features (4 items)
- Academy courses (3 items)
- Stats (3 metrics)

## Steps
1. Create directory: `genre/{slug}/`
2. Create `genre/{slug}/index.html`
3. Set `data-genre="{slug}"` on `<html>` tag
4. Add theme to `css/themes.css` under `[data-genre="{slug}"]`
5. Add genre to `js/nav.js` GENRES array
6. Include in `<head>`:
   - Tailwind CDN with custom color config matching the genre
   - Google Fonts (Space Grotesk + Inter + Material Symbols)
   - `/css/themes.css`
7. Include before `</body>`:
   - `/js/nav.js`
   - `/js/apex-engine.js`
8. Required sections: Nav, Hero, CUBO Intelligence, Artist OS Bento, Academy, Footer
9. All nav links must point to real pages
10. Update `sitemap.xml` with new page
11. Run broken link check before committing

## Edge Cases
- If genre slug contains special characters, use URL-safe version
- If no background image available, use solid gradient with genre colors
- Footer is injected by nav.js — include empty `<footer>` element

## Verification
- Page loads with correct genre theme colors
- nav.js replaces nav and footer correctly
- Genre selector highlights the correct genre
- Zero broken links on the new page
