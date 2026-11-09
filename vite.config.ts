import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'serve-exe-files',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const cleanUrl = req.url ? req.url.split('?')[0] : '';
            if (cleanUrl === '/Haydar_Speed_Pro_Setup.exe' || cleanUrl === '/Haydar_Speed_Pro.exe') {
              const filePath = path.join(process.cwd(), 'public', cleanUrl.slice(1));
              if (fs.existsSync(filePath)) {
                const stat = fs.statSync(filePath);
                res.setHeader('Content-Type', 'application/x-msdownload');
                res.setHeader('Content-Length', stat.size);
                res.setHeader('Content-Disposition', `attachment; filename="${cleanUrl.slice(1)}"`);
                fs.createReadStream(filePath).pipe(res);
                return;
              }
            }
            next();
          });
        },
      },
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg'],
        manifest: {
          id: '/',
          name: 'Haydar Speed Pro - Accélérateur Windows Universel',
          short_name: 'HaydarSpeed',
          description: 'Suite Universelle Windows d\'accélération et d\'optimisation système (XP à 11).',
          theme_color: '#0d0f12',
          background_color: '#0d0f12',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 50 * 1024 * 1024,
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
