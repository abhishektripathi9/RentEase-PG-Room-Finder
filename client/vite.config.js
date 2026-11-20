import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    cssMinify: true,
  },
  server: {
    warmup: {
      clientFiles: ['./src/main.jsx', './src/App.jsx', './src/index.css']
    }
  }
})
