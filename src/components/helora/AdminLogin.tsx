'use client';

import { useState, type FormEvent } from 'react';
import { useAuthStore, useAppStore } from '@/stores/helora-store';
import { ArrowLeft } from 'lucide-react';
import OrganicSpinner from './OrganicSpinner';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((s) => s.login);
  const setView = useAppStore((s) => s.setView);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Algo deu errado. Que tal tentar novamente?');
        return;
      }

      login({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        specialty: data.specialty,
      });

      setView('admin');
    } catch {
      setError('Não conseguimos conectar. Verifique sua internet e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-helora-antique-white flex items-center justify-center px-4">
        <OrganicSpinner message="Verificando suas credenciais..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-helora-antique-white flex items-center justify-center px-4">
      <div className="helora-card max-w-md w-full p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="organic-o-divider w-full max-w-[200px]">
            <span className="organic-o">O</span>
          </div>
        </div>

        <h1 className="font-serif text-2xl text-helora-dark-coffee text-center tracking-[-0.02em]">
          Acesso profissional
        </h1>

        <p className="text-helora-tan text-center text-sm mt-2 font-sans">
          Este espaço é exclusivo para profissionais da Helora.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="helora-label">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              className="helora-input"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="helora-label">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              className="helora-input"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-pill w-full bg-helora-sage text-white hover:bg-helora-dark-green py-3 font-sans text-[15px] font-medium transition-colors duration-200 cursor-pointer"
          >
            Entrar
          </button>

          {error && (
            <p className="text-helora-sienna text-sm text-center font-sans">{error}</p>
          )}
        </form>

        <button
          type="button"
          onClick={() => setView('public')}
          className="text-helora-tan hover:text-helora-dark-coffee text-center w-full mt-4 font-sans text-sm transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao site
        </button>
      </div>
    </div>
  );
}