# Design System: Apex Music Latino (Artist OS)
**Project ID:** 6382206576181163093

## 1. Visual Theme & Atmosphere
**The Creative North Star: "The Sonic Curator"**
The aesthetic is a high-end, cinematic digital void designed for the future of Latin music. It rejects the flat, utility-first look of standard streaming platforms in favor of a curated, editorial experience. The interface feels like a private gallery—expansive, sophisticated, and data-driven.

## 2. Color Palette & Roles
*   **Deep Obsidian (#131313):** The base canvas. A deep, non-pure black that provides atmospheric depth and frames high-energy accents.
*   **Neon Pulse Green (#00FF41):** The primary action color. Used for "Publish," "Live" indicators, and critical call-to-actions.
*   **Electric Signal Blue (#00E3FD):** The secondary accent. Used for interactive elements, data visualizations, and "Pull" actions.
*   **Arcoiris Red (#E60000):** Brand legacy accent. Reserved for high-alert items or specific genre-themed highlights (e.g., Tango).
*   **Glass Surface (#353534 at 40-60%):** Used with backdrop blur (20px) for floating navigation and player controls.

## 3. Typography Rules
*   **Editorial Headers (Space Grotesk):** Futuristic, technical, and authoritative. Used for massive artist titles and section headers.
*   **Functional Body (Inter):** Highly legible and neutral. Used for metadata, fan counts, and detailed descriptions.
*   **Typographic Strategy:** A "Power Gap" is used where massive headlines sit directly above small, whisper-quiet labels to create a curated, high-end feel.

## 4. Component Stylings
*   **Buttons:** Generously rounded (`ROUND_FOUR`). Primary buttons use a linear gradient from #EBFFE2 to #00FF41 at a 45-degree angle.
*   **Spotlight Elements:** Interactive "Spotlight" effects (`spotlight-pulse` animation) guide users through onboarding by pulsing a translucent glow over target elements.
*   **Cards/Containers:** Defined through tonal layering (recessed `surface_container_low` vs elevated `surface_container_high`) rather than 1px borders.
*   **Inputs:** Background-filled using `surface_container_highest` with a "Ghost Border" at 15% opacity.

## 5. Layout Principles
*   **Intentional Asymmetry:** Hero elements are often offset to create a cinematic pace and movement.
*   **Whitespace Authority:** Generous negative space is used to ensure the UI feels premium and "uncluttered."
*   **Layering Principle:** Depth is communicated through background tonal shifts (Level 0 Void to Level 3 Glass), mimicking physical layers in a dark studio.
