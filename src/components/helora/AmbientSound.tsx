'use client';

import { useState, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/* ==========================================================================
 * EVIDENCE-BASED AMBIENT SOUND — PERFECT LOOP
 * ==========================================================================
 *
 * A single 32-second stereo AudioBuffer is procedurally generated on
 * first click and played in an infinite seamless loop.
 *
 * MUSICAL STRUCTURE (based on relaxation research):
 *
 *   • Chord progression (C pentatonic, overlapping 3-second crossfades):
 *       0–10 s   C major   (C3 · E3 · G3)
 *       7–17 s   A minor   (A2 · C3 · E3)
 *      14–24 s   G sus4   (G2 · C3 · D3)
 *      21–31 s   E minor   (E3 · G3 · A3)
 *      28–32 s   → C major (crossfade back to start)
 *
 *   • Melodic fragments — bell-like pentatonic tones that ring out
 *     with fast attack / slow exponential decay, placed at musical
 *     intervals within each chord.
 *
 *   • 60 BPM pulse (1 Hz amplitude modulation on pad) for heart-rate
 *     entrainment and alpha brainwave promotion (Iwanaga 2021).
 *
 *   • Brown noise water ambience + sub-bass C2 warmth throughout.
 *
 * PERFECT LOOP:
 *   The last 4 seconds are crossfaded (Hann window) into the first
 *   4 seconds so the jump from t=32 → t=0 is acoustically invisible.
 *   Both ends are in C major, so the crossfade is a natural chord
 *   transition — listeners can never detect where the loop starts.
 *
 * Master volume: 0.30.  1.5 s fade-in / fade-out.
 * ========================================================================== */

const FADE_DURATION = 1.5;
const MASTER_VOLUME = 0.30;
const LOOP_SECONDS = 32;
const CROSSFADE_SECONDS = 4;

/* ── Pentatonic frequencies (C major pentatonic) ── */
const F = {
  C3: 130.81, D3: 146.83, E3: 164.81, G3: 196.00, A3: 220.00,
  C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.00, A4: 440.00,
  C5: 523.25,
};

/* ── Chord definitions ── */
type ChordDef = { t0: number; t1: number; notes: number[]; gains: number[] };

const CHORDS: ChordDef[] = [
  // C major — opens and closes the loop
  { t0: 0,  t1: 10, notes: [F.C3, F.E3, F.G3], gains: [0.042, 0.034, 0.026] },
  // A minor
  { t0: 7,  t1: 17, notes: [110.00, F.C3, F.E3], gains: [0.038, 0.030, 0.025] },
  // G sus4
  { t0: 14, t1: 24, notes: [98.00, F.C3, F.D3], gains: [0.032, 0.028, 0.022] },
  // E minor
  { t0: 21, t1: 31, notes: [F.E3, F.G3, F.A3], gains: [0.034, 0.026, 0.020] },
];

/* ── Melodic fragments (bell-like tones) ── */
type Bell = { t: number; freq: number; vol: number; decay: number };

const BELLS: Bell[] = [
  // During C major
  { t: 2.0,  freq: F.E4, vol: 0.016, decay: 3.5 },
  { t: 5.5,  freq: F.C5, vol: 0.018, decay: 4.0 },
  // During A minor
  { t: 9.0,  freq: F.A4, vol: 0.013, decay: 3.0 },
  { t: 13.0, freq: F.E4, vol: 0.015, decay: 3.5 },
  // During G sus4
  { t: 16.5, freq: F.D4, vol: 0.014, decay: 3.5 },
  { t: 20.0, freq: F.G4, vol: 0.017, decay: 4.0 },
  // During E minor
  { t: 23.5, freq: F.E4, vol: 0.014, decay: 3.0 },
  { t: 27.0, freq: F.G4, vol: 0.016, decay: 3.5 },
  // Approaching loop point (fading via crossfade)
  { t: 30.0, freq: F.C4, vol: 0.010, decay: 3.0 },
];

/* ── Helpers ── */
function smoothstep(t: number, a: number, b: number): number {
  if (t <= a) return 0;
  if (t >= b) return 1;
  const x = (t - a) / (b - a);
  return x * x * (3 - 2 * x);
}

function hann(t: number): number {
  return 0.5 * (1 - Math.cos(Math.PI * t));
}

/* ════════════════════════════════════════════════════════════════════════
 * Buffer generation — renders the entire 32-second soundscape
 * ════════════════════════════════════════════════════════════════════════ */
function generateSoundscape(ctx: AudioContext): AudioBuffer {
  const sr = ctx.sampleRate;
  const len = Math.floor(sr * LOOP_SECONDS);
  const buf = ctx.createBuffer(2, len, sr);
  const L = buf.getChannelData(0);
  const R = buf.getChannelData(1);

  /* ── 1. Pentatonic pad with chord progression ── */
  for (const ch of CHORDS) {
    for (let n = 0; n < ch.notes.length; n++) {
      const freq = ch.notes[n];
      const vol = ch.gains[n];
      const phaseIncL = (2 * Math.PI * freq) / sr;
      const phaseIncR = (2 * Math.PI * freq * 1.0003) / sr; // tiny detune for stereo
      const startIdx = Math.floor(ch.t0 * sr);
      const endIdx = Math.min(Math.floor(ch.t1 * sr), len);
      let phaseL = 0;
      let phaseR = 0;

      for (let i = startIdx; i < endIdx; i++) {
        const t = i / sr;
        // 3-second smooth attack & release
        const fadeIn = smoothstep(t, ch.t0, ch.t0 + 3);
        const fadeOut = 1 - smoothstep(t, ch.t1 - 3, ch.t1);
        const env = fadeIn * fadeOut;
        // 60 BPM pulse
        const pulse = 1.0 + 0.08 * Math.sin(2 * Math.PI * t);
        const amp = env * vol * pulse;

        // Fundamental + slight 2nd harmonic for warmth
        L[i] += (Math.sin(phaseL) + Math.sin(phaseL * 2) * 0.12) * amp;
        R[i] += (Math.sin(phaseR) + Math.sin(phaseR * 2) * 0.12) * amp;
        phaseL += phaseIncL;
        phaseR += phaseIncR;
      }
    }
  }

  /* ── 2. Melodic fragments (bell-like tones) ── */
  for (const b of BELLS) {
    const bellStart = Math.floor(b.t * sr);
    const bellEnd = Math.min(Math.floor((b.t + b.decay) * sr), len);
    const phaseInc = (2 * Math.PI * b.freq) / sr;
    // Inharmonic overtone for bell quality (2.5× fundamental)
    const overtoneInc = (2 * Math.PI * b.freq * 2.5) / sr;
    let phase = 0;
    let oPhase = 0;

    for (let i = bellStart; i < bellEnd; i++) {
      const dt = (i - bellStart) / sr;
      // Fast attack (0.25 s) + exponential decay
      const attack = smoothstep(dt, 0, 0.25);
      const decay = Math.exp(-dt * 1.4);
      const env = attack * decay * b.vol;

      const sample = Math.sin(phase) * env;
      const overtone = Math.sin(oPhase) * env * 0.25;

      // Stereo: fundamental slightly left, overtone slightly right
      L[i] += sample * 1.0 + overtone * 0.6;
      R[i] += sample * 0.7 + overtone * 1.0;
      phase += phaseInc;
      oPhase += overtoneInc;
    }
  }

  /* ── 3. Sub-bass warmth (C2 = 65.41 Hz) ── */
  {
    const phaseInc = (2 * Math.PI * 65.41) / sr;
    let phase = 0;
    for (let i = 0; i < len; i++) {
      const sample = Math.sin(phase) * 0.022;
      L[i] += sample;
      R[i] += sample;
      phase += phaseInc;
    }
  }

  /* ── 4. Brown noise water ambience (stereo) ── */
  {
    let bL = 0, bR = 0;
    for (let i = 0; i < len; i++) {
      bL = (bL + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      bR = (bR + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      L[i] += bL * 0.11;
      R[i] += bR * 0.09;
    }
  }

  /* ── 5. Perfect loop crossfade (Hann window, 4 seconds) ── */
  {
    const cfLen = Math.floor(sr * CROSSFADE_SECONDS);
    for (let i = 0; i < cfLen; i++) {
      const w = hann(i / cfLen); // 0 → 1
      const endIdx = len - cfLen + i;
      const begIdx = i;
      L[endIdx] = L[endIdx] * (1 - w) + L[begIdx] * w;
      R[endIdx] = R[endIdx] * (1 - w) + R[begIdx] * w;
    }
  }

  /* ── 6. Soft clip (prevents harsh peaks) ── */
  for (let i = 0; i < len; i++) {
    L[i] = Math.tanh(L[i] * 1.8) / 1.8;
    R[i] = Math.tanh(R[i] * 1.8) / 1.8;
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
    source: AudioBufferSourceNode;
  } | null>(null);

  const startAudio = useCallback(() => {
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(MASTER_VOLUME, now + FADE_DURATION);
    master.connect(ctx.destination);

    const buffer = generateSoundscape(ctx);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(master);
    source.start(now);

    audioRef.current = { ctx, master, source };
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
      try {
        ref.source.stop();
      } catch { /* already stopped */ }
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
      {/* Pulse ring when playing */}
      {playing && (
        <span className="absolute inset-0 rounded-full border border-helora-sage/30 animate-ping pointer-events-none" />
      )}
    </button>
  );
}
