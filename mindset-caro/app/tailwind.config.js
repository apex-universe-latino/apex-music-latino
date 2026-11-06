/** @type {import('tailwindcss').Config} */
// Mindset Caro brand (hers, not GSD's): crimson + deep red + near-black + warm off-white,
// Inter for everything (800–900 headlines) + Space Mono for numbers and labels.
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        crimson: { DEFAULT: '#e60000', dark: '#b30000', glow: '#ff1a1a', deep: '#7a0000' },
        dark: { DEFAULT: '#111111', light: '#151515', lighter: '#1d1414' },
        bone: { DEFAULT: '#f3f1ec', warm: '#efe6e4' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
