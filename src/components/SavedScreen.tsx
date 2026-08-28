import React, { useState } from 'react';
import { Bookmark, Highlighter, Edit3, Trash2, ArrowRight, BookOpen } from 'lucide-react';
import { HighlightColor, NoteItem, SavedHighlight } from '../types';

interface SavedScreenProps {
  highlights: Record<string, SavedHighlight>;
  bookmarks: Array<{ id: string; book: string; chapter: number; verse?: number; title: string; timestamp: number }>;
  notes: NoteItem[];
  onNavigateToVerse: (book: string, chapter: number, verse?: number) => void;
  onDeleteHighlight: (book: string, chapter: number, verse: number) => void;
  onDeleteBookmark: (id: string) => void;
  onDeleteNote: (id: string) => void;
}

export const SavedScreen: React.FC<SavedScreenProps> = ({
  highlights,
  bookmarks,
  notes,
  onNavigateToVerse,
  onDeleteHighlight,
  onDeleteBookmark,
  onDeleteNote
}) => {
  const [activeTab, setActiveTab] = useState<'highlights' | 'bookmarks' | 'notes'>('highlights');

  const highlightList: SavedHighlight[] = (Object.values(highlights) as SavedHighlight[]).sort((a, b) => b.timestamp - a.timestamp);

  const getHighlightDot = (color: HighlightColor) => {
    switch (color) {
      case 'yellow': return 'bg-[#FACC15]';
      case 'pink': return 'bg-[#F472B6]';
      case 'green': return 'bg-[#4ADE80]';
      case 'blue': return 'bg-[#60A5FA]';
      case 'purple': return 'bg-[#C084FC]';
      default: return 'bg-[#FACC15]';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 max-w-3xl mx-auto w-full pb-28">
      {/* Header & Tabs */}
      <div className="flex items-center justify-between border-b border-[#E2DED2] dark:border-[#22314E] pb-3 mb-4">
        <h2 className="font-serif text-xl font-bold flex items-center gap-2" style={{ color: 'var(--ink)' }}>
          <BookOpen className="w-5 h-5 text-[#C9A227]" />
          My Bible Study Library
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-1.5 p-1 bg-white/80 dark:bg-[#142036] border border-[#E2DED2] dark:border-[#22314E] rounded-xl mb-5 shadow-xs">
        <button
          onClick={() => setActiveTab('highlights')}
          className={`py-2 px-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'highlights'
              ? 'bg-[#1B3A6B] dark:bg-[#C9A227] text-white dark:text-[#0E1B33] shadow-xs'
              : 'text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10'
          }`}
        >
          <Highlighter className="w-3.5 h-3.5" />
          <span>Highlights ({highlightList.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`py-2 px-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'bookmarks'
              ? 'bg-[#1B3A6B] dark:bg-[#C9A227] text-white dark:text-[#0E1B33] shadow-xs'
              : 'text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Bookmarks ({bookmarks.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`py-2 px-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'notes'
              ? 'bg-[#1B3A6B] dark:bg-[#C9A227] text-white dark:text-[#0E1B33] shadow-xs'
              : 'text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Notes ({notes.length})</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'highlights' && (
        <div className="space-y-3">
          {highlightList.length === 0 ? (
            <div className="text-center py-16 bg-white/80 dark:bg-[#142036] rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 p-6">
              <Highlighter className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
              <p className="font-serif text-sm italic text-gray-600 dark:text-gray-300">
                No verses highlighted yet. Select any verse while reading to highlight.
              </p>
            </div>
          ) : (
            highlightList.map((item) => (
              <div
                key={item.id}
                className="bg-white/90 dark:bg-[#142036] border border-[#E2DED2] dark:border-[#22314E] rounded-xl p-4 shadow-xs hover:border-[#C9A227] transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-3.5 h-3.5 rounded-full ${getHighlightDot(item.color)} border border-black/15 shadow-xs`} />
                    <span className="font-serif font-bold text-sm text-[#1B3A6B] dark:text-[#E4C765]">
                      {item.book} {item.chapter}:{item.verse}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigateToVerse(item.book, item.chapter, item.verse)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#1B3A6B] dark:bg-[#C9A227] text-white dark:text-[#0E1B33] hover:opacity-90 flex items-center gap-1 transition-opacity cursor-pointer shadow-xs"
                    >
                      Jump to verse <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDeleteHighlight(item.book, item.chapter, item.verse)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      title="Delete highlight"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {item.cebText && (
                  <p className="text-xs sm:text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                    <strong className="text-[#C9A227] dark:text-[#E4C765] font-bold">CEB: </strong>
                    {item.cebText}
                  </p>
                )}
                {item.enText && (
                  <p className="text-xs sm:text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    <strong className="text-[#C9A227] dark:text-[#E4C765] font-bold">ENG: </strong>
                    {item.enText}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'bookmarks' && (
        <div className="space-y-3">
          {bookmarks.length === 0 ? (
            <div className="text-center py-16 bg-white/80 dark:bg-[#142036] rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 p-6">
              <Bookmark className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
              <p className="font-serif text-sm italic text-gray-600 dark:text-gray-300">
                No bookmarks saved yet. Click the bookmark icon on any verse toolbar.
              </p>
            </div>
          ) : (
            bookmarks.map((bm) => (
              <div
                key={bm.id}
                className="bg-white/90 dark:bg-[#142036] border border-[#E2DED2] dark:border-[#22314E] rounded-xl p-4 shadow-xs flex items-center justify-between"
              >
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#1B3A6B] dark:text-[#E4C765]">
                    {bm.book} {bm.chapter}{bm.verse ? `:${bm.verse}` : ''}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Saved {new Date(bm.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigateToVerse(bm.book, bm.chapter, bm.verse)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#1B3A6B] dark:bg-[#C9A227] text-white dark:text-[#0E1B33] hover:opacity-90 flex items-center gap-1 transition-opacity cursor-pointer shadow-xs"
                  >
                    Open <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onDeleteBookmark(bm.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="space-y-3">
          {notes.length === 0 ? (
            <div className="text-center py-16 bg-white/80 dark:bg-[#142036] rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 p-6">
              <Edit3 className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
              <p className="font-serif text-sm italic text-gray-600 dark:text-gray-300">
                No study notes written yet. Select a verse and click the pencil icon to write reflections.
              </p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="bg-white/90 dark:bg-[#142036] border border-[#E2DED2] dark:border-[#22314E] rounded-xl p-4 shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-[#1B3A6B] dark:text-[#E4C765]">
                    Note on {note.book} {note.chapter}:{note.verse}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigateToVerse(note.book, note.chapter, note.verse)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#1B3A6B] dark:bg-[#C9A227] text-white dark:text-[#0E1B33] hover:opacity-90 flex items-center gap-1 transition-opacity cursor-pointer shadow-xs"
                    >
                      Open in Bible <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-3 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap leading-relaxed">
                  {note.text}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
