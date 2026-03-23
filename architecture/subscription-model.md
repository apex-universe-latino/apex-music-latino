# SOP: Subscription Model & Platform Architecture (Phase 2+)

## Pricing Tiers (Draft)
| Tier | Price | Includes |
|------|-------|----------|
| Freemium | $0 | EPK page, QR code (1/month), view fan data (no export), basic stats |
| Pro | $300/mo | Unlimited QR codes, export CSV, email campaigns, community manager bot, analytics |
| Enterprise | $500/mo | Full API, webhooks, dedicated agent, data scraping jobs, priority support |

## Stripe Integration (Coming Soon)
- Artist portal: subscription management page
- Stripe Checkout for upgrades
- Webhook → Supabase to update artist.tier
- Feature gates based on tier

## Cron Jobs Architecture
```
Supabase Edge Functions / Vercel Cron
├── Data scraping jobs (per artist, scheduled)
├── Email journey triggers (24-step sequences)
├── Social metrics sync (Spotify/IG/TikTok)
├── Fan dedup + merge (nightly)
└── Report generation (weekly)
```

## Community Manager Agents (OpenCloud)
- Each artist can "hire" AI agents for:
  - Social media replies
  - DM management
  - Content scheduling
  - Fan engagement automation
- Billed as add-ons per agent/month
- Runs on OpenCloud infrastructure

## Commission Model
- Apex takes X% on merch sales through platform
- Apex takes X% on booking fees
- Data scraping: per-job pricing
- Email campaigns: per-send pricing above tier limits
