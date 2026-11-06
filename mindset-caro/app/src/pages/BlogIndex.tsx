import { SEOHead } from '../components/SEOHead';

export const BlogIndex = () => {
  return (
    <div className="page">
      <SEOHead 
        title="Blog & Insights" 
        description="Aprende sobre finanzas, ventas y la mentalidad correcta para escalar tus ingresos con Carolina Veci." 
      />
      <h1>Blog & Insights</h1>
      <p className="subtitle">Últimos artículos sobre mentalidad financiera y ventas</p>
      
      <div className="tool-card">
        <h3>1. Cómo salir de deudas y organizar tu flujo de caja</h3>
        <p>Aprende las 3 reglas de oro para estructurar tus deudas sin dejar de invertir. Porque como siempre decimos... si el dinero no trabaja, estás trabajando demasiado.</p>
        <p className="url-value"><a href="#">Leer artículo completo &rarr;</a></p>
      </div>

      <div className="tool-card">
        <h3>2. El poder de los seguros en la protección patrimonial</h3>
        <p>No se trata solo de ahorrar, sino de blindar tu capital ante emergencias. Descubre qué pólizas necesitas según tu etapa de vida.</p>
        <p className="url-value"><a href="#">Leer artículo completo &rarr;</a></p>
      </div>
      
      <div className="page-footer">Apex Modelos Latino &middot; Mindset Caro &middot; Blog</div>
    </div>
  );
};
