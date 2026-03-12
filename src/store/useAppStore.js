// import { create } from "zustand";
// import axios from "axios";

// const api = axios.create({ baseURL: "http://localhost:5000" });

// export const useAppStore = create((set, get) => ({
//   // --- UI STATE ---
//   darkMode: false,
//   isSidebarOpen: true,
//   setDarkMode: (val) => set({ darkMode: val }),
//   toggleSidebar: () =>
//     set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

//   // --- DATA STATE ---
//   user: null,
//   patients: [],
//   appointments: [],
//   notifications: [],
//   queue: [],
//   loading: false,

//   // --- AUTH ACTIONS (The fixed version) ---
//   login: async (username, password) => {
//     set({ loading: true });
//     try {
//       const u = String(username).trim();
//       const p = String(password).trim();

//       // Fetch all users to bypass query string issues
//       const res = await api.get(`/users`);

//       const foundUser = res.data.find(
//         (user) => user.username === u && user.password === p,
//       );

//       if (foundUser) {
//         set({ user: foundUser, loading: false });
//         return foundUser;
//       } else {
//         set({ loading: false });
//         throw new Error("Invalid Staff ID or Password");
//       }
//     } catch (error) {
//       set({ loading: false });
//       throw new Error(error.message || "Connection Error");
//     }
//   },

//   logout: () => set({ user: null }),

//   // --- PATIENT ACTIONS ---
//   fetchPatients: async () => {
//     try {
//       const res = await api.get("/patients");
//       set({ patients: res.data });
//     } catch (error) {
//       console.error("Error fetching patients:", error);
//     }
//   },

//   addPatient: async (patientData) => {
//     try {
//       const res = await api.post("/patients", patientData);
//       set((state) => ({ patients: [...state.patients, res.data] }));
//       return res.data;
//     } catch (error) {
//       console.error("SERVER ERROR:", error.response?.data);
//       alert("Failed to register patient");
//     }
//   },

//   // --- APPOINTMENT ACTIONS ---
//   fetchAppointments: async (dateFilter = "") => {
//     set({ loading: true });
//     try {
//       const url = dateFilter
//         ? `/appointments?date=${dateFilter}`
//         : "/appointments";
//       const res = await api.get(url);
//       set({ appointments: res.data, loading: false });
//     } catch (error) {
//       set({ loading: false });
//       console.error("Error fetching appointments:", error);
//     }
//   },

//   createAppointment: async (appt) => {
//     try {
//       const res = await api.post("/appointments", {
//         ...appt,
//         status: "pending",
//       });

//       const appointment = res.data;

//       set((state) => ({
//         appointments: [...state.appointments, appointment],
//       }));

//       // Send notification to selected doctor
//       get().createNotification({
//         userId: appointment.doctorId,
//         message: `New appointment scheduled for ${appointment.date} at ${appointment.time}. Reason: ${appointment.reason}`,
//       });

//       return appointment;
//     } catch (error) {
//       console.error("Error creating appointment:", error);
//       throw error;
//     }
//   },

//   getNotifications: async (role) => {
//     try {
//       const res = await api.get("/notifications");

//       // Filter notifications for this role
//       const filtered = res.data.filter(
//         (n) => n.role?.toLowerCase() === role?.toLowerCase(),
//       );

//       // Remove duplicates
//       const unique = Array.from(
//         new Map(filtered.map((n) => [n.id, n])).values(),
//       );

//       set({ notifications: unique });

//       return unique;
//     } catch (err) {
//       console.error(err);
//       return [];
//     }
//   },

//   createNotification: async ({ userId, message, title = "Notification" }) => {
//     try {
//       const res = await api.post("/notifications", {
//         userId,
//         message,
//         title,
//         isRead: false,
//       });

//       set((state) => {
//         const combined = [...state.notifications, res.data];

//         // Deduplicate by ID immediately
//         const unique = Array.from(
//           new Map(combined.map((n) => [n.id, n])).values(),
//         );

//         return { notifications: unique };
//       });
//     } catch (error) {
//       console.error("Notification error:", error);
//     }
//   },

//   markAsRead: (notifId) => {
//     set((state) => ({
//       notifications: state.notifications.map((n) =>
//         n.id === notifId ? { ...n, isRead: true } : n,
//       ),
//     }));
//   },

//   markAllAsRead: () => {
//     set((state) => ({
//       notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
//     }));
//   },

//   fetchSinglePatient: async (id) => {
//     set({ loading: true });
//     try {
//       const res = await api.get(`/patients/${id}`);
//       set({ patient: res.data, loading: false });
//     } catch (error) {
//       set({ loading: false });
//       console.error("Error fetching patient:", error);
//       throw error;
//     }
//   },

//   fetchSingleAppointment: async (id) => {
//     set({ loading: true });
//     try {
//       const res = await api.get(`/appointments/${id}`);
//       set({ singleAppointment: res.data, loading: false });
//     } catch (error) {
//       set({ loading: false });
//       console.error("Error fetching appointment:", error);
//       throw error;
//     }
//   },

//   updateApptStatus: async (id, status) => {
//     try {
//       await api.patch(`/appointments/${id}`, { status });
//       // Refresh the list to reflect the updated status
//       get().fetchAppointments();
//     } catch (error) {
//       console.error("Error updating status:", error);
//     }
//   },

//   updatePatient: async (id, updatedData) => {
//     try {
//       // Send PATCH request to backend
//       const res = await api.patch(`/patients/${id}`, updatedData);

//       // Update the patients array in store
//       set((state) => ({
//         patients: state.patients.map((p) => (p.id === id ? res.data : p)),
//       }));

//       // Optional: return updated patient
//       return res.data;
//     } catch (error) {
//       console.error("Error updating patient:", error);
//       throw new Error(
//         error.response?.data?.message || "Failed to update patient",
//       );
//     }
//   },

//   getUsers: async () => {
//     try {
//       const res = await api.get("/users");

//       set({ users: res.data });
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   },

//   getQueue: async () => {
//     set({ loading: true });

//     try {
//       const res = await api.get("/queue");

//       // remove duplicates just in case
//       const unique = Array.from(
//         new Map(res.data.map((q) => [q.id, q])).values(),
//       );

//       set({ queue: unique });
//     } catch (err) {
//       console.error("Queue fetch error:", err);
//     } finally {
//       set({ loading: false });
//     }
//   },

//   createQueue: async (data) => {
//     try {
//       const res = await api.post("/queue", {
//         patientId: data.patientId,
//         patientName: data.patientName,
//         cardNumber: data.cardNumber,
//         reason: data.reason,
//         notes: data.notes,
//         priority: data.priority || "normal",
//         doctorRole: "specialist",
//         status: "waiting",
//         timeAdded: new Date().toISOString(),
//       });

//       set((state) => ({
//         queue: [res.data, ...state.queue],
//       }));

//       return res.data;
//     } catch (err) {
//       console.error("Queue creation error:", err);
//     }
//   },

//   updateQueueStatus: async (id, status) => {
//     try {
//       const res = await api.patch(`/queue/${id}`, { status });

//       set((state) => ({
//         queue: state.queue.map((q) =>
//           q.id === id ? { ...q, status: res.data.status } : q,
//         ),
//       }));
//     } catch (err) {
//       console.error("Queue update error:", err);
//     }
//   },

//   removeFromQueue: async (id) => {
//     try {
//       await api.delete(`/queue/${id}`);

//       set((state) => ({
//         queue: state.queue.filter((q) => q.id !== id),
//       }));
//     } catch (err) {
//       console.error("Queue delete error:", err);
//     }
//   },
// }));

import { create } from "zustand";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

export const useAppStore = create((set, get) => ({
  /* ---------------- UI STATE ---------------- */

  darkMode: false,
  isSidebarOpen: true,

  setDarkMode: (val) => set({ darkMode: val }),

  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  /* ---------------- DATA STATE ---------------- */

  user: null,
  patients: [],
  appointments: [],
  queue: [],
  notifications: [],
  users: [],
  loading: false,

  /* ---------------- AUTH ---------------- */

  login: async (username, password) => {
    set({ loading: true });

    try {
      const res = await api.get("/users");

      const foundUser = res.data.find(
        (u) =>
          u.username === String(username).trim() &&
          u.password === String(password).trim(),
      );

      if (!foundUser) throw new Error("Invalid Staff ID or Password");

      set({ user: foundUser, loading: false });

      sessionStorage.setItem("user", JSON.stringify(foundUser));

      return foundUser;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  logout: () => {
    sessionStorage.removeItem("user");
    set({ user: null });
  },

  getUsers: async () => {
    const res = await api.get("/users");
    set({ users: res.data });
  },

  /* ---------------- PATIENTS ---------------- */

  fetchPatients: async () => {
    try {
      const res = await api.get("/patients");

      set({ patients: res.data });
    } catch (err) {
      console.error(err);
    }
  },

  addPatient: async (data) => {
    const res = await api.post("/patients", data);

    set((state) => ({
      patients: [...state.patients, res.data],
    }));

    return res.data;
  },

  updatePatient: async (id, data) => {
    const res = await api.patch(`/patients/${id}`, data);

    set((state) => ({
      patients: state.patients.map((p) => (p.id === id ? res.data : p)),
    }));

    return res.data;
  },

  /* ---------------- APPOINTMENTS ---------------- */

  fetchAppointments: async () => {
    const res = await api.get("/appointments");

    set({ appointments: res.data });
  },

  createAppointment: async (data) => {
    const res = await api.post("/appointments", {
      ...data,
      status: "pending",
      paymentStatus: "unpaid",
    });

    set((state) => ({
      appointments: [...state.appointments, res.data],
    }));

    // Notify finance officer
    get().createNotification({
      role: "finance",
      title: "Appointment Payment Required",
      message: `${data.patientName} has an appointment that requires payment`,
    });

    return res.data;
  },

  updateApptStatus: async (id, status) => {
    await api.patch(`/appointments/${id}`, { status });

    get().fetchAppointments();
  },

  processAppointmentPayment: async (appointmentId) => {
    const appointment = get().appointments.find((a) => a.id === appointmentId);

    if (!appointment) return;

    const updated = {
      paymentStatus: "paid",
      status: "ready",
    };

    await api.patch(`/appointments/${appointmentId}`, updated);

    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === appointmentId ? { ...a, ...updated } : a,
      ),
    }));

    // Notify specialist
    get().createNotification({
      role: "specialist",
      title: "Paid Appointment",
      message: `${appointment.patientName} is ready for consultation`,
    });
  },

  /* ---------------- QUEUE ---------------- */

  getQueue: async () => {
    set({ loading: true });

    try {
      const res = await api.get("/queue");

      set({ queue: res.data });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  /* -------- Queue Patient -------- */

  createQueue: async (data) => {
    const queueItem = {
      patientId: data.patientId,
      patientName: data.patientName,
      cardNumber: data.cardNumber,
      reason: data.reason,
      notes: data.notes || "",
      priority: data.priority || "normal",

      service: "consultation",

      paymentStatus: "unpaid",

      currentDepartment: "finance",

      status: "waiting",

      timeAdded: new Date().toISOString(),
    };

    const res = await api.post("/queue", queueItem);

    set((state) => ({
      queue: [res.data, ...state.queue],
    }));

    return res.data;
  },

  /* ---------------- CANCEL QUEUE ---------------- */

  cancelQueue: async (queueId) => {
    const queueItem = get().queue.find((q) => q.id === queueId);

    if (!queueItem) return;

    const updated = {
      status: "cancelled",
    };

    await api.patch(`/queue/${queueId}`, updated);

    set((state) => ({
      queue: state.queue.map((q) =>
        q.id === queueId ? { ...q, ...updated } : q,
      ),
    }));
  },

  /* ---------------- FINANCE PAYMENT ---------------- */

  processPayment: async (queueId) => {
    const queueItem = get().queue.find((q) => q.id === queueId);

    if (!queueItem) return;

    /* ---- CONSULTATION PAYMENT ---- */

    if (queueItem.service === "consultation") {
      const updated = {
        paymentStatus: "paid",
        status: "ready-for-doctor",
        currentDepartment: "doctor",
      };

      const res = await api.patch(`/queue/${queueId}`, updated);

      set((state) => ({
        queue: state.queue.map((q) =>
          q.id === queueId ? { ...q, ...updated } : q,
        ),
      }));

      get().createNotification({
        role: "doctor",
        title: "Patient Ready",
        message: `${queueItem.patientName} is ready for consultation`,
      });

      return res.data;
    }

    /* ---- SERVICE PAYMENT ---- */

    const updated = {
      paymentStatus: "paid",
      status: "ready-for-service",
      currentDepartment: queueItem.service,
    };

    await api.patch(`/queue/${queueId}`, updated);

    set((state) => ({
      queue: state.queue.map((q) =>
        q.id === queueId ? { ...q, ...updated } : q,
      ),
    }));

    get().createNotification({
      role: queueItem.service,
      title: "Patient Ready",
      message: `${queueItem.patientName} is ready for ${queueItem.service}`,
    });
  },

  /* ---------------- UPDATE QUEUE STATUS ---------------- */

  updateQueueStatus: async (queueId, status) => {
    const queueItem = get().queue.find((q) => q.id === queueId);

    if (!queueItem) return;

    const updated = { status };

    await api.patch(`/queue/${queueId}`, updated);

    set((state) => ({
      queue: state.queue.map((q) =>
        q.id === queueId ? { ...q, ...updated } : q,
      ),
    }));
  },

  /* ---------------- DOCTOR ACTION ---------------- */

  doctorSendPatient: async (queueId, service) => {
    const queueItem = get().queue.find((q) => q.id === queueId);

    if (!queueItem) return;

    const updated = {
      service: service,

      paymentStatus: "unpaid",

      currentDepartment: "finance",

      status: "awaiting-payment",
    };

    await api.patch(`/queue/${queueId}`, updated);

    set((state) => ({
      queue: state.queue.map((q) =>
        q.id === queueId ? { ...q, ...updated } : q,
      ),
    }));

    get().createNotification({
      role: "finance",
      title: "Payment Required",
      message: `${queueItem.patientName} requires payment for ${service}`,
    });
  },

  /* ---------------- COMPLETE SERVICE ---------------- */

  completeService: async (queueId) => {
    const queueItem = get().queue.find((q) => q.id === queueId);

    const updated = {
      status: "completed",
    };

    await api.patch(`/queue/${queueId}`, updated);

    set((state) => ({
      queue: state.queue.map((q) =>
        q.id === queueId ? { ...q, ...updated } : q,
      ),
    }));

    get().createNotification({
      role: "doctor",
      title: "Service Completed",
      message: `${queueItem.patientName} completed ${queueItem.service}`,
    });
  },

  /* ---------------- REMOVE QUEUE ---------------- */

  removeFromQueue: async (id) => {
    await api.delete(`/queue/${id}`);

    set((state) => ({
      queue: state.queue.filter((q) => q.id !== id),
    }));
  },

  /* ---------------- NOTIFICATIONS ---------------- */

  getNotifications: async (role) => {
    const res = await api.get("/notifications");

    const filtered = res.data.filter(
      (n) => n.role?.toLowerCase() === role?.toLowerCase(),
    );

    set({ notifications: filtered });

    return filtered;
  },

  createNotification: async ({ role, message, title }) => {
    const res = await api.post("/notifications", {
      role,
      message,
      title,
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    set((state) => ({
      notifications: [...state.notifications, res.data],
    }));
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n,
      ),
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({
        ...n,
        isRead: true,
      })),
    }));
  },
}));
