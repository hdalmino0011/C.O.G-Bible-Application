import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, X, Bookmark, Edit3, Volume2, Check } from 'lucide-react';
import { HighlightColor, VerseItem } from '../types';

interface VerseToolbarProps {
  selectedVerse: {
    book: string;
    chapter: number;
    verse: number;
    verseData: VerseItem;
  } | null;
  onClose: () => void;
  onHighlight: (color: HighlightColor | 'none') => void;
  onCopy: (mode: 'cebuano' | 'english' | 'both') => void;
  onToggleBookmark: () => void;
  isBookmarked: boolean;
  onOpenNoteModal: () => void;
  onSpeak: () => void;
  isSpeaking: boolean;
}

export const VerseToolbar: React.FC<VerseToolbarProps> = ({
  selectedVerse,
  onClose,
  onHighlight,
  onCopy,
  onToggleBookmark,
  isBookmarked,
  onOpenNoteModal,
  onSpeak,
  isSpeaking
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!selectedVerse) return null;

  const handleCopyClick = (mode: 'cebuano' | 'english' | 'both') => {
    onCopy(mode);
    setCopiedType(mode);
    setTimeout(() => setCopiedType(null), 1500);
  };

  const highlightColors: Array<{ color: HighlightColor; bg: string; label: string }> = [
    { color: 'yellow', bg: '#FFD700', label: 'Yellow' },
    { color: 'pink', bg: '#FFB6C1', label: 'Pink' },
    { color: 'green', bg: '#98FB98', label: 'Green' },
    { color: 'blue', bg: '#87CEEB', label: 'Blue' },
    { color: 'purple', bg: '#D8BFD8', label: 'Purple' }
  ];

  return (
    <AnimatePresence>
      <motion.div
        id="floating-verse-toolbar"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-xl bg-white dark:bg-[#1E293B] border border-[#E3DFD3] dark:border-slate-700 shadow-2xl rounded-2xl p-3 flex flex-col gap-2.5 backdrop-blur-md"
      >
        {/* Header with reference and close */}
        <div className="flex items-center justify-between pb-1.5 border-b border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-xs sm:text-sm text-[#1B3A6B] dark:text-[#E4C765]">
              {selectedVerse.book} {selectedVerse.chapter}:{selectedVerse.verse}
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
              Selected Verse
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onSpeak}
              className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 transition-colors ${
                isSpeaking ? 'text-[#C9A227] animate-pulse' : ''
              }`}
              title="Listen to Verse (Audio TTS)"
              aria-label="Speak verse aloud"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={onToggleBookmark}
              className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors ${
                isBookmarked ? 'text-[#C9A227]' : 'text-gray-600 dark:text-gray-300'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
              aria-label="Toggle Bookmark"
            >
              <Bookmark className="w-4 h-4" fill={isBookmarked ? '#C9A227' : 'none'} />
            </button>
            <button
              onClick={onOpenNoteModal}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition-colors"
              title="Add / View Note"
              aria-label="Add study note"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 dark:hover:bg-slate-700 transition-colors ml-1"
              title="Close toolbar"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action buttons: Highlighting & Copying */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
          {/* Highlight Color Pickers */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase text-gray-400 dark:text-gray-400 tracking-wider">
              Highlight:
            </span>
            {highlightColors.map((h) => (
              <button
                key={h.color}
                onClick={() => onHighlight(h.color)}
                style={{ backgroundColor: h.bg }}
                className="w-5 h-5 rounded-full border border-black/15 hover:scale-110 active:scale-95 transition-transform shadow-xs"
                title={`Highlight ${h.label}`}
                aria-label={`Highlight ${h.label}`}
              />
            ))}
            <button
              onClick={() => onHighlight('none')}
              className="text-[10px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-1.5 py-0.5 rounded border border-gray-200 dark:border-slate-700"
              title="Clear Highlight"
            >
              Clear
            </button>
          </div>

          {/* Copy verse options */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-semibold uppercase text-gray-400 dark:text-gray-400 tracking-wider mr-0.5">
              Copy:
            </span>
            <button
              onClick={() => handleCopyClick('cebuano')}
              className="px-2 py-1 text-[11px] font-medium bg-[#1B3A6B] hover:bg-[#10203D] text-white rounded-md flex items-center gap-1 transition-colors shadow-xs"
              title="Copy Cebuano verse"
            >
              {copiedType === 'cebuano' ? <Check className="w-3 h-3 text-green-300" /> : <Copy className="w-3 h-3" />}
              CEB
            </button>
            <button
              onClick={() => handleCopyClick('english')}
              className="px-2 py-1 text-[11px] font-medium bg-[#1B3A6B] hover:bg-[#10203D] text-white rounded-md flex items-center gap-1 transition-colors shadow-xs"
              title="Copy English verse"
            >
              {copiedType === 'english' ? <Check className="w-3 h-3 text-green-300" /> : <Copy className="w-3 h-3" />}
              ENG
            </button>
            <button
              onClick={() => handleCopyClick('both')}
              className="px-2.5 py-1 text-[11px] font-semibold bg-[#C9A227] hover:bg-[#B38F1E] text-white rounded-md flex items-center gap-1 transition-colors shadow-xs"
              title="Copy Parallel (Both Cebuano and English)"
            >
              {copiedType === 'both' ? <Check className="w-3 h-3 text-green-200" /> : <Copy className="w-3 h-3" />}
              Both
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
