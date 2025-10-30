export interface Experience {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  location: string;
}

export interface BookingRequest {
  experienceId: number;
  name: string;
  email: string;
  date: string;
  time: string;
  promoCode?: string;
}

export interface Booking {
  id: number;
  reference: string;
  experienceId: number;
  name: string;
  email: string;
  date: string;
  time: string;
  totalAmount: number;
}

export interface PromoCodeResponse {
  valid: boolean;
  discount?: number;
  error?: string;
}
