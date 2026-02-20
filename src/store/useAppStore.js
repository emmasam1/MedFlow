import { create } from 'zustand';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000' });

export const useAppStore = create((set, get) => ({
  // --- UI STATE ---
  darkMode: false,
  isSidebarOpen: true,
  setDarkMode: (val) => set({ darkMode: val }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  // --- DATA STATE ---
  user: null,
  patients: [],
  appointments: [],
  notifications: [],
  loading: false,

  // --- AUTH ACTIONS ---
  login: async (username, password) => {
    const res = await api.get(`/users?username=${username}&password=${password}`);
    if (res.data.length > 0) {
      set({ user: res.data[0] });
      return res.data[0];
    }
    throw new Error("Invalid credentials");
  },
  logout: () => set({ user: null }),

  // --- PATIENT ACTIONS ---
  fetchPatients: async () => {
    const res = await api.get('/patients');
    set({ patients: res.data });
  },
  addPatient: async (patientData) => {
    const res = await api.post('/patients', patientData);
    set((state) => ({ patients: [...state.patients, res.data] }));
  },

  // --- APPOINTMENT ACTIONS ---
  fetchAppointments: async (dateFilter = "") => {
    set({ loading: true });
    // If dateFilter is provided, json-server filters automatically
    const url = dateFilter ? `/appointments?date=${dateFilter}` : '/appointments';
    const res = await api.get(url);
    set({ appointments: res.data, loading: false });
  },
  
  createAppointment: async (appt) => {
    const res = await api.post('/appointments', { ...appt, status: 'pending' });
    set((state) => ({ appointments: [...state.appointments, res.data] }));
  },

  updateApptStatus: async (id, status) => {
    await api.patch(`/appointments/${id}`, { status });
    get().fetchAppointments(); // Refresh list
  }
}));