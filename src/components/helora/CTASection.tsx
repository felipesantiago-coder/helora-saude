'use client';

import { useAppStore } from '@/stores/helora-store';
import { ScrollReveal } from './ScrollReveal';
import { OrganicNatureBg } from './OrganicNatureBg';

export function CTASection() {
  const setView = useAppStore((s) => s.setView);

  return (
    <section className="relative overflow-hidden py-16 md:py-28">
      {/* Forest layer: Soil/Mycelium — interconnected network, warm sienna tones */}
      <OrganicNatureBg variant="soil" />

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