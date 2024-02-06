import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://esatate-solutions.onrender.com/',
        secure: true,
        changeOrigin: true,
      }
    }
  },
  plugins: [react()],
})
