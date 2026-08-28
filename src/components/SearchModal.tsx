import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, X, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { normalizeBookName } from '../data/books';
import { BibleData } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  bibleData: BibleData;
  onNavigateToVerse: (book: string, chapter: number, verse?: number) => void;
}

const DOCTRINE_SHORTCUTS = [
  { label: 'The Church of God', ref: '1 Timothy 3:15', desc: 'Pillar & Ground of the Truth' },
  { label: 'Founded by Jesus Christ', ref: 'Matthew 16:18', desc: 'Upon this Rock I will build My Church' },
  { label: 'Purchased by His Blood', ref: 'Acts 20:28', desc: 'Feed the Church of God' },
  { label: 'Sanctified in Christ', ref: '1 Corinthians 1:2', desc: 'Unto the Church of God at Corinth' },
  { label: 'Apostolic Foundation', ref: 'Ephesians 2:20', desc: 'Jesus Christ Chief Cornerstone' },
  { label: 'Truth, Justice, Righteousness', ref: 'Jeremiah 4:2', desc: 'Pillars of God\'s Name' },
  { label: 'Commandments & Faith', ref: 'Revelation 14:12', desc: 'Patience of the Saints' }
];

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
              if (results.length >= 60) break;
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

  const handleShortcutClick = (refStr: string) => {
    const match = refStr.match(/^(\d?\s*[a-zA-ZÀ-ÿ\s-]+?)\s+(\d+)(?::(\d+))?/i);
    if (match) {
      const bookName = normalizeBookName(match[1].trim()) || match[1].trim();
      const chapter = parseInt(match[2], 10);
      const verse = match[3] ? parseInt(match[3], 10) : 1;
      handleSelect(bookName, chapter, verse);
    } else {
      setQuery(refStr);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs pt-16 sm:pt-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white dark:bg-[#142036] rounded-2xl shadow-2xl border border-[#E2DED2] dark:border-[#22314E] overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-[#E2DED2] dark:border-[#22314E] bg-white dark:bg-[#10243E]">
          <Search className="w-5 h-5 text-[#C9A227] flex-shrink-0" />
          <input
            id="modal-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reference (e.g. Bugna 1:5, John 3:16) or keywords..."
            className="w-full text-sm sm:text-base bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-1 shrink-0"
              aria-label="Clear search input"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-gray-200 dark:border-[#22314E] text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center shrink-0"
            aria-label="Close search modal"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Suggestions or Results */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {!query ? (
            <div className="space-y-4">
              <div className="text-center text-gray-500 dark:text-gray-400 py-3 space-y-1">
                <BookOpen className="w-7 h-7 mx-auto text-[#C9A227]" />
                <p className="text-xs sm:text-sm font-serif">
                  Type a scripture reference or keyword in Cebuano or English
                </p>
              </div>

              {/* Doctrinal Quick Reference Tags */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#C9A227] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Foundational Scriptures &amp; Doctrines
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DOCTRINE_SHORTCUTS.map((item) => (
                    <button
                      key={item.ref}
                      onClick={() => handleShortcutClick(item.ref)}
                      className="p-2.5 rounded-xl border border-[#E2DED2] dark:border-[#22314E] hover:border-[#C9A227] bg-gray-50/70 dark:bg-slate-800/60 hover:bg-[#C9A227]/10 text-left transition-all group flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#0E1B33] dark:text-[#E4C765] group-hover:text-[#1B3A6B] dark:group-hover:text-white">
                          {item.label}
                        </span>
                        <span className="text-[10px] font-mono font-semibold text-[#C9A227] bg-[#C9A227]/15 px-1.5 py-0.5 rounded">
                          {item.ref}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                        {item.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <p className="text-sm font-serif italic">No scriptures found for "{query}".</p>
            </div>
          ) : (
            searchResults.map((res, i) => (
              <button
                key={`${res.book}-${res.chapter}-${res.verse}-${i}`}
                onClick={() => handleSelect(res.book, res.chapter, res.verse)}
                className="w-full text-left p-3 rounded-xl border border-[#E2DED2] dark:border-[#22314E] hover:border-[#C9A227] bg-white dark:bg-[#10243E] hover:bg-[#C9A227]/10 transition-all space-y-1.5 group shadow-xs"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#0E1B33] dark:text-[#E4C765]">
                  <span>
                    {res.book} {res.chapter}:{res.verse}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-[#C9A227] opacity-0 group-hover:opacity-100 transition-opacity">
                    Open <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                {res.ceb && (
                  <p className="text-xs text-gray-700 dark:text-gray-200 line-clamp-2">
                    <span className="text-[10px] font-semibold text-gray-400 mr-1">[CEB]</span>
                    {res.ceb}
                  </p>
                )}
                {res.en && (
                  <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 italic">
                    <span className="text-[10px] font-semibold text-gray-400 mr-1">[KJV]</span>
                    {res.en}
                  </p>
                )}
              </button>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};
