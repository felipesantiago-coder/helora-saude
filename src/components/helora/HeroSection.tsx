'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/helora-store';

/* ==========================================================================
 * LIQUID MOUSE-REACTIVE HERO BACKGROUND
 * ==========================================================================
 *
 * Physics:
 *   - Mouse movement spawns CONCENTRIC RIPPLE RINGS that expand
 *     outward from the cursor, like dropping a stone in water.
 *   - Ripples spread slowly and smoothly, simulating calm lake waves.
 *   - No blob effects — clean, minimal liquid surface.
 *
 * Performance: CSS animations for ripples (GPU-accelerated).
 * No filter:blur().
 * ========================================================================== */

export function HeroSection() {
  const setView = useAppStore((s) => s.setView);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    /* ── Ripple spawning ── */
    let lastRipple = 0;
    const RIPPLE_INTERVAL = 350; // ms between ripples (was 180, now slower spawn rate)
    const MAX_RIPPLES = 12;

    function spawnRipple(x: number, y: number) {
      const now = performance.now();
      if (now - lastRipple < RIPPLE_INTERVAL) return;
      lastRipple = now;

      const existing = section.querySelectorAll('.liquid-ripple');
      if (existing.length >= MAX_RIPPLES) {
        existing[0].remove();
      }

      /* 2 concentric rings, staggered */
      for (let r = 0; r < 2; r++) {
        const ring = document.createElement('div');
        ring.className = 'liquid-ripple';
        ring.style.left = x + 'px';
        ring.style.top = y + 'px';
        ring.style.animationDelay = (r * 0.5) + 's'; // staggered (was 0.22s, now 0.5s)
        ring.style.width = (r === 0 ? 700 : 520) + 'px';
        ring.style.height = (r === 0 ? 700 : 520) + 'px';
        section.appendChild(ring);
        ring.addEventListener('animationend', () => ring.remove());
      }
    }

    /* ── Lifecycle ── */
    function onMouseMove(e: MouseEvent) {
      const r = section.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      spawnRipple(x, y);
    }

    section.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      section.removeEventListener('mousemove', onMouseMove);
      section.querySelectorAll('.liquid-ripple').forEach((el) => el.remove());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
    >
      {/* Liquid Background — clean gradient, no blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Smooth natural base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(175deg, #182405 0%, #1f2e07 25%, #283106 50%, #273009 75%, #242c0a 100%)',
          }}
        />

        {/* Subtle central canopy light + vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              'radial-gradient(ellipse at 50% 35%, rgba(90,110,55,0.10) 0%, transparent 50%)',
              'radial-gradient(ellipse at 50% 45%, transparent 35%, rgba(10,16,3,0.30) 100%)',
            ].join(', '),
          }}
        />
      </div>

      {/* Content */}
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

      {/* Bottom transition */}
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
