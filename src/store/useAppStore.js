
import { create } from "zustand";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000" });

export const useAppStore = create((set, get) => ({
  // --- UI STATE ---
  darkMode: false,
  isSidebarOpen: true,
  setDarkMode: (val) => set({ darkMode: val }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  // --- DATA STATE ---
  user: null,
  patients: [],
  appointments: [],
  notifications: [],
  loading: false,

  // --- AUTH ACTIONS (The fixed version) ---
  login: async (username, password) => {
    set({ loading: true });
    try {
      const u = String(username).trim();
      const p = String(password).trim();

      // Fetch all users to bypass query string issues
      const res = await api.get(`/users`);

      const foundUser = res.data.find(
        (user) => user.username === u && user.password === p,
      );

      if (foundUser) {
        set({ user: foundUser, loading: false });
        return foundUser;
      } else {
        set({ loading: false });
        throw new Error("Invalid Staff ID or Password");
      }
    } catch (error) {
      set({ loading: false });
      throw new Error(error.message || "Connection Error");
    }
  },

  logout: () => set({ user: null }),

  // --- PATIENT ACTIONS ---
  fetchPatients: async () => {
    try {
      const res = await api.get("/patients");
      set({ patients: res.data });
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  },

  addPatient: async (patientData) => {
    try {
      const res = await api.post("/patients", patientData);
      set((state) => ({ patients: [...state.patients, res.data] }));
      return res.data;
    } catch (error) {
      console.error("SERVER ERROR:", error.response?.data);
      alert("Failed to register patient");
    }
  },

  // --- APPOINTMENT ACTIONS ---
  fetchAppointments: async (dateFilter = "") => {
    set({ loading: true });
    try {
      const url = dateFilter
        ? `/appointments?date=${dateFilter}`
        : "/appointments";
      const res = await api.get(url);
      set({ appointments: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error("Error fetching appointments:", error);
    }
  },

  createAppointment: async (appt) => {
    try {
      // Automatically sets status to pending on creation
      const res = await api.post("/appointments", {
        ...appt,
        status: "pending",
      });
      set((state) => ({ appointments: [...state.appointments, res.data] }));
      return res.data;
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
  },

  fetchSinglePatient: async (id) => {
     set({ loading: true });
    try {
      const res = await api.get(`/patients/${id}`);
       set({ patient: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error("Error fetching patient:", error);
      throw error;
    }
  },

  fetchSingleAppointment: async (id) => {
    set({ loading: true });
    try {
      const res = await api.get(`/appointments/${id}`); 
      set({ singleAppointment: res.data, loading: false });
    } catch (error) {
       set({ loading: false });
      console.error("Error fetching appointment:", error);
      throw error;
    }
  },

  updateApptStatus: async (id, status) => {
    try {
      await api.patch(`/appointments/${id}`, { status });
      // Refresh the list to reflect the updated status
      get().fetchAppointments();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  },
}));
