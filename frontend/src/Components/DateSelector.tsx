import React from 'react';

interface DateSelectorProps {
  dates: string[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ dates, selectedDate, onSelectDate }) => {
  return (
    <div className="mb-6">
      <h2 className="font-bold text-lg mb-4">Choose date</h2>
      <div className="flex gap-3 flex-wrap">
        {dates.map((date) => (
          <button
            key={date}
            onClick={() => onSelectDate(date)}
            className={`px-6 py-2 rounded-lg border transition ${
              selectedDate === date
                ? 'bg-yellow-400 border-yellow-400 font-semibold'
                : 'bg-white border-gray-300 hover:border-gray-400'
            }`}
          >
            {date}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DateSelector;