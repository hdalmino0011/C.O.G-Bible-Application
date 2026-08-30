import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'path';
import {defineConfig} from 'vite';

const projectRoot = process.cwd();

function generateOfflineServiceWorker() {
  return {
    name: 'generate-offline-service-worker',
    closeBundle() {
      const distDir = path.resolve(projectRoot, 'dist');
      if (!fs.existsSync(distDir)) return;
      const assetsDir = path.join(distDir, 'assets');
      const builtAssets = fs.existsSync(assetsDir)
        ? fs.readdirSync(assetsDir).flatMap((file) => [`./assets/${file}`, `assets/${file}`])
        : [];
      const publicDataDir = path.resolve(projectRoot, 'public/data');
      const rawBibleFiles = fs.existsSync(publicDataDir)
        ? fs.readdirSync(publicDataDir).filter((f) => f.endsWith('.json'))
        : [];
      const bibleData = rawBibleFiles.flatMap((file) => [
        `./data/${file}`,
        `data/${file}`,
        `./data/${encodeURIComponent(file)}`,
        `data/${encodeURIComponent(file)}`
      ]);
      const precache = Array.from(
        new Set([
          './',
          '',
          'index.html',
          './index.html',
          'app-icon-192.png',
          './app-icon-192.png',
          'app-icon.png',
          './app-icon.png',
          'app-icon-maskable.png',
          './app-icon-maskable.png',
          'logo.jpg',
          './logo.jpg',
          'logo.png',
          './logo.png',
          'manifest.json',
          './manifest.json',
          '404.html',
          './404.html',
          '.nojekyll',
          './.nojekyll',
          ...bibleData,
          ...builtAssets,
        ])
      );
      const swSrc = path.resolve(projectRoot, 'public/sw.js');
      if (fs.existsSync(swSrc)) {
        const serviceWorker = fs.readFileSync(swSrc, 'utf8').replace(
          'const PRECACHE_ASSETS = [];',
          `const PRECACHE_ASSETS = ${JSON.stringify(precache, null, 2)};`
        );
        fs.writeFileSync(path.join(distDir, 'sw.js'), serviceWorker);
      }
    },
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss(), generateOfflineServiceWorker()],
    resolve: {alias: {'@': path.resolve(projectRoot, '.') }},
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
