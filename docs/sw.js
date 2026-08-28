const CACHE_NAME = 'cog-bible-v3.2.0';
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./app-icon-192.png",
  "./app-icon.png",
  "./app-icon-maskable.png",
  "./manifest.json",
  "./data/1 Chronicles.json",
  "./data/1 Corinthians.json",
  "./data/1 John.json",
  "./data/1 Kings.json",
  "./data/1 Peter.json",
  "./data/1 Samuel.json",
  "./data/1 Thessalonians.json",
  "./data/1 Timothy.json",
  "./data/2 Chronicles.json",
  "./data/2 Corinthians.json",
  "./data/2 John.json",
  "./data/2 Kings.json",
  "./data/2 Peter.json",
  "./data/2 Samuel.json",
  "./data/2 Thessalonians.json",
  "./data/2 Timothy.json",
  "./data/3 John.json",
  "./data/Acts.json",
  "./data/Amos.json",
  "./data/Colossians.json",
  "./data/Daniel.json",
  "./data/Deuteronomy.json",
  "./data/Ecclesiastes.json",
  "./data/Ephesians.json",
  "./data/Esther.json",
  "./data/Exodus.json",
  "./data/Ezekiel.json",
  "./data/Ezra.json",
  "./data/Galatians.json",
  "./data/Genesis.json",
  "./data/Habakkuk.json",
  "./data/Haggai.json",
  "./data/Hebrews.json",
  "./data/Hosea.json",
  "./data/Isaiah.json",
  "./data/James.json",
  "./data/Jeremiah.json",
  "./data/Job.json",
  "./data/Joel.json",
  "./data/John.json",
  "./data/Jonah.json",
  "./data/Joshua.json",
  "./data/Jude.json",
  "./data/Judges.json",
  "./data/Lamentations.json",
  "./data/Leviticus.json",
  "./data/Luke.json",
  "./data/Malachi.json",
  "./data/Mark.json",
  "./data/Matthew.json",
  "./data/Micah.json",
  "./data/Nahum.json",
  "./data/Nehemiah.json",
  "./data/Numbers.json",
  "./data/Obadiah.json",
  "./data/Philemon.json",
  "./data/Philippians.json",
  "./data/Proverbs.json",
  "./data/Psalms.json",
  "./data/Revelation.json",
  "./data/Romans.json",
  "./data/Ruth.json",
  "./data/Song of Solomon.json",
  "./data/Titus.json",
  "./data/Zechariah.json",
  "./data/Zephaniah.json",
  "./assets/index-B6YQT-q0.js",
  "./assets/index-Cv-CeVXg.css"
];

// Install: Cache essential assets, including the offline Bible database
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        if (Array.isArray(STATIC_ASSETS)) {
          await Promise.allSettled(
            STATIC_ASSETS.map((url) =>
              fetch(url)
                .then((res) => {
                  if (res.ok) {
                    const ct = res.headers.get('content-type') || '';
                    if (url.endsWith('.json') && ct.includes('text/html')) {
                      return; // Do not cache HTML fallbacks as JSON
                    }
                    return cache.put(url, res);
                  }
                })
                .catch((err) => console.warn('Precache skip:', url, err))
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
    caches.match(event.request).then(async (cachedResponse) => {
      if (cachedResponse) {
        // If it's a JSON data request, verify it's not a corrupted/HTML cached response
        if (event.request.url.includes('/data/') && event.request.url.endsWith('.json')) {
          const ct = cachedResponse.headers.get('content-type') || '';
          if (ct.includes('text/html')) {
            // Bad cached response, delete it and fetch from network
            const cache = await caches.open(CACHE_NAME);
            await cache.delete(event.request);
          } else {
            return cachedResponse;
          }
        } else {
          return cachedResponse;
        }
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const ct = networkResponse.headers.get('content-type') || '';
            // Only cache valid non-HTML responses for JSON data
            if (!event.request.url.endsWith('.json') || !ct.includes('text/html')) {
              const copy = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            }
          }
          return networkResponse;
        })
        .catch(() => {
          return new Response('', { status: 408, statusText: 'Offline or asset not cached' });
        });
    })
  );
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

