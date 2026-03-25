// Vercel Serverless Function — AI-Powered Outreach Email Generator (Smart Template Engine)
// POST /api/generate-outreach
// Body: { venue_name, category, city, website, artist_name, artist_genre, epk_url, tone, step }
// Returns: { subject, body_html, talking_points }
//
// TODO: Replace template engine with Claude API call for truly dynamic content
// When AI API key is available, send the venue data + category context as a prompt
// and let Claude generate truly personalized outreach copy in real-time.

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const {
      venue_name,
      category,
      city = 'Bucaramanga',
      website,
      artist_name = 'Arcoiris',
      artist_genre = 'tango',
      epk_url = 'https://apexmusiclatino.com/genre/tango/arcoiris/',
      tone = 'professional',
      step = 1
    } = req.body || {};

    if (!venue_name) {
      return res.status(400).json({ error: 'Missing required field: venue_name' });
    }
    if (!category) {
      return res.status(400).json({ error: 'Missing required field: category' });
    }

    const stepNum = parseInt(step);
    if (isNaN(stepNum) || stepNum < 1 || stepNum > 12) {
      return res.status(400).json({ error: 'step must be between 1 and 12' });
    }

    // ─────────────────────────────────────────────────────────────
    // Category-based value propositions
    // ─────────────────────────────────────────────────────────────
    const categoryData = {
      'Restaurants': {
        value_prop: 'la musica en vivo eleva la experiencia gastronómica, aumenta el tiempo de permanencia en mesa y genera un ambiente memorable que fideliza clientes',
        hook: 'experiencias gastronómicas memorables',
        metrics: 'Los restaurantes con música en vivo reportan un 35% más de tiempo de permanencia y un 20% de aumento en ticket promedio',
        offer: 'show íntimo de 60-90 minutos ideal para cenas especiales',
        talking_points_base: [
          'Música en vivo aumenta retención de clientes y ticket promedio',
          'Formato acústico adaptable a espacios de diferentes tamaños',
          'Diferenciador competitivo frente a otros restaurantes de la zona'
        ]
      },
      'Theaters': {
        value_prop: 'un show de producción profesional con rider técnico completo, listo para escenarios de cualquier formato — desde teatro íntimo hasta sala principal',
        hook: 'producción escénica de primer nivel',
        metrics: 'Arcoiris cuenta con producción visual, rider técnico profesional y experiencia en escenarios de +200 personas',
        offer: 'show completo de 90 minutos con producción visual y danza contemporánea',
        talking_points_base: [
          'Rider técnico profesional disponible para su equipo de producción',
          'Show listo para escenario con producción visual integrada',
          'Experiencia comprobada en teatros y salas de gran formato'
        ]
      },
      'Universities': {
        value_prop: 'enriquecimiento cultural interdisciplinario que conecta música, danza y artes visuales — ideal para programas de extensión y bienestar universitario',
        hook: 'enriquecimiento cultural para la comunidad universitaria',
        metrics: 'El tango contemporáneo cruza disciplinas: música, danza, historia, sociología y artes visuales',
        offer: 'show + masterclass/taller para estudiantes y docentes',
        talking_points_base: [
          'Programa interdisciplinario: música, danza, cultura e historia',
          'Ideal para semanas culturales y programas de bienestar',
          'Formato taller + show que maximiza el engagement estudiantil'
        ]
      },
      'Schools': {
        value_prop: 'un programa educativo de tango que desarrolla disciplina, coordinación y conciencia cultural en los estudiantes a través de la música y la danza',
        hook: 'educación artística que transforma',
        metrics: 'Los programas de artes en colegios mejoran concentración, trabajo en equipo y expresión emocional',
        offer: 'taller educativo de 45 minutos + mini-show demostrativo',
        talking_points_base: [
          'Programa pedagógico adaptado a diferentes edades',
          'Desarrolla disciplina, coordinación y trabajo en equipo',
          'Componente de conciencia cultural y patrimonio artístico'
        ]
      },
      'Event Venues': {
        value_prop: 'entretenimiento premium para eventos corporativos, celebraciones privadas y activaciones de marca que dejan una impresión duradera',
        hook: 'entretenimiento que eleva cualquier evento',
        metrics: 'Eventos con entretenimiento en vivo generan un 40% más de engagement y recordación de marca',
        offer: 'show personalizable de 45 a 120 minutos para cualquier tipo de evento',
        talking_points_base: [
          'Formato flexible para corporativos, bodas y celebraciones',
          'Entretenimiento premium que diferencia su venue de la competencia',
          'Show personalizable según la temática del evento'
        ]
      },
      'Museums/Galleries': {
        value_prop: 'una experiencia inmersiva donde el arte visual se encuentra con la música en vivo — creando un diálogo cultural único entre disciplinas',
        hook: 'arte que dialoga con arte',
        metrics: 'Los eventos de arte + música en museos aumentan la asistencia en un 50% y atraen nuevos públicos',
        offer: 'show site-specific adaptado al espacio y la exhibición actual',
        talking_points_base: [
          'Experiencia inmersiva que fusiona artes visuales y música en vivo',
          'Show site-specific que dialoga con el espacio y sus exhibiciones',
          'Atrae nuevos públicos y genera cobertura mediática'
        ]
      },
      'Bookstores': {
        value_prop: 'la unión de la literatura y la música — una experiencia de tango literario que atrae nuevos públicos y posiciona su librería como centro cultural',
        hook: 'donde la literatura baila tango',
        metrics: 'Librerías con programación cultural reportan un 25% de aumento en tráfico y ventas durante eventos',
        offer: 'show íntimo de 45-60 minutos con narración poética y música',
        talking_points_base: [
          'Tango literario: poesía y narrativa integrada al show musical',
          'Atrae nuevo público y posiciona la librería como espacio cultural',
          'Formato íntimo perfecto para espacios de lectura'
        ]
      },
      'Non-Profit': {
        value_prop: 'impacto comunitario real a través del acceso cultural — llevamos tango contemporáneo a comunidades que normalmente no tienen acceso a las artes',
        hook: 'impacto cultural para la comunidad',
        metrics: 'Los programas de acceso cultural impactan comunidades enteras y generan cobertura mediática positiva',
        offer: 'show comunitario + taller abierto con tarifas solidarias',
        talking_points_base: [
          'Impacto comunitario medible a través del acceso a las artes',
          'Programas de educación artística para poblaciones vulnerables',
          'Tarifas solidarias y esquemas de co-producción disponibles'
        ]
      },
      'Hotels': {
        value_prop: 'una experiencia premium que mejora la estancia de los huéspedes — desde performances en lobby hasta eventos especiales que posicionan su hotel como destino cultural',
        hook: 'experiencias que sus huéspedes recordarán',
        metrics: 'Hoteles con entretenimiento cultural en vivo reportan un 30% más en reviews positivas y recomendaciones',
        offer: 'performance en lobby, cena-show o evento especial para huéspedes',
        talking_points_base: [
          'Mejora la experiencia del huésped y genera reviews positivas',
          'Formato lobby performance o cena-show para eventos especiales',
          'Posiciona al hotel como destino cultural de la ciudad'
        ]
      },
      'Dance Schools': {
        value_prop: 'masterclass de tango contemporáneo, talleres colaborativos y showcases conjuntos que elevan el nivel de sus estudiantes',
        hook: 'colaboración artística de alto nivel',
        metrics: 'Los talleres con artistas profesionales aumentan la retención de estudiantes en un 45%',
        offer: 'masterclass + showcase colaborativo con estudiantes de la escuela',
        talking_points_base: [
          'Masterclass de tango contemporáneo con músicos y bailarines profesionales',
          'Showcase colaborativo que motiva y retiene estudiantes',
          'Oportunidad de co-producción y eventos conjuntos'
        ]
      }
    };

    // Fallback for unknown categories
    const catInfo = categoryData[category] || {
      value_prop: 'una experiencia cultural única de tango contemporáneo que cautiva a cualquier audiencia',
      hook: 'cultura en vivo para su espacio',
      metrics: 'Arcoiris ha cautivado audiencias de +50 personas con su fusión de tango, danza y producción visual',
      offer: 'show personalizado de 45-90 minutos adaptado a su espacio',
      talking_points_base: [
        'Experiencia cultural única de tango contemporáneo',
        'Show adaptable a cualquier tipo de espacio y audiencia',
        'Producción profesional completa incluida'
      ]
    };

    // ─────────────────────────────────────────────────────────────
    // Tone modifiers
    // ─────────────────────────────────────────────────────────────
    const toneConfig = {
      professional: {
        greeting: 'Estimado/a equipo de',
        closing: 'Quedamos atentos a su respuesta.\n\nCordialmente,',
        signoff: 'Ariel Hanasi\nDirector — Apex Music Latino',
        urgency_word: 'Nos gustaría coordinar',
        you_formal: 'usted'
      },
      casual: {
        greeting: 'Hola equipo de',
        closing: '¡Esperamos conectar pronto!\n\nUn abrazo,',
        signoff: 'Ariel\nApex Music Latino',
        urgency_word: 'Sería genial coordinar',
        you_formal: 'ustedes'
      },
      urgent: {
        greeting: 'Estimados',
        closing: 'Esperamos su pronta respuesta.\n\nAtentamente,',
        signoff: 'Ariel Hanasi\nDirector — Apex Music Latino',
        urgency_word: 'Es importante que coordinemos pronto',
        you_formal: 'usted'
      }
    };

    const t = toneConfig[tone] || toneConfig.professional;

    // ─────────────────────────────────────────────────────────────
    // Step-based email content generation
    // ─────────────────────────────────────────────────────────────
    const LOGO_URL = 'https://apexmusiclatino.com/assetts/apex_music_latino_logo.jpg';
    const VIDEO_URL = 'https://www.youtube.com/watch?v=aN5xoSQ5S3c&t=13s';

    // Subject line variations per step phase
    const subjectTemplates = {
      // Steps 1-3: Introduction
      1: `${artist_name} — ${capitalize(artist_genre)} contemporáneo disponible para ${venue_name}`,
      2: `Video en vivo + propuesta artística — ${artist_name} para ${venue_name}`,
      3: `¿Eventos culturales en su agenda? — ${artist_name} ${capitalize(artist_genre)}`,
      // Steps 4-6: Social proof & offers
      4: `Caso de éxito: ${artist_name} en Casa del Libro Total — propuesta para ${venue_name}`,
      5: `Propuesta especial para ${venue_name} — ${artist_name} ${capitalize(artist_genre)}`,
      6: `${catInfo.hook} — ${artist_name} para ${venue_name}`,
      // Steps 7-9: Urgency & partnership
      7: `Galería de fotos — ${artist_name} en acción`,
      8: `Disponibilidad limitada abril-mayo — ${artist_name} para ${venue_name}`,
      9: `Colaboración cultural: ${artist_name} + ${venue_name}`,
      // Steps 10-12: Follow-up & close
      10: `Testimonios de nuestros shows — ${artist_name}`,
      11: `Seguimiento: ¿Recibió nuestra propuesta? — ${artist_name}`,
      12: `Gracias por su tiempo — ${artist_name}, siempre disponible para ${venue_name}`
    };

    // Body content per step
    const bodyGenerators = {
      // ── PHASE 1: Introduction (Steps 1-3) ──
      1: () => ({
        paragraphs: [
          `${t.greeting} <strong style="color:#fff;">${venue_name}</strong>,`,
          `Mi nombre es Ariel Hanasi y represento a <strong style="color:#fff;">${artist_name}</strong>, un ensamble de ${artist_genre} contemporáneo radicado en ${city}. Fusionamos la tradición del bandoneón con producción electrónica y visual de vanguardia.`,
          `Viendo el perfil de ${venue_name}, creemos que ${catInfo.value_prop}.`,
          `Le comparto nuestro Electronic Press Kit con toda la información:`
        ],
        cta: `Ver EPK de ${artist_name} →`,
        after_cta: `${t.closing}\n${t.signoff}`
      }),

      2: () => ({
        paragraphs: [
          `${t.greeting} <strong style="color:#fff;">${venue_name}</strong>,`,
          `Le escribo nuevamente desde Apex Music Latino. Quería compartirle un video de nuestra más reciente presentación — creo que habla mejor que cualquier descripción:`
        ],
        video_button: true,
        extra_paragraphs: [
          `Nuestro ensamble incluye violín, bandoneón, guitarra y danza contemporánea. ${catInfo.metrics}.`,
          `Ofrecemos ${catInfo.offer} — perfectamente adaptable a su espacio.`
        ],
        cta: `EPK Completo de ${artist_name} →`
      }),

      3: () => ({
        paragraphs: [
          `${t.greeting} <strong style="color:#fff;">${venue_name}</strong>,`,
          `¿Están planeando eventos culturales para los próximos meses? ${artist_name} ofrece una experiencia única de ${artist_genre} contemporáneo que combina música en vivo, danza y producción visual.`,
          `Para un espacio como ${venue_name}, creemos que nuestra propuesta de ${catInfo.hook} sería un diferenciador extraordinario en ${city}.`,
          `Hemos presentado en Casa del Libro Total y espacios culturales de ${city}. Nos adaptamos a formatos íntimos o de mayor escala.`
        ],
        cta: `Conocer ${artist_name} →`
      }),

      // ── PHASE 2: Social Proof & Offers (Steps 4-6) ──
      4: () => ({
        paragraphs: [
          `${t.greeting} <strong style="color:#fff;">${venue_name}</strong>,`,
          `Quería compartir con ustedes cómo fue nuestra experiencia reciente en Casa del Libro Total:`
        ],
        bullet_list: [
          '<strong style="color:#fff;">+50 asistentes</strong> en un evento íntimo',
          '<strong style="color:#fff;">845K+ fans</strong> en nuestras plataformas digitales',
          '<strong style="color:#fff;">Público diverso:</strong> desde estudiantes hasta profesionales',
          '<strong style="color:#fff;">Producción completa:</strong> nosotros traemos todo el equipo',
          '<strong style="color:#fff;">Formato flexible:</strong> 45 min a 2 horas'
        ],
        extra_paragraphs: [
          `¿Le gustaría tener una experiencia similar en ${venue_name}? ${catInfo.metrics}.`
        ],
        cta: `Ver EPK + Galería →`
      }),

      5: () => ({
        paragraphs: [
          `${t.greeting} <strong style="color:#fff;">${venue_name}</strong>,`,
          `Hemos preparado una propuesta especial para espacios en ${city}:`
        ],
        offer_card: {
          label: 'Oferta Especial',
          title: capitalize(catInfo.offer),
          details: `Incluye: Ensamble musical + danza + equipo de sonido\nProducción visual disponible como add-on\nDescuento del 15% para primera presentación en ${venue_name}`
        },
        extra_paragraphs: [
          `${t.urgency_word} una llamada de 15 minutos para entender las necesidades de ${venue_name} y proponer el formato ideal.`
        ],
        cta: `Ver Nuestro EPK →`
      }),

      6: () => ({
        paragraphs: [
          `${t.greeting} <strong style="color:#fff;">${venue_name}</strong>,`,
          `${city} está viviendo un momento cultural único. Cada vez más espacios están incorporando eventos de música en vivo como diferenciador.`,
          `Para ${venue_name}, esto significa ${catInfo.value_prop}.`,
          `${artist_name} ofrece una experiencia que sus visitantes no olvidarán — ${artist_genre} contemporáneo que conecta con todas las generaciones.`,
          `¿Puedo enviarle más información sobre cómo otros espacios han integrado este tipo de eventos?`
        ],
        cta: `Descubrir ${artist_name} →`
      }),

      // ── PHASE 3: Urgency & Partnership (Steps 7-9) ──
      7: () => ({
        paragraphs: [
          `${t.greeting} <strong style="color:#fff;">${venue_name}</strong>,`,
          `Dicen que una imagen vale más que mil palabras. Le comparto nuestra galería de la última presentación — deslice por el EPK para ver las fotos del evento:`
        ],
        cta: `Ver Galería Completa →`,
        extra_paragraphs: [
          `Nuestro EPK incluye video, discografía, galería y formulario de booking directo. Todo lo que necesita para evaluar si ${artist_name} es el match perfecto para ${venue_name}.`
        ]
      }),

      8: () => ({
        paragraphs: [
          `${t.greeting} <strong style="color:#fff;">${venue_name}</strong>,`,
          `Nuestra agenda para abril y mayo se está llenando rápidamente. Si en ${venue_name} han considerado incluir un evento de ${artist_genre} contemporáneo en su programación, este es el momento ideal para coordinarlo.`,
          `${catInfo.metrics}.`,
          `Solo necesitamos una conversación de 15 minutos para entender sus necesidades y proponer un formato que funcione para ${venue_name}.`
        ],
        cta: `Ver Disponibilidad →`
      }),

      9: () => ({
        paragraphs: [
          `${t.greeting} <strong style="color:#fff;">${venue_name}</strong>,`,
          `Más allá de un show, nos interesa construir relaciones culturales de largo plazo con espacios como ${venue_name}. Podríamos explorar:`
        ],
        bullet_list: [
          'Serie de eventos mensuales',
          `Talleres de ${artist_genre} para su comunidad`,
          'Eventos privados o corporativos',
          'Colaboraciones con otros artistas locales',
          `${catInfo.offer}`
        ],
        extra_paragraphs: [
          `¿Qué formato le interesaría más para ${venue_name}?`
        ],
        cta: `Conocer Nuestra Propuesta →`
      }),

      // ── PHASE 4: Follow-up & Close (Steps 10-12) ──
      10: () => ({
        paragraphs: [
          `${t.greeting} <strong style="color:#fff;">${venue_name}</strong>,`,
          `Esto es lo que dicen quienes han experimentado ${artist_name} en vivo:`
        ],
        testimonial: {
          quote: 'Una experiencia que trasciende la música. El público quedó completamente cautivado.',
          source: 'Casa del Libro Total, Bucaramanga'
        },
        extra_paragraphs: [
          `¿Le gustaría que ${venue_name} sea el próximo en vivir esta experiencia?`
        ],
        cta: `Ver EPK Completo →`
      }),

      11: () => ({
        paragraphs: [
          `${t.greeting} <strong style="color:#fff;">${venue_name}</strong>,`,
          `Sé que su bandeja de correo puede estar llena, pero no quería dejar de insistir — creo genuinamente que ${artist_name} sería una gran adición a la programación de ${venue_name}.`,
          `${catInfo.value_prop.charAt(0).toUpperCase() + catInfo.value_prop.slice(1)}.`,
          `Si este no es el momento adecuado, lo entiendo perfectamente. Solo le pido que guarde nuestro EPK para cuando sea oportuno:`
        ],
        cta: `Guardar EPK de ${artist_name} →`
      }),

      12: () => ({
        paragraphs: [
          `${t.greeting} <strong style="color:#fff;">${venue_name}</strong>,`,
          `Este es mi último mensaje de esta serie. Quiero agradecerles por su tiempo y dejar la puerta abierta para el futuro.`,
          `${artist_name} sigue creciendo y estamos comprometidos con la escena cultural de ${city}. Cuando el momento sea el adecuado para ${venue_name}, estaremos aquí.`,
          `Nuestro EPK siempre estará actualizado. Un abrazo.`
        ],
        cta: `EPK de ${artist_name} →`,
        after_cta: `Ariel Hanasi\nDirector — Apex Music Latino\nbooking@apexmusiclatino.com · +57 318 717 3584`
      })
    };

    const content = bodyGenerators[stepNum]();
    const subject = subjectTemplates[stepNum];

    // ─────────────────────────────────────────────────────────────
    // Build HTML email body
    // ─────────────────────────────────────────────────────────────
    let emailRows = '';

    // Main paragraphs
    if (content.paragraphs && content.paragraphs.length > 0) {
      const firstPara = content.paragraphs[0];
      const restParas = content.paragraphs.slice(1);

      emailRows += `<tr><td style="padding:32px 40px 0;"><p style="color:#ccc;font-size:15px;line-height:1.6;margin:0;">${firstPara}</p>`;
      for (const p of restParas) {
        emailRows += `<p style="color:#aaa;font-size:14px;line-height:1.7;margin:12px 0 0;">${p}</p>`;
      }
      emailRows += `</td></tr>`;
    }

    // Video button (step 2)
    if (content.video_button) {
      emailRows += `<tr><td style="padding:16px 40px 8px;text-align:center;">
<a href="${VIDEO_URL}" style="display:inline-block;background:#FF0000;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;">&#9654; Ver Video en YouTube</a>
</td></tr>`;
    }

    // Extra paragraphs (after video or bullets)
    if (content.extra_paragraphs && content.extra_paragraphs.length > 0 && !content.bullet_list && !content.offer_card && !content.testimonial) {
      emailRows += `<tr><td style="padding:16px 40px 0;">`;
      for (const p of content.extra_paragraphs) {
        emailRows += `<p style="color:#aaa;font-size:14px;line-height:1.7;">${p}</p>`;
      }
      emailRows += `</td></tr>`;
    }

    // Bullet list
    if (content.bullet_list) {
      emailRows += `<tr><td style="padding:12px 40px 0;"><ul style="color:#aaa;font-size:14px;line-height:1.8;padding-left:20px;margin:12px 0;">`;
      for (const item of content.bullet_list) {
        emailRows += `<li>${item}</li>`;
      }
      emailRows += `</ul></td></tr>`;
      // Extra paragraphs after bullets
      if (content.extra_paragraphs) {
        emailRows += `<tr><td style="padding:0 40px 0;">`;
        for (const p of content.extra_paragraphs) {
          emailRows += `<p style="color:#aaa;font-size:14px;line-height:1.7;">${p}</p>`;
        }
        emailRows += `</td></tr>`;
      }
    }

    // Offer card (step 5)
    if (content.offer_card) {
      const oc = content.offer_card;
      emailRows += `<tr><td style="padding:16px 40px;">
<table width="100%" style="margin:0;"><tr><td style="padding:16px;background:#1a1a1a;border-radius:12px;border:1px solid rgba(230,0,0,0.15);">
<p style="color:#e60000;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;font-weight:700;">${oc.label}</p>
<p style="color:#fff;font-size:16px;font-weight:700;margin:0 0 8px;">${oc.title}</p>
<p style="color:#aaa;font-size:13px;line-height:1.6;margin:0;">${oc.details.replace(/\n/g, '<br>')}</p>
</td></tr></table></td></tr>`;
      if (content.extra_paragraphs) {
        emailRows += `<tr><td style="padding:8px 40px 0;">`;
        for (const p of content.extra_paragraphs) {
          emailRows += `<p style="color:#aaa;font-size:14px;">${p}</p>`;
        }
        emailRows += `</td></tr>`;
      }
    }

    // Testimonial (step 10)
    if (content.testimonial) {
      const tm = content.testimonial;
      emailRows += `<tr><td style="padding:16px 40px;">
<table width="100%" style="margin:0;"><tr><td style="padding:16px;background:#1a1a1a;border-radius:12px;border-left:3px solid #e60000;">
<p style="color:#ccc;font-size:14px;font-style:italic;margin:0 0 8px;">"${tm.quote}"</p>
<p style="color:#888;font-size:12px;margin:0;">— ${tm.source}</p>
</td></tr></table></td></tr>`;
      if (content.extra_paragraphs) {
        emailRows += `<tr><td style="padding:8px 40px 0;">`;
        for (const p of content.extra_paragraphs) {
          emailRows += `<p style="color:#aaa;font-size:14px;">${p}</p>`;
        }
        emailRows += `</td></tr>`;
      }
    }

    // EPK CTA button
    emailRows += `<tr><td style="padding:16px 40px 24px;">
<a href="${epk_url}" style="display:block;background:linear-gradient(135deg,#e60000,#8b0000);color:#fff;padding:16px;border-radius:12px;text-decoration:none;font-size:15px;font-weight:700;text-align:center;">${content.cta}</a>
</td></tr>`;

    // After CTA text (closing/signature)
    if (content.after_cta) {
      emailRows += `<tr><td style="padding:0 40px 32px;"><p style="color:#888;font-size:13px;line-height:1.6;margin:0;">${content.after_cta.replace(/\n/g, '<br>')}</p></td></tr>`;
    }

    // Footer with logo
    const footer = `<tr><td style="padding:32px 40px;background:#0c0c0c;border-top:1px solid #222;text-align:center;">
<img src="${LOGO_URL}" alt="Apex Music Latino" width="60" height="60" style="border-radius:50%;margin-bottom:12px;border:2px solid #222;filter:invert(1);" />
<p style="color:#666;font-size:11px;margin:0 0 4px;"><strong style="color:#999;">Apex Music Latino</strong></p>
<p style="color:#555;font-size:10px;margin:0 0 4px;">Booking & Management</p>
<p style="color:#444;font-size:9px;margin:0;">booking@apexmusiclatino.com · +57 318 717 3584</p>
<p style="margin:8px 0 0;"><a href="https://apexmusiclatino.com" style="color:#e60000;font-size:10px;text-decoration:none;font-weight:600;">apexmusiclatino.com</a></p>
</td></tr>`;

    // Full HTML wrapper
    const body_html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0c0c0c;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0c0c;padding:40px 20px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:16px;overflow:hidden;border:1px solid rgba(230,0,0,0.15);">
<tr><td style="height:4px;background:linear-gradient(90deg,#e60000,#8b0000);"></td></tr>
${emailRows}
${footer}
</table></td></tr></table></body></html>`;

    // ─────────────────────────────────────────────────────────────
    // Generate talking points
    // ─────────────────────────────────────────────────────────────
    const stepPhase = stepNum <= 3 ? 'intro' : stepNum <= 6 ? 'proof' : stepNum <= 9 ? 'urgency' : 'close';
    const phasePoints = {
      intro: [
        `Introducir ${artist_name} como opción de ${artist_genre} contemporáneo para ${venue_name}`,
        catInfo.talking_points_base[0],
        `Mencionar adaptabilidad al formato de ${category}`
      ],
      proof: [
        `Demostrar resultados: +50 asistentes, 845K+ fans digitales`,
        catInfo.talking_points_base[1],
        `Oferta concreta: ${catInfo.offer}`
      ],
      urgency: [
        `Agenda abril-mayo llenándose — crear sentido de urgencia`,
        catInfo.talking_points_base[2],
        `Proponer colaboración de largo plazo con ${venue_name}`
      ],
      close: [
        `Agradecer el tiempo y dejar la puerta abierta`,
        `EPK siempre disponible como referencia: ${epk_url}`,
        `Mantener relación para oportunidades futuras en ${city}`
      ]
    };

    const talking_points = phasePoints[stepPhase];

    // ─────────────────────────────────────────────────────────────
    // Return response
    // ─────────────────────────────────────────────────────────────
    return res.status(200).json({
      subject,
      body_html,
      talking_points,
      meta: {
        venue_name,
        category,
        city,
        artist_name,
        step: stepNum,
        tone,
        phase: stepPhase,
        generated_at: new Date().toISOString()
      }
    });

  } catch (err) {
    console.error('[generate-outreach] Error:', err);
    return res.status(500).json({ error: err.message });
  }
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
