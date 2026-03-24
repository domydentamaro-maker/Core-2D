import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import viteSitemap from 'vite-plugin-sitemap';


export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        // @ts-ignore
        allowedHosts: process.env.TEMPO === "true" ? true : undefined,
      },
      plugins: [
        react(),
        // sitemap generator plugin will create sitemap.xml at build
        viteSitemap({
          hostname: 'https://www.2dsviluppoimmobiliare.it',
          dynamicRoutes: [
            '/',
            '/filo/',
            '/zes/',
            '/bari/',
            '/provincia-bari/',
            '/glossario/',
            '/contact/',
            '/domenico-dentamaro/',
          ],
          exclude: ['*'],
          changefreq: 'weekly',
          priority: {
            '/': 1.0,
            '/domenico-dentamaro/': 0.9,
            '/zes/': 0.9,
            '/filo/': 0.85,
            '/bari/': 0.8,
            '/provincia-bari/': 0.75,
            '/glossario/': 0.7,
            '/contact/': 0.65,
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
