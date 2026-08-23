import React from 'react';
import { Book, HelpCircle, BookOpen, Bookmark, Settings } from 'lucide-react';
import { ScreenType } from '../types';

interface BottomNavProps {
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
  savedCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onSelectScreen,
  savedCount
}) => {
  const navItems: Array<{
    id: ScreenType;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }> = [
    {
      id: 'bible',
      label: 'Bible',
      icon: <Book className="w-5 h-5" />
    },
    {
      id: 'quiz',
      label: 'Quiz',
      icon: <HelpCircle className="w-5 h-5" />
    },
    {
      id: 'dictionary',
      label: 'Dictionary',
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      id: 'bookmarks',
      label: 'Saved',
      icon: <Bookmark className="w-5 h-5" />,
      badge: savedCount > 0 ? savedCount : undefined
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  return (
    <nav
      id="main-bottom-nav"
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-[#182234]/95 border-t border-[#E3DFD3] dark:border-[#2A3552] backdrop-blur-md px-2 py-1.5 sm:py-2 flex items-center justify-around shadow-lg select-none"
    >
      {navItems.map((item) => {
        const isActive = currentScreen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectScreen(item.id)}
            className={`relative flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
              isActive
                ? 'text-[#1B3A6B] dark:text-[#E4C765] font-bold scale-105'
                : 'text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
            }`}
          >
            <div className="relative">
              {item.icon}
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[15px] h-3.5 px-1 bg-[#C9A227] text-white text-[8px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] sm:text-[11px] tracking-tight">
              {item.label}
            </span>
            {isActive && (
              <span className="w-1 h-1 rounded-full bg-[#C9A227] mt-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
