'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/helora-store';

export function HeroSection() {
  const setView = useAppStore((s) => s.setView);

  return (
    <section
      id="hero"
      className="relative bg-helora-antique-white min-h-screen flex items-center justify-center pt-16 overflow-hidden"
    >
      {/* Large sage gradient blob — 60%+ viewport presence */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 60%, rgba(119,127,92,0.12) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Bottom color bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-helora-dark-green" aria-hidden="true" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center py-20 md:py-28">
        {/* Tag */}
        <span className="inline-block font-sans font-medium text-helora-sage uppercase tracking-widest text-sm mb-6">
          saúde integrada
        </span>

        {/* Heading */}
        <h1 className="font-serif font-light text-4xl md:text-6xl text-helora-dark-coffee tracking-tight text-balance mb-6 relative inline-block">
          Cuidar de você é nossa essência.
          <span className="absolute -bottom-2 left-1/4 right-1/4 h-[3px] bg-helora-sienna rounded-full" aria-hidden="true" />
        </h1>

        {/* Subtext */}
        <p className="font-sans text-helora-tan text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
          Um espaço de acolhimento onde você pode respirar, ser ouvido e cuidar de si — sem pressa, sem julgamento.
        </p>

        {/* CTA */}
        <button
          onClick={() => setView('booking')}
          className="btn-pill bg-helora-sage text-white font-medium py-3 px-8 hover:bg-helora-dark-green transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-helora-sage/50 text-base shadow-warm-lg"
        >
          Agendar sua primeira sessão
        </button>

        {/* Decorative animated O */}
        <div className="mt-16 flex justify-center" aria-hidden="true">
          <motion.span
            className="organic-o organic-o-large"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            O
          </motion.span>
        </div>
      </div>
    </section>
  );
}