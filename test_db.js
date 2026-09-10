const PROJECT_ID = 'xtfmwtzjbudqmenfmhim';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlheWNheW5ldnR1bXJxb2tuZW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NzgxNDAsImV4cCI6MjA4OTU1NDE0MH0.RdJ_FZlhB4DxGCv27yqMyhYxpjd5pXOeMYN45XVbW0k';

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
