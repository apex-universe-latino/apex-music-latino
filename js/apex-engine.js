
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

            // Collect full device + environment metadata
            const ua = navigator.userAgent;
            const uaLower = ua.toLowerCase();
            const deviceData = {
                user_agent: ua,
                platform: navigator.platform || 'unknown',
                language: navigator.language || 'unknown',
                languages: navigator.languages ? navigator.languages.join(', ') : navigator.language,
                screen_width: screen.width,
                screen_height: screen.height,
                viewport_width: window.innerWidth,
                viewport_height: window.innerHeight,
                pixel_ratio: window.devicePixelRatio || 1,
                color_depth: screen.colorDepth,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
                online: navigator.onLine,
                touch_support: 'ontouchstart' in window,
                max_touch_points: navigator.maxTouchPoints || 0,
                connection_type: (navigator.connection && navigator.connection.effectiveType) || 'unknown',
                downlink: (navigator.connection && navigator.connection.downlink) || 'unknown',
                memory: navigator.deviceMemory || 'unknown',
                cpu_cores: navigator.hardwareConcurrency || 'unknown',
                referrer: document.referrer || 'direct',
                url_params: window.location.search,
                page_url: window.location.pathname,
                cookies_enabled: navigator.cookieEnabled,
                do_not_track: navigator.doNotTrack || 'unset',
                pdf_viewer: navigator.pdfViewerEnabled || false,
                webdriver: navigator.webdriver || false,
                orientation: (screen.orientation && screen.orientation.type) || 'unknown',
                prefers_color_scheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
                prefers_reduced_motion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
                session_entry_time: new Date().toISOString()
            };

            // Device + Model Detection (comprehensive)
            if (/iphone/i.test(uaLower)) {
                deviceData.device = 'iPhone';
                if (screen.width >= 430) deviceData.model = 'iPhone Pro Max';
                else if (screen.width >= 393) deviceData.model = 'iPhone 15/16';
                else if (screen.width >= 390) deviceData.model = 'iPhone 12/13/14';
                else if (screen.width >= 375) deviceData.model = 'iPhone X/11';
                else if (screen.width >= 320) deviceData.model = 'iPhone SE/8';
                else deviceData.model = 'iPhone (Standard)';
            } else if (/ipad/i.test(uaLower) || (navigator.maxTouchPoints > 1 && /macintosh/i.test(uaLower))) {
                deviceData.device = 'iPad';
                if (screen.width >= 1024) deviceData.model = 'iPad Pro';
                else if (screen.width >= 834) deviceData.model = 'iPad Air';
                else deviceData.model = 'iPad';
            } else if (/android/i.test(uaLower)) {
                deviceData.device = 'Android';
                if (/samsung|sm-|gt-/i.test(uaLower)) {
                    deviceData.model = 'Samsung Galaxy';
                    if (/sm-s9/i.test(uaLower)) deviceData.model = 'Samsung Galaxy S24';
                    else if (/sm-s91/i.test(uaLower)) deviceData.model = 'Samsung Galaxy S24 Ultra';
                    else if (/sm-f9/i.test(uaLower)) deviceData.model = 'Samsung Galaxy Z Fold';
                    else if (/sm-f7/i.test(uaLower)) deviceData.model = 'Samsung Galaxy Z Flip';
                    else if (/sm-a/i.test(uaLower)) deviceData.model = 'Samsung Galaxy A Series';
                } else if (/pixel\s*(\d)/i.test(uaLower)) {
                    deviceData.model = 'Google Pixel ' + (uaLower.match(/pixel\s*(\d)/i)[1]);
                } else if (/pixel/i.test(uaLower)) {
                    deviceData.model = 'Google Pixel';
                } else if (/huawei|honor/i.test(uaLower)) {
                    deviceData.model = 'Huawei/Honor';
                } else if (/xiaomi|redmi|poco/i.test(uaLower)) {
                    deviceData.model = 'Xiaomi/Redmi';
                } else if (/oneplus/i.test(uaLower)) {
                    deviceData.model = 'OnePlus';
                } else if (/oppo/i.test(uaLower)) {
                    deviceData.model = 'OPPO';
                } else if (/vivo/i.test(uaLower)) {
                    deviceData.model = 'Vivo';
                } else if (/motorola|moto/i.test(uaLower)) {
                    deviceData.model = 'Motorola';
                } else {
                    deviceData.model = 'Android Device';
                }
                if (screen.width >= 600) deviceData.tablet = true;
            } else if (/macintosh|mac os/i.test(uaLower)) {
                deviceData.device = 'Mac';
                deviceData.model = 'macOS Desktop';
            } else if (/windows/i.test(uaLower)) {
                deviceData.device = 'Windows';
                if (/windows nt 10/i.test(uaLower)) deviceData.model = 'Windows 10/11';
                else deviceData.model = 'Windows Desktop';
            } else if (/linux/i.test(uaLower) && !/android/i.test(uaLower)) {
                deviceData.device = 'Linux';
                if (/cros/i.test(uaLower)) { deviceData.device = 'ChromeOS'; deviceData.model = 'Chromebook'; }
                else deviceData.model = 'Linux Desktop';
            } else if (/smart-tv|smarttv|googletv|appletv|hbbtv|netcast|viera|roku|webos/i.test(uaLower)) {
                deviceData.device = 'SmartTV';
                deviceData.model = 'Smart TV';
            } else {
                deviceData.device = 'Other';
                deviceData.model = navigator.platform || 'Unknown';
            }

            // Browser detection
            if (/chrome/i.test(uaLower) && !/edg/i.test(uaLower) && !/opr/i.test(uaLower)) deviceData.browser = 'Chrome';
            else if (/safari/i.test(uaLower) && !/chrome/i.test(uaLower)) deviceData.browser = 'Safari';
            else if (/firefox/i.test(uaLower)) deviceData.browser = 'Firefox';
            else if (/edg/i.test(uaLower)) deviceData.browser = 'Edge';
            else if (/opr|opera/i.test(uaLower)) deviceData.browser = 'Opera';
            else if (/samsungbrowser/i.test(uaLower)) deviceData.browser = 'Samsung Internet';
            else deviceData.browser = 'Other';

            // Battery (async, best-effort)
            try {
                if (navigator.getBattery) {
                    const batt = await navigator.getBattery();
                    deviceData.battery_level = Math.round(batt.level * 100);
                    deviceData.battery_charging = batt.charging;
                }
            } catch(e) {}

            // Attempt location (non-blocking, 3s timeout)
            let geo = null;
            try {
                const pos = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000, enableHighAccuracy: false });
                });
                geo = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy };
            } catch(e) {}

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
                        mood_preference: { 
                            source: 'button_click', 
                            timestamp: new Date().toISOString(),
                            device: deviceData,
                            geo: geo
                        },
                        marketing_source: 'MASTER_ENGINE'
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
