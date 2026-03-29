import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // [cite: 50]
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'], // Arquivos estáticos [cite: 84]
        runtimeCaching: [
          {
            urlPattern: /^http:\/\/localhost:8080\/api\/.*$/, // API Java
            handler: 'NetworkFirst', // Prioriza rede, usa cache como fallback 
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 1 dia
              }
            }
          }
        ]
      },
      manifest: { // Identidade Visual [cite: 35, 52]
        name: 'Primeira Casa',
        short_name: 'PrimeiraCasa',
        description: 'Minha lista de compras para a casa nova',
        theme_color: '#4CAF50', // [cite: 55]
        display: 'standalone', //  app nativo [cite: 56]
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});