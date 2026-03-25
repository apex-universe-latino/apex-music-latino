// Vercel Serverless Function — Import Venues into venue_leads
// POST /api/import-venues
// Body: { artist_slug, venues: [{company_name, category, website, phone, email}] }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SUPABASE_URL = `https://${process.env.SUPABASE_PROJECT_ID || 'iaycaynevtumrqoknemk'}.supabase.co`;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_KEY) return res.status(500).json({ error: 'SUPABASE_SERVICE_ROLE_KEY not configured' });

  const { artist_slug, venues, city, country } = req.body;

  if (!venues || !Array.isArray(venues) || venues.length === 0) {
    return res.status(400).json({ error: 'Missing or empty venues array' });
  }

  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'resolution=merge-duplicates,return=representation'
  };

  let imported = 0;
  let skipped = 0;
  const errors = [];

  // Process in batches of 20
  for (let i = 0; i < venues.length; i += 20) {
    const batch = venues.slice(i, i + 20).map(v => ({
      artist_slug: artist_slug || null,
      company_name: v.company_name || v.name || 'Unknown',
      category: v.category || null,
      city: v.city || city || 'Bucaramanga',
      country: v.country || country || 'CO',
      website: v.website || null,
      phone: v.phone || null,
      email: v.email || null,
      contact_name: v.contact_name || null,
      outreach_status: 'new',
      source: v.source || 'scrape'
    }));

    try {
      const sbRes = await fetch(`${SUPABASE_URL}/rest/v1/venue_leads`, {
        method: 'POST',
        headers,
        body: JSON.stringify(batch)
      });

      if (sbRes.ok) {
        const result = await sbRes.json();
        imported += result.length;
      } else {
        const err = await sbRes.text();
        skipped += batch.length;
        errors.push({ batch: i, error: err.substring(0, 200) });
      }
    } catch (err) {
      skipped += batch.length;
      errors.push({ batch: i, error: err.message });
    }
  }

  return res.status(200).json({ imported, skipped, total: venues.length, errors: errors.slice(0, 5) });
}
