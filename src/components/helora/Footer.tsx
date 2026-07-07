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
    <footer className="bg-gradient-to-br from-[#283106] to-[#1a2004] text-white mt-auto">
      {/* Top border accent */}
      <div className="h-[3px] bg-helora-sage" aria-hidden="true" />
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Logo & tagline */}
          <div>
            <span className="font-serif font-normal text-xl tracking-tight">
              Hel<span className="text-helora-sage">o</span>ra
            </span>
            <p className="font-sans text-helora-gainsboro text-sm mt-2 leading-relaxed">
              Cuidar de você é nossa essência.
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
              className="font-sans text-sm text-helora-sienna hover:text-helora-sienna/80 transition-colors duration-200 text-left focus:outline-none focus-visible:underline w-fit font-medium"
            >
              Acesso profissional
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-helora-sage/30 pt-4 mt-8 text-center">
          <p className="font-sans text-xs text-helora-tan">
            © 2024 Helora. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}