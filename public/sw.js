const CACHE_NAME = 'cog-bible-offline-v5.0.0';
const STATIC_ASSETS = typeof __PRECACHE_ASSETS_LIST__ !== 'undefined' && Array.isArray(__PRECACHE_ASSETS_LIST__)
  ? __PRECACHE_ASSETS_LIST__
  : [];

// Install: Pre-cache all essential application assets and Bible database packages
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      if (Array.isArray(STATIC_ASSETS) && STATIC_ASSETS.length > 0) {
        // Cache assets with fault tolerance (settled)
        await Promise.allSettled(
          STATIC_ASSETS.map(async (url) => {
            try {
              const res = await fetch(url, { cache: 'no-cache' });
              if (res && res.status === 200) {
                const ct = res.headers.get('content-type') || '';
                // Don't cache HTML fallback as JSON data
                if (url.endsWith('.json') && ct.includes('text/html')) {
                  return;
                }
                await cache.put(url, res.clone());

                // Also store with normalized / decoded URL if it has special characters or spaces
                const decoded = decodeURIComponent(url);
                if (decoded !== url) {
                  await cache.put(decoded, res);
                }
              }
            } catch (err) {
              console.warn('[SW] Precache skip for asset:', url, err);
            }
          })
        );
      }
    })
  );
});

// Activate: Purge older cache versions and take immediate control of clients
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

// Helper to look up a request in cache across URL variants (encoded, decoded, relative path)
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

  // 3. Match by filename / suffix (e.g. "Genesis.json" or "data/Genesis.json")
  try {
    const parsed = new URL(urlStr, self.location.origin);
    const pathname = parsed.pathname;
    const allKeys = await cache.keys();
    for (const key of allKeys) {
      const keyParsed = new URL(key.url, self.location.origin);
      if (keyParsed.pathname === pathname || decodeURIComponent(keyParsed.pathname) === decodeURIComponent(pathname)) {
        const item = await cache.match(key);
        if (item && item.status === 200) return item;
      }
    }
  } catch {}

  return null;
}

// Fetch handler: Network-first for navigation, Cache-first for data & assets
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = event.request.url;

  // 1. Navigation requests (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const copy = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkRes;
        })
        .catch(async () => {
          const cached = await matchCacheFlexible(event.request);
          if (cached) return cached;
          const indexHtml = await matchCacheFlexible('./index.html');
          if (indexHtml) return indexHtml;
          const root = await matchCacheFlexible('./');
          if (root) return root;
          return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
        })
    );
    return;
  }

  // 2. Bible Data JSON & Static Assets (Cache-First with network fallback)
  event.respondWith(
    matchCacheFlexible(event.request).then(async (cachedResponse) => {
      if (cachedResponse) {
        // Validate it's not a corrupted HTML fallback
        const ct = cachedResponse.headers.get('content-type') || '';
        if (requestUrl.endsWith('.json') && ct.includes('text/html')) {
          const cache = await caches.open(CACHE_NAME);
          await cache.delete(event.request);
        } else {
          return cachedResponse;
        }
      }

      // Fetch from network and store in cache
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
        .catch(() => {
          return new Response('{}', {
            status: 404,
            headers: { 'Content-Type': requestUrl.endsWith('.json') ? 'application/json' : 'text/plain' }
          });
        });
    })
  );
});

// Client Message Listener
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Notification click event: focus app window and navigate to the bible verse
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


