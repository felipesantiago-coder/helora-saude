import { create } from 'zustand';

export interface BookingState {
  step: number;
  serviceId: string | null;
  serviceName: string;
  servicePrice: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientCpf: string;
  patientBirthDate: string;
  professionalId: string | null;
  professionalName: string;
  appointmentDate: string;
  appointmentTime: string;
}

interface BookingStore extends BookingState {
  setStep: (step: number) => void;
  setService: (id: string, name: string, price: number) => void;
  setPatientData: (data: Partial<Pick<BookingState, 'patientName' | 'patientEmail' | 'patientPhone' | 'patientCpf' | 'patientBirthDate'>>) => void;
  setProfessional: (id: string, name: string) => void;
  setDateTime: (date: string, time: string) => void;
  reset: () => void;
}

const initialState: BookingState = {
  step: 1,
  serviceId: null,
  serviceName: '',
  servicePrice: 0,
  patientName: '',
  patientEmail: '',
  patientPhone: '',
  patientCpf: '',
  patientBirthDate: '',
  professionalId: null,
  professionalName: '',
  appointmentDate: '',
  appointmentTime: '',
};

export const useBookingStore = create<BookingStore>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  setService: (id, name, price) => set({ serviceId: id, serviceName: name, servicePrice: price, step: 2 }),
  setPatientData: (data) => set((state) => ({ ...state, ...data })),
  setProfessional: (id, name) => set({ professionalId: id, professionalName: name }),
  setDateTime: (date, time) => set({ appointmentDate: date, appointmentTime: time }),
  reset: () => set(initialState),
}));

export interface AuthState {
  user: { id: string; name: string; email: string; role: string; specialty?: string } | null;
  isAuthenticated: boolean;
  login: (user: { id: string; name: string; email: string; role: string; specialty?: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

export type AppView = 'public' | 'booking' | 'admin' | 'admin-login';

interface AppStore {
  view: AppView;
  setView: (view: AppView) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  view: 'public',
  setView: (view) => set({ view }),
}));