/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crimson: {
          DEFAULT: '#e60000',
          dark: '#b30000',
          glow: '#ff1a1a',
        },
        dark: {
          DEFAULT: '#111111',
          light: '#1a1a1a',
          lighter: '#222222',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 15px 0px rgba(230, 0, 0, 0.4)' },
          '50%': { opacity: '.8', boxShadow: '0 0 5px 0px rgba(230, 0, 0, 0.2)' },
        }
      }
    },
  },
  plugins: [],
}
