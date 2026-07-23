'use client';

import { useState, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/* ==========================================================================
 * AMBIENT SOUND TOGGLE
 * ==========================================================================
 *
 * Procedural ambient sound generated entirely via Web Audio API.
 * No external audio files — the sound is synthesised in real time:
 *
 *   Layer 1 — Brown noise → low-pass filter (400 Hz) → gain 0.25
 *              Sounds like distant, gentle water lapping.
 *   Layer 2 — Sine pad at 110 Hz → gain 0.03
 *              Adds a warm, grounding low-frequency hum.
 *   Layer 3 — Sine pad at 165 Hz (perfect fifth) → gain 0.015
 *              Harmonic richness without feeling musical.
 *
 * Master volume: 0.10 (very low).  0.5 s fade-in / fade-out.
 * AudioContext is created on first user interaction (browser policy).
 * The toggle button is a minimal speaker icon in the hero corner.
 * ========================================================================== */

const FADE_DURATION = 0.5; // seconds for volume ramp
const MASTER_VOLUME = 0.10; // very low — background ambience

function createBrownNoiseBuffer(ctx: AudioContext, duration = 4): AudioBuffer {
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
  /* Short cross-fade at loop boundaries to avoid click */
  const fadeLen = Math.floor(sampleRate * 0.03); // 30 ms
  for (let i = 0; i < fadeLen; i++) {
    const t = i / fadeLen;
    data[i] *= t;
    data[length - 1 - i] *= t;
  }
  return buffer;
}

export function AmbientSound() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<{
    ctx: AudioContext;
    master: GainNode;
    sources: AudioBufferSourceNode[];
  } | null>(null);

  const startAudio = useCallback(() => {
    const ctx = new AudioContext();
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(MASTER_VOLUME, ctx.currentTime + FADE_DURATION);
    master.connect(ctx.destination);

    const sources: AudioBufferSourceNode[] = [];

    /* Layer 1: Brown noise → low-pass (water) */
    const noiseBuffer = createBrownNoiseBuffer(ctx, 4);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    const lpf = ctx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.value = 400;
    lpf.Q.value = 0.7;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.25;
    noiseSource.connect(lpf);
    lpf.connect(noiseGain);
    noiseGain.connect(master);
    noiseSource.start();
    sources.push(noiseSource);

    /* Layer 2: Low sine drone (warmth) */
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 110;
    const osc1Gain = ctx.createGain();
    osc1Gain.gain.value = 0.03;
    osc1.connect(osc1Gain);
    osc1Gain.connect(master);
    osc1.start();
    sources.push(osc1);

    /* Layer 3: Perfect-fifth drone (harmonic richness) */
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 165;
    const osc2Gain = ctx.createGain();
    osc2Gain.gain.value = 0.015;
    osc2.connect(osc2Gain);
    osc2Gain.connect(master);
    osc2.start();
    sources.push(osc2);

    audioRef.current = { ctx, master, sources };
    setPlaying(true);
  }, []);

  const stopAudio = useCallback(() => {
    if (!audioRef.current) return;
    const { ctx, master } = audioRef.current;
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + FADE_DURATION);
    const ref = audioRef.current;
    setTimeout(() => {
      ref.sources.forEach((s) => {
        try { s.stop(); } catch { /* already stopped */ }
      });
      ref.ctx.close();
    }, FADE_DURATION * 1000 + 100);
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
