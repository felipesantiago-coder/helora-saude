'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
} from 'lucide-react';
import { useBookingStore, useAppStore } from '@/stores/helora-store';

// ─── Date utilities ────────────────────────────────────────────────

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

const DIAS_SEMANA = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

const DIAS_CURTOS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function formatarDataCompleta(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const dia = d.getDate();
  const mes = MESES[d.getMonth()];
  const ano = d.getFullYear();
  const diaSemana = DIAS_SEMANA[d.getDay()];
  return `${diaSemana}, ${dia} de ${mes} de ${ano}`;
}

function formatarPreco(price: number): string {
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function calcularIdade(birthDateStr: string): number {
  const hoje = new Date();
  const nascimento = new Date(birthDateStr + 'T12:00:00');
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const diffMes = hoje.getMonth() - nascimento.getMonth();
  if (diffMes < 0 || (diffMes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

function formatarDataParaInput(dateStr: string): string {
  if (!dateStr) return '';
  return dateStr;
}

// ─── Types ─────────────────────────────────────────────────────────

interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  duration: number;
}

interface Professional {
  id: string;
  name: string;
  specialty: string | null;
  bio: string | null;
}

interface WeeklyAvailability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

// ─── Spinner ───────────────────────────────────────────────────────

function OrganicSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <span
        className="organic-o organic-o-large animate-spin"
        style={{ animationDuration: '2s' }}
      >
        O
      </span>
    </div>
  );
}

// ─── Step Progress Indicator ───────────────────────────────────────

const STEPS = ['Serviço', 'Seus dados', 'Data e hora', 'Confirmação'];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-8 md:mb-10">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {STEPS.map((label, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;
          const isFuture = stepNum > currentStep;

          return (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                    isCompleted
                      ? 'bg-helora-sage text-white'
                      : isActive
                        ? 'bg-helora-sage text-white'
                        : 'bg-helora-gainsboro text-helora-tan'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
                </div>
                <span
                  className={`text-xs hidden md:block transition-colors duration-200 ${
                    isActive
                      ? 'text-helora-dark-coffee font-medium'
                      : isCompleted
                        ? 'text-helora-sage'
                        : 'text-helora-tan'
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 md:mx-3 rounded-full transition-colors duration-200 ${
                    stepNum < currentStep
                      ? 'bg-helora-sage'
                      : 'bg-helora-gainsboro'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 1: Service Selection ─────────────────────────────────────

function StepService() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { serviceId, setService, setStep } = useBookingStore();

  useEffect(() => {
    let cancelled = false;
    async function fetchServices() {
      try {
        const res = await fetch('/api/services');
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!cancelled) setServices(data);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchServices();
    return () => { cancelled = true; };
  }, []);

  const handleSelect = (service: Service) => {
    setService(service.id, service.name, service.price);
  };

  if (loading) return <OrganicSpinner />;

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-helora-sienna mb-4">
          Algo deu errado. Vamos tentar juntos novamente?
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn-pill bg-helora-sage text-white px-6 py-2.5 text-sm font-medium hover:bg-helora-dark-green transition-colors duration-200"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="font-serif text-2xl text-helora-dark-coffee mb-2" style={{ letterSpacing: '-0.02em' }}>
          Como podemos te acompanhar?
        </h2>
        <p className="text-helora-tan text-sm leading-relaxed">
          Selecione o tipo de sessão que faz sentido para você agora.
        </p>
      </div>

      <div className="grid gap-3 mb-6">
        {services.map((service) => {
          const isSelected = serviceId === service.id;
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => handleSelect(service)}
              className={`helora-card p-4 text-left cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-helora-sage ring-2 ring-helora-sage/30 hover:transform-none'
                  : 'hover:border-helora-light-gray'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-helora-dark-coffee mb-1" style={{ letterSpacing: '-0.02em' }}>
                    {service.name}
                  </h3>
                  <p className="text-sm text-helora-tan leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <span className="text-helora-sienna font-semibold text-sm whitespace-nowrap">
                  {formatarPreco(service.price)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          type="button"
          disabled={!serviceId}
          onClick={() => setStep(2)}
          className="btn-pill bg-helora-sage text-white px-8 py-3 text-sm font-medium hover:bg-helora-dark-green transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-helora-sage flex items-center gap-2"
        >
          Avançar
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => useAppStore.getState().setView('public')}
          className="text-helora-tan text-sm hover:text-helora-dark-coffee transition-colors duration-200"
        >
          Voltar ao início
        </button>
      </div>
    </div>
  );
}

// ─── Step 2: Patient Data ──────────────────────────────────────────

function StepData() {
  const {
    serviceId,
    patientName,
    patientEmail,
    patientPhone,
    patientCpf,
    patientBirthDate,
    professionalId,
    setPatientData,
    setProfessional,
    setStep,
  } = useBookingStore();

  const [formName, setFormName] = useState(patientName);
  const [formEmail, setFormEmail] = useState(patientEmail);
  const [formPhone, setFormPhone] = useState(patientPhone);
  const [formCpf, setFormCpf] = useState(patientCpf);
  const [formBirthDate, setFormBirthDate] = useState(patientBirthDate);

  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [noProfessionals, setNoProfessionals] = useState(false);
  const [loadingProfs, setLoadingProfs] = useState(false);
  const [selectedProfId, setSelectedProfId] = useState(professionalId || '');
  const [ageCalculated, setAgeCalculated] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

  // Sync store values if returning to this step
  useEffect(() => {
    setFormName(patientName);
    setFormEmail(patientEmail);
    setFormPhone(patientPhone);
    setFormCpf(patientCpf);
    setFormBirthDate(patientBirthDate);
    setSelectedProfId(professionalId || '');
  }, [patientName, patientEmail, patientPhone, patientCpf, patientBirthDate, professionalId]);

  const fetchProfessionals = useCallback(async (birthDate: string) => {
    if (!serviceId || !birthDate) return;
    setLoadingProfs(true);
    setNoProfessionals(false);
    try {
      const res = await fetch(
        `/api/professionals?serviceId=${serviceId}&birthDate=${birthDate}`
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.length === 0) {
        setNoProfessionals(true);
        setProfessionals([]);
        setSelectedProfId('');
      } else {
        setProfessionals(data);
        // Pre-select if we already had a selection
        if (professionalId && data.find((p: Professional) => p.id === professionalId)) {
          setSelectedProfId(professionalId);
        } else {
          setSelectedProfId('');
        }
      }
    } catch {
      setNoProfessionals(true);
      setProfessionals([]);
    } finally {
      setLoadingProfs(false);
    }
  }, [serviceId, professionalId]);

  const handleBirthDateBlur = () => {
    if (formBirthDate && !ageCalculated) {
      setAgeCalculated(true);
      fetchProfessionals(formBirthDate);
    }
  };

  const handleBirthDateChange = (value: string) => {
    setFormBirthDate(value);
    setAgeCalculated(false);
  };

  const handleAdvance = () => {
    const errors: Record<string, boolean> = {};
    if (!formName.trim()) errors.name = true;
    if (!formEmail.trim()) errors.email = true;
    if (!formBirthDate) errors.birthDate = true;

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    // If birthDate changed, we should have professionals loaded
    if (formBirthDate && !ageCalculated) {
      // Force fetch on advance if somehow missed
      fetchProfessionals(formBirthDate).then(() => {
        // Will need user to select and click again
      });
      return;
    }

    if (professionals.length > 0 && !selectedProfId) return;

    const selectedProf = professionals.find((p) => p.id === selectedProfId);
    setPatientData({
      patientName: formName.trim(),
      patientEmail: formEmail.trim(),
      patientPhone: formPhone.trim(),
      patientCpf: formCpf.trim(),
      patientBirthDate: formBirthDate,
    });

    if (selectedProf) {
      setProfessional(selectedProf.id, selectedProf.name);
    }

    setStep(3);
  };

  const canAdvance = useMemo(() => {
    if (!formName.trim() || !formEmail.trim() || !formBirthDate) return false;
    if (ageCalculated && professionals.length > 0 && !selectedProfId) return false;
    if (ageCalculated && noProfessionals) return false;
    return true;
  }, [formName, formEmail, formBirthDate, ageCalculated, professionals.length, selectedProfId, noProfessionals]);

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="font-serif text-2xl text-helora-dark-coffee mb-2" style={{ letterSpacing: '-0.02em' }}>
          Conte um pouco sobre você
        </h2>
        <p className="text-helora-tan text-sm leading-relaxed">
          Essas informações nos ajudam a encontrar o profissional ideal para você.
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {/* Nome completo */}
        <div>
          <label className="helora-label" htmlFor="booking-name">
            Nome completo
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-helora-tan" />
            <input
              id="booking-name"
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="helora-input pl-10"
              placeholder="Seu nome"
              autoComplete="name"
            />
          </div>
          {formErrors.name && (
            <p className="text-helora-sienna text-xs mt-1">Por favor, informe seu nome.</p>
          )}
        </div>

        {/* E-mail */}
        <div>
          <label className="helora-label" htmlFor="booking-email">
            E-mail
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-helora-tan" />
            <input
              id="booking-email"
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              className="helora-input pl-10"
              placeholder="seuemail@exemplo.com"
              autoComplete="email"
            />
          </div>
          {formErrors.email && (
            <p className="text-helora-sienna text-xs mt-1">Por favor, informe seu e-mail.</p>
          )}
        </div>

        {/* Telefone */}
        <div>
          <label className="helora-label" htmlFor="booking-phone">
            Telefone
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-helora-tan" />
            <input
              id="booking-phone"
              type="tel"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              className="helora-input pl-10"
              placeholder="(00) 00000-0000"
              autoComplete="tel"
            />
          </div>
        </div>

        {/* CPF */}
        <div>
          <label className="helora-label" htmlFor="booking-cpf">
            CPF
          </label>
          <input
            id="booking-cpf"
            type="text"
            value={formCpf}
            onChange={(e) => setFormCpf(e.target.value)}
            className="helora-input"
            placeholder="000.000.000-00"
            inputMode="numeric"
          />
        </div>

        {/* Data de nascimento */}
        <div>
          <label className="helora-label" htmlFor="booking-birth">
            Data de nascimento
          </label>
          <input
            id="booking-birth"
            type="date"
            value={formatarDataParaInput(formBirthDate)}
            onChange={(e) => handleBirthDateChange(e.target.value)}
            onBlur={handleBirthDateBlur}
            className="helora-input"
            max={new Date().toISOString().split('T')[0]}
          />
          {formErrors.birthDate && (
            <p className="text-helora-sienna text-xs mt-1">Por favor, informe sua data de nascimento.</p>
          )}
        </div>

        {/* Profissional dropdown (shown after birth date) */}
        {ageCalculated && loadingProfs && <OrganicSpinner />}

        {ageCalculated && !loadingProfs && noProfessionals && (
          <div className="helora-card p-4 text-center">
            <p className="text-helora-tan text-sm leading-relaxed">
              Ainda não temos profissionais disponíveis para esta faixa etária. Entre em contato conosco.
            </p>
          </div>
        )}

        {ageCalculated && !loadingProfs && professionals.length > 0 && (
          <div>
            <label className="helora-label" htmlFor="booking-professional">
              Profissional
            </label>
            <select
              id="booking-professional"
              value={selectedProfId}
              onChange={(e) => setSelectedProfId(e.target.value)}
              className="helora-input appearance-none bg-no-repeat bg-[center_right_12px]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23A39B82' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              }}
            >
              <option value="">Selecione um profissional</option>
              {professionals.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}{p.specialty ? ` · ${p.specialty}` : ''}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="text-helora-tan text-sm hover:text-helora-dark-coffee transition-colors duration-200 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
        <button
          type="button"
          disabled={!canAdvance}
          onClick={handleAdvance}
          className="btn-pill bg-helora-sage text-white px-8 py-3 text-sm font-medium hover:bg-helora-dark-green transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-helora-sage flex items-center gap-2"
        >
          Avançar
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Calendar & Time Selection ─────────────────────────────

function StepDateTime() {
  const {
    professionalId,
    appointmentDate,
    appointmentTime,
    setDateTime,
    setStep,
  } = useBookingStore();

  const today = useMemo(() => new Date(), []);
  today.setHours(0, 0, 0, 0);

  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    return { month: d.getMonth(), year: d.getFullYear() };
  });
  const [availableDays, setAvailableDays] = useState<Set<number>>(new Set());
  const [loadingAvailability, setLoadingAvailability] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(appointmentDate || null);
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(appointmentTime || null);
  const [slotsMessage, setSlotsMessage] = useState<string | null>(null);

  // Fetch professional availability (weekly schedule)
  useEffect(() => {
    if (!professionalId) return;
    let cancelled = false;
    async function fetchAvailability() {
      setLoadingAvailability(true);
      try {
        const res = await fetch(`/api/availability?professionalId=${professionalId}`);
        if (!res.ok) throw new Error();
        const data: WeeklyAvailability[] = await res.json();
        if (!cancelled) {
          const days = new Set(data.map((a) => a.dayOfWeek));
          setAvailableDays(days);
        }
      } catch {
        if (!cancelled) setAvailableDays(new Set());
      } finally {
        if (!cancelled) setLoadingAvailability(false);
      }
    }
    fetchAvailability();
    return () => { cancelled = true; };
  }, [professionalId]);

  // Generate calendar days for current view
  const calendarDays = useMemo(() => {
    const { month, year } = viewMonth;
    const firstDay = new Date(year, month, 1);
    // getDay(): 0=Sun, 1=Mon, ... 6=Sat
    // We want Mon=0, Tue=1, ..., Sat=5 (no Sunday)
    let startDow = firstDay.getDay(); // 0-6
    // Convert: Mon(1)->0, Tue(2)->1, Wed(3)->2, Thu(4)->3, Fri(5)->4, Sat(6)->5, Sun(0)->-1
    let startOffset: number;
    if (startDow === 0) {
      startOffset = -1; // Month starts on Sunday — we skip it
    } else {
      startOffset = startDow - 1; // Mon=0, Tue=1, ..., Sat=5
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];

    // Fill leading empty cells
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }

    // Fill actual days
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }

    return days;
  }, [viewMonth]);

  const monthLabel = `${MESES[viewMonth.month]} ${viewMonth.year}`;

  const goToPrevMonth = () => {
    setViewMonth((prev) => {
      const m = prev.month === 0 ? 11 : prev.month - 1;
      const y = prev.month === 0 ? prev.year - 1 : prev.year;
      return { month: m, year: y };
    });
    setSelectedDate(null);
    setSlots([]);
    setSelectedTime(null);
    setSlotsMessage(null);
  };

  const goToNextMonth = () => {
    setViewMonth((prev) => {
      const m = prev.month === 11 ? 0 : prev.month + 1;
      const y = prev.month === 11 ? prev.year + 1 : prev.year;
      return { month: m, year: y };
    });
    setSelectedDate(null);
    setSlots([]);
    setSelectedTime(null);
    setSlotsMessage(null);
  };

  const isDatePast = (day: number): boolean => {
    const d = new Date(viewMonth.year, viewMonth.month, day);
    return d < today;
  };

  const isSunday = (day: number): boolean => {
    const d = new Date(viewMonth.year, viewMonth.month, day);
    return d.getDay() === 0;
  };

  const isDayAvailable = (day: number): boolean => {
    if (isDatePast(day) || isSunday(day)) return false;
    const d = new Date(viewMonth.year, viewMonth.month, day);
    return availableDays.has(d.getDay());
  };

  const isToday = (day: number): boolean => {
    const d = new Date(viewMonth.year, viewMonth.month, day);
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const isSelectedDay = (day: number): boolean => {
    if (!selectedDate) return false;
    const d = new Date(viewMonth.year, viewMonth.month, day);
    const sel = new Date(selectedDate + 'T12:00:00');
    return (
      d.getDate() === sel.getDate() &&
      d.getMonth() === sel.getMonth() &&
      d.getFullYear() === sel.getFullYear()
    );
  };

  const handleDayClick = async (day: number) => {
    if (!isDayAvailable(day)) return;
    const dateStr = `${viewMonth.year}-${String(viewMonth.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setSelectedTime(null);
    setSlotsMessage(null);
    setLoadingSlots(true);

    try {
      const res = await fetch(
        `/api/slots?professionalId=${professionalId}&date=${dateStr}`
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.message) {
        setSlotsMessage(data.message);
        setSlots([]);
      } else {
        setSlots(data.slots || []);
        setSlotsMessage(data.slots?.length === 0 ? 'Nenhum horário disponível neste dia.' : null);
      }
    } catch {
      setSlotsMessage('Algo deu errado. Vamos tentar juntos novamente?');
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      setDateTime(selectedDate, time);
    }
  };

  const canAdvance = selectedDate && selectedTime;

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="font-serif text-2xl text-helora-dark-coffee mb-2" style={{ letterSpacing: '-0.02em' }}>
          Escolha o melhor momento
        </h2>
        <p className="text-helora-tan text-sm leading-relaxed">
          Selecione o dia e horário que melhor combinam com você.
        </p>
      </div>

      {loadingAvailability ? (
        <OrganicSpinner />
      ) : (
        <>
          {/* Calendar */}
          <div className="helora-card p-4 md:p-6 mb-6">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={goToPrevMonth}
                className="p-1.5 rounded-full hover:bg-helora-gainsboro transition-colors duration-200 text-helora-dark-coffee"
                aria-label="Mês anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="font-serif text-lg text-helora-dark-coffee" style={{ letterSpacing: '-0.02em' }}>
                {monthLabel}
              </h3>
              <button
                type="button"
                onClick={goToNextMonth}
                className="p-1.5 rounded-full hover:bg-helora-gainsboro transition-colors duration-200 text-helora-dark-coffee"
                aria-label="Próximo mês"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-6 gap-1 mb-2">
              {DIAS_CURTOS.map((dia) => (
                <div
                  key={dia}
                  className="text-center text-xs font-medium text-helora-tan py-1"
                >
                  {dia}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-6 gap-1">
              {calendarDays.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="h-9 md:h-10" />;
                }

                const past = isDatePast(day);
                const sunday = isSunday(day);
                const available = isDayAvailable(day);
                const todayClass = isToday(day);
                const selected = isSelectedDay(day);

                let dayClasses = 'h-9 md:h-10 rounded-lg flex items-center justify-center text-sm transition-all duration-200 ';

                if (sunday) {
                  dayClasses += 'text-helora-light-gray line-through cursor-default ';
                } else if (past) {
                  dayClasses += 'text-helora-light-gray cursor-default ';
                } else if (selected) {
                  dayClasses += 'bg-helora-sage text-white font-medium cursor-pointer ';
                } else if (available) {
                  dayClasses += 'text-helora-dark-coffee hover:bg-helora-sage/10 cursor-pointer ';
                  if (todayClass) {
                    dayClasses += 'border-2 border-helora-tan ';
                  }
                } else {
                  dayClasses += 'text-helora-light-gray cursor-default ';
                  if (todayClass) {
                    dayClasses += 'border-2 border-helora-tan ';
                  }
                }

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={!available && !selected}
                    onClick={() => handleDayClick(day)}
                    className={dayClasses}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slots */}
          {selectedDate && loadingSlots && <OrganicSpinner />}

          {selectedDate && !loadingSlots && slotsMessage && (
            <div className="helora-card p-4 text-center mb-6">
              <p className="text-helora-tan text-sm leading-relaxed">
                {slotsMessage}
              </p>
            </div>
          )}

          {selectedDate && !loadingSlots && slots.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-helora-sage" />
                <p className="text-sm font-medium text-helora-dark-coffee">
                  Horários disponíveis
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => handleTimeSelect(slot)}
                    className={`helora-card p-3 text-center cursor-pointer transition-all duration-200 text-sm ${
                      selectedTime === slot
                        ? 'bg-helora-sage text-white hover:transform-none'
                        : 'text-helora-dark-coffee hover:border-helora-sage'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="text-helora-tan text-sm hover:text-helora-dark-coffee transition-colors duration-200 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
        <button
          type="button"
          disabled={!canAdvance}
          onClick={() => {
            if (selectedDate && selectedTime) {
              setDateTime(selectedDate, selectedTime);
              setStep(4);
            }
          }}
          className="btn-pill bg-helora-sage text-white px-8 py-3 text-sm font-medium hover:bg-helora-dark-green transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-helora-sage flex items-center gap-2"
        >
          Avançar
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Step 4: Confirmation ──────────────────────────────────────────

function StepConfirm() {
  const {
    serviceName,
    servicePrice,
    professionalName,
    appointmentDate,
    appointmentTime,
    patientName,
    patientEmail,
    patientPhone,
    serviceId,
    professionalId,
    patientCpf,
    patientBirthDate,
    reset,
    setStep,
  } = useBookingStore();

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleConfirm = async () => {
    setSubmitting(true);
    setError(false);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          serviceName,
          price: servicePrice,
          patientName,
          patientEmail,
          patientPhone,
          patientCpf,
          patientBirthDate,
          professionalId,
          professionalName,
          appointmentDate,
          appointmentTime,
        }),
      });

      if (!res.ok) throw new Error();

      setSuccess(true);
      setTimeout(() => {
        reset();
        useAppStore.getState().setView('public');
      }, 2500);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="organic-o organic-o-large mx-auto mb-4 bg-helora-sage text-white border-helora-sage">
          <Check className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl text-helora-dark-coffee mb-2" style={{ letterSpacing: '-0.02em' }}>
          Sua sessão foi agendada!
        </h2>
        <p className="text-helora-tan text-sm leading-relaxed">
          Você receberá um e-mail de confirmação.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="font-serif text-2xl text-helora-dark-coffee mb-2" style={{ letterSpacing: '-0.02em' }}>
          Vamos conferir juntos
        </h2>
        <p className="text-helora-tan text-sm leading-relaxed">
          Confira se tudo está como você gostaria.
        </p>
      </div>

      {/* Summary card */}
      <div className="helora-card p-6 mb-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="helora-label text-helora-tan">Serviço</p>
              <p className="text-helora-dark-coffee font-medium">{serviceName}</p>
            </div>
            <p className="text-helora-sienna font-semibold text-xl">
              {formatarPreco(servicePrice)}
            </p>
          </div>

          <div className="border-t border-helora-gainsboro" />

          <div>
            <p className="helora-label text-helora-tan">Profissional</p>
            <p className="text-helora-dark-coffee font-medium">{professionalName}</p>
          </div>

          <div>
            <p className="helora-label text-helora-tan">Data</p>
            <p className="text-helora-dark-coffee font-medium">{formatarDataCompleta(appointmentDate)}</p>
          </div>

          <div>
            <p className="helora-label text-helora-tan">Horário</p>
            <p className="text-helora-dark-coffee font-medium">{appointmentTime}</p>
          </div>

          <div className="border-t border-helora-gainsboro" />

          <div>
            <p className="helora-label text-helora-tan">Nome</p>
            <p className="text-helora-dark-coffee font-medium">{patientName}</p>
          </div>

          <div>
            <p className="helora-label text-helora-tan">E-mail</p>
            <p className="text-helora-dark-coffee font-medium">{patientEmail}</p>
          </div>

          <div>
            <p className="helora-label text-helora-tan">Telefone</p>
            <p className="text-helora-dark-coffee font-medium">{patientPhone || 'Não informado'}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="helora-card p-4 mb-6 border-helora-sienna/30">
          <p className="text-helora-sienna text-sm text-center leading-relaxed">
            Algo deu errado ao criar seu agendamento. Vamos tentar juntos novamente?
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setStep(3)}
          className="text-helora-tan text-sm hover:text-helora-dark-coffee transition-colors duration-200 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={handleConfirm}
          className="btn-pill bg-helora-sage text-white px-8 py-3 text-sm font-medium hover:bg-helora-dark-green transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-helora-sage flex items-center gap-2"
        >
          {submitting ? (
            <>
              <span
                className="organic-o w-5 h-5 text-sm animate-spin"
                style={{ animationDuration: '2s' }}
              >
                O
              </span>
              Agendando...
            </>
          ) : (
            'Confirmar agendamento'
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Main BookingWizard ────────────────────────────────────────────

export default function BookingWizard() {
  const step = useBookingStore((s) => s.step);
  const setView = useAppStore((s) => s.setView);

  return (
    <div className="min-h-screen flex flex-col bg-helora-antique-white">
      {/* Sticky top bar */}
      <header className="sticky top-0 z-50 bg-helora-white shadow-warm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => setView('public')}
            className="focus:outline-none"
            aria-label="Voltar ao início"
          >
            <img
              src="/logo-mark.svg"
              alt="Helora"
              className="h-7 w-auto brightness-0"
            />
          </button>
          <button
            onClick={() => setView('public')}
            className="font-sans text-sm font-medium text-helora-tan hover:text-helora-dark-coffee transition-colors duration-200 flex items-center gap-1.5 focus:outline-none focus-visible:underline"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Voltar ao início
          </button>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
          <StepIndicator currentStep={step} />

        <div
          className="transition-opacity duration-200"
          key={step}
        >
          {step === 1 && <StepService />}
          {step === 2 && <StepData />}
          {step === 3 && <StepDateTime />}
          {step === 4 && <StepConfirm />}
        </div>
        </div>
      </main>
    </div>
  );
}