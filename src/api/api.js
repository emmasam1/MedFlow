import axios from 'axios';
// Import the specific function using curly braces
import { decryptData } from '../encryption/encryption';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const encryptedToken = sessionStorage.getItem('token');
  
  // Now decryptData is properly defined
  const token = decryptData(encryptedToken); 
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;