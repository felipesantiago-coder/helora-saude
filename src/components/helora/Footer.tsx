'use client';

const FOOTER_LINKS = [
  { label: 'Início', href: '#hero' },
  { label: 'Conceito', href: '#conceito' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Equipe', href: '#equipe' },
] as const;

function scrollToSection(href: string) {
  const id = href.replace('#', '');
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#283106] to-[#1a2004] text-white mt-auto relative">
      {/* Organic nature wave top — multi-layered flowing curves */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] -translate-y-[99%]" aria-hidden="true">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          preserveAspectRatio="none"
        >
          {/* Background fill layer */}
          <path
            d="M0 30 Q180 65, 360 45 Q540 25, 720 50 Q900 75, 1080 40 Q1260 10, 1440 35 L1440 80 L0 80 Z"
            fill="#283106"
          />
          {/* Subtle sage highlight on the edge */}
          <path
            d="M0 30 Q180 65, 360 45 Q540 25, 720 50 Q900 75, 1080 40 Q1260 10, 1440 35"
            stroke="#777F5C"
            strokeWidth="1"
            fill="none"
            opacity="0.3"
          />
          {/* Leaf accent */}
          <path
            d="M720 25 Q735 12, 742 28 Q748 42, 730 44 Q712 40, 720 25Z"
            fill="#777F5C"
            opacity="0.15"
          />
        </svg>
      </div>

      {/* Top border accent */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-helora-sage/40 to-transparent" aria-hidden="true" />
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-8 md:pt-16 md:pb-12 relative">
        {/* Breathing organic glow — 10s cycle for calming parasympathetic resonance */}
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full pointer-events-none breathe-glow" style={{ background: 'radial-gradient(circle, rgba(119,127,92,0.12) 0%, rgba(119,127,92,0) 70%)' }} aria-hidden="true" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 relative z-10">
          {/* Logo & description */}
          <div>
            <img
              src="/logo-mark.svg"
              alt="Helora"
              className="h-8 sm:h-10 w-auto brightness-0 invert"
            />
            <p className="font-sans text-helora-gainsboro/80 text-sm mt-1 tracking-wider uppercase">
              saúde integrada
            </p>
            <p className="font-sans text-helora-gainsboro/70 text-sm mt-3 leading-relaxed">
              Cuidar de você é nossa essência.
            </p>
          </div>

          {/* Navigation links */}
          <nav className="flex flex-col gap-3" aria-label="Navegação do rodapé">
            {FOOTER_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="font-sans text-sm text-white/70 hover:text-white transition-colors duration-200 text-left focus:outline-none focus-visible:underline w-fit"
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-helora-sage/10 pt-5 mt-10 text-center relative z-10">
          <p className="font-sans text-xs text-helora-tan/60">
            © 2024 Helora. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}