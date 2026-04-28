# Homepage Mega Menu & Redesign Prompt
> Use this as the Stitch / design prompt for the next iteration of apexmusiclatino.com

---

## Context for Designer/Agent

The homepage at `apexmusiclatino.com` is the entry point for the **Apex Universe**. It needs to feel like the front door of a tech company disguised as a record label — premium, data-driven, bilingual (Spanish-first), with CUBO intelligence front and center.

**The Moat**: "Own your data forever. Extract it from social media before you get hacked and lose your fans."

**The Feeling**: Walking into the command center of Latin music's future. Dark mode, cinematic, alive.

---

## Stitch Generation Prompt (Homepage)

```
Design a premium, dark-mode homepage for Apex Music Latino — a Latin music SaaS platform and data engine powered by CUBO, built by Datos Maestros.

VISUAL STYLE:
- Deep black/charcoal backgrounds (#0a0a0a base)
- Genre-specific neon accent colors (reggaeton: #ff007b, tango: #e60000, rap: #00d4ff)
- Glassmorphism cards with 1px borders and subtle glow
- Space Grotesk + Inter typography
- Cinematic, high-contrast, premium feel
- Animated data counters and subtle particle effects

MEGA MENU STRUCTURE:
Top navigation bar with "Apex Music Latino" logo left, mega menu center, "Join Apex / Login" CTA right.

MEGA MENU PANELS (on hover/click, full-width drop-down):

Panel 1: "Géneros / Universos"
6 genre cards in a grid — each with full-bleed image, neon overlay, genre name and tagline:
- Reggaeton | "Urban Intelligence" | #ff007b accent
- Tango | "Passion Data" | #e60000 accent
- Rap | "Street Intelligence" | #00d4ff accent
- Rock | "Raw Power" | #ff6b00 accent
- Electronic | "Cyber Pulse" | #00ffcc accent
- Afro/Latin | "Roots & Future" | #ffb800 accent

Panel 2: "Artist OS & Tools"
4 tool cards in a horizontal row with icons and 1-line descriptions:
- Artist OS: "Your career command center — EPK, fans, analytics, revenue"
- CUBO FRM: "Know every fan. Own every lead. Forever."
- Apex Academy: "Contracts, royalties, rights — what the industry never taught you"
- Marketplace: "Brands find artists by data, not by gut"

Panel 3: "AI Agents — The Pack"
6 agent cards in a 2-row grid, each with agent name, role icon, and 1-line power statement:
- Kujo 🐾 | "The Closer — hunts venues, never stops following up"
- Benji 💰 | "Revenue Intelligence — every dollar tracked, every deal logged"
- Fido ⚖️ | "Fiduciary Guard — royalties, costs, your financial future"
- Roxy 🎬 | "Image Maker — EPK generation, PR, brand narrative"
- Scout 🔍 | "A&R Intelligence — spots trends before they break"
- Nextel 📡 | "The Chirp — connects agents to you in real-time"
Token tier badges: Gold / Silver shown on each card.

Panel 4: "Marketplace"
Split layout — left: "For Artists" (get discovered, monetize data), Right: "For Brands" (find the right Latin artist by audience data, not follower count).

HERO SECTION:
Massive full-viewport hero with:
- Animated gradient background with subtle music waveform particle effect
- Large headline (bilingual):
  EN: "Turn Artists Into Empires."
  ES: "Convierte Artistas en Imperios."
- Subheadline: "Music. Data. Influence. One ecosystem. Powered by CUBO intelligence."
- 3 CTAs: [Discover Artists] [Join Apex] [Explore Marketplace]
- Floating CUBO badge bottom-right: "Powered by CUBO | Built by Datos Maestros"

MOAT SECTION (after hero):
Full-width section titled "Own Your Data. Forever."
2-column layout:
Left: "Without Apex" list — manual DMs, no fan backup, lose everything if banned, no data = no leverage
Right: "With CUBO FRM" list — 200 conversations automated, fan data backed up forever, portable, exportable, sovereign

KEY STATS BAR (animated counters):
- 12B+ Data Points
- 450+ Artists Tracked
- 32 Countries
- 98.7% Data Accuracy

AGENT SHOWCASE SECTION:
"The Pack — Your AI Management Team"
6 agent cards with larger imagery, hover animation that reveals their "powers" (skill list).
Tagline: "5 AI Agents. 1 Platform. Zero Label Traps."

FEATURED ARTISTS:
Dark cards with artist photo, genre badge, fan count, and "View EPK" CTA.
- Joey B | Rap | Mexico City | 1.2M fans
- Arcoiris | Neo-Tango | Buenos Aires | 845K fans
- Andrade | Reggaeton | Medellin | 2.1M fans

APEX ACADEMY TEASER:
Banner section: "What the industry never taught you — now free."
Links to: Publishing Rights 101 | Royalty Splits | Contract Red Flags | Digital Distribution

FOOTER:
Dark, structured. Columns: Genres | Platform | Agents | Legal | Socials
"Powered by CUBO | Built by Datos Maestros | © 2026 Apex Music Latino"

DO NOT CHANGE: the existing dark color palette, glassmorphism card style, or Space Grotesk typography.
Keep the existing genre accent system.
Add mega menu as an overlay/dropdown — do not replace the existing nav structure.
```

---

## Agent Branding Notes for Homepage

CUBO is **the engine**, not an agent. Tagline: *"Powered by CUBO | Built by Datos Maestros"*

The agents are **The Pack** — a branded set of AI specialists. Present them like a team roster, not a features list. Each agent has:
1. A name (dog-themed, memorable)
2. A role (clear, human)
3. A power statement (1 line, visceral)
4. A token tier badge (Gold/Silver/Bronze)

---

## Navigation Architecture

```
Apex Music Latino
├── [Géneros ▼]        → Mega Panel 1 (all 6 genres with images)
├── [Artist OS ▼]      → Mega Panel 2 (tools: EPK, FRM, Academy, Marketplace)
├── [The Pack ▼]       → Mega Panel 3 (6 agents with token tiers)
├── [Marketplace ▼]    → Mega Panel 4 (for artists + for brands)
├── [Academy]          → Direct link
└── [Join Apex / Login] → CTA button (accent color)
```
