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
  labTest: [],

  login: async (identifier, password) => {
    set({ loading: true });
    try {
      const payload = identifier.includes("@")
        ? { email: identifier, password }
        : { staffId: identifier, password };

      const response = await api.post("/auth/login", payload);
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
  
  getQueue: async () => {
    set({ loading: true });
    try {
      const response = await api.get("/queue");
      set({ queue: response.data.data || [], loading: false });
    } catch (error) {
      set({ loading: false, queue: [] }); // Set to empty array on error to prevent .filter crashes
      console.error("Fetch queue failed", error);
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
        error.response?.data?.message || "Failed to add to queue"
      );
    }
  },

  // Use this for when a doctor or nurse "calls" a patient
  updateQueueStatus: async (queueId, status) => {
    try {
      const response = await api.patch(`/queue/status/${queueId}`, { status });
      
      set((state) => ({
        queue: state.queue.map((item) =>
          item.id === queueId ? { ...item, status } : item
        ),
      }));
      
      return response.data;
    } catch (error) {
      throw new Error("Failed to update status");
    }
  },

  // registerPatient: async (patientData) => {
  //   console.log(patientData);
  //   set({ loading: true });
  //   try {
  //     const response = await api.post("/patients/register", patientData);
  //     const newPatient = response.data.data;

  //     console.log(response);

  //     // Update local state so the UI adds the patient immediately
  //     set((state) => ({
  //       patients: [newPatient, ...state.patients],
  //       loading: false,
  //     }));

  //     return response.data;
  //   } catch (error) {
  //     console.log(error);
  //     set({ loading: false });
  //     throw new Error(
  //       error.response?.data?.message || "Patient registration failed",
  //     );
  //   }
  // },

  // getAllLabResults: () => {
  //   const { patients } = get();

  //   const results = patients.flatMap((p) =>
  //     (p.labHistory || []).map((lab) => ({
  //       ...lab,
  //       patientId: p.id,
  //       patientName: p.fullName,
  //       patientCode: p.patientId,
  //     }))
  //   );

  //   return results.sort(
  //     (a, b) => new Date(b.date) - new Date(a.date)
  //   );
  // },
}));
