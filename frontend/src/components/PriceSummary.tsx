import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface PriceSummaryProps {
  price: number;
  quantity: number;
  subtotal: number;
  taxes: number;
  total: number;
  discount?: number;
  onQuantityChange: (newQuantity: number) => void;
  onConfirm?: () => void;
  confirmDisabled?: boolean;
  confirmText?: string;
}

const PriceSummary: React.FC<PriceSummaryProps> = ({
  price,
  quantity,
  subtotal,
  taxes,
  total,
  discount = 0,
  onQuantityChange,
  onConfirm,
  confirmDisabled = false,
  confirmText = 'Confirm',
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
      <div className="flex justify-between mb-4">
        <span className="text-gray-600">Starts at</span>
        <span className="font-bold text-xl">₹{price}</span>
      </div>

      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <span className="text-gray-600">Quantity</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100 transition"
            disabled={quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="font-semibold w-8 text-center">{quantity}</span>
          <button
            onClick={() => onQuantityChange(quantity + 1)}
            className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100 transition"
            disabled={quantity >= 10}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount</span>
            <span>-₹{discount}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Taxes</span>
          <span>₹{taxes}</span>
        </div>
      </div>

      <div className="flex justify-between font-bold text-lg mb-6 pt-4 border-t">
        <span>Total</span>
        <span>₹{total}</span>
      </div>

      {onConfirm && (
        <button
          onClick={onConfirm}
          disabled={confirmDisabled}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            confirmDisabled
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-yellow-400 hover:bg-yellow-500'
          }`}
        >
          {confirmText}
        </button>
      )}
    </div>
  );
};

export default PriceSummary;  