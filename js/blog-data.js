// Apex Music Latino — Blog Data Layer
// Follows B.L.A.S.T. blueprint adapted from blog-transfer-blueprint.md

const BLOG_CATEGORIES = [
    { name: 'Artist Development', nameEs: 'Desarrollo de Artistas', slug: 'artist-development', icon: 'mic' },
    { name: 'Music Business', nameEs: 'Negocio Musical', slug: 'music-business', icon: 'business_center' },
    { name: 'Data & Analytics', nameEs: 'Datos y Analítica', slug: 'data-analytics', icon: 'analytics' },
    { name: 'Marketing', nameEs: 'Marketing', slug: 'marketing', icon: 'campaign' },
    { name: 'Rights & Royalties', nameEs: 'Derechos y Regalías', slug: 'rights-royalties', icon: 'gavel' },
    { name: 'Industry News', nameEs: 'Noticias de la Industria', slug: 'industry-news', icon: 'newspaper' },
    { name: 'Academy', nameEs: 'Academia', slug: 'academy', icon: 'school' },
    { name: 'Technology', nameEs: 'Tecnología', slug: 'technology', icon: 'smart_toy' }
];

const BLOG_POSTS = [
    {
        id: 1,
        slug: 'why-latin-artists-need-data-intelligence',
        slugEs: 'por-que-artistas-latinos-necesitan-inteligencia-de-datos',
        title: 'Why Latin Artists Need Data Intelligence in 2026',
        titleEs: 'Por Qué los Artistas Latinos Necesitan Inteligencia de Datos en 2026',
        excerpt: 'The music industry has changed. Streams are currency, fans are data points, and the artists who understand their numbers are the ones building empires.',
        excerptEs: 'La industria musical ha cambiado. Los streams son moneda, los fans son puntos de datos, y los artistas que entienden sus números son los que construyen imperios.',
        date: '2026-03-20',
        author: 'Apex Music Latino',
        category: 'Data & Analytics',
        categoryEs: 'Datos y Analítica',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKKfawZvxjPqD6NQkFACfm5DyaEYniuNDSxyi2o_IuEb5kW60nb0V3c2K8t-4g1Vr41Vc_83aFlgY5oemI_T8_LIAFAFWTDLBAXBcUM1MQXmwozhuPeOE1yM3eMAxHwgvWpcwsY5xA1vFDiEGchu24hOrjPeODu3jZKNT0X4UBzYekImnkALRgpM_AJZurtNPAS7N0iJZgxze8QFOj3aU4a4zPEUe7nEzt9ZjfAVTzP_yQqK2rQ3s8EB_oAJvMQBGgYyvvWcp0hAs',
        readTime: '7 min read',
        readTimeEs: '7 min de lectura',
        content: 'In the old days, a record label would sign you based on a gut feeling. Today, **data is the new A&R**. The artists who thrive in 2026 are the ones who understand where their fans live, what they listen to, and when they\'re most engaged.\n\nAt Apex Music Latino, we believe every artist deserves access to the same intelligence tools that major labels have been hoarding for decades.',
        contentEs: 'En los viejos tiempos, un sello discográfico te firmaba basándose en un presentimiento. Hoy, **los datos son el nuevo A&R**. Los artistas que prosperan en 2026 son los que entienden dónde viven sus fans, qué escuchan y cuándo están más comprometidos.\n\nEn Apex Music Latino, creemos que cada artista merece acceso a las mismas herramientas de inteligencia que los grandes sellos han estado acaparando durante décadas.',
        sections: [
            {
                title: 'The Problem: Flying Blind',
                content: 'Most independent Latin artists have no idea where their fans are. They release music, hope for the best, and wonder why their streams plateau.\n\nThe truth is: **your music is already generating data**. Every stream, every save, every playlist add is a signal. The question is whether you\'re reading those signals or ignoring them.'
            },
            {
                title: 'What CUBO Changes',
                content: 'CUBO, our proprietary data engine built by Datos Maestros, aggregates signals from multiple platforms into a single intelligence dashboard.\n\n- **Fan Segmentation**: Know exactly which cities, age groups, and platforms drive your growth\n- **Predictive Analytics**: See which songs are gaining momentum before they peak\n- **Revenue Mapping**: Track every dollar from streams, merch, and live shows in real-time\n- **Territory Heat Maps**: Visual representation of where your music is crossing borders'
            },
            {
                title: 'Case Study: From 10K to 1M',
                content: 'One of our artists went from 10,000 monthly listeners to over 1 million in 8 months — not by making better music (their music was always great), but by **targeting the right audience at the right time**.\n\nUsing CUBO data, we identified that their strongest engagement came from a city they\'d never even considered touring. One targeted campaign later, they had a sold-out show and 200,000 new followers.'
            },
            {
                title: 'How to Get Started',
                content: 'You don\'t need to be a data scientist. You need a system.\n\n1. **Join Apex**: Our onboarding connects your Spotify, Instagram, and TikTok in minutes\n2. **See Your Dashboard**: CUBO starts analyzing immediately\n3. **Act on Insights**: We don\'t just show you data — we tell you what to do with it\n\nThe future belongs to artists who own their data. Don\'t let someone else control your narrative.'
            }
        ],
        sectionsEs: [
            {
                title: 'El Problema: Volando a Ciegas',
                content: 'La mayoría de los artistas latinos independientes no tienen idea de dónde están sus fans. Lanzan música, esperan lo mejor y se preguntan por qué sus streams se estancan.\n\nLa verdad es: **tu música ya está generando datos**. Cada stream, cada guardado, cada agregada a playlist es una señal. La pregunta es si estás leyendo esas señales o ignorándolas.'
            },
            {
                title: 'Lo Que CUBO Cambia',
                content: 'CUBO, nuestro motor de datos propietario construido por Datos Maestros, agrega señales de múltiples plataformas en un solo tablero de inteligencia.\n\n- **Segmentación de Fans**: Sabe exactamente qué ciudades, grupos de edad y plataformas impulsan tu crecimiento\n- **Analítica Predictiva**: Ve qué canciones están ganando impulso antes de que lleguen a su pico\n- **Mapeo de Ingresos**: Rastrea cada dólar de streams, merch y shows en vivo en tiempo real\n- **Mapas de Calor por Territorio**: Representación visual de dónde tu música está cruzando fronteras'
            },
            {
                title: 'Caso de Estudio: De 10K a 1M',
                content: 'Uno de nuestros artistas pasó de 10,000 oyentes mensuales a más de 1 millón en 8 meses — no haciendo mejor música (su música siempre fue genial), sino **dirigiéndose a la audiencia correcta en el momento correcto**.\n\nUsando datos de CUBO, identificamos que su engagement más fuerte venía de una ciudad que ni siquiera habían considerado para hacer gira. Una campaña dirigida después, tenían un show agotado y 200,000 nuevos seguidores.'
            },
            {
                title: 'Cómo Empezar',
                content: 'No necesitas ser un científico de datos. Necesitas un sistema.\n\n1. **Únete a Apex**: Nuestro onboarding conecta tu Spotify, Instagram y TikTok en minutos\n2. **Ve Tu Dashboard**: CUBO comienza a analizar inmediatamente\n3. **Actúa Sobre los Insights**: No solo te mostramos datos — te decimos qué hacer con ellos\n\nEl futuro pertenece a los artistas que son dueños de sus datos. No dejes que alguien más controle tu narrativa.'
            }
        ],
        keywords: ['data intelligence', 'latin music', 'CUBO', 'fan analytics', 'artist development']
    },
    {
        id: 2,
        slug: 'electronic-press-kit-guide',
        slugEs: 'guia-kit-de-prensa-electronico',
        title: 'The Ultimate EPK Guide: Your Digital Business Card',
        titleEs: 'La Guía Definitiva del EPK: Tu Tarjeta de Presentación Digital',
        excerpt: 'Your Electronic Press Kit is the first impression you make on bookers, labels, and brands. Here\'s how to make it unforgettable.',
        excerptEs: 'Tu Kit de Prensa Electrónico es la primera impresión que das a bookers, sellos y marcas. Así es como hacerlo inolvidable.',
        date: '2026-03-18',
        author: 'Apex Music Latino',
        category: 'Artist Development',
        categoryEs: 'Desarrollo de Artistas',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1a02J04Ye-YLJI6RQOtIEWsoak0rcH37rrc_1bbJ3Qt_08lTOOZK5bcq5pyuLN7ady7H1zSrasiDxDomppHCSFhqSZ0FFM21s0WCFaMsZU_jJwhWqvgfiqnW_grw2wpTdgelosT8tbNBOaRo2IxWtHSqK1JQBYbac5dF3jU4zxn8bA5Z8Zq2c2vzzuBwuSGFzrbSbv2R63eT95w0dMkSdZrfNSu-UX8uJic2hqQmWarLHv0GuorDTqtZWCdE-slH4bXATLL9jZcQ',
        readTime: '10 min read',
        readTimeEs: '10 min de lectura',
        content: 'An EPK isn\'t just a PDF anymore. In 2026, your Electronic Press Kit is a **living, breathing digital experience** that tells your story, showcases your numbers, and makes it dead simple for anyone to book, feature, or invest in you.',
        contentEs: 'Un EPK ya no es solo un PDF. En 2026, tu Kit de Prensa Electrónico es una **experiencia digital viva y dinámica** que cuenta tu historia, muestra tus números y hace que sea súper fácil para cualquiera contratarte, presentarte o invertir en ti.',
        sections: [
            { title: 'What Makes a Killer EPK', content: 'The best EPKs in 2026 have five non-negotiable elements:\n\n1. **Hero Visual**: A cinematic photo that captures your brand in one frame\n2. **Stats That Matter**: Monthly listeners, engagement rate, top territories — not vanity metrics\n3. **Music Player**: Your best 3-4 tracks, instantly playable\n4. **Smart Links**: One-click access to every platform\n5. **Contact CTA**: A clear, professional way to reach you or your team\n\nEverything else is optional. These five are mandatory.' },
            { title: 'The Apex EPK Advantage', content: 'With Apex Artist OS, your EPK is automatically generated from your profile data. It stays current because it pulls from your live CUBO dashboard.\n\n- Stats update in real-time\n- New releases appear automatically\n- QR code included for physical sharing\n- Genre-themed design that matches your identity\n- Mobile-first (because 80% of people will view it on their phone)' },
            { title: 'EPK Mistakes to Avoid', content: '- **Too much text**: Your EPK is not your autobiography\n- **Outdated numbers**: Nothing kills credibility faster than showing last year\'s stats\n- **No clear CTA**: If someone loves what they see, what do they do next?\n- **Bad photos**: One great photo beats ten mediocre ones\n- **Missing social proof**: Press quotes, playlist features, collaboration history' },
            { title: 'Build Yours Today', content: 'Every artist on Apex gets a professional EPK at their own URL:\n\n`apexmusiclatino.com/genre/[your-genre]/[your-name]`\n\nThis becomes your QR code destination, your link-in-bio, and your booking tool — all in one. No design skills required.' }
        ],
        sectionsEs: [
            { title: 'Qué Hace un EPK Demoledor', content: 'Los mejores EPKs en 2026 tienen cinco elementos no negociables:\n\n1. **Visual Principal**: Una foto cinematográfica que capture tu marca en un frame\n2. **Estadísticas que Importan**: Oyentes mensuales, tasa de engagement, territorios principales — no métricas de vanidad\n3. **Reproductor de Música**: Tus mejores 3-4 tracks, reproducibles al instante\n4. **Links Inteligentes**: Acceso con un clic a cada plataforma\n5. **CTA de Contacto**: Una forma clara y profesional de contactarte a ti o a tu equipo\n\nTodo lo demás es opcional. Estos cinco son obligatorios.' },
            { title: 'La Ventaja del EPK de Apex', content: 'Con Apex Artist OS, tu EPK se genera automáticamente de los datos de tu perfil. Se mantiene actualizado porque tira de tu dashboard CUBO en vivo.\n\n- Las estadísticas se actualizan en tiempo real\n- Los nuevos lanzamientos aparecen automáticamente\n- Código QR incluido para compartir físicamente\n- Diseño temático por género que coincide con tu identidad\n- Mobile-first (porque el 80% de la gente lo verá en su teléfono)' },
            { title: 'Errores de EPK a Evitar', content: '- **Demasiado texto**: Tu EPK no es tu autobiografía\n- **Números desactualizados**: Nada mata la credibilidad más rápido que mostrar stats del año pasado\n- **Sin CTA claro**: Si a alguien le encanta lo que ve, ¿qué hace después?\n- **Malas fotos**: Una gran foto gana a diez mediocres\n- **Falta de prueba social**: Citas de prensa, features en playlists, historial de colaboraciones' },
            { title: 'Construye el Tuyo Hoy', content: 'Cada artista en Apex obtiene un EPK profesional en su propia URL:\n\n`apexmusiclatino.com/genre/[tu-genero]/[tu-nombre]`\n\nEsto se convierte en el destino de tu código QR, tu link-in-bio y tu herramienta de booking — todo en uno. Sin necesidad de habilidades de diseño.' }
        ],
        keywords: ['EPK', 'electronic press kit', 'artist branding', 'booking', 'music marketing']
    },
    {
        id: 3,
        slug: 'understanding-music-royalties-latam',
        slugEs: 'entendiendo-regalias-musicales-latam',
        title: 'Music Royalties in LATAM: What Every Artist Must Know',
        titleEs: 'Regalías Musicales en LATAM: Lo Que Todo Artista Debe Saber',
        excerpt: 'Royalties in Latin America are complex, fragmented, and often opaque. We break down every revenue stream so you never leave money on the table.',
        excerptEs: 'Las regalías en América Latina son complejas, fragmentadas y a menudo opacas. Desglosamos cada flujo de ingresos para que nunca dejes dinero sobre la mesa.',
        date: '2026-03-15',
        author: 'Apex Music Latino',
        category: 'Rights & Royalties',
        categoryEs: 'Derechos y Regalías',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJgBR8zt0kk7RB-9OR3QV8hBBZUBCBxW0EocYsI1f15fLVKqYyBIX-Ok9uxEHsibtabR5SqTAO2nEkz8Ohazc3bC0J4U_lPr_0UqqpSTFhW5KRoULDEGMY6aKw4ZzpUAWMcs1CrjE7db6oUrUwmZ6kpcM6sawGUzLCpoVpiz6kNvjfh0XyqPUrhx8fLCCHTg9sTTsbEQrSKPyU2c0WMNDeHNu4nq9BALMNQRb3eLp2hY0jmEuHbfWnRIJVw5bnl6RtpsHkJfMnZds',
        readTime: '12 min read',
        readTimeEs: '12 min de lectura',
        content: 'If you\'re a Latin artist and you don\'t understand royalties, you\'re probably losing money right now. The system is designed to be confusing — but it doesn\'t have to be.',
        contentEs: 'Si eres un artista latino y no entiendes las regalías, probablemente estás perdiendo dinero ahora mismo. El sistema está diseñado para ser confuso — pero no tiene que serlo.',
        sections: [
            { title: 'The 6 Types of Music Royalties', content: 'Every song you create generates up to **six different revenue streams**:\n\n1. **Mechanical Royalties**: Paid when your song is reproduced (streams, downloads, physical copies)\n2. **Performance Royalties**: Paid when your song is played publicly (radio, TV, venues, restaurants)\n3. **Sync Royalties**: Paid when your song is used in visual media (films, ads, games)\n4. **Print Royalties**: Paid when your lyrics or sheet music are reproduced\n5. **Digital Performance Royalties**: Paid for non-interactive digital plays (Pandora, SiriusXM)\n6. **Neighboring Rights**: Paid to performers and producers (not just songwriters)\n\nMost Latin artists only collect 1-2 of these. The rest goes unclaimed.' },
            { title: 'PROs in Latin America', content: 'Performance Rights Organizations (PROs) collect royalties on your behalf — but only if you\'re registered:\n\n- **SAYCO** (Colombia)\n- **SACM** (Mexico)\n- **SADAIC** (Argentina)\n- **SCD** (Chile)\n- **APDAYC** (Peru)\n- **SGAE** (Spain — important for LATAM crossover)\n\nIf you\'re not registered with the right PRO for your territory, you\'re leaving money on the table.' },
            { title: 'The Apex Transparency Model', content: 'At Apex Music Latino, we believe in **radical transparency**:\n\n- Every royalty stream is tracked and visible in your Artist OS dashboard\n- Splitsheets are created on day one of every collaboration\n- Monthly statements are downloadable, not quarterly\n- No hidden fees, no administrative deductions you don\'t understand\n\nThis is what separates us from traditional labels that made billions by keeping artists in the dark.' },
            { title: 'Action Steps', content: '1. **Register with your local PRO** if you haven\'t already\n2. **Check your metadata**: ISRC codes, IPI numbers, and songwriter credits must be correct\n3. **Join Apex Academy**: Our Royalties 101 course walks you through everything\n4. **Connect to CUBO**: See your revenue streams in real-time\n\nYour music is an asset. Treat it like one.' }
        ],
        sectionsEs: [
            { title: 'Los 6 Tipos de Regalías Musicales', content: 'Cada canción que creas genera hasta **seis flujos de ingresos diferentes**:\n\n1. **Regalías Mecánicas**: Se pagan cuando tu canción se reproduce (streams, descargas, copias físicas)\n2. **Regalías de Ejecución**: Se pagan cuando tu canción se reproduce públicamente (radio, TV, venues, restaurantes)\n3. **Regalías de Sincronización**: Se pagan cuando tu canción se usa en medios visuales (películas, anuncios, juegos)\n4. **Regalías de Impresión**: Se pagan cuando tus letras o partituras se reproducen\n5. **Regalías de Ejecución Digital**: Se pagan por reproducciones digitales no interactivas (Pandora, SiriusXM)\n6. **Derechos Conexos**: Se pagan a intérpretes y productores (no solo compositores)\n\nLa mayoría de los artistas latinos solo cobran 1-2 de estos. El resto queda sin reclamar.' },
            { title: 'Sociedades de Gestión en América Latina', content: 'Las Organizaciones de Derechos de Ejecución cobran regalías en tu nombre — pero solo si estás registrado:\n\n- **SAYCO** (Colombia)\n- **SACM** (México)\n- **SADAIC** (Argentina)\n- **SCD** (Chile)\n- **APDAYC** (Perú)\n- **SGAE** (España — importante para crossover LATAM)\n\nSi no estás registrado con la sociedad correcta para tu territorio, estás dejando dinero sobre la mesa.' },
            { title: 'El Modelo de Transparencia de Apex', content: 'En Apex Music Latino, creemos en la **transparencia radical**:\n\n- Cada flujo de regalías se rastrea y es visible en tu dashboard de Artist OS\n- Los splitsheets se crean desde el día uno de cada colaboración\n- Los estados de cuenta mensuales son descargables, no trimestrales\n- Sin tarifas ocultas, sin deducciones administrativas que no entiendas\n\nEsto es lo que nos separa de los sellos tradicionales que hicieron miles de millones manteniendo a los artistas en la oscuridad.' },
            { title: 'Pasos de Acción', content: '1. **Regístrate en tu sociedad de gestión local** si aún no lo has hecho\n2. **Verifica tus metadatos**: Los códigos ISRC, números IPI y créditos de compositor deben ser correctos\n3. **Únete a Apex Academy**: Nuestro curso de Regalías 101 te guía por todo\n4. **Conéctate a CUBO**: Ve tus flujos de ingresos en tiempo real\n\nTu música es un activo. Trátala como tal.' }
        ],
        keywords: ['royalties', 'music rights', 'LATAM', 'PRO', 'publishing', 'SAYCO', 'mechanical royalties']
    },
    {
        id: 4,
        slug: 'tango-renaissance-data-driven',
        slugEs: 'renacimiento-del-tango-impulsado-por-datos',
        title: 'The Tango Renaissance: How Data is Reviving a Classic Genre',
        titleEs: 'El Renacimiento del Tango: Cómo los Datos Están Reviviendo un Género Clásico',
        excerpt: 'Tango is experiencing a global comeback — and data intelligence is the secret weapon driving neo-tango artists to new audiences.',
        excerptEs: 'El tango está experimentando un regreso global — y la inteligencia de datos es el arma secreta que impulsa a los artistas de neo-tango hacia nuevas audiencias.',
        date: '2026-03-12',
        author: 'Apex Music Latino',
        category: 'Industry News',
        categoryEs: 'Noticias de la Industria',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvyGjUrcUbBZ5FJXLDLpGZdllaZEswCQNhLIQP7RNuipdEk3Di3-GXlZ8jsDevnl9u-_4YIAD4eZoHB1QiVoALucNd3jl8vf005Do0Sb7d1Ee57YgO1hlkK_XNe_5fsMic9mtRlUs27HL7UPuVgjejNGgCoUtrFJX6Gk9-VDJ1mCQGfuv2OcyvHUGzh61Rq5kZExSOatPC7Lv5QvXdL4ChkC3F_3EAKqnZZEaOj0q-rEP965UL-1_FpHLEW86Qh56P8lBPg1JFvoM',
        readTime: '8 min read',
        readTimeEs: '8 min de lectura',
        content: 'Tango isn\'t just surviving — it\'s **thriving**. Streaming data shows a 340% increase in neo-tango consumption across Europe and Asia over the past 18 months. The question is: why now?',
        contentEs: 'El tango no solo está sobreviviendo — está **prosperando**. Los datos de streaming muestran un aumento del 340% en el consumo de neo-tango en Europa y Asia en los últimos 18 meses. La pregunta es: ¿por qué ahora?',
        sections: [
            { title: 'The Numbers Don\'t Lie', content: 'According to CUBO analytics:\n\n- Neo-tango streams grew **340%** in Europe (2024-2026)\n- Buenos Aires-based artists saw a **180% increase** in followers from Japan, South Korea, and Germany\n- Tango-electronic fusion is the fastest-growing Latin sub-genre on Spotify\n- The average tango listener is **28 years old** (down from 45 in 2020)\n\nThis isn\'t nostalgia. This is a new generation discovering tango through algorithms.' },
            { title: 'What\'s Driving the Revival', content: '**1. Dance content on TikTok**: Tango dance challenges have accumulated over 2 billion views\n\n**2. Electronic fusion**: Artists blending bandoneón with electronic production are creating something entirely new\n\n**3. Cultural tourism**: Post-pandemic travel to Buenos Aires has created a pipeline of new fans\n\n**4. Data-driven targeting**: For the first time, tango artists can identify and reach their global audience precisely' },
            { title: 'Apex & Tango: Arcoiris', content: 'Our tango group Arcoiris is at the forefront of this movement. Using CUBO data, we identified unexpected demand in markets like Berlin, Tokyo, and Seoul — cities that traditional tango promotion would never have targeted.\n\nThe result: sold-out shows in markets that didn\'t exist for tango five years ago.' },
            { title: 'The Future of Tango', content: 'The tango renaissance proves a fundamental truth about the music industry: **no genre dies if it has data**.\n\nWhen you can see exactly where demand is growing, you can meet it. When you can identify which fusion styles resonate with younger audiences, you can evolve without losing your soul.\n\nThat\'s the Apex model: respect the tradition, leverage the technology.' }
        ],
        sectionsEs: [
            { title: 'Los Números No Mienten', content: 'Según la analítica de CUBO:\n\n- Los streams de neo-tango crecieron un **340%** en Europa (2024-2026)\n- Los artistas basados en Buenos Aires vieron un **aumento del 180%** en seguidores de Japón, Corea del Sur y Alemania\n- La fusión tango-electrónica es el sub-género latino de más rápido crecimiento en Spotify\n- El oyente promedio de tango tiene **28 años** (bajó de 45 en 2020)\n\nEsto no es nostalgia. Es una nueva generación descubriendo el tango a través de algoritmos.' },
            { title: 'Qué Está Impulsando el Renacimiento', content: '**1. Contenido de baile en TikTok**: Los desafíos de baile de tango han acumulado más de 2 mil millones de vistas\n\n**2. Fusión electrónica**: Artistas mezclando bandoneón con producción electrónica están creando algo completamente nuevo\n\n**3. Turismo cultural**: Los viajes post-pandemia a Buenos Aires han creado un pipeline de nuevos fans\n\n**4. Targeting basado en datos**: Por primera vez, los artistas de tango pueden identificar y alcanzar su audiencia global con precisión' },
            { title: 'Apex y Tango: Arcoiris', content: 'Nuestro grupo de tango Arcoiris está a la vanguardia de este movimiento. Usando datos de CUBO, identificamos demanda inesperada en mercados como Berlín, Tokio y Seúl — ciudades que la promoción tradicional de tango nunca habría apuntado.\n\nEl resultado: shows agotados en mercados que no existían para el tango hace cinco años.' },
            { title: 'El Futuro del Tango', content: 'El renacimiento del tango prueba una verdad fundamental sobre la industria musical: **ningún género muere si tiene datos**.\n\nCuando puedes ver exactamente dónde está creciendo la demanda, puedes encontrarla. Cuando puedes identificar qué estilos de fusión resuenan con audiencias más jóvenes, puedes evolucionar sin perder tu alma.\n\nEse es el modelo Apex: respetar la tradición, aprovechar la tecnología.' }
        ],
        keywords: ['tango', 'neo-tango', 'genre revival', 'streaming data', 'Arcoiris', 'Buenos Aires']
    },
    {
        id: 5,
        slug: 'contracts-101-for-independent-artists',
        slugEs: 'contratos-101-para-artistas-independientes',
        title: 'Contracts 101: What Independent Artists Must Negotiate',
        titleEs: 'Contratos 101: Lo Que los Artistas Independientes Deben Negociar',
        excerpt: 'Before you sign anything, read this. We break down the clauses that make or break an artist\'s career.',
        excerptEs: 'Antes de firmar cualquier cosa, lee esto. Desglosamos las cláusulas que hacen o deshacen la carrera de un artista.',
        date: '2026-03-10',
        author: 'Apex Music Latino',
        category: 'Academy',
        categoryEs: 'Academia',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdg1M7dmEekFpEMItNRV6DuVE_1b8taLsCADSHKfA4MfFKqOjkhBgpJUKX0sb2tYwgvyHN1k5-WtziDlVE8Wi9te-lZQP5HhnF-BN5M_YW5dKx1Wze3vOz8naP2Qjh4hNu2bGhL_WP6G5_9YkHwkgVR8VGcGXmHQ94Om9tpcNayfMo-2KIX9W6_kHh7y1RTIPqrrbnwja0xjmxSs0QIJ8G-ehG8DdYOyiRgX7HgQS2W2wRFO4ROOUqxr_mS7dWbs8MFq5OCPrPgMo',
        readTime: '15 min read',
        readTimeEs: '15 min de lectura',
        content: 'The music industry was built on bad contracts. From N.W.A. to modern-day horror stories, artists have been signing away their futures because they didn\'t understand what they were agreeing to.\n\n**This changes now.** Apex Academy\'s Contracts 101 module is free for every artist — but here\'s the essential preview.',
        contentEs: 'La industria musical se construyó sobre malos contratos. Desde N.W.A. hasta historias de terror modernas, los artistas han estado firmando su futuro porque no entendían lo que estaban aceptando.\n\n**Esto cambia ahora.** El módulo de Contratos 101 de Apex Academy es gratuito para cada artista — pero aquí está el preview esencial.',
        sections: [
            { title: 'The 5 Clauses That Matter Most', content: '**1. Term Length**: How long are you locked in? Avoid deals longer than 2-3 years without re-negotiation clauses.\n\n**2. Master Ownership**: Who owns your recordings? This is the #1 thing that destroys artist wealth. At Apex, artists retain their masters.\n\n**3. Revenue Split**: What percentage do you keep? Industry standard for indie deals is 70-85% to the artist. Anything below 50% is a red flag.\n\n**4. Release Commitment**: Is the label obligated to actually release your music? Many contracts allow labels to shelve your work indefinitely.\n\n**5. Termination Clause**: How do you get out? If there\'s no exit strategy, don\'t sign.' },
            { title: 'Cesión de Imagen (Image Rights)', content: 'In Latin America, **cesión de imagen** (image rights assignment) is a critical and often overlooked clause.\n\nThis determines who controls:\n- Your name and likeness in marketing\n- Your social media content created during the deal\n- Your appearance in brand partnerships\n\n**Apex policy**: Artists always retain control of their image. We request limited, revocable usage rights — never ownership.' },
            { title: 'Red Flags in Any Contract', content: '- **"In perpetuity"**: This means forever. Avoid.\n- **360 deals without transparency**: If they want a cut of everything, they better justify every dollar\n- **Non-compete clauses**: Especially problematic for featuring artists\n- **Audit restrictions**: If you can\'t audit their books, you can\'t trust their numbers\n- **Automatic renewal**: The contract renews unless YOU take action to stop it' },
            { title: 'Use AI to Your Advantage', content: 'Our AI assistant Kujo can:\n\n- Generate contract templates (educational, not legal advice)\n- Highlight potentially problematic clauses in contracts you\'re reviewing\n- Calculate royalty split scenarios\n- Create cesión de imagen templates\n\nAccess Kujo free in the Apex Studio. For complex deals, always consult a music attorney.' }
        ],
        sectionsEs: [
            { title: 'Las 5 Cláusulas Que Más Importan', content: '**1. Duración del Contrato**: ¿Por cuánto tiempo estás atado? Evita acuerdos de más de 2-3 años sin cláusulas de renegociación.\n\n**2. Propiedad de Masters**: ¿Quién es dueño de tus grabaciones? Este es el factor #1 que destruye la riqueza del artista. En Apex, los artistas retienen sus masters.\n\n**3. División de Ingresos**: ¿Qué porcentaje te quedas? El estándar de la industria para deals independientes es 70-85% para el artista. Cualquier cosa por debajo del 50% es una bandera roja.\n\n**4. Compromiso de Lanzamiento**: ¿El sello está obligado a realmente lanzar tu música? Muchos contratos permiten a los sellos archivar tu trabajo indefinidamente.\n\n**5. Cláusula de Terminación**: ¿Cómo puedes salir? Si no hay estrategia de salida, no firmes.' },
            { title: 'Cesión de Imagen', content: 'En América Latina, la **cesión de imagen** es una cláusula crítica y a menudo pasada por alto.\n\nEsto determina quién controla:\n- Tu nombre y semejanza en marketing\n- Tu contenido de redes sociales creado durante el acuerdo\n- Tu aparición en asociaciones de marca\n\n**Política de Apex**: Los artistas siempre retienen el control de su imagen. Solicitamos derechos de uso limitados y revocables — nunca propiedad.' },
            { title: 'Banderas Rojas en Cualquier Contrato', content: '- **"A perpetuidad"**: Esto significa para siempre. Evitar.\n- **Deals 360 sin transparencia**: Si quieren un corte de todo, mejor que justifiquen cada dólar\n- **Cláusulas de no competencia**: Especialmente problemáticas para artistas que hacen featurings\n- **Restricciones de auditoría**: Si no puedes auditar sus libros, no puedes confiar en sus números\n- **Renovación automática**: El contrato se renueva a menos que TÚ actúes para detenerlo' },
            { title: 'Usa la IA a Tu Favor', content: 'Nuestro asistente de IA Kujo puede:\n\n- Generar plantillas de contratos (educativo, no asesoría legal)\n- Resaltar cláusulas potencialmente problemáticas en contratos que estés revisando\n- Calcular escenarios de división de regalías\n- Crear plantillas de cesión de imagen\n\nAccede a Kujo gratis en el Apex Studio. Para deals complejos, siempre consulta a un abogado musical.' }
        ],
        keywords: ['contracts', 'music law', 'master ownership', 'cesion de imagen', 'independent artist', 'royalty splits']
    },
    {
        id: 6,
        slug: 'reggaeton-marketing-playbook-2026',
        slugEs: 'playbook-marketing-reggaeton-2026',
        title: 'The Reggaeton Marketing Playbook for 2026',
        titleEs: 'El Playbook de Marketing de Reggaeton para 2026',
        excerpt: 'From TikTok hooks to WhatsApp communities — the complete go-to-market strategy for reggaeton artists.',
        excerptEs: 'Desde hooks de TikTok hasta comunidades de WhatsApp — la estrategia completa de lanzamiento para artistas de reggaeton.',
        date: '2026-03-08',
        author: 'Apex Music Latino',
        category: 'Marketing',
        categoryEs: 'Marketing',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANRJNn74j6N_FpaBx3DAjdefirjO32nwt4JhMwbwUcH8UWMpV-4JJVwzG05Z1A-TNi5UKo223jhTlWuTXMyluRj-lIxGxn1DGfYD6ZFUoRlwH4wOtrG5_KzXQp4DB7u3oBD2mO-efMwzpctoHLiE0y1SeiqAutmiVxnkLN6qKWefwIlBSK5y3VUJ_HIkSuXwfv_EYg79zk-wD6CuS6Ep3ml6ooh9ju3Nph4Q1TumUuD_Use-gjJQ5c16G4qr-nP-H4wNDJhqkJD3E',
        readTime: '11 min read',
        readTimeEs: '11 min de lectura',
        content: 'Reggaeton doesn\'t just dominate Latin charts anymore — it dominates **global** charts. But with more artists flooding the space than ever, the ones who break through are the ones with a **system**, not just a song.',
        contentEs: 'El reggaeton ya no solo domina las listas latinas — domina las listas **globales**. Pero con más artistas inundando el espacio que nunca, los que logran destacar son los que tienen un **sistema**, no solo una canción.',
        sections: [
            { title: 'The 90-Day Launch System', content: '**Day 1-30: Build anticipation**\n- Tease snippets on TikTok/Reels (15-second hooks only)\n- Build a WhatsApp broadcast list (minimum 500 fans)\n- Seed the track with 10 micro-influencers\n\n**Day 31-60: Release + push**\n- Drop the single with a music video\n- Activate WhatsApp list with exclusive first listen\n- Run targeted ads to top CUBO territories\n- Submit to 50+ playlist curators\n\n**Day 61-90: Sustain + convert**\n- Release remix or acoustic version\n- Tour announcement targeting hottest territories\n- Merch drop tied to the release\n- Fan data capture at every touchpoint' },
            { title: 'WhatsApp: Your Secret Weapon', content: 'Email marketing is dead for reggaeton. **WhatsApp is your CRM**.\n\n- 98% open rate (vs 20% for email)\n- Direct, personal connection with fans\n- Broadcast lists for announcements\n- Status updates for behind-the-scenes content\n- Voice notes from the artist = instant engagement\n\nApex Artist OS integrates WhatsApp capture into your EPK and fan forms.' },
            { title: 'TikTok Strategy That Actually Works', content: 'Stop trying to go viral. Start trying to be **consistent**.\n\n- Post 3-5 times per day during launch week\n- Use the first 2 seconds to hook (no logos, no intros)\n- Create a specific dance or gesture for your chorus\n- Duet and stitch with fans who use your sound\n- Cross-post every TikTok to Reels and Shorts' },
            { title: 'The Apex Go-to-Market Engine', content: 'Every Apex artist gets access to:\n\n- **Street Team Network**: Micro-influencer affiliates in key LATAM cities\n- **Content Calendar Templates**: Pre-built 90-day plans\n- **Ad Budget Optimizer**: CUBO tells you where to spend for maximum ROI\n- **Playlist Pitching Tools**: Automated submissions to curators\n\nYou focus on the music. We handle the machine.' }
        ],
        sectionsEs: [
            { title: 'El Sistema de Lanzamiento de 90 Días', content: '**Día 1-30: Construir anticipación**\n- Teasers en TikTok/Reels (hooks de 15 segundos solamente)\n- Construir una lista de difusión de WhatsApp (mínimo 500 fans)\n- Sembrar el track con 10 micro-influencers\n\n**Día 31-60: Lanzamiento + push**\n- Soltar el single con video musical\n- Activar lista de WhatsApp con escucha exclusiva\n- Correr anuncios dirigidos a los mejores territorios de CUBO\n- Enviar a más de 50 curadores de playlists\n\n**Día 61-90: Sostener + convertir**\n- Lanzar remix o versión acústica\n- Anuncio de gira apuntando a los territorios más calientes\n- Drop de merch atado al lanzamiento\n- Captura de datos de fans en cada punto de contacto' },
            { title: 'WhatsApp: Tu Arma Secreta', content: 'El email marketing está muerto para el reggaeton. **WhatsApp es tu CRM**.\n\n- 98% de tasa de apertura (vs 20% para email)\n- Conexión directa y personal con fans\n- Listas de difusión para anuncios\n- Estados para contenido detrás de escenas\n- Notas de voz del artista = engagement instantáneo\n\nApex Artist OS integra la captura de WhatsApp en tu EPK y formularios de fans.' },
            { title: 'Estrategia de TikTok Que Realmente Funciona', content: 'Deja de intentar hacerte viral. Empieza a ser **consistente**.\n\n- Publica 3-5 veces por día durante la semana de lanzamiento\n- Usa los primeros 2 segundos para enganchar (sin logos, sin intros)\n- Crea un baile o gesto específico para tu coro\n- Haz duet y stitch con fans que usen tu sonido\n- Cross-postea cada TikTok a Reels y Shorts' },
            { title: 'El Motor Go-to-Market de Apex', content: 'Cada artista de Apex tiene acceso a:\n\n- **Red de Street Team**: Afiliados micro-influencers en ciudades clave de LATAM\n- **Plantillas de Calendario de Contenido**: Planes de 90 días pre-construidos\n- **Optimizador de Presupuesto de Ads**: CUBO te dice dónde gastar para máximo ROI\n- **Herramientas de Pitching a Playlists**: Envíos automatizados a curadores\n\nTú te enfocas en la música. Nosotros manejamos la máquina.' }
        ],
        keywords: ['reggaeton', 'marketing', 'TikTok', 'WhatsApp', 'go-to-market', 'playlist pitching']
    }
];

// Helper functions
function getBlogPostBySlug(slug, lang) {
    lang = lang || 'en';
    return BLOG_POSTS.find(function(p) {
        return (lang === 'es' ? p.slugEs : p.slug) === slug;
    });
}

function getBlogPostsByCategory(category, lang) {
    lang = lang || 'en';
    return BLOG_POSTS.filter(function(p) {
        var postCategory = lang === 'es' ? p.categoryEs : p.category;
        return postCategory.toLowerCase() === category.toLowerCase();
    });
}

function getRelatedPosts(currentPostId, category, limit) {
    limit = limit || 3;
    return BLOG_POSTS
        .filter(function(p) { return p.id !== currentPostId && p.category === category; })
        .slice(0, limit);
}

function searchPosts(query, lang) {
    lang = lang || 'en';
    var q = query.toLowerCase();
    return BLOG_POSTS.filter(function(p) {
        var title = (lang === 'es' ? p.titleEs : p.title).toLowerCase();
        var excerpt = (lang === 'es' ? p.excerptEs : p.excerpt).toLowerCase();
        var cat = (lang === 'es' ? p.categoryEs : p.category).toLowerCase();
        return title.includes(q) || excerpt.includes(q) || cat.includes(q) ||
            (p.keywords && p.keywords.some(function(k) { return k.toLowerCase().includes(q); }));
    });
}

// Detect language from URL
function detectLang() {
    return window.location.pathname.startsWith('/blog/es') ? 'es' : 'en';
}

// Make available globally
window.BlogData = {
    posts: BLOG_POSTS,
    categories: BLOG_CATEGORIES,
    getBySlug: getBlogPostBySlug,
    getByCategory: getBlogPostsByCategory,
    getRelated: getRelatedPosts,
    search: searchPosts,
    detectLang: detectLang
};
