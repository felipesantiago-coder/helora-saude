'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/helora-store';

/* ==========================================================================
 * LIQUID MOUSE-REACTIVE HERO BACKGROUND
 * ==========================================================================
 *
 * Single useEffect drives 3 gradient blobs via rAF.
 * Ambient sine drift is ALWAYS active and clearly visible (~8-12 s cycles).
 * Mouse movement adds directional pull that fades over 2.5 s.
 *
 * Blob A: deep green,  largest  — slow, background
 * Blob B: sage green,  medium   — mid layer
 * Blob C: warm sienna, smallest — fast accent
 *
 * All maths in viewport-fraction units. No filter:blur().
 * ========================================================================== */

export function HeroSection() {
  const setView = useAppStore((s) => s.setView);
  const sectionRef = useRef<HTMLElement>(null);
  const blob0 = useRef<HTMLDivElement>(null);
  const blob1 = useRef<HTMLDivElement>(null);
  const blob2 = useRef<HTMLDivElement>(null);

  /* ------------------------------------------------------------------
   * Single effect: animation loop + mouse tracking + lifecycle
   * ---------------------------------------------------------------- */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const refs = [blob0, blob1, blob2] as const;

    /* State — all mutable, read each frame */
    const mx = { v: 0 };
    const my = { v: 0 };
    const lastMove = { v: 0 };
    const pos: [number, number][] = [[0, 0], [0, 0], [0, 0]];
    let phase = 0;
    let rafId = 0;

    /* Per-blob config: [lerp, mouseRange, offsetX, offsetY, driftAmplitude] */
    const cfg = [
      [0.04,  0.25, -0.04, -0.03, 0.09],  // A: large, slow
      [0.06,  0.35,  0.05,  0.03, 0.12],  // B: medium
      [0.08,  0.45, -0.02,  0.04, 0.15],  // C: small, fast
    ] as const;

    function tick() {
      phase += 0.012;

      const elapsed = performance.now() - lastMove.v;
      const mw = Math.max(0, 1 - elapsed / 3000); // 3 s fade

      const vw = section.clientWidth;
      const vh = section.clientHeight;

      for (let i = 0; i < 3; i++) {
        const el = refs[i].current;
        if (!el) continue;

        const [lr, mRange, ox, oy, amp] = cfg[i];

        /* Ambient drift — always active, vp-fraction units */
        const dx = (
          Math.sin(phase * (0.8 + i * 0.35) + i * 2.3) * 0.65 +
          Math.sin(phase * 0.5 + i * 4.7) * 0.35
        ) * amp;
        const dy = (
          Math.cos(phase * (0.6 + i * 0.3) + i * 1.9) * 0.65 +
          Math.cos(phase * 0.4 + i * 3.5) * 0.35
        ) * amp;

        /* Target = ambient + mouse pull + base offset */
        const tx = dx + mx.v * mRange * mw + ox;
        const ty = dy + my.v * mRange * mw + oy;

        pos[i][0] += (tx - pos[i][0]) * lr;
        pos[i][1] += (ty - pos[i][1]) * lr;

        el.style.transform = `translate(${pos[i][0] * vw}px, ${pos[i][1] * vh}px)`;
      }

      rafId = requestAnimationFrame(tick);
    }

    /* Respect prefers-reduced-motion */
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mq.matches) {
      rafId = requestAnimationFrame(tick);
    }

    function onMotionChange(e: MediaQueryListEvent) {
      if (e.matches) cancelAnimationFrame(rafId);
      else rafId = requestAnimationFrame(tick);
    }
    mq.addEventListener('change', onMotionChange);

    /* Mouse tracking */
    function onMouseMove(e: MouseEvent) {
      const r = section.getBoundingClientRect();
      mx.v = (e.clientX - r.left) / r.width - 0.5;
      my.v = (e.clientY - r.top) / r.height - 0.5;
      lastMove.v = performance.now();
    }
    section.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      mq.removeEventListener('change', onMotionChange);
      section.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
    >
      {/* - Liquid Background - */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Smooth natural base gradient — canopy-to-understory depth */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(175deg, #182405 0%, #1f2e07 25%, #283106 50%, #273009 75%, #242c0a 100%)',
          }}
        />

        {/* Blob A - large, deep canopy glow, slow drift */}
        <div className="absolute inset-0">
          <div
            ref={blob0}
            className="absolute will-change-transform"
            style={{
              top: '5%',
              left: '15%',
              width: '85vw',
              height: '70vh',
              maxWidth: 850,
              maxHeight: 650,
              borderRadius: '50%',
              background:
                'radial-gradient(ellipse at 50% 45%, rgba(75,100,38,0.45) 0%, rgba(60,82,30,0.22) 40%, transparent 72%)',
            }}
          />
        </div>

        {/* Blob B - medium, sage light shaft, medium drift */}
        <div className="absolute inset-0">
          <div
            ref={blob1}
            className="absolute will-change-transform"
            style={{
              top: '20%',
              left: '30%',
              width: '65vw',
              height: '58vh',
              maxWidth: 650,
              maxHeight: 480,
              borderRadius: '50%',
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(115,132,75,0.38) 0%, rgba(95,110,60,0.16) 42%, transparent 72%)',
            }}
          />
        </div>

        {/* Blob C - small, warm sienna accent, fast drift */}
        <div className="absolute inset-0">
          <div
            ref={blob2}
            className="absolute will-change-transform"
            style={{
              bottom: '15%',
              right: '8%',
              width: '50vw',
              height: '48vh',
              maxWidth: 450,
              maxHeight: 400,
              borderRadius: '50%',
              background:
                'radial-gradient(ellipse at 55% 55%, rgba(160,100,72,0.30) 0%, rgba(145,88,60,0.12) 42%, transparent 70%)',
            }}
          />
        </div>

        {/* Central canopy light + vignette for depth */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              'radial-gradient(ellipse at 50% 35%, rgba(90,110,55,0.12) 0%, transparent 50%)',
              'radial-gradient(ellipse at 50% 45%, transparent 35%, rgba(10,16,3,0.30) 100%)',
            ].join(', '),
          }}
        />
      </div>

      {/* - Content - */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <motion.h1
          className="font-serif font-light text-[1.85rem] sm:text-[2.75rem] md:text-5xl lg:text-6xl text-white tracking-tight text-balance leading-[1.2] mb-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
        >
          Cuidar de você é
          <br />
          <span className="text-helora-gainsboro/75">nossa essência.</span>
        </motion.h1>

        <motion.p
          className="font-sans text-helora-gainsboro/60 text-[0.938rem] sm:text-base md:text-[1.063rem] max-w-md mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay: 0.5 }}
        >
          Um espaço de acolhimento onde você pode respirar, ser ouvido e cuidar de si. Sem pressa, sem julgamento.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay: 0.65 }}
        >
          <button
            onClick={() => setView('booking')}
            className="btn-pill bg-helora-sage text-white font-medium py-3 px-7 sm:py-3.5 sm:px-9 hover:bg-helora-gainsboro/25 hover:text-white border border-helora-sage/40 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-helora-sage/50 text-sm sm:text-base active:scale-[0.98] w-full sm:w-auto"
          >
            Agendar sua primeira sessão
          </button>
          <button
            onClick={() => {
              document.getElementById('equipe')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="font-sans font-medium text-sm text-helora-gainsboro/60 hover:text-white/90 border border-helora-gainsboro/15 hover:border-helora-gainsboro/35 rounded-full px-6 py-2.5 sm:py-3 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-helora-sage/50"
          >
            Conheça a equipe
          </button>
        </motion.div>
      </div>

      {/* - Bottom transition - */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-10" aria-hidden="true">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          preserveAspectRatio="none"
          style={{ height: 'clamp(30px, 5vw, 60px)' }}
        >
          <path
            d="M0 20 Q360 55, 720 30 Q1080 5, 1440 40 L1440 60 L0 60Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    </section>
  );
}
