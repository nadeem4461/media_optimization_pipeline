import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.49.2:30728',
        changeOrigin: true
      }
    }
  }
})