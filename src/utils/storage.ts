import { AppTheme, FontFamily, FontSize, HighlightColor, NoteItem, QuizStats, ReadingLayout, SavedHighlight, UserPreferences } from '../types';

const STORAGE_KEYS = {
  PREFS: 'cog_user_preferences_v2',
  HIGHLIGHTS: 'cog_saved_highlights_v2',
  BOOKMARKS: 'cog_saved_bookmarks_v2',
  NOTES: 'cog_saved_notes_v2',
  QUIZ_STATS: 'cog_quiz_stats_v2',
  LAST_READ: 'cog_last_read_position_v2'
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  font: 'Roboto',
  fontSize: 'medium',
  readingLayout: 'parallel',
  showVerseNumbers: true,
  enableSpeechAutoplay: false
};

export function getStoredPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFS);
    if (!raw) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_PREFERENCES;
  }
}

export function saveStoredPreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to save preferences', e);
  }
}

export function getStoredHighlights(): Record<string, SavedHighlight> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HIGHLIGHTS);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export function saveStoredHighlight(highlight: SavedHighlight): void {
  try {
    const all = getStoredHighlights();
    const key = `${highlight.book}|${highlight.chapter}|${highlight.verse}`;
    all[key] = highlight;
    localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to save highlight', e);
  }
}

export function removeStoredHighlight(book: string, chapter: number, verse: number): void {
  try {
    const all = getStoredHighlights();
    const key = `${book}|${chapter}|${verse}`;
    delete all[key];
    localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to delete highlight', e);
  }
}

export function getStoredBookmarks(): Array<{ id: string; book: string; chapter: number; verse?: number; title: string; timestamp: number }> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveStoredBookmark(item: { book: string; chapter: number; verse?: number; title: string }): void {
  try {
    const all = getStoredBookmarks();
    const id = `${item.book}_${item.chapter}_${item.verse || 0}`;
    const filtered = all.filter(b => b.id !== id);
    filtered.unshift({
      id,
      ...item,
      timestamp: Date.now()
    });
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to save bookmark', e);
  }
}

export function removeStoredBookmark(id: string): void {
  try {
    const all = getStoredBookmarks().filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to remove bookmark', e);
  }
}

export function getStoredNotes(): NoteItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveStoredNote(book: string, chapter: number, verse: number, text: string): void {
  try {
    const all = getStoredNotes();
    const id = `note_${book}_${chapter}_${verse}`;
    const filtered = all.filter(n => n.id !== id);
    if (text.trim()) {
      filtered.unshift({
        id,
        book,
        chapter,
        verse,
        text: text.trim(),
        timestamp: Date.now()
      });
    }
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to save note', e);
  }
}

export function removeStoredNote(id: string): void {
  try {
    const all = getStoredNotes().filter(n => n.id !== id);
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to remove note', e);
  }
}

export function getStoredQuizStats(): QuizStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUIZ_STATS);
    if (!raw) return { total: 0, correct: 0, streak: 0, bestStreak: 0 };
    return JSON.parse(raw);
  } catch (e) {
    return { total: 0, correct: 0, streak: 0, bestStreak: 0 };
  }
}

export function saveStoredQuizStats(stats: QuizStats): void {
  try {
    localStorage.setItem(STORAGE_KEYS.QUIZ_STATS, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save quiz stats', e);
  }
}

export function getLastReadPosition(): { book: string; chapter: number } {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LAST_READ);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { book: 'Genesis', chapter: 1 };
}

export function saveLastReadPosition(book: string, chapter: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_READ, JSON.stringify({ book, chapter }));
  } catch (e) {}
}
