const CACHE_NAME = 'cog-bible-v2.0.0';
const STATIC_ASSETS = __PRECACHE_ASSETS_LIST__;

// Install: Cache essential assets, including the offline Bible database
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        if (Array.isArray(STATIC_ASSETS)) {
          await Promise.allSettled(
            STATIC_ASSETS.map((url) =>
              cache.add(url).catch((err) => console.warn('Precache skip:', url, err))
            )
          );
        }
      })
      .then(() => self.skipWaiting())
  );
});

// Activate: Remove caches from older app versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch: Network-first for navigation, Cache-first with network fallback for assets/data
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // HTML page navigation: Try network first to get latest updates, fallback to offline cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          const indexHtml = await caches.match('./index.html');
          if (indexHtml) return indexHtml;
          const rootCached = await caches.match('./');
          return rootCached || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
        })
    );
    return;
  }

  // Assets and Bible data files: Cache first, fallback to network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          return new Response('', { status: 408, statusText: 'Offline or asset not cached' });
        });
    })
  );
});
