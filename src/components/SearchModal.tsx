import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, BookOpen, ArrowRight, Loader2 } from 'lucide-react';
import { ALL_BOOK_NAMES, normalizeBookName } from '../data/books';
import { BibleData } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  bibleData: BibleData;
  onNavigateToVerse: (book: string, chapter: number, verse?: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  bibleData,
  onNavigateToVerse
}) => {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) return [];

    // Check Reference pattern: "John 3:16", "Bugna 1:5", "Salmo 23:1", "1 Timoteo 3:15", "Mga Buhat 2:38"
    const refMatch = q.match(/^(\d?\s*[a-zA-ZÀ-ÿ\s-]+?)\s+(\d+)(?::(\d+))?$/i);
    if (refMatch) {
      const parsedBook = refMatch[1].trim();
      const bookName = normalizeBookName(parsedBook);
      const chapter = parseInt(refMatch[2], 10);
      const verse = refMatch[3] ? parseInt(refMatch[3], 10) : undefined;

      if (bookName && bibleData[bookName]?.[chapter]) {
        const verseItem = verse ? bibleData[bookName][chapter].find(v => v.v === verse) : undefined;
        return [{
          book: bookName,
          chapter,
          verse: verse || 1,
          isDirectRef: true,
          ceb: verseItem?.ceb || `Ablihi ang ${bookName} Kapitulo ${chapter}`,
          en: verseItem?.en || `Jump to ${bookName} Chapter ${chapter}`
        }];
      }
    }

    // Full text search
    const results: Array<{ book: string; chapter: number; verse: number; ceb: string; en: string }> = [];
    const books = Object.keys(bibleData);

    for (const book of books) {
      const chapters = bibleData[book] || {};
      for (const [chStr, verses] of Object.entries(chapters)) {
        const ch = parseInt(chStr, 10);
        if (Array.isArray(verses)) {
          for (const v of verses) {
            const matchEn = v.en && v.en.toLowerCase().includes(q);
            const matchCeb = v.ceb && v.ceb.toLowerCase().includes(q);

            if (matchEn || matchCeb) {
              results.push({
                book,
                chapter: ch,
                verse: v.v,
                ceb: v.ceb,
                en: v.en
              });
              if (results.length >= 60) break; // Limit for performance
            }
          }
        }
        if (results.length >= 60) break;
      }
      if (results.length >= 60) break;
    }

    return results;
  }, [query, bibleData]);

  if (!isOpen) return null;

  const handleSelect = (book: string, chapter: number, verse?: number) => {
    onNavigateToVerse(book, chapter, verse);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs pt-16 sm:pt-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white dark:bg-[#182234] rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-[#1E293B]">
          <Search className="w-5 h-5 text-[#C9A227] flex-shrink-0" />
          <input
            id="modal-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reference (e.g. Bugna 1:5, John 3:16) or keywords..."
            className="w-full text-sm sm:text-base bg-transparent text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center"
            aria-label="Close search"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Suggestions or Results */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {!query ? (
            <div className="py-8 text-center text-gray-400 space-y-2">
              <BookOpen className="w-8 h-8 mx-auto text-[#C9A227]" />
              <p className="text-xs sm:text-sm font-serif max-w-md mx-auto">
                Type a scripture reference in Cebuano or English (e.g. <span className="text-[#1B3A6B] dark:text-[#E4C765] font-semibold">Bugna 1:5</span>, <span className="text-[#1B3A6B] dark:text-[#E4C765] font-semibold">1 Timothy 3:15</span>, <span className="text-[#1B3A6B] dark:text-[#E4C765] font-semibold">Salmo 23:1</span>) or any word in Cebuano or English.
              </p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <p className="text-sm font-serif italic">No scriptures found for "{query}".</p>
            </div>
          ) : (
            searchResults.map((res, i) => (
              <div
                key={i}
                onClick={() => handleSelect(res.book, res.chapter, res.verse)}
                className="p-3 rounded-xl border border-gray-100 dark:border-slate-700/60 bg-[#F7F5EF]/60 dark:bg-slate-800/60 hover:bg-[#C9A227]/10 hover:border-[#C9A227] cursor-pointer transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-xs sm:text-sm text-[#1B3A6B] dark:text-[#E4C765]">
                    {res.book} {res.chapter}:{res.verse}
                  </span>
                  <span className="text-[11px] text-[#C9A227] font-semibold flex items-center gap-1">
                    Open verse <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
                {res.ceb && (
                  <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">
                    <strong className="text-[#1B3A6B] dark:text-[#E4C765]">CEB: </strong>
                    {res.ceb}
                  </p>
                )}
                {res.en && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    <strong className="text-[#1B3A6B] dark:text-[#E4C765]">ENG: </strong>
                    {res.en}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};
