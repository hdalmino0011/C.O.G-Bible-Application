export type ScreenType = 'bible' | 'quiz' | 'dictionary' | 'bookmarks' | 'settings';

export type ReadingLayout = 'parallel' | 'cebuano' | 'english';

export type AppTheme = 'light' | 'dark' | 'sepia' | 'blue';

export type FontFamily = 'Roboto' | 'Playfair' | 'Georgia' | 'Arial' | 'Times';

export type FontSize = 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';

export type HighlightColor = 'yellow' | 'pink' | 'green' | 'blue' | 'purple';

export interface VerseItem {
  v: number;
  en: string;
  ceb: string;
}

export type ChapterVerses = VerseItem[];

export interface BookChapters {
  [chapter: string]: ChapterVerses;
}

export interface BibleData {
  [book: string]: BookChapters;
}

export interface SavedHighlight {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  color: HighlightColor;
  timestamp: number;
  cebText: string;
  enText: string;
}

export interface Bookmark {
  id: string;
  book: string;
  chapter: number;
  verse?: number;
  title: string;
  timestamp: number;
}

export interface NoteItem {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  timestamp: number;
  updatedAt?: number;
}

export interface DictionaryArticleSection {
  heading: string;
  content: string;
}

export interface DictionaryExternalLink {
  label: string;
  url: string;
}

export interface DictionaryEntry {
  id: string;
  term: string;
  category: 'Divine Name' | 'False God' | 'Title' | 'Place' | 'Object' | 'Concept' | 'Doctrine' | 'Person' | 'Feast';
  shortDefinition: string;
  origin: string;
  references: string;
  article: {
    sections: DictionaryArticleSection[];
    bibleReferences: string[];
    externalLinks?: DictionaryExternalLink[];
  };
}

export interface QuizQuestion {
  id: string;
  category: 'old' | 'new' | 'all' | 'doctrine' | 'characters';
  categoryLabel?: string;
  q: string;
  options: string[];
  answer: number;
  explanation: string;
  reference?: string;
}

export interface QuizStats {
  total: number;
  correct: number;
  streak: number;
  bestStreak: number;
  categoryScores?: Record<string, { total: number; correct: number }>;
}

export interface UserPreferences {
  theme: AppTheme;
  font: FontFamily;
  fontSize: FontSize;
  readingLayout: ReadingLayout;
  showVerseNumbers: boolean;
  enableSpeechAutoplay?: boolean;
  dailyVerseNotification?: boolean;
  notificationTime?: string;
  lastNotificationDate?: string;
}
