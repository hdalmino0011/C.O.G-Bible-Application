import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Save, Trash2, BookOpen } from 'lucide-react';
import { NoteItem } from '../types';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: string;
  chapter: number;
  verse: number;
  cebText: string;
  enText: string;
  initialNote?: string;
  onSaveNote: (text: string) => void;
  onDeleteNote?: () => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  book,
  chapter,
  verse,
  cebText,
  enText,
  initialNote = '',
  onSaveNote,
  onDeleteNote
}) => {
  const [noteText, setNoteText] = useState(initialNote);

  useEffect(() => {
    setNoteText(initialNote);
  }, [initialNote, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveNote(noteText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#1B3A6B] text-white">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#E4C765]" />
            <h3 className="font-serif font-bold text-base">
              Study Note: {book} {chapter}:{verse}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verse preview */}
        <div className="p-4 bg-[#F7F5EF] dark:bg-slate-800/60 border-b border-gray-200 dark:border-slate-700 text-xs text-gray-700 dark:text-gray-300 space-y-1.5 max-h-36 overflow-y-auto">
          <p>
            <span className="font-bold text-[#1B3A6B] dark:text-[#E4C765]">CEB: </span>
            {cebText}
          </p>
          <p>
            <span className="font-bold text-[#1B3A6B] dark:text-[#E4C765]">KJV: </span>
            {enText}
          </p>
        </div>

        {/* Text area */}
        <div className="p-4 flex-1 flex flex-col">
          <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">
            Personal Reflections &amp; Cross-References:
          </label>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Write your study notes, insights, sermon points, or prayers here..."
            className="w-full h-40 sm:h-48 p-3 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#C9A227] resize-none"
            autoFocus
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50 dark:bg-slate-800/80 border-t border-gray-200 dark:border-slate-700">
          <div>
            {initialNote && onDeleteNote && (
              <button
                type="button"
                onClick={() => {
                  onDeleteNote();
                  onClose();
                }}
                className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Note
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-bold text-white bg-[#1B3A6B] hover:bg-[#10203D] rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              Save Note
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
