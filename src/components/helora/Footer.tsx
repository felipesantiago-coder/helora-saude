'use client';

import { useAppStore } from '@/stores/helora-store';

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
  const setView = useAppStore((s) => s.setView);

  return (
    <footer className="bg-gradient-to-br from-[#283106] to-[#1a2004] text-white mt-auto relative">
      {/* Organic wave top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] -translate-y-[99%]" aria-hidden="true">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0 C360 60, 720 60, 1080 30 C1260 15, 1380 5, 1440 0 L1440 60 L0 60 Z"
            fill="#283106"
          />
        </svg>
      </div>

      {/* Top border accent */}
      <div className="h-[3px] bg-helora-sage" aria-hidden="true" />
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-8 md:pt-16 md:pb-12">
        {/* Warm tagline */}
        <p className="font-serif text-helora-gainsboro text-lg md:text-xl mb-10 text-center md:text-left">
          Cuidar é a nossa essência.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {/* Logo & tagline */}
          <div>
            <span className="font-serif font-normal text-xl tracking-tight">
              Hel<span className="text-helora-sage">o</span>ra
            </span>
            <p className="font-sans text-helora-gainsboro text-sm mt-3 leading-relaxed">
              Saúde integrada com acolhimento e serenidade. Cuidar de você é nossa essência.
            </p>
          </div>

          {/* Navigation links */}
          <nav className="flex flex-col gap-3" aria-label="Navegação do rodapé">
            {FOOTER_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="font-sans text-sm text-white/80 hover:text-white transition-colors duration-200 text-left focus:outline-none focus-visible:underline w-fit"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Professional access */}
          <div className="flex flex-col gap-3">
            <span className="font-sans text-sm text-helora-gainsboro">
              Para profissionais
            </span>
            <button
              onClick={() => setView('admin-login')}
              className="font-sans text-sm font-semibold text-helora-sienna hover:text-helora-sienna/80 transition-colors duration-200 text-left focus:outline-none focus-visible:underline w-fit underline underline-offset-4 decoration-helora-sienna/30 hover:decoration-helora-sienna"
            >
              Acesso profissional
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-helora-sage/20 pt-5 mt-10 text-center">
          <p className="font-sans text-xs text-helora-tan/80">
            © 2024 Helora. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}