const url = 'https://cyxghqoxsygexrpeldcf.supabase.co/rest/v1/leads_capture';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5eGdocW94c3lnZXhycGVsZGNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMTQ1MTIsImV4cCI6MjA5MTc5MDUxMn0.D2kpaTKVe9XeVVaMX4wYM6_ZOxqrWffIWlzo-jfx5tk';

fetch(url, {
  method: 'POST',
  headers: {
    'apikey': key,
    'Authorization': 'Bearer ' + key,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: JSON.stringify({
    artist_name: 'Arcoiris',
    email: 'test' + Date.now() + '@example.com',
    genre: 'tango',
    mood_preference: { test: true },
    marketing_source: 'QR_CODE'
  })
}).then(res => res.text().then(text => console.log(res.status, text)));
