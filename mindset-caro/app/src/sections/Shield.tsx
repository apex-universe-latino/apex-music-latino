// Animated split shield: left half = Seguro (protección), right half = Ahorro (S&P 500).
// The halves slide together on load and the seam lights up — "dos motores, un blindaje".
const SHIELD = 'M160 14 L294 60 V176 C294 266 236 326 160 366 C84 326 26 266 26 176 V60 Z';

export default function Shield({ className = '' }: { className?: string }) {
  const bars = [0, 1, 2, 3, 4];
  return (
    <svg viewBox="0 0 320 380" className={className} role="img"
      aria-label="Escudo dividido en dos: Seguro y Ahorro, que se unen en un solo blindaje">
      <defs>
        <linearGradient id="sh-red" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d6c3a1" />
          <stop offset="1" stopColor="#244c47" />
        </linearGradient>
        <linearGradient id="sh-dark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a1a1a" />
          <stop offset="1" stopColor="#111111" />
        </linearGradient>
        <clipPath id="sh-left"><rect x="0" y="0" width="160" height="380" /></clipPath>
        <clipPath id="sh-right"><rect x="160" y="0" width="160" height="380" /></clipPath>
        <filter id="sh-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* soft halo */}
      <ellipse cx="160" cy="200" rx="150" ry="170" fill="#173b38" opacity=".10" />

      <g className="shield-l">
        <path d={SHIELD} clipPath="url(#sh-left)" fill="url(#sh-red)" />
        {/* umbrella = protección */}
        <g transform="translate(92 130)" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M-34 6 C-30 -26 30 -26 34 6 C24 -2 12 -2 0 6 C-12 -2 -24 -2 -34 6 Z" fill="#fff" fillOpacity=".15" />
          <path d="M0 6 V42 C0 52 -12 52 -12 42" />
        </g>
        <text x="92" y="232" textAnchor="middle" fill="#fff" fontFamily="'Space Mono', monospace" fontWeight="700" fontSize="17" letterSpacing="2">SEGURO</text>
        <text x="92" y="254" textAnchor="middle" fill="#fff" fillOpacity=".75" fontFamily="Inter, sans-serif" fontSize="12">desde el día 1</text>
      </g>

      <g className="shield-r">
        <path d={SHIELD} clipPath="url(#sh-right)" fill="url(#sh-dark)" stroke="#173b38" strokeOpacity=".5" strokeWidth="2" />
        {/* rising bars = ahorro */}
        {bars.map((b) => {
          const h = 16 + b * 13;
          return (
            <rect key={b} className="bar-grow" x={186 + b * 19} y={174 - h} width="12" height={h} rx="2"
              fill={b === 4 ? '#173b38' : '#292c2b'} fillOpacity={b === 4 ? 1 : 0.25 + b * 0.15}
              style={{ ['--d' as string]: `${1.1 + b * 0.12}s` }} />
          );
        })}
        <text x="228" y="232" textAnchor="middle" fill="#292c2b" fontFamily="'Space Mono', monospace" fontWeight="700" fontSize="17" letterSpacing="2">AHORRO</text>
        <text x="228" y="254" textAnchor="middle" fill="#292c2b" fillOpacity=".7" fontFamily="Inter, sans-serif" fontSize="12">índice S&amp;P 500</text>
      </g>

      {/* the seam lights up when they lock */}
      <line className="seam" x1="160" y1="20" x2="160" y2="360" stroke="#d6c3a1" strokeWidth="3" filter="url(#sh-glow)" />
      <path className="seam" d={SHIELD} fill="none" stroke="#d6c3a1" strokeWidth="2.5" filter="url(#sh-glow)" />
    </svg>
  );
}
