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
        <h2 className="font-serif text-xl font-bold text-[#0E1B33] dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#C9A227]" />
          My Bible Study Library
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-2 p-1 bg-white dark:bg-[#142036] border border-[#E2DED2] dark:border-[#22314E] rounded-xl mb-5 shadow-xs">
        <button
          onClick={() => setActiveTab('highlights')}
          className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'highlights'
              ? 'bg-[#1B3A6B] text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <Highlighter className="w-3.5 h-3.5" />
          Highlights ({highlightList.length})
        </button>
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'bookmarks'
              ? 'bg-[#1B3A6B] text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          Bookmarks ({bookmarks.length})
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'notes'
              ? 'bg-[#1B3A6B] text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          Notes ({notes.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'highlights' && (
        <div className="space-y-3">
          {highlightList.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#142036] rounded-2xl border border-dashed border-gray-300 dark:border-slate-700">
              <Highlighter className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="font-serif text-sm italic text-gray-500">
                No verses highlighted yet. Select any verse while reading to highlight.
              </p>
            </div>
          ) : (
            highlightList.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-[#142036] border border-[#E2DED2] dark:border-[#22314E] rounded-xl p-4 shadow-xs hover:border-[#C9A227] transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${getHighlightDot(item.color)} border border-black/10`} />
                    <span className="font-serif font-bold text-sm text-[#1B3A6B] dark:text-[#E4C765]">
                      {item.book} {item.chapter}:{item.verse}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigateToVerse(item.book, item.chapter, item.verse)}
                      className="px-2.5 py-1 text-xs font-semibold rounded bg-[#1B3A6B] text-white hover:bg-[#10203D] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      Jump to verse <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDeleteHighlight(item.book, item.chapter, item.verse)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      title="Delete highlight"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {item.cebText && (
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    <strong className="text-[#1B3A6B] dark:text-[#E4C765]">CEB: </strong>
                    {item.cebText}
                  </p>
                )}
                {item.enText && (
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <strong className="text-[#1B3A6B] dark:text-[#E4C765]">ENG: </strong>
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
            <div className="text-center py-16 bg-white dark:bg-[#142036] rounded-2xl border border-dashed border-gray-300 dark:border-slate-700">
              <Bookmark className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="font-serif text-sm italic text-gray-500">
                No bookmarks saved yet. Click the bookmark icon on any verse toolbar.
              </p>
            </div>
          ) : (
            bookmarks.map((bm) => (
              <div
                key={bm.id}
                className="bg-white dark:bg-[#142036] border border-[#E2DED2] dark:border-[#22314E] rounded-xl p-4 shadow-xs flex items-center justify-between"
              >
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#1B3A6B] dark:text-[#E4C765]">
                    {bm.book} {bm.chapter}{bm.verse ? `:${bm.verse}` : ''}
                  </h4>
                  <p className="text-xs text-gray-400">
                    Saved {new Date(bm.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigateToVerse(bm.book, bm.chapter, bm.verse)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#1B3A6B] text-white hover:bg-[#10203D] flex items-center gap-1 transition-colors cursor-pointer"
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
            <div className="text-center py-16 bg-white dark:bg-[#142036] rounded-2xl border border-dashed border-gray-300 dark:border-slate-700">
              <Edit3 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="font-serif text-sm italic text-gray-500">
                No study notes written yet. Select a verse and click the pencil icon to write reflections.
              </p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="bg-white dark:bg-[#142036] border border-[#E2DED2] dark:border-[#22314E] rounded-xl p-4 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-[#1B3A6B] dark:text-[#E4C765]">
                    Note on {note.book} {note.chapter}:{note.verse}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigateToVerse(note.book, note.chapter, note.verse)}
                      className="px-2.5 py-1 text-xs font-semibold rounded bg-[#1B3A6B] text-white hover:bg-[#10203D] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      Open in Bible <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg text-xs sm:text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
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
