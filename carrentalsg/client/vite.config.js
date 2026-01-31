import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  server: {
    host: '0.0.0.0',       // important for Docker
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://backend:3000',  // matches your backend service name
        changeOrigin: true,
        secure: false
      }
    }
  },
  plugins: [react()]
})
