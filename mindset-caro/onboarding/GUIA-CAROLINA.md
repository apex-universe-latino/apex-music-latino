# Guía de tu Sitio Web — mindsetcaro.com

Hola Carolina! Esta es tu guía para usar y administrar tu sitio web.

---

## 🌐 Tu sitio

- **URL:** https://mindsetcaro.com
- **Panel de administración (CMS):** https://mindsetcaro.com/cms
- **Blog:** https://mindsetcaro.com/blog

---

## 📝 Cómo editar el contenido de tu sitio

1. Ve a **https://mindsetcaro.com/cms**
2. Ingresa tu clave de administración (te la damos por WhatsApp)
3. En la pestaña **Contenido (CMS)** puedes editar:
   - Títulos y subtítulos del hero
   - Textos de los 3 pilares (Proteger familia, Ventas, Mindset)
   - Beneficios
   - Testimonios (reemplaza los de ejemplo con los tuyos)
   - Textos del diagnóstico
   - Premios de la ruleta
4. Haz clic en **Guardar** después de cada cambio
5. Los cambios se ven en vivo inmediatamente

---

## ✍️ Cómo crear un artículo de blog

### Desde el CMS:
1. Ve a **https://mindsetcaro.com/cms**
2. Ingresa tu clave
3. Busca la sección de blog/posts

### Desde la terminal (avanzado):
```bash
curl -X POST https://mindsetcaro.com/api/posts \
  -H 'Content-Type: application/json' \
  -d '{
    "admin_key": "TU_CLAVE_ADMIN",
    "post": {
      "slug": "mi-primer-articulo",
      "title": "Mi Primer Artículo",
      "excerpt": "Un resumen corto de qué trata...",
      "body": "<p>El contenido completo del artículo en HTML...</p>",
      "status": "published",
      "tags": ["finanzas", "mindset"]
    }
  }'
```

### Tips para el blog:
- **slug** = la URL del artículo (ej: `mi-primer-articulo` → mindsetcaro.com/blog/mi-primer-articulo)
- **status** = `draft` (borrador, no se ve) o `published` (visible)
- **tags** = etiquetas para categorizar (ej: finanzas, ventas, mindset, metlife)
- **body** = acepta HTML (puedes usar negritas, enlaces, imágenes)

---

## 📊 Cómo ver tus leads capturados

1. Ve a **https://mindsetcaro.com/cms**
2. Ingresa tu clave
3. Pestaña **Datos entrantes** — ahí ves todos los leads que llenan el formulario de diagnóstico
4. Cada lead tiene: nombre, email, WhatsApp, nivel educativo, objetivo

También recibes un email automático en **Dccarolinacepeda@gmail.com** cada vez que alguien llena el formulario.

---

## 📱 QR Codes (próximamente)

Cuando estés lista, te generamos códigos QR personalizados para:
- Tu tarjeta de presentación → lleva directo al diagnóstico
- Tus redes sociales → lleva a tu landing page
- Eventos y conferencias → lleva al formulario de captura

Cada QR tendrá tracking para que sepas de dónde vienen tus leads.

---

## 🔗 Links importantes

| Qué | URL |
|-----|-----|
| Tu sitio web | https://mindsetcaro.com |
| Panel CMS | https://mindsetcaro.com/cms |
| Blog | https://mindsetcaro.com/blog |
| Diagnóstico | https://mindsetcaro.com/diagnostico |
| Tu portada | https://iaycaynevtumrqoknemk.supabase.co/storage/v1/object/public/mindset-caro-assets/portada.jpeg |
| Portada MetLife | https://iaycaynevtumrqoknemk.supabase.co/storage/v1/object/public/mindset-caro-assets/Met%20Life%20Portada.jpeg |

---

## ❓ Soporte

Si necesitas ayuda o quieres hacer cambios, escribe al equipo de Apex Modelos Latino.

---

*Apex Modelos Latino — Tu marca, tu plataforma, tu comunidad.*
