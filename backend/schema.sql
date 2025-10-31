-- Drop existing tables
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS slots CASCADE;
DROP TABLE IF EXISTS experiences CASCADE;
DROP TABLE IF EXISTS promo_codes CASCADE;

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
  discount_type VARCHAR(20) NOT NULL,
  discount_value DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample experiences
INSERT INTO experiences (title, description, location, price, image_url) VALUES
('Kayaking', 'Curated small-group experience. Certified guide. Safety first with gear included.', 'Udupi', 999.00, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80'),
('Nandi Hills Sunrise', 'Curated small-group experience. Certified guide. Safety first with gear included.', 'Bangalore', 899.00, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'),
('Coffee Trail', 'Curated small-group experience. Certified guide. Safety first with gear included.', 'Coorg', 1299.00, 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80'),
('Kayaking Adventure', 'Curated small-group experience. Certified guide. Safety first with gear included.', 'Udupi, Karnataka', 999.00, 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80'),
('Boat Cruise', 'Curated small-group experience. Certified guide. Safety first with gear included.', 'Sunderbans', 999.00, 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80'),
('Bunjee Jumping', 'Curated small-group experience. Certified guide. Safety first with gear included.', 'Manali', 999.00, 'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?w=800&q=80'),
('Paragliding', 'Curated small-group experience. Certified guide. Safety first with gear included.', 'Bir Billing', 2999.00, 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80'),
('Camping', 'Curated small-group experience. Certified guide. Safety first with gear included.', 'Rishikesh', 1499.00, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80');

-- Insert slots for all experiences
INSERT INTO slots (experience_id, date, time, available_spots, total_spots) VALUES
-- Experience 1 slots
(1, '2025-11-22', '07:00:00', 4, 10),
(1, '2025-11-22', '09:00:00', 5, 10),
(1, '2025-11-23', '07:00:00', 8, 10),
(1, '2025-11-23', '09:00:00', 6, 10),
-- Experience 2 slots
(2, '2025-11-22', '05:00:00', 6, 10),
(2, '2025-11-22', '06:00:00', 8, 10),
(2, '2025-11-23', '05:00:00', 10, 10),
-- Experience 3 slots
(3, '2025-11-22', '08:00:00', 5, 10),
(3, '2025-11-22', '10:00:00', 7, 10),
(3, '2025-11-23', '08:00:00', 10, 10),
-- Experience 4 slots
(4, '2025-11-22', '07:00:00', 4, 10),
(4, '2025-11-22', '09:00:00', 6, 10),
(4, '2025-11-23', '07:00:00', 10, 10),
-- Experience 5 slots
(5, '2025-11-22', '11:00:00', 8, 10),
(5, '2025-11-22', '14:00:00', 7, 10),
(5, '2025-11-23', '11:00:00', 10, 10),
-- Experience 6 slots
(6, '2025-11-22', '10:00:00', 5, 10),
(6, '2025-11-22', '12:00:00', 6, 10),
(6, '2025-11-23', '10:00:00', 10, 10),
-- Experience 7 slots
(7, '2025-11-22', '09:00:00', 6, 10),
(7, '2025-11-22', '11:00:00', 8, 10),
(7, '2025-11-23', '09:00:00', 10, 10),
-- Experience 8 slots
(8, '2025-11-22', '16:00:00', 5, 10),
(8, '2025-11-22', '18:00:00', 9, 10),
(8, '2025-11-23', '16:00:00', 10, 10);

-- Insert promo codes
INSERT INTO promo_codes (code, discount_type, discount_value, is_active) VALUES
('SAVE10', 'percentage', 10.00, true),
('FLAT100', 'fixed', 100.00, true),
('WELCOME20', 'percentage', 20.00, true);