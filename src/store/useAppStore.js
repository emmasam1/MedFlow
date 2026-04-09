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
    set({ loading: true });
    try {
      const formData = new FormData();

      Object.keys(staffData).forEach((key) => {
        // Only append if the value actually exists to avoid sending "undefined" strings
        if (staffData[key] !== undefined && staffData[key] !== null) {
          formData.append(key, staffData[key]);
        }
      });

      const response = await api.post("/auth/register-staff", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set({ loading: false });
      return response.data; // Ensure this contains the new user object in .data
    } catch (error) {
      set({ loading: false });
      const message = error.response?.data?.message || "Registration failed";
      throw new Error(message);
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
}));
