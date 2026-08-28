import React, { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Bookmark, Loader2 } from 'lucide-react';
import { BIBLE_BOOKS, getBookInfo } from '../data/books';
import { BibleData, ReadingLayout, SavedHighlight, VerseItem } from '../types';

interface BibleReaderProps {
  bibleData: BibleData;
  isLoading: boolean;
  currentBook: string;
  currentChapter: number;
  onBookChange: (book: string) => void;
  onChapterChange: (chapter: number) => void;
  readingLayout: ReadingLayout;
  selectedVerse: {
    book: string;
    chapter: number;
    verse: number;
    verseData: VerseItem;
  } | null;
  onSelectVerse: (verse: { book: string; chapter: number; verse: number; verseData: VerseItem }) => void;
  highlights: Record<string, SavedHighlight>;
  bookmarkedVerses: Set<number>;
  notesVerses: Set<number>;
  onOpenNoteForVerse: (verseNum: number) => void;
  targetVerseToScroll?: number | null;
}

export const BibleReader: React.FC<BibleReaderProps> = ({
  bibleData,
  isLoading,
  currentBook,
  currentChapter,
  onBookChange,
  onChapterChange,
  readingLayout,
  selectedVerse,
  onSelectVerse,
  highlights,
  bookmarkedVerses,
  notesVerses,
  targetVerseToScroll
}) => {
  const currentBookInfo = getBookInfo(currentBook);
  const totalChapters = currentBookInfo?.chapters || 1;
  const chapterVerses: VerseItem[] = bibleData[currentBook]?.[currentChapter] || [];
  const containerRef = useRef<HTMLDivElement>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto scroll to target verse if requested
  useEffect(() => {
    if (targetVerseToScroll && containerRef.current) {
      setTimeout(() => {
        const el = document.getElementById(`verse-row-${targetVerseToScroll}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('bg-[#C9A227]/20');
          setTimeout(() => {
            el.classList.remove('bg-[#C9A227]/20');
          }, 2500);
        }
      }, 200);
    }
  }, [targetVerseToScroll, currentBook, currentChapter]);

  const handlePrevChapter = () => {
    if (currentChapter > 1) {
      onChapterChange(currentChapter - 1);
    } else {
      const bookIndex = BIBLE_BOOKS.findIndex(b => b.name === currentBook);
      if (bookIndex > 0) {
        const prevBook = BIBLE_BOOKS[bookIndex - 1];
        onBookChange(prevBook.name);
        onChapterChange(prevBook.chapters);
      }
    }
  };

  const handleNextChapter = () => {
    if (currentChapter < totalChapters) {
      onChapterChange(currentChapter + 1);
    } else {
      const bookIndex = BIBLE_BOOKS.findIndex(b => b.name === currentBook);
      if (bookIndex < BIBLE_BOOKS.length - 1) {
        const nextBook = BIBLE_BOOKS[bookIndex + 1];
        onBookChange(nextBook.name);
        onChapterChange(1);
      }
    }
  };

  const handleTouchStart = (verse: VerseItem) => {
    longPressTimerRef.current = setTimeout(() => {
      onSelectVerse({
        book: currentBook,
        chapter: currentChapter,
        verse: verse.v,
        verseData: verse
      });
    }, 450);
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-[var(--ivory)] text-[var(--slate)]">
      {/* Selectors Bar */}
      <div className="selectors flex items-center justify-between gap-3 px-3 sm:px-5 py-2.5 bg-[var(--paper)] border-b border-[var(--line)] shadow-xs flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-xl">
          {/* Book Select */}
          <div className="select-wrap relative flex-1">
            <span className="select-label block text-[10px] sm:text-[11px] font-semibold text-[var(--slate-soft)] uppercase tracking-wider pl-1 mb-0.5">
              Book
            </span>
            <div className="relative">
              <select
                id="book-select"
                value={currentBook}
                onChange={(e) => onBookChange(e.target.value)}
                className="select-control w-full appearance-none pl-3 pr-8 py-1.5 sm:py-2 bg-[var(--paper)] border border-[var(--line)] rounded-xl text-xs sm:text-sm font-semibold text-[var(--ink)] focus:outline-none focus:border-[#C9A227] shadow-xs cursor-pointer"
              >
                <optgroup label="Old Testament">
                  {BIBLE_BOOKS.filter(b => b.testament === 'Old').map(b => (
                    <option key={b.name} value={b.name}>
                      {b.name} ({b.cebName})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="New Testament">
                  {BIBLE_BOOKS.filter(b => b.testament === 'New').map(b => (
                    <option key={b.name} value={b.name}>
                      {b.name} ({b.cebName})
                    </option>
                  ))}
                </optgroup>
              </select>
              <ChevronDown className="select-caret w-4 h-4 text-[#C9A227] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Chapter Select */}
          <div className="select-wrap relative w-24 sm:w-36">
            <span className="select-label block text-[10px] sm:text-[11px] font-semibold text-[var(--slate-soft)] uppercase tracking-wider pl-1 mb-0.5">
              Chapter
            </span>
            <div className="relative">
              <select
                id="chapter-select"
                value={currentChapter}
                onChange={(e) => onChapterChange(Number(e.target.value))}
                className="select-control w-full appearance-none pl-3 pr-8 py-1.5 sm:py-2 bg-[var(--paper)] border border-[var(--line)] rounded-xl text-xs sm:text-sm font-semibold text-[var(--ink)] focus:outline-none focus:border-[#C9A227] shadow-xs cursor-pointer"
              >
                {Array.from({ length: totalChapters }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>
                    Ch. {num}
                  </option>
                ))}
              </select>
              <ChevronDown className="select-caret w-4 h-4 text-[#C9A227] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Prev / Next chapter controls */}
        <div className="flex items-center gap-1.5 pt-3">
          <button
            onClick={handlePrevChapter}
            className="p-2 rounded-xl border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] hover:border-[#C9A227] active:scale-95 transition-all shadow-xs"
            title="Previous Chapter"
            aria-label="Previous Chapter"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextChapter}
            className="p-2 rounded-xl border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] hover:border-[#C9A227] active:scale-95 transition-all shadow-xs"
            title="Next Chapter"
            aria-label="Next Chapter"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reading Pane Area */}
      <div
        ref={containerRef}
        id="reading-pane"
        className="reading-pane flex-1 min-h-0 overflow-y-auto px-2 sm:px-3 pb-28 scroll-smooth"
      >
        {/* Sticky Header Row (Cebuano on left, English on right) */}
        <div className="reading-header-row sticky top-0 z-10 bg-[var(--ivory)] border-b-2 border-[#C9A227] mb-1 pt-2 pb-1">
          <div className={`grid ${readingLayout === 'parallel' ? 'grid-cols-2' : 'grid-cols-1'} items-center`}>
            {(readingLayout === 'parallel' || readingLayout === 'cebuano') && (
              <div className="reading-col-header reading-col-header-ceb flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-0.5 min-w-0 overflow-hidden">
                <span className="col-flag font-sans text-[9px] sm:text-[10px] font-bold text-white bg-[#1B3A6B] px-1 sm:px-1.5 py-0.5 rounded flex-shrink-0">
                  CEB
                </span>
                <span className="font-serif font-bold text-[11px] sm:text-xs md:text-sm text-[var(--ink)] truncate whitespace-nowrap">
                  Cebuano <em className="font-normal font-sans text-[10px] sm:text-xs text-[var(--slate-soft)]">(Bugna)</em>
                </span>
              </div>
            )}
            {(readingLayout === 'parallel' || readingLayout === 'english') && (
              <div className="reading-col-header reading-col-header-eng flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-0.5 min-w-0 overflow-hidden">
                <span className="col-flag font-sans text-[9px] sm:text-[10px] font-bold text-white bg-[#1B3A6B] px-1 sm:px-1.5 py-0.5 rounded flex-shrink-0">
                  ENG
                </span>
                <span className="font-serif font-bold text-[11px] sm:text-xs md:text-sm text-[var(--ink)] truncate whitespace-nowrap">
                  English <em className="font-normal font-sans text-[10px] sm:text-xs text-[var(--slate-soft)]">(KJV)</em>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Verses List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#C9A227] mb-3" />
            <p className="text-sm font-serif">Loading scriptures...</p>
          </div>
        ) : chapterVerses.length === 0 ? (
          <div className="text-center py-20 px-4">
            <p className="text-sm font-serif italic text-[var(--slate-soft)]">
              Text for {currentBook} {currentChapter} is loading...
            </p>
          </div>
        ) : (
          <div id="verse-rows" className="verse-rows flex flex-col relative z-[1]">
            {chapterVerses.map((verse) => {
              const isSelected =
                selectedVerse?.book === currentBook &&
                selectedVerse?.chapter === currentChapter &&
                selectedVerse?.verse === verse.v;

              const highlightKey = `${currentBook}|${currentChapter}|${verse.v}`;
              const highlightData = highlights[highlightKey];
              const isBookmarked = bookmarkedVerses.has(verse.v);
              const hasNote = notesVerses.has(verse.v);

              return (
                <div
                  key={verse.v}
                  id={`verse-row-${verse.v}`}
                  data-verse={verse.v}
                  data-book={currentBook}
                  data-chapter={currentChapter}
                  onClick={() =>
                    onSelectVerse({
                      book: currentBook,
                      chapter: currentChapter,
                      verse: verse.v,
                      verseData: verse
                    })
                  }
                  onTouchStart={() => handleTouchStart(verse)}
                  onTouchEnd={handleTouchEnd}
                  onTouchMove={handleTouchEnd}
                  className={`verse-row relative transition-all cursor-pointer border-b border-dashed border-[var(--line)] hover:bg-[#C9A227]/[0.08] ${
                    readingLayout === 'parallel' ? 'grid grid-cols-2' : 'flex flex-col'
                  } ${isSelected ? 'selected' : ''} ${
                    highlightData ? `highlight-${highlightData.color}` : ''
                  }`}
                >
                  {/* Indicators for bookmark and notes */}
                  {(isBookmarked || hasNote) && (
                    <div className="absolute top-1.5 right-2 flex items-center gap-1 z-10 pointer-events-none">
                      {isBookmarked && (
                        <Bookmark className="w-3.5 h-3.5 text-[#C9A227] fill-[#C9A227]" />
                      )}
                      {hasNote && (
                        <span className="w-2 h-2 rounded-full bg-[#1B3A6B] ring-1 ring-[#C9A227]" />
                      )}
                    </div>
                  )}

                  {/* Cebuano Cell (Left) */}
                  {(readingLayout === 'parallel' || readingLayout === 'cebuano') && (
                    <div
                      className={`verse-cell verse-cell-ceb flex items-start gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 leading-relaxed text-[var(--slate)] min-w-0 ${
                        readingLayout === 'parallel' ? 'border-r border-[var(--line)]' : ''
                      }`}
                    >
                      <span className="verse-num inline-block min-w-[24px] sm:min-w-[26px] text-[#C9A227] font-bold text-xs sm:text-sm flex-shrink-0 text-right select-none pt-0.5">
                        {verse.v}
                      </span>
                      <span className="verse-text flex-1 min-w-0 break-words font-normal">
                        {verse.ceb}
                      </span>
                    </div>
                  )}

                  {/* English Cell (Right) */}
                  {(readingLayout === 'parallel' || readingLayout === 'english') && (
                    <div className="verse-cell verse-cell-eng flex items-start gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 leading-relaxed text-[var(--slate)] min-w-0">
                      <span className="verse-num inline-block min-w-[24px] sm:min-w-[26px] text-[#C9A227] font-bold text-xs sm:text-sm flex-shrink-0 text-right select-none pt-0.5">
                        {verse.v}
                      </span>
                      <span className="verse-text flex-1 min-w-0 break-words font-normal">
                        {verse.en}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Chapter Navigation Bar */}
        {chapterVerses.length > 0 && (
          <div className="pt-6 pb-20 flex items-center justify-between border-t border-[var(--line)] mt-8 px-2">
            <button
              onClick={handlePrevChapter}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-[var(--paper)] border border-[var(--line)] text-[var(--ink)] hover:border-[#C9A227] flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <span className="font-serif text-xs sm:text-sm font-bold text-[var(--ink)]">
              {currentBook} {currentChapter}
            </span>

            <button
              onClick={handleNextChapter}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-[var(--paper)] border border-[var(--line)] text-[var(--ink)] hover:border-[#C9A227] flex items-center gap-1.5 shadow-xs transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
