'use client';

import { useEffect, useState } from 'react';
import { Leaf } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useBookingStore, useAppStore } from '@/stores/helora-store';
import { ScrollReveal } from './ScrollReveal';
import { OrganicNatureBg } from './OrganicNatureBg';

interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  duration: number;
}

/**
 * Mock services shown when the API is unavailable or no real data exists.
 * Content mirrors the seed data so the transition is seamless.
 */
const MOCK_SERVICES: Service[] = [
  {
    id: '__mock_1',
    name: 'Primeira sessão de cuidado',
    price: 180,
    description: 'Um espaço inicial para se conhecer e entender como posso te acompanhar. Sem pressa, sem compromisso imediato.',
    duration: 50,
  },
  {
    id: '__mock_2',
    name: 'Sessão individual',
    price: 200,
    description: 'Sessão contínua de cuidado, com foco no seu ritmo e nas suas necessidades.',
    duration: 60,
  },
  {
    id: '__mock_3',
    name: 'Sessão de casal',
    price: 300,
    description: 'Um espaço compartilhado para reconstruir laços e fortalecer a conexão.',
    duration: 90,
  },
];

function isMockService(service: Service): boolean {
  return service.id.startsWith('__mock_');
}

function formatPrice(price: number): string {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  const setService = useBookingStore((s) => s.setService);
  const setView = useAppStore((s) => s.setView);

  useEffect(() => {
    let cancelled = false;

    async function fetchServices() {
      try {
        const res = await fetch('/api/services');
        if (!res.ok) throw new Error();
        const data: Service[] = await res.json();
        if (cancelled) return;

        if (data.length > 0) {
          setServices(data);
          setUsingMock(false);
        } else {
          setServices(MOCK_SERVICES);
          setUsingMock(true);
        }
      } catch {
        if (!cancelled) {
          setServices(MOCK_SERVICES);
          setUsingMock(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchServices();
    return () => { cancelled = true; };
  }, []);

  function handleServiceClick(service: Service) {
    if (isMockService(service)) return;
    setService(service.id, service.name, service.price);
    setView('booking');
  }

  return (
    <section id="servicos" className="bg-helora-antique-white py-12 md:py-24 relative overflow-hidden">
      <OrganicNatureBg variant="understory" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="max-w-2xl mb-14">
            <h2 className="font-serif font-normal text-2xl md:text-4xl text-helora-dark-green tracking-tight text-balance mb-4">
              Como podemos te acompanhar
            </h2>
            <p className="font-sans text-helora-tan text-base md:text-lg leading-relaxed">
              Cada sessão é pensada para o seu momento. Escolha o que faz sentido para você agora.
            </p>
          </div>
        </ScrollReveal>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="helora-card space-y-4">
                <Skeleton className="h-6 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-2/3 rounded-lg" />
                <Skeleton className="h-7 w-24 rounded-lg mt-2" />
              </div>
            ))}
          </div>
        )}

        {/* Service cards */}
        {!loading && services.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const mock = isMockService(service);
              return (
                <ScrollReveal key={service.id} delay={index * 0.1}>
                  <button
                    onClick={() => handleServiceClick(service)}
                    disabled={mock}
                    className={
                      'helora-card text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-helora-sage/50 group w-full transition-transform relative overflow-hidden'
                      + (mock
                        ? ' cursor-default opacity-90'
                        : ' cursor-pointer active:scale-[0.98] hover:shadow-organic-lg')
                    }
                    aria-label={mock ? service.name : `Agendar ${service.name}`}
                  >
                    <div className="absolute top-0 left-0 right-0 h-[3px] overflow-hidden" aria-hidden="true">
                      <svg width="100%" height="3" viewBox="0 0 400 3" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 1.5 Q100 0, 200 2 Q300 3, 400 1" stroke="#777F5C" strokeWidth="3" fill="none" strokeLinecap="round" />
                      </svg>
                    </div>

                    <div className="flex items-start justify-between gap-3 mb-4">
                      <h3 className="font-serif font-normal text-xl md:text-[22px] text-helora-dark-green tracking-tight">
                        {service.name}
                      </h3>
                      <Leaf
                        size={18}
                        className={
                          'mt-1 shrink-0 transition-colors duration-300'
                          + (mock
                            ? ' text-helora-sage/30'
                            : ' text-helora-light-gray group-hover:text-helora-sage')
                        }
                        aria-hidden="true"
                      />
                    </div>
                    <p className="font-sans text-[15px] text-helora-tan leading-relaxed mb-5">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-helora-sienna shrink-0" aria-hidden="true" />
                      <span className="font-sans font-semibold text-lg text-helora-sienna">
                        {formatPrice(service.price)}
                      </span>
                    </div>
                  </button>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
