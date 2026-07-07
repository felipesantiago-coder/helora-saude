'use client';

import { ScrollReveal } from './ScrollReveal';

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
    <section className="bg-helora-white py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-4">
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
              <div className="helora-card h-full flex flex-col hover:shadow-[0_8px_32px_rgba(119,127,92,0.10)] transition-shadow duration-300 bg-gradient-to-b from-white to-helora-antique-white/30">
                {/* Large quote mark */}
                <span
                  className="font-serif text-5xl text-helora-sage/30 leading-none select-none mb-4 block"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>

                {/* Quote text */}
                <p className="font-serif italic text-helora-dark-coffee text-base md:text-[17px] leading-relaxed flex-1 mb-6">
                  {t.quote}
                </p>

                {/* Attribution */}
                <div className="border-t border-helora-gainsboro pt-4">
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