import express, { Router, Request, Response } from 'express';
import pool from '../config/database';

const router: Router = express.Router();

// Create booking
router.post('/', async (req: Request, res: Response) => {
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

  // Validation
  if (!experience_id || !slot_id || !customer_name || !customer_email || !quantity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Check slot availability
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

    // Update slot availability
    await client.query(
      'UPDATE slots SET available_spots = available_spots - $1 WHERE id = $2',
      [quantity, slot_id]
    );

    // Generate booking reference
    const bookingReference = 'HUF' + Math.random().toString(36).substring(2, 9).toUpperCase();

    // Create booking
    const result = await client.query(
      `INSERT INTO bookings 
       (experience_id, slot_id, customer_name, customer_email, quantity, 
        subtotal, taxes, total, promo_code, discount, booking_reference) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
       RETURNING *`,
      [
        experience_id,
        slot_id,
        customer_name,
        customer_email,
        quantity,
        subtotal,
        taxes,
        total,
        promo_code || null,
        discount,
        bookingReference
      ]
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
router.get('/:reference', async (req: Request, res: Response) => {
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

export default router;