'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/helora-store';

/* ==========================================================================
 * 3D LAKE WAVE HERO BACKGROUND
 * ==========================================================================
 *
 * A real-time water simulation rendered on Canvas using:
 *   1. The discrete WAVE EQUATION on a 256×256 height-field grid.
 *      Neumann (open) boundary conditions let waves exit the grid
 *      smoothly — combined with a render-edge fade + CSS vignette,
 *      the lake appears to extend infinitely beyond the viewport.
 *   2. Per-pixel surface-normal estimation (central differences)
 *      fed into BLINN-PHONG shading (diffuse + specular) with a
 *      directional light from the upper-left.
 *   3. A vertical dark-green gradient composited into every pixel
 *      so the canvas is fully opaque.
 *
 * Mouse click → concentric ripples (gaussian drop).
 * Mouse move → directional canoe wake (gentle perpendicular ridge).
 * No spontaneous waves — only user interaction generates ripples.
 *
 * No filter:blur().  No DOM ripple elements.  No blobs.
 * ========================================================================== */

export function HeroSection() {
  const setView = useAppStore((s) => s.setView);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    /* ── Grid (matches visible canvas — no hidden border) ── */
    const W = 256;
    const H = 256;
    canvas.width = W;
    canvas.height = H;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    /* Two buffers for the wave equation */
    let curr = new Float32Array(W * H);
    let prev = new Float32Array(W * H);

    /* Wave equation constants */
    const DAMPING = 0.992;
    const C2 = 0.12; // c² — wave speed squared
    const CENTER = 2 - 4 * C2; // = 1.52

    /* Drop params (click → concentric ripples) */
    const DROP_RADIUS = 14;
    const DROP_STRENGTH = 8;

    /* Wake params (mouse move → canoe cutting water) */
    const OBJ_THROTTLE = 180; // ms between wake disturbances
    const MIN_MOVE = 5; // min grid-cell movement to trigger wake

    /* Edge fade (render-only — makes waves look like they continue
     * beyond the viewport, like the lake surface curving away) */
    const EDGE_FADE = 40; // pixels from edge where fading begins

    /* Render target */
    const imgData = ctx.createImageData(W, H);
    const px = imgData.data;

    /* ── Pre-compute edge fade LUT (one float per row/column) ── */
    const fadeX = new Float32Array(W);
    const fadeY = new Float32Array(H);
    for (let i = 0; i < W; i++) {
      const d = Math.min(i, W - 1 - i);
      fadeX[i] = d >= EDGE_FADE ? 1.0 : (d / EDGE_FADE);
    }
    for (let i = 0; i < H; i++) {
      const d = Math.min(i, H - 1 - i);
      fadeY[i] = d >= EDGE_FADE ? 1.0 : (d / EDGE_FADE);
    }

    /* ── Lighting (pre-computed once) ── */
    const lx = -0.3, ly = -0.5, lz = 1.0;
    const lLen = Math.sqrt(lx * lx + ly * ly + lz * lz);
    const Lx = lx / lLen, Ly = ly / lLen, Lz = lz / lLen;

    // Blinn-Phong half-vector: H = normalize(L + V), V = (0, 0, 1)
    const hhx = lx, hhy = ly, hhz = lz + 1.0;
    const hLen = Math.sqrt(hhx * hhx + hhy * hhy + hhz * hhz);
    const Hx = hhx / hLen, Hy = hhy / hLen, Hz = hhz / hLen;

    let rafId = 0;
    let lastObjTime = 0;
    let prevGX = -1;
    let prevGY = -1;

    /* ── Click: drop a gaussian stone → concentric ripples ── */
    function addDrop(cx: number, cy: number) {
      const r = DROP_RADIUS;
      const r2 = r * r;
      const icx = Math.floor(cx);
      const icy = Math.floor(cy);
      for (let dy = -r; dy <= r; dy++) {
        const gy = icy + dy;
        if (gy < 0 || gy >= H) continue;
        const dy2 = dy * dy;
        for (let dx = -r; dx <= r; dx++) {
          const gx = icx + dx;
          if (gx < 0 || gx >= W) continue;
          const d2 = dx * dx + dy2;
          if (d2 > r2) continue;
          const f = Math.cos((Math.sqrt(d2) / r) * Math.PI * 0.5);
          curr[gy * W + gx] += DROP_STRENGTH * f * f;
        }
      }
    }

    /* ── Mouse move: directional wake (canoe cutting water) ── */
    // A single gentle ridge perpendicular to the direction of motion.
    // Very low amplitude — the wave equation naturally turns this into
    // a V-shaped wake pattern. No hull depression (was creating noise).
    function setWake(cx: number, cy: number, dirX: number, dirY: number) {
      const perpX = -dirY;
      const perpY = dirX;
      const HALF = 5;
      const scx = Math.floor(cx);
      const scy = Math.floor(cy);

      for (let t = -HALF; t <= HALF; t++) {
        const gx = Math.floor(scx + perpX * t);
        const gy = Math.floor(scy + perpY * t);
        if (gx < 1 || gx >= W - 1 || gy < 1 || gy >= H - 1) continue;
        const f = Math.cos((t / HALF) * Math.PI * 0.5);
        curr[gy * W + gx] += 0.15 * f * f;
      }
    }

    /* ── Wave equation propagation — Neumann (open) boundary conditions ── */
    // All cells are updated, including edges.  For out-of-bounds
    // neighbours we use the cell's own value (zero-gradient), which
    // lets waves exit the grid smoothly instead of reflecting.
    function propagate() {
      for (let y = 0; y < H; y++) {
        const yw = y * W;
        const hasTop = y > 0;
        const hasBot = y < H - 1;
        const topOff = hasTop ? -W : 0;
        const botOff = hasBot ? W : 0;

        for (let x = 0; x < W; x++) {
          const i = yw + x;
          const hasLeft = x > 0;
          const hasRight = x < W - 1;
          prev[i] =
            (CENTER * curr[i] +
              C2 *
                (curr[hasLeft ? i - 1 : i] +
                  curr[hasRight ? i + 1 : i] +
                  curr[i + topOff] +
                  curr[i + botOff]) -
              prev[i]) *
            DAMPING;
        }
      }
      const tmp = curr;
      curr = prev;
      prev = tmp;
    }

    /* ── 3D render: Blinn-Phong shading with edge fade ── */
    function render() {
      for (let vy = 0; vy < H; vy++) {
        const yw = vy * W;
        const fy = fadeY[vy];
        /* Base gradient — dark forest green top → bottom */
        const t = vy / H;
        const bR = 20 + t * 20; // 20 → 40
        const bG = 30 + t * 19; // 30 → 49
        const bB = 3 + t * 4; // 3 → 7

        for (let vx = 0; vx < W; vx++) {
          const pi = (yw + vx) << 2;
          const fx = fadeX[vx];
          const sf = fx * fy; // combined edge fade (0 at corners, 1 at center)

          // Near the edge, skip wave computation entirely — pure base gradient
          if (sf < 0.01) {
            px[pi] = bR;
            px[pi + 1] = bG;
            px[pi + 2] = bB;
            px[pi + 3] = 255;
            continue;
          }

          const si = yw + vx;

          /* Surface normal via central differences (Neumann-safe) */
          const dhdx =
            (curr[vx > 0 ? si - 1 : si] - curr[vx < W - 1 ? si + 1 : si]) *
            0.5 * sf;
          const dhdy =
            (curr[vy > 0 ? si - W : si] - curr[vy < H - 1 ? si + W : si]) *
            0.5 * sf;
          const invN = 1.0 / Math.sqrt(dhdx * dhdx + dhdy * dhdy + 1.0);
          const nx = -dhdx * invN;
          const ny = -dhdy * invN;
          const nz = invN;

          /* Diffuse */
          const diff = nx * Lx + ny * Ly + nz * Lz;
          const diffuse = diff > 0 ? diff : 0;

          /* Specular (Blinn-Phong, exponent 16 via repeated squaring) */
          const sd = nx * Hx + ny * Hy + nz * Hz;
          if (sd > 0) {
            let s2 = sd * sd; // sd^2
            let s4 = s2 * s2; // sd^4
            const spec = s4 * s4; // sd^16

            /* Combine: ambient + diffuse + specular */
            const light = 0.55 + diffuse * 0.4 + spec * 0.55;

            /* Specular adds a cool white-green glint */
            const specR = spec * 14;
            const specG = spec * 35;
            const specB = spec * 18;

            px[pi] = Math.min(255, (bR * light + specR) | 0);
            px[pi + 1] = Math.min(255, (bG * light + specG) | 0);
            px[pi + 2] = Math.min(255, (bB * light + specB) | 0);
          } else {
            /* No specular contribution — diffuse only */
            const light = 0.55 + diffuse * 0.4;
            px[pi] = Math.min(255, (bR * light) | 0);
            px[pi + 1] = Math.min(255, (bG * light) | 0);
            px[pi + 2] = Math.min(255, (bB * light) | 0);
          }
          px[pi + 3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }

    /* ── Main loop ── */
    function tick() {
      propagate();
      render();
      rafId = requestAnimationFrame(tick);
    }

    /* ── Start (no initial drops — waves only from mouse interaction) ── */
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mq.matches) rafId = requestAnimationFrame(tick);

    function onMotionChange(e: MediaQueryListEvent) {
      if (e.matches) cancelAnimationFrame(rafId);
      else rafId = requestAnimationFrame(tick);
    }
    mq.addEventListener('change', onMotionChange);

    /* ── Input helpers ── */
    // Convert client coords to grid coords (0..W, 0..H)
    function toGrid(clientX: number, clientY: number): [number, number] {
      const r = section.getBoundingClientRect();
      return [
        ((clientX - r.left) / r.width) * W,
        ((clientY - r.top) / r.height) * H,
      ];
    }

    function onMouseDown(e: MouseEvent) {
      const [cx, cy] = toGrid(e.clientX, e.clientY);
      addDrop(cx, cy);
    }

    function onMouseMove(e: MouseEvent) {
      const [cx, cy] = toGrid(e.clientX, e.clientY);
      const now = performance.now();
      if (now - lastObjTime < OBJ_THROTTLE) return;
      lastObjTime = now;

      if (prevGX < 0) {
        prevGX = cx;
        prevGY = cy;
        return;
      }
      let dx = cx - prevGX;
      let dy = cy - prevGY;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len < MIN_MOVE) return;
      dx /= len;
      dy /= len;
      prevGX = cx;
      prevGY = cy;

      setWake(cx, cy, dx, dy);
    }

    function onTouchStart(e: TouchEvent) {
      const t = e.touches[0];
      if (!t) return;
      const [cx, cy] = toGrid(t.clientX, t.clientY);
      addDrop(cx, cy);
      prevGX = cx;
      prevGY = cy;
    }

    function onTouchMove(e: TouchEvent) {
      const t = e.touches[0];
      if (!t) return;
      const [cx, cy] = toGrid(t.clientX, t.clientY);
      const now = performance.now();
      if (now - lastObjTime < OBJ_THROTTLE) return;
      lastObjTime = now;

      if (prevGX < 0) {
        prevGX = cx;
        prevGY = cy;
        return;
      }
      let dx = cx - prevGX;
      let dy = cy - prevGY;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len < MIN_MOVE) return;
      dx /= len;
      dy /= len;
      prevGX = cx;
      prevGY = cy;

      setWake(cx, cy, dx, dy);
    }

    section.addEventListener('mousedown', onMouseDown, { passive: true });
    section.addEventListener('mousemove', onMouseMove, { passive: true });
    section.addEventListener('touchstart', onTouchStart, { passive: true });
    section.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      mq.removeEventListener('change', onMotionChange);
      section.removeEventListener('mousedown', onMouseDown);
      section.removeEventListener('mousemove', onMouseMove);
      section.removeEventListener('touchstart', onTouchStart);
      section.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
    >
      {/* 3D Water Surface (Canvas — fully opaque, includes gradient + waves) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ imageRendering: 'auto' }}
        aria-hidden="true"
      />

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, transparent 25%, rgba(10,16,3,0.50) 100%)',
        }}
      />

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
          Um espaço de acolhimento onde você pode respirar, ser ouvido e cuidar de
          si. Sem pressa, sem julgamento.
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
              document
                .getElementById('equipe')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="font-sans font-medium text-sm text-helora-gainsboro/60 hover:text-white/90 border border-helora-gainsboro/15 hover:border-helora-gainsboro/35 rounded-full px-6 py-2.5 sm:py-3 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-helora-sage/50"
          >
            Conheça a equipe
          </button>
        </motion.div>
      </div>

      {/* Bottom transition */}
      <div
        className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-10"
        aria-hidden="true"
      >
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