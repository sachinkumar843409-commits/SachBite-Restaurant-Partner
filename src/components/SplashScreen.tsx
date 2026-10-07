import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { SachBiteLogo } from './SachBiteLogo';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#ffffff] via-[#fafafa] to-[#fff7ed] select-none overflow-hidden px-4">
      {/* Background ambient lighting */}
      <div className="absolute w-80 h-80 rounded-full bg-[#ff7a1a]/15 blur-3xl -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-96 h-96 rounded-full bg-[#ff4d00]/10 blur-3xl -bottom-24 -right-24 pointer-events-none" />

      <div className="relative flex flex-col items-center z-10 w-full max-w-sm">
        {/* Official SachBite Animated Splash Logo */}
        <SachBiteLogo
          variant="splash"
          size="2xl"
          showTagline={true}
          showPartnerBadge={true}
          className="mb-4"
        />

        {/* Animated Loading Bar with Flame Glow */}
        <div className="mt-8 w-48 h-1.5 bg-gray-200/80 rounded-full overflow-hidden relative shadow-inner">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              ease: 'easeInOut',
            }}
            className="w-1/2 h-full bg-gradient-to-r from-[#ff7a1a] via-[#ff4d00] to-[#e11d48] rounded-full shadow-[0_0_12px_#ff4d00]"
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mt-3 text-xs text-gray-500 font-medium tracking-wide text-center"
        >
          Connecting live kitchen & orders radar...
        </motion.p>
      </div>

      {/* Footer Branding */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-6 text-center px-4"
      >
        <p className="text-[11px] text-gray-400 font-semibold tracking-wider uppercase">
          Official Merchant Portal • SachBite Ecosystem
        </p>
      </motion.div>
    </div>
  );
};
