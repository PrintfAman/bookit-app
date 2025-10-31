import axios from 'axios';

// Type assertion to avoid TS errors without vite-env.d.ts
const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      error: error.response?.data || error.message,
      status: error.response?.status,
      path: error.config?.url,
    });
    return Promise.reject(error);
  }
);

export default api;