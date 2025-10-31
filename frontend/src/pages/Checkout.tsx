import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import { bookingAPI, promoAPI } from '../services/api';
import type { Experience, Slot } from '../types';

interface LocationState {
  experience: Experience;
  slot: Slot;
  quantity: number;
  subtotal: number;
  taxes: number;
  total: number;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!state) {
    navigate('/');
    return null;
  }

  const { experience, slot, quantity, subtotal, taxes } = state;
  const finalTotal = subtotal + taxes - discount;

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms and safety policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    try {
      setLoading(true);
      setPromoError('');
      const result = await promoAPI.validate(promoCode, subtotal);

      if (result.valid && result.discount) {
        setDiscount(result.discount);
        setPromoApplied(true);
        setPromoError('');
      } else {
        setPromoError(result.error || 'Invalid promo code');
        setDiscount(0);
        setPromoApplied(false);
      }
    } catch (err: any) {
      setPromoError('Failed to validate promo code');
      setDiscount(0);
      setPromoApplied(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const bookingData = {
        experience_id: experience.id,
        slot_id: slot.id,
        customer_name: fullName,
        customer_email: email,
        quantity,
        subtotal,
        taxes,
        total: finalTotal,
        promo_code: promoApplied ? promoCode : undefined,
        discount: promoApplied ? discount : 0,
      };

      const result = await bookingAPI.create(bookingData);

      navigate('/confirmation', {
        state: {
          bookingReference: result.booking_reference,
          experience: experience.title,
        },
      });
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-4 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Checkout</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Full name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      setErrors({ ...errors, fullName: '' });
                    }}
                    placeholder="Your name"
                    className={`w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 ${
                      errors.fullName ? 'border-red-500 focus:ring-red-400' : 'focus:ring-yellow-400'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors({ ...errors, email: '' });
                    }}
                    placeholder="Your email"
                    className={`w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 ${
                      errors.email ? 'border-red-500 focus:ring-red-400' : 'focus:ring-yellow-400'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-2">Promo code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value.toUpperCase());
                      setPromoError('');
                    }}
                    placeholder="Promo code"
                    className="flex-1 px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    disabled={promoApplied}
                  />
                  <button
                    onClick={handleApplyPromo}
                    disabled={promoApplied || loading}
                    className={`px-6 py-2 rounded-lg font-semibold transition ${
                      promoApplied || loading
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {promoApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ Promo code applied! You saved ₹{discount}
                  </p>
                )}
                {promoError && <p className="text-sm text-red-500 mt-2">{promoError}</p>}
              </div>

              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    setErrors({ ...errors, terms: '' });
                  }}
                  className="w-4 h-4 mt-0.5"
                />
                <span>I agree to the terms and safety policy</span>
              </label>
              {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms}</p>}
            </div>
          </div>

          <div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-semibold">{experience.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span>{formatDate(slot.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time</span>
                  <span>{slot.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Qty</span>
                  <span>{quantity}</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes</span>
                  <span>₹{taxes}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg mb-6 pt-4 border-t">
                <span>Total</span>
                <span>₹{finalTotal}</span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  loading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-yellow-400 hover:bg-yellow-500'
                }`}
              >
                {loading ? 'Processing...' : 'Pay and Confirm'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;