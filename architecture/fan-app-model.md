# SOP: Fan App & Artist Micro-Apps (Phase 3+)

## Concept
Each artist can have their own branded micro-app (PWA or native) that superfans download.
Think: "The Arcoiris App" — exclusive content, video calls, giveaways, merch drops.

## Revenue Models to Research
| Platform | Model | What to Copy |
|----------|-------|-------------|
| Tinder | Freemium + swipe limits + premium features | Engagement gating, profile discovery |
| OnlyFans | Creator-controlled subscription tiers | Direct fan-to-artist payments, exclusive content |
| Patreon | Tiered membership | Community levels, early access |
| Cameo | Pay-per-interaction | Video shoutouts, personalized messages |
| Discord | Community + roles | Fan tiers, exclusive channels |

## Artist App Tiers
| Tier | Fan Price | Features |
|------|----------|----------|
| Free | $0 | Basic profile, event alerts, QR fan ID |
| Superfan | $4.99/mo | Exclusive content, behind-the-scenes, chat |
| VIP | $14.99/mo | Video peer-to-peer calls, merch drops, meet & greet priority |
| Patron | $49.99/mo | Direct artist access, co-creation, producer credits |

## Artist Cost (to Apex)
| Package | Price | Includes |
|---------|-------|----------|
| Basic | $300/mo | EPK, QR, FRM, basic email |
| Pro | $500/mo | + Fan app, AI agents, marketing automation |
| Enterprise | $1000+/mo | + Custom app, dedicated agents, white-label |
| Layaway | $100/mo | Build features incrementally, pay as you grow |

## Technical Architecture
- PWA (Progressive Web App) first — no app store needed
- React Native for native app (Phase 4)
- Backend: Supabase + Edge Functions
- Real-time: Supabase Realtime for chat/notifications
- Video: WebRTC for peer-to-peer
- Payments: Stripe Connect (artist gets direct deposits)

## AI Agents Per Artist
Each artist gets AI agents that:
- Manage their community (reply to DMs, comments)
- Schedule content
- Run email campaigns
- Handle booking inquiries
- Generate marketing copy
- Analyze fan data and suggest actions
- Run on OpenCloud infrastructure
- Billed per agent/month as add-on
