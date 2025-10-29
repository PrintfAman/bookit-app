export interface Experience {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  image_url: string;
  created_at: Date;
}

export interface Slot {
  id: number;
  experience_id: number;
  date: string;
  time: string;
  available_spots: number;
  total_spots: number;
  created_at: Date;
}

export interface Booking {
  id: number;
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
  booking_reference: string;
  status: string;
  created_at: Date;
}

export interface PromoCode {
  id: number;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  is_active: boolean;
}