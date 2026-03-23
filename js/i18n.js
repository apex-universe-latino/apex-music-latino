// Apex Music Latino — Internationalization System
// Translates all [data-i18n] elements based on current language

(function() {
    'use strict';

    var TRANSLATIONS = {
        // Navigation
        'nav.ecosystem': { en: 'Ecosystem', es: 'Ecosistema' },
        'nav.artists': { en: 'Artists', es: 'Artistas' },
        'nav.marketplace': { en: 'Marketplace', es: 'Mercado' },
        'nav.academy': { en: 'Academy', es: 'Academia' },
        'nav.artist-os': { en: 'Artist OS', es: 'Artist OS' },
        'nav.studio': { en: 'Studio', es: 'Estudio' },
        'nav.blog': { en: 'Blog', es: 'Blog' },
        'nav.join': { en: 'Join Apex', es: 'Únete a Apex' },

        // Homepage
        'home.subtitle': { en: 'The Future of Latin Music', es: 'El Futuro de la Música Latina' },
        'home.headline1': { en: 'Turn Artists Into', es: 'Convierte Artistas En' },
        'home.headline2': { en: 'Empires.', es: 'Imperios.' },
        'home.description': { en: 'Music. Data. Influence. One ecosystem. Powered by CUBO intelligence, built for Latin artists who refuse to be ordinary.', es: 'Música. Datos. Influencia. Un ecosistema. Impulsado por la inteligencia de CUBO, construido para artistas latinos que se niegan a ser ordinarios.' },
        'home.discover': { en: 'Discover Artists', es: 'Descubrir Artistas' },
        'home.join': { en: 'Join Apex', es: 'Únete a Apex' },
        'home.explore': { en: 'Explore Marketplace', es: 'Explorar Mercado' },
        'home.choose': { en: 'Choose Your Universe', es: 'Elige Tu Universo' },
        'home.one-ecosystem': { en: 'One Ecosystem.', es: 'Un Ecosistema.' },
        'home.infinite': { en: 'Infinite Power.', es: 'Poder Infinito.' },
        'home.everything': { en: 'Everything an artist needs to build, grow, and own their empire — all in one place.', es: 'Todo lo que un artista necesita para construir, crecer y ser dueño de su imperio — todo en un solo lugar.' },
        'home.featured': { en: 'Featured Artists', es: 'Artistas Destacados' },
        'home.rising': { en: 'Rising talent from the Apex universe', es: 'Talento emergente del universo Apex' },
        'home.view-all': { en: 'View All', es: 'Ver Todos' },
        'home.data-intelligence': { en: 'Data Intelligence', es: 'Inteligencia de Datos' },
        'home.powered-by': { en: 'Powered by', es: 'Impulsado por' },
        'home.cubo-desc': { en: 'The data engine behind every decision. Fan intelligence, revenue tracking, audience segmentation — built by Datos Maestros.', es: 'El motor de datos detrás de cada decisión. Inteligencia de fans, seguimiento de ingresos, segmentación de audiencia — construido por Datos Maestros.' },
        'home.data-points': { en: 'Data Points', es: 'Puntos de Datos' },
        'home.artists-tracked': { en: 'Artists Tracked', es: 'Artistas Rastreados' },
        'home.countries': { en: 'Countries', es: 'Países' },
        'home.accuracy': { en: 'Data Accuracy', es: 'Precisión de Datos' },
        'home.ready': { en: 'Ready to Build Your Empire?', es: '¿Listo Para Construir Tu Imperio?' },
        'home.ready-desc': { en: 'Join the movement. Whether you\'re an artist, manager, or brand — Apex has your lane.', es: 'Únete al movimiento. Ya seas artista, manager o marca — Apex tiene tu camino.' },
        'home.join-now': { en: 'Join Apex Now', es: 'Únete a Apex Ahora' },
        'home.start-learning': { en: 'Start Learning', es: 'Empieza a Aprender' },

        // Product cards
        'product.artist-os': { en: 'Artist OS', es: 'Artist OS' },
        'product.artist-os-desc': { en: 'EPK builder, smartlinks, merch store, ticketing, fan CRM, and analytics dashboard. Your career command center.', es: 'Constructor de EPK, smartlinks, tienda de merch, boletería, CRM de fans y dashboard de analítica. Tu centro de comando profesional.' },
        'product.academy': { en: 'Apex Academy', es: 'Apex Academia' },
        'product.academy-desc': { en: 'Contracts 101, royalties, publishing, branding, content strategy. Free + paid tiers. Learn. Build. Scale.', es: 'Contratos 101, regalías, publicación, branding, estrategia de contenido. Niveles gratuitos + de pago. Aprende. Construye. Escala.' },
        'product.marketplace': { en: 'Marketplace', es: 'Mercado' },
        'product.marketplace-desc': { en: 'Brands discover and hire artists based on audience data, engagement rate, and genre. Real influencer power.', es: 'Las marcas descubren y contratan artistas basándose en datos de audiencia, tasa de engagement y género. Poder real de influencers.' },
        'product.ai': { en: 'AI Assistant', es: 'Asistente IA' },
        'product.ai-desc': { en: 'Contract generation, royalty splits, marketing strategies, and cesion de imagen templates. Powered by Kujo AI.', es: 'Generación de contratos, splits de regalías, estrategias de marketing y plantillas de cesión de imagen. Impulsado por Kujo AI.' },
        'product.cubo': { en: 'CUBO Data Engine', es: 'Motor de Datos CUBO' },
        'product.cubo-desc': { en: 'Fan segmentation, audience intelligence, campaign tracking, revenue dashboards. Own your data, own your career.', es: 'Segmentación de fans, inteligencia de audiencia, seguimiento de campañas, dashboards de ingresos. Sé dueño de tus datos, sé dueño de tu carrera.' },
        'product.rights': { en: 'Rights & Transparency', es: 'Derechos y Transparencia' },
        'product.rights-desc': { en: 'Real-time royalty dashboards, clear splits, ownership visibility. No hidden games. No label traps.', es: 'Dashboards de regalías en tiempo real, splits claros, visibilidad de propiedad. Sin juegos ocultos. Sin trampas de sellos.' },

        // Genre names
        'genre.reggaeton': { en: 'Reggaeton', es: 'Reggaeton' },
        'genre.tango': { en: 'Tango', es: 'Tango' },
        'genre.rap': { en: 'Rap', es: 'Rap' },
        'genre.rock': { en: 'Rock', es: 'Rock' },
        'genre.electronic': { en: 'Electronic', es: 'Electrónica' },
        'genre.afro-latin': { en: 'Afro/Latin', es: 'Afro/Latino' },

        // Genre subtitles
        'genre.reggaeton-sub': { en: 'Urban Intelligence', es: 'Inteligencia Urbana' },
        'genre.tango-sub': { en: 'Passion Data', es: 'Datos con Pasión' },
        'genre.rap-sub': { en: 'Street Intelligence', es: 'Inteligencia Callejera' },
        'genre.rock-sub': { en: 'Raw Power', es: 'Poder Crudo' },
        'genre.electronic-sub': { en: 'Cyber Pulse', es: 'Pulso Cibernético' },
        'genre.afro-latin-sub': { en: 'Roots & Future', es: 'Raíces y Futuro' },

        // Artists page
        'artists.roster': { en: 'Apex Roster', es: 'Roster de Apex' },
        'artists.title': { en: 'Our Artists', es: 'Nuestros Artistas' },
        'artists.desc': { en: 'The next generation of Latin music. Every artist on our roster is backed by data intelligence, creative infrastructure, and a system designed to build empires.', es: 'La siguiente generación de la música latina. Cada artista en nuestro roster está respaldado por inteligencia de datos, infraestructura creativa y un sistema diseñado para construir imperios.' },
        'artists.all': { en: 'All', es: 'Todos' },
        'artists.view-epk': { en: 'View EPK', es: 'Ver EPK' },
        'artists.next-empire': { en: 'Are You The Next Empire?', es: '¿Eres El Próximo Imperio?' },
        'artists.scouting': { en: 'We\'re scouting talent across Latin America. If you\'ve got the fire, we\'ve got the system.', es: 'Estamos buscando talento en toda América Latina. Si tienes el fuego, nosotros tenemos el sistema.' },
        'artists.apply': { en: 'Apply to Join Apex', es: 'Aplica Para Unirte a Apex' },

        // Footer
        'footer.tagline': { en: 'The premier ecosystem for the evolution of Latin music. Driven by data, inspired by passion, built for the future.', es: 'El ecosistema premier para la evolución de la música latina. Impulsado por datos, inspirado por pasión, construido para el futuro.' },
        'footer.platform': { en: 'Platform', es: 'Plataforma' },
        'footer.genres': { en: 'Genres', es: 'Géneros' },
        'footer.rights': { en: 'All rights reserved.', es: 'Todos los derechos reservados.' },
        'footer.powered': { en: 'Powered by', es: 'Impulsado por' },

        // Common
        'common.fans': { en: 'Fans', es: 'Fans' },
        'common.streams': { en: 'Streams', es: 'Streams' },
        'common.engagement': { en: 'Eng.', es: 'Eng.' }
    };

    // Get stored language or detect from URL
    function getLang() {
        var stored = localStorage.getItem('apex_lang');
        if (stored) return stored;
        var path = window.location.pathname;
        if (path.includes('/blog/es') || path.includes('/es/')) return 'es';
        return 'en';
    }

    function setLang(lang) {
        localStorage.setItem('apex_lang', lang);
    }

    function t(key) {
        var lang = getLang();
        var entry = TRANSLATIONS[key];
        if (!entry) return key;
        return entry[lang] || entry['en'] || key;
    }

    // Translate all elements with data-i18n attribute
    function translatePage() {
        var lang = getLang();
        var elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(function(el) {
            var key = el.getAttribute('data-i18n');
            var entry = TRANSLATIONS[key];
            if (entry) {
                el.textContent = entry[lang] || entry['en'];
            }
        });

        // Also translate data-i18n-placeholder
        var placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(function(el) {
            var key = el.getAttribute('data-i18n-placeholder');
            var entry = TRANSLATIONS[key];
            if (entry) {
                el.placeholder = entry[lang] || entry['en'];
            }
        });

        // Update html lang attribute
        document.documentElement.lang = lang;
    }

    // Make available globally
    window.ApexI18n = {
        t: t,
        getLang: getLang,
        setLang: setLang,
        translate: translatePage,
        translations: TRANSLATIONS
    };

    // Auto-translate on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', translatePage);
    } else {
        translatePage();
    }
})();
