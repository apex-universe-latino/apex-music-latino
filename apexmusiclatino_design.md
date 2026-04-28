# Design System: Apex Music Latino
**Project ID:** Apex Music Latino (Web Application)

## 1. Visual Theme & Atmosphere
The atmosphere is dark, neon-infused, futuristic, and premium. The aesthetic leans heavily into a cyberpunk-adjacent "AI Agent" philosophy—combining deep blacks and muted charcoals with vibrant, glowing neon accents and transparent glassmorphism panels. It conveys a high-tech, highly capable, and elite ecosystem tailored specifically for top creators and Latin music artists.

## 2. Color Palette & Roles

**Base & Surface Colors:**
* **Deep Space Black** (#000000) - Base background, emphasizing negative space and providing a canvas for glowing elements.
* **Neutral Black** (#131313) - Secondary background layer (`--bg-primary`).
* **Muted Charcoal** (#1c1b1b) - Main surface layer for cards and panels (`--bg-surface`).
* **Dark Ash** (#2a2a2a) - Elevated surface layer (`--bg-surface-high`).

**Typography Colors:**
* **Stark White** (#ffffff) - High-emphasis text and primary headings.
* **Dimmed Zinc** (#a1a1aa / Tailwind `zinc-400`) - Body text, descriptions, and secondary information.
* **Muted Zinc** (#71717a / Tailwind `zinc-500`) - Micro-copy, overlines, and tertiary text.

**Core Branding Accents:**
* **Apex Neon Green** (#00ff41) - The primary brand accent. Used for critical calls to action, highlights, glowing glows (`--accent-glow`), and the core identity of the platform.
* **Neon Cyan** (#00ccff / #00e3fd) - Used primarily in gradients paired with Neon Green to create "The Future" text gradients.
* **Neon Purple** (#a855f7) - Secondary AI/Creator accent used for the "Clon AI" sections, often paired with Pink in gradients.

**The Pack (AI Agents) Identity Colors:**
* **Kujo Red** (#ef4444) - Used for Kujo (Contracts & Protection).
* **Benji Emerald** (#10b981) - Used for Benji (Revenue & Opportunities).
* **Fido Blue** (#3b82f6) - Used for Fido (Royalties & Finance).
* **Roxy Fuchsia** (#d946ef) - Used for Roxy (Branding & PR).

**Genre Dynamic Accents:**
* **Reggaeton:** Hot Pink / Magenta (#ff007b)
* **Rap:** Electric Blue / Ice (#00d4ff)
* **Pop:** Vibrant Magenta / Violet (#ec4899)
* **Rock:** Amber / Fire (#ff6b00)
* **Electronic:** Cyan / Neon (#00ffcc)
* **Afro/Latin:** Gold / Warm (#ffb800)

## 3. Typography Rules

* **Headlines & Titles:** `Space Grotesk` (sans-serif). Used for bold, futuristic, and striking visual hierarchy. Usually styled with tight letter spacing (`tracking-tighter`) and heavy font weights (bold/black).
* **Body & UI Text:** `Inter` (sans-serif). Used for clean, legible paragraphs, button labels, and navigation. 
* **Overlines & Micro-copy:** Often styled as uppercase, extremely spaced out (`tracking-widest` or `tracking-[0.3em]`), and small (`text-[10px]` or `text-xs`) to create a technical, "data-readout" aesthetic.

## 4. Component Stylings

* **Buttons:** 
  * Shape: Gently curved edges (`rounded-lg` or `rounded-xl`).
  * Style: High contrast (e.g., Solid Neon Green background with Black text). 
  * Behavior: Subtle scale animations on hover (`hover:scale-105`) and transition transforms.
* **Cards & Containers (Glassmorphism):** 
  * Shape: Generously rounded corners (`rounded-2xl` or `rounded-3xl`).
  * Background: Highly translucent dark backgrounds (`rgba(53, 53, 52, 0.4)` or `bg-neutral-900/60`).
  * Depth: Heavy background blur (`backdrop-filter: blur(16px)` up to `30px`) to let underlying gradients shine through.
  * Borders: Thin, subtle translucent borders (`border-white/5` or `border-white/10`).
  * Interaction: Hover states often intensify border opacity or reveal subtle color-tinted background overlays.
* **Badges & Tags:** 
  * Pill-shaped or softly rounded.
  * Typically feature highly transparent neon backgrounds (e.g., `bg-green-500/20`) with matching neon borders and text.
* **Glows & Shadows:**
  * Uses glowing box-shadows rather than traditional dark drop-shadows. (e.g., `box-shadow: 0 0 40px rgba(0, 255, 65, 0.05)` or agent-specific color glows).
  * Animations include pulsating glows (`@keyframes pulse-glow`) for AI elements.

## 5. Layout Principles

* **Dark Mode Native:** The layout is designed exclusively for dark mode, using negative space to emphasize neon accents.
* **Whitespace Strategy:** Generous vertical padding between sections (often `py-32`) to allow the heavy typography and glowing elements to breathe without feeling cluttered.
* **Grid Alignment:** Responsive grid systems that stack on mobile (1 column) and expand to 2, 3, or 6 columns on desktop (e.g., the Ecosistema grid, Genre selection grid).
* **Layering & Depth:** Employs absolute positioning for radial gradient backgrounds (`hero-gradient`) that sit behind the main content, establishing a deep Z-axis.
