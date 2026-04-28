const PROJECT_ID = 'iaycaynevtumrqoknemk';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlheWNheW5ldnR1bXJxb2tuZW1rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mzk3ODE0MCwiZXhwIjoyMDg5NTU0MTQwfQ.-V6swXvqL2X6kAH9UCeRXq59q-R4KcojANvVXRyxKuM';

async function test() {
  const url = 'https://' + PROJECT_ID + '.supabase.co/rest/v1/artists_config';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': 'Bearer ' + SERVICE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        slug: 'arcoiris',
        config: { test: true },
        updated_at: new Date().toISOString()
      })
    });
    console.log("Status:", res.status);
    console.log("Body:", await res.text());
  } catch (e) {
    console.error(e);
  }
}
test();
