const url = 'https://iaycaynevtumrqoknemk.supabase.co/rest/v1/leads_capture';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlheWNheW5ldnR1bXJxb2tuZW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NzgxNDAsImV4cCI6MjA4OTU1NDE0MH0.RdJ_FZlhB4DxGCv27yqMyhYxpjd5pXOeMYN45XVbW0k';

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
