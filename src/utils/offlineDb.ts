/**
 * Offline Database Manager using IndexedDB
 * Stores all 66 Bible books persistently on the device for complete offline usage.
 */

import { BookChapters } from '../types';
import { BIBLE_BOOKS } from '../data/books';

const DB_NAME = 'COG_BIBLE_OFFLINE_DB';
const DB_VERSION = 1;
const STORE_NAME = 'scripture_books';
const CACHE_PREFIX = 'cog-bible-offline';
const FALLBACK_CACHE_NAME = 'cog-bible-offline-v7.0.0';
const KNOWN_BOOK_NAMES = new Set(BIBLE_BOOKS.map(book => book.name));

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not supported on this device'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'book' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open IndexedDB'));
  });
}

/** Accept only the chapter/verse shape used by the app. */
export function isValidBookChapters(data: unknown): data is BookChapters {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
  const chapters = Object.entries(data as Record<string, unknown>);
  if (chapters.length === 0) return false;

  return chapters.every(([, verses]) =>
    Array.isArray(verses) &&
    verses.length > 0 &&
    verses.every((verse) => {
      if (!verse || typeof verse !== 'object' || Array.isArray(verse)) return false;
      const item = verse as { v?: unknown; en?: unknown; ceb?: unknown };
      return Number.isInteger(item.v) && typeof item.en === 'string' && typeof item.ceb === 'string';
    })
  );
}

/** Retrieve a specific valid book from device storage. */
export async function getBookFromIndexedDB(bookName: string): Promise<BookChapters | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const request = transaction.objectStore(STORE_NAME).get(bookName);
      request.onsuccess = () => {
        const data = request.result?.data;
        resolve(isValidBookChapters(data) ? data : null);
      };
      request.onerror = () => resolve(null);
    });
  } catch (error) {
    console.warn('[IndexedDB] Could not read ' + bookName + ' from local storage:', error);
    return null;
  }
}

/** Save a valid book and wait for the IndexedDB transaction to commit. */
export async function saveBookToIndexedDB(bookName: string, data: BookChapters): Promise<boolean> {
  if (!KNOWN_BOOK_NAMES.has(bookName) || !isValidBookChapters(data)) return false;

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      transaction.objectStore(STORE_NAME).put({ book: bookName, data, updatedAt: Date.now() });
      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => resolve(false);
      transaction.onabort = () => resolve(false);
    });
  } catch (error) {
    console.warn('[IndexedDB] Could not save ' + bookName + ' to local storage:', error);
    return false;
  }
}

export async function getStoredBooksCountFromIndexedDB(): Promise<number> {
  return (await getValidStoredBookNames()) .size;
}

export async function getAllStoredBookNamesFromIndexedDB(): Promise<string[]> {
  return [...await getValidStoredBookNames()];
}

async function getValidStoredBookNames(): Promise<Set<string>> {
  try {
    const db = await openDB();
    return await new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const request = transaction.objectStore(STORE_NAME).getAll();
      request.onsuccess = () => {
        const names = new Set<string>();
        for (const row of request.result || []) {
          if (KNOWN_BOOK_NAMES.has(row?.book) && isValidBookChapters(row?.data)) names.add(row.book);
        }
        resolve(names);
      };
      request.onerror = () => resolve(new Set<string>());
    });
  } catch {
    return new Set<string>();
  }
}

async function getCachedBookNames(): Promise<Set<string>> {
  const names = new Set<string>();
  if (typeof caches === 'undefined') return names;

  try {
    const cacheNames = (await caches.keys()).filter(name => name.startsWith(CACHE_PREFIX));
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      for (const request of await cache.keys()) {
        try {
          const url = new URL(request.url);
          const fileName = decodeURIComponent(url.pathname.split('/').filter(Boolean).pop() || '');
          if (fileName.endsWith('.json')) {
            const bookName = fileName.slice(0, -5);
            if (KNOWN_BOOK_NAMES.has(bookName)) names.add(bookName);
          }
        } catch {
          // Ignore malformed cache keys.
        }
      }
    }
  } catch {
    // IndexedDB can still provide the complete package if Cache Storage is unavailable.
  }

  return names;
}

/** Verify that every book exists in at least one persistent offline store. */
export async function verifyAllBooksOffline(): Promise<{
  totalCount: number;
  presentCount: number;
  missingCount: number;
  missingBooks: string[];
}> {
  const [indexedBooks, cachedBooks] = await Promise.all([
    getValidStoredBookNames(),
    getCachedBookNames()
  ]);
  const available = new Set([...indexedBooks, ...cachedBooks]);
  const missingBooks = BIBLE_BOOKS.map(book => book.name).filter(name => !available.has(name));

  return {
    totalCount: BIBLE_BOOKS.length,
    presentCount: BIBLE_BOOKS.length - missingBooks.length,
    missingCount: missingBooks.length,
    missingBooks
  };
}

export const getOfflineStorageSummary = verifyAllBooksOffline;

/** Save multiple valid books in one transaction. */
export async function saveAllBooksToIndexedDB(booksData: Record<string, BookChapters>): Promise<number> {
  try {
    const db = await openDB();
    return await new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      let count = 0;
      for (const [bookName, data] of Object.entries(booksData)) {
        if (KNOWN_BOOK_NAMES.has(bookName) && isValidBookChapters(data)) {
          store.put({ book: bookName, data, updatedAt: Date.now() });
          count++;
        }
      }
      transaction.oncomplete = () => resolve(count);
      transaction.onerror = () => resolve(0);
      transaction.onabort = () => resolve(0);
    });
  } catch {
    return 0;
  }
}

export async function getStorageEstimate(): Promise<{ usageFormatted: string; quotaFormatted: string; percent: number }> {
  if (typeof navigator !== 'undefined' && navigator.storage?.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      const usageMB = ((estimate.usage || 0) / (1024 * 1024)).toFixed(1);
      const quotaMB = ((estimate.quota || 0) / (1024 * 1024)).toFixed(0);
      const percent = estimate.quota ? Math.round(((estimate.usage || 0) / estimate.quota) * 100) : 0;
      return { usageFormatted: usageMB + ' MB', quotaFormatted: quotaMB + ' MB', percent };
    } catch {
      // Fall through to a conservative display value.
    }
  }
  return { usageFormatted: '~10.5 MB', quotaFormatted: 'Device Storage', percent: 1 };
}

export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.storage?.persist) {
    try {
      return await navigator.storage.persist();
    } catch {
      return false;
    }
  }
  return false;
}

/** Save a valid book into every useful Cache Storage URL variant. */
export async function saveBookToCacheStorage(bookName: string, data: BookChapters): Promise<boolean> {
  if (typeof caches === 'undefined' || typeof Response === 'undefined') return false;
  if (!KNOWN_BOOK_NAMES.has(bookName) || !isValidBookChapters(data)) return false;

  try {
    const jsonStr = JSON.stringify(data);
    const cacheNames = await caches.keys();
    const targetCache = cacheNames.find(name => name.startsWith(CACHE_PREFIX)) || FALLBACK_CACHE_NAME;
    const cache = await caches.open(targetCache);
    const encoded = encodeURIComponent(bookName);
    const urls = [...new Set([
      './data/' + bookName + '.json',
      'data/' + bookName + '.json',
      './data/' + encoded + '.json',
      'data/' + encoded + '.json'
    ])];
    await Promise.all(urls.map(url => cache.put(url, new Response(jsonStr, {
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    }))));
    return true;
  } catch (error) {
    console.warn('[CacheStorage] Error saving book:', bookName, error);
    return false;
  }
}
