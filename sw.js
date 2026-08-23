const CACHE_NAME = 'cog-bible-v1.3.1';
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./logo.jpg",
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
  "./assets/index-C2thiYoU.js",
  "./assets/index-CFxgZ2MY.css"
];

// Install: Cache essential assets including the entire offline verses.json database
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Stale-While-Revalidate / Cache First for offline functionality
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return Response.error();
      });
    })
  );
});
