import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
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

// Register the service worker in production builds so the installed app works offline.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.log('SW registration error: ', err);
    });
    keepPortraitOrientation();
  });
}

window.addEventListener('orientationchange', keepPortraitOrientation);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

