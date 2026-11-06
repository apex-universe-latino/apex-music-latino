import { useState, useEffect } from 'react';
import { Routes, Route, Link, useParams } from 'react-router-dom';
import Hero from './components/Hero';
import DiagnosticForm from './components/DiagnosticForm';
import Pillars from './components/Pillars';
import MediaShowcase from './components/MediaShowcase';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import Benefits from './components/Benefits';
import Testimonials from './components/Testimonials';
import DiagnosticoPage from './pages/DiagnosticoPage';

function BlogPostWrapper() {
  const { slug } = useParams();
  return <BlogPost slug={slug || ''} apiBase="" />;
}

// Main Landing Page Layout
function LandingPage({ cmsContent, showDiagnostic, setShowDiagnostic }: any) {
  return (
    <>
      <div className="relative">
        <Hero onStartDiagnostic={() => setShowDiagnostic(true)} cmsData={cmsContent} />
        
        {showDiagnostic && (
          <div className="absolute inset-0 z-40 bg-dark/95 backdrop-blur-sm flex items-center justify-center p-4">
            <DiagnosticForm onClose={() => setShowDiagnostic(false)} />
          </div>
        )}
      </div>

      <Pillars cmsData={cmsContent} />
      <Benefits cmsData={cmsContent} />
      <MediaShowcase cmsData={cmsContent} />
      <Testimonials cmsData={cmsContent} />
    </>
  );
}

function App() {
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [cmsContent, setCmsContent] = useState<any>(null);

  useEffect(() => {
    fetch('https://apexmodeloslatino.com/api/mc-content?site=landing')
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          setCmsContent(data.content);
        }
      })
      .catch(err => console.error('Error fetching CMS content:', err));
  }, []);

  return (
    <div className="min-h-screen bg-dark text-white font-sans selection:bg-crimson selection:text-white">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-dark/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-20">
                <Link to="/" className="flex-shrink-0 font-bold text-2xl tracking-tighter">
                  MINDSET<span className="text-crimson">CARO</span>
                </Link>
                <div className="hidden md:flex items-center gap-6">
                  <Link to="/blog" className="text-gray-300 hover:text-white transition-colors font-medium">
                    Blog
                  </Link>
                  <Link 
                    to="/diagnostico"
                    className="bg-crimson hover:bg-crimson-glow text-white px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-[0_0_15px_rgba(230,0,0,0.3)] hover:shadow-[0_0_25px_rgba(230,0,0,0.6)]"
                  >
                    Diagnóstico Gratuito
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content (Routed) */}
          <main className="pt-20 min-h-screen">
            <Routes>
              <Route path="/" element={<LandingPage cmsContent={cmsContent} showDiagnostic={showDiagnostic} setShowDiagnostic={setShowDiagnostic} />} />
              <Route path="/diagnostico" element={<DiagnosticoPage cmsContent={cmsContent} />} />
              <Route path="/blog" element={<BlogList apiBase="" />} />
              <Route path="/blog/:slug" element={<BlogPostWrapper />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-dark-lighter py-12 border-t border-white/10 mt-20">
            <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
              <p className="mb-4 text-lg">Únete a la comunidad exclusiva en Discord</p>
              <a href="#" className="inline-block text-crimson hover:text-white transition-colors">Unirme Ahora &rarr;</a>
              <div className="mt-8 text-sm">
                &copy; {new Date().getFullYear()} Apex Modelos Latino. All rights reserved.
              </div>
            </div>
          </footer>

    </div>
  );
}

export default App;
