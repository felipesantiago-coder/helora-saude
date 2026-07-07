'use client';

import { useAppStore } from '@/stores/helora-store';
import { ScrollReveal } from './ScrollReveal';
import { OrganicNatureBg, FloatingLeaf } from './OrganicNatureBg';

export function CTASection() {
  const setView = useAppStore((s) => s.setView);

  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      {/* Organic nature background — light variant */}
      <OrganicNatureBg variant="light" />

      {/* Additional organic accents */}
      <FloatingLeaf className="absolute top-8 left-8 md:left-20" size="lg" color="sage" />
      <FloatingLeaf className="absolute bottom-12 right-8 md:right-16" size="md" color="dark" />

      {/* Large breathing organic shape behind text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-breathe" aria-hidden="true">
        <svg width="500" height="400" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-[0.04]">
          <path d="M250 20 Q450 80, 430 220 Q410 360, 240 380 Q70 400, 40 230 Q10 60, 250 20Z" fill="#777F5C" />
          <path d="M250 20 Q450 80, 430 220 Q410 360, 240 380 Q70 400, 40 230 Q10 60, 250 20Z" fill="none" stroke="#777F5C" strokeWidth="0.5" />
          <path d="M245 40 Q260 180, 230 340" stroke="#777F5C" strokeWidth="0.4" fill="none" opacity="0.4" />
        </svg>
      </div>

      <div className="max-w-2xl mx-auto px-4 text-center relative z-10">
        <ScrollReveal>
          <h2 className="font-serif font-normal text-3xl md:text-5xl text-helora-dark-coffee tracking-tight text-balance mb-6">
            Pronto para cuidar de você?
          </h2>
          <p className="font-sans text-helora-tan text-lg md:text-xl leading-relaxed mb-10 max-w-lg mx-auto">
            Dê o primeiro passo. Estamos aqui para te acompanhar no seu ritmo.
          </p>
          <button
            onClick={() => setView('booking')}
            className="btn-pill bg-helora-sage text-white font-medium py-3.5 px-9 hover:bg-helora-dark-green transition-[color,background-color,transform] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-helora-sage/50 text-base shadow-organic-lg active:scale-[0.98]"
          >
            Agendar sua primeira sessão
          </button>
        </ScrollReveal>
      </div>
    </section>
  );
}