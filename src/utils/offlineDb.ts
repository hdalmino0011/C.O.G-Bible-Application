/**
 * Offline Database Manager using IndexedDB
 * Stores all 66 Bible books persistently on the device storage for complete offline usage.
 */

import { BookChapters } from '../types';
import { BIBLE_BOOKS } from '../data/books';

const DB_NAME = 'COG_BIBLE_OFFLINE_DB';
const DB_VERSION = 1;
const STORE_NAME = 'scripture_books';

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

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open IndexedDB'));
    };
  });
}

/**
 * Retrieve a specific book from device storage
 */
export async function getBookFromIndexedDB(bookName: string): Promise<BookChapters | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(bookName);

      request.onsuccess = () => {
        if (request.result && request.result.data) {
          resolve(request.result.data);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        resolve(null);
      };
    });
  } catch (error) {
    console.warn(`[IndexedDB] Could not read ${bookName} from local storage:`, error);
    return null;
  }
}

/**
 * Save a specific book to device storage
 */
export async function saveBookToIndexedDB(bookName: string, data: BookChapters): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({
        book: bookName,
        data,
        updatedAt: Date.now()
      });

      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  } catch (error) {
    console.warn(`[IndexedDB] Could not save ${bookName} to local storage:`, error);
    return false;
  }
}

/**
 * Get count of all book names currently stored on the device
 */
export async function getStoredBooksCountFromIndexedDB(): Promise<number> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.count();

      request.onsuccess = () => {
        resolve(request.result || 0);
      };

      request.onerror = () => {
        resolve(0);
      };
    });
  } catch {
    return 0;
  }
}

/**
 * Get all stored book names
 */
export async function getAllStoredBookNamesFromIndexedDB(): Promise<string[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAllKeys();

      request.onsuccess = () => {
        resolve((request.result as string[]) || []);
      };

      request.onerror = () => {
        resolve([]);
      };
    });
  } catch {
    return [];
  }
}

/**
 * Verify that all 66 books are present in IndexedDB
 */
export async function verifyAllBooksOffline(): Promise<{
  totalCount: number;
  presentCount: number;
  missingCount: number;
  missingBooks: string[];
}> {
  const stored = new Set(await getAllStoredBookNamesFromIndexedDB());
  const missingBooks = BIBLE_BOOKS.map(b => b.name).filter(name => !stored.has(name));
  return {
    totalCount: BIBLE_BOOKS.length,
    presentCount: stored.size,
    missingCount: missingBooks.length,
    missingBooks
  };
}

/**
 * Save multiple books to IndexedDB in a single batch
 */
export async function saveAllBooksToIndexedDB(booksData: Record<string, BookChapters>): Promise<number> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      let count = 0;

      for (const [bookName, data] of Object.entries(booksData)) {
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          store.put({
            book: bookName,
            data,
            updatedAt: Date.now()
          });
          count++;
        }
      }

      transaction.oncomplete = () => resolve(count);
      transaction.onerror = () => resolve(count);
    });
  } catch {
    return 0;
  }
}

/**
 * Estimate storage space used on device
 */
export async function getStorageEstimate(): Promise<{ usageFormatted: string; quotaFormatted: string; percent: number }> {
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      const usageMB = ((estimate.usage || 0) / (1024 * 1024)).toFixed(1);
      const quotaMB = ((estimate.quota || 0) / (1024 * 1024)).toFixed(0);
      const percent = estimate.quota ? Math.round(((estimate.usage || 0) / estimate.quota) * 100) : 0;
      return {
        usageFormatted: `${usageMB} MB`,
        quotaFormatted: `${quotaMB} MB`,
        percent
      };
    } catch {
      // Fallback
    }
  }
  return {
    usageFormatted: '~10.5 MB',
    quotaFormatted: 'Device Storage',
    percent: 1
  };
}
