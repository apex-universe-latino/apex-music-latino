import Hero from '../sections/Hero';
import Pains from '../sections/Pains';
import Engines from '../sections/Engines';
import Multi from '../sections/Multi';
import Compare from '../sections/Compare';
import Videos from '../sections/Videos';
import DiagCta from '../sections/DiagCta';
import Testimonials from '../components/Testimonials';
import Recruit from '../sections/Recruit';
import { useUi } from '../ui';

export default function Landing() {
  const { cms } = useUi();
  return (
    <>
      <Hero />
      <Pains />
      <Engines />
      <Multi />
      <Compare />
      <Videos />
      <DiagCta />
      <Testimonials cmsData={cms} />
      <Recruit />
    </>
  );
}
