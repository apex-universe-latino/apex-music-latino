/** @type {import('tailwindcss').Config} */
// Mindset Caro: deep green, champagne, ivory and graphite.
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        crimson: { DEFAULT: '#173b38', dark: '#102d2a', glow: '#d6c3a1', deep: '#244c47' },
        dark: { DEFAULT: '#f5f1e9', light: '#eee8dc', lighter: '#e7dfd1' },
        bone: { DEFAULT: '#f5f1e9', warm: '#d6c3a1' },
        graphite: '#292c2b', champagne: '#d6c3a1', forest: '#173b38',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
