import React from 'react';
import { Sun, Moon, BookOpen, Droplets, Type, TextQuote } from 'lucide-react';
import { AppTheme, FontFamily, FontSize, UserPreferences } from '../types';

interface SettingsScreenProps {
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  preferences,
  onUpdatePreferences
}) => {
  const themes: Array<{ id: AppTheme; label: string; icon: React.ReactNode }> = [
    { id: 'light', label: 'Light', icon: <Sun className="w-4 h-4 text-amber-500" /> },
    { id: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4 text-indigo-300" /> },
    { id: 'sepia', label: 'Sepia', icon: <BookOpen className="w-4 h-4 text-amber-700" /> },
    { id: 'blue', label: 'Navy Blue', icon: <Droplets className="w-4 h-4 text-blue-400" /> }
  ];

  const fonts: Array<{ id: FontFamily; label: string }> = [
    { id: 'Roboto', label: 'Roboto (Modern Sans)' },
    { id: 'Playfair', label: 'Playfair (Classic Serif)' },
    { id: 'Georgia', label: 'Georgia (Editorial)' },
    { id: 'Times', label: 'Times New Roman' },
    { id: 'Arial', label: 'Arial' }
  ];

  const fontSizes: Array<{ id: FontSize; label: string }> = [
    { id: 'small', label: 'Small' },
    { id: 'medium', label: 'Medium' },
    { id: 'large', label: 'Large' },
    { id: 'xlarge', label: 'X-Large' },
    { id: 'xxlarge', label: 'XX-Large' }
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 max-w-2xl mx-auto w-full pb-28 space-y-6">
      {/* Theme Settings */}
      <div className="bg-white dark:bg-[#182234] border border-[#E3DFD3] dark:border-[#2A3552] rounded-2xl p-5 shadow-xs space-y-3">
        <h3 className="font-serif font-bold text-base text-[#10203D] dark:text-white flex items-center gap-2">
          <Sun className="w-4 h-4 text-[#C9A227]" />
          Visual Theme
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => onUpdatePreferences({ theme: t.id })}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${
                preferences.theme === t.id
                  ? 'border-[#C9A227] bg-[#C9A227]/10 text-[#1B3A6B] dark:text-[#E4C765] shadow-xs'
                  : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-[#C9A227]'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Font Family */}
      <div className="bg-white dark:bg-[#182234] border border-[#E3DFD3] dark:border-[#2A3552] rounded-2xl p-5 shadow-xs space-y-3">
        <h3 className="font-serif font-bold text-base text-[#10203D] dark:text-white flex items-center gap-2">
          <Type className="w-4 h-4 text-[#C9A227]" />
          Scripture Font Style
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {fonts.map((f) => (
            <button
              key={f.id}
              onClick={() => onUpdatePreferences({ font: f.id })}
              className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                preferences.font === f.id
                  ? 'border-[#C9A227] bg-[#C9A227]/10 text-[#1B3A6B] dark:text-[#E4C765] font-bold shadow-xs'
                  : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-[#C9A227]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div className="bg-white dark:bg-[#182234] border border-[#E3DFD3] dark:border-[#2A3552] rounded-2xl p-5 shadow-xs space-y-3">
        <h3 className="font-serif font-bold text-base text-[#10203D] dark:text-white flex items-center gap-2">
          <TextQuote className="w-4 h-4 text-[#C9A227]" />
          Text Size
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {fontSizes.map((s) => (
            <button
              key={s.id}
              onClick={() => onUpdatePreferences({ fontSize: s.id })}
              className={`py-2 px-1 text-center rounded-xl border text-xs transition-all ${
                preferences.fontSize === s.id
                  ? 'border-[#C9A227] bg-[#C9A227]/10 text-[#1B3A6B] dark:text-[#E4C765] font-bold shadow-xs'
                  : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-[#C9A227]'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* About The Church of God */}
      <div className="bg-white dark:bg-[#182234] border border-[#E3DFD3] dark:border-[#2A3552] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-slate-700">
          <img
            src="./logo.jpg"
            alt="The Church of God Seal"
            className="w-14 h-14 rounded-full border-2 border-[#C9A227] shadow-md object-contain bg-[#142748] p-1"
            referrerPolicy="no-referrer"
          />
          <div>
            <h3 className="font-serif font-bold text-base text-[#10203D] dark:text-white">
              The Church of God
            </h3>
            <p className="text-xs text-[#C9A227] font-semibold">
              (Truth, Justice, and Righteousness)
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              Jerusalem, Israel • Anno Domini
            </p>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-gray-100 dark:border-slate-800">
            <span className="text-gray-500 dark:text-gray-400">Application:</span>
            <span className="font-semibold text-gray-800 dark:text-gray-100">COG (T.J.R) Bible</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-100 dark:border-slate-800">
            <span className="text-gray-500 dark:text-gray-400">Version:</span>
            <span className="font-semibold text-gray-800 dark:text-gray-100">1.2.0 (Enhanced Edition)</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500 dark:text-gray-400">Bible Versions:</span>
            <span className="font-semibold text-gray-800 dark:text-gray-100 text-right">
              Cebuano (Bugna) &amp; English (KJV)
            </span>
          </div>
          {/* Developer / Author line has been removed */}
        </div>
      </div>
    </div>
  );
};
