import { media } from '../config';

/** Her mark (fine-line brain + bills, crimson spark) next to the "Mindset Caro" wordmark. */
export default function Brand({ size = 'md', stacked = false }: { size?: 'sm' | 'md' | 'lg'; stacked?: boolean }) {
  const mark = { sm: 'h-6', md: 'h-8', lg: 'h-12' }[size];
  const word = { sm: 'text-base', md: 'text-lg', lg: 'text-2xl' }[size];
  return (
    <span className={`inline-flex ${stacked ? 'flex-col items-start gap-1.5' : 'items-center gap-2.5'}`}>
      <img src={media('brand/logo.svg')} alt="" aria-hidden className={`${mark} w-auto`} width={60} height={32} />
      <span className={`${word} font-black leading-none tracking-[-0.04em]`}>
        MINDSET<span className="text-crimson">CARO</span>
      </span>
    </span>
  );
}
