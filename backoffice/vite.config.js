import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
  host: '0.0.0.0',
  port: 5174, // ou 5174 pour backoffice
  watch: {
    usePolling: true  // 👈 ESSENTIEL pour Docker sur Windows/macOS
  }
}

})
