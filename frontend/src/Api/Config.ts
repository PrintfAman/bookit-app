import axios from 'axios';

// ✅ Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

// ✅ Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ✅ Interceptors for error logging
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
