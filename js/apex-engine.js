
// Apex Music Latino | Master Engine
// v1.0.0 - Supabase Lead Capture + Genre Aware Intelligence

document.addEventListener('DOMContentLoaded', () => {
    console.log('--- Apex Music Latino | Master Engine Initialized ---');

    // 1. CONFIGURATION (From .env)
    const SUPABASE_URL = 'https://iaycaynevtumrqoknemk.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlheWNheW5ldnR1bXJxb2tuZW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NzgxNDAsImV4cCI6MjA4OTU1NDE0MH0.RdJ_FZlhB4DxGCv27yqMyhYxpjd5pXOeMYN45XVbW0k';
    
    // 2. DETECT GENRE
    const currentGenre = window.location.pathname.includes('/genre/reggaeton') ? 'reggaeton' : 
                         window.location.pathname.includes('/genre/tango') ? 'tango' : 'general';

    console.log(`Detected Genre Mode: ${currentGenre.toUpperCase()}`);

    // 3. ATTACH LEAD CAPTURE LISTENERS
    // We target any button with "Join Apex" or "Launch Campaign" text
    const actionButtons = Array.from(document.querySelectorAll('button')).filter(btn => 
        btn.textContent.toLowerCase().includes('join') || 
        btn.textContent.toLowerCase().includes('launch')
    );

    actionButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            console.log('Capture Event Triggered...');
            
            // For now, we show a mock prompt (we will replace this with a modal)
            const email = prompt("Enter your email to join the Apex Universe:");
            if (!email) return;

            const name = prompt("Enter your Artist/Manager Name:");
            if (!name) return;

            try {
                const response = await fetch(`${SUPABASE_URL}/rest/v1/leads_capture`, {
                    method: 'POST',
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify({
                        artist_name: name,
                        email: email,
                        genre: currentGenre,
                        mood_preference: { source: 'button_click', timestamp: new Date().toISOString() },
                        marketing_source: 'QR_CODE'
                    })
                });

                if (response.ok) {
                    alert(`Welcome to the Apex ${currentGenre.charAt(0).toUpperCase() + currentGenre.slice(1)} Empire, ${name}! Your profile is being matched with CUBO IQ.`);
                } else {
                    console.error('Data Capture Failed:', await response.text());
                }
            } catch (err) {
                console.error('Connectivity Error:', err);
            }
        });
    });
});
