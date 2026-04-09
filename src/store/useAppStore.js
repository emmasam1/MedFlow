
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

  // --- NEW: Register Staff Action ---
  registerStaff: async (staffData) => {
    set({ loading: true });
    try {
      const formData = new FormData();

      // Append all text fields and the file to FormData
      Object.keys(staffData).forEach((key) => {
        // If it's the avatar, it should be a File object from the input
        formData.append(key, staffData[key]);
      });

      const response = await api.post("/auth/register-staff", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },

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

  getNotifications: async (role) => {
    // Logic to fetch notifications based on role
    // const res = await api.get(`/notifications/${role}`);
    // set({ notifications: res.data });
  },

  logout: () => {
    sessionStorage.clear();
    set({ user: null, notifications: [] });
  },
}));
