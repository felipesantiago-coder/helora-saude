'use client';

import { useState, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import { useAppStore } from '@/stores/helora-store';

const NAV_LINKS = [
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

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const setView = useAppStore((s) => s.setView);

  const handleNavClick = useCallback(
    (href: string) => {
      setMobileOpen(false);
      scrollToSection(href);
    },
    [],
  );

  const handleBooking = useCallback(() => {
    setMobileOpen(false);
    setView('booking');
  }, [setView]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-helora-white shadow-warm border-b-[3px] border-b-helora-sage">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollToSection('#hero')}
          className="font-serif text-2xl text-helora-dark-coffee tracking-tight focus:outline-none"
          aria-label="Voltar ao início"
        >
          Hel<span className="text-helora-sienna">o</span>ra
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Navegação principal">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="font-sans text-sm font-medium text-helora-tan hover:text-helora-dark-coffee transition-colors duration-200 focus:outline-none focus-visible:underline hover:font-semibold"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={handleBooking}
            className="btn-pill bg-helora-sage text-white text-sm font-medium px-5 py-2 hover:bg-helora-dark-green transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-helora-sage/50"
          >
            Agendar sessão
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden p-2 text-helora-dark-coffee focus:outline-none focus-visible:ring-2 focus-visible:ring-helora-sage/50 rounded-lg"
          aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 top-16 bg-helora-dark-coffee/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed top-16 left-0 right-0 bg-helora-white shadow-warm-lg z-40 transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col py-4 px-4 gap-1" aria-label="Menu mobile">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="font-sans text-base font-medium text-helora-dark-coffee hover:text-helora-sage py-3 px-3 rounded-xl hover:bg-helora-gainsboro/50 transition-colors duration-200 text-left focus:outline-none focus-visible:bg-helora-gainsboro/50"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 px-3">
            <button
              onClick={handleBooking}
              className="w-full btn-pill bg-helora-sage text-white text-sm font-medium px-5 py-3 hover:bg-helora-dark-green transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-helora-sage/50"
            >
              Agendar sessão
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}