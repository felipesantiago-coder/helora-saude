'use client';

import { useState, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/* ==========================================================================
 * EVIDENCE-BASED AMBIENT SOUND TOGGLE
 * ==========================================================================
 *
 * Procedural ambient sound designed from published research on music
 * and relaxation. Key findings applied:
 *
 * 1. TEMPO 60 BPM — Music at ~60 BPM entrains heart rate, promotes
 *    alpha brainwaves, and activates the parasympathetic nervous system
 *    (Iwanaga 2021, 45 citations; Bernatzky 2011; 2026 review).
 *
 * 2. INSTRUMENTAL > VOCAL — Instrumental music produces greater
 *    stress reduction than music with lyrics
 *    (systematic review, 768 citations, 2020).
 *
 * 3. PENTATONIC SCALE — Evaluated as more pleasant and relaxing
 *    than other tonal structures (PMC study).
 *
 * 4. SUSTAINED TONES — Slow attack/release avoids startle responses.
 *    Natural sounds (water) enhance calm (scoping review, 28 citations, 2025).
 *
 * Sound layers (all procedural, no external files):
 *
 *   Layer 1 — Brown noise → LPF 350 Hz (gentle water ambience)
 *   Layer 2 — C major pentatonic pad: C3 + E3 + G3 sines with slow
 *              breathing LFO modulation (20 s cycle) and gentle detune
 *   Layer 3 — Sub-bass C2 (65 Hz) for warmth and grounding
 *   Layer 4 — Shimmer A4 (440 Hz) → LPF 900 Hz, slow tremolo (12 s cycle)
 *   LFO A   — 1 Hz (60 BPM) subtle pulse on master gain for
 *              heart-rate entrainment
 *   LFO B   — 0.05 Hz (~20 s) breathing modulation on pad layer
 *   LFO C   — 0.08 Hz (~12.5 s) gentle shimmer modulation
 *
 * Master volume: 0.30.  1.0 s fade-in / fade-out.
 * AudioContext created on first click (browser autoplay policy).
 * ========================================================================== */

const FADE_DURATION = 1.0;
const MASTER_VOLUME = 0.30;

/* ── Brown noise buffer (water ambience) ── */
function createBrownNoiseBuffer(ctx: AudioContext, duration = 6): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = Math.floor(sampleRate * duration);
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    lastOut = (lastOut + 0.02 * white) / 1.02;
    data[i] = lastOut * 3.5;
  }
  /* Cross-fade at loop boundaries to avoid click */
  const fadeLen = Math.floor(sampleRate * 0.04);
  for (let i = 0; i < fadeLen; i++) {
    const t = i / fadeLen;
    data[i] *= t;
    data[length - 1 - i] *= t;
  }
  return buffer;
}

/* ── Helper: create a sine oscillator with detune ── */
function sineOsc(
  ctx: AudioContext,
  freq: number,
  detuneCents: number,
): OscillatorNode {
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = freq;
  osc.detune.value = detuneCents;
  return osc;
}

export function AmbientSound() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<{
    ctx: AudioContext;
    master: GainNode;
    nodes: (OscillatorNode | AudioBufferSourceNode)[];
    lfos: OscillatorNode[];
  } | null>(null);

  const startAudio = useCallback(() => {
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    /* ── Master gain (60 BPM pulse) ── */
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(MASTER_VOLUME, now + FADE_DURATION);
    master.connect(ctx.destination);

    /* LFO A: 60 BPM pulse (1 Hz) on master — heart-rate entrainment */
    const lfoA = ctx.createOscillator();
    lfoA.type = 'sine';
    lfoA.frequency.value = 1.0; // 60 BPM
    const lfoAGain = ctx.createGain();
    lfoAGain.gain.value = 0.025; // ±0.025 modulation depth
    lfoA.connect(lfoAGain);
    lfoAGain.connect(master.gain); // modulates master gain AudioParam
    lfoA.start(now);

    const nodes: (OscillatorNode | AudioBufferSourceNode)[] = [];
    const lfos: OscillatorNode[] = [lfoA];

    /* ── LFO B: breathing modulation for pad layer (20 s cycle) ── */
    const lfoB = ctx.createOscillator();
    lfoB.type = 'sine';
    lfoB.frequency.value = 0.05; // ~20 s cycle
    const lfoBGain = ctx.createGain();
    lfoBGain.gain.value = 0.012; // subtle breathing
    lfoB.start(now);
    lfos.push(lfoB);

    /* ── LFO C: shimmer modulation (12.5 s cycle) ── */
    const lfoC = ctx.createOscillator();
    lfoC.type = 'sine';
    lfoC.frequency.value = 0.08; // ~12.5 s cycle
    const lfoCGain = ctx.createGain();
    lfoCGain.gain.value = 0.004;
    lfoC.start(now);
    lfos.push(lfoC);

    /* ══════════════════════════════════════════════════════════════
     * Layer 1: Water ambience (brown noise → low-pass)
     * ══════════════════════════════════════════════════════════════ */
    const noiseBuffer = createBrownNoiseBuffer(ctx, 6);
    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = noiseBuffer;
    noiseSrc.loop = true;
    const waterLPF = ctx.createBiquadFilter();
    waterLPF.type = 'lowpass';
    waterLPF.frequency.value = 350;
    waterLPF.Q.value = 0.5;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.10;
    noiseSrc.connect(waterLPF);
    waterLPF.connect(noiseGain);
    noiseGain.connect(master);
    noiseSrc.start(now);
    nodes.push(noiseSrc);

    /* ══════════════════════════════════════════════════════════════
     * Layer 2: Pentatonic pad — C major triad from C pentatonic
     *   C3 (130.81 Hz), E3 (164.81 Hz), G3 (196.00 Hz)
     *   Gentle detune for warmth; breathing LFO modulation
     * ══════════════════════════════════════════════════════════════ */
    const padNotes = [
      { freq: 130.81, detune: 2, gain: 0.035 },  // C3
      { freq: 164.81, detune: -3, gain: 0.028 }, // E3
      { freq: 196.00, detune: 4, gain: 0.022 },  // G3
    ];

    for (const note of padNotes) {
      const osc = sineOsc(ctx, note.freq, note.detune);
      const gain = ctx.createGain();
      gain.gain.value = note.gain;
      // Breathing LFO modulates this note's gain
      lfoBGain.connect(gain.gain);
      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      nodes.push(osc);
    }

    /* ══════════════════════════════════════════════════════════════
     * Layer 3: Sub-bass warmth — C2 (65.41 Hz)
     * ══════════════════════════════════════════════════════════════ */
    const subBass = sineOsc(ctx, 65.41, 0);
    const subGain = ctx.createGain();
    subGain.gain.value = 0.018;
    subBass.connect(subGain);
    subGain.connect(master);
    subBass.start(now);
    nodes.push(subBass);

    /* ══════════════════════════════════════════════════════════════
     * Layer 4: Shimmer — A4 (440 Hz) filtered, slow tremolo
     * ══════════════════════════════════════════════════════════════ */
    const shimmer = sineOsc(ctx, 440.0, -1);
    const shimmerLPF = ctx.createBiquadFilter();
    shimmerLPF.type = 'lowpass';
    shimmerLPF.frequency.value = 900;
    shimmerLPF.Q.value = 1.0;
    const shimmerGain = ctx.createGain();
    shimmerGain.gain.value = 0.006;
    // Connect shimmer LFO
    lfoC.connect(lfoCGain);
    lfoCGain.connect(shimmerGain.gain);
    shimmer.connect(shimmerLPF);
    shimmerLPF.connect(shimmerGain);
    shimmerGain.connect(master);
    shimmer.start(now);
    nodes.push(shimmer);

    /* ── A3 (220 Hz) — fifth above, same breathing LFO ── */
    const a3 = sineOsc(ctx, 220.0, 1);
    const a3Gain = ctx.createGain();
    a3Gain.gain.value = 0.014;
    lfoBGain.connect(a3Gain.gain);
    a3.connect(a3Gain);
    a3Gain.connect(master);
    a3.start(now);
    nodes.push(a3);

    /* Connect LFO B → lfoBGain once (fan-out to all pad gains) */
    lfoB.connect(lfoBGain);

    audioRef.current = { ctx, master, nodes, lfos };
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
      ref.nodes.forEach((n) => {
        try { n.stop(); } catch { /* already stopped */ }
      });
      ref.lfos.forEach((l) => {
        try { l.stop(); } catch { /* already stopped */ }
      });
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
