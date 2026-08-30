import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {ErrorBoundary} from './components/ErrorBoundary.tsx';
import './index.css';

function keepPortraitOrientation() {
  if (!('screen' in window) || !('orientation' in window.screen)) return;

  const orientation = window.screen.orientation;
  const lock = (orientation as ScreenOrientation & {
    lock?: (type: 'portrait-primary') => Promise<void>;
  }).lock;
  if (typeof lock !== 'function') return;

  lock.call(orientation, 'portrait-primary').catch(() => {
    // Some browsers only allow orientation locking for installed apps.
  });
}

// Register the service worker so full offline PWA is enabled anywhere (dev, preview, production).
if ('serviceWorker' in navigator) {
  const registerSW = () => {
    try {
      const swUrl = new URL('sw.js', window.location.href).href;
      navigator.serviceWorker.register(swUrl, { updateViaCache: 'none' })
        .then((reg) => {
          console.log('[PWA] ServiceWorker registered with scope:', reg.scope);
          reg.update().catch(() => {});
        })
        .catch(() => {
          navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).catch((err) => {
            console.warn('[PWA] SW fallback error: ', err);
          });
        });
    } catch {
      navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).catch(() => {});
    }
    keepPortraitOrientation();
  };

  if (document.readyState === 'complete') {
    registerSW();
  } else {
    window.addEventListener('load', registerSW);
  }
}

window.addEventListener('orientationchange', keepPortraitOrientation);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
