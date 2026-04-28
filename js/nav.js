// Apex Music Latino — Shared Navigation System
// Injects consistent nav across all pages

(function() {
    'use strict';

    const GENRES = [
        { id: 'reggaeton', label: 'Reggaeton', icon: 'equalizer', path: '/genre/reggaeton/' },
        { id: 'rap', label: 'Rap', icon: 'mic', path: '/genre/rap/' },
        { id: 'pop', label: 'Pop', icon: 'star', path: '/genre/pop/' },
        { id: 'rock', label: 'Rock', icon: 'electric_bolt', path: '/genre/rock/' },
        { id: 'electronic', label: 'Electronic', icon: 'settings_input_component', path: '/genre/electronic/' },
        { id: 'afro-latin', label: 'Afro/Latin', icon: 'blur_on', path: '/genre/afro-latin/' }
    ];

    const NAV_LINKS = [
        { label: 'Ecosystem', path: '/' },
        { label: 'Artists', path: '/artists/' },
        { label: 'Marketplace', path: '/marketplace/' },
        { label: 'Artist OS', path: '/dashboard/' }
    ];

    // Detect current genre from URL
    function detectGenre() {
        const path = window.location.pathname;
        for (const g of GENRES) {
            if (path.includes('/genre/' + g.id)) return g.id;
        }
        return 'general';
    }

    // Set genre attribute on html element for CSS theming
    const currentGenre = detectGenre();
    if (currentGenre !== 'general') {
        document.documentElement.setAttribute('data-genre', currentGenre);
    }

    // Main nav links HTML
    function navLinksHTML() {
        const path = window.location.pathname;
        return NAV_LINKS.map(link => {
            const isActive = path === link.path || (link.path !== '/' && path.startsWith(link.path));
            const cls = isActive
                ? 'text-[#00ff41] underline underline-offset-8 decoration-2'
                : 'text-zinc-400 hover:text-white transition-colors';
            return `<a class="${cls}" href="${link.path}">${link.label}</a>`;
        }).join('');
    }

    // Build and inject navbar
    function injectNav() {
        const existingNav = document.querySelector('nav');
        if (!existingNav) return;

        // On index.html, we don't want to replace the custom-styled nav block if it already has the exact styling we gave it.
        // We can just rely on the hardcoded nav in index.html for perfection, or we inject this global one everywhere.
        // Given we want the exact updated styling, we'll build it here.
        const nav = document.createElement('nav');
        nav.className = 'fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-xl h-20 flex justify-between items-center px-8 border-b border-white/5 shadow-2xl';
        nav.id = 'apex-nav';
        nav.innerHTML = `
            <div class="flex items-center gap-12">
                <a href="/" class="flex items-center gap-2 group">
                    <img src="/Branding /aml_favicon.svg" alt="Apex" class="h-8 w-8 invert group-hover:rotate-12 transition-transform" onerror="this.src='Branding /aml_favicon.svg'"/>
                    <span class="text-xl font-bold tracking-tighter uppercase" style="font-family: 'Space Grotesk', sans-serif;">Apex Music Latino</span>
                </a>
                <div class="hidden lg:flex items-center gap-6 overflow-x-auto py-2" style="scrollbar-width: none;">
                    <a href="/#ai-clone" class="text-[10px] uppercase tracking-widest font-bold text-[#00ff41] hover:scale-105 transition-transform flex items-center gap-1">
                        <span class="material-symbols-outlined text-[10px] font-bold">bolt</span> Clon AI
                    </a>
                    ${GENRES.map(g => {
                        const isActive = currentGenre === g.id;
                        return `<a href="${g.path}" class="text-[10px] uppercase tracking-widest font-medium ${isActive ? 'text-[#00ff41]' : 'text-neutral-500 hover:text-white'} transition-colors">${g.label}</a>`;
                    }).join('')}
                </div>
            </div>
            <div class="flex items-center gap-8">
                <div class="hidden xl:flex gap-6 tracking-tight text-sm font-medium" style="font-family: 'Space Grotesk', sans-serif;">
                    ${navLinksHTML()}
                </div>
                <div class="flex items-center gap-4">
                    <button onclick="document.getElementById('mobile-menu').classList.toggle('hidden')" class="xl:hidden material-symbols-outlined text-zinc-400 hover:text-white">menu</button>
                    <a href="/onboarding/" class="px-6 py-2 font-bold rounded-lg text-xs bg-[#00ff41] text-black hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,255,65,0.3)]">Join Apex</a>
                </div>
            </div>
            <!-- Mobile menu -->
            <div id="mobile-menu" class="hidden absolute top-20 left-0 w-full bg-neutral-950/95 backdrop-blur-xl p-6 xl:hidden border-b border-white/10 shadow-2xl">
                <div class="flex flex-col gap-4 mb-6" style="font-family: 'Space Grotesk', sans-serif;">
                    ${NAV_LINKS.map(l => `<a href="${l.path}" class="text-zinc-300 hover:text-white py-2">${l.label}</a>`).join('')}
                    <a href="/#ai-clone" class="text-[#00ff41] font-bold py-2 border-t border-white/5 mt-2 pt-4">Clon AI (Auto-Reply Bot)</a>
                </div>
                <div class="flex flex-wrap gap-4 pt-4 border-t border-white/10">
                    ${GENRES.map(g => `<a href="${g.path}" class="text-xs uppercase tracking-widest text-zinc-500 hover:text-white py-1">${g.label}</a>`).join('')}
                </div>
            </div>
        `;

        existingNav.replaceWith(nav);
    }

    // Inject shared footer
    function injectFooter() {
        const existingFooter = document.querySelector('footer');
        if (!existingFooter) return;

        existingFooter.innerHTML = `
            <div class="max-w-7xl mx-auto w-full px-8 pb-12">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 px-4 md:px-0 text-left">
                    <div class="col-span-2">
                        <div class="flex items-center gap-3 mb-6">
                            <img src="/Branding /aml_favicon.svg" class="w-10 h-10 invert" alt="Apex" onerror="this.src='Branding /aml_favicon.svg'">
                            <div class="text-2xl font-bold tracking-tighter uppercase" style="font-family: 'Space Grotesk', sans-serif;">Apex Music Latino</div>
                        </div>
                        <p class="text-zinc-500 max-w-sm mb-8 leading-relaxed text-sm">Convierte seguidores en dinero real. El ecosistema impulsado por IA para artistas top y creadoras. Un motor. Mil posibilidades.</p>
                        <div class="flex gap-4">
                            <a class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:bg-[#00ff41] hover:text-black border-transparent transition-all" href="#"><span class="material-symbols-outlined">camera</span></a>
                            <a class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:bg-[#00ff41] hover:text-black transition-all" href="#"><span class="material-symbols-outlined">video_library</span></a>
                            <a class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:bg-[#00ff41] hover:text-black transition-all" href="#"><span class="material-symbols-outlined">public</span></a>
                        </div>
                    </div>
                    <div>
                        <h5 class="font-bold text-white mb-6 uppercase tracking-widest text-xs" style="font-family: 'Space Grotesk', sans-serif;">Platform</h5>
                        <ul class="space-y-4 text-zinc-500 text-sm">
                            <li><a class="hover:text-[#00ff41] transition-colors flex items-center gap-2" href="/#ai-clone"><span class="w-1.5 h-1.5 rounded-full bg-[#00ff41]"></span> Clon AI</a></li>
                            <li><a class="hover:text-white transition-colors" href="/artists/">Artists Hub</a></li>
                            <li><a class="hover:text-white transition-colors" href="/marketplace/">Marketplace</a></li>
                            <li><a class="hover:text-white transition-colors" href="/dashboard/">Artist OS</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 class="font-bold text-white mb-6 uppercase tracking-widest text-xs" style="font-family: 'Space Grotesk', sans-serif;">Genres</h5>
                        <ul class="space-y-4 text-zinc-500 text-sm">
                            <li><a class="hover:text-purple-400 transition-colors" href="/genre/reggaeton/">Reggaeton</a></li>
                            <li><a class="hover:text-cyan-400 transition-colors" href="/genre/rap/">Rap</a></li>
                            <li><a class="hover:text-pink-400 transition-colors" href="/genre/pop/">Pop</a></li>
                            <li><a class="hover:text-orange-400 transition-colors" href="/genre/rock/">Rock</a></li>
                            <li><a class="hover:text-emerald-400 transition-colors" href="/genre/electronic/">Electronic</a></li>
                            <li><a class="hover:text-yellow-400 transition-colors" href="/genre/afro-latin/">Afro/Latin</a></li>
                        </ul>
                    </div>
                </div>
                <div class="pt-8 border-t border-white/5 text-zinc-600 text-[10px] tracking-widest uppercase flex flex-col items-center gap-4 text-center">
                    <div class="flex gap-4 mb-2">
                        <a href="#" class="hover:text-white transition-colors">Términos</a>
                        <a href="#" class="hover:text-white transition-colors">Privacidad</a>
                        <a href="#" class="hover:text-white transition-colors">Soporte</a>
                    </div>
                    <p>&copy; 2026 Apex Music Latino &middot; powered by CUBO Intelligence &middot; datosmaestros&trade;</p>
                </div>
            </div>
        `;
    }

    document.addEventListener('DOMContentLoaded', function() {
        injectNav();
        injectFooter();
    });
})();
