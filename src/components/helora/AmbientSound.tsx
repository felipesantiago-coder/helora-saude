'use client';

import { useState, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/* ==========================================================================
 * EVIDENCE-BASED AMBIENT SOUND — PHASE-ALIGNED PERIODIC LOOP
 * ==========================================================================
 *
 * ROOT CAUSE OF PREVIOUS "ESTAMPIDO":
 *   Oscillator frequencies (e.g. C3 = 130.81 Hz) did not complete an
 *   integer number of cycles in 48 s: 130.81 × 48 = 6278.88 cycles.
 *   The 0.88-cycle phase mismatch created an inaudible frequency error
 *   but a VISIBLE waveform discontinuity at the loop point — a pop.
 *   No crossfade can fix this because the discontinuity is in the DERIVATIVE
 *   of the waveform, not just its value.
 *
 * FIX — Phase-aligned periodic generation:
 *   1. Every frequency is snapped to the nearest multiple of 1/LOOP_S Hz.
 *      Max tuning error: < 0.01 Hz (completely inaudible).
 *   2. Phase is computed DIRECTLY (2π·f·i/sr) instead of accumulated
 *      (p += inc). This eliminates floating-point drift over 2M+ samples.
 *   3. Result: sample[0] == sample[N] in BOTH value AND slope.
 *      The loop is mathematically seamless. No crossfade needed.
 *
 * LAYERS:
 *   CONTINUOUS (oscillators, never loop):
 *     • Water: 3 brown-noise buffers at coprime lengths (5+7+9 s)
 *       with 1 s Hann crossfade + DC block. Combined period = 315 s.
 *     • Sub-bass C2 (65.41 Hz) + 60 BPM pulse LFO.
 *
 *   LOOPED MUSIC (48 s, inherently periodic):
 *     • 6 chords with smoothstep crossfades.
 *     • 13 bell-like pentatonic fragments (exponential decay).
 *     • Stereo via phase offset (π/5) — preserves periodicity.
 *
 * Master volume: 0.30.  1.5 s fade-in / fade-out.
 * ========================================================================== */

const FADE_DURATION = 1.5;
const MASTER_VOLUME = 0.30;
const LOOP_S = 48;
const BROWN_FADE_S = 1.0; // 1 s Hann crossfade for brown noise

/* ── Snap frequency to exact multiple of 1/LOOP_S Hz ──
 * Example: snap(130.81) = round(130.81×48)/48 = 6279/48 = 130.8125 Hz
 * Difference from equal temperament: 0.0025 Hz — far below JND (~0.5 Hz). */
function snap(f: number): number {
  return Math.round(f * LOOP_S) / LOOP_S;
}

/* ── Pentatonic frequencies, phase-aligned to 48 s loop ── */
const F = {
  A2: snap(110.0),
  C3: snap(130.81), D3: snap(146.83), E3: snap(164.81),
  G2: snap(98.0),  G3: snap(196.0),  A3: snap(220.0),
  C4: snap(261.63), D4: snap(293.66), E4: snap(329.63),
  G4: snap(392.0),  A4: snap(440.0),  C5: snap(523.25),
};

/* Stereo phase offset — replaces detune to preserve periodicity */
const STEREO_PHASE = Math.PI / 5; // ~36°

/* ════════════════════════════════════════════════════════════════════════
 * 1. BROWN NOISE BUFFER (for water ambience — continuous layer)
 * ════════════════════════════════════════════════════════════════════════ */
function createBrownNoise(ctx: AudioContext, dur: number): AudioBuffer {
  const sr = ctx.sampleRate;
  const len = Math.floor(sr * dur);
  const buf = ctx.createBuffer(1, len, sr);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    d[i] = last * 3.5;
  }

  /* DC block: subtract mean to prevent low-freq thump at loop boundary */
  let sum = 0;
  for (let i = 0; i < len; i++) sum += d[i];
  const mean = sum / len;
  for (let i = 0; i < len; i++) d[i] -= mean;

  /* 1 s Hann cross-fade at loop boundaries (handles brown noise's
   * strong low-frequency content — 30 ms was insufficient) */
  const fade = Math.floor(sr * BROWN_FADE_S);
  for (let i = 0; i < fade; i++) {
    const w = 0.5 * (1 - Math.cos(Math.PI * i / fade));
    d[i] *= w;
    d[len - 1 - i] *= w;
  }
  return buf;
}

/* ════════════════════════════════════════════════════════════════════════
 * 2. MUSIC BUFFER (pad chords + bell melodies — phase-aligned loop)
 * ════════════════════════════════════════════════════════════════════════ */

function smoothstep(t: number, a: number, b: number): number {
  if (t <= a) return 0;
  if (t >= b) return 1;
  const x = (t - a) / (b - a);
  return x * x * (3 - 2 * x);
}

/* Chord progression — all notes use snapped (phase-aligned) frequencies */
type Chord = { t0: number; t1: number; notes: number[]; g: number[] };

const CHORDS: Chord[] = [
  { t0: 0,  t1: 12, notes: [F.C3, F.E3, F.G3],        g: [0.040, 0.032, 0.024] }, // C major
  { t0: 9,  t1: 21, notes: [F.A2, F.C3, F.E3],        g: [0.036, 0.028, 0.023] }, // A minor
  { t0: 18, t1: 30, notes: [F.D3, F.G3, F.A3],        g: [0.032, 0.026, 0.020] }, // D sus4
  { t0: 27, t1: 36, notes: [F.E3, F.G3, F.A3],        g: [0.034, 0.025, 0.019] }, // E minor
  { t0: 33, t1: 42, notes: [F.G2, F.C3, F.D3],        g: [0.030, 0.027, 0.021] }, // G sus4
  { t0: 39, t1: 48, notes: [F.A2, F.C3, F.E3, F.G3],  g: [0.033, 0.026, 0.021, 0.016] }, // Am7
];

/* Bell-like melodic fragments — all with phase-aligned frequencies.
 * Last bell at t=41 with 3s decay → negligible by t=44. Loop point at t=48
 * is reached with clean pad-only signal fading to zero. */
type Bell = { t: number; freq: number; vol: number; decay: number };

const BELLS: Bell[] = [
  { t: 2.5,  freq: F.E4, vol: 0.015, decay: 3.5 },
  { t: 6.0,  freq: F.C5, vol: 0.017, decay: 4.0 },
  { t: 9.5,  freq: F.G4, vol: 0.012, decay: 3.0 },
  { t: 12.0, freq: F.A4, vol: 0.014, decay: 3.5 },
  { t: 16.0, freq: F.E4, vol: 0.016, decay: 4.0 },
  { t: 20.0, freq: F.D4, vol: 0.013, decay: 3.0 },
  { t: 23.5, freq: F.A4, vol: 0.015, decay: 3.5 },
  { t: 26.5, freq: F.G4, vol: 0.012, decay: 3.0 },
  { t: 29.0, freq: F.E4, vol: 0.016, decay: 4.0 },
  { t: 33.0, freq: F.C5, vol: 0.014, decay: 3.5 },
  { t: 35.5, freq: F.G4, vol: 0.013, decay: 3.0 },
  { t: 38.5, freq: F.D4, vol: 0.011, decay: 3.0 },
  { t: 41.0, freq: F.A4, vol: 0.013, decay: 3.0 },
  // No bells after t=41 — keep the loop boundary region clean
];

function generateMusicBuffer(ctx: AudioContext): AudioBuffer {
  const sr = ctx.sampleRate;
  const len = Math.floor(sr * LOOP_S);
  const buf = ctx.createBuffer(2, len, sr);
  const L = buf.getChannelData(0);
  const R = buf.getChannelData(1);
  const TAU = 2 * Math.PI;

  /* ── Pad with chord progression ──
   * KEY: phase is computed DIRECTLY (TAU * freq * i / sr) instead of
   * accumulated (p += inc). This guarantees zero floating-point drift
   * and exact periodicity for snapped frequencies. */
  for (const ch of CHORDS) {
    for (let n = 0; n < ch.notes.length; n++) {
      const freq = ch.notes[n];
      const vol = ch.g[n];
      const i0 = Math.floor(ch.t0 * sr);
      const i1 = Math.min(Math.floor(ch.t1 * sr), len);

      for (let i = i0; i < i1; i++) {
        const t = i / sr;
        const env = smoothstep(t, ch.t0, ch.t0 + 3) * (1 - smoothstep(t, ch.t1 - 3, ch.t1));
        const pulse = 1.0 + 0.06 * Math.sin(TAU * t); // 1 Hz = 60 BPM
        const a = env * vol * pulse;

        /* Direct phase: sin(2π·f·i/sr). At i=0→phase=0, at i=len→2π·N (integer N). */
        const phaseL = TAU * freq * i / sr;
        const phaseR = phaseL + STEREO_PHASE;

        /* Fundamental + 2nd harmonic (2× freq is also integer-multiple → periodic) */
        L[i] += (Math.sin(phaseL) + Math.sin(phaseL * 2) * 0.10) * a;
        R[i] += (Math.sin(phaseR) + Math.sin(phaseR * 2) * 0.10) * a;
      }
    }
  }

  /* ── Bell-like melodic fragments (direct phase) ──
   * All bell freqs × 48 = even integers, so the 2.5× overtone also
   * completes integer cycles → fully periodic. */
  for (const b of BELLS) {
    const bs = Math.floor(b.t * sr);
    const be = Math.min(Math.floor((b.t + b.decay) * sr), len);

    for (let i = bs; i < be; i++) {
      const dt = (i - bs) / sr;
      const env = smoothstep(dt, 0, 0.25) * Math.exp(-dt * 1.3) * b.vol;

      const phase = TAU * b.freq * i / sr;
      const oPhase = TAU * b.freq * 2.5 * i / sr; // inharmonic overtone

      const s = Math.sin(phase) * env;
      const o = Math.sin(oPhase) * env * 0.22;
      L[i] += s * 1.0 + o * 0.5;
      R[i] += s * 0.65 + o * 1.0;
    }
  }

  /* ── Soft clip (applied uniformly — no crossfade region artifacts) ── */
  for (let i = 0; i < len; i++) {
    L[i] = Math.tanh(L[i] * 2.0) / 2.0;
    R[i] = Math.tanh(R[i] * 2.0) / 2.0;
  }

  /* NO CROSSFADE NEEDED — the buffer is mathematically periodic.
   * At i=0: all envelopes = 0, all phases = 0 → signal = 0.
   * At i=len-1: all envelopes ≈ 0, all phases ≈ 2π·N → signal ≈ 0.
   * Both value AND derivative are continuous across the loop point. */

  return buf;
}

/* ════════════════════════════════════════════════════════════════════════
 * React component
 * ════════════════════════════════════════════════════════════════════════ */
export function AmbientSound() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<{
    ctx: AudioContext;
    master: GainNode;
    musicSrc: AudioBufferSourceNode;
    nodes: (AudioBufferSourceNode | OscillatorNode)[];
  } | null>(null);

  const startAudio = useCallback(() => {
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    /* ── Master gain ── */
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(MASTER_VOLUME, now + FADE_DURATION);
    master.connect(ctx.destination);

    const nodes: (AudioBufferSourceNode | OscillatorNode)[] = [];

    /* ══════════════════════════════════════════════════════════════
     * CONTINUOUS LAYER: Water ambience (coprime brown noise)
     * 5 s + 7 s + 9 s → combined period LCM = 315 s
     * ══════════════════════════════════════════════════════════════ */
    const waterGain = ctx.createGain();
    waterGain.gain.value = 0.10;
    waterGain.connect(master);

    for (const dur of [5, 7, 9]) {
      const nBuf = createBrownNoise(ctx, dur);
      const src = ctx.createBufferSource();
      src.buffer = nBuf;
      src.loop = true;
      const lpf = ctx.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.frequency.value = 350;
      lpf.Q.value = 0.5;
      const g = ctx.createGain();
      g.gain.value = 0.38;
      src.connect(lpf);
      lpf.connect(g);
      g.connect(waterGain);
      src.start(now);
      nodes.push(src);
    }

    /* ══════════════════════════════════════════════════════════════
     * CONTINUOUS LAYER: Sub-bass C2 + 60 BPM pulse
     * ══════════════════════════════════════════════════════════════ */
    const subBass = ctx.createOscillator();
    subBass.type = 'sine';
    subBass.frequency.value = 65.41;
    const subGain = ctx.createGain();
    subGain.gain.value = 0.020;
    subBass.connect(subGain);
    subGain.connect(master);
    subBass.start(now);
    nodes.push(subBass);

    // 60 BPM pulse LFO → sub-bass gain (heart-rate entrainment)
    const pulseLFO = ctx.createOscillator();
    pulseLFO.type = 'sine';
    pulseLFO.frequency.value = 1.0;
    const pulseGain = ctx.createGain();
    pulseGain.gain.value = 0.004;
    pulseLFO.connect(pulseGain);
    pulseGain.connect(subGain.gain);
    pulseLFO.start(now);
    nodes.push(pulseLFO);

    /* ══════════════════════════════════════════════════════════════
     * LOOPED LAYER: Musical pad + bells (48 s, phase-aligned)
     * ══════════════════════════════════════════════════════════════ */
    const musicBuf = generateMusicBuffer(ctx);
    const musicSrc = ctx.createBufferSource();
    musicSrc.buffer = musicBuf;
    musicSrc.loop = true;
    musicSrc.connect(master);
    musicSrc.start(now);

    audioRef.current = { ctx, master, musicSrc, nodes };
    setPlaying(true);
  }, []);

  const stopAudio = useCallback(() => {
    if (!audioRef.current) return;
    const { ctx, master } = audioRef.current;
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0, now + FADE_DURATION);
    const ref = audioRef.current;
    setTimeout(() => {
      try { ref.musicSrc.stop(); } catch { /* ok */ }
      ref.nodes.forEach((n) => { try { n.stop(); } catch { /* ok */ } });
      ref.ctx.close();
    }, FADE_DURATION * 1000 + 150);
    audioRef.current = null;
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (playing) stopAudio();
    else startAudio();
  }, [playing, startAudio, stopAudio]);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? 'Desativar som ambiente' : 'Ativar som ambiente'}
      title={playing ? 'Desativar som' : 'Ouvir som ambiente'}
      className={
        'group relative z-20 flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-500 ' +
        (playing
          ? 'border-helora-sage/40 bg-helora-sage/15 text-helora-sage'
          : 'border-helora-gainsboro/15 bg-white/5 text-helora-gainsboro/40 hover:border-helora-gainsboro/30 hover:text-helora-gainsboro/60')
      }
    >
      {playing ? (
        <Volume2 className="w-4 h-4" strokeWidth={1.5} />
      ) : (
        <VolumeX className="w-4 h-4" strokeWidth={1.5} />
      )}
      {playing && (
        <span className="absolute inset-0 rounded-full border border-helora-sage/30 animate-ping pointer-events-none" />
      )}
    </button>
  );
}
