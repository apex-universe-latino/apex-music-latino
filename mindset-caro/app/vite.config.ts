import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Builds straight into the repo's static output (Vercel serves /public — there is no build
// step on Vercel). Run `npm run build` here and commit public/mindset-caro.
export default defineConfig({
  plugins: [react()],
  base: '/mindset-caro/',
  build: {
    outDir: '../../public/mindset-caro',
    emptyOutDir: true,
  },
})
