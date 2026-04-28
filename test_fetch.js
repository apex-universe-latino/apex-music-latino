async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/supabase-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: '/rest/v1/leads_capture?select=*',
        method: 'GET',
        artist_slug: 'arcoiris'
      })
    });
    console.log("Status:", res.status);
    console.log("Data:", await res.text());
  } catch(e) {
    console.error(e);
  }
}
test();
