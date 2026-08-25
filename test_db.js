const PROJECT_ID = 'cyxghqoxsygexrpeldcf';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5eGdocW94c3lnZXhycGVsZGNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMTQ1MTIsImV4cCI6MjA5MTc5MDUxMn0.D2kpaTKVe9XeVVaMX4wYM6_ZOxqrWffIWlzo-jfx5tk';

async function test() {
  const url = 'https://' + PROJECT_ID + '.supabase.co/rest/v1/artists_config?select=*';
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': 'Bearer ' + SERVICE_KEY,
        'Content-Type': 'application/json'
      }
    });
    console.log("Status:", res.status);
    console.log("Body:", await res.text());
  } catch (e) {
    console.error(e);
  }
}
test();
