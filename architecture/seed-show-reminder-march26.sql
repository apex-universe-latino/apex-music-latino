-- ============================================================
-- SEED: Arcoiris Show Reminder — March 26, 2026
-- Casa del Libro Total, Bucaramanga, 5:30 PM COT
-- 3 emails: 8AM, 12PM, 3PM (COT) = 13:00, 17:00, 20:00 UTC
-- Run AFTER email-campaign-schema.sql
-- ============================================================

-- 1. Create the campaign
INSERT INTO public.email_campaigns (
    id, artist_slug, campaign_name, campaign_type, subject_template,
    body_html_template, from_label, status, scheduled_at, total_recipients
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'arcoiris',
    'Show Reminder — Arcoiris March 26 Casa del Libro Total',
    'show_reminder',
    '3-step show reminder sequence',
    'Multi-step: see scheduled_emails',
    'Arcoiris',
    'scheduled',
    '2026-03-26T13:00:00Z',
    0 -- will be updated below
);

-- 2. Insert scheduled emails for each fan
-- Email template 1: Morning excitement (8 AM COT = 13:00 UTC)
-- Email template 2: Midday countdown (12 PM COT = 17:00 UTC)
-- Email template 3: Final reminder (3 PM COT = 20:00 UTC)

DO $$
DECLARE
    fan RECORD;
    campaign_id UUID := '00000000-0000-0000-0000-000000000001';
    fan_count INTEGER := 0;
    email1_subject TEXT := '🎵 ¡Esta noche! Arcoiris en vivo — Casa del Libro Total, 5:30 PM';
    email2_subject TEXT := '⏰ Faltan 5 horas — Arcoiris LIVE en Bucaramanga';
    email3_subject TEXT := '🔥 2.5 horas para Arcoiris — ¡puertas abren pronto!';
    email1_html TEXT;
    email2_html TEXT;
    email3_html TEXT;
    fan_name TEXT;
BEGIN

    -- Loop through unique fan emails for Arcoiris
    FOR fan IN
        SELECT DISTINCT ON (LOWER(email)) email, mood_preference
        FROM public.leads_capture
        WHERE artist_name = 'Arcoiris' AND email IS NOT NULL AND email != ''
        ORDER BY LOWER(email), created_at DESC
    LOOP
        fan_name := COALESCE(
            fan.mood_preference->>'name',
            fan.mood_preference->>'fan_name',
            'Fan'
        );

        -- EMAIL 1: Morning excitement (8 AM COT)
        email1_html := '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0c0c0c;font-family:''Helvetica Neue'',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0c0c;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:16px;overflow:hidden;border:1px solid rgba(230,0,0,0.15);">
<tr><td style="height:4px;background:linear-gradient(90deg,#e60000,#8b0000);"></td></tr>
<tr><td style="padding:32px 40px 0;text-align:center;">
<p style="color:#e60000;font-size:11px;letter-spacing:4px;text-transform:uppercase;font-weight:700;margin:0 0 8px;">🎵 ESTA NOCHE</p>
<h1 style="color:#fff;font-size:28px;font-weight:800;margin:0 0 4px;line-height:1.2;">Arcoiris en Vivo</h1>
<p style="color:#888;font-size:13px;margin:0;">Casa del Libro Total · Bucaramanga</p>
</td></tr>
<tr><td style="padding:24px 40px;">
<table width="100%" style="background:#1a1a1a;border-radius:12px;border:1px solid rgba(230,0,0,0.2);">
<tr><td style="padding:24px;text-align:center;">
<p style="color:#888;font-size:10px;letter-spacing:3px;text-transform:uppercase;margin:0 0 8px;">HOY · MARCH 26, 2026</p>
<p style="color:#e60000;font-size:48px;font-weight:800;margin:0;">5:30 PM</p>
<p style="color:#aaa;font-size:13px;margin:8px 0 0;">Cra 35 #9-81, Centro, Bucaramanga</p>
</td></tr></table>
</td></tr>
<tr><td style="padding:0 40px 16px;">
<p style="color:#ccc;font-size:15px;line-height:1.6;margin:0;">Hola <strong style="color:#fff;">' || fan_name || '</strong>,</p>
<p style="color:#aaa;font-size:14px;line-height:1.6;margin:12px 0 0;">¡Hoy es el día! Te esperamos esta noche para una experiencia única de tango contemporáneo con <strong style="color:#fff;">Arcoiris</strong>.</p>
<p style="color:#888;font-size:12px;margin:8px 0 0;font-style:italic;">Tonight is the night! Join us for an unforgettable contemporary tango experience with Arcoiris.</p>
</td></tr>
<tr><td style="padding:0 40px 16px;">
<a href="https://maps.google.com/?q=Casa+del+Libro+Total+Bucaramanga" style="display:block;background:linear-gradient(135deg,#e60000,#8b0000);color:#fff;padding:16px;border-radius:12px;text-decoration:none;font-size:15px;font-weight:700;text-align:center;">📍 Ver Ubicación en Google Maps</a>
</td></tr>
<tr><td style="padding:0 40px 32px;text-align:center;">
<a href="https://apexmusiclatino.com/genre/tango/arcoiris/" style="color:#e60000;font-size:13px;text-decoration:none;">Ver EPK de Arcoiris →</a>
</td></tr>
<tr><td style="padding:24px 40px;background:#0c0c0c;border-top:1px solid #222;text-align:center;">
<p style="color:#555;font-size:11px;margin:0 0 4px;"><strong style="color:#888;">Apex Music Latino</strong></p>
<p style="color:#444;font-size:9px;margin:0;">Recibiste este email porque te registraste en apexmusiclatino.com</p>
</td></tr>
</table></td></tr></table></body></html>';

        INSERT INTO public.scheduled_emails (campaign_id, recipient_email, recipient_name, recipient_type, subject, body_html, from_label, send_at, status)
        VALUES (campaign_id, fan.email, fan_name, 'fan', email1_subject, email1_html, 'Arcoiris', '2026-03-26T13:00:00Z', 'pending');

        -- EMAIL 2: Midday countdown (12 PM COT)
        email2_html := '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0c0c0c;font-family:''Helvetica Neue'',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0c0c;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:16px;overflow:hidden;border:1px solid rgba(230,0,0,0.15);">
<tr><td style="height:4px;background:linear-gradient(90deg,#e60000,#8b0000);"></td></tr>
<tr><td style="padding:32px 40px;text-align:center;">
<p style="color:#e60000;font-size:48px;font-weight:800;margin:0;">⏰</p>
<h1 style="color:#fff;font-size:24px;font-weight:800;margin:12px 0 4px;">Faltan 5 horas</h1>
<p style="color:#aaa;font-size:15px;margin:0;">Arcoiris LIVE en Bucaramanga</p>
</td></tr>
<tr><td style="padding:0 40px 24px;">
<p style="color:#ccc;font-size:15px;line-height:1.6;margin:0;">' || fan_name || ', la cuenta regresiva comenzó.</p>
<p style="color:#aaa;font-size:14px;line-height:1.6;margin:12px 0 0;">📍 <strong style="color:#fff;">Casa del Libro Total</strong> — Cra 35 #9-81, Centro<br>🕐 <strong style="color:#fff;">5:30 PM</strong><br>🎻 Tango contemporáneo con John Acevedo, Alisson Trigos y más</p>
<p style="color:#888;font-size:12px;margin:16px 0 0;font-style:italic;">The countdown has started. 5 hours until Arcoiris takes the stage!</p>
</td></tr>
<tr><td style="padding:0 40px 16px;">
<table width="100%" cellpadding="0" cellspacing="0"><tr>
<td width="48%" style="padding-right:8px;">
<a href="https://maps.google.com/?q=Casa+del+Libro+Total+Bucaramanga" style="display:block;background:#1a1a1a;color:#e60000;padding:14px;border-radius:12px;text-decoration:none;font-size:13px;font-weight:600;text-align:center;border:1px solid rgba(230,0,0,0.2);">📍 Cómo Llegar</a>
</td>
<td width="48%" style="padding-left:8px;">
<a href="https://apexmusiclatino.com/genre/tango/arcoiris/" style="display:block;background:linear-gradient(135deg,#e60000,#8b0000);color:#fff;padding:14px;border-radius:12px;text-decoration:none;font-size:13px;font-weight:700;text-align:center;">🎵 Ver Artistas</a>
</td>
</tr></table>
</td></tr>
<tr><td style="padding:8px 40px 32px;text-align:center;">
<p style="color:#666;font-size:12px;margin:0;">¿Vienes con amigos? Comparte este evento 👇</p>
<p style="margin:8px 0 0;">
<a href="https://wa.me/?text=Hoy%20Arcoiris%20en%20vivo%20en%20Casa%20del%20Libro%20Total%2C%205%3A30%20PM%20%F0%9F%8E%BB%20https%3A%2F%2Fapexmusiclatino.com%2Fgenre%2Ftango%2Farcoiris%2F" style="color:#25d366;font-size:13px;text-decoration:none;font-weight:600;">WhatsApp</a>
<span style="color:#333;"> · </span>
<a href="https://instagram.com/arcoiris.tango" style="color:#e1306c;font-size:13px;text-decoration:none;font-weight:600;">Instagram</a>
</p>
</td></tr>
<tr><td style="padding:24px 40px;background:#0c0c0c;border-top:1px solid #222;text-align:center;">
<p style="color:#555;font-size:11px;margin:0 0 4px;"><strong style="color:#888;">Apex Music Latino</strong></p>
<p style="color:#444;font-size:9px;margin:0;">Recibiste este email porque te registraste en apexmusiclatino.com</p>
</td></tr>
</table></td></tr></table></body></html>';

        INSERT INTO public.scheduled_emails (campaign_id, recipient_email, recipient_name, recipient_type, subject, body_html, from_label, send_at, status)
        VALUES (campaign_id, fan.email, fan_name, 'fan', email2_subject, email2_html, 'Arcoiris', '2026-03-26T17:00:00Z', 'pending');

        -- EMAIL 3: Final reminder (3 PM COT)
        email3_html := '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0c0c0c;font-family:''Helvetica Neue'',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0c0c;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:16px;overflow:hidden;border:1px solid rgba(230,0,0,0.15);">
<tr><td style="height:4px;background:linear-gradient(90deg,#e60000,#8b0000);"></td></tr>
<tr><td style="padding:32px 40px;text-align:center;">
<p style="color:#e60000;font-size:56px;font-weight:800;margin:0;">🔥</p>
<h1 style="color:#fff;font-size:22px;font-weight:800;margin:12px 0 4px;">¡EN 2 HORAS Y MEDIA!</h1>
<p style="color:#aaa;font-size:14px;margin:0;">Puertas abren pronto</p>
</td></tr>
<tr><td style="padding:0 40px 24px;">
<p style="color:#ccc;font-size:15px;line-height:1.6;margin:0;">' || fan_name || ', ya casi es hora.</p>
<p style="color:#aaa;font-size:14px;line-height:1.6;margin:12px 0 0;">Últimos detalles:</p>
<table width="100%" style="margin:12px 0;"><tr><td style="padding:10px 0;border-bottom:1px solid #222;">
<span style="color:#e60000;font-weight:700;">📍 LUGAR</span><br><span style="color:#fff;">Casa del Libro Total — Cra 35 #9-81, Centro</span>
</td></tr><tr><td style="padding:10px 0;border-bottom:1px solid #222;">
<span style="color:#e60000;font-weight:700;">🕐 HORA</span><br><span style="color:#fff;">5:30 PM</span>
</td></tr><tr><td style="padding:10px 0;">
<span style="color:#e60000;font-weight:700;">🎻 ARTISTAS</span><br><span style="color:#fff;">John Acevedo, Alisson Trigos, y el ensamble Arcoiris</span>
</td></tr></table>
<p style="color:#888;font-size:12px;margin:16px 0 0;font-style:italic;">2.5 hours to go! Doors open soon. See you there!</p>
</td></tr>
<tr><td style="padding:0 40px 16px;">
<a href="https://maps.google.com/?q=Casa+del+Libro+Total+Bucaramanga" style="display:block;background:linear-gradient(135deg,#e60000,#8b0000);color:#fff;padding:16px;border-radius:12px;text-decoration:none;font-size:15px;font-weight:700;text-align:center;">📍 LLEVAR A GOOGLE MAPS</a>
</td></tr>
<tr><td style="padding:8px 40px 32px;text-align:center;">
<p style="color:#666;font-size:11px;margin:0;">Presenta tu Fan ID en la entrada para beneficios exclusivos</p>
</td></tr>
<tr><td style="padding:24px 40px;background:#0c0c0c;border-top:1px solid #222;text-align:center;">
<p style="color:#555;font-size:11px;margin:0 0 4px;"><strong style="color:#888;">Apex Music Latino</strong></p>
<p style="color:#444;font-size:9px;margin:0;">Recibiste este email porque te registraste en apexmusiclatino.com</p>
</td></tr>
</table></td></tr></table></body></html>';

        INSERT INTO public.scheduled_emails (campaign_id, recipient_email, recipient_name, recipient_type, subject, body_html, from_label, send_at, status)
        VALUES (campaign_id, fan.email, fan_name, 'fan', email3_subject, email3_html, 'Arcoiris', '2026-03-26T20:00:00Z', 'pending');

        fan_count := fan_count + 1;
    END LOOP;

    -- Update campaign recipient count
    UPDATE public.email_campaigns
    SET total_recipients = fan_count * 3
    WHERE id = campaign_id;

    RAISE NOTICE 'Scheduled % emails for % unique fans', fan_count * 3, fan_count;
END $$;

-- Verify
SELECT
    se.recipient_email,
    se.recipient_name,
    se.subject,
    se.send_at AT TIME ZONE 'America/Bogota' as send_at_cot,
    se.status
FROM scheduled_emails se
WHERE se.campaign_id = '00000000-0000-0000-0000-000000000001'
ORDER BY se.send_at, se.recipient_email;
