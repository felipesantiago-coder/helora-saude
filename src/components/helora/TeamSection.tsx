'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollReveal } from './ScrollReveal';
import { FloatingLeaf, OrganicBranch } from './OrganicNatureBg';

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
    <section id="equipe" className="bg-helora-white py-24 md:py-32 relative overflow-hidden nature-grain">
      {/* Organic nature decorations */}
      <FloatingLeaf className="absolute top-16 left-4 md:left-10" size="md" color="sage" />
      <FloatingLeaf className="absolute bottom-20 right-6 md:right-14" size="lg" color="dark" />
      <OrganicBranch className="absolute top-8 right-4 md:right-10 opacity-30" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="max-w-2xl mb-14">
            <h2 className="font-serif font-normal text-2xl md:text-4xl text-helora-dark-green tracking-tight text-balance mb-4">
              Quem te acompanha
            </h2>
            <p className="font-sans text-helora-tan text-base md:text-lg leading-relaxed">
              Profissionais que escolheram o cuidado como caminho.
            </p>
          </div>
        </ScrollReveal>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="helora-card space-y-4">
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
          <div className="text-center py-16">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
            {professionals.map((person, index) => (
              <ScrollReveal key={person.id} delay={index * 0.12}>
                <div className="helora-card flex flex-col hover:shadow-organic-lg transition-shadow duration-300 relative overflow-hidden">
                  {/* Organic left accent — leaf-like SVG curve */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px]" aria-hidden="true">
                    <svg width="3" height="100%" viewBox="0 0 3 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.5 0 Q0 50, 2.5 100 Q3 150, 1.5 200" stroke="#777F5C" strokeWidth="3" fill="none" strokeLinecap="round" />
                    </svg>
                  </div>

                  {/* Avatar with organic shape */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-helora-sage/20 to-helora-sage/10 flex items-center justify-center shrink-0 border border-helora-sage/10">
                      <span className="font-serif text-lg text-helora-sage font-normal">
                        {getInitials(person.name)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-serif font-normal text-xl text-helora-dark-coffee tracking-tight">
                        {person.name}
                      </h3>
                      {person.specialty && (
                        <div className="inline-flex items-center gap-1.5 mt-1 bg-helora-sienna/8 rounded-full px-2.5 py-0.5 border border-helora-sienna/10">
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
                    <p className="font-sans text-[15px] text-helora-tan leading-relaxed mt-1">
                      {person.bio}
                    </p>
                  )}

                  {/* Subtle organic corner accent */}
                  <div className="absolute bottom-0 right-0 pointer-events-none opacity-[0.04]" aria-hidden="true">
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M80 80 Q50 70, 40 40 Q35 20, 50 5 Q65 15, 70 40 Q75 60, 80 80Z" fill="#777F5C" />
                    </svg>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && professionals.length === 0 && (
          <div className="text-center py-16">
            <p className="font-sans text-helora-tan text-lg">
              Nossa equipe está se formando com carinho. Em breve você conhecerá quem vai te acompanhar.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}