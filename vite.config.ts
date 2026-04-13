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
            urlPattern: /^https:\/\/primeiracasa-backend\.onrender\.com\/api\/.*$/, // API Java
            handler: 'NetworkFirst', // Prioriza rede, usa cache como fallback 
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
                // Only cache status codes 0 (CORS) and 200 (success)
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
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'icons.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ]
      }
    })
  ]
});