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

// Register the service worker only in production builds so dev preview is not hijacked.
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js', {updateViaCache: 'none'}).catch((err) => {
        console.log('SW registration error: ', err);
      });
      keepPortraitOrientation();
    });
  } else {
    // In dev mode, ensure old service workers are cleaned up so preview loads fresh
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
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
