import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'path';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function generateOfflineServiceWorker() {
  return {
    name: 'generate-offline-service-worker',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(distDir)) return;
      const assetsDir = path.join(distDir, 'assets');
      const builtAssets = fs.existsSync(assetsDir)
        ? fs.readdirSync(assetsDir).map((file) => `./assets/${file}`)
        : [];
      const publicDataDir = path.resolve(__dirname, 'public/data');
      const bibleData = fs.existsSync(publicDataDir)
        ? fs.readdirSync(publicDataDir).map((file) => `./data/${file}`)
        : [];
      const precache = [
        './',
        './index.html',
        './app-icon-192.png',
        './app-icon.png',
        './app-icon-maskable.png',
        './logo.jpg',
        './logo.png',
        './manifest.json',
        './404.html',
        './.nojekyll',
        ...bibleData,
        ...builtAssets,
      ];
      const swSrc = path.resolve(__dirname, 'public/sw.js');
      if (fs.existsSync(swSrc)) {
        const serviceWorker = fs.readFileSync(swSrc, 'utf8').replace('__PRECACHE_ASSETS_LIST__', JSON.stringify(precache, null, 2));
        fs.writeFileSync(path.join(distDir, 'sw.js'), serviceWorker);
      }
    },
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss(), generateOfflineServiceWorker()],
    resolve: {alias: {'@': path.resolve(__dirname, '.') }},
    server: {
      host: '0.0.0.0',
      port: 3000,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
