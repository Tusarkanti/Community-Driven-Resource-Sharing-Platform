import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Community-Driven-Resource-Sharing-Platform/', // for GitHub Pages
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000' // proxy to backend during local dev
    }
  }
});
