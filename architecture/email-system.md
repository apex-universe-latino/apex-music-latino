# SOP: Email Auto-Reply & Communication System

## Goal
Every fan who fills out a gate form receives an automatic welcome email with their Fan ID, offer confirmation, and social follow links.

## MVP (Phase 1 — Now)
**Service: Resend.com** (100 free emails/day)
- Triggered from Supabase Edge Function on `leads_capture` INSERT
- OR triggered client-side via Resend API
- From: `hola@apexmusiclatino.com` or `noreply@apexmusiclatino.com`

### Email Template — Fan Welcome
```
Subject: 🎵 ¡Bienvenido al Universo de {artist_name}! Tu Fan ID: {fan_id}
From: Apex Music Latino <hola@apexmusiclatino.com>

Hola {name},

¡Felicitaciones! Tu Fan ID es: {fan_id}

✅ Clase de tango GRATIS reservada (hasta 31 de Marzo)
✅ Acceso al curso de 24 pasos de tango (próximamente)
✅ Participación en sorteos exclusivos

Síguenos:
📷 Instagram: @arcoiris.tango
🎵 Spotify: [link]
📺 YouTube: [link]
🎶 TikTok: @arcoiristango

Tu EPK exclusivo: apexmusiclatino.com/genre/tango/arcoiris/

---
Apex Music Latino
Powered by CUBO Data Engine
```

## Phase 2 — 24-Step Journey
Automated email sequence post-capture:
1. Day 0: Welcome + Fan ID
2. Day 1: "Conoce a Arcoiris" (artist story)
3. Day 3: Free tango class details
4. Day 7: "Curso de 24 pasos" preview
5. Day 14: Merch offer
6. Day 21: Event invitation
7. Day 30: Re-engagement / survey
...continues with progressive profiling questions

## Phase 3 — AI Agent Emails
- Each artist gets an AI agent that:
  - Personalizes email content based on fan data
  - A/B tests subject lines
  - Optimizes send times per timezone
  - Handles replies via Kujo AI
  - Manages unsubscribes

## Infrastructure Options
| Option | Cost | Emails/day | Requires Server |
|--------|------|-----------|-----------------|
| Resend | Free (100/day) | 100 | No (API) |
| SendGrid | Free (100/day) | 100 | No (API) |
| EmailJS | Free (200/mo) | ~7 | No (client-side) |
| AWS SES | $0.10/1000 | Unlimited | Edge Function |
| Dedicated SMTP | $20+/mo | Unlimited | Yes |

## Recommended Setup
1. NOW: Resend free tier (verify domain DNS)
2. SCALE: AWS SES via Supabase Edge Functions
3. ENTERPRISE: Dedicated server with OpenCloud agents
