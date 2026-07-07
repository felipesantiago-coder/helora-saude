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
      {/* Decorative organic bloom */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full opacity-[0.07] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, #777F5C 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center py-20 md:py-28">
        {/* Tag */}
        <span className="inline-block font-sans font-medium text-helora-tan uppercase tracking-widest text-sm mb-6">
          saúde integrada
        </span>

        {/* Heading */}
        <h1 className="font-serif font-light text-4xl md:text-6xl text-helora-dark-coffee tracking-tight text-balance mb-6">
          Cuidar de você é nossa essência.
        </h1>

        {/* Subtext */}
        <p className="font-sans text-helora-tan text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
          Um espaço de acolhimento onde você pode respirar, ser ouvido e cuidar de si — sem pressa, sem julgamento.
        </p>

        {/* CTA */}
        <button
          onClick={() => setView('booking')}
          className="btn-pill bg-helora-sage text-white font-medium py-3 px-8 hover:bg-helora-dark-green transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-helora-sage/50 text-base"
        >
          Agendar seu primeiro encontro
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