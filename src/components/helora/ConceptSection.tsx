'use client';

import { ScrollReveal } from './ScrollReveal';
import { FloatingLeaf, OrganicBranch } from './OrganicNatureBg';

export function ConceptSection() {
  return (
    <section id="conceito" className="bg-helora-white py-12 md:py-24 relative overflow-hidden">
      {/* Organic nature background accents */}
      <div className="absolute top-0 right-0 pointer-events-none opacity-[0.03] max-w-[50%]" aria-hidden="true">
        <svg className="w-full h-auto" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M200 20 Q350 80, 340 200 Q330 340, 180 380 Q30 410, 20 260 Q10 100, 200 20Z" fill="#777F5C" />
          <path d="M200 20 Q350 80, 340 200 Q330 340, 180 380 Q30 410, 20 260 Q10 100, 200 20Z" fill="none" stroke="#777F5C" strokeWidth="1" />
          <path d="M195 40 Q210 180, 175 350" stroke="#777F5C" strokeWidth="0.5" fill="none" opacity="0.5" />
          <path d="M195 120 Q160 100, 120 120" stroke="#777F5C" strokeWidth="0.4" fill="none" opacity="0.3" />
          <path d="M200 180 Q240 160, 280 175" stroke="#777F5C" strokeWidth="0.4" fill="none" opacity="0.3" />
          <path d="M190 250 Q150 235, 100 250" stroke="#777F5C" strokeWidth="0.4" fill="none" opacity="0.3" />
        </svg>
      </div>

      {/* Floating leaf accents */}
      <FloatingLeaf className="absolute top-12 left-4 md:left-12" size="md" color="sage" />
      <FloatingLeaf className="absolute bottom-16 right-8 md:right-16" size="sm" color="sienna" />

      {/* Organic branch decoration */}
      <OrganicBranch className="absolute bottom-0 right-0 opacity-40" flip />

      <div className="max-w-2xl mx-auto px-4 relative z-10">
        <ScrollReveal>
          <h2 className="font-serif font-normal text-2xl md:text-4xl text-helora-dark-green tracking-tight text-balance mb-8">
            O que é a Helora
          </h2>

          <div className="space-y-6 text-helora-dark-coffee font-sans relative leading-[1.85]">
            {/* Organic sienna accent — curved leaf-like border */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full overflow-hidden">
              <svg width="3" height="100%" viewBox="0 0 3 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 0 Q0 75, 2 150 Q3 225, 1.5 300" stroke="#9C6146" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </div>

            <p className="text-base md:text-[17px] pl-8">
              A Helora nasceu da crença de que cuidado verdadeiro começa com presença. Não somos apenas um
              consultório. Somos um espaço onde você pode ser exatamente quem é, no seu tempo.
            </p>
            <p className="text-base md:text-[17px] pl-8">
              Aqui, saúde integrada significa olhar para você por completo: corpo, mente e emoção. Sem
              rótulos, sem pressa. Apenas cuidado que faz sentido.
            </p>
            <p className="text-base md:text-[17px] pl-8">
              Acreditamos na saúde integrada como filosofia de vida: cada aspecto de quem você é merece
              atenção e respeito. Na Helora, você encontra um espaço acolhedor para cuidar de si com
              serenidade e confiança, no seu próprio ritmo.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}