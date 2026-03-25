// Vercel Serverless Function — 12-Step Venue Outreach Sequence
// GET /api/send-venue-outreach?step=1&key=arcoiris2026
// GET /api/send-venue-outreach?step=1&key=arcoiris2026&schedule_at=2026-03-26T13:00:00Z
// Sends to all venues in the CSV that have email addresses
// Each step is a different angle/value proposition
// If schedule_at is provided, uses Resend's native scheduled_at instead of sending immediately
// EPK link: https://apexmusiclatino.com/genre/tango/arcoiris/ (no gate)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { step, key, email: testEmail, schedule_at } = req.query;

  if (key !== 'arcoiris2026') return res.status(401).json({ error: 'Invalid key' });
  if (!step) return res.status(400).json({ error: 'Missing step param (1-12 or test)' });

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const SUPABASE_URL = `https://${process.env.SUPABASE_PROJECT_ID || 'iaycaynevtumrqoknemk'}.supabase.co`;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!RESEND_API_KEY || !SUPABASE_KEY) {
    return res.status(500).json({ error: 'Missing RESEND_API_KEY or SUPABASE_SERVICE_ROLE_KEY' });
  }

  const EPK_URL = 'https://apexmusiclatino.com/genre/tango/arcoiris/';
  const LOGO_URL = 'https://apexmusiclatino.com/assetts/apex_music_latino_logo.jpg';

  const footer = `
<tr><td style="padding:32px 40px;background:#0c0c0c;border-top:1px solid #222;text-align:center;">
<img src="${LOGO_URL}" alt="Apex Music Latino" width="60" height="60" style="border-radius:50%;margin-bottom:12px;border:2px solid #222;filter:invert(1);" />
<p style="color:#666;font-size:11px;margin:0 0 4px;"><strong style="color:#999;">Apex Music Latino</strong></p>
<p style="color:#555;font-size:10px;margin:0 0 4px;">Booking & Management</p>
<p style="color:#444;font-size:9px;margin:0;">booking@apexmusiclatino.com · +57 318 717 3584</p>
<p style="margin:8px 0 0;"><a href="https://apexmusiclatino.com" style="color:#e60000;font-size:10px;text-decoration:none;font-weight:600;">apexmusiclatino.com</a></p>
</td></tr>`;

  function wrap(content) {
    return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0c0c0c;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0c0c;padding:40px 20px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:16px;overflow:hidden;border:1px solid rgba(230,0,0,0.15);">
<tr><td style="height:4px;background:linear-gradient(90deg,#e60000,#8b0000);"></td></tr>
${content}
${footer}
</table></td></tr></table></body></html>`;
  }

  function epkButton(text) {
    return `<tr><td style="padding:0 40px 24px;">
<a href="${EPK_URL}" style="display:block;background:linear-gradient(135deg,#e60000,#8b0000);color:#fff;padding:16px;border-radius:12px;text-decoration:none;font-size:15px;font-weight:700;text-align:center;">${text}</a>
</td></tr>`;
  }

  // 12-Step Outreach Sequence
  const sequences = {
    '1': {
      subject: 'Arcoiris — Tango Contemporáneo disponible para su espacio',
      build: (name) => wrap(`
<tr><td style="padding:32px 40px 0;"><p style="color:#ccc;font-size:15px;line-height:1.6;margin:0;">Estimado/a equipo de <strong style="color:#fff;">${name}</strong>,</p>
<p style="color:#aaa;font-size:14px;line-height:1.7;margin:16px 0 0;">Mi nombre es Ariel Hanasi y represento a <strong style="color:#fff;">Arcoiris</strong>, un ensamble de tango contemporáneo radicado en Bucaramanga. Fusionamos la tradición del bandoneón con producción electrónica y visual de vanguardia.</p>
<p style="color:#aaa;font-size:14px;line-height:1.7;margin:12px 0 0;">Nos encantaría explorar la posibilidad de presentarnos en su espacio. Le comparto nuestro Electronic Press Kit con toda la información:</p>
</td></tr>${epkButton('Ver EPK de Arcoiris →')}
<tr><td style="padding:0 40px 32px;"><p style="color:#888;font-size:13px;line-height:1.6;margin:0;">Quedamos atentos a cualquier oportunidad.<br><br>Cordialmente,<br><strong style="color:#fff;">Ariel Hanasi</strong><br>Director — Apex Music Latino<br>booking@apexmusiclatino.com</p></td></tr>`)
    },
    '2': {
      subject: 'Arcoiris — Video en vivo + propuesta artística',
      build: (name) => wrap(`
<tr><td style="padding:32px 40px 0;"><p style="color:#ccc;font-size:15px;line-height:1.6;margin:0;">Hola <strong style="color:#fff;">${name}</strong>,</p>
<p style="color:#aaa;font-size:14px;line-height:1.7;margin:16px 0 0;">Le escribo nuevamente desde Apex Music Latino. Quería compartirle un video de nuestra más reciente presentación en Casa del Libro Total — creo que habla mejor que cualquier descripción:</p>
</td></tr>
<tr><td style="padding:16px 40px 8px;text-align:center;">
<a href="https://www.youtube.com/watch?v=aN5xoSQ5S3c&t=13s" style="display:inline-block;background:#FF0000;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;">▶ Ver Video en YouTube</a>
</td></tr>
<tr><td style="padding:16px 40px 0;"><p style="color:#aaa;font-size:14px;line-height:1.7;">Nuestro ensamble incluye violín, bandoneón, guitarra y danza contemporánea. Adaptamos nuestro show a cualquier tipo de espacio.</p></td></tr>
${epkButton('EPK Completo de Arcoiris →')}`)
    },
    '3': {
      subject: '¿Eventos culturales en su agenda? — Arcoiris Tango',
      build: (name) => wrap(`
<tr><td style="padding:32px 40px 0;"><p style="color:#ccc;font-size:15px;line-height:1.6;margin:0;">Estimados <strong style="color:#fff;">${name}</strong>,</p>
<p style="color:#aaa;font-size:14px;line-height:1.7;margin:16px 0 0;">¿Están planeando eventos culturales para los próximos meses? Arcoiris ofrece una experiencia única de tango contemporáneo que combina música en vivo, danza y producción visual.</p>
<p style="color:#aaa;font-size:14px;line-height:1.7;margin:12px 0;">Hemos presentado en Casa del Libro Total y espacios culturales de Bucaramanga. Nos adaptamos a formatos íntimos o de mayor escala.</p>
</td></tr>${epkButton('Conocer Arcoiris →')}`)
    },
    '4': {
      subject: 'Caso de éxito: Arcoiris en Casa del Libro Total',
      build: (name) => wrap(`
<tr><td style="padding:32px 40px 0;"><p style="color:#ccc;font-size:15px;line-height:1.6;margin:0;">Hola <strong style="color:#fff;">${name}</strong>,</p>
<p style="color:#aaa;font-size:14px;line-height:1.7;margin:16px 0 0;">Quería compartir con ustedes cómo fue nuestra experiencia en Casa del Libro Total:</p>
<ul style="color:#aaa;font-size:14px;line-height:1.8;padding-left:20px;margin:12px 0;">
<li><strong style="color:#fff;">+50 asistentes</strong> en un evento íntimo</li>
<li><strong style="color:#fff;">Público diverso:</strong> desde estudiantes hasta profesionales</li>
<li><strong style="color:#fff;">Producción completa:</strong> nosotros traemos todo el equipo</li>
<li><strong style="color:#fff;">Formato flexible:</strong> 45 min a 2 horas</li>
</ul>
<p style="color:#aaa;font-size:14px;line-height:1.7;">¿Le gustaría tener una experiencia similar en su espacio?</p>
</td></tr>${epkButton('Ver EPK + Galería →')}`)
    },
    '5': {
      subject: 'Propuesta especial para ${name} — Arcoiris Tango',
      build: (name) => wrap(`
<tr><td style="padding:32px 40px 0;"><p style="color:#ccc;font-size:15px;line-height:1.6;margin:0;">Estimados <strong style="color:#fff;">${name}</strong>,</p>
<p style="color:#aaa;font-size:14px;line-height:1.7;margin:16px 0 0;">Hemos preparado una propuesta especial para espacios en Bucaramanga:</p>
<table width="100%" style="margin:16px 0;"><tr><td style="padding:16px;background:#1a1a1a;border-radius:12px;border:1px solid rgba(230,0,0,0.15);">
<p style="color:#e60000;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;font-weight:700;">Oferta Especial</p>
<p style="color:#fff;font-size:16px;font-weight:700;margin:0 0 8px;">Show completo de 60 minutos</p>
<p style="color:#aaa;font-size:13px;line-height:1.6;margin:0;">Incluye: Ensamble musical + danza + equipo de sonido<br>Producción visual disponible como add-on<br>Descuento del 15% para primera presentación</p>
</td></tr></table>
<p style="color:#aaa;font-size:14px;">¿Agendamos una llamada de 15 minutos para conversar?</p>
</td></tr>${epkButton('Ver Nuestro EPK →')}`)
    },
    '6': {
      subject: 'El tango que Bucaramanga necesita — Arcoiris',
      build: (name) => wrap(`
<tr><td style="padding:32px 40px 0;"><p style="color:#ccc;font-size:15px;line-height:1.6;margin:0;">Hola <strong style="color:#fff;">${name}</strong>,</p>
<p style="color:#aaa;font-size:14px;line-height:1.7;margin:16px 0 0;">Bucaramanga está viviendo un momento cultural único. Cada vez más espacios están incorporando eventos de música en vivo como diferenciador.</p>
<p style="color:#aaa;font-size:14px;line-height:1.7;margin:12px 0;">Arcoiris ofrece una experiencia que sus visitantes no olvidarán — tango contemporáneo que conecta con todas las generaciones.</p>
<p style="color:#aaa;font-size:14px;line-height:1.7;margin:12px 0;">¿Puedo enviarle más información sobre cómo otros espacios han integrado eventos de este tipo?</p>
</td></tr>${epkButton('Descubrir Arcoiris →')}`)
    },
    '7': {
      subject: 'Galería de fotos — Arcoiris en acción',
      build: (name) => wrap(`
<tr><td style="padding:32px 40px 0;"><p style="color:#ccc;font-size:15px;line-height:1.6;margin:0;">Hola <strong style="color:#fff;">${name}</strong>,</p>
<p style="color:#aaa;font-size:14px;line-height:1.7;margin:16px 0 0;">Dicen que una imagen vale más que mil palabras. Le comparto nuestra galería de la última presentación — deslice por el EPK para ver las fotos del evento:</p>
</td></tr>${epkButton('📸 Ver Galería Completa →')}
<tr><td style="padding:0 40px 32px;"><p style="color:#888;font-size:13px;">Nuestro EPK incluye video, discografía, galería y formulario de booking directo.</p></td></tr>`)
    },
    '8': {
      subject: 'Último aviso: disponibilidad para abril-mayo — Arcoiris',
      build: (name) => wrap(`
<tr><td style="padding:32px 40px 0;"><p style="color:#ccc;font-size:15px;line-height:1.6;margin:0;">Estimados <strong style="color:#fff;">${name}</strong>,</p>
<p style="color:#aaa;font-size:14px;line-height:1.7;margin:16px 0 0;">Nuestra agenda para abril y mayo se está llenando rápidamente. Si han considerado incluir un evento de tango contemporáneo en su programación, este es el momento ideal para coordinarlo.</p>
<p style="color:#aaa;font-size:14px;line-height:1.7;margin:12px 0;">Solo necesitamos una conversación de 15 minutos para entender sus necesidades y proponer un formato que funcione.</p>
</td></tr>${epkButton('Ver Disponibilidad →')}`)
    },
    '9': {
      subject: 'Colaboración cultural en Bucaramanga — Arcoiris + ${name}',
      build: (name) => wrap(`
<tr><td style="padding:32px 40px 0;"><p style="color:#ccc;font-size:15px;line-height:1.6;margin:0;">Hola <strong style="color:#fff;">${name}</strong>,</p>
<p style="color:#aaa;font-size:14px;line-height:1.7;margin:16px 0 0;">Más allá de un show, nos interesa construir relaciones culturales de largo plazo con espacios como el suyo. Podríamos explorar:</p>
<ul style="color:#aaa;font-size:14px;line-height:1.8;padding-left:20px;margin:12px 0;">
<li>Serie de eventos mensuales</li>
<li>Talleres de tango para su comunidad</li>
<li>Eventos privados o corporativos</li>
<li>Colaboraciones con otros artistas locales</li>
</ul>
<p style="color:#aaa;font-size:14px;">¿Qué formato le interesaría más?</p>
</td></tr>${epkButton('Conocer Nuestra Propuesta →')}`)
    },
    '10': {
      subject: 'Testimonios de nuestros shows — Arcoiris',
      build: (name) => wrap(`
<tr><td style="padding:32px 40px 0;"><p style="color:#ccc;font-size:15px;line-height:1.6;margin:0;">Hola <strong style="color:#fff;">${name}</strong>,</p>
<p style="color:#aaa;font-size:14px;line-height:1.7;margin:16px 0 0;">Esto es lo que dicen quienes han experimentado Arcoiris en vivo:</p>
<table width="100%" style="margin:16px 0;"><tr><td style="padding:16px;background:#1a1a1a;border-radius:12px;border-left:3px solid #e60000;">
<p style="color:#ccc;font-size:14px;font-style:italic;margin:0 0 8px;">"Una experiencia que trasciende la música. El público quedó completamente cautivado."</p>
<p style="color:#888;font-size:12px;margin:0;">— Casa del Libro Total, Bucaramanga</p>
</td></tr></table>
<p style="color:#aaa;font-size:14px;">¿Le gustaría que su espacio sea el próximo en vivir esta experiencia?</p>
</td></tr>${epkButton('Ver EPK Completo →')}`)
    },
    '11': {
      subject: 'Seguimiento: ¿Recibió nuestra propuesta? — Arcoiris',
      build: (name) => wrap(`
<tr><td style="padding:32px 40px 0;"><p style="color:#ccc;font-size:15px;line-height:1.6;margin:0;">Hola <strong style="color:#fff;">${name}</strong>,</p>
<p style="color:#aaa;font-size:14px;line-height:1.7;margin:16px 0 0;">Sé que su bandeja de correo puede estar llena, pero no quería dejar de insistir — creo genuinamente que Arcoiris sería una gran adición a su programación cultural.</p>
<p style="color:#aaa;font-size:14px;line-height:1.7;margin:12px 0;">Si este no es el momento adecuado, lo entiendo perfectamente. Solo le pido que guarde nuestro EPK para cuando sea oportuno:</p>
</td></tr>${epkButton('Guardar EPK de Arcoiris →')}`)
    },
    '12': {
      subject: 'Gracias por su tiempo — Arcoiris, siempre disponible',
      build: (name) => wrap(`
<tr><td style="padding:32px 40px 0;"><p style="color:#ccc;font-size:15px;line-height:1.6;margin:0;">Estimados <strong style="color:#fff;">${name}</strong>,</p>
<p style="color:#aaa;font-size:14px;line-height:1.7;margin:16px 0 0;">Este es mi último mensaje de esta serie. Quiero agradecerles por su tiempo y dejar la puerta abierta para el futuro.</p>
<p style="color:#aaa;font-size:14px;line-height:1.7;margin:12px 0;">Arcoiris sigue creciendo y estamos comprometidos con la escena cultural de Bucaramanga. Cuando el momento sea el adecuado, estaremos aquí.</p>
<p style="color:#aaa;font-size:14px;line-height:1.7;margin:12px 0;">Nuestro EPK siempre estará actualizado. Un abrazo.</p>
</td></tr>${epkButton('EPK de Arcoiris →')}
<tr><td style="padding:0 40px 32px;"><p style="color:#888;font-size:13px;">Ariel Hanasi<br>Director — Apex Music Latino<br>booking@apexmusiclatino.com · +57 318 717 3584</p></td></tr>`)
    }
  };

  const stepNum = step === 'test' ? '1' : step;
  if (!sequences[stepNum]) {
    return res.status(400).json({ error: `Invalid step: ${step}. Use 1-12 or test.` });
  }

  try {
    // Fetch venues with emails from the CSV data (stored in venue_leads table)
    // Fallback: use the hardcoded list from the CSV if table doesn't exist yet
    let recipients = [];

    if (step === 'test' && testEmail) {
      recipients = [{ email: testEmail, company_name: 'Test Venue' }];
    } else {
      // Try venue_leads table first
      const venueUrl = `${SUPABASE_URL}/rest/v1/venue_leads?email=not.is.null&email=neq.&select=email,company_name,id`;
      const venueRes = await fetch(venueUrl, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
      });

      if (venueRes.ok) {
        recipients = await venueRes.json();
      }

      // If no venues in DB, use hardcoded fallback from CSV
      if (recipients.length === 0) {
        recipients = [
          { email: 'apprendista.bucaramanga@gmail.com', company_name: 'Apprendista' },
          { email: 'casadigitalbga@gmail.com', company_name: 'Casa Digital BGA' },
          { email: 'info@teatrosantander.com', company_name: 'Teatro Santander' },
          { email: 'contacto@indchicco.com', company_name: 'Industrias Chicco SAS' },
          { email: 'secretariaejecutiva@cotelcosantander.org', company_name: 'Cotelco Santander' },
          { email: 'secregeo@uis.edu.co', company_name: 'Universidad Industrial de Santander' },
          { email: 'evirtual@correo.uts.edu.co', company_name: 'Unidades Tecnológicas de Santander' },
          { email: 'bienestar@unab.edu.co', company_name: 'Universidad Autónoma de Bucaramanga' },
          { email: 'iedesantander@bucaramanga.edu.co', company_name: 'Colegio de Santander' },
          { email: 'ienormal@bucaramanga.edu.co', company_name: 'Escuela Normal Superior de Bucaramanga' },
          { email: 'iegabrielamistral@bucaramanga.edu.co', company_name: 'Colegio Gabriel Mistral' },
          { email: 'servicioalcliente@lyl.com.co', company_name: 'Libros y Libros S.A' }
        ];
      }
    }

    // Deduplicate
    const seen = new Set();
    recipients = recipients.filter(r => {
      const e = (r.email || '').toLowerCase().trim();
      if (!e || seen.has(e)) return false;
      seen.add(e);
      return true;
    });

    // Filter out unsubscribed emails
    const unsubscribed = await getUnsubscribedEmails(SUPABASE_URL, SUPABASE_KEY);
    const preCount = recipients.length;
    recipients = recipients.filter(r => !unsubscribed.has((r.email || '').toLowerCase().trim()));
    const skippedUnsub = preCount - recipients.length;

    const template = sequences[stepNum];
    let sent = 0;
    let failed = 0;
    const errors = [];

    for (const venue of recipients) {
      const name = venue.company_name || 'Estimado equipo';
      const subject = template.subject.replace(/\$\{name\}/g, name);

      try {
        const emailHtml = appendUnsubscribeFooter(template.build(name), venue.email, 'venue-outreach');
        const resendPayload = {
          from: 'Ariel Hanasi — Apex Music Latino <booking@apexmusiclatino.com>',
          to: [venue.email],
          subject,
          html: emailHtml
        };

        // If schedule_at is provided, use Resend's native scheduling
        if (schedule_at) {
          resendPayload.scheduled_at = new Date(schedule_at).toISOString();
        }

        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(resendPayload)
        });

        const data = await emailRes.json();
        if (emailRes.ok) {
          sent++;
          // Update outreach status if venue has an ID (from DB)
          if (venue.id) {
            await fetch(`${SUPABASE_URL}/rest/v1/venue_leads?id=eq.${venue.id}`, {
              method: 'PATCH',
              headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({ outreach_status: schedule_at ? 'scheduled' : 'contacted', last_contacted_at: new Date().toISOString() })
            }).catch(() => {});
          }

          // Log scheduled email to Supabase if using scheduling
          if (schedule_at) {
            await fetch(`${SUPABASE_URL}/rest/v1/scheduled_emails`, {
              method: 'POST',
              headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                recipient_email: venue.email,
                recipient_name: name,
                subject,
                from_label: 'Ariel Hanasi — Apex Music Latino',
                artist_slug: 'arcoiris',
                campaign_type: 'venue_outreach',
                journey_step: parseInt(stepNum),
                resend_message_id: data.id,
                send_at: new Date(schedule_at).toISOString(),
                status: 'scheduled',
                scheduling_method: 'resend_native'
              })
            }).catch(() => {}); // Non-critical logging
          }
        } else {
          failed++;
          errors.push({ email: venue.email, error: data.message });
        }
      } catch (err) {
        failed++;
        errors.push({ email: venue.email, error: err.message });
      }
      await new Promise(r => setTimeout(r, 200));
    }

    return res.status(200).json({
      step: parseInt(stepNum),
      sent,
      failed,
      skipped_unsubscribed: skippedUnsub,
      total_recipients: recipients.length,
      scheduled_at: schedule_at || null,
      mode: schedule_at ? 'resend_native_schedule' : 'immediate',
      errors: errors.slice(0, 5)
    });

  } catch (err) {
    console.error('[send-venue-outreach] Error:', err);
    return res.status(500).json({ error: err.message });
  }
}

async function getUnsubscribedEmails(supabaseUrl, serviceKey) {
  const unsubs = new Set();
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/unsubscribes?select=email`, {
      headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` }
    });
    if (res.ok) {
      const rows = await res.json();
      rows.forEach(r => unsubs.add(r.email.toLowerCase().trim()));
    }
  } catch (e) {
    console.warn('[unsubscribe] Could not fetch unsubscribes list:', e.message);
  }
  return unsubs;
}

function appendUnsubscribeFooter(html, email, source) {
  const token = Buffer.from(email).toString('base64');
  const unsubUrl = `https://apexmusiclatino.com/api/unsubscribe?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}&source=${encodeURIComponent(source)}`;
  const footerLink = `<p style="margin-top:12px;"><a href="${unsubUrl}" style="color:#444;font-size:9px;text-decoration:underline;">Cancelar suscripci\u00f3n / Unsubscribe</a></p>`;

  if (html.includes('</body>')) {
    return html.replace('</body>', footerLink + '</body>');
  } else if (html.includes('</html>')) {
    return html.replace('</html>', footerLink + '</html>');
  }
  return html + footerLink;
}
