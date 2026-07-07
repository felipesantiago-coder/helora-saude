'use client';

import { motion } from 'framer-motion';

interface OrganicNatureBgProps {
  variant?: 'hero' | 'sage' | 'light' | 'dark';
  className?: string;
}

/**
 * Immersive organic nature background inspired by Helora's brand identity.
 * Uses layered SVG shapes with blur/bokeh effects to recreate the
 * forest canopy / leaf shadow texture from the brand manual.
 */
export function OrganicNatureBg({ variant = 'sage', className = '' }: OrganicNatureBgProps) {
  if (variant === 'hero') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2605] via-[#283106] to-[#2a3a0a]" />

        {/* Organic bokeh layer — large soft circles */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="bokeh-hero-1">
              <feGaussianBlur stdDeviation="60" />
            </filter>
            <filter id="bokeh-hero-2">
              <feGaussianBlur stdDeviation="40" />
            </filter>
            <filter id="bokeh-hero-3">
              <feGaussianBlur stdDeviation="80" />
            </filter>
            <radialGradient id="leaf-glow-1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#777F5C" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#777F5C" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="leaf-glow-2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#5a6640" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#5a6640" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="leaf-glow-3" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#4a7a5a" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#4a7a5a" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Large organic bokeh shapes — simulating forest canopy light */}
          <circle cx="300" cy="200" r="250" fill="url(#leaf-glow-1)" filter="url(#bokeh-hero-1)" />
          <circle cx="900" cy="350" r="300" fill="url(#leaf-glow-2)" filter="url(#bokeh-hero-3)" />
          <circle cx="1200" cy="150" r="200" fill="url(#leaf-glow-3)" filter="url(#bokeh-hero-1)" />
          <circle cx="600" cy="600" r="280" fill="url(#leaf-glow-1)" filter="url(#bokeh-hero-2)" />
          <circle cx="150" cy="700" r="180" fill="url(#leaf-glow-3)" filter="url(#bokeh-hero-1)" />
          <circle cx="1100" cy="700" r="220" fill="url(#leaf-glow-2)" filter="url(#bokeh-hero-2)" />

          {/* Leaf-like organic shapes — blurred flowing forms */}
          <path d="M100 300 Q250 100, 500 200 T800 150 Q950 200, 900 400 T600 500 Q400 450, 200 500 Z" fill="#777F5C" opacity="0.06" filter="url(#bokeh-hero-3)" />
          <path d="M800 400 Q1000 200, 1300 350 Q1400 500, 1200 700 T800 650 Q600 600, 800 400 Z" fill="#5a6640" opacity="0.05" filter="url(#bokeh-hero-3)" />
          <path d="M0 500 Q200 400, 400 550 Q500 700, 300 800 T0 750 Z" fill="#4a7a5a" opacity="0.04" filter="url(#bokeh-hero-3)" />
        </svg>

        {/* Floating leaf particles with animation */}
        <motion.div
          className="absolute"
          style={{ top: '15%', left: '10%', width: 120, height: 120 }}
          animate={{ y: [0, -15, 0], rotate: [0, 5, -3, 0], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M60 10 Q90 40, 80 75 Q70 110, 40 100 Q10 90, 20 55 Q30 20, 60 10Z" fill="#777F5C" opacity="0.3" />
            <path d="M60 10 Q90 40, 80 75 Q70 110, 40 100 Q10 90, 20 55 Q30 20, 60 10Z" fill="none" stroke="#777F5C" strokeWidth="0.5" opacity="0.2" />
            <path d="M55 20 Q60 60, 45 95" stroke="#777F5C" strokeWidth="0.5" opacity="0.15" fill="none" />
          </svg>
        </motion.div>

        <motion.div
          className="absolute"
          style={{ top: '55%', right: '8%', width: 90, height: 90 }}
          animate={{ y: [0, 12, -8, 0], rotate: [0, -4, 6, 0], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        >
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 15 Q70 5, 95 40 Q110 80, 70 105 Q30 120, 15 80 Q5 40, 30 15Z" fill="#4a7a5a" opacity="0.25" />
            <path d="M50 20 Q60 60, 40 100" stroke="#4a7a5a" strokeWidth="0.5" opacity="0.15" fill="none" />
          </svg>
        </motion.div>

        <motion.div
          className="absolute"
          style={{ bottom: '20%', left: '30%', width: 70, height: 70 }}
          animate={{ y: [0, -10, 5, 0], x: [0, 8, 0], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        >
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M60 5 Q100 30, 90 70 Q80 110, 40 100 Q5 85, 15 50 Q25 15, 60 5Z" fill="#5a6640" opacity="0.2" />
            <path d="M60 5 Q100 30, 90 70 Q80 110, 40 100 Q5 85, 15 50 Q25 15, 60 5Z" fill="none" stroke="#5a6640" strokeWidth="0.5" opacity="0.12" />
          </svg>
        </motion.div>

        {/* Subtle noise/grain overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }} />
      </div>
    );
  }

  if (variant === 'dark') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="bokeh-dark-1">
              <feGaussianBlur stdDeviation="50" />
            </filter>
          </defs>
          <circle cx="200" cy="100" r="200" fill="#777F5C" opacity="0.08" filter="url(#bokeh-dark-1)" />
          <circle cx="1100" cy="250" r="250" fill="#5a6640" opacity="0.06" filter="url(#bokeh-dark-1)" />
          <path d="M400 0 Q600 200, 900 100 T1400 200 L1440 0 Z" fill="#777F5C" opacity="0.03" />
        </svg>
      </div>
    );
  }

  if (variant === 'light') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="bokeh-light-1">
              <feGaussianBlur stdDeviation="70" />
            </filter>
          </defs>
          <circle cx="900" cy="200" r="250" fill="#777F5C" opacity="0.05" filter="url(#bokeh-light-1)" />
          <circle cx="200" cy="400" r="180" fill="#A39B82" opacity="0.04" filter="url(#bokeh-light-1)" />
          <path d="M0 300 Q360 100, 720 350 T1440 200 L1440 600 L0 600 Z" fill="#777F5C" opacity="0.02" />
        </svg>
      </div>
    );
  }

  /* variant === 'sage' — default, subtle decorative background */
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="bokeh-sage-1">
            <feGaussianBlur stdDeviation="60" />
          </filter>
        </defs>
        <circle cx="1100" cy="150" r="200" fill="#777F5C" opacity="0.06" filter="url(#bokeh-sage-1)" />
        <circle cx="200" cy="400" r="160" fill="#777F5C" opacity="0.04" filter="url(#bokeh-sage-1)" />
        <path d="M0 200 Q400 400, 800 250 T1440 350 L1440 600 L0 600 Z" fill="#777F5C" opacity="0.025" />
      </svg>
    </div>
  );
}

/**
 * Floating leaf decoration for section accents
 */
export function FloatingLeaf({ className = '', size = 'md', color = 'sage' }: { className?: string; size?: 'sm' | 'md' | 'lg'; color?: 'sage' | 'dark' | 'sienna' }) {
  const sizeMap = { sm: 40, md: 60, lg: 90 };
  const colorMap = { sage: '#777F5C', dark: '#283106', sienna: '#9C6146' };
  const s = sizeMap[size];
  const c = colorMap[color];

  return (
    <motion.div
      className={`pointer-events-none select-none ${className}`}
      animate={{ y: [0, -8, 0], rotate: [0, 3, -2, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden="true"
    >
      <svg width={s} height={s} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M30 5 Q52 18, 48 40 Q44 56, 25 55 Q6 54, 8 35 Q10 16, 30 5Z"
          fill={c}
          opacity="0.12"
        />
        <path
          d="M30 5 Q52 18, 48 40 Q44 56, 25 55 Q6 54, 8 35 Q10 16, 30 5Z"
          fill="none"
          stroke={c}
          strokeWidth="0.5"
          opacity="0.08"
        />
        <path d="M28 10 Q32 30, 26 50" stroke={c} strokeWidth="0.4" opacity="0.1" fill="none" />
      </svg>
    </motion.div>
  );
}

/**
 * Organic branch decoration — subtle curved line with leaf
 */
export function OrganicBranch({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true" style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
      <svg width="120" height="200" viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M60 200 Q55 160, 50 120 Q42 70, 65 30 Q75 10, 80 5"
          stroke="#777F5C"
          strokeWidth="1"
          opacity="0.15"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M65 30 Q80 15, 95 20 Q105 30, 90 40 Q75 48, 65 30Z"
          fill="#777F5C"
          opacity="0.08"
        />
        <path
          d="M50 120 Q35 108, 28 115 Q22 125, 38 128 Q48 130, 50 120Z"
          fill="#777F5C"
          opacity="0.06"
        />
      </svg>
    </div>
  );
}