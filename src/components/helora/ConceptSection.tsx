export function ConceptSection() {
  return (
    <section id="conceito" className="bg-helora-white py-20 md:py-28">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="font-serif font-normal text-2xl md:text-4xl text-helora-dark-coffee tracking-tight text-balance mb-8">
          O que é a Helora
        </h2>

        <div className="space-y-5 text-helora-dark-coffee leading-relaxed font-sans relative">
          <p>
            A Helora nasceu da crença de que cuidado verdadeiro começa com presença. Não somos apenas um
            consultório — somos um espaço onde você pode ser exatamente quem é, no seu tempo.
          </p>
          <p>
            Aqui, saúde integrada significa olhar para você por completo: corpo, mente e emoção. Sem
            rótulos, sem pressa. Apenas cuidado que faz sentido.
          </p>
          <p>
            Acreditamos na saúde integrada como filosofia de vida — cada aspecto de quem você é merece
            atenção e respeito. Na Helora, você encontra um espaço acolhedor para cuidar de si com
            serenidade e confiança, no seu próprio ritmo.
          </p>

          {/* Subtle decorative organic "O" */}
          <span className="absolute -top-6 -right-4 md:-right-8 organic-o opacity-30 pointer-events-none select-none" aria-hidden="true">
            O
          </span>
        </div>
      </div>
    </section>
  );
}