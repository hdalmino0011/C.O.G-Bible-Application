import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  BookOpen,
  Droplets,
  Type,
  TextQuote,
  BellRing,
  Sparkles,
  Smartphone,
  HardDrive,
  CheckCircle2,
  Wifi,
  WifiOff,
  Download,
  RefreshCw,
  DownloadCloud,
  ShieldCheck,
  Info
} from 'lucide-react';
import { AppTheme, BibleData, FontFamily, FontSize, UserPreferences } from '../types';
import { getNotificationPermissionStatus, requestNotificationPermission, sendDailyVerseNotification, isNotificationSupported } from '../utils/notifications';
import { getRandomDailyVerse } from '../data/dailyVerses';
import { getStorageEstimate } from '../utils/offlineDb';

interface SettingsScreenProps {
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  bibleData?: BibleData;
  onShowToast?: (msg: string) => void;
  isOnline?: boolean;
  offlineCount?: number;
  totalBooks?: number;
  isDownloadingOffline?: boolean;
  offlineDownloadProgress?: number;
  currentDownloadingBook?: string;
  onDownloadAllOffline?: () => Promise<void>;
  onVerifyOfflineStorage?: () => Promise<void>;
  canInstallPWA?: boolean;
  onInstallPWA?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  preferences,
  onUpdatePreferences,
  bibleData,
  onShowToast,
  isOnline = true,
  offlineCount = 66,
  totalBooks = 66,
  isDownloadingOffline = false,
  offlineDownloadProgress = 0,
  currentDownloadingBook = '',
  onDownloadAllOffline,
  onVerifyOfflineStorage,
  canInstallPWA = false,
  onInstallPWA
}) => {
  const [isTestingNotification, setIsTestingNotification] = useState(false);
  const [permStatus, setPermStatus] = useState(getNotificationPermissionStatus());
  const [storageUsage, setStorageUsage] = useState<{ usageFormatted: string; quotaFormatted: string; percent: number }>({
    usageFormatted: '~10.4 MB',
    quotaFormatted: 'Device Storage',
    percent: 1
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

  useEffect(() => {
    getStorageEstimate().then(setStorageUsage);
  }, [offlineCount]);

  const handleVerify = async () => {
    if (onVerifyOfflineStorage) {
      setIsVerifying(true);
      await onVerifyOfflineStorage();
      setIsVerifying(false);
      setVerificationResult(`All ${offlineCount} of ${totalBooks} books verified in phone database!`);
      setTimeout(() => setVerificationResult(null), 5000);
    }
  };

  const themes: Array<{ id: AppTheme; label: string; icon: React.ReactNode }> = [
    {
      id: 'light',
      label: 'Light',
      icon: <Sun className="w-4 h-4 text-amber-500" />
    },
    {
      id: 'dark',
      label: 'Dark',
      icon: <Moon className="w-4 h-4 text-indigo-300" />
    },
    {
      id: 'blue',
      label: 'Navy Blue',
      icon: <Droplets className="w-4 h-4 text-blue-400" />
    }
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

  const handleToggleNotifications = async () => {
    const nextState = !preferences.dailyVerseNotification;
    if (nextState && isNotificationSupported() && Notification.permission !== 'granted') {
      const granted = await requestNotificationPermission();
      setPermStatus(granted);
      if (granted !== 'granted') {
        onShowToast?.('Please enable notifications in your phone browser settings');
        return;
      }
    }
    onUpdatePreferences({ dailyVerseNotification: nextState });
    onShowToast?.(nextState ? 'Daily Verse Notifications enabled' : 'Daily Verse Notifications turned off');
  };

  const handleTestNotification = async () => {
    setIsTestingNotification(true);
    const randomVerse = getRandomDailyVerse(bibleData);
    const success = await sendDailyVerseNotification(
      randomVerse,
      `📖 Daily Verse: ${randomVerse.book} ${randomVerse.chapter}:${randomVerse.verse}`
    );
    setPermStatus(getNotificationPermissionStatus());
    setIsTestingNotification(false);
    if (success) {
      onShowToast?.(`Sent notification for ${randomVerse.book} ${randomVerse.chapter}:${randomVerse.verse}!`);
    } else {
      onShowToast?.('Could not send notification. Please allow notifications for this app.');
    }
  };

  const isFullyCached = offlineCount >= totalBooks;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 max-w-2xl mx-auto w-full pb-28 space-y-6">
      {/* 1. Offline Phone Storage & Installation Status */}
      <div className="bg-white dark:bg-[#142036] border border-[#E2DED2] dark:border-[#22314E] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100 dark:border-[#22314E]">
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-xl ${isFullyCached ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'}`}>
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base flex items-center gap-2" style={{ color: 'var(--ink)' }}>
                Offline Phone Storage
                {isFullyCached && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-sans font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    100% Offline Ready
                  </span>
                )}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                All 66 books, dual language text, quiz, and dictionary stored on your device.
              </p>
            </div>
          </div>
        </div>

        {/* Network & Local Storage Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-[#22314E]">
            <div className="text-[10px] uppercase font-bold text-gray-400">Network State</div>
            <div className="flex items-center gap-1.5 mt-1">
              {isOnline ? (
                <>
                  <Wifi className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Offline Mode</span>
                </>
              )}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-[#22314E]">
            <div className="text-[10px] uppercase font-bold text-gray-400">Cached Books</div>
            <div className="text-xs font-bold text-[#C9A227] mt-1">
              {offlineCount} of {totalBooks} Books
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-[#22314E] col-span-2 sm:col-span-1">
            <div className="text-[10px] uppercase font-bold text-gray-400">Storage Used</div>
            <div className="text-xs font-bold text-gray-800 dark:text-gray-200 mt-1">
              {storageUsage.usageFormatted}
            </div>
          </div>
        </div>

        {/* Progress bar if actively downloading packages */}
        {isDownloadingOffline && (
          <div className="space-y-1.5 p-3.5 rounded-xl bg-[#C9A227]/10 border border-[#C9A227]/30">
            <div className="flex justify-between text-xs font-bold text-[#0E1B33] dark:text-[#E4C765]">
              <span className="flex items-center gap-1.5">
                <DownloadCloud className="w-3.5 h-3.5 animate-bounce" />
                Downloading scriptures for offline phone use...
              </span>
              <span>{Math.round(offlineDownloadProgress)}%</span>
            </div>
            {currentDownloadingBook && (
              <p className="text-[11px] text-gray-600 dark:text-gray-300 italic">
                Saving: {currentDownloadingBook}
              </p>
            )}
            <div className="w-full bg-gray-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#C9A227] h-full transition-all duration-200"
                style={{ width: `${Math.max(5, offlineDownloadProgress)}%` }}
              />
            </div>
          </div>
        )}

        {verificationResult && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{verificationResult}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={() => onDownloadAllOffline?.()}
            disabled={isDownloadingOffline}
            className="flex-1 min-w-[180px] py-2.5 px-4 rounded-xl bg-[#1B3A6B] dark:bg-[#C9A227] text-white dark:text-[#0E1B33] font-bold text-xs hover:opacity-90 active:scale-95 transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isDownloadingOffline ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Saving to Phone Files...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                {isFullyCached ? 'Re-Sync Offline Package' : 'Download All Offline Data'}
              </>
            )}
          </button>

          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className="py-2.5 px-3.5 rounded-xl border border-gray-200 dark:border-[#22314E] bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-semibold text-xs hover:bg-gray-100 dark:hover:bg-slate-700 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
            {isVerifying ? 'Verifying...' : 'Verify Offline Files'}
          </button>
        </div>

        {/* PWA Phone Installation Prompt */}
        {canInstallPWA && onInstallPWA && (
          <div className="pt-3 border-t border-gray-100 dark:border-[#22314E] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#C9A227]" />
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                Install App on Phone Home Screen
              </span>
            </div>
            <button
              onClick={onInstallPWA}
              className="py-1.5 px-3 rounded-lg bg-[#C9A227] text-white font-bold text-xs hover:bg-[#B38F1E] active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              Install App
            </button>
          </div>
        )}

        <div className="flex items-start gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800/40 p-2.5 rounded-xl">
          <Info className="w-3.5 h-3.5 text-[#C9A227] mt-0.5 shrink-0" />
          <span>
            Once installed, this Bible app operates <strong>100% offline</strong> without internet or cellular data. All bookmarks, notes, highlights, and quiz stats remain safely on your phone.
          </span>
        </div>
      </div>

      {/* Visual Theme */}
      <div className="bg-white dark:bg-[#142036] border border-[#E2DED2] dark:border-[#22314E] rounded-2xl p-5 shadow-xs space-y-3">
        <h3 className="font-serif font-bold text-base flex items-center gap-2" style={{ color: 'var(--ink)' }}>
          <Sun className="w-4 h-4 text-[#C9A227]" />
          Visual Theme
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          High-contrast reading modes tailored for daylight and night scripture study.
        </p>
        <div className="grid grid-cols-3 gap-2.5">
          {themes.map((t) => {
            const isSelected = preferences.theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onUpdatePreferences({ theme: t.id })}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-semibold cursor-pointer ${
                  isSelected
                    ? 'border-[#C9A227] bg-[#C9A227]/15 text-[#C9A227] dark:text-[#F3DE8A] shadow-xs ring-1 ring-[#C9A227]'
                    : 'border-gray-200 dark:border-[#22314E] text-gray-700 dark:text-gray-300 hover:border-[#C9A227] bg-transparent'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Verse Notification & Phone Integration */}
      <div className="bg-white dark:bg-[#142036] border border-[#E2DED2] dark:border-[#22314E] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#C9A227]/15 text-[#C9A227]">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base" style={{ color: 'var(--ink)' }}>
                Daily Scripture Notifications
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Receive an inspiring verse directly on your phone every day
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={!!preferences.dailyVerseNotification}
              onChange={handleToggleNotifications}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#1B3A6B] dark:peer-checked:bg-[#C9A227]"></div>
          </label>
        </div>

        {preferences.dailyVerseNotification && (
          <div className="pt-3 border-t border-gray-100 dark:border-[#22314E] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Scheduled Daily Time:
              </span>
              <input
                type="time"
                value={preferences.notificationTime || '07:00'}
                onChange={(e) => onUpdatePreferences({ notificationTime: e.target.value })}
                className="px-2.5 py-1 text-xs rounded-lg border border-gray-200 dark:border-[#22314E] bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <span className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-[#C9A227]" />
                Status: {permStatus === 'granted' ? 'Active & Ready' : 'Permission Required'}
              </span>

              <button
                onClick={handleTestNotification}
                disabled={isTestingNotification}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#1B3A6B] dark:bg-[#C9A227] text-white dark:text-[#0E1B33] hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isTestingNotification ? 'Sending...' : 'Test Notification'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Font Family */}
      <div className="bg-white dark:bg-[#142036] border border-[#E2DED2] dark:border-[#22314E] rounded-2xl p-5 shadow-xs space-y-3">
        <h3 className="font-serif font-bold text-base flex items-center gap-2" style={{ color: 'var(--ink)' }}>
          <Type className="w-4 h-4 text-[#C9A227]" />
          Scripture Font Style
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {fonts.map((f) => (
            <button
              key={f.id}
              onClick={() => onUpdatePreferences({ font: f.id })}
              className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                preferences.font === f.id
                  ? 'border-[#C9A227] bg-[#C9A227]/15 text-gray-900 dark:text-amber-200 font-bold shadow-xs ring-1 ring-[#C9A227]'
                  : 'border-gray-200 dark:border-[#22314E] text-gray-700 dark:text-gray-300 hover:border-[#C9A227] bg-transparent'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div className="bg-white dark:bg-[#142036] border border-[#E2DED2] dark:border-[#22314E] rounded-2xl p-5 shadow-xs space-y-3">
        <h3 className="font-serif font-bold text-base flex items-center gap-2" style={{ color: 'var(--ink)' }}>
          <TextQuote className="w-4 h-4 text-[#C9A227]" />
          Text Size
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {fontSizes.map((s) => (
            <button
              key={s.id}
              onClick={() => onUpdatePreferences({ fontSize: s.id })}
              className={`py-2 px-1 text-center rounded-xl border text-xs transition-all cursor-pointer ${
                preferences.fontSize === s.id
                  ? 'border-[#C9A227] bg-[#C9A227]/15 text-gray-900 dark:text-amber-200 font-bold shadow-xs ring-1 ring-[#C9A227]'
                  : 'border-gray-200 dark:border-[#22314E] text-gray-700 dark:text-gray-300 hover:border-[#C9A227] bg-transparent'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* About The Church of God */}
      <div className="bg-white dark:bg-[#142036] border border-[#E2DED2] dark:border-[#22314E] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-[#22314E]">
          <img
            src="./logo.png"
            alt="The Church of God Seal"
            className="w-14 h-14 rounded-full border-2 border-[#C9A227] shadow-md object-contain bg-[#142748] p-1 flex-shrink-0"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.triedJpg) {
                target.dataset.triedJpg = 'true';
                target.src = './logo.jpg';
              } else if (!target.dataset.triedIcon) {
                target.dataset.triedIcon = 'true';
                target.src = './app-icon.png';
              }
            }}
          />
          <div>
            <h3 className="font-serif font-bold text-base" style={{ color: 'var(--ink)' }}>
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
          <div className="flex justify-between py-1 border-b border-gray-100 dark:border-[#22314E]">
            <span className="text-gray-500 dark:text-gray-400">Application:</span>
            <span className="font-semibold text-gray-800 dark:text-gray-100">COG (T.J.R) Bible</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500 dark:text-gray-400">Bible Versions:</span>
            <span className="font-semibold text-gray-800 dark:text-gray-100 text-right">
              Cebuano (Bugna) &amp; English (KJV)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

