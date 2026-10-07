import React from 'react';
import { motion } from 'motion/react';

interface SachBiteLogoProps {
  variant?: 'full' | 'horizontal' | 'icon-only' | 'splash';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  animated?: boolean;
  showTagline?: boolean;
  showScooter?: boolean;
  taglineText?: string;
  showPartnerBadge?: boolean;
  className?: string;
}

/**
 * Official SachBite Brand Emblem & Logotype
 * Features:
 * - Orange/Red gradient dynamic "S"
 * - Chef hat on top
 * - Fork top arm & Spoon lower bowl negative-space silhouette
 * - 3 Speed / delivery motion trails
 * - Bold SachBite logotype with 🛵
 * - Tagline: "Food delivered with love ❤️"
 */
export const SachBiteLogo: React.FC<SachBiteLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  animated = false,
  showTagline = true,
  showScooter = true,
  taglineText = 'Food delivered with love ❤️',
  showPartnerBadge = false,
  className = '',
}) => {
  // Dimension sizing maps
  const iconDimensions = {
    xs: { w: 22, h: 22, text: 'text-sm', sub: 'text-[9px]', scooter: 'text-sm' },
    sm: { w: 30, h: 30, text: 'text-base sm:text-lg', sub: 'text-[10px]', scooter: 'text-base' },
    md: { w: 40, h: 40, text: 'text-xl', sub: 'text-xs', scooter: 'text-xl' },
    lg: { w: 58, h: 58, text: 'text-2xl sm:text-3xl', sub: 'text-xs sm:text-sm', scooter: 'text-2xl sm:text-3xl' },
    xl: { w: 85, h: 85, text: 'text-3xl sm:text-4xl', sub: 'text-sm sm:text-base', scooter: 'text-3xl sm:text-4xl' },
    '2xl': { w: 130, h: 130, text: 'text-4xl sm:text-5xl', sub: 'text-base sm:text-lg', scooter: 'text-4xl sm:text-5xl' },
  }[size];

  // SVG Icon Component
  const LogoIcon = (
    <svg
      viewBox="0 0 200 200"
      width={iconDimensions.w}
      height={iconDimensions.h}
      className="shrink-0 overflow-visible select-none drop-shadow-xs"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Main Brand Flame Gradient */}
        <linearGradient id="sbGradientMain" x1="20" y1="20" x2="180" y2="190" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff7a1a" />
          <stop offset="50%" stopColor="#ff4d00" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>

        {/* Speed Trail Gradient */}
        <linearGradient id="sbGradientSpeed" x1="0" y1="0" x2="70" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff9f43" />
          <stop offset="100%" stopColor="#ff5200" />
        </linearGradient>

        {/* Shadow filter */}
        <filter id="sbDropShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#ff4d00" floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter="url(#sbDropShadow)">
        {/* --- 1. Chef's Hat on top --- */}
        <g transform="translate(102, 10)">
          {/* Chef Hat Puffs */}
          <path
            d="M 12,38 C 4,38 0,32 0,26 C 0,18 7,12 16,12 C 17,6 23,0 32,0 C 41,0 47,6 48,12 C 57,12 64,18 64,26 C 64,32 60,38 52,38 Z"
            fill="url(#sbGradientMain)"
          />
          {/* Hat Band Base */}
          <rect x="10" y="36" width="44" height="7" rx="3" fill="url(#sbGradientMain)" />
        </g>

        {/* --- 2. Left Delivery Speed Trails (3 Horizontal rounded bars) --- */}
        {/* Top Speed Bar */}
        <rect x="42" y="70" width="28" height="7" rx="3.5" fill="url(#sbGradientSpeed)" />
        {/* Middle Speed Bar (Longest) */}
        <rect x="22" y="85" width="48" height="8" rx="4" fill="url(#sbGradientSpeed)" />
        {/* Bottom Speed Bar */}
        <rect x="42" y="101" width="28" height="7" rx="3.5" fill="url(#sbGradientSpeed)" />

        {/* --- 3. Dynamic "S" Body with integrated Fork & Spoon --- */}
        {/* Main "S" Silhouette */}
        <path
          d="M 125,32 
             C 155,32 178,50 178,74 
             C 178,96 160,110 138,118 
             C 165,124 184,142 184,166 
             C 184,192 152,210 115,210 
             C 72,210 52,185 52,158 
             C 52,142 62,130 75,130 
             C 86,130 94,138 94,149 
             C 94,162 103,172 118,172 
             C 134,172 144,162 144,150 
             C 144,134 126,126 102,120 
             C 75,114 55,98 55,74 
             C 55,48 85,32 125,32 Z"
          fill="url(#sbGradientMain)"
        />

        {/* Negative Space Cutouts for Cutlery inside the "S" */}
        {/* 1. Fork Silhouette in upper loop (pointing right/up) */}
        <g fill="#ffffff">
          {/* Fork Stem & Neck */}
          <path d="M 85,78 C 96,65 110,60 126,62 L 132,63 C 130,56 135,52 142,53 C 146,54 148,56 150,60 L 158,61 C 158,57 160,54 165,55 C 170,56 170,60 170,63 L 175,64 C 178,65 180,68 180,72 C 180,76 177,78 173,78 L 140,78 C 120,78 102,86 92,94 Z" opacity="0.95" />
          {/* Fork Prongs Accents */}
          <path d="M 148,46 L 175,54" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <path d="M 142,52 L 174,62" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <path d="M 136,58 L 170,70" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* 2. Spoon Silhouette in lower loop (curving inwards) */}
        <ellipse
          cx="122"
          cy="154"
          rx="18"
          ry="24"
          transform="rotate(-25 122 154)"
          fill="#ffffff"
          opacity="0.95"
        />
        {/* Spoon Handle Tail */}
        <path
          d="M 98,118 C 105,126 112,136 116,146 L 108,150 C 103,138 96,128 89,122 Z"
          fill="#ffffff"
          opacity="0.95"
        />
      </g>
    </svg>
  );

  // Splash Screen Full Variant with Animation
  if (variant === 'splash') {
    return (
      <div className={`flex flex-col items-center justify-center text-center ${className}`}>
        {/* Glow halo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.1, opacity: 0.15 }}
          transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute w-48 h-48 rounded-full bg-gradient-to-tr from-[#ff4d00] to-[#ff7a1a] blur-2xl pointer-events-none"
        />

        {/* Animated Emblem */}
        <motion.div
          initial={{ scale: 0.5, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 220,
            damping: 18,
            duration: 0.8,
          }}
          className="relative z-10 flex items-center justify-center mb-3"
        >
          {LogoIcon}
        </motion.div>

        {/* Wordmark: SachBite 🛵 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="relative z-10 flex items-center justify-center space-x-1.5 tracking-tight font-black"
        >
          <div className="flex items-center">
            <span className="text-4xl sm:text-5xl font-black text-[#1e1e1e] tracking-tight">Sach</span>
            <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-[#ff7a1a] via-[#ff4d00] to-[#e11d48] bg-clip-text text-transparent tracking-tight">
              Bite
            </span>
          </div>
          {showScooter && (
            <span className="text-3xl sm:text-4xl transform -scale-x-100 inline-block animate-pulse" role="img" aria-label="delivery scooter">
              🛵
            </span>
          )}
        </motion.div>

        {/* Tagline: Food delivered with love ❤️ */}
        {showTagline && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="relative z-10 mt-2 flex items-center justify-center text-sm sm:text-base font-bold text-gray-700 tracking-wide"
          >
            <span>{taglineText}</span>
          </motion.div>
        )}

        {/* Partner Badge */}
        {showPartnerBadge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.85, duration: 0.4 }}
            className="relative z-10 mt-3.5 inline-flex items-center space-x-1.5 px-3.5 py-1 bg-[#fff1e6] border border-[#ff7a1a]/30 rounded-full shadow-2xs"
          >
            <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-ping" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#b25511]">
              Restaurant Partner
            </span>
          </motion.div>
        )}
      </div>
    );
  }

  // Full Stacked Variant (For Login, About, Reports, Standees)
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <div className="relative flex items-center justify-center mb-1">{LogoIcon}</div>
        <div className="flex items-center justify-center space-x-1">
          <div className="flex items-center">
            <span className={`${iconDimensions.text} font-black text-[#1e1e1e] tracking-tight`}>Sach</span>
            <span className={`${iconDimensions.text} font-black bg-gradient-to-r from-[#ff7a1a] to-[#e11d48] bg-clip-text text-transparent tracking-tight`}>
              Bite
            </span>
          </div>
          {showScooter && (
            <span className={`${iconDimensions.scooter} transform -scale-x-100 inline-block`} role="img" aria-label="scooter">
              🛵
            </span>
          )}
        </div>
        {showTagline && (
          <div className="mt-0.5 flex items-center justify-center text-gray-700 font-semibold tracking-wide">
            <span className={iconDimensions.sub}>{taglineText}</span>
          </div>
        )}
        {showPartnerBadge && (
          <span className="mt-1.5 inline-block text-[10px] font-black uppercase tracking-widest text-[#b25511] bg-[#fff1e6] px-2.5 py-0.5 rounded-full border border-[#ff7a1a]/20">
            Partner App
          </span>
        )}
      </div>
    );
  }

  // Icon Only Variant
  if (variant === 'icon-only') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{LogoIcon}</div>;
  }

  // Horizontal Header/Navbar Variant (Default)
  return (
    <div className={`inline-flex items-center space-x-2 shrink-0 select-none ${className}`}>
      {/* Mini Brand Emblem */}
      <div className="flex items-center justify-center drop-shadow-2xs">
        {LogoIcon}
      </div>

      {/* Brand Text */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center space-x-1">
          <div className="flex items-center">
            <span className={`${iconDimensions.text} font-black text-[#1e1e1e] tracking-tight`}>Sach</span>
            <span className={`${iconDimensions.text} font-black bg-gradient-to-r from-[#ff7a1a] to-[#e11d48] bg-clip-text text-transparent tracking-tight`}>
              Bite
            </span>
          </div>
          {showScooter && (
            <span className="text-sm sm:text-base transform -scale-x-100 inline-block" role="img" aria-label="scooter">
              🛵
            </span>
          )}
        </div>
        {showTagline && (
          <div className="flex items-center text-[8px] sm:text-[9.5px] font-bold text-gray-500 tracking-tight whitespace-nowrap mt-0.5">
            <span>{taglineText}</span>
          </div>
        )}
      </div>
    </div>
  );
};
