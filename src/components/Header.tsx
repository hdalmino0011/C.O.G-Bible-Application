import React from 'react';
import { Search, Bookmark as BookmarkIcon, Columns } from 'lucide-react';
import { ReadingLayout, ScreenType } from '../types';
import { EMBEDDED_LOGO_DATA_URI } from '../data/logoAsset';

interface HeaderProps {
  currentScreen: ScreenType;
  readingLayout: ReadingLayout;
  onLayoutChange: (layout: ReadingLayout) => void;
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  bookmarkCount: number;
  notesCount: number;
  currentBook?: string;
  currentChapter?: number;
  onGoToBible?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  readingLayout,
  onLayoutChange,
  onOpenSearch,
  onOpenBookmarks,
  bookmarkCount,
  notesCount,
  currentBook,
  currentChapter,
  onGoToBible
}) => {
  const totalSaved = bookmarkCount + notesCount;

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'bible':
        return currentBook ? `${currentBook} ${currentChapter}` : 'COG (T.J.R) Bible';
      case 'quiz':
        return 'Bible Quiz';
      case 'dictionary':
        return 'Bible Dictionary';
      case 'bookmarks':
        return 'Saved & Highlights';
      case 'settings':
        return 'App Settings';
      default:
        return 'COG (T.J.R) Bible';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-3 sm:px-4 py-2.5 bg-gradient-to-r from-[#10203D] via-[#1B3A6B] to-[#2C548F] text-white shadow-md select-none">
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={onGoToBible}
          className="relative w-8 h-8 rounded-full overflow-hidden border border-[#E4C765]/80 shadow-sm flex-shrink-0 hover:scale-105 transition-transform cursor-pointer"
          title="The Church of God (Truth, Justice, and Righteousness)"
          aria-label="COG Logo"
        >
          <img
            src={EMBEDDED_LOGO_DATA_URI}
            alt="COG Logo"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.triedJpg) {
                target.dataset.triedJpg = 'true';
                target.src = './logo.jpg';
              } else if (!target.dataset.triedPng) {
                target.dataset.triedPng = 'true';
                target.src = './logo.png';
              }
            }}
          />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 truncate">
            <h1 className="font-serif text-base sm:text-lg font-bold tracking-tight text-white truncate">
              {getScreenTitle()}
            </h1>
            {currentScreen === 'bible' && (
              <span className="hidden md:inline-block text-[11px] font-sans font-normal text-[#E4C765] bg-[#E4C765]/15 px-2 py-0.5 rounded-full">
                CEB • KJV
              </span>
            )}
          </div>
          {currentScreen === 'bible' && (
            <p className="text-[10px] text-blue-200/80 tracking-wide font-light hidden sm:block truncate">
              The Church of God (Truth, Justice, and Righteousness)
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
        {currentScreen === 'bible' && (
          <div className="flex items-center bg-white/10 rounded-lg p-0.5 border border-white/15">
            <button
              onClick={() => onLayoutChange('parallel')}
              className={`px-2 py-1 text-[11px] font-medium rounded-md transition-all flex items-center gap-1 ${
                readingLayout === 'parallel'
                  ? 'bg-[#C9A227] text-white font-semibold shadow-sm'
                  : 'text-blue-100 hover:bg-white/10'
              }`}
              title="Parallel View (Cebuano & English)"
              aria-label="Parallel Dual Layout"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Parallel</span>
            </button>
            <button
              onClick={() => onLayoutChange('cebuano')}
              className={`px-2 py-1 text-[11px] font-medium rounded-md transition-all ${
                readingLayout === 'cebuano'
                  ? 'bg-[#C9A227] text-white font-semibold shadow-sm'
                  : 'text-blue-100 hover:bg-white/10'
              }`}
              title="Cebuano Only (Bugna)"
              aria-label="Cebuano Only"
            >
              CEB
            </button>
            <button
              onClick={() => onLayoutChange('english')}
              className={`px-2 py-1 text-[11px] font-medium rounded-md transition-all ${
                readingLayout === 'english'
                  ? 'bg-[#C9A227] text-white font-semibold shadow-sm'
                  : 'text-blue-100 hover:bg-white/10'
              }`}
              title="English Only (KJV)"
              aria-label="English Only"
            >
              ENG
            </button>
          </div>
        )}

        <button
          id="search-toggle-btn"
          onClick={onOpenSearch}
          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white"
          title="Search Verses & Chapters (Ctrl+K / ⌘K)"
          aria-label="Search Bible"
        >
          <Search className="w-4 h-4" />
        </button>

        <button
          id="bookmarks-drawer-toggle-btn"
          onClick={onOpenBookmarks}
          className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white"
          title="Bookmarks, Highlights & Notes"
          aria-label="View Saved Items"
        >
          <BookmarkIcon className="w-4 h-4" />
          {totalSaved > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#C9A227] text-[9px] font-bold text-white flex items-center justify-center shadow">
              {totalSaved}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

