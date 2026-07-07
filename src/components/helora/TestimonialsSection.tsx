'use client';

import { ScrollReveal } from './ScrollReveal';
import { FloatingLeaf } from './OrganicNatureBg';

const TESTIMONIALS = [
  {
    quote:
      'A Helora me acolheu num momento em que eu precisava ser ouvida, não consertada. Hoje me sinto mais inteira.',
    name: 'Mariana S.',
    role: 'Psicoterapia individual',
  },
  {
    quote:
      'O espaço é tão sereno que já chego e sinto o peso aliviar. A equipe toda transmite essa energia de cuidado genuíno.',
    name: 'Carlos R.',
    role: 'Acompanhamento integrado',
  },
  {
    quote:
      'Depois de anos evitando terapia, a Helora me fez sentir segura o suficiente para começar. Melhor decisão da minha vida.',
    name: 'Fernanda L.',
    role: 'Primeira sessão',
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-helora-antique-white/50 py-24 md:py-32 relative overflow-hidden nature-grain">
      {/* Organic background elements */}
      <FloatingLeaf className="absolute top-8 right-6 md:right-20" size="sm" color="sage" />
      <FloatingLeaf className="absolute bottom-12 left-8 md:left-16" size="md" color="sienna" />

      {/* Large subtle organic shape */}
      <div className="absolute -bottom-20 -right-20 pointer-events-none animate-breathe" aria-hidden="true">
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-[0.03]">
          <path d="M150 10 Q280 60, 270 170 Q260 280, 140 290 Q20 300, 10 180 Q0 60, 150 10Z" fill="#777F5C" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="max-w-2xl mb-14">
            <h2 className="font-serif font-normal text-2xl md:text-4xl text-helora-dark-green tracking-tight text-balance mb-4">
              O que dizem sobre nós
            </h2>
            <p className="font-sans text-helora-tan text-base md:text-lg leading-relaxed">
              Palavras de quem viveu essa experiência.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, index) => (
            <ScrollReveal key={t.name} delay={index * 0.12}>
              <div className="helora-card h-full flex flex-col hover:shadow-organic-lg transition-shadow duration-300 bg-gradient-to-b from-white to-helora-antique-white/20 relative overflow-hidden">
                {/* Organic quote mark — leaf-inspired */}
                <div className="absolute top-4 right-4 pointer-events-none opacity-[0.04]" aria-hidden="true">
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30 5 Q50 15, 48 35 Q46 52, 28 55 Q12 57, 10 40 Q8 22, 30 5Z" fill="#777F5C" />
                    <path d="M30 5 Q50 15, 48 35 Q46 52, 28 55 Q12 57, 10 40 Q8 22, 30 5Z" fill="none" stroke="#777F5C" strokeWidth="0.5" />
                    <path d="M28 12 Q32 30, 24 48" stroke="#777F5C" strokeWidth="0.5" fill="none" />
                  </svg>
                </div>

                {/* Large quote mark */}
                <span
                  className="font-serif text-5xl text-helora-sage/25 leading-none select-none mb-4 block"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>

                {/* Quote text */}
                <p className="font-serif italic text-helora-dark-coffee text-base md:text-[17px] leading-relaxed flex-1 mb-6">
                  {t.quote}
                </p>

                {/* Attribution */}
                <div className="border-t border-helora-gainsboro/60 pt-4">
                  <p className="font-sans font-medium text-sm text-helora-dark-coffee">
                    {t.name}
                  </p>
                  <p className="font-sans text-sm text-helora-tan mt-0.5">
                    {t.role}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}