export interface Experience {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  image_url: string;
  slots?: Slot[];
}

export interface Slot {
  id: number;
  experience_id?: number;
  date: string;
  time: string;
  available_spots: number;
  total_spots: number;
}

export interface BookingRequest {
  experience_id: number;
  slot_id: number;
  customer_name: string;
  customer_email: string;
  quantity: number;
  subtotal: number;
  taxes: number;
  total: number;
  promo_code?: string;
  discount?: number;
}

export interface Booking {
  id: number;
  booking_reference: string;
  experience_id: number;
  slot_id: number;
  customer_name: string;
  customer_email: string;
  quantity: number;
  subtotal: number;
  taxes: number;
  total: number;
  promo_code?: string;
  discount: number;
  status: string;
  created_at: string;
}

export interface PromoCodeResponse {
  valid: boolean;
  code?: string;
  discount_type?: 'percentage' | 'fixed';
  discount_value?: number;
  discount?: number;
  error?: string;
}