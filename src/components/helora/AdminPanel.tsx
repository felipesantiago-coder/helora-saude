'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore, useAppStore } from '@/stores/helora-store';
import {
  LogOut,
  Users,
  Calendar,
  Check,
  X,
  Clock,
  User,
  Mail,
} from 'lucide-react';
import OrganicSpinner from './OrganicSpinner';

interface Appointment {
  id: string;
  serviceName: string;
  patientName: string;
  patientEmail: string;
  professionalName: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
}

interface Professional {
  id: string;
  name: string;
  email: string;
  specialty: string | null;
  status: string;
  role: string;
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, string> = {
    pending: 'bg-helora-sienna/10 text-helora-sienna',
    confirmed: 'bg-helora-sage/10 text-helora-sage',
    approved: 'bg-helora-sage/10 text-helora-sage',
    cancelled: 'bg-helora-tan/10 text-helora-tan',
    rejected: 'bg-helora-tan/10 text-helora-tan',
  };

  const labels: Record<string, string> = {
    pending: 'Pendente',
    confirmed: 'Confirmado',
    approved: 'Aprovado',
    cancelled: 'Cancelado',
    rejected: 'Rejeitado',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config[status] || 'bg-helora-gainsboro text-helora-tan'}`}
    >
      {labels[status] || status}
    </span>
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

function getMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export default function AdminPanel() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const setView = useAppStore((s) => s.setView);

  const isAdmin = user?.role === 'admin';
  const [activeTab, setActiveTab] = useState<'appointments' | 'professionals'>('appointments');

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [loadingProfessionals, setLoadingProfessionals] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoadingAppointments(true);
    try {
      const res = await fetch('/api/appointments');
      if (res.ok) {
        const data: Appointment[] = await res.json();
        if (isAdmin) {
          setAppointments(data);
        } else {
          setAppointments(data.filter((a) => a.professionalName === user?.name));
        }
      }
    } catch {
      // silent
    } finally {
      setLoadingAppointments(false);
    }
  }, [isAdmin, user?.name]);

  const fetchProfessionals = useCallback(async () => {
    setLoadingProfessionals(true);
    try {
      const res = await fetch('/api/professionals?all=true');
      if (res.ok) {
        const data: Professional[] = await res.json();
        setProfessionals(data);
      }
    } catch {
      // silent
    } finally {
      setLoadingProfessionals(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    if (isAdmin) {
      fetchProfessionals();
    }
  }, [isAdmin, fetchProfessionals]);

  async function updateAppointmentStatus(id: string, status: string) {
    setUpdatingId(id);
    try {
      await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      await fetchAppointments();
    } catch {
      // silent
    } finally {
      setUpdatingId(null);
    }
  }

  async function updateProfessionalStatus(id: string, status: string) {
    setUpdatingId(id);
    try {
      await fetch('/api/professionals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      await fetchProfessionals();
    } catch {
      // silent
    } finally {
      setUpdatingId(null);
    }
  }

  function handleLogout() {
    logout();
    setView('public');
  }

  // Stats
  const monthKey = getMonthKey();
  const pendingCount = appointments.filter((a) => a.status === 'pending').length;
  const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;
  const monthlyCount = appointments.filter((a) => a.appointmentDate?.startsWith(monthKey)).length;

  return (
    <div className="min-h-screen bg-helora-antique-white">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-helora-white border-b border-helora-light-gray shadow-warm px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <img
            src="/logo-mark.svg"
            alt="Helora"
            className="h-6 w-auto brightness-0"
          />
          <div className="flex items-center gap-4">
            <span className="text-helora-tan font-sans text-sm hidden sm:inline">
              {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-helora-tan hover:text-helora-sienna font-sans text-sm transition-colors duration-200 cursor-pointer"
              aria-label="Sair"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tab navigation */}
      <nav className="bg-helora-white border-b border-helora-light-gray">
        <div className="max-w-6xl mx-auto px-4 flex gap-6">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`py-3 font-sans text-sm font-medium transition-colors duration-200 cursor-pointer border-b-2 ${
              activeTab === 'appointments'
                ? 'border-helora-sage text-helora-sage'
                : 'border-transparent text-helora-tan hover:text-helora-dark-coffee'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Agendamentos
            </span>
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('professionals')}
              className={`py-3 font-sans text-sm font-medium transition-colors duration-200 cursor-pointer border-b-2 ${
                activeTab === 'professionals'
                  ? 'border-helora-sage text-helora-sage'
                  : 'border-transparent text-helora-tan hover:text-helora-dark-coffee'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                Profissionais
              </span>
            </button>
          )}
        </div>
      </nav>

      {/* Content area */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'appointments' && (
          <section aria-label="Agendamentos">
            <h2 className="font-serif text-2xl text-helora-dark-coffee tracking-[-0.02em]">
              Sessões agendadas
            </h2>

            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="helora-card p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-helora-sienna/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-helora-sienna" />
                  </div>
                  <div>
                    <p className="text-helora-tan text-xs font-sans">Pendentes</p>
                    <p className="text-helora-dark-coffee text-xl font-serif">{pendingCount}</p>
                  </div>
                </div>
              </div>
              <div className="helora-card p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-helora-sage/10 flex items-center justify-center">
                    <Check className="w-5 h-5 text-helora-sage" />
                  </div>
                  <div>
                    <p className="text-helora-tan text-xs font-sans">Confirmados</p>
                    <p className="text-helora-dark-coffee text-xl font-serif">{confirmedCount}</p>
                  </div>
                </div>
              </div>
              <div className="helora-card p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-helora-gainsboro flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-helora-tan" />
                  </div>
                  <div>
                    <p className="text-helora-tan text-xs font-sans">Total este mês</p>
                    <p className="text-helora-dark-coffee text-xl font-serif">{monthlyCount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointments table */}
            <div className="mt-6">
              {loadingAppointments ? (
                <div className="flex justify-center py-12">
                  <OrganicSpinner />
                </div>
              ) : appointments.length === 0 ? (
                <div className="helora-card p-12 flex flex-col items-center justify-center text-center">
                  <div className="organic-o organic-o-large mb-4">O</div>
                  <p className="text-helora-tan font-sans text-sm">
                    Nenhuma sessão agendada ainda.
                  </p>
                </div>
              ) : (
                <div className="helora-card overflow-hidden p-0">
                  <div className="overflow-x-auto max-h-[500px] overflow-y-auto -mx-0">
                    <table className="w-full text-left font-sans text-sm min-w-[500px]">
                      <thead className="sticky top-0 bg-helora-gainsboro z-10">
                        <tr>
                          <th className="px-4 py-3 text-helora-dark-coffee font-medium text-xs uppercase tracking-wider">
                            Data
                          </th>
                          <th className="px-4 py-3 text-helora-dark-coffee font-medium text-xs uppercase tracking-wider">
                            Horário
                          </th>
                          <th className="px-4 py-3 text-helora-dark-coffee font-medium text-xs uppercase tracking-wider">
                            Paciente
                          </th>
                          <th className="px-4 py-3 text-helora-dark-coffee font-medium text-xs uppercase tracking-wider hidden md:table-cell">
                            Profissional
                          </th>
                          <th className="px-4 py-3 text-helora-dark-coffee font-medium text-xs uppercase tracking-wider hidden lg:table-cell">
                            Serviço
                          </th>
                          <th className="px-4 py-3 text-helora-dark-coffee font-medium text-xs uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-helora-dark-coffee font-medium text-xs uppercase tracking-wider">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-helora-light-gray">
                        {appointments.map((appt) => (
                          <tr key={appt.id} className="hover:bg-helora-gainsboro/40 transition-colors duration-150">
                            <td className="px-4 py-3 text-helora-dark-coffee whitespace-nowrap">
                              {formatDate(appt.appointmentDate)}
                            </td>
                            <td className="px-4 py-3 text-helora-dark-coffee whitespace-nowrap">
                              {appt.appointmentTime}
                            </td>
                            <td className="px-4 py-3 text-helora-dark-coffee whitespace-nowrap">
                              {appt.patientName}
                            </td>
                            <td className="px-4 py-3 text-helora-dark-coffee whitespace-nowrap hidden md:table-cell">
                              {appt.professionalName}
                            </td>
                            <td className="px-4 py-3 text-helora-dark-coffee whitespace-nowrap hidden lg:table-cell">
                              {appt.serviceName}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <StatusBadge status={appt.status} />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                {appt.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => updateAppointmentStatus(appt.id, 'confirmed')}
                                      disabled={updatingId === appt.id}
                                      className="text-helora-sage hover:text-helora-dark-green font-sans text-sm transition-colors duration-200 cursor-pointer disabled:opacity-50 flex items-center gap-1"
                                      title="Confirmar"
                                    >
                                      <Check className="w-4 h-4" />
                                      <span className="hidden sm:inline">Confirmar</span>
                                    </button>
                                    <button
                                      onClick={() => updateAppointmentStatus(appt.id, 'cancelled')}
                                      disabled={updatingId === appt.id}
                                      className="text-helora-tan hover:text-helora-sienna font-sans text-sm transition-colors duration-200 cursor-pointer disabled:opacity-50 flex items-center gap-1"
                                      title="Cancelar"
                                    >
                                      <X className="w-4 h-4" />
                                      <span className="hidden sm:inline">Cancelar</span>
                                    </button>
                                  </>
                                )}
                                {appt.status === 'confirmed' && (
                                  <button
                                    onClick={() => updateAppointmentStatus(appt.id, 'cancelled')}
                                    disabled={updatingId === appt.id}
                                    className="text-helora-tan hover:text-helora-sienna font-sans text-sm transition-colors duration-200 cursor-pointer disabled:opacity-50 flex items-center gap-1"
                                    title="Cancelar"
                                  >
                                    <X className="w-4 h-4" />
                                    <span className="hidden sm:inline">Cancelar</span>
                                  </button>
                                )}
                                {(appt.status === 'cancelled') && (
                                  <span className="text-helora-tan font-sans text-xs">N/A</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'professionals' && isAdmin && (
          <section aria-label="Profissionais">
            <h2 className="font-serif text-2xl text-helora-dark-coffee tracking-[-0.02em]">
              Profissionais
            </h2>

            <div className="mt-6">
              {loadingProfessionals ? (
                <div className="flex justify-center py-12">
                  <OrganicSpinner />
                </div>
              ) : professionals.length === 0 ? (
                <div className="helora-card p-12 flex flex-col items-center justify-center text-center">
                  <div className="organic-o organic-o-large mb-4">O</div>
                  <p className="text-helora-tan font-sans text-sm">
                    Nenhum profissional cadastrado ainda.
                  </p>
                </div>
              ) : (
                <div className="helora-card overflow-hidden p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans text-sm min-w-[440px]">
                      <thead className="sticky top-0 bg-helora-gainsboro">
                        <tr>
                          <th className="px-4 py-3 text-helora-dark-coffee font-medium text-xs uppercase tracking-wider">
                            Nome
                          </th>
                          <th className="px-4 py-3 text-helora-dark-coffee font-medium text-xs uppercase tracking-wider hidden sm:table-cell">
                            Especialidade
                          </th>
                          <th className="px-4 py-3 text-helora-dark-coffee font-medium text-xs uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-helora-dark-coffee font-medium text-xs uppercase tracking-wider">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-helora-light-gray">
                        {professionals.map((prof) => (
                          <tr key={prof.id} className="hover:bg-helora-gainsboro/40 transition-colors duration-150">
                            <td className="px-4 py-3">
                              <div className="flex flex-col">
                                <span className="text-helora-dark-coffee font-medium">
                                  {prof.name}
                                </span>
                                <span className="text-helora-tan text-xs flex items-center gap-1 sm:hidden">
                                  {prof.specialty || 'N/A'}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-helora-dark-coffee whitespace-nowrap hidden sm:table-cell">
                              {prof.specialty || 'N/A'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <StatusBadge status={prof.status} />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {prof.status === 'pending' ? (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => updateProfessionalStatus(prof.id, 'approved')}
                                    disabled={updatingId === prof.id}
                                    className="text-helora-sage hover:text-helora-dark-green font-sans text-sm transition-colors duration-200 cursor-pointer disabled:opacity-50 flex items-center gap-1"
                                    title="Aprovar"
                                  >
                                    <Check className="w-4 h-4" />
                                    <span className="hidden sm:inline">Aprovar</span>
                                  </button>
                                  <button
                                    onClick={() => updateProfessionalStatus(prof.id, 'rejected')}
                                    disabled={updatingId === prof.id}
                                    className="text-helora-tan hover:text-helora-sienna font-sans text-sm transition-colors duration-200 cursor-pointer disabled:opacity-50 flex items-center gap-1"
                                    title="Rejeitar"
                                  >
                                    <X className="w-4 h-4" />
                                    <span className="hidden sm:inline">Rejeitar</span>
                                  </button>
                                </div>
                              ) : (
                                <span className="text-helora-tan font-sans text-xs">N/A</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}