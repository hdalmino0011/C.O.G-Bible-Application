/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Splash } from './components/Splash';
import { Header } from './components/Header';
import { BibleReader } from './components/BibleReader';
import { QuizScreen } from './components/QuizScreen';
import { DictionaryScreen } from './components/DictionaryScreen';
import { SavedScreen } from './components/SavedScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { BottomNav } from './components/BottomNav';
import { VerseToolbar } from './components/VerseToolbar';
import { NoteModal } from './components/NoteModal';
import { SearchModal } from './components/SearchModal';

import {
  BibleData,
  BookChapters,
  HighlightColor,
  NoteItem,
  QuizStats,
  ReadingLayout,
  SavedHighlight,
  ScreenType,
  UserPreferences,
  VerseItem
} from './types';

import {
  getLastReadPosition,
  getStoredBookmarks,
  getStoredHighlights,
  getStoredNotes,
  getStoredPreferences,
  getStoredQuizStats,
  removeStoredBookmark,
  removeStoredHighlight,
  removeStoredNote,
  saveLastReadPosition,
  saveStoredBookmark,
  saveStoredHighlight,
  saveStoredNote,
  saveStoredPreferences,
  saveStoredQuizStats
} from './utils/storage';

import {
  getBookFromIndexedDB,
  saveBookToIndexedDB,
  getOfflineStorageSummary,
  verifyAllBooksOffline,
  isValidBookChapters,
  requestPersistentStorage,
  saveBookToCacheStorage
} from './utils/offlineDb';

import { BIBLE_BOOKS, normalizeBookName } from './data/books';
import { BOOK_LOADERS } from './data/bookModules';
import { getRandomDailyVerse } from './data/dailyVerses';
import { sendDailyVerseNotification } from './utils/notifications';
import { OfflinePackageModal } from './components/OfflinePackageModal';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [bibleData, setBibleData] = useState<BibleData>({});
  const [isLoadingBible, setIsLoadingBible] = useState(true);

  // Navigation & Reading State
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('bible');
  const [currentBook, setCurrentBook] = useState<string>('Genesis');
  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [targetVerseToScroll, setTargetVerseToScroll] = useState<number | null>(null);

  // Reading layout and preferences
  const [preferences, setPreferences] = useState<UserPreferences>(getStoredPreferences);
  const [readingLayout, setReadingLayout] = useState<ReadingLayout>(getStoredPreferences().readingLayout || 'parallel');

  // User Saved Data
  const [highlights, setHighlights] = useState<Record<string, SavedHighlight>>(getStoredHighlights);
  const [bookmarks, setBookmarks] = useState<Array<{ id: string; book: string; chapter: number; verse?: number; title: string; timestamp: number }>>(getStoredBookmarks);
  const [notes, setNotes] = useState<NoteItem[]>(getStoredNotes);
  const [quizStats, setQuizStats] = useState<QuizStats>(getStoredQuizStats);

  // Selected Verse & Modals
  const [selectedVerse, setSelectedVerse] = useState<{
    book: string;
    chapter: number;
    verse: number;
    verseData: VerseItem;
  } | null>(null);

  const [activeNoteVerse, setActiveNoteVerse] = useState<number | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Speech TTS state
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 2800);
  }, []);

  // Offline Package Modal & Downloader State
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [isDownloadingPackage, setIsDownloadingPackage] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<{ current: number; total: number; currentBook: string }>({
    current: 0,
    total: BIBLE_BOOKS.length,
    currentBook: ''
  });
  const [isFullyDownloaded, setIsFullyDownloaded] = useState(false);
  const [failedDownloadBooks, setFailedDownloadBooks] = useState<string[]>([]);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  // Helper to construct candidate asset URLs regardless of deployment subdirectory
  const getBookCandidateUrls = (name: string) => {
    const encoded = encodeURIComponent(name);
    const urls: string[] = [];

    if (typeof window !== 'undefined') {
      try {
        const baseHref = document.baseURI || window.location.href;
        const resolved = new URL(`data/${encoded}.json`, baseHref).href;
        urls.push(resolved);
      } catch {
        // Fallback
      }

      const pathname = window.location.pathname;
      const dir = pathname.substring(0, pathname.lastIndexOf('/') + 1) || '/';
      urls.push(`${window.location.origin}${dir}data/${encoded}.json`);
    }

    const base = import.meta.env.BASE_URL || './';
    const prefix = base.endsWith('/') ? base : `${base}/`;
    urls.push(`${prefix}data/${encoded}.json`);
    urls.push(`./data/${encoded}.json`);
    urls.push(`data/${encoded}.json`);

    return Array.from(new Set(urls));
  };

  // Multi-tiered ultra-reliable book loader:
  // 1. In-memory state cache
  // 2. Local IndexedDB on device disk (0ms offline persistence)
  // 3. Bundled ES module chunk (100% offline self-contained package)
  // 4. Candidate static asset URLs (Cache-First / Service Worker)
  const loadSingleBook = useCallback(async (bookName: string): Promise<BookChapters | null> => {
    if (!bookName) return null;

    // 1. Check local IndexedDB phone storage first
    try {
      const dbContent = await getBookFromIndexedDB(bookName);
      if (isValidBookChapters(dbContent)) {
        setBibleData(prev => ({ ...prev, [bookName]: dbContent }));
        return dbContent;
      }
    } catch {
      // Continue to bundled loader
    }

    // 2. Load from compiled offline ES module package
    if (BOOK_LOADERS[bookName]) {
      try {
        const mod = await BOOK_LOADERS[bookName]();
        const content = (mod && (mod.default || mod)) as BookChapters;
        if (isValidBookChapters(content)) {
          setBibleData(prev => ({ ...prev, [bookName]: content }));
          saveBookToIndexedDB(bookName, content).catch(() => {});
          saveBookToCacheStorage(bookName, content).catch(() => {});
          return content;
        }
      } catch (modErr) {
        console.warn(`[Module Loader] Fallback to asset URL for ${bookName}:`, modErr);
      }
    }

    // 3. Fetch from candidate asset URLs (Service Worker Cache / Network)
    const urls = getBookCandidateUrls(bookName);

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      try {
        let res = await fetch(url);
        if (!res.ok) continue;

        let rawText = await res.text();
        let trimmed = rawText.trim();

        // If returned HTML (e.g. 404/SPA index.html fallback), retry with cache-busting
        if (trimmed.startsWith('<') || !trimmed.startsWith('{')) {
          const freshRes = await fetch(`${url}?t=${Date.now()}`, { cache: 'no-store' });
          if (!freshRes.ok) continue;
          rawText = await freshRes.text();
          trimmed = rawText.trim();
        }

        if (!trimmed.startsWith('{')) continue;

        let bookContent = JSON.parse(trimmed) as BookChapters;
        if (isValidBookChapters(bookContent)) {
          setBibleData(prev => ({ ...prev, [bookName]: bookContent }));
          // Persist in phone IndexedDB & CacheStorage so it's permanently stored on device
          saveBookToIndexedDB(bookName, bookContent).catch(() => {});
          saveBookToCacheStorage(bookName, bookContent).catch(() => {});
          return bookContent;
        }
      } catch {
        // Try next candidate URL
      }
    }

    return null;
  }, []);

  // 1. Initial startup: Load active book immediately, check offline package status, and prompt user if needed
  useEffect(() => {
    let isCancelled = false;

    async function initializeScriptures() {
      const last = getLastReadPosition();
      const initialBookName = last?.book && BIBLE_BOOKS.some(b => b.name === last.book) ? last.book : 'Genesis';
      const initialChapterNum = last?.chapter || 1;

      if (last?.book) {
        setCurrentBook(initialBookName);
        setCurrentChapter(initialChapterNum);
      }

      // Step 1: Load the active book right away from local DB or bundled modules
      await loadSingleBook(initialBookName);
      if (!isCancelled) {
        setIsLoadingBible(false);
      }

      // Step 2: Check offline storage status
      try {
        const summary = await getOfflineStorageSummary();
        if (!isCancelled) {
          setDownloadProgress({
            current: summary.presentCount,
            total: summary.totalCount,
            currentBook: ''
          });
          const allStored = summary.presentCount === summary.totalCount;
          setIsFullyDownloaded(allStored);

          // If not all books are in local storage, pop up modal on landing page after splash
          let hasPrompted = false;
          try {
            hasPrompted = sessionStorage.getItem('cog_offline_prompted') === 'true';
          } catch {
            // Continue without session storage in privacy-restricted browsers.
          }
          if (!allStored && !hasPrompted) {
            try {
              sessionStorage.setItem('cog_offline_prompted', 'true');
            } catch {
              // The prompt should still appear when session storage is unavailable.
            }
            // Give brief moment for smooth splash transition
            setTimeout(() => {
              if (!isCancelled) {
                setIsOfflineModalOpen(true);
              }
            }, 1200);
          }
        }
      } catch (err) {
        console.warn('Storage check warning:', err);
      }
    }

    initializeScriptures();

    return () => {
      isCancelled = true;
    };
  }, [loadSingleBook]);

  // Dedicated one-tap Offline Package Downloader
  const handleDownloadFullPackage = useCallback(async () => {
    setIsDownloadingPackage(true);
    setDownloadError(null);
    setFailedDownloadBooks([]);
    setIsFullyDownloaded(false);
    setDownloadProgress({ current: 0, total: BIBLE_BOOKS.length, currentBook: '' });
    localStorage.removeItem('cog_offline_package_installed');

    const downloadedBibleData: BibleData = {};

    try {
      await requestPersistentStorage();

      // Let the service worker finish activating before asking it to warm its cache.
      if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
        try {
          const registration = await Promise.race([
            navigator.serviceWorker.ready,
            new Promise<ServiceWorkerRegistration | null>(resolve => setTimeout(() => resolve(null), 1500))
          ]);
          const worker = registration?.active || navigator.serviceWorker.controller;
          worker?.postMessage({ type: 'CACHE_ALL_SCRIPTURES' });
        } catch {
          // IndexedDB and bundled modules remain valid offline storage fallbacks.
        }
      }

      for (let i = 0; i < BIBLE_BOOKS.length; i++) {
        const book = BIBLE_BOOKS[i];
        setDownloadProgress({ current: i, total: BIBLE_BOOKS.length, currentBook: book.name });

        let content: BookChapters | null = null;
        for (let attempt = 0; attempt < 3 && !content; attempt++) {
          try {
            content = await loadSingleBook(book.name);
          } catch {
            content = null;
          }
          if (!content && attempt < 2) {
            await new Promise(resolve => setTimeout(resolve, 150 * (attempt + 1)));
          }
        }

        if (content && isValidBookChapters(content)) {
          downloadedBibleData[book.name] = content;
          const indexedDbSaved = await saveBookToIndexedDB(book.name, content);
          const cacheSaved = await saveBookToCacheStorage(book.name, content);
          if (!indexedDbSaved && !cacheSaved) {
            console.warn('[Offline Package] No persistent store accepted ' + book.name);
          }
        }

        setDownloadProgress({ current: i + 1, total: BIBLE_BOOKS.length, currentBook: book.name });
        // Yield to keep the progress UI responsive on phones.
        await new Promise(resolve => setTimeout(resolve, 20));
      }

      setBibleData(prev => ({ ...prev, ...downloadedBibleData }));

      // Never claim success based on loop iterations; verify every named book in storage.
      const summary = await verifyAllBooksOffline();
      setDownloadProgress({ current: BIBLE_BOOKS.length, total: BIBLE_BOOKS.length, currentBook: '' });
      setFailedDownloadBooks(summary.missingBooks);

      if (summary.missingCount === 0) {
        localStorage.setItem('cog_offline_package_installed', 'true');
        localStorage.setItem('cog_offline_installed_date', new Date().toISOString());
        setIsFullyDownloaded(true);
        showToast('All 66 books are saved for offline use.');
      } else {
        localStorage.removeItem('cog_offline_package_installed');
        setDownloadError(summary.missingCount + ' book' + (summary.missingCount === 1 ? ' is' : 's are') + ' still missing. Please retry.');
        showToast('Offline package incomplete: ' + summary.missingCount + ' book' + (summary.missingCount === 1 ? '' : 's') + ' need' + (summary.missingCount === 1 ? 's' : '') + ' another try.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected download error';
      setIsFullyDownloaded(false);
      setDownloadError('The offline package could not finish: ' + message);
      showToast('Offline download stopped. Please retry.');
    } finally {
      setIsDownloadingPackage(false);
    }
  }, [loadSingleBook, showToast, verifyAllBooksOffline]);

  // 2. Apply theme & font classes to document body
  useEffect(() => {
    const body = document.body;
    body.className = `theme-${preferences.theme} font-${preferences.font} size-${preferences.fontSize}`;
    if (preferences.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [preferences]);

  // 3. Save last read position whenever book or chapter changes
  useEffect(() => {
    if (currentBook && currentChapter) {
      saveLastReadPosition(currentBook, currentChapter);
    }
  }, [currentBook, currentChapter]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setSelectedVerse(null);
        setActiveNoteVerse(null);
        setIsSearchOpen(false);
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Bookmarks and Notes sets for fast lookup
  const currentChapterBookmarks = new Set(
    bookmarks
      .filter(b => b.book === currentBook && b.chapter === currentChapter && b.verse)
      .map(b => b.verse as number)
  );

  const currentChapterNotes = new Set(
    notes
      .filter(n => n.book === currentBook && n.chapter === currentChapter)
      .map(n => n.verse)
  );

  // Handlers for reading navigation
  const handleBookChange = (book: string) => {
    setCurrentBook(book);
    setCurrentChapter(1);
    setSelectedVerse(null);
    setTargetVerseToScroll(null);
    if (!bibleData[book]) {
      loadSingleBook(book);
    }
  };

  const handleChapterChange = (chapter: number) => {
    setCurrentChapter(chapter);
    setSelectedVerse(null);
    setTargetVerseToScroll(null);
  };

  const handleNavigateToVerse = (bookName: string, chapter: number, verse?: number) => {
    const matchedBook = normalizeBookName(bookName) || bookName;
    setCurrentBook(matchedBook);
    setCurrentChapter(chapter);
    if (verse) {
      setTargetVerseToScroll(verse);
    }
    if (!bibleData[matchedBook]) {
      loadSingleBook(matchedBook);
    }
    setCurrentScreen('bible');
    setSelectedVerse(null);
    showToast(`Opened ${matchedBook} ${chapter}${verse ? `:${verse}` : ''}`);
  };

  const handleNavigateFromRefString = (refString: string) => {
    const match = refString.match(/^(\d?\s*[a-zA-ZÀ-ÿ\s-]+?)\s+(\d+)(?::(\d+))?/i);
    if (!match) {
      showToast(`Cannot parse reference "${refString}"`);
      return;
    }
    const bookName = match[1].trim();
    const chapter = parseInt(match[2], 10);
    const verse = match[3] ? parseInt(match[3], 10) : undefined;
    handleNavigateToVerse(bookName, chapter, verse);
  };

  // Notification routing listeners
  useEffect(() => {
    const parseAndRouteHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const match = hash.match(/book=([^&]+)(?:&chapter=(\d+))?(?:&verse=(\d+))?/i);
      if (match) {
        const book = decodeURIComponent(match[1]);
        const chapter = match[2] ? parseInt(match[2], 10) : 1;
        const verse = match[3] ? parseInt(match[3], 10) : undefined;
        handleNavigateToVerse(book, chapter, verse);
      }
    };

    parseAndRouteHash();
    window.addEventListener('hashchange', parseAndRouteHash);

    const handleCustomNav = (e: Event) => {
      const customEvent = e as CustomEvent<{ book: string; chapter: number; verse?: number }>;
      if (customEvent.detail) {
        const { book, chapter, verse } = customEvent.detail;
        handleNavigateToVerse(book, chapter, verse);
      }
    };
    window.addEventListener('cog-navigate-verse', handleCustomNav);

    const handleSWMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'NAVIGATE_TO_VERSE') {
        const { book, chapter, verse } = event.data;
        handleNavigateToVerse(book, chapter, verse);
      }
    };
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleSWMessage);
    }

    return () => {
      window.removeEventListener('hashchange', parseAndRouteHash);
      window.removeEventListener('cog-navigate-verse', handleCustomNav);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleSWMessage);
      }
    };
  }, []);

  // Daily notification scheduled trigger
  useEffect(() => {
    if (!preferences.dailyVerseNotification || typeof window === 'undefined') return;

    const checkAndTriggerDailyVerse = () => {
      try {
        const lastSentKey = 'cog_daily_verse_last_date';
        const todayStr = new Date().toDateString();
        const lastSentDate = localStorage.getItem(lastSentKey);

        if (lastSentDate !== todayStr && 'Notification' in window && Notification.permission === 'granted') {
          const verse = getRandomDailyVerse(bibleData);
          sendDailyVerseNotification(verse, `📖 Daily Verse: ${verse.book} ${verse.chapter}:${verse.verse}`).then(sent => {
            if (sent) {
              localStorage.setItem(lastSentKey, todayStr);
            }
          });
        }
      } catch (err) {
        console.error('Error checking daily verse notification', err);
      }
    };

    const initialTimer = setTimeout(checkAndTriggerDailyVerse, 4000);
    const intervalTimer = setInterval(checkAndTriggerDailyVerse, 60000 * 30);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [preferences.dailyVerseNotification, preferences.notificationTime, bibleData]);

  // Preference updates
  const handleUpdatePreferences = (updated: Partial<UserPreferences>) => {
    const newPrefs = { ...preferences, ...updated };
    setPreferences(newPrefs);
    saveStoredPreferences(newPrefs);
  };

  const handleLayoutChange = (layout: ReadingLayout) => {
    setReadingLayout(layout);
    handleUpdatePreferences({ readingLayout: layout });
  };

  // Highlight actions
  const handleApplyHighlight = (color: HighlightColor | 'none') => {
    if (!selectedVerse) return;

    if (color === 'none') {
      removeStoredHighlight(selectedVerse.book, selectedVerse.chapter, selectedVerse.verse);
      setHighlights(getStoredHighlights());
      showToast('Highlight removed');
    } else {
      const item: SavedHighlight = {
        id: `${selectedVerse.book}_${selectedVerse.chapter}_${selectedVerse.verse}`,
        book: selectedVerse.book,
        chapter: selectedVerse.chapter,
        verse: selectedVerse.verse,
        color,
        timestamp: Date.now(),
        cebText: selectedVerse.verseData.ceb,
        enText: selectedVerse.verseData.en
      };
      saveStoredHighlight(item);
      setHighlights(getStoredHighlights());
      showToast(`Highlighted in ${color}`);
    }
    setSelectedVerse(null);
  };

  // Copy actions
  const handleCopyVerse = (mode: 'cebuano' | 'english' | 'both') => {
    if (!selectedVerse) return;

    const ref = `${selectedVerse.book} ${selectedVerse.chapter}:${selectedVerse.verse}`;
    let text = '';

    if (mode === 'cebuano') {
      text = `${ref} (Cebuano - Bugna)\n${selectedVerse.verseData.ceb}`;
    } else if (mode === 'english') {
      text = `${ref} (English - KJV)\n${selectedVerse.verseData.en}`;
    } else {
      text = `${ref}\n\n[Cebuano]\n${selectedVerse.verseData.ceb}\n\n[English]\n${selectedVerse.verseData.en}`;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      showToast(`Copied ${ref} to clipboard`);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast(`Copied ${ref} to clipboard`);
    }
  };

  // Bookmark toggle
  const isSelectedVerseBookmarked = selectedVerse
    ? currentChapterBookmarks.has(selectedVerse.verse)
    : false;

  const handleToggleBookmark = () => {
    if (!selectedVerse) return;

    const id = `${selectedVerse.book}_${selectedVerse.chapter}_${selectedVerse.verse}`;
    if (isSelectedVerseBookmarked) {
      removeStoredBookmark(id);
      setBookmarks(getStoredBookmarks());
      showToast(`Removed bookmark for ${selectedVerse.book} ${selectedVerse.chapter}:${selectedVerse.verse}`);
    } else {
      saveStoredBookmark({
        book: selectedVerse.book,
        chapter: selectedVerse.chapter,
        verse: selectedVerse.verse,
        title: `${selectedVerse.book} ${selectedVerse.chapter}:${selectedVerse.verse}`
      });
      setBookmarks(getStoredBookmarks());
      showToast(`Saved bookmark for ${selectedVerse.book} ${selectedVerse.chapter}:${selectedVerse.verse}`);
    }
  };

  // Text-To-Speech (TTS)
  const handleSpeakVerse = () => {
    if (!selectedVerse || !('speechSynthesis' in window)) {
      showToast('Speech synthesis not supported on this browser');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak =
      readingLayout === 'cebuano'
        ? selectedVerse.verseData.ceb
        : selectedVerse.verseData.en;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
    showToast(`Reading ${selectedVerse.book} ${selectedVerse.chapter}:${selectedVerse.verse}...`);
  };

  // Note actions
  const activeNoteForVerse = notes.find(
    n => n.book === currentBook && n.chapter === currentChapter && n.verse === (activeNoteVerse || selectedVerse?.verse)
  );

  const handleSaveNote = (text: string) => {
    const verseNum = activeNoteVerse || selectedVerse?.verse;
    if (!verseNum) return;

    saveStoredNote(currentBook, currentChapter, verseNum, text);
    setNotes(getStoredNotes());
    showToast(`Study note saved for verse ${verseNum}`);
    setActiveNoteVerse(null);
    setSelectedVerse(null);
  };

  const handleDeleteNote = (id?: string) => {
    const noteId = id || activeNoteForVerse?.id;
    if (noteId) {
      removeStoredNote(noteId);
      setNotes(getStoredNotes());
      showToast('Note deleted');
    }
    setActiveNoteVerse(null);
  };

  // Quiz Stats Update
  const handleUpdateQuizStats = (newStats: QuizStats) => {
    setQuizStats(newStats);
    saveStoredQuizStats(newStats);
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-5xl mx-auto overflow-hidden shadow-2xl relative">
      {/* 1. Splash Screen on first load */}
      {showSplash && <Splash onComplete={() => setShowSplash(false)} />}

      {/* 2. Top Header Bar */}
      <Header
        currentScreen={currentScreen}
        readingLayout={readingLayout}
        onLayoutChange={handleLayoutChange}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenBookmarks={() => setCurrentScreen('bookmarks')}
        bookmarkCount={bookmarks.length}
        notesCount={notes.length}
        currentBook={currentBook}
        currentChapter={currentChapter}
        onGoToBible={() => setCurrentScreen('bible')}
      />

      {/* 3. Main Body Screen Views */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        {currentScreen === 'bible' && (
          <BibleReader
            bibleData={bibleData}
            isLoading={isLoadingBible}
            currentBook={currentBook}
            currentChapter={currentChapter}
            onBookChange={handleBookChange}
            onChapterChange={handleChapterChange}
            readingLayout={readingLayout}
            selectedVerse={selectedVerse}
            onSelectVerse={(v) => setSelectedVerse(v)}
            highlights={highlights}
            bookmarkedVerses={currentChapterBookmarks}
            notesVerses={currentChapterNotes}
            onOpenNoteForVerse={(vNum) => setActiveNoteVerse(vNum)}
            targetVerseToScroll={targetVerseToScroll}
          />
        )}

        {currentScreen === 'quiz' && (
          <QuizScreen
            quizStats={quizStats}
            onUpdateStats={handleUpdateQuizStats}
            onNavigateToVerse={handleNavigateFromRefString}
          />
        )}

        {currentScreen === 'dictionary' && (
          <DictionaryScreen onNavigateToVerse={handleNavigateFromRefString} />
        )}

        {currentScreen === 'bookmarks' && (
          <SavedScreen
            highlights={highlights}
            bookmarks={bookmarks}
            notes={notes}
            onNavigateToVerse={handleNavigateToVerse}
            onDeleteHighlight={(b, ch, v) => {
              removeStoredHighlight(b, ch, v);
              setHighlights(getStoredHighlights());
              showToast('Highlight deleted');
            }}
            onDeleteBookmark={(id) => {
              removeStoredBookmark(id);
              setBookmarks(getStoredBookmarks());
              showToast('Bookmark removed');
            }}
            onDeleteNote={(id) => {
              removeStoredNote(id);
              setNotes(getStoredNotes());
              showToast('Note deleted');
            }}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen
            preferences={preferences}
            onUpdatePreferences={handleUpdatePreferences}
            bibleData={bibleData}
            onShowToast={showToast}
            onOpenOfflineModal={() => setIsOfflineModalOpen(true)}
            isFullyDownloaded={isFullyDownloaded}
          />
        )}
      </main>

      {/* Offline Package Modal (Prompt on landing page / manual from settings) */}
      <OfflinePackageModal
        isOpen={isOfflineModalOpen}
        onClose={() => setIsOfflineModalOpen(false)}
        isDownloading={isDownloadingPackage}
        downloadProgress={downloadProgress}
        isFullyDownloaded={isFullyDownloaded}
        failedBooks={failedDownloadBooks}
        downloadError={downloadError}
        onStartDownload={handleDownloadFullPackage}
      />

      {/* 4. Verse Interaction Toolbar (Float at bottom) */}
      <VerseToolbar
        selectedVerse={selectedVerse}
        onClose={() => {
          setSelectedVerse(null);
          if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
          }
        }}
        onHighlight={handleApplyHighlight}
        onCopy={handleCopyVerse}
        onToggleBookmark={handleToggleBookmark}
        isBookmarked={isSelectedVerseBookmarked}
        onOpenNoteModal={() => setActiveNoteVerse(selectedVerse?.verse || null)}
        onSpeak={handleSpeakVerse}
        isSpeaking={isSpeaking}
      />

      {/* 5. Study Note Modal */}
      {activeNoteVerse && (
        <NoteModal
          isOpen={true}
          onClose={() => setActiveNoteVerse(null)}
          book={currentBook}
          chapter={currentChapter}
          verse={activeNoteVerse}
          cebText={
            bibleData[currentBook]?.[currentChapter]?.find(v => v.v === activeNoteVerse)?.ceb || ''
          }
          enText={
            bibleData[currentBook]?.[currentChapter]?.find(v => v.v === activeNoteVerse)?.en || ''
          }
          initialNote={activeNoteForVerse?.text || ''}
          onSaveNote={handleSaveNote}
          onDeleteNote={activeNoteForVerse ? () => handleDeleteNote(activeNoteForVerse.id) : undefined}
        />
      )}

      {/* 6. Fast Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        bibleData={bibleData}
        onNavigateToVerse={handleNavigateToVerse}
      />

      {/* 8. Toast Feedback Message */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#10203D] dark:bg-[#1B3A6B] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-2xl border border-[#C9A227]/40 flex items-center gap-2 pointer-events-none"
          >
            <span className="w-2 h-2 rounded-full bg-[#E4C765]" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 9. Bottom Navigation Bar */}
      <BottomNav
        currentScreen={currentScreen}
        onSelectScreen={(screen) => {
          setCurrentScreen(screen);
          setSelectedVerse(null);
          if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
          }
        }}
        savedCount={Object.keys(highlights).length + bookmarks.length + notes.length}
      />
    </div>
  );
}

