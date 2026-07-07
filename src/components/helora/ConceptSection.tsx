'use client';

import { ScrollReveal } from './ScrollReveal';

export function ConceptSection() {
  return (
    <section id="conceito" className="bg-helora-white py-24 md:py-32 relative overflow-hidden">
      {/* Background decorative organic "O" */}
      <div className="absolute top-8 right-4 md:right-12 pointer-events-none select-none opacity-[0.05]" aria-hidden="true">
        <span className="font-serif text-[200px] md:text-[320px] text-helora-sage leading-none">
          O
        </span>
      </div>

      <div className="max-w-2xl mx-auto px-4 relative z-10">
        <ScrollReveal>
          <h2 className="font-serif font-normal text-2xl md:text-4xl text-helora-dark-green tracking-tight text-balance mb-8">
            O que é a Helora
          </h2>

          <div className="space-y-6 text-helora-dark-coffee font-sans relative border-l-[3px] border-l-helora-sienna pl-8 rounded-l-full leading-[1.85]">
            <p className="text-base md:text-[17px]">
              A Helora nasceu da crença de que cuidado verdadeiro começa com presença. Não somos apenas um
              consultório — somos um espaço onde você pode ser exatamente quem é, no seu tempo.
            </p>
            <p className="text-base md:text-[17px]">
              Aqui, saúde integrada significa olhar para você por completo: corpo, mente e emoção. Sem
              rótulos, sem pressa. Apenas cuidado que faz sentido.
            </p>
            <p className="text-base md:text-[17px]">
              Acreditamos na saúde integrada como filosofia de vida — cada aspecto de quem você é merece
              atenção e respeito. Na Helora, você encontra um espaço acolhedor para cuidar de si com
              serenidade e confiança, no seu próprio ritmo.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}