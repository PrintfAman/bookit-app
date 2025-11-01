import axios from 'axios';
import type { Experience, Booking, BookingRequest, PromoCodeResponse } from '../types';

const API_URL = 'https://bookit-app-q14q.onrender.com/api';


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('🌐 API Error Details:', {
      message: error.message,
      data: error.response?.data,
      status: error.response?.status,
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