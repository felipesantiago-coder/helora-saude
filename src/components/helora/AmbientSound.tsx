'use client';

import { useState, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/* ==========================================================================
 * EVIDENCE-BASED AMBIENT SOUND — ZERO-LOOP-SEAM DESIGN
 * ==========================================================================
 *
 * ARCHITECTURE — two independent layers:
 *
 *   1. WATER (real-time, NO loop):
 *      ScriptProcessorNode generates brown noise sample-by-sample.
 *      No buffer → no loop point → no seam. Ever.
 *      Two independent random walks (L/R) → natural stereo width.
 *      Shaped by 350 Hz lowpass → gentle water ambience.
 *
 *   2. MUSIC (48 s pre-rendered, phase-aligned periodic buffer):
 *      Every frequency snapped to integer multiple of 1/48 Hz.
 *      Max tuning error < 0.01 Hz (far below JND of ~0.5 Hz).
 *      Phase computed DIRECTLY (2π·f·i/sr) — no floating-point drift.
 *      Chord envelopes reach exactly 0 at t=0 AND t=48, with zero derivative.
 *      Result: sample[0] ≈ sample[N] in value AND slope → seamless.
 *
 *   3. SUB-BASS + PULSE (live oscillators, no loop):
 *      Continuous C2 sine + 60 BPM LFO on gain (heart-rate entrainment).
 *
 * Master volume: 0.30.  1.5 s fade-in / fade-out.
 * ========================================================================== */

const FADE_DURATION = 1.5;
const MASTER_VOLUME = 0.30;
const LOOP_S = 48;

/* ── Snap frequency to exact multiple of 1/LOOP_S Hz ── */
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

const STEREO_PHASE = Math.PI / 5;

/* ════════════════════════════════════════════════════════════════════════
 * MUSIC BUFFER (pad chords + bell melodies — phase-aligned loop)
 * ════════════════════════════════════════════════════════════════════════ */

function smoothstep(t: number, a: number, b: number): number {
  if (t <= a) return 0;
  if (t >= b) return 1;
  const x = (t - a) / (b - a);
  return x * x * (3 - 2 * x);
}

type Chord = { t0: number; t1: number; notes: number[]; g: number[] };

const CHORDS: Chord[] = [
  { t0: 0,  t1: 12, notes: [F.C3, F.E3, F.G3],       g: [0.040, 0.032, 0.024] },
  { t0: 9,  t1: 21, notes: [F.A2, F.C3, F.E3],       g: [0.036, 0.028, 0.023] },
  { t0: 18, t1: 30, notes: [F.D3, F.G3, F.A3],       g: [0.032, 0.026, 0.020] },
  { t0: 27, t1: 36, notes: [F.E3, F.G3, F.A3],       g: [0.034, 0.025, 0.019] },
  { t0: 33, t1: 42, notes: [F.G2, F.C3, F.D3],       g: [0.030, 0.027, 0.021] },
  { t0: 39, t1: 48, notes: [F.A2, F.C3, F.E3, F.G3], g: [0.033, 0.026, 0.021, 0.016] },
];

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
];

function generateMusicBuffer(ctx: AudioContext): AudioBuffer {
  const sr = ctx.sampleRate;
  const len = Math.floor(sr * LOOP_S);
  const buf = ctx.createBuffer(2, len, sr);
  const L = buf.getChannelData(0);
  const R = buf.getChannelData(1);
  const TAU = 2 * Math.PI;

  for (const ch of CHORDS) {
    for (let n = 0; n < ch.notes.length; n++) {
      const freq = ch.notes[n];
      const vol = ch.g[n];
      const i0 = Math.floor(ch.t0 * sr);
      const i1 = Math.min(Math.floor(ch.t1 * sr), len);

      for (let i = i0; i < i1; i++) {
        const t = i / sr;
        const env = smoothstep(t, ch.t0, ch.t0 + 3) * (1 - smoothstep(t, ch.t1 - 3, ch.t1));
        const pulse = 1.0 + 0.06 * Math.sin(TAU * t);
        const a = env * vol * pulse;

        const phaseL = TAU * freq * i / sr;
        const phaseR = phaseL + STEREO_PHASE;

        L[i] += (Math.sin(phaseL) + Math.sin(phaseL * 2) * 0.10) * a;
        R[i] += (Math.sin(phaseR) + Math.sin(phaseR * 2) * 0.10) * a;
      }
    }
  }

  for (const b of BELLS) {
    const bs = Math.floor(b.t * sr);
    const be = Math.min(Math.floor((b.t + b.decay) * sr), len);

    for (let i = bs; i < be; i++) {
      const dt = (i - bs) / sr;
      const env = smoothstep(dt, 0, 0.25) * Math.exp(-dt * 1.3) * b.vol;

      const phase = TAU * b.freq * i / sr;
      const oPhase = TAU * b.freq * 2.5 * i / sr;

      const s = Math.sin(phase) * env;
      const o = Math.sin(oPhase) * env * 0.22;
      L[i] += s * 1.0 + o * 0.5;
      R[i] += s * 0.65 + o * 1.0;
    }
  }

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
    oscillators: (AudioBufferSourceNode | OscillatorNode)[];
    noiseProcessor: ScriptProcessorNode | null;
  } | null>(null);

  const startAudio = useCallback(() => {
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    /* ── Master gain ── */
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(MASTER_VOLUME, now + FADE_DURATION);
    master.connect(ctx.destination);

    const oscillators: (AudioBufferSourceNode | OscillatorNode)[] = [];

    /* ══════════════════════════════════════════════════════════════
     * WATER: Real-time brown noise — NO buffer, NO loop, NO seam.
     * ScriptProcessorNode generates noise sample-by-sample.
     * Two independent random walks (L/R) for natural stereo width.
     * ══════════════════════════════════════════════════════════════ */
    const waterGain = ctx.createGain();
    waterGain.gain.value = 0.10;
    waterGain.connect(master);

    const waterLPF = ctx.createBiquadFilter();
    waterLPF.type = 'lowpass';
    waterLPF.frequency.value = 350;
    waterLPF.Q.value = 0.5;
    waterLPF.connect(waterGain);

    const NOISE_BUF_SIZE = 4096;
    const noiseProc = ctx.createScriptProcessor(NOISE_BUF_SIZE, 0, 2);
    let nL = 0;
    let nR = 0;
    noiseProc.onaudioprocess = (e: AudioProcessingEvent) => {
      const oL = e.outputBuffer.getChannelData(0);
      const oR = e.outputBuffer.getChannelData(1);
      for (let i = 0; i < NOISE_BUF_SIZE; i++) {
        nL = (nL + 0.02 * (Math.random() * 2 - 1)) / 1.02;
        nR = (nR + 0.02 * (Math.random() * 2 - 1)) / 1.02;
        oL[i] = nL * 3.5;
        oR[i] = nR * 3.5;
      }
    };
    noiseProc.connect(waterLPF);

    /* ══════════════════════════════════════════════════════════════
     * SUB-BASS: C2 + 60 BPM pulse (continuous oscillators, no loop)
     * ══════════════════════════════════════════════════════════════ */
    const subBass = ctx.createOscillator();
    subBass.type = 'sine';
    subBass.frequency.value = 65.41;
    const subGain = ctx.createGain();
    subGain.gain.value = 0.020;
    subBass.connect(subGain);
    subGain.connect(master);
    subBass.start(now);
    oscillators.push(subBass);

    const pulseLFO = ctx.createOscillator();
    pulseLFO.type = 'sine';
    pulseLFO.frequency.value = 1.0;
    const pulseGain = ctx.createGain();
    pulseGain.gain.value = 0.004;
    pulseLFO.connect(pulseGain);
    pulseGain.connect(subGain.gain);
    pulseLFO.start(now);
    oscillators.push(pulseLFO);

    /* ══════════════════════════════════════════════════════════════
     * MUSIC: 48 s phase-aligned buffer (looped)
     * ══════════════════════════════════════════════════════════════ */
    const musicBuf = generateMusicBuffer(ctx);
    const musicSrc = ctx.createBufferSource();
    musicSrc.buffer = musicBuf;
    musicSrc.loop = true;
    musicSrc.connect(master);
    musicSrc.start(now);

    audioRef.current = { ctx, master, musicSrc, oscillators, noiseProcessor: noiseProc };
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
      ref.oscillators.forEach((n) => { try { n.stop(); } catch { /* ok */ } });
      if (ref.noiseProcessor) ref.noiseProcessor.disconnect();
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
