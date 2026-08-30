const CACHE_NAME = 'cog-bible-offline-v7.0.0';

const DEFAULT_BOOK_FILES = [
  '1 Chronicles.json',
  '1 Corinthians.json',
  '1 John.json',
  '1 Kings.json',
  '1 Peter.json',
  '1 Samuel.json',
  '1 Thessalonians.json',
  '1 Timothy.json',
  '2 Chronicles.json',
  '2 Corinthians.json',
  '2 John.json',
  '2 Kings.json',
  '2 Peter.json',
  '2 Samuel.json',
  '2 Thessalonians.json',
  '2 Timothy.json',
  '3 John.json',
  'Acts.json',
  'Amos.json',
  'Colossians.json',
  'Daniel.json',
  'Deuteronomy.json',
  'Ecclesiastes.json',
  'Ephesians.json',
  'Esther.json',
  'Exodus.json',
  'Ezekiel.json',
  'Ezra.json',
  'Galatians.json',
  'Genesis.json',
  'Habakkuk.json',
  'Haggai.json',
  'Hebrews.json',
  'Hosea.json',
  'Isaiah.json',
  'James.json',
  'Jeremiah.json',
  'Job.json',
  'Joel.json',
  'John.json',
  'Jonah.json',
  'Joshua.json',
  'Jude.json',
  'Judges.json',
  'Lamentations.json',
  'Leviticus.json',
  'Luke.json',
  'Malachi.json',
  'Mark.json',
  'Matthew.json',
  'Micah.json',
  'Nahum.json',
  'Nehemiah.json',
  'Numbers.json',
  'Obadiah.json',
  'Philemon.json',
  'Philippians.json',
  'Proverbs.json',
  'Psalms.json',
  'Revelation.json',
  'Romans.json',
  'Ruth.json',
  'Song of Solomon.json',
  'Titus.json',
  'Zechariah.json',
  'Zephaniah.json'
];

const DEFAULT_STATIC_ASSETS = [
  './',
  '',
  'index.html',
  './index.html',
  'manifest.json',
  './manifest.json',
  'logo.png',
  './logo.png',
  'logo.jpg',
  './logo.jpg',
  'app-icon.png',
  './app-icon.png',
  'app-icon-192.png',
  './app-icon-192.png',
  'app-icon-maskable.png',
  './app-icon-maskable.png',
  '404.html',
  './404.html',
  '.nojekyll',
  './.nojekyll',
  ...DEFAULT_BOOK_FILES.flatMap(file => [
    `./data/${file}`,
    `data/${file}`,
    `/data/${file}`,
    `./data/${encodeURIComponent(file)}`,
    `data/${encodeURIComponent(file)}`,
    `/data/${encodeURIComponent(file)}`
  ])
];

// Injected during build by vite.config.ts
const PRECACHE_ASSETS = [];

const STATIC_ASSETS = Array.from(
  new Set([...PRECACHE_ASSETS, ...DEFAULT_STATIC_ASSETS])
);

// Install event: Precache core assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // 1. First cache the critical shell (index.html, manifest, icons)
      const criticalShell = [
        './',
        'index.html',
        './index.html',
        'manifest.json',
        './manifest.json',
        'logo.png',
        './logo.png',
        'logo.jpg',
        './logo.jpg',
        'app-icon.png',
        './app-icon.png',
        'app-icon-192.png',
        './app-icon-192.png'
      ];

      await Promise.allSettled(
        criticalShell.map(async (url) => {
          try {
            const res = await fetch(url, { cache: 'reload' });
            if (res && res.status === 200) {
              await cache.put(url, res.clone());
            }
          } catch (e) {
            console.warn('[SW] Shell item precache error:', url, e);
          }
        })
      );

      // 2. Precache remaining assets in background
      await Promise.allSettled(
        STATIC_ASSETS.map(async (url) => {
          try {
            const res = await fetch(url, { cache: 'no-cache' });
            if (res && res.status === 200) {
              const ct = res.headers.get('content-type') || '';
              if (url.endsWith('.json') && ct.includes('text/html')) {
                return;
              }
              await cache.put(url, res.clone());
              const decoded = decodeURIComponent(url);
              if (decoded !== url) {
                await cache.put(decoded, res.clone());
              }
            }
          } catch (err) {
            // Silently skip non-critical asset errors during install
          }
        })
      );
    })
  );
});

// Activate event: Clean old caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// Helper to look up a request flexibly in Cache across URL variants
async function matchCacheFlexible(request) {
  const cache = await caches.open(CACHE_NAME);
  
  // 1. Direct match with ignoreSearch
  let matched = await cache.match(request, { ignoreSearch: true });
  if (matched && matched.status === 200) return matched;

  const urlStr = typeof request === 'string' ? request : request.url;

  // 2. Try URL Decoded match
  try {
    const decodedUrl = decodeURIComponent(urlStr);
    matched = await cache.match(decodedUrl, { ignoreSearch: true });
    if (matched && matched.status === 200) return matched;
  } catch {}

  // 3. Match by pathname or filename suffix (e.g. "Genesis.json" or "data/Genesis.json" or "assets/...")
  try {
    const parsed = new URL(urlStr, self.location.origin);
    const pathname = parsed.pathname;
    const filename = pathname.split('/').filter(Boolean).pop();
    const allKeys = await cache.keys();

    for (const key of allKeys) {
      const keyParsed = new URL(key.url, self.location.origin);
      if (keyParsed.pathname === pathname || decodeURIComponent(keyParsed.pathname) === decodeURIComponent(pathname)) {
        const item = await cache.match(key);
        if (item && item.status === 200) return item;
      }
      
      const keyFilename = keyParsed.pathname.split('/').filter(Boolean).pop();
      if (filename && keyFilename && (filename === keyFilename || decodeURIComponent(filename) === decodeURIComponent(keyFilename))) {
        const item = await cache.match(key);
        if (item && item.status === 200) return item;
      }
    }
  } catch {}

  return null;
}

// Fetch handler: Complete offline resilience
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = event.request.url;

  // 1. HTML Navigation requests (Page loading & refresh)
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const copy = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, copy);
              cache.put('./index.html', networkRes.clone());
              cache.put('index.html', networkRes.clone());
            });
          }
          return networkRes;
        })
        .catch(async () => {
          // Offline fallback: Return cached HTML
          const cached = await matchCacheFlexible(event.request);
          if (cached) return cached;
          const indexHtml = await matchCacheFlexible('./index.html');
          if (indexHtml) return indexHtml;
          const root = await matchCacheFlexible('./');
          if (root) return root;
          const rootSlash = await matchCacheFlexible('/');
          if (rootSlash) return rootSlash;
          return new Response(
            '<!DOCTYPE html><html><head><meta charset="utf-8"><title>COG Bible Offline</title></head><body><h2>Offline</h2><p>Please reopen when installed.</p></body></html>',
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        })
    );
    return;
  }

  // 2. All Assets, JSON Data, Scripts, Styles & Images (Cache-First)
  event.respondWith(
    matchCacheFlexible(event.request).then(async (cachedResponse) => {
      if (cachedResponse) {
        // Guard against corrupted HTML fallbacks in JSON
        const ct = cachedResponse.headers.get('content-type') || '';
        if (requestUrl.endsWith('.json') && ct.includes('text/html')) {
          const cache = await caches.open(CACHE_NAME);
          await cache.delete(event.request);
        } else {
          return cachedResponse;
        }
      }

      // If not in cache, fetch from network and store in cache
      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const ct = networkResponse.headers.get('content-type') || '';
            if (!requestUrl.endsWith('.json') || !ct.includes('text/html')) {
              const copy = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, copy);
                try {
                  const decoded = decodeURIComponent(event.request.url);
                  if (decoded !== event.request.url) {
                    cache.put(decoded, networkResponse.clone());
                  }
                } catch {}
              });
            }
          }
          return networkResponse;
        })
        .catch(async () => {
          // Network failed (Offline): Last-chance flexible cache search
          const lastChance = await matchCacheFlexible(event.request);
          if (lastChance) return lastChance;

          if (requestUrl.endsWith('.json')) {
            return new Response('{}', {
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          return new Response('Asset not found offline', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
          });
        });
    })
  );
});

// Message Listener for explicit caching triggers from App
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_ALL_SCRIPTURES') {
    event.waitUntil(
      caches.open(CACHE_NAME).then(async (cache) => {
        let successCount = 0;
        for (const bookFile of DEFAULT_BOOK_FILES) {
          const urls = [
            `./data/${bookFile}`,
            `data/${bookFile}`,
            `./data/${encodeURIComponent(bookFile)}`
          ];
          for (const u of urls) {
            try {
              const res = await fetch(u);
              if (res && res.status === 200) {
                const ct = res.headers.get('content-type') || '';
                if (!ct.includes('text/html')) {
                  await cache.put(u, res.clone());
                  successCount++;
                  break;
                }
              }
            } catch {}
          }
        }
        if (event.source && event.source.postMessage) {
          event.source.postMessage({
            type: 'CACHE_ALL_SCRIPTURES_DONE',
            count: successCount
          });
        }
      })
    );
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  const book = data.book || 'Genesis';
  const chapter = data.chapter || 1;
  const verse = data.verse || 1;
  const targetUrl = `./#bible?book=${encodeURIComponent(book)}&chapter=${chapter}&verse=${verse}`;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.postMessage({
            type: 'NAVIGATE_TO_VERSE',
            book: book,
            chapter: chapter,
            verse: verse
          });
          if (client.navigate) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
