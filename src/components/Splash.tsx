import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashProps {
  onComplete: () => void;
}

export const Splash: React.FC<SplashProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 400);
    }, 2200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#0E2143] via-[#1B3A6B] to-[#2C548F] px-6 text-center select-none"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-center max-w-sm"
          >
            {/* Emblem logo with golden halo */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#C9A227]/20 blur-xl animate-pulse" />
              <img
                src="./logo.png"
                alt="COG (T.J.R) Bible Seal"
                className="relative w-full h-full object-contain rounded-full border-2 border-[#E4C765] shadow-2xl p-2 bg-[#142748]/80"
                referrerPolicy="no-referrer"
              />
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-white drop-shadow-md"
            >
              The Church of God
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="text-[#E4C765] text-sm sm:text-base font-medium tracking-wider mt-1.5"
            >
              (Truth, Justice, and Righteousness)
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-2 text-xs text-white/70 tracking-widest uppercase font-light"
            >
              Cebuano (Bugna) &amp; English (KJV)
            </motion.div>

            {/* Bouncing gold dots indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-2 mt-8"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#E4C765] animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#E4C765] animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#E4C765] animate-bounce" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
