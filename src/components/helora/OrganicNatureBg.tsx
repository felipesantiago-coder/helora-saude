'use client';

import { motion } from 'framer-motion';

interface OrganicNatureBgProps {
  variant?: 'hero' | 'sage' | 'light' | 'dark';
  className?: string;
}

/**
 * Organic nature background — forest canopy dappled light.
 *
 * Hero bokeh circles use radial-gradient for natural light falloff
 * (bright center, soft edge) instead of flat bg-color + heavy blur.
 * This creates a visible, painterly "light filtering through leaves" effect
 * while still feeling soft and calming.
 *
 * Animations: only scale-based breathing (no opacity changes in keyframes).
 * The opacity is baked into the radial-gradient itself, so there's no
 * opacity mismatch between CSS class and animation keyframes — no jumps.
 * fill-mode: both + cubic-bezier(0.45,0.05,0.55,0.95) ensure buttery smoothness.
 */
export function OrganicNatureBg({ variant = 'sage', className = '' }: OrganicNatureBgProps) {
  if (variant === 'hero') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2605] via-[#283106] to-[#2a3a0a]" />

        {/* ── Forest canopy bokeh circles ──
            Each circle: radial-gradient with built-in opacity falloff.
            Sizes & positions scattered like dappled sunlight through leaves.
            Warm sage, cool sage, and faint green tones for depth. */}

        {/* Large warm glow — upper left, main dappled light source */}
        <div
          className="absolute breathe-a"
          style={{
            top: '5%',
            left: '-5%',
            width: '55vw',
            height: '55vw',
            maxWidth: 550,
            maxHeight: 550,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(170,180,130,0.40) 0%, rgba(140,150,100,0.20) 35%, rgba(119,127,92,0) 70%)',
          }}
        />

        {/* Bright patch — upper right, a gap in the canopy with direct light */}
        <div
          className="absolute breathe-b"
          style={{
            top: '-5%',
            right: '5%',
            width: '45vw',
            height: '45vw',
            maxWidth: 420,
            maxHeight: 420,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(180,190,140,0.38) 0%, rgba(150,160,110,0.18) 40%, rgba(119,127,92,0) 70%)',
          }}
        />

        {/* Warm sienna accent — center-left, warm-toned dappled light */}
        <div
          className="absolute breathe-c"
          style={{
            top: '25%',
            left: '15%',
            width: '40vw',
            height: '40vw',
            maxWidth: 380,
            maxHeight: 380,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(180,145,100,0.30) 0%, rgba(156,97,70,0.12) 40%, rgba(119,127,92,0) 68%)',
          }}
        />

        {/* Cool green light — right-center, lush foliage glow */}
        <div
          className="absolute breathe-a"
          style={{
            top: '35%',
            right: '-2%',
            width: '35vw',
            height: '35vw',
            maxWidth: 320,
            maxHeight: 320,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(120,170,130,0.35) 0%, rgba(90,140,100,0.15) 40%, rgba(74,122,90,0) 70%)',
          }}
        />

        {/* Large diffuse base glow — lower center, ambient forest light */}
        <div
          className="absolute breathe-b"
          style={{
            bottom: '5%',
            left: '20%',
            width: '60vw',
            height: '60vw',
            maxWidth: 600,
            maxHeight: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(150,160,115,0.28) 0%, rgba(119,127,92,0.12) 45%, rgba(90,102,64,0) 75%)',
          }}
        />

        {/* Small bright sun ray — upper center, direct light beam */}
        <div
          className="absolute breathe-c"
          style={{
            top: '12%',
            left: '40%',
            width: '25vw',
            height: '25vw',
            maxWidth: 220,
            maxHeight: 220,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200,210,160,0.40) 0%, rgba(170,180,130,0.15) 50%, rgba(140,150,100,0) 75%)',
          }}
        />

        {/* Bottom-left soft patch — scattered ground-level light */}
        <div
          className="absolute breathe-a"
          style={{
            bottom: '15%',
            left: '-5%',
            width: '30vw',
            height: '30vw',
            maxWidth: 280,
            maxHeight: 280,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(160,168,120,0.32) 0%, rgba(130,138,95,0.12) 45%, rgba(100,110,72,0) 70%)',
          }}
        />

        {/* Right edge light — prevents the right side from being too dark */}
        <div
          className="absolute breathe-b"
          style={{
            top: '55%',
            right: '-8%',
            width: '35vw',
            height: '35vw',
            maxWidth: 340,
            maxHeight: 340,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(145,155,110,0.30) 0%, rgba(119,127,92,0.10) 45%, rgba(100,110,72,0) 72%)',
          }}
        />

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
        <div
          className="absolute breathe-b"
          style={{
            top: '10%',
            left: '5%',
            width: '40vw',
            height: '40vw',
            maxWidth: 300,
            maxHeight: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(119,127,92,0.12) 0%, rgba(119,127,92,0) 70%)',
          }}
        />
        <div
          className="absolute breathe-c"
          style={{
            top: '40%',
            right: '5%',
            width: '50vw',
            height: '50vw',
            maxWidth: 400,
            maxHeight: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(90,102,64,0.08) 0%, rgba(90,102,64,0) 70%)',
          }}
        />
      </div>
    );
  }

  if (variant === 'light') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
        <div
          className="absolute breathe-b"
          style={{
            top: '20%',
            right: '10%',
            width: '45vw',
            height: '45vw',
            maxWidth: 350,
            maxHeight: 350,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(119,127,92,0.08) 0%, rgba(119,127,92,0) 70%)',
          }}
        />
        <div
          className="absolute breathe-a"
          style={{
            bottom: '10%',
            left: '5%',
            width: '35vw',
            height: '35vw',
            maxWidth: 250,
            maxHeight: 250,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(163,155,130,0.06) 0%, rgba(163,155,130,0) 70%)',
          }}
        />
      </div>
    );
  }

  /* variant === 'sage' */
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="absolute breathe-b"
        style={{
          top: '10%',
          right: '10%',
          width: '40vw',
          height: '40vw',
          maxWidth: 300,
          maxHeight: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(119,127,92,0.08) 0%, rgba(119,127,92,0) 70%)',
        }}
      />
      <div
        className="absolute breathe-c"
        style={{
          bottom: '20%',
          left: '5%',
          width: '30vw',
          height: '30vw',
          maxWidth: 220,
          maxHeight: 220,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(119,127,92,0.06) 0%, rgba(119,127,92,0) 70%)',
        }}
      />
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