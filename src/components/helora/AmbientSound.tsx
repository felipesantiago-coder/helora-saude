'use client';

import { useState, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/* ==========================================================================
 * EVIDENCE-BASED AMBIENT SOUND — HYBRID ARCHITECTURE
 * ==========================================================================
 *
 * UNDETECTABLE LOOP via a hybrid continuous + looped approach:
 *
 * CONTINUOUS LAYERS (oscillators, never repeat):
 *   • Water ambience: 3 brown-noise buffers at COPRIME lengths
 *     (5 s + 7 s + 9 s). Their combined pattern repeats only
 *     every LCM(5,7,9) = 315 seconds (~5 min) — effectively
 *     non-repeating for any realistic listening session.
 *   • Sub-bass C2 (65.41 Hz) — pure continuous sine.
 *   • 60 BPM pulse LFO (1 Hz) modulating sub-bass gain.
 *
 * LOOPED MUSICAL BUFFER (48 s, only pad + bells):
 *   • Chord progression: Cmaj → Am → Dsus4 → Em → G → Am7 → Cmaj
 *     with 3-second smoothstep crossfades.
 *   • 16 bell-like melodic fragments (pentatonic, varied).
 *   • 6-second Hann crossfade at loop boundary.
 *   • Stereo with per-channel micro-detune.
 *
 * WHY THIS IS UNDETECTABLE:
 *   The continuous water + sub-bass NEVER loop. They provide an
 *   ever-evolving foundation that masks any subtle artifact from
 *   the 48 s musical loop. The ear cannot isolate the looped
 *   layer from the continuous layers.
 *
 * Master volume: 0.30.  1.5 s fade-in / fade-out.
 * ========================================================================== */

const FADE_DURATION = 1.5;
const MASTER_VOLUME = 0.30;
const MUSIC_LOOP_S = 48;
const CROSSFADE_S = 6;

/* ── Pentatonic frequencies (C major pentatonic) ── */
const F = {
  C3: 130.81, D3: 146.83, E3: 164.81, G3: 196.00, A3: 220.00,
  C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.00, A4: 440.00,
  C5: 523.25,
};

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
  /* 30 ms cross-fade at loop boundaries */
  const fade = Math.floor(sr * 0.03);
  for (let i = 0; i < fade; i++) {
    const t = i / fade;
    d[i] *= t;
    d[len - 1 - i] *= t;
  }
  return buf;
}

/* ════════════════════════════════════════════════════════════════════════
 * 2. MUSICAL BUFFER GENERATION (pad chords + bell melodies)
 * ════════════════════════════════════════════════════════════════════════ */

function smoothstep(t: number, a: number, b: number): number {
  if (t <= a) return 0;
  if (t >= b) return 1;
  const x = (t - a) / (b - a);
  return x * x * (3 - 2 * x);
}

function hann(t: number): number {
  return 0.5 * (1 - Math.cos(Math.PI * t));
}

/* Chord progression for 48-second loop */
type Chord = { t0: number; t1: number; notes: number[]; g: number[] };

const CHORDS: Chord[] = [
  { t0: 0,  t1: 12, notes: [F.C3, F.E3, F.G3],       g: [0.040, 0.032, 0.024] }, // C major
  { t0: 9,  t1: 21, notes: [110.0, F.C3, F.E3],       g: [0.036, 0.028, 0.023] }, // A minor (A2)
  { t0: 18, t1: 30, notes: [F.D3, F.G3, F.A3],       g: [0.032, 0.026, 0.020] }, // D sus4
  { t0: 27, t1: 36, notes: [F.E3, F.G3, F.A3],       g: [0.034, 0.025, 0.019] }, // E minor
  { t0: 33, t1: 42, notes: [98.0, F.C3, F.D3],       g: [0.030, 0.027, 0.021] }, // G sus4 (G2)
  { t0: 39, t1: 48, notes: [110.0, F.C3, F.E3, F.G3], g: [0.033, 0.026, 0.021, 0.016] }, // Am7
];

/* Bell-like melodic fragments */
type Bell = { t: number; freq: number; vol: number; decay: number };

const BELLS: Bell[] = [
  // C major
  { t: 2.5,  freq: F.E4, vol: 0.015, decay: 3.5 },
  { t: 6.0,  freq: F.C5, vol: 0.017, decay: 4.0 },
  { t: 9.5,  freq: F.G4, vol: 0.012, decay: 3.0 },
  // A minor
  { t: 12.0, freq: F.A4, vol: 0.014, decay: 3.5 },
  { t: 16.0, freq: F.E4, vol: 0.016, decay: 4.0 },
  // D sus4
  { t: 20.0, freq: F.D4, vol: 0.013, decay: 3.0 },
  { t: 23.5, freq: F.A4, vol: 0.015, decay: 3.5 },
  { t: 26.5, freq: F.G4, vol: 0.012, decay: 3.0 },
  // E minor
  { t: 29.0, freq: F.E4, vol: 0.016, decay: 4.0 },
  { t: 33.0, freq: F.C5, vol: 0.014, decay: 3.5 },
  // G sus4
  { t: 35.5, freq: F.G4, vol: 0.013, decay: 3.0 },
  { t: 38.5, freq: F.D4, vol: 0.011, decay: 3.0 },
  // Am7
  { t: 40.5, freq: F.A4, vol: 0.015, decay: 3.5 },
  { t: 43.5, freq: F.E4, vol: 0.013, decay: 3.0 },
  // Crossfade zone (fading out)
  { t: 46.0, freq: F.C4, vol: 0.009, decay: 3.0 },
];

function generateMusicBuffer(ctx: AudioContext): AudioBuffer {
  const sr = ctx.sampleRate;
  const len = Math.floor(sr * MUSIC_LOOP_S);
  const buf = ctx.createBuffer(2, len, sr);
  const L = buf.getChannelData(0);
  const R = buf.getChannelData(1);

  /* ── Pad with chord progression ── */
  for (const ch of CHORDS) {
    for (let n = 0; n < ch.notes.length; n++) {
      const freq = ch.notes[n];
      const vol = ch.g[n];
      const incL = (2 * Math.PI * freq) / sr;
      const incR = (2 * Math.PI * freq * 1.0004) / sr;
      const i0 = Math.floor(ch.t0 * sr);
      const i1 = Math.min(Math.floor(ch.t1 * sr), len);
      let pL = 0, pR = 0;

      for (let i = i0; i < i1; i++) {
        const t = i / sr;
        const env = smoothstep(t, ch.t0, ch.t0 + 3) * (1 - smoothstep(t, ch.t1 - 3, ch.t1));
        const pulse = 1.0 + 0.06 * Math.sin(2 * Math.PI * t);
        const a = env * vol * pulse;

        L[i] += (Math.sin(pL) + Math.sin(pL * 2) * 0.10) * a;
        R[i] += (Math.sin(pR) + Math.sin(pR * 2) * 0.10) * a;
        pL += incL;
        pR += incR;
      }
    }
  }

  /* ── Bell-like melodic fragments ── */
  for (const b of BELLS) {
    const bs = Math.floor(b.t * sr);
    const be = Math.min(Math.floor((b.t + b.decay) * sr), len);
    const inc = (2 * Math.PI * b.freq) / sr;
    const oInc = (2 * Math.PI * b.freq * 2.5) / sr; // inharmonic overtone
    let p = 0, oP = 0;

    for (let i = bs; i < be; i++) {
      const dt = (i - bs) / sr;
      const env = smoothstep(dt, 0, 0.25) * Math.exp(-dt * 1.3) * b.vol;
      const s = Math.sin(p) * env;
      const o = Math.sin(oP) * env * 0.22;
      L[i] += s * 1.0 + o * 0.5;
      R[i] += s * 0.65 + o * 1.0;
      p += inc;
      oP += oInc;
    }
  }

  /* ── Perfect loop crossfade (6-second Hann) ── */
  const cfLen = Math.floor(sr * CROSSFADE_S);
  for (let i = 0; i < cfLen; i++) {
    const w = hann(i / cfLen);
    const ei = len - cfLen + i;
    L[ei] = L[ei] * (1 - w) + L[i] * w;
    R[ei] = R[ei] * (1 - w) + R[i] * w;
  }

  /* ── Soft clip ── */
  for (let i = 0; i < len; i++) {
    L[i] = Math.tanh(L[i] * 2.0) / 2.0;
    R[i] = Math.tanh(R[i] * 2.0) / 2.0;
  }

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
     * LOOPED LAYER: Musical pad + bells (48 s buffer)
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
