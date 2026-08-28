const CACHE_NAME = 'cog-bible-v4.0.0';
const STATIC_ASSETS = typeof [
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
  "./assets/1 Chronicles-D-7z0MLn.js",
  "./assets/1 Corinthians--VZi7Lnm.js",
  "./assets/1 John-Cb6nfyrL.js",
  "./assets/1 Kings-BF1fMdIk.js",
  "./assets/1 Peter-UZWpHfyB.js",
  "./assets/1 Samuel-B2j-O4wl.js",
  "./assets/1 Thessalonians-3cCQCCZ4.js",
  "./assets/1 Timothy-BOLRhqE0.js",
  "./assets/2 Chronicles-Bx63pjXy.js",
  "./assets/2 Corinthians-DYdpXpxx.js",
  "./assets/2 John-e4mN4zVB.js",
  "./assets/2 Kings-DwY2DTrr.js",
  "./assets/2 Peter-D5YqUjal.js",
  "./assets/2 Samuel-CzP2YOWb.js",
  "./assets/2 Thessalonians-BiblXsQI.js",
  "./assets/2 Timothy-C-SpXJl-.js",
  "./assets/3 John-BiFApTLD.js",
  "./assets/Acts-Bk8ZZNJP.js",
  "./assets/Amos-BoZbqgvb.js",
  "./assets/Colossians-CtykPyip.js",
  "./assets/Daniel-r5oeLfvn.js",
  "./assets/Deuteronomy-BPbcIIpQ.js",
  "./assets/Ecclesiastes-m_KEROEy.js",
  "./assets/Ephesians-DsEcZkdK.js",
  "./assets/Esther-DQy8KOVH.js",
  "./assets/Exodus-C4Gji8fH.js",
  "./assets/Ezekiel-CaW4La83.js",
  "./assets/Ezra-BKn_Fh_8.js",
  "./assets/Galatians-CS_Y3pVB.js",
  "./assets/Genesis-vJhox-co.js",
  "./assets/Habakkuk-B0c5DXTT.js",
  "./assets/Haggai-BP-trmey.js",
  "./assets/Hebrews-yKlb9rhd.js",
  "./assets/Hosea-Dpm85LRz.js",
  "./assets/Isaiah-CKjJxVdd.js",
  "./assets/James-X_yd3_Gn.js",
  "./assets/Jeremiah-y2VSH0lD.js",
  "./assets/Job-BfhQWRBK.js",
  "./assets/Joel-oSKgxtbt.js",
  "./assets/John-DDNWdEBg.js",
  "./assets/Jonah-BR7P43p3.js",
  "./assets/Joshua-D1rHKgrR.js",
  "./assets/Jude-vCjI-H6E.js",
  "./assets/Judges-fZp02Ald.js",
  "./assets/Lamentations-DPc_JQIe.js",
  "./assets/Leviticus-DEXzA5Mp.js",
  "./assets/Luke-B8PHXK0d.js",
  "./assets/Malachi-C0kbl5mr.js",
  "./assets/Mark-D_7b83-q.js",
  "./assets/Matthew-pAhBcV9C.js",
  "./assets/Micah-CQoMvF8D.js",
  "./assets/Nahum-1WnX4vkQ.js",
  "./assets/Nehemiah-DIMybACa.js",
  "./assets/Numbers-D1DHXtfM.js",
  "./assets/Obadiah-z0Lwlwib.js",
  "./assets/Philemon-5USrcYcM.js",
  "./assets/Philippians-2OGshWMx.js",
  "./assets/Proverbs-Yq34PTaa.js",
  "./assets/Psalms-CW53BlmH.js",
  "./assets/Revelation-Dm6TdO__.js",
  "./assets/Romans-DfVyWyxV.js",
  "./assets/Ruth-JodS5lP8.js",
  "./assets/Song of Solomon-Ypoz6XF1.js",
  "./assets/Titus-4yRFAR9C.js",
  "./assets/Zechariah-CoYWbSia.js",
  "./assets/Zephaniah-DmEogkA8.js",
  "./assets/index-DGsDG53v.js",
  "./assets/index-DZ6VLWLG.css"
] !== 'undefined' ? __PRECACHE_ASSETS_LIST__ : [];

// Install: Cache essential assets, including the offline Bible database
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        if (Array.isArray(STATIC_ASSETS) && STATIC_ASSETS.length > 0) {
          await Promise.allSettled(
            STATIC_ASSETS.map((url) =>
              fetch(url)
                .then((res) => {
                  if (res && res.status === 200) {
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

// Activate: Purge all older and stale caches immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
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
          if (cached && cached.status === 200) return cached;
          const indexHtml = await caches.match('./index.html');
          if (indexHtml && indexHtml.status === 200) return indexHtml;
          const rootCached = await caches.match('./');
          if (rootCached && rootCached.status === 200) return rootCached;
          return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
        })
    );
    return;
  }

  // Assets and Bible data files: Cache first (only if valid 200 OK), fallback to network
  event.respondWith(
    caches.match(event.request).then(async (cachedResponse) => {
      if (cachedResponse) {
        // If not 200 OK, delete corrupted cache entry
        if (cachedResponse.status !== 200) {
          const cache = await caches.open(CACHE_NAME);
          await cache.delete(event.request);
        } else if (event.request.url.includes('/data/') && event.request.url.endsWith('.json')) {
          const ct = cachedResponse.headers.get('content-type') || '';
          if (ct.includes('text/html')) {
            // Bad cached response (HTML fallback), delete it and fetch from network
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

