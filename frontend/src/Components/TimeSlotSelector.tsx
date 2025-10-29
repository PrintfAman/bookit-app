import React from 'react';
import type { Slot } from '../types';

interface TimeSlotSelectorProps {
  slots: Slot[];
  selectedSlot: Slot | null;
  onSelectSlot: (slot: Slot) => void;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  slots,
  selectedSlot,
  onSelectSlot,
}) => {
  return (
    <div className="mb-6">
      <h2 className="font-bold text-lg mb-4">Choose time</h2>
      <div className="flex gap-3 flex-wrap">
        {slots.map((slot) => {
          const isSoldOut = slot.available_spots === 0;
          const isLowAvailability = slot.available_spots > 0 && slot.available_spots <= 5;

          return (
            <button
              key={slot.id}
              onClick={() => !isSoldOut && onSelectSlot(slot)}
              disabled={isSoldOut}
              className={`px-6 py-2 rounded-lg relative transition ${
                isSoldOut
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : selectedSlot?.id === slot.id
                  ? 'bg-yellow-400 border-2 border-yellow-500 font-semibold'
                  : 'bg-white border border-gray-300 hover:border-gray-400'
              }`}
            >
              <div>{slot.time}</div>
              {isLowAvailability && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                  {slot.available_spots} left
                </span>
              )}
              {isSoldOut && (
                <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs px-2 py-0.5 rounded">
                  Sold out
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p className="text-sm text-gray-500 mt-2">All times are in IST (GMT +5:30)</p>
    </div>
  );
};

export default TimeSlotSelector;