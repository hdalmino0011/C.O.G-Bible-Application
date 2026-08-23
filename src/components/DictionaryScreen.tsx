import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ArrowLeft, ExternalLink, BookOpen, Tag, Sparkles } from 'lucide-react';
import { DICTIONARY_DATA } from '../data/dictionary';
import { DictionaryEntry } from '../types';

interface DictionaryScreenProps {
  onNavigateToVerse: (verseRef: string) => void;
}

export const DictionaryScreen: React.FC<DictionaryScreenProps> = ({ onNavigateToVerse }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<DictionaryEntry | null>(null);

  const categories = ['All', 'Divine Name', 'False God', 'Title', 'Place', 'Object', 'Doctrine', 'Concept', 'Feast'];

  const filteredEntries = DICTIONARY_DATA.filter((entry) => {
    const matchesSearch =
      entry.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.shortDefinition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || entry.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Divine Name':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300';
      case 'False God':
        return 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 font-bold';
      case 'Title':
        return 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300';
      case 'Place':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300';
      case 'Object':
        return 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300';
      case 'Doctrine':
        return 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-300';
      default:
        return 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-300';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 max-w-4xl mx-auto w-full pb-28">
      <AnimatePresence mode="wait">
        {/* ================= 1. ARTICLE DETAIL VIEW ================= */}
        {activeArticle ? (
          <motion.div
            key="article-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Back button */}
            <button
              onClick={() => setActiveArticle(null)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-[#1B3A6B] text-white hover:bg-[#10203D] shadow-xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dictionary
            </button>

            {/* Article Content Card */}
            <div className="bg-white dark:bg-[#182234] border border-[#E3DFD3] dark:border-[#2A3552] rounded-2xl p-5 sm:p-7 shadow-md space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getCategoryBadgeClass(activeArticle.category)}`}>
                    {activeArticle.category}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Origin: {activeArticle.origin}
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#10203D] dark:text-white">
                  {activeArticle.term}
                </h2>
                <p className="text-sm italic text-gray-600 dark:text-gray-300 mt-2 border-l-2 border-[#C9A227] pl-3">
                  {activeArticle.shortDefinition}
                </p>
              </div>

              {/* Sections */}
              <div className="space-y-5">
                {activeArticle.article.sections.map((section, idx) => (
                  <div key={idx} className="space-y-2">
                    <h3 className="font-serif text-lg font-bold text-[#1B3A6B] dark:text-[#E4C765] border-b border-[#E3DFD3] dark:border-[#2A3552] pb-1">
                      {section.heading}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-200">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* Clickable Bible Cross-References */}
              {activeArticle.article.bibleReferences.length > 0 && (
                <div className="pt-2 border-t border-gray-100 dark:border-slate-700">
                  <h4 className="font-serif text-sm font-bold text-[#1B3A6B] dark:text-[#E4C765] mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    Scripture Cross-References:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeArticle.article.bibleReferences.map((ref, idx) => (
                      <button
                        key={idx}
                        onClick={() => onNavigateToVerse(ref)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#F7F5EF] dark:bg-slate-800 text-[#1B3A6B] dark:text-[#E4C765] border border-[#E3DFD3] dark:border-slate-700 hover:border-[#C9A227] hover:bg-[#C9A227]/10 transition-colors"
                        title={`Open ${ref} in Bible`}
                      >
                        {ref}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* External research links */}
              {activeArticle.article.externalLinks && activeArticle.article.externalLinks.length > 0 && (
                <div className="pt-2 border-t border-gray-100 dark:border-slate-700">
                  <h4 className="font-serif text-sm font-bold text-[#1B3A6B] dark:text-[#E4C765] mb-2">
                    External Resources:
                  </h4>
                  <div className="space-y-1.5">
                    {activeArticle.article.externalLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* ================= 2. DICTIONARY LIST VIEW ================= */
          <motion.div
            key="list-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Search Input */}
            <div className="relative">
              <input
                id="dict-search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Biblical terms, definitions, YHWH, Baal, Ark..."
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#182234] border border-[#E3DFD3] dark:border-[#2A3552] rounded-2xl text-sm text-[#10203D] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A227] shadow-xs"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition-all border ${
                    selectedCategory === cat
                      ? 'bg-[#1B3A6B] text-white border-[#1B3A6B] shadow-xs'
                      : 'bg-white dark:bg-[#182234] text-gray-600 dark:text-gray-300 border-[#E3DFD3] dark:border-[#2A3552] hover:border-[#C9A227]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Dictionary List */}
            <div className="space-y-3 pt-1">
              {filteredEntries.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-[#182234] rounded-2xl border border-dashed border-gray-300 dark:border-slate-700">
                  <p className="font-serif text-sm italic text-gray-500">
                    No dictionary entries found matching "{searchTerm}".
                  </p>
                </div>
              ) : (
                filteredEntries.map((entry) => (
                  <div
                    key={entry.id}
                    onClick={() => setActiveArticle(entry)}
                    className="bg-white dark:bg-[#182234] border border-[#E3DFD3] dark:border-[#2A3552] hover:border-[#C9A227] rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#1B3A6B] dark:text-[#E4C765] group-hover:text-[#C9A227] transition-colors">
                        {entry.term}
                      </h3>
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(entry.category)}`}>
                        {entry.category}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed">
                      {entry.shortDefinition}
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-slate-700/60 text-[11px] text-gray-500 dark:text-gray-400">
                      <span>Ref: {entry.references}</span>
                      <span className="text-[#C9A227] font-semibold group-hover:translate-x-1 transition-transform">
                        Read article &rarr;
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
