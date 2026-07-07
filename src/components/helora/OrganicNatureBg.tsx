'use client';

import { motion } from 'framer-motion';

interface OrganicNatureBgProps {
  variant?: 'hero' | 'sage' | 'light' | 'dark';
  className?: string;
}

/**
 * Lightweight organic nature background using CSS blur instead of
 * expensive SVG feGaussianBlur filters. Hardware-accelerated.
 */
export function OrganicNatureBg({ variant = 'sage', className = '' }: OrganicNatureBgProps) {
  if (variant === 'hero') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2605] via-[#283106] to-[#2a3a0a]" />

        {/* Bokeh circles — CSS blur (GPU-accelerated, no SVG filters) */}
        <div className="absolute top-[15%] left-[5%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full bg-[#777F5C]/25 blur-[80px]" />
        <div className="absolute top-[30%] right-[10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-[#5a6640]/15 blur-[100px]" />
        <div className="absolute top-[5%] right-[15%] w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] rounded-full bg-[#4a7a5a]/10 blur-[70px]" />
        <div className="absolute bottom-[10%] left-[25%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full bg-[#777F5C]/12 blur-[60px]" />
        <div className="absolute bottom-[20%] left-[-5%] w-[35vw] h-[35vw] max-w-[350px] max-h-[350px] rounded-full bg-[#4a7a5a]/8 blur-[60px]" />

        {/* Floating leaf — hidden on mobile for performance */}
        <motion.div
          className="absolute hidden md:block"
          style={{ top: '15%', left: '10%', width: 100, height: 100 }}
          animate={{ y: [0, -12, 0], rotate: [0, 4, -2, 0], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M30 5 Q52 18, 48 40 Q44 56, 25 55 Q6 54, 8 35 Q10 16, 30 5Z" fill="#777F5C" opacity="0.3" />
          </svg>
        </motion.div>

        <motion.div
          className="absolute hidden md:block"
          style={{ top: '55%', right: '8%', width: 70, height: 70 }}
          animate={{ y: [0, 10, -6, 0], rotate: [0, -3, 5, 0], opacity: [0.08, 0.14, 0.08] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        >
          <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M30 5 Q52 18, 48 40 Q44 56, 25 55 Q6 54, 8 35 Q10 16, 30 5Z" fill="#4a7a5a" opacity="0.25" />
          </svg>
        </motion.div>
      </div>
    );
  }

  if (variant === 'dark') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
        <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] max-w-[300px] max-h-[300px] rounded-full bg-[#777F5C]/8 blur-[60px]" />
        <div className="absolute top-[40%] right-[5%] w-[50vw] h-[50vw] max-w-[400px] max-h-[400px] rounded-full bg-[#5a6640]/6 blur-[70px]" />
      </div>
    );
  }

  if (variant === 'light') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
        <div className="absolute top-[20%] right-[10%] w-[45vw] h-[45vw] max-w-[350px] max-h-[350px] rounded-full bg-[#777F5C]/5 blur-[70px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[35vw] h-[35vw] max-w-[250px] max-h-[250px] rounded-full bg-[#A39B82]/4 blur-[50px]" />
      </div>
    );
  }

  /* variant === 'sage' */
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute top-[10%] right-[10%] w-[40vw] h-[40vw] max-w-[300px] max-h-[300px] rounded-full bg-[#777F5C]/6 blur-[60px]" />
      <div className="absolute bottom-[20%] left-[5%] w-[30vw] h-[30vw] max-w-[220px] max-h-[220px] rounded-full bg-[#777F5C]/4 blur-[50px]" />
    </div>
  );
}

/**
 * Floating leaf decoration — CSS-only animation, hidden on mobile
 */
export function FloatingLeaf({ className = '', size = 'md', color = 'sage' }: { className?: string; size?: 'sm' | 'md' | 'lg'; color?: 'sage' | 'dark' | 'sienna' }) {
  const sizeMap = { sm: 32, md: 48, lg: 64 };
  const colorMap = { sage: 'rgba(119,127,92,0.12)', dark: 'rgba(40,49,6,0.12)', sienna: 'rgba(156,97,70,0.12)' };
  const s = sizeMap[size];
  const c = colorMap[color];

  return (
    <div
      className={`pointer-events-none select-none hidden md:block animate-drift ${className}`}
      aria-hidden="true"
    >
      <svg width={s} height={s} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M30 5 Q52 18, 48 40 Q44 56, 25 55 Q6 54, 8 35 Q10 16, 30 5Z"
          fill={c}
        />
      </svg>
    </div>
  );
}

/**
 * Organic branch decoration — hidden on mobile
 */
export function OrganicBranch({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return (
    <div
      className={`pointer-events-none select-none hidden md:block ${className}`}
      aria-hidden="true"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
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