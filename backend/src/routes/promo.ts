import express, { Router, Request, Response } from 'express';
import pool from '../config/database';

const router: Router = express.Router();

// Validate promo code
router.post('/validate', async (req: Request, res: Response) => {
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

export default router;