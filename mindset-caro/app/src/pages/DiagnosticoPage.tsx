import Pitch101 from '../components/Pitch101';
import Roulette from '../components/Roulette';
import IndependenceCalculator from '../components/IndependenceCalculator';

export default function DiagnosticoPage({ cmsContent }: { cmsContent?: any }) {
  return (
    <>
      <Pitch101 cmsData={cmsContent} />
      
      <div className="py-24 bg-dark relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          <Roulette apiBase="" />
          <IndependenceCalculator apiBase="" />
        </div>
      </div>
    </>
  );
}
