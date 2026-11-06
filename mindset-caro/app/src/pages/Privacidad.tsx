import { SEOHead } from '../components/SEOHead';

const CONTACT = 'info@mindsetcaro.com';

export default function Privacidad() {
  return (
    <article className="px-4 py-14 sm:px-6">
      <SEOHead title="Política de tratamiento de datos" description="Cómo Mindset Caro trata tus datos personales conforme a la Ley 1581 de 2012." canonicalUrl="https://www.mindsetcaro.com/privacidad" />
      <div className="mx-auto max-w-3xl space-y-5 leading-relaxed text-white/75 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-white">
        <p className="eyebrow">Ley 1581 de 2012 · Decreto 1377 de 2013</p>
        <h1 className="text-4xl font-black tracking-tight text-white">Política de tratamiento de datos personales</h1>
        <p>
          En Mindset Caro respetamos tu privacidad. Esta política explica qué datos recogemos en www.mindsetcaro.com, para qué los usamos
          y cómo puedes ejercer tus derechos como titular, conforme a la Ley Estatutaria 1581 de 2012 y sus decretos reglamentarios.
        </p>

        <h2>1. Responsable del tratamiento</h2>
        <p>Diana Carolina Cepeda (Carolina Veci), marca Mindset Caro. Correo de contacto para temas de datos personales: <a className="text-white underline" href={`mailto:${CONTACT}`}>{CONTACT}</a>.</p>

        <h2>2. Datos que recogemos</h2>
        <p>
          Nombre, número de WhatsApp, correo electrónico (opcional), tus respuestas al Diagnóstico de Blindaje Patrimonial y al asistente
          Caro IA (por ejemplo: metas, rangos de ahorro o ingreso, número de personas a cargo), y datos de navegación como la campaña o
          el anuncio por el que llegaste. <b className="text-white">No solicitamos datos de salud</b> ni otros datos sensibles en este sitio.
          El sitio está dirigido a personas mayores de 18 años.
        </p>

        <h2>3. Finalidades</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>Calcular y mostrarte el resultado ilustrativo de tu diagnóstico.</li>
          <li>Contactarte por WhatsApp, llamada o correo para enviarte tu Mapa de Blindaje y, si lo pides, agendar una asesoría.</li>
          <li>Personalizar la información que te compartimos según tus respuestas.</li>
          <li>Enviarte contenidos y novedades, solo si lo autorizaste de forma expresa.</li>
          <li>Medir el desempeño de nuestras campañas de forma agregada.</li>
        </ul>

        <h2>4. Tus derechos</h2>
        <p>
          Como titular puedes conocer, actualizar y rectificar tus datos; solicitar prueba de la autorización; ser informado sobre el uso
          que les damos; revocar la autorización o pedir la supresión de tus datos cuando no exista un deber legal o contractual de
          conservarlos; acceder gratuitamente a ellos; y presentar quejas ante la Superintendencia de Industria y Comercio.
        </p>

        <h2>5. Cómo ejercerlos</h2>
        <p>
          Escríbenos a <a className="text-white underline" href={`mailto:${CONTACT}`}>{CONTACT}</a> indicando tu nombre, tu número de
          WhatsApp y tu solicitud. Atendemos consultas en máximo 10 días hábiles y reclamos en máximo 15 días hábiles, según la ley.
        </p>

        <h2>6. Encargados y seguridad</h2>
        <p>
          Tus datos se almacenan con proveedores tecnológicos que actúan como encargados del tratamiento (alojamiento web, base de datos
          y mensajería), con medidas de seguridad razonables. No vendemos tus datos. Algunos de estos proveedores pueden estar fuera de
          Colombia; al autorizar el tratamiento aceptas esa transferencia con las mismas garantías.
        </p>

        <h2>7. Vigencia</h2>
        <p>Esta política rige desde su publicación. Conservaremos tus datos mientras sean necesarios para las finalidades descritas o hasta que solicites su supresión.</p>
      </div>
    </article>
  );
}
