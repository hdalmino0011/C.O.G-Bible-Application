import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'path';
import {defineConfig} from 'vite';

function generateOfflineServiceWorker() {
  return {
    name: 'generate-offline-service-worker',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const builtAssets = fs
        .readdirSync(path.join(distDir, 'assets'))
        .map((file) => `./assets/${file}`);
      const bibleData = fs
        .readdirSync(path.resolve(__dirname, 'public/data'))
        .map((file) => `./data/${file}`);
      const precache = [
        './',
        './index.html',
        './logo.jpg',
        './manifest.json',
        ...bibleData,
        ...builtAssets,
      ];
      const serviceWorker = fs.readFileSync(
        path.resolve(__dirname, 'public/sw.js'),
        'utf8',
      ).replace('__PRECACHE_ASSETS__', JSON.stringify(precache, null, 2));
      fs.writeFileSync(path.join(distDir, 'sw.js'), serviceWorker);
    },
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss(), generateOfflineServiceWorker()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
