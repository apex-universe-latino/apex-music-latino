import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../sections/Hero';
import QueEs from '../sections/QueEs';
import Pains from '../sections/Pains';
import Engines from '../sections/Engines';
import Multi from '../sections/Multi';
import Compare from '../sections/Compare';
import Casos from '../sections/Casos';
import Videos from '../sections/Videos';
import DiagCta from '../sections/DiagCta';
import Testimonials from '../components/Testimonials';
import Recruit from '../sections/Recruit';
import { useUi } from '../ui';

export default function Landing() {
  const { cms } = useUi();
  const { hash } = useLocation();
  // Arriving from another route via the menu ("/#metas"): scroll once the sections exist.
  useEffect(() => {
    if (!hash) return;
    const t = window.setTimeout(() => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ block: 'start' }), 60);
    return () => window.clearTimeout(t);
  }, [hash]);
  return (
    <>
      <Hero />
      <div className="rainbow-divider" aria-hidden />
      <QueEs />
      <Pains />
      <Engines />
      <Compare />
      <Multi />
      <Casos />
      <Videos />
      <DiagCta />
      <Testimonials cmsData={cms} />
      <Recruit />
    </>
  );
}
