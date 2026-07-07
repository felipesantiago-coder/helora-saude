'use client';

import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useBookingStore, useAppStore } from '@/stores/helora-store';
import { ScrollReveal } from './ScrollReveal';

interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  duration: number;
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
  const [error, setError] = useState(false);

  const setService = useBookingStore((s) => s.setService);
  const setView = useAppStore((s) => s.setView);

  useEffect(() => {
    let cancelled = false;

    async function fetchServices() {
      try {
        const res = await fetch('/api/services');
        if (!res.ok) throw new Error();
        const data: Service[] = await res.json();
        if (!cancelled) {
          setServices(data);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    fetchServices();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleServiceClick(service: Service) {
    setService(service.id, service.name, service.price);
    setView('booking');
  }

  return (
    <section id="servicos" className="bg-helora-antique-white py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-4">
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

        {/* Service cards */}
        {!loading && !error && services.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ScrollReveal key={service.id} delay={index * 0.1}>
                <button
                  onClick={() => handleServiceClick(service)}
                  className="helora-card text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-helora-sage/50 cursor-pointer group border-t-[3px] border-t-helora-sage w-full active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <h3 className="font-serif font-normal text-xl md:text-[22px] text-helora-dark-green tracking-tight">
                      {service.name}
                    </h3>
                    <Calendar
                      size={18}
                      className="text-helora-light-gray mt-1 shrink-0 group-hover:text-helora-sage transition-colors duration-200"
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
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && services.length === 0 && (
          <div className="text-center py-16">
            <p className="font-sans text-helora-tan text-lg">
              Nenhum serviço disponível no momento. Estamos preparando tudo com carinho para você.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}