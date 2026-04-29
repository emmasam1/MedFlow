import axios from 'axios';
import { decryptData } from '../encryption/encryption';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const encryptedToken = sessionStorage.getItem('token');
    
    if (encryptedToken) {
      try {
        // Decrypt the token safely
        const token = decryptData(encryptedToken); 
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Token decryption failed:", error);
        // Optional: Clear storage if the token is corrupted
        // sessionStorage.removeItem('token');
      }
    }
    
    return config;
  }, 
  (error) => {
    return Promise.reject(error);
  }
);

// Pro-tip: Add a response interceptor for 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logic for when token expires (e.g., redirect to login)
      console.warn("Session expired. Redirecting...");
      sessionStorage.clear();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;