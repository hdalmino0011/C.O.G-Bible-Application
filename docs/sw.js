const CACHE_NAME = 'cog-bible-v2.0.0';
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
  "./assets/index-BT6AOpcB.js",
  "./assets/index-XeUWDAj5.css",
  "./assets/logo-Jne2Ro8f.png",
  "./assets/manifest-DkOziRcA.json"
];

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
