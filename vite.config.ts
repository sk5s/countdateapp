import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "./build",
  },
  server: {
    port: 3000,
  },
  plugins: [
    react(),
    legacy()
  ]
})