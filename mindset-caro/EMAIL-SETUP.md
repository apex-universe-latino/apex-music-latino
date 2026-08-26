# Email setup for mindsetcaro.com — instructions for the client's team

Goal: create **info@mindsetcaro.com** so Carolina can receive (and send) email at her domain,
and receive a copy of every lead.

## ⚠️ Read this first — the website is safe
The website (`mindsetcaro.com`) runs on Vercel via the domain's **A / CNAME** records.
**Email uses different records (MX + TXT).** Adding email records does **not** affect the
website — they live side by side. Do **not** change or delete the existing A/CNAME
records that point the site to Vercel.

All records below are added in **GoDaddy → your domain → DNS → Manage DNS**.

---

## Recommended: Zoho Mail (free, and it matches our CRM stack)
A real mailbox (send + receive + webmail + mobile app), free for a small team, and it lives
in the same Zoho ecosystem we use for the CRM/FRM.

1. Go to **zoho.com/mail** → **Sign Up → Business Email → Free plan**.
2. Add the domain **mindsetcaro.com**.
3. Zoho gives you a **verification TXT record** → add it in GoDaddy DNS, click Verify.
4. Create the mailbox **info@mindsetcaro.com** (and any others).
5. Add the DNS records Zoho shows you (exact values come from Zoho):
   | Type | Host/Name | Value (from Zoho) | Priority |
   |------|-----------|-------------------|----------|
   | MX | @ | `mx.zoho.com` | 10 |
   | MX | @ | `mx2.zoho.com` | 20 |
   | MX | @ | `mx3.zoho.com` | 50 |
   | TXT (SPF) | @ | `v=spf1 include:zoho.com ~all` | — |
   | TXT (DKIM) | (Zoho gives a selector) | (Zoho gives the key) | — |
6. Wait for propagation (minutes–hours). Send a test email to `info@mindsetcaro.com`.

> If email was ever set up before, remove old/duplicate MX records so only Zoho's remain.

## Fastest alternative: forwarding only (receive, ~10 min)
If you only need `info@mindsetcaro.com` to **forward into an existing Gmail** for now
(no sending yet), use a free forwarder like **improvmx.com**:
1. Add domain `mindsetcaro.com`, set alias `info@` → `dccarolinacepeda@gmail.com`.
2. Add the 2 MX records + 1 SPF TXT that ImprovMX shows, in GoDaddy DNS.
3. Test — email to `info@mindsetcaro.com` now lands in her Gmail.

(You can upgrade to full Zoho later; just swap the MX records.)

---

## After email exists — the lead copy is already wired
Every lead captured on the site is:
1. **Saved to our database** (Supabase — the Modelos Latino FRM). This is the source of truth.
2. **Emailed as a copy** to `info@mindsetcaro.com` so Carolina can act immediately.

The copy is on by default once `info@mindsetcaro.com` receives mail. To send it somewhere
else (or add a second recipient) set the Vercel env var **`LEAD_NOTIFY_EMAIL`**
(e.g. `info@mindsetcaro.com`). The copy is sent from our verified sender
`noreply@apexmusiclatino.com` with **reply-to = the lead's own email**, so Carolina can
reply straight to the lead.

## Optional next step (sending FROM her brand)
To send campaign/journey emails *from* `@mindsetcaro.com` (not just receive), verify
`mindsetcaro.com` in **Resend** (add their SPF/DKIM records at GoDaddy). Then the 24-step
nurture journey can send as Carolina. Not required for lead capture to work.
