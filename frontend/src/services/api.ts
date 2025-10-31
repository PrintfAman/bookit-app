import axios from 'axios';
import type { Experience, Booking, BookingRequest, PromoCodeResponse } from '../types';

// Remove /api from here - we'll add it in Vercel env variable if needed
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Logging interceptors
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

export const experienceAPI = {
  getAll: async (): Promise<Experience[]> => {
    const response = await api.get('/experiences');
    return response.data;
  },

  getById: async (id: number): Promise<Experience> => {
    const response = await api.get(`/experiences/${id}`);
    return response.data;
  },
};

export const bookingAPI = {
  create: async (bookingData: BookingRequest): Promise<Booking> => {
    const response = await api.post('/bookings', bookingData);
    return response.data.booking;
  },

  getByReference: async (reference: string): Promise<Booking> => {
    const response = await api.get(`/bookings/${reference}`);
    return response.data;
  },
};

export const promoAPI = {
  validate: async (code: string, subtotal: number): Promise<PromoCodeResponse> => {
    try {
      const response = await api.post('/promo/validate', { code, subtotal });
      return response.data;
    } catch (error: any) {
      return {
        valid: false,
        error: error.response?.data?.error || 'Invalid promo code',
      };
    }
  },
};

export default api;