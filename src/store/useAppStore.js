import { create } from "zustand";
import api from "../api/api";
import { encryptData, decryptData } from "../encryption/encryption";

const getInitialUser = () => {
  try {
    const encryptedUser = sessionStorage.getItem("user");
    return decryptData(encryptedUser);
  } catch {
    return null;
  }
};

export const useAppStore = create((set) => ({
  user: getInitialUser(),
  loading: false,
  notifications: [],
  patients: [],
  queue: [],
  doctorQueue: null,
  labTest: [],
  patientSummary: null,

  login: async (identifier, password) => {
    set({ loading: true });
    try {
      const payload = identifier.includes("@")
        ? { email: identifier, password }
        : { staffId: identifier, password };

      const response = await api.post("/auth/login", payload);
      console.log(response);
      const { user, token } = response.data.data;

      sessionStorage.setItem("token", encryptData(token));
      sessionStorage.setItem("user", encryptData(user));

      set({ user, loading: false });
      return user;
    } catch (error) {
      set({ loading: false });
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  registerStaff: async (staffData) => {
    console.log(staffData);
    set({ loading: true });
    try {
      const formData = new FormData();

      Object.keys(staffData).forEach((key) => {
        // Logic to ensure the File object (avatar) is appended correctly
        if (staffData[key] !== undefined && staffData[key] !== null) {
          formData.append(key, staffData[key]);
        }
      });

      const response = await api.post("/auth/register-staff", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response);

      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },

  getStaff: async () => {
    try {
      const response = await api.get("/auth/staff");
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch staff");
    }
  },

  getNotifications: async (role) => {
    // Logic to fetch notifications based on role
    // const res = await api.get(`/notifications/${role}`);
    // set({ notifications: res.data });
  },

  logout: () => {
    sessionStorage.clear();
    set({ user: null, notifications: [] });
  },

  getPatients: async () => {
    set({ loading: true });
    try {
      const response = await api.get("/patients");
      const data = response.data.data;
      set({ patients: data, loading: false }); // Save to state!
      return data;
    } catch (error) {
      set({ loading: false });
      throw new Error(
        error.response?.data?.message || "Failed to fetch patients",
      );
    }
  },

  registerPatient: async (patientData) => {
    console.log(patientData);
    set({ loading: true });

    // Get the token from sessionStorage
    const token = sessionStorage.getItem("bearerToken");

    try {
      const response = await api.post("/patients/register", patientData, {
        headers: {
          Authorization: `Bearer ${token}`, // Inject token here
        },
      });

      const newPatient = response.data.data;

      set((state) => ({
        patients: [newPatient, ...state.patients],
        loading: false,
      }));

      return response.data;
    } catch (error) {
      set({ loading: false });
      throw new Error(
        error.response?.data?.message || "Patient registration failed",
      );
    }
  },

  // --- QUEUE ACTIONS ---

  // --- Inside useAppStore ---

  // getQueue: async (role, date) => {
  //   console.log(role)
  //   if (!role) return;

  //   set({ loading: true });

  //   const roleMapper = {
  //     finance_officer: "FINANCE",
  //     record_officer: "RECORD",
  //     doctor: "DOCTOR",
  //     nurse: "TRIAGE",
  //     admin: "ADMIN",
  //   };

  //   const apiRole = roleMapper[role] || role.toUpperCase();

  //   try {
  //     // Pass the date as a query parameter (?date=2026-04-22)
  //     // This assumes your backend is set up to handle date filtering
  //     const response = await api.get(`/queue/screens/${apiRole}`, {
  //       params: { date },
  //     });

  //     set({
  //       queue: response.data.data || [],
  //       loading: false,
  //     });
  //   } catch (error) {
  //     set({ loading: false, queue: [] });
  //     console.error(`Fetch queue failed for role: ${apiRole}`, error);
  //   }
  // },

  getQueue: async (passedRole, date = null) => {
    let role = passedRole;
    console.log(role, "passed role in getQueue");

    if (!role) {
      const currentState = useAppStore.getState();
      role = currentState.user?.role;
    }

    if (!role) {
      try {
        const encryptedUser = sessionStorage.getItem("user");
        const decryptedUser = decryptData(encryptedUser);
        role = decryptedUser?.role;
      } catch (err) {
        console.error("Failed to decrypt user from session storage", err);
      }
    }

    if (!role) {
      console.warn("getQueue: No role found.");
      return;
    }

    set({ loading: true });

    const roleMapper = {
      finance_officer: "FINANCE",
      record_officer: "RECORD",
      doctor: "DOCTOR",
      nurse: "TRIAGE",
      admin: "ADMIN",
      lab_officer: "LABORATORY",
    };

    const apiRole = roleMapper[role] || role.toUpperCase();

    try {
      const response = await api.get(`/queue/screens/${apiRole}`, {
        params: date ? { date } : {}, // ✅ only send date if exists
      });

      set({
        queue: response.data.data || [],
        loading: false,
      });
    } catch (error) {
      set({ loading: false, queue: [] });
      console.error(`Fetch queue failed for role: ${apiRole}`, error);
    }
  },

  processPayment: async (queueId, paymentMethod) => {
    set({ loading: true });
    try {
      // The payload as per your requirement
      const payload = {
        queueId: queueId, // e.g., "MFQ-20260421-0001"
        paymentMethod: paymentMethod.toUpperCase(), // e.g., "WALLET"
      };

      const response = await api.patch("/queue/pay", payload);

      // Update the local state to remove or update the paid item
      set((state) => ({
        queue: state.queue.map((item) =>
          item.queueId === queueId
            ? { ...item, status: "completed", paymentStatus: "paid" }
            : item,
        ),
        loading: false,
      }));

      return response.data;
    } catch (error) {
      set({ loading: false });
      const errorMsg =
        error.response?.data?.message || "Payment processing failed";
      console.error("Payment Error:", errorMsg);
      throw new Error(errorMsg);
    }
  },

  takeVitals: async (queueId, payload) => {
    set({ loading: true });

    try {
      // ✅ get token (same pattern you already use)
      const encryptedToken = sessionStorage.getItem("token");
      if (!encryptedToken) throw new Error("No authentication token found");

      const token = decryptData(encryptedToken);

      // ✅ API CALL
      const response = await api.post("/vitals", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedQueueItem = response.data.data;

      // ✅ update local queue state
      set((state) => ({
        queue: state.queue.map((item) =>
          item.id === queueId
            ? {
                ...item,
                vitals: payload,
                currentStage: "DOCTOR", // 👈 move patient forward
                status: "ready-for-doctor",
              }
            : item,
        ),
        loading: false,
      }));

      return response.data;
    } catch (error) {
      set({ loading: false });

      const errorMsg = error.response?.data?.message || "Failed to take vitals";

      console.error("Take Vitals Error:", errorMsg);
      throw new Error(errorMsg);
    }
  },

  submitConsultation: async (queueId, payload) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("No auth token found");

      const response = await api.patch(
        `/queue/consultation/${queueId}`,
        payload, // ✅ send payload here
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data; // ✅ axios already parses JSON
    } catch (error) {
      console.error("❌ Consultation Error:", error);

      // Optional: better error handling
      throw error?.response?.data || error.message;
    }
  },

  getPatientSummary: async (queueId) => {
    set({ loading: true });

    try {
      // token (same pattern you already use)
      const encryptedToken = sessionStorage.getItem("token");
      if (!encryptedToken) throw new Error("No auth token found");

      const token = decryptData(encryptedToken);

      const response = await api.get(`/doctor/patient-summary/${queueId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const summary = response.data.data;

      set({
        patientSummary: summary,
        loading: false,
      });

      return summary;
    } catch (error) {
      set({ loading: false });

      const msg =
        error.response?.data?.message || "Failed to fetch patient summary";

      console.error("Patient Summary Error:", msg);
      throw new Error(msg);
    }
  },

  addToQueue: async (queueData) => {
    console.log(queueData);
    set({ loading: true });
    // 1. Get and Decrypt token (matching your login storage logic)
    const encryptedToken = sessionStorage.getItem("token");
    if (!encryptedToken) throw new Error("No authentication token found");
    const token = decryptData(encryptedToken);

    try {
      const response = await api.post("/queue/initiate", queueData, {
        headers: {
          Authorization: `Bearer ${token}`, // Inject Bearer token
        },
      });

      const newItem = response.data.data;

      // 2. Update local state immediately for a smooth UI
      set((state) => ({
        queue: [newItem, ...state.queue],
        loading: false,
      }));

      return response.data;
    } catch (error) {
      set({ loading: false });
      throw new Error(
        error.response?.data?.message || "Failed to add to queue",
      );
    }
  },

  updateLabResults: async (queueId, formData) => {
    set({ loading: true });

    const encryptedToken = sessionStorage.getItem("token");
    if (!encryptedToken) throw new Error("No authentication token found");
    const token = decryptData(encryptedToken);

    try {
      // We use multipart/form-data for the file uploads
      const response = await api.patch(
        `/queue/lab-update/${queueId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(response);

      // Update the local queue state so the UI reflects the change immediately
      set((state) => ({
        queue: state.queue.map((q) =>
          q.queueId === queueId ? { ...q, ...response.data.updatedQueue } : q,
        ),
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error("Lab update failed:", error);
      set({ loading: false });
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to update lab results",
      };
    }
  },

  getDoctorWorkload: async () => {
    try {
      console.log("🟡 Fetching doctor workload...");

      const { data } = await api.get("/doctor/workload");

      console.log("🟢 Raw workload response:", data);

      if (!data.success) throw new Error(data.message);

      const workload = data.data;

      const flatQueue = [
        ...(workload.awaitingAttention || []),
        ...(workload.currentlyInLab || []),
        ...(workload.attendedToToday || []),
      ];

      console.log("🟣 Flattened queue length:", flatQueue.length);
      console.log("🟣 Awaiting:", workload.awaitingAttention?.length);
      console.log("🟣 Lab:", workload.currentlyInLab?.length);
      console.log("🟣 Attended:", workload.attendedToToday?.length);

      set({
        doctorQueue: workload,
        queue: Array.isArray(flatQueue) ? flatQueue : [],
      });

      console.log("✅ Zustand updated doctorQueue + queue");

      return workload;
    } catch (error) {
      console.error("❌ Doctor workload error:", error);
      return null;
    }
  },

  // Use this for when a doctor or nurse "calls" a patient
  updateQueueStatus: async (queueId, status) => {
    try {
      const response = await api.patch(`/queue/status/${queueId}`, { status });

      set((state) => ({
        queue: state.queue.map((item) =>
          item.id === queueId ? { ...item, status } : item,
        ),
      }));

      return response.data;
    } catch (error) {
      throw new Error("Failed to update status");
    }
  },
}));
