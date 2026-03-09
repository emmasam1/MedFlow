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
  queue: [],
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
      const res = await api.post("/appointments", {
        ...appt,
        status: "pending",
      });

      const appointment = res.data;

      set((state) => ({
        appointments: [...state.appointments, appointment],
      }));

      // Send notification to selected doctor
      get().createNotification({
        userId: appointment.doctorId,
        message: `New appointment scheduled for ${appointment.date} at ${appointment.time}. Reason: ${appointment.reason}`,
      });

      return appointment;
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
  },

  getNotifications: async (role) => {
    try {
      const res = await api.get("/notifications");

      // Filter notifications for this role
      const filtered = res.data.filter(
        (n) => n.role?.toLowerCase() === role?.toLowerCase(),
      );

      // Remove duplicates
      const unique = Array.from(
        new Map(filtered.map((n) => [n.id, n])).values(),
      );

      set({ notifications: unique });

      return unique;
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  createNotification: async ({ userId, message, title = "Notification" }) => {
    try {
      const res = await api.post("/notifications", {
        userId,
        message,
        title,
        isRead: false,
      });

      set((state) => {
        const combined = [...state.notifications, res.data];

        // Deduplicate by ID immediately
        const unique = Array.from(
          new Map(combined.map((n) => [n.id, n])).values(),
        );

        return { notifications: unique };
      });
    } catch (error) {
      console.error("Notification error:", error);
    }
  },

  markAsRead: (notifId) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notifId ? { ...n, isRead: true } : n,
      ),
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    }));
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

  updatePatient: async (id, updatedData) => {
    try {
      // Send PATCH request to backend
      const res = await api.patch(`/patients/${id}`, updatedData);

      // Update the patients array in store
      set((state) => ({
        patients: state.patients.map((p) => (p.id === id ? res.data : p)),
      }));

      // Optional: return updated patient
      return res.data;
    } catch (error) {
      console.error("Error updating patient:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update patient",
      );
    }
  },

  getUsers: async () => {
    try {
      const res = await api.get("/users");

      set({ users: res.data });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  },

  getQueue: async () => {
    set({ loading: true });

    try {
      const res = await api.get("/queue");

      // remove duplicates just in case
      const unique = Array.from(
        new Map(res.data.map((q) => [q.id, q])).values(),
      );

      set({ queue: unique });
    } catch (err) {
      console.error("Queue fetch error:", err);
    } finally {
      set({ loading: false });
    }
  },

  createQueue: async (data) => {
    try {
      const res = await api.post("/queue", {
        patientId: data.patientId,
        patientName: data.patientName,
        cardNumber: data.cardNumber,
        reason: data.reason,
        notes: data.notes,
        priority: data.priority || "normal",
        doctorRole: "specialist",
        status: "waiting",
        timeAdded: new Date().toISOString(),
      });

      set((state) => ({
        queue: [res.data, ...state.queue],
      }));

      return res.data;
    } catch (err) {
      console.error("Queue creation error:", err);
    }
  },

  updateQueueStatus: async (id, status) => {
    try {
      const res = await api.patch(`/queue/${id}`, { status });

      set((state) => ({
        queue: state.queue.map((q) =>
          q.id === id ? { ...q, status: res.data.status } : q,
        ),
      }));
    } catch (err) {
      console.error("Queue update error:", err);
    }
  },

  removeFromQueue: async (id) => {
    try {
      await api.delete(`/queue/${id}`);

      set((state) => ({
        queue: state.queue.filter((q) => q.id !== id),
      }));
    } catch (err) {
      console.error("Queue delete error:", err);
    }
  },
}));
