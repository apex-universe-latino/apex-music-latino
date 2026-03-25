// Vercel Serverless Function: Create Stripe Checkout Session
// POST /api/create-checkout
// Body: { plan: 'pro' | 'enterprise', artist_slug: string }

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// TODO: Replace these with real Stripe Price IDs from your Stripe Dashboard
const PRICE_MAP = {
  pro: 'price_TODO_PRO_MONTHLY_29',              // TODO: Real Stripe Price ID for Pro $29/mo
  enterprise: 'price_TODO_ENTERPRISE_MONTHLY_99'  // TODO: Real Stripe Price ID for Enterprise $99/mo
};

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { plan, artist_slug } = req.body;

    if (!plan || !artist_slug) {
      return res.status(400).json({ error: 'Missing required fields: plan, artist_slug' });
    }

    if (!PRICE_MAP[plan]) {
      return res.status(400).json({ error: `Invalid plan: ${plan}. Must be "pro" or "enterprise".` });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: 'Stripe is not configured. Set STRIPE_SECRET_KEY in environment.' });
    }

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : (req.headers.origin || 'https://apexmusiclatino.com');

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRICE_MAP[plan],
          quantity: 1
        }
      ],
      metadata: {
        artist_slug: artist_slug,
        plan: plan
      },
      success_url: `${baseUrl}/artist-portal/?checkout=success&plan=${plan}`,
      cancel_url: `${baseUrl}/artist-portal/?checkout=cancelled`
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('[create-checkout] Error:', err.message);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};
