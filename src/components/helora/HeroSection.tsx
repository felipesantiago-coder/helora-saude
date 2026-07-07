'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/helora-store';
import { OrganicNatureBg } from './OrganicNatureBg';

export function HeroSection() {
  const setView = useAppStore((s) => s.setView);

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex items-center justify-center pt-14 sm:pt-16 overflow-hidden"
    >
      {/* Immersive organic nature background — brand identity cover inspired */}
      <OrganicNatureBg variant="hero" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-4 text-center py-20 sm:py-28 md:py-40">
        {/* Tag */}
        <motion.span
          className="inline-block font-sans font-medium text-helora-gainsboro/90 uppercase tracking-[0.25em] text-xs md:text-sm mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
        >
          saúde integrada
        </motion.span>

        {/* Heading */}
        <motion.h1
          className="font-serif font-light text-[2rem] sm:text-4xl md:text-6xl lg:text-7xl text-white tracking-tight text-balance mb-4 sm:mb-6 leading-[1.15]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.25 }}
        >
          Cuidar de você é
          <br />
          <span className="text-helora-gainsboro/80">nossa essência.</span>
        </motion.h1>

        {/* Organic underline */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.5 }}
          aria-hidden="true"
        >
          <svg width="120" height="12" viewBox="0 0 120 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2 8 Q30 2, 60 6 Q90 10, 118 4"
              stroke="#9C6146"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.6"
            />
            <path
              d="M10 10 Q40 4, 70 7 Q100 10, 110 6"
              stroke="#777F5C"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.4"
            />
          </svg>
        </motion.div>

        {/* Subtext */}
        <motion.p
          className="font-sans text-helora-gainsboro/70 text-sm sm:text-base md:text-lg max-w-xl mx-auto mb-8 sm:mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 }}
        >
          Um espaço de acolhimento onde você pode respirar, ser ouvido e cuidar de si. Sem pressa, sem julgamento.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.55 }}
        >
          <button
            onClick={() => setView('booking')}
            className="btn-pill bg-helora-sage text-white font-medium py-3 px-7 sm:py-3.5 sm:px-9 hover:bg-helora-gainsboro/30 hover:text-white border border-helora-sage/40 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-helora-sage/50 text-sm sm:text-base active:scale-[0.98] w-full sm:w-auto"
          >
            Agendar sua primeira sessão
          </button>
          <button
            onClick={() => {
              document.getElementById('equipe')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="font-sans font-medium text-sm text-helora-gainsboro/70 hover:text-white border border-helora-gainsboro/20 hover:border-helora-gainsboro/40 rounded-full px-6 py-2.5 sm:py-3 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-helora-sage/50"
          >
            Conheça a equipe
          </button>
        </motion.div>

        {/* Trust line */}
        <motion.p
          className="mt-10 font-sans text-xs text-helora-gainsboro/40 tracking-[0.2em] uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          Acolhimento seguro e sem pressa
        </motion.p>

        {/* Decorative animated organic O — the brand's signature element */}
        <motion.div
          className="mt-16 flex justify-center"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
        >
          <motion.span
            className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full border border-helora-gainsboro/20 text-helora-gainsboro/30 font-serif text-2xl md:text-3xl"
            animate={{ scale: [1, 1.06, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            O
          </motion.span>
        </motion.div>
      </div>

      {/* Bottom organic wave transition to next section */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-10" aria-hidden="true">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40 Q180 100, 360 70 Q540 40, 720 60 Q900 80, 1080 50 Q1260 20, 1440 45 L1440 120 L0 120 Z"
            fill="#FFFFFF"
          />
          <path
            d="M0 60 Q200 90, 400 75 Q600 60, 800 80 Q1000 100, 1200 70 Q1350 50, 1440 65 L1440 120 L0 120 Z"
            fill="#FFFFFF"
            opacity="0.5"
          />
        </svg>
      </div>
    </section>
  );
}