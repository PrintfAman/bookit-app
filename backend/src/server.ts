import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database';


dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ============================================
// EXPERIENCES ROUTES
// ============================================

// Get all experiences
app.get('/api/experiences', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM experiences ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
});

// Get experience by ID with slots
app.get('/api/experiences/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const experienceResult = await pool.query('SELECT * FROM experiences WHERE id = $1', [id]);
    
    if (experienceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    
    const slotsResult = await pool.query(
      'SELECT id, date, time, available_spots, total_spots FROM slots WHERE experience_id = $1 ORDER BY date, time',
      [id]
    );
    
    res.json({
      ...experienceResult.rows[0],
      slots: slotsResult.rows
    });
  } catch (error) {
    console.error('Error fetching experience:', error);
    res.status(500).json({ error: 'Failed to fetch experience details' });
  }
});

// ============================================
// BOOKINGS ROUTES
// ============================================

// Create booking
app.post('/api/bookings', async (req: Request, res: Response) => {
  const {
    experience_id,
    slot_id,
    customer_name,
    customer_email,
    quantity,
    subtotal,
    taxes,
    total,
    promo_code,
    discount = 0
  } = req.body;

  if (!experience_id || !slot_id || !customer_name || !customer_email || !quantity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const slotCheck = await client.query(
      'SELECT available_spots FROM slots WHERE id = $1 FOR UPDATE',
      [slot_id]
    );

    if (slotCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Slot not found' });
    }

    const availableSpots = slotCheck.rows[0].available_spots;

    if (availableSpots < quantity) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        error: 'Not enough spots available',
        available: availableSpots
      });
    }

    await client.query(
      'UPDATE slots SET available_spots = available_spots - $1 WHERE id = $2',
      [quantity, slot_id]
    );

    const bookingReference = 'HUF' + Math.random().toString(36).substring(2, 9).toUpperCase();

    const result = await client.query(
      `INSERT INTO bookings 
       (experience_id, slot_id, customer_name, customer_email, quantity, 
        subtotal, taxes, total, promo_code, discount, booking_reference) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
       RETURNING *`,
      [experience_id, slot_id, customer_name, customer_email, quantity,
       subtotal, taxes, total, promo_code || null, discount, bookingReference]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Booking created successfully',
      booking: result.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  } finally {
    client.release();
  }
});

// Get booking by reference
app.get('/api/bookings/:reference', async (req: Request, res: Response) => {
  const { reference } = req.params;

  try {
    const result = await pool.query(
      `SELECT b.*, e.title as experience_title, s.date, s.time 
       FROM bookings b
       JOIN experiences e ON b.experience_id = e.id
       JOIN slots s ON b.slot_id = s.id
       WHERE b.booking_reference = $1`,
      [reference]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// ============================================
// PROMO CODE ROUTES
// ============================================

// Validate promo code
app.post('/api/promo/validate', async (req: Request, res: Response) => {
  const { code, subtotal } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Promo code is required' });
  }

  if (!subtotal || isNaN(subtotal) || subtotal <= 0) {
    return res.status(400).json({ error: 'Valid subtotal is required' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM promo_codes WHERE code = $1 AND is_active = true',
      [code.toUpperCase()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Invalid or inactive promo code',
        valid: false
      });
    }

    const promo = result.rows[0];
    let discount = 0;

    if (promo.discount_type === 'percentage') {
      discount = (subtotal * promo.discount_value) / 100;
    } else if (promo.discount_type === 'fixed') {
      discount = promo.discount_value;
    }

    discount = Math.min(discount, subtotal);

    res.json({
      valid: true,
      code: promo.code,
      discount_type: promo.discount_type,
      discount_value: promo.discount_value,
      discount: parseFloat(discount.toFixed(2))
    });
  } catch (error) {
    console.error('Error validating promo code:', error);
    res.status(500).json({ error: 'Failed to validate promo code' });
  }
});

// ============================================
// OTHER ROUTES
// ============================================

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'BookIt API Server',
    version: '1.0.0'
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Failed to connect to database', err);
  } else {
    console.log('✅ Connected to PostgreSQL database');
  }
});