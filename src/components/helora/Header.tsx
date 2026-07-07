'use client';

import { useState, useCallback, useEffect } from 'react';
import { Menu, X, Leaf } from 'lucide-react';
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
  const [scrolled, setScrolled] = useState(false);
  const [heroInView, setHeroInView] = useState(true);
  const setView = useAppStore((s) => s.setView);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const hero = document.getElementById('hero');
      if (hero) {
        const rect = hero.getBoundingClientRect();
        setHeroInView(rect.bottom > 80);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        heroInView
          ? 'bg-transparent text-white'
          : scrolled
            ? 'bg-helora-white/95 backdrop-blur-md shadow-organic text-helora-dark-coffee'
            : 'bg-helora-white/80 backdrop-blur-sm text-helora-dark-coffee'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollToSection('#hero')}
          className={`font-serif text-2xl tracking-tight focus:outline-none transition-colors duration-300 ${
            heroInView ? 'text-white' : 'text-helora-dark-coffee'
          }`}
          aria-label="Voltar ao início"
        >
          Hel<span className="text-helora-sage">o</span>ra
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Navegação principal">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className={`font-sans text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:underline hover:font-semibold ${
                heroInView
                  ? 'text-white/80 hover:text-white'
                  : 'text-helora-tan hover:text-helora-dark-coffee'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={handleBooking}
            className={`btn-pill text-sm font-medium px-5 py-2 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-helora-sage/50 ${
              heroInView
                ? 'bg-white/15 text-white border border-white/20 hover:bg-white/25 backdrop-blur-sm'
                : 'bg-helora-sage text-white hover:bg-helora-dark-green'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Leaf size={14} aria-hidden="true" />
              Agendar sessão
            </span>
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className={`md:hidden p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-helora-sage/50 rounded-lg transition-colors duration-200 ${
            heroInView ? 'text-white' : 'text-helora-dark-coffee'
          }`}
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
        className={`md:hidden fixed top-16 left-0 right-0 bg-helora-white shadow-organic-lg z-40 transition-transform duration-300 ease-in-out ${
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
              className="w-full btn-pill bg-helora-sage text-white text-sm font-medium px-5 py-3 hover:bg-helora-dark-green transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-helora-sage/50 flex items-center justify-center gap-2"
            >
              <Leaf size={16} aria-hidden="true" />
              Agendar sessão
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}