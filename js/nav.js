// Apex Music Latino — Shared Navigation System
// Injects consistent nav across all pages

(function() {
    'use strict';

    const GENRES = [
        { id: 'reggaeton', label: 'Reggaeton', icon: 'equalizer', path: '/genre/reggaeton/' },
        { id: 'tango', label: 'Tango', icon: 'theater_comedy', path: '/genre/tango/' },
        { id: 'rap', label: 'Rap', icon: 'mic', path: '/genre/rap/' },
        { id: 'rock', label: 'Rock', icon: 'electric_bolt', path: '/genre/rock/' },
        { id: 'electronic', label: 'Electronic', icon: 'settings_input_component', path: '/genre/electronic/' },
        { id: 'afro-latin', label: 'Afro/Latin', icon: 'blur_on', path: '/genre/afro-latin/' }
    ];

    const NAV_LINKS = [
        { label: 'Ecosystem', path: '/' },
        { label: 'Artists', path: '/artists/' },
        { label: 'Marketplace', path: '/marketplace/' },
        { label: 'Academy', path: '/academy/' },
        { label: 'Artist OS', path: '/dashboard/' },
        { label: 'Studio', path: '/studio/' },
        { label: 'Blog', path: '/blog/' }
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

    // Genre selector HTML
    function genreSelectorHTML() {
        return GENRES.map(g => {
            const isActive = currentGenre === g.id;
            const cls = isActive
                ? 'text-xs uppercase tracking-widest font-bold border-b pb-1'
                : 'text-xs uppercase tracking-widest font-medium text-neutral-500 hover:text-neutral-100 transition-colors';
            const style = isActive ? `color: var(--accent); border-color: var(--accent);` : '';
            return `<a href="${g.path}" class="${cls}" style="${style}">${g.label}</a>`;
        }).join('');
    }

    // Main nav links HTML
    function navLinksHTML() {
        const path = window.location.pathname;
        return NAV_LINKS.map(link => {
            const isActive = path === link.path || (link.path !== '/' && path.startsWith(link.path));
            const cls = isActive
                ? 'border-b-2 pb-1'
                : 'text-neutral-400 hover:text-neutral-100 transition-colors';
            const style = isActive ? `color: var(--accent); border-color: var(--accent);` : '';
            return `<a class="${cls}" style="${style}" href="${link.path}">${link.label}</a>`;
        }).join('');
    }

    // Detect current language from URL
    function detectLang() {
        const path = window.location.pathname;
        if (path.includes('/blog/es') || path.includes('/es/')) return 'es';
        return 'en';
    }

    // Build the toggled URL for switching languages
    function langToggleURL(targetLang) {
        const path = window.location.pathname;
        const isBlogPage = path.startsWith('/blog');

        if (!isBlogPage) {
            // Non-blog pages don't have ES versions yet — stay on same page
            return path;
        }

        if (targetLang === 'es') {
            // EN → ES
            // /blog/posts/slug/ → /blog/posts/es/slug/
            if (path.match(/^\/blog\/posts\/[^/]+\//)) {
                return path.replace(/^\/blog\/posts\//, '/blog/posts/es/');
            }
            // /blog/category/cat/ → /blog/es/category/cat/
            if (path.match(/^\/blog\/category\//)) {
                return path.replace(/^\/blog\//, '/blog/es/');
            }
            // /blog/ → /blog/es/
            return path.replace(/^\/blog\//, '/blog/es/');
        } else {
            // ES → EN
            // /blog/posts/es/slug/ → /blog/posts/slug/
            if (path.match(/^\/blog\/posts\/es\//)) {
                return path.replace(/^\/blog\/posts\/es\//, '/blog/posts/');
            }
            // /blog/es/category/cat/ → /blog/category/cat/
            if (path.match(/^\/blog\/es\/category\//)) {
                return path.replace(/^\/blog\/es\//, '/blog/');
            }
            // /blog/es/ → /blog/
            return path.replace(/^\/blog\/es\//, '/blog/');
        }
    }

    // Language toggle HTML
    function langToggleHTML() {
        const lang = detectLang();
        const isEN = lang === 'en';
        const isES = lang === 'es';
        const isBlogPage = window.location.pathname.startsWith('/blog');
        const enURL = isEN ? '#' : langToggleURL('en');
        const esURL = isES ? '#' : langToggleURL('es');
        const tooltip = !isBlogPage ? ' title="Language toggle available on blog pages"' : '';

        return `<div class="flex items-center gap-1 px-3 py-1 rounded-full border border-white/10 text-xs font-bold"${tooltip}>` +
            `<a href="${enURL}" class="px-2 py-1 rounded-full transition-colors ${isEN ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}">EN</a>` +
            `<a href="${esURL}" class="px-2 py-1 rounded-full transition-colors ${isES ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}">ES</a>` +
        `</div>`;
    }

    // Build and inject navbar
    function injectNav() {
        const existingNav = document.querySelector('nav');
        if (!existingNav) return;

        const nav = document.createElement('nav');
        nav.className = 'fixed top-0 w-full z-50 bg-neutral-950/60 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] h-20 flex justify-between items-center px-8';
        nav.id = 'apex-nav';
        nav.innerHTML = `
            <div class="flex items-center gap-12">
                <a href="/" class="text-2xl font-bold tracking-tighter text-neutral-100" style="font-family: var(--font-headline);">Apex Music Latino</a>
                <div class="hidden lg:flex items-center gap-6 overflow-x-auto py-2" style="scrollbar-width: none;">
                    ${genreSelectorHTML()}
                </div>
            </div>
            <div class="flex items-center gap-8">
                <div class="hidden md:flex gap-6 tracking-tight" style="font-family: var(--font-headline);">
                    ${navLinksHTML()}
                </div>
                <div class="flex items-center gap-4">
                    <button onclick="document.getElementById('mobile-menu').classList.toggle('hidden')" class="md:hidden material-symbols-outlined text-neutral-400 hover:text-white">menu</button>
                    ${langToggleHTML()}
                    <a href="/onboarding/" class="px-6 py-2 font-bold rounded-lg text-sm hover:scale-95 transition-transform duration-200 text-black gradient-accent">Join Apex</a>
                </div>
            </div>
            <!-- Mobile menu -->
            <div id="mobile-menu" class="hidden absolute top-20 left-0 right-0 bg-neutral-950/95 backdrop-blur-xl p-6 md:hidden border-t border-white/10">
                <div class="flex flex-col gap-4 mb-6" style="font-family: var(--font-headline);">
                    ${NAV_LINKS.map(l => `<a href="${l.path}" class="text-neutral-300 hover:text-white py-2">${l.label}</a>`).join('')}
                </div>
                <div class="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                    ${GENRES.map(g => `<a href="${g.path}" class="text-xs uppercase tracking-widest text-neutral-500 hover:text-white py-1">${g.label}</a>`).join('')}
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
            <div class="max-w-7xl mx-auto">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div class="col-span-2">
                        <div class="text-2xl font-bold tracking-tighter uppercase mb-6" style="font-family: var(--font-headline); color: var(--accent);">Apex Music Latino</div>
                        <p class="text-zinc-500 max-w-sm mb-8 leading-relaxed">The premier ecosystem for the evolution of Latin music. Driven by data, inspired by passion, built for the future.</p>
                        <div class="flex gap-4">
                            <a class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-colors" href="https://instagram.com/apexmusiclatino" target="_blank"><span class="material-symbols-outlined">camera</span></a>
                            <a class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-colors" href="https://tiktok.com/@apexmusiclatino" target="_blank"><span class="material-symbols-outlined">video_library</span></a>
                            <a class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-colors" href="https://twitter.com/apexmusiclatino" target="_blank"><span class="material-symbols-outlined">public</span></a>
                        </div>
                    </div>
                    <div>
                        <h5 class="font-bold text-on-surface mb-6" style="font-family: var(--font-headline);">Platform</h5>
                        <ul class="space-y-4 text-zinc-500 text-sm">
                            <li><a class="hover:text-white transition-colors" href="/artists/">Artists</a></li>
                            <li><a class="hover:text-white transition-colors" href="/marketplace/">Marketplace</a></li>
                            <li><a class="hover:text-white transition-colors" href="/academy/">Academy</a></li>
                            <li><a class="hover:text-white transition-colors" href="/dashboard/">Artist OS</a></li>
                            <li><a class="hover:text-white transition-colors" href="/studio/">Studio</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 class="font-bold text-on-surface mb-6" style="font-family: var(--font-headline);">Genres</h5>
                        <ul class="space-y-4 text-zinc-500 text-sm">
                            <li><a class="hover:text-white transition-colors" href="/genre/reggaeton/">Reggaeton</a></li>
                            <li><a class="hover:text-white transition-colors" href="/genre/tango/">Tango</a></li>
                            <li><a class="hover:text-white transition-colors" href="/genre/rap/">Rap</a></li>
                            <li><a class="hover:text-white transition-colors" href="/genre/rock/">Rock</a></li>
                            <li><a class="hover:text-white transition-colors" href="/genre/electronic/">Electronic</a></li>
                            <li><a class="hover:text-white transition-colors" href="/genre/afro-latin/">Afro/Latin</a></li>
                        </ul>
                    </div>
                </div>
                <div class="pt-8 border-t border-white/5 text-zinc-600 text-[10px] tracking-[0.2em] uppercase flex flex-col md:flex-row justify-between gap-4">
                    <div>&copy; 2026 Apex Music Latino. All rights reserved.</div>
                    <div class="flex gap-6">
                        <a href="#" class="hover:text-white transition-colors">Transparency</a>
                        <a href="#" class="hover:text-white transition-colors">Rights</a>
                        <a href="#" class="hover:text-white transition-colors">Privacy</a>
                        <a href="#" class="hover:text-white transition-colors">Terms</a>
                    </div>
                    <div>Powered by <span style="color: var(--accent);">CUBO</span> Data Engine</div>
                </div>
            </div>
        `;
    }

    document.addEventListener('DOMContentLoaded', function() {
        injectNav();
        injectFooter();
    });
})();
