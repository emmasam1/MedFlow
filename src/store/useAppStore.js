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
  vitals: [],
  transactions: [],
  departmentHistory: [],
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

  processPayment: async (queueId, paymentMethod = "cash") => {
    const queueItem = get().queue.find((q) => q.id === queueId);

    if (!queueItem) return;

    const amountMap = {
      consultation: 5000,
      lab: 3000,
      pharmacy: 2000,
      radiology: 4000,
      cardiology: 6000,
      physiotherapy: 3500,
      admission: 10000,
    };

    const amount = amountMap[queueItem.service] || 0;

    const updated = {
      paymentStatus: "paid",
      paymentMethod,
    };

    /* -------- update queue -------- */

    await api.patch(`/queue/${queueId}`, updated);

    set((state) => ({
      queue: state.queue.map((q) =>
        q.id === queueId ? { ...q, ...updated } : q,
      ),
    }));

    /* -------- create transaction -------- */

    await api.post("/transactions", {
      patientName: queueItem.patientName,
      service: queueItem.service,
      amount,
      paymentMethod,
      createdAt: new Date().toISOString(),
    });

    /* -------- routing logic -------- */

    if (queueItem.service === "consultation") {
      const move = {
        status: "ready-for-doctor",
        currentDepartment: "doctor",
      };

      await api.patch(`/queue/${queueId}`, move);

      set((state) => ({
        queue: state.queue.map((q) =>
          q.id === queueId ? { ...q, ...move } : q,
        ),
      }));
    } else {
      const move = {
        status: "ready-for-service",
        currentDepartment: queueItem.service,
      };

      await api.patch(`/queue/${queueId}`, move);

      set((state) => ({
        queue: state.queue.map((q) =>
          q.id === queueId ? { ...q, ...move } : q,
        ),
      }));
    }
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

  processPayment: async (queueId, paymentMethod = "cash") => {
    const queueItem = get().queue.find((q) => q.id === queueId);

    if (!queueItem) return;

    const amountMap = {
      consultation: 5000,
      lab: 3000,
      pharmacy: 2000,
      radiology: 4000,
      cardiology: 6000,
      physiotherapy: 3500,
      admission: 10000,
    };

    const amount = amountMap[queueItem.service] || 0;

    /* CONSULTATION PAYMENT */

    if (queueItem.service === "consultation") {
      const updated = {
        paymentStatus: "paid",
        paymentMethod,
        status: "ready-for-doctor",
        currentDepartment: "doctor",
      };

      const res = await api.patch(`/queue/${queueId}`, updated);

      set((state) => ({
        queue: state.queue.map((q) =>
          q.id === queueId ? { ...q, ...updated } : q,
        ),
      }));

      await get().createTransaction({
        patientName: queueItem.patientName,
        service: "consultation",
        amount,
        paymentMethod,
      });

      get().createNotification({
        role: "doctor",
        title: "Patient Ready",
        message: `${queueItem.patientName} is ready for consultation`,
      });

      return res.data;
    }

    /* SERVICE PAYMENT (LAB / PHARMACY / ETC) */

    const updated = {
      paymentStatus: "paid",
      paymentMethod,
      status: "ready-for-service",
      currentDepartment: queueItem.service,
    };

    await api.patch(`/queue/${queueId}`, updated);

    set((state) => ({
      queue: state.queue.map((q) =>
        q.id === queueId ? { ...q, ...updated } : q,
      ),
    }));

    await get().createTransaction({
      patientName: queueItem.patientName,
      service: queueItem.service,
      amount,
      paymentMethod,
    });

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

 doctorSendPatient: async (queueId, department, doctorNotes, reason) => {
  const queueItem = get().queue.find((q) => q.id === queueId);

  if (!queueItem) return;

  const updated = {
    status: "done", // 👈 THIS is the important fix
    nextDepartment: department,
    doctorNotes,
    reason,
    sentAt: new Date().toISOString(),
  };

  const res = await api.patch(`/queue/${queueId}`, updated);

  set((state) => ({
    queue: state.queue.map((q) =>
      q.id === queueId ? { ...q, ...updated } : q
    ),
  }));

  /* notify next department */

  get().createNotification({
    role: department,
    title: "Patient Sent",
    message: `${queueItem.patientName} sent to ${department}`,
  });

  return res.data;
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

  /* ---------------- TRANSACTIONS ---------------- */
  fetchTransactions: async () => {
    const res = await api.get("/transactions");

    set({ transactions: res.data });

    return res.data;
  },

  getDailyTransactions: async (date) => {
    const res = await api.get("/transactions");

    const filtered = res.data.filter((t) => t.createdAt.startsWith(date));

    set({ transactions: filtered });

    return filtered;
  },

  createTransaction: async (data) => {
    const res = await api.post("/transactions", {
      ...data,
      createdAt: new Date().toISOString(),
    });

    set((state) => ({
      transactions: [res.data, ...state.transactions],
    }));

    return res.data;
  },

  downloadDailyReport: (date) => {
    const { transactions } = get();

    if (!transactions.length) return;

    const jsPDF = require("jspdf").jsPDF;
    require("jspdf-autotable");

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Hospital Daily Transaction Report", 14, 20);

    doc.setFontSize(12);
    doc.text(`Date: ${date}`, 14, 30);

    const rows = transactions.map((t, i) => [
      i + 1,
      t.patientName,
      t.service,
      t.paymentMethod,
      `₦${t.amount}`,
    ]);

    doc.autoTable({
      startY: 40,
      head: [["#", "Patient", "Service", "Payment Method", "Amount"]],
      body: rows,
    });

    const total = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

    doc.text(`Total Revenue: ₦${total}`, 14, doc.lastAutoTable.finalY + 10);

    doc.save(`transactions-${date}.pdf`);
  },

  /* ---------------- VITALS ---------------- */

  fetchVitals: async (patientId) => {
    try {
      const res = await api.get(`/vitals?patientId=${patientId}`);
      set({ vitals: res.data });
    } catch (err) {
      console.error("Error fetching vitals:", err);
    }
  },

  addVitals: async (data) => {
    try {
      const payload = {
        ...data,
        takenAt: new Date().toISOString(),
      };

      const res = await api.post("/vitals", payload);

      set((state) => ({
        vitals: [res.data, ...state.vitals],
      }));

      return res.data;
    } catch (err) {
      console.error("Error adding vitals:", err);
    }
  },

  deleteVitals: async (id) => {
    await api.delete(`/vitals/${id}`);

    set((state) => ({
      vitals: state.vitals.filter((v) => v.id !== id),
    }));
  },
}));
