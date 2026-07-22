'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/helora-store';

/* ==========================================================================
 * LIQUID MOUSE-REACTIVE HERO BACKGROUND
 * ==========================================================================
 *
 * 3 large gradient blobs follow the mouse at different speeds via rAF,
 * creating a parallax depth effect that feels like a liquid surface.
 *
 *   Blob A (lerp 0.015): deep green, largest  - slow, background
 *   Blob B (lerp 0.03):  sage green, medium   - mid layer
 *   Blob C (lerp 0.05):  warm sienna, smallest - fast accent
 *
 * When idle >3 s, ambient sine drift takes over.
 * On mobile (no mouse), ambient drift plays continuously.
 *
 * Performance: transform-only via rAF. No filter:blur().
 * ========================================================================== */

interface BlobCfg {
  lerp: number;
  range: number;
  offX: number;
  offY: number;
}

const BLOBS: [BlobCfg, BlobCfg, BlobCfg] = [
  { lerp: 0.015, range: 0.12, offX: -0.05, offY: -0.08 },
  { lerp: 0.03,  range: 0.18, offX:  0.08, offY:  0.04 },
  { lerp: 0.05,  range: 0.22, offX: -0.03, offY:  0.06 },
];

function useLiquidBlobs(containerRef: React.RefObject<HTMLElement | null>) {
  const blob0 = useRef<HTMLDivElement>(null);
  const blob1 = useRef<HTMLDivElement>(null);
  const blob2 = useRef<HTMLDivElement>(null);
  const blobs = [blob0, blob1, blob2] as const;

  const st = useRef({
    mx: 0, my: 0,
    pos: [[0, 0], [0, 0], [0, 0]] as [number, number][],
    phase: 0,
    raf: 0,
    hasMouse: false,
    lastMove: 0,
  });

  /* Animation loop — uses ref to avoid stale closure */
  const tickRef = useRef<() => void>(() => {});

  useEffect(() => {
    tickRef.current = () => {
      const s = st.current;
      const el = containerRef.current;
      if (!el) return;

      s.phase += 0.004;
      const elapsed = performance.now() - s.lastMove;
      const mW = s.hasMouse ? Math.max(0, 1 - elapsed / 3000) : 0;
      const vw = el.clientWidth;
      const vh = el.clientHeight;

      for (let i = 0; i < 3; i++) {
        const c = BLOBS[i];
        const blob = blobs[i].current;
        if (!blob) continue;

        const aX = Math.sin(s.phase * (0.7 + i * 0.3) + i * 2.1) * 20
                 + Math.sin(s.phase * 0.4 + i * 4.3) * 10;
        const aY = Math.cos(s.phase * (0.5 + i * 0.25) + i * 1.7) * 15
                 + Math.cos(s.phase * 0.35 + i * 3.1) * 8;

        const tx = s.mx * c.range + c.offX + aX * mW;
        const ty = s.my * c.range + c.offY + aY * mW;

        s.pos[i][0] += (tx - s.pos[i][0]) * c.lerp;
        s.pos[i][1] += (ty - s.pos[i][1]) * c.lerp;

        blob.style.transform = `translate(${s.pos[i][0] * vw}px, ${s.pos[i][1] * vh}px)`;
      }

      s.raf = requestAnimationFrame(tickRef.current!);
    };
  });

  /* Start / stop animation */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mq.matches) st.current.raf = requestAnimationFrame(tickRef.current!);

    function onChange(m: MediaQueryListEvent) {
      if (m.matches) cancelAnimationFrame(st.current.raf);
      else st.current.raf = requestAnimationFrame(tickRef.current!);
    }
    mq.addEventListener('change', onChange);
    return () => {
      cancelAnimationFrame(st.current.raf);
      mq.removeEventListener('change', onChange);
    };
  }, []);

  /* Mouse tracking */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function onMove(e: MouseEvent) {
      const r = el.getBoundingClientRect();
      st.current.mx = (e.clientX - r.left) / r.width - 0.5;
      st.current.my = (e.clientY - r.top) / r.height - 0.5;
      st.current.hasMouse = true;
      st.current.lastMove = performance.now();
    }

    el.addEventListener('mousemove', onMove, { passive: true });
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  return blobs;
}

export function HeroSection() {
  const setView = useAppStore((s) => s.setView);
  const sectionRef = useRef<HTMLElement>(null);
  const [blob0, blob1, blob2] = useLiquidBlobs(sectionRef);

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

        {/* Blob A - large, deep canopy glow, slow follow */}
        <div className="absolute inset-0">
          <div
            ref={blob0}
            className="absolute will-change-transform"
            style={{
              top: '10%',
              left: '20%',
              width: '80vw',
              height: '65vh',
              maxWidth: 800,
              maxHeight: 600,
              borderRadius: '50%',
              background:
                'radial-gradient(ellipse at 50% 45%, rgba(65,90,30,0.22) 0%, rgba(50,72,22,0.10) 40%, transparent 70%)',
            }}
          />
        </div>

        {/* Blob B - medium, sage light shaft, medium follow */}
        <div className="absolute inset-0">
          <div
            ref={blob1}
            className="absolute will-change-transform"
            style={{
              top: '25%',
              left: '35%',
              width: '60vw',
              height: '55vh',
              maxWidth: 600,
              maxHeight: 450,
              borderRadius: '50%',
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(100,115,65,0.15) 0%, rgba(80,95,50,0.06) 45%, transparent 70%)',
            }}
          />
        </div>

        {/* Blob C - small, warm sienna accent, fast follow */}
        <div className="absolute inset-0">
          <div
            ref={blob2}
            className="absolute will-change-transform"
            style={{
              bottom: '18%',
              right: '12%',
              width: '45vw',
              height: '42vh',
              maxWidth: 400,
              maxHeight: 360,
              borderRadius: '50%',
              background:
                'radial-gradient(ellipse at 55% 55%, rgba(156,97,70,0.10) 0%, rgba(140,85,58,0.04) 45%, transparent 68%)',
            }}
          />
        </div>

        {/* Central canopy light + vignette for depth */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              'radial-gradient(ellipse at 50% 35%, rgba(85,105,50,0.06) 0%, transparent 50%)',
              'radial-gradient(ellipse at 50% 45%, transparent 35%, rgba(10,16,3,0.40) 100%)',
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
