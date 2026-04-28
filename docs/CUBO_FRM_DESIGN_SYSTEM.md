# CUBO FRM — Design System Reference

> Source: `docs/cubo_frm_design_system.html`
> Status: **Canonical** — all CUBO FRM interfaces must conform to this system.

---

## 01 — Foundation: Background Palette

| Token          | Hex       | Role              |
|----------------|-----------|-------------------|
| `--bg-deep`    | `#05070a` | Main BG           |
| `--bg-card`    | `#0a0710` | Glass Cards       |
| `--bg-inner`   | `#050308` | Bezel Inner/Screen|
| `--bg-elevated`| `#110a1f` | Panels / Rows     |

## 02 — Neon Accent Colors

| Token        | Hex       | Role                    |
|--------------|-----------|-------------------------|
| `--pink`     | `#ff0080` | Action / Monetization / Tinder |
| `--purple`   | `#8000ff` | Brand / AI / Instagram  |
| `--blue`     | `#0080ff` | Data / Telegram / FB    |
| `--green`    | `#00ff00` | Revenue / Success / $$$  |
| `--gold`     | `#facc15` | Achievement / Saved      |

## 03 — Rainbow Engine Gradient

```css
--gradient-rainbow: linear-gradient(90deg,
  #ff0080 0%,
  #8000ff 40%,
  #0080ff 70%,
  #00ff00 100%
);
/* Animated via: */
background-size: 300% 300%;
animation: shift 6s ease infinite;
```

**Usage:** Reserved for CTAs, Golden Record borders, hero headings. **Never decorative.**

## 04 — Typography

| Style           | Font              | Size    | Weight | Color     | Use Case               |
|-----------------|-------------------|---------|--------|-----------|------------------------|
| Gradient Hero   | Inter             | 2.2rem  | 900    | Rainbow   | Hero headlines         |
| Foil Currency   | Inter             | 2rem    | 900    | Foil anim | Revenue / $ figures    |
| Empresarial     | Inter             | 1.6rem  | 800    | Blue→Pink | Section headers        |
| Section Heading | Inter             | 1.5rem  | 800    | `#fff`    | Card titles            |
| Body Copy       | Inter             | 0.9rem  | 400    | `#9ca3af` | Descriptions           |
| Monospace IDs   | JetBrains Mono    | 0.8rem  | 400    | `#a855f7` | Fan IDs, phone, codes  |
| Eyebrow Label   | Inter             | 0.62rem | 700    | `#8000ff` | Uppercase micro-labels |

### Text Effects
- **`.text-gradient`** — Animated rainbow (hero headlines)
- **`.text-foil`** — Animated holographic foil (revenue numbers)
- **`.text-brand`** — Blue→Purple→Pink flow (brand statements)

## 05 — Card Anatomy: Three Nesting Levels

### L1 — Glass Outer Card
```css
background: rgba(10, 7, 16, 0.85);
backdrop-filter: blur(12px);
border: 1px solid rgba(128, 0, 255, 0.2);
border-radius: 24px;
/* hover: border opacity → 0.5 */
```

### L2 — Bezel Inner (Screen)
```css
background: rgba(5, 3, 8, 0.92);
border: 1px solid rgba(255, 255, 255, 0.05);
border-radius: 16px;
overflow: hidden;
/* + ambient glow ::before pseudo-element */
```

### L3 — Rainbow Border (CTA Only)
```css
/* 2px animated rainbow border wrapping a dark inner */
background: var(--gradient-rainbow);
padding: 2px;
border-radius: var(--r);
```

### L4 — Elevated Row
```css
background: #110a1f;
border-radius: 8px;
border: 1px solid rgba(255, 255, 255, 0.04);
/* Active/highlight: border-color rgba(0,255,0,0.25) */
```

## 06 — Badge System

| Badge       | Background              | Border                       | Color     | Use         |
|-------------|-------------------------|------------------------------|-----------|-------------|
| `.badge-green`  | `rgba(0,255,0,0.1)`    | `rgba(0,255,0,0.35)`       | `#00ff00` | Status live |
| `.badge-purple` | `rgba(128,0,255,0.15)` | `rgba(128,0,255,0.4)`      | `#a855f7` | AI / Engine |
| `.badge-pink`   | `rgba(255,0,128,0.1)`  | `rgba(255,0,128,0.35)`     | `#ff0080` | Hot Lead    |
| `.badge-gold`   | `rgba(250,204,21,0.1)` | `rgba(250,204,21,0.4)`     | `#facc15` | Saved / Achievement (pulsing) |
| `.badge-blue`   | `rgba(0,128,255,0.1)`  | `rgba(0,128,255,0.35)`     | `#60a5fa` | Master Fan ID |

## 07 — Platform Signal Nodes

Each platform source gets a unique color-coded node card:

| Platform  | Icon | Border Color               | Glow Shadow                   |
|-----------|------|----------------------------|-------------------------------|
| Tinder    | 🔥   | `rgba(255,0,128,0.3)`     | `rgba(255,0,128,0.4)` gradient|
| Instagram | 📸   | `rgba(128,0,255,0.3)`     | `rgba(128,0,255,0.4)` gradient|
| Telegram  | 💬   | `rgba(0,128,255,0.3)`     | `rgba(0,136,204,0.4)` solid   |
| Facebook  | 🌐   | `rgba(0,128,255,0.3)`     | `rgba(24,119,242,0.4)` solid  |

## 08 — Golden Record (Master Fan ID Card)

The signature component — animated rainbow border wrapping a dark card with:
- **Avatar** (gradient circle, 44px)
- **Name + Verified badge** (✓ green)
- **"Registro de Oro"** label in `.text-foil`
- **Metric Row** (Fan Value / Purchase Prob / Engagement)
- **Action Bar** (gradient border CTA → "Auto-Mensaje")

## 09 — Motion System

| Animation       | Duration | Easing       | Use Case                 |
|-----------------|----------|--------------|--------------------------|
| `shift`         | 6s       | ease         | Rainbow gradient movement|
| `foil`          | 4s       | ease-in-out  | Holographic text effect  |
| `float-particle`| 4s       | ease-in-out  | Ambient floating dots    |
| `spin`          | 0.8s     | linear       | Loader ring              |
| `pulse-dot`     | 2s       | ease         | Live status indicators   |
| `bar-grow`      | 3s       | ease alt     | Progress bar fill        |
| `pulse-badge`   | 2s       | ease         | Gold badge glow          |
| Fade-in scroll  | 1000ms   | ease-out     | IntersectionObserver 0.1 |

## 10 — Spacing & Borders

### Border Radii
| Radius  | Use                          |
|---------|------------------------------|
| `8px`   | Data rows, badges, inner cells |
| `12px`  | Bezel screens, medium cards  |
| `16px`  | Inner bezels, golden record  |
| `24px`  | Outer glass cards (`--r: 1rem`) |
| `999px` | Pills, badges, indicators    |

### Border Opacity Rules
| Opacity | Context        |
|---------|----------------|
| `0.2`   | Resting/default|
| `0.5`   | Hover state    |
| `0.05`  | Subtle separators |
| Rainbow 2px | CTAs only (never decorative) |

---

## Implementation Notes

- **Fonts:** `Inter` (400–900) + `JetBrains Mono` (400, 700)
- **Never** use the rainbow gradient decoratively — it is reserved for CTAs and the Golden Record border
- **Glass cards** always use `backdrop-filter: blur(12px)` — test for mobile performance
- **Ambient orbs** use `mix-blend-mode: screen` + `filter: blur(40–150px)`
- All colors should be referenced via CSS custom properties for theming
