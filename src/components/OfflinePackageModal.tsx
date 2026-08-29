import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, CheckCircle2, AlertCircle, HardDrive, Sparkles, X, ShieldCheck } from 'lucide-react';
import { EMBEDDED_LOGO_DATA_URI } from '../data/logoAsset';

interface OfflinePackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDownloading: boolean;
  downloadProgress: { current: number; total: number; currentBook: string };
  isFullyDownloaded: boolean;
  onStartDownload: () => void;
}

export const OfflinePackageModal: React.FC<OfflinePackageModalProps> = ({
  isOpen,
  onClose,
  isDownloading,
  downloadProgress,
  isFullyDownloaded,
  onStartDownload,
}) => {
  if (!isOpen) return null;

  const percentage = downloadProgress.total > 0 
    ? Math.round((downloadProgress.current / downloadProgress.total) * 100) 
    : 0;

  return (
    <AnimatePresence>
      <div 
        id="offline-package-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in"
      >
        <motion.div
          id="offline-package-modal-container"
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white dark:bg-[#142036] border border-[#E2DED2] dark:border-[#22314E] rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden text-center"
        >
          {/* Header decorative accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-[#142748] via-[#C9A227] to-[#142748]" />

          {/* Close button if not downloading or completed */}
          {!isDownloading && (
            <button
              id="offline-package-close-btn"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Emblem Seal */}
          <div className="mx-auto w-20 h-20 mb-4 relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#C9A227]/20 blur-md animate-pulse" />
            <img
              src={EMBEDDED_LOGO_DATA_URI}
              alt="The Church of God Seal"
              className="w-full h-full rounded-full border-2 border-[#C9A227] shadow-md object-contain bg-[#142748] p-1.5 relative z-10"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Title & Description */}
          <h2 id="offline-package-title" className="font-serif font-bold text-xl sm:text-2xl text-gray-900 dark:text-amber-100 mb-2">
            {isFullyDownloaded 
              ? 'Complete Offline Package Ready!' 
              : 'Download Offline Scripture Package'}
          </h2>

          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {isFullyDownloaded
              ? 'All 66 Books with dual Cebuano (Bugna) & English (KJV) translations are permanently stored in your phone memory. The app is 100% functional without internet connection.'
              : 'To guarantee that the COG Bible works anywhere on your phone with zero internet or cellular data, download and store the complete 66-book scripture package into your device memory.'}
          </p>

          {/* Status / Progress Display */}
          {isDownloading ? (
            <div id="offline-download-progress-box" className="space-y-4 my-4 p-4 rounded-2xl bg-amber-50/70 dark:bg-[#1A2C4B]/60 border border-[#E4C765]/40 text-left">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-200">
                <span className="flex items-center gap-1.5 text-[#C9A227]">
                  <Download className="w-4 h-4 animate-bounce" />
                  Saving to device...
                </span>
                <span>{percentage}% ({downloadProgress.current}/{downloadProgress.total})</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden p-0.5 shadow-inner">
                <div
                  className="bg-linear-to-r from-[#C9A227] to-[#E4C765] h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${Math.max(percentage, 5)}%` }}
                />
              </div>

              <div className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center justify-between">
                <span className="truncate max-w-[200px]">Book: <strong className="text-gray-800 dark:text-gray-100">{downloadProgress.currentBook || 'Preparing...'}</strong></span>
                <span>Storage: IndexedDB</span>
              </div>
            </div>
          ) : isFullyDownloaded ? (
            <div id="offline-download-success-box" className="my-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/50 flex items-center gap-3 text-left">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  Full 66 Books Installed
                </div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Total offline availability confirmed. You can now use the app anywhere in Airplane Mode.
                </div>
              </div>
            </div>
          ) : (
            <div className="my-4 p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 text-left space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-200">
                <HardDrive className="w-4 h-4 text-[#C9A227]" />
                <span>Package Size: <strong>~7 MB total</strong></span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-200">
                <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
                <span>Format: Dual Bilingual Verse Database</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col gap-2.5">
            {isFullyDownloaded ? (
              <button
                id="offline-package-done-btn"
                onClick={onClose}
                className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Start Reading Scriptures
              </button>
            ) : isDownloading ? (
              <button
                disabled
                className="w-full py-3 px-4 rounded-2xl bg-gray-400 text-white font-bold text-sm opacity-80 cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 animate-spin" />
                Downloading &amp; Saving Package ({percentage}%)...
              </button>
            ) : (
              <>
                <button
                  id="offline-package-download-btn"
                  onClick={onStartDownload}
                  className="w-full py-3.5 px-4 rounded-2xl bg-linear-to-r from-[#1B3A6B] to-[#142748] dark:from-[#C9A227] dark:to-[#B38F1E] text-white dark:text-[#0E1B33] font-bold text-sm sm:text-base shadow-lg hover:shadow-xl active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 border border-[#E4C765]/40"
                >
                  <Download className="w-5 h-5 text-[#E4C765] dark:text-[#0E1B33]" />
                  Download Offline Package Now
                </button>
                <button
                  id="offline-package-later-btn"
                  onClick={onClose}
                  className="w-full py-2.5 px-4 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-800/40 transition-all cursor-pointer"
                >
                  Maybe Later (Continue with Current Book)
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
