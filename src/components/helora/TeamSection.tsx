'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Professional {
  id: string;
  name: string;
  specialty: string | null;
  bio: string | null;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function TeamSection() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchProfessionals() {
      try {
        const res = await fetch('/api/professionals');
        if (!res.ok) throw new Error();
        const data: Professional[] = await res.json();
        if (!cancelled) {
          setProfessionals(data);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    fetchProfessionals();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="equipe" className="bg-helora-white py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4">
        <div className="max-w-2xl mb-12">
          <h2 className="font-serif font-normal text-2xl md:text-4xl text-helora-dark-green tracking-tight text-balance mb-4">
            Quem te acompanha
          </h2>
          <p className="font-sans text-helora-tan text-base md:text-lg leading-relaxed">
            Profissionais que escolheram o cuidado como caminho.
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="helora-card p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-14 h-14 rounded-full shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-40 rounded-lg" />
                    <Skeleton className="h-4 w-28 rounded-lg" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4 rounded-lg" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="font-sans text-helora-tan text-lg">
              Algo deu errado. Vamos tentar juntos novamente?
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 font-sans text-sm font-medium text-helora-sage hover:text-helora-dark-green underline underline-offset-4 transition-colors duration-200 focus:outline-none"
            >
              Recarregar página
            </button>
          </div>
        )}

        {/* Professional cards */}
        {!loading && !error && professionals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            {professionals.map((person) => (
              <div key={person.id} className="helora-card p-6 flex flex-col border-l-[3px] border-l-helora-sage">
                {/* Avatar with initials */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-helora-sage/20 flex items-center justify-center shrink-0">
                    <span className="font-serif text-lg text-helora-sage font-normal">
                      {getInitials(person.name)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif font-normal text-xl text-helora-dark-coffee tracking-tight">
                      {person.name}
                    </h3>
                    {person.specialty && (
                      <div className="inline-flex items-center gap-1.5 mt-0.5 bg-helora-sienna/10 rounded-full px-2.5 py-0.5">
                        <Heart
                          size={14}
                          className="text-helora-sienna"
                          aria-hidden="true"
                        />
                        <span className="font-sans text-sm font-medium text-helora-sienna">
                          {person.specialty}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {person.bio && (
                  <p className="font-sans text-sm text-helora-tan leading-relaxed mt-3">
                    {person.bio}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && professionals.length === 0 && (
          <div className="text-center py-12">
            <p className="font-sans text-helora-tan text-lg">
              Nossa equipe está se formando com carinho. Em breve você conhecerá quem vai te acompanhar.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}