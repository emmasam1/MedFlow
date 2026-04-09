import { create } from "zustand";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

export const useAppStore = create((set, get) => ({
  /* ---------------- UI ---------------- */

  darkMode: false,
  isSidebarOpen: true,

  setDarkMode: (val) => set({ darkMode: val }),
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),

  /* ---------------- DATA ---------------- */

  user: null,
  patients: [],
  patient: null,
  appointments: [],
  queue: [],
  notifications: [],
  users: [],
  vitals: [],
  transactions: [],
  labTest: [],
  loading: false,

  /* ---------------- AUTH ---------------- */

  login: async (username, password) => {
    set({ loading: true });

    try {
      const res = await api.get("/users");

      const found = res.data.find(
        (u) => u.username === username.trim() && u.password === password.trim(),
      );

      if (!found) throw new Error("Invalid login");

      set({ user: found, loading: false });
      sessionStorage.setItem("user", JSON.stringify(found));

      return found;
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

  /* ---------------- PATIENT ---------------- */

  fetchPatients: async () => {
    const res = await api.get("/patients");
    set({ patients: res.data });
  },

  fetchSinglePatient: async (id) => {
    set({ loading: true });
    const res = await api.get(`/patients/${id}`);
    set({ patient: res.data, loading: false });
  },

  addPatient: async (data) => {
    const res = await api.post("/patients", {
      ...data,
      runningBalance: 0, // 🔥 important
    });

    set((s) => ({ patients: [...s.patients, res.data] }));
    return res.data;
  },

  updatePatient: async (id, data) => {
    const res = await api.patch(`/patients/${id}`, data);

    set((s) => ({
      patients: s.patients.map((p) =>
        p.id === id ? res.data : p
      ),

      // 🔥 THIS IS THE MISSING PIECE
      patient:
        s.patient?.id === id ? res.data : s.patient,
    }));

    return res.data;
  },




  updatePatientBalance: async (id, amount, type = "add") => {
    const patient = get().patients.find((p) => p.id === id);
    if (!patient) return;

    let balance = Number(patient.runningBalance || 0);

    balance = type === "add" ? balance + amount : balance - amount;

    await api.patch(`/patients/${id}`, { runningBalance: balance });

    set((s) => ({
      patients: s.patients.map((p) =>
        p.id === id ? { ...p, runningBalance: balance } : p,
      ),
    }));
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

    set((s) => ({
      appointments: [...s.appointments, res.data],
    }));

    get().createNotification({
      role: "finance",
      title: "Appointment Payment",
      message: `${data.patientName} needs to pay`,
    });

    return res.data;
  },

  updateApptStatus: async (id, status) => {
    await api.patch(`/appointments/${id}`, { status });
    get().fetchAppointments();
  },

  /* ---------------- QUEUE ---------------- */

  getQueue: async () => {
    const res = await api.get("/queue");
    set({ queue: res.data });
  },

  createQueue: async (data) => {
    const item = {
      ...data,
      service: "consultation",
      paymentStatus: "unpaid",
      currentDepartment: "finance",
      status: "waiting",
      labTests: [],
      labAmount: 0,
      balance: 0,
      nextDepartment: null,
    };

    const res = await api.post("/queue", item);

    set((s) => ({
      queue: [res.data, ...s.queue],
    }));

    return res.data;
  },

  cancelQueue: async (id) => {
    await api.patch(`/queue/${id}`, { status: "cancelled" });

    set((s) => ({
      queue: s.queue.map((q) =>
        q.id === id ? { ...q, status: "cancelled" } : q,
      ),
    }));
  },

  /* ---------------- PAYMENT (FIXED) ---------------- */

  processPayment: async (queueId, method = "cash") => {
    const q = get().queue.find((x) => x.id === queueId);
    if (!q) return;

    const amountMap = {
      consultation: 5000,
      pharmacy: 2000,
      radiology: 4000,
      cardiology: 6000,
    };

    const amount =
      q.service === "lab" ? q.labAmount : amountMap[q.service] || 0;

    // ✅ update DB
    await get().updatePatientBalance(q.patientId, amount, "subtract");

    // ✅ update UI instantly (THIS IS YOUR CODE)
    set((s) => ({
      patients: s.patients.map((p) =>
        p.id === q.patientId
          ? { ...p, runningBalance: (p.runningBalance || 0) - amount }
          : p,
      ),
      patient:
        s.patient?.id === q.patientId
          ? {
            ...s.patient,
            runningBalance: (s.patient.runningBalance || 0) - amount,
          }
          : s.patient,
    }));

    const updated = {
      paymentStatus: "paid",
      paymentMethod: method,
      status: "waiting",
      currentDepartment:
        q.service === "consultation" ? "doctor" : q.nextDepartment || q.service,
    };

    await api.patch(`/queue/${queueId}`, updated);

    set((s) => ({
      queue: s.queue.map((x) => (x.id === queueId ? { ...x, ...updated } : x)),
    }));

    get().createTransaction({
      patientName: q.patientName,
      service: q.service,
      amount,
      paymentMethod: method,
    });
  },

  /* ---------------- PARTIAL PAYMENT ---------------- */

  // processPartialPayment: async (queueId, paid, method = "cash") => {
  //   const q = get().queue.find((x) => x.id === queueId);
  //   if (!q) return;

  //   const full = q.service === "lab" ? q.labAmount : 5000;
  //   const remaining = full - paid;

  //   await get().updatePatientBalance(q.patientId, paid, "subtract");

  //   await get().createTransaction({
  //     patientName: q.patientName,
  //     service: q.service,
  //     amount: paid,
  //     paymentMethod: method,
  //   });

  //   const updated = {
  //     paymentStatus: remaining <= 0 ? "paid" : "partial",
  //     balance: remaining,
  //   };

  //   await api.patch(`/queue/${queueId}`, updated);

  //   set((s) => ({
  //     queue: s.queue.map((x) => (x.id === queueId ? { ...x, ...updated } : x)),
  //   }));

  //   if (remaining <= 0) {
  //     get().processPayment(queueId, method);
  //   }
  // },
  processPartialPayment: async (queueId, paid, method = "cash") => {
    const q = get().queue.find((x) => x.id === queueId);
    if (!q) return;

    const full = q.service === "lab" ? q.labAmount : 5000;

    const remaining = (q.balance ?? full) - paid;

    // ✅ update patient balance
    // after updating DB
    await get().updatePatientBalance(q.patientId, paid, "subtract");

    // ✅ instant UI update
    set((s) => ({
      patients: s.patients.map((p) =>
        p.id === q.patientId
          ? { ...p, runningBalance: (p.runningBalance || 0) - paid }
          : p,
      ),
      patient:
        s.patient?.id === q.patientId
          ? {
            ...s.patient,
            runningBalance: (s.patient.runningBalance || 0) - paid,
          }
          : s.patient,
    }));

    // ✅ create transaction
    await get().createTransaction({
      patientId: q.patientId, // ✅ add this
      patientName: q.patientName,
      service: q.service,
      amount,
      paymentMethod: method,
      paymentType: remaining > 0 ? "partial" : "full",
      balance: remaining ?? 0,
      createdAt: new Date().toISOString(),
    });

    const updated = {
      paymentStatus: remaining <= 0 ? "paid" : "partial",
      balance: remaining > 0 ? remaining : 0,
    };

    await api.patch(`/queue/${queueId}`, updated);

    set((s) => ({
      queue: s.queue.map((x) => (x.id === queueId ? { ...x, ...updated } : x)),
    }));

    // ✅ if fully paid → complete payment flow
    if (remaining <= 0) {
      await get().processPayment(queueId, method);
    }
  },

  /* ---------------- DOCTOR ---------------- */

  doctorSendPatient: async (queueId, department, notes, reason, tests = []) => {
    const q = get().queue.find((x) => x.id === queueId);
    if (!q) return;

    const labAmount = tests.reduce((sum, t) => sum + Number(t.amount || 0), 0);

    // 🔥 ADD TO BALANCE
    await get().updatePatientBalance(q.patientId, labAmount, "add");

    const updated = {
      service: department,
      currentDepartment: "finance",
      nextDepartment: department,
      paymentStatus: "unpaid",
      status: "done", // ✅ doctor is DONE
      doctorNotes: notes,
      reason,
      labTests: tests,
      labAmount,
    };

    await api.patch(`/queue/${queueId}`, updated);

    set((s) => ({
      queue: s.queue.map((x) => (x.id === queueId ? { ...x, ...updated } : x)),
    }));

    get().createNotification({
      role: "finance",
      title: "Payment Needed",
      message: `${q.patientName} needs payment for ${department}`,
    });
  },

  /* ---------------- STATUS ---------------- */

  updateQueueStatus: async (id, status) => {
    await api.patch(`/queue/${id}`, { status });

    set((s) => ({
      queue: s.queue.map((q) => (q.id === id ? { ...q, status } : q)),
    }));
  },

  completeService: async (id) => {
    await api.patch(`/queue/${id}`, { status: "done" });

    set((s) => ({
      queue: s.queue.map((q) => (q.id === id ? { ...q, status: "done" } : q)),
    }));
  },

  /* ---------------- TRANSACTIONS ---------------- */

  fetchTransactions: async () => {
    const res = await api.get("/transactions");
    set({ transactions: res.data });
  },

  createTransaction: async (data) => {
    const res = await api.post("/transactions", {
      ...data,
      createdAt: new Date().toISOString(),
    });

    set((s) => ({
      transactions: [res.data, ...s.transactions],
    }));
  },

  getTransactionsByPatientId: (patientId) => {
    const txs = get().transactions.filter((t) => t.patientId === patientId);
    return txs;
  },

  getPatientBalance: (patientId) => {
    const txs = get().getTransactionsByPatientId(patientId);

    // Sum up all amounts, taking partial payments into account
    const balance = txs.reduce((total, t) => {
      if (t.paymentType === "partial") {
        // For partial, the remaining balance is stored in t.balance
        return t.balance ?? total;
      }
      // Otherwise, full amount adds to balance
      return total + t.amount;
    }, 0);

    return balance;
  },

  getDailyTransactions: async (date) => {
    const res = await api.get("/transactions");

    const filtered = res.data.filter((t) => t.createdAt.startsWith(date));

    set({ transactions: filtered });

    return filtered;
  },

  /* ---------------- NOTIFICATIONS ---------------- */

  createNotification: async (data) => {
    const res = await api.post("/notifications", {
      ...data,
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    set((s) => ({
      notifications: [...s.notifications, res.data],
    }));
  },

  // getNotifications: async (role) => {
  //   try {
  //     const res = await fetch(`/notifications?role=${role}`);
  //     const data = await res.json();
  //     set({ notifications: data });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // },
  getNotifications: async (role) => {
    const res = await api.get("/notifications");

    const filtered = res.data.filter(
      (n) => n.role?.toLowerCase() === role?.toLowerCase(),
    );

    set({ notifications: filtered });

    return filtered;
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n,
      ),
    }));
  },

  /* ---------------- LAB ---------------- */
  // submitLabResult: async (queueItem, resultData) => {
  //   const { patients, updatePatient, fetchSinglePatient, getPatients } = get();

  //   // 1. find patient
  //   const patient = patients.find((p) => p.id === queueItem.patientId);
  //   if (!patient) return;

  //   // 2. build lab result
  //   const newLab = {
  //     id: Date.now().toString(),
  //     date: new Date().toISOString(),
  //     requestedBy: queueItem.doctorNotes || "Doctor",
  //     tests: resultData.tests,
  //     notes: resultData.notes,
  //     file: resultData.file || "",
  //   };

  //   // 3. update patient
  //   await updatePatient(patient.id, {
  //     ...patient,
  //     labHistory: [...(patient.labHistory || []), newLab],
  //   });

  //   // 🔥 4. REFRESH DATA (THIS WAS MISSING)
  //   await getPatients();
  //   await fetchSinglePatient(patient.id);

  //   // 5. update queue
  //   await api.patch(`/queue/${queueItem.id}`, {
  //     status: "done",
  //     currentDepartment: "doctor",
  //   });

  //   // 6. update UI instantly
  //   set((s) => ({
  //     queue: s.queue.map((q) =>
  //       q.id === queueItem.id
  //         ? { ...q, status: "done", currentDepartment: "doctor" }
  //         : q
  //     ),
  //   }));
  // },

  submitLabResult: async (queueItem, resultData) => {
    const { patients, updatePatient } = get();

    const patient = patients.find(
      (p) => p.id === queueItem.patientId
    );

    if (!patient) return;

    const newLab = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      requestedBy: queueItem.doctorNotes || "Doctor",
      tests: resultData.tests,
      notes: resultData.notes,
      file: resultData.file || "",
    };

    await updatePatient(patient.id, {
      ...patient,
      labHistory: [...(patient.labHistory || []), newLab],
    });

    // 🔥 NO NEED TO FETCH AGAIN

    await api.patch(`/queue/${queueItem.id}`, {
      status: "done",
      currentDepartment: "doctor",
    });

    set((s) => ({
      queue: s.queue.map((q) =>
        q.id === queueItem.id
          ? { ...q, status: "done", currentDepartment: "doctor" }
          : q
      ),
    }));
  },

  fetchLabTests: async () => {
    const res = await api.get("/labTest");
    set({ labTest: res.data });
  },

  getAllLabResults: () => {
    const { patients } = get();
  
    const results = patients.flatMap((p) =>
      (p.labHistory || []).map((lab) => ({
        ...lab,
        patientId: p.id,
        patientName: p.fullName,
        patientCode: p.patientId,
      }))
    );
  
    return results.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  },
    
}));
