-- Create database
CREATE DATABASE bookit_db;

-- Connect to database
\c bookit_db;

-- Experiences table
CREATE TABLE experiences (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Slots table
CREATE TABLE slots (
  id SERIAL PRIMARY KEY,
  experience_id INTEGER REFERENCES experiences(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  available_spots INTEGER NOT NULL,
  total_spots INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_slot UNIQUE (experience_id, date, time)
);

-- Bookings table
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  experience_id INTEGER REFERENCES experiences(id),
  slot_id INTEGER REFERENCES slots(id),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  taxes DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  promo_code VARCHAR(50),
  discount DECIMAL(10, 2) DEFAULT 0,
  booking_reference VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Promo codes table
CREATE TABLE promo_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) NOT NULL, -- 'percentage' or 'fixed'
  discount_value DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample experiences
INSERT INTO experiences (title, description, location, price, image_url) VALUES
('Kayaking', 'Curated small-group experience. Certified guide. Safety first with gear included. Helmet and Life jackets along with an expert will accompany in kayaking.', 'Udupi', 999.00, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'),
('Nandi Hills Sunrise', 'Curated small-group experience. Certified guide. Safety first with gear included.', 'Bangalore', 899.00, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'),
('Coffee Trail', 'Curated small-group experience. Certified guide. Safety first with gear included.', 'Coorg', 1299.00, 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800'),
('Kayaking Adventure', 'Curated small-group experience. Certified guide. Safety first with gear included.', 'Udupi, Karnataka', 999.00, 'https://images.unsplash.com/photo-1544551763-92ef2489b502?w=800'),
('Boat Cruise', 'Curated small-group experience. Certified guide. Safety first with gear included.', 'Sunderbans', 999.00, 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800'),
('Bunjee Jumping', 'Curated small-group experience. Certified guide. Safety first with gear included.', 'Manali', 999.00, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800');

-- Insert sample slots for experience 1 (Kayaking)
INSERT INTO slots (experience_id, date, time, available_spots, total_spots) VALUES
(1, '2025-10-22', '07:00:00', 4, 10),
(1, '2025-10-22', '09:00:00', 5, 10),
(1, '2025-10-22', '11:00:00', 5, 10),
(1, '2025-10-22', '13:00:00', 0, 10),
(1, '2025-10-23', '07:00:00', 8, 10),
(1, '2025-10-23', '09:00:00', 6, 10),
(1, '2025-10-24', '07:00:00', 10, 10),
(1, '2025-10-24', '09:00:00', 10, 10),
(1, '2025-10-25', '07:00:00', 7, 10),
(1, '2025-10-26', '07:00:00', 9, 10);

-- Insert sample promo codes
INSERT INTO promo_codes (code, discount_type, discount_value, is_active) VALUES
('SAVE10', 'percentage', 10.00, true),
('FLAT100', 'fixed', 100.00, true),
('WELCOME20', 'percentage', 20.00, true);