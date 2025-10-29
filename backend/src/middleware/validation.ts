import { Request, Response, NextFunction } from 'express';

export const validateBooking = (req: Request, res: Response, next: NextFunction) => {
  const {
    experience_id,
    slot_id,
    customer_name,
    customer_email,
    quantity,
    subtotal,
    taxes,
    total
  } = req.body;

  // Check required fields
  if (!experience_id || !slot_id || !customer_name || !customer_email || !quantity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(customer_email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Validate quantity
  if (quantity < 1 || quantity > 10) {
    return res.status(400).json({ error: 'Quantity must be between 1 and 10' });
  }

  // Validate numeric values
  if (isNaN(subtotal) || isNaN(taxes) || isNaN(total)) {
    return res.status(400).json({ error: 'Invalid price values' });
  }

  next();
};

export const validatePromoCode = (req: Request, res: Response, next: NextFunction) => {
  const { code, subtotal } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Promo code is required' });
  }

  if (!subtotal || isNaN(subtotal) || subtotal <= 0) {
    return res.status(400).json({ error: 'Valid subtotal is required' });
  }

  next();
};