# Onboarding Prospect Skill

## Goal
Automate the process of converting a lead capture prospect into a registered Apex Music Latino artist.

## Prerequisites
- Supabase Project ID: `iaycaynevtumrqoknemk`
- Trello Board: `XIpGmZUV`
- Admin Access to `/admin/index.html`

## Workflow

### 1. Prospect Discovery
- Prospects are captured via the QR scan form (Table: `fan_captures`).
- A lead is flagged as a "Prospect" if they check the "Are you an artist?" box.

### 2. Admin Review
- Admin uses the **Master Admin Dashboard** to filter `fan_captures` where `is_artist = true`.
- Admin reviews social links and bio.

### 3. Approval & Account Creation
- Admin clicks "Approve Prospect" in the CMS.
- Skill Action:
    - Insert new record into `public.artists` with status `applied`.
    - Generate a unique login token.
    - Send onboarding email (via Resend) with a link to the **Artist Portal**.

### 4. Guided Walkthrough (Spotlight UI)
- When the new artist logs in for the first time, the `Onboarding.start()` script is triggered.
- **Spotlight Steps**:
    1. **Pull Data**: Highlight `#btn-pull`. "Click here to import your first batch of fans."
    2. **Profile Setup**: Highlight `#nav-profile`. "Complete your bio and social links."
    3. **First Publication**: Highlight `#btn-publish`. "Go live with your new EPK."

## Technical Implementation
- **CSS**: Uses `@keyframes spotlight-pulse` for visual attention.
- **JS**: `window.Onboarding` controller in `artist-portal/index.html`.
- **Database**: `public.artists` status field triggers different UI states.

## Future Enhancements
- Automated social media audit (Skill: `audit-artist-socials`).
- AI-generated bio translation (Skill: `translate-artist-bio`).
