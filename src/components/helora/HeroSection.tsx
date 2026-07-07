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
      {/* Multiple layered organic blobs for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        {/* Primary large sage blob */}
        <div
          className="organic-blob"
          style={{
            width: '70vw',
            height: '70vw',
            maxWidth: '900px',
            maxHeight: '900px',
            top: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'radial-gradient(ellipse, rgba(119,127,92,0.13) 0%, rgba(119,127,92,0.04) 50%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        {/* Secondary warm sienna blob — offset */}
        <div
          className="organic-blob"
          style={{
            width: '50vw',
            height: '50vw',
            maxWidth: '600px',
            maxHeight: '600px',
            top: '55%',
            right: '-10%',
            background: 'radial-gradient(ellipse, rgba(156,97,70,0.07) 0%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />
        {/* Tertiary sage blob — top left accent */}
        <div
          className="organic-blob"
          style={{
            width: '40vw',
            height: '40vw',
            maxWidth: '500px',
            maxHeight: '500px',
            top: '5%',
            left: '-5%',
            background: 'radial-gradient(ellipse, rgba(119,127,92,0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center py-28 md:py-40">
        {/* Tag */}
        <motion.span
          className="inline-block font-sans font-medium text-helora-sage uppercase tracking-widest text-sm mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
        >
          saúde integrada
        </motion.span>

        {/* Heading */}
        <motion.h1
          className="font-serif font-light text-5xl md:text-7xl text-helora-dark-coffee tracking-tight text-balance mb-6 relative inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
        >
          Cuidar de você é nossa essência.
          <span className="absolute -bottom-2 left-1/4 right-1/4 h-[3px] bg-helora-sienna rounded-full" aria-hidden="true" />
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="font-sans text-helora-tan text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.35 }}
        >
          Um espaço de acolhimento onde você pode respirar, ser ouvido e cuidar de si — sem pressa, sem julgamento.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.5 }}
        >
          <button
            onClick={() => setView('booking')}
            className="btn-pill bg-helora-sage text-white font-medium py-3.5 px-9 hover:bg-helora-dark-green transition-[color,background-color,transform] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-helora-sage/50 text-base shadow-warm-lg active:scale-[0.98]"
          >
            Agendar sua primeira sessão
          </button>
          <button
            onClick={() => {
              document.getElementById('equipe')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-ghost text-base"
          >
            Conheça a equipe
          </button>
        </motion.div>

        {/* Trust line */}
        <motion.p
          className="mt-8 font-sans text-sm text-helora-tan/80 tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          ✦ Acolhimento seguro e sem pressa
        </motion.p>

        {/* Decorative animated O — slower, more subtle */}
        <motion.div
          className="mt-20 flex justify-center"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.9 }}
        >
          <motion.span
            className="organic-o organic-o-large opacity-50"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            O
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}