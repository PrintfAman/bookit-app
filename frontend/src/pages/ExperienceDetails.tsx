import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import DateSelector from '../components/DateSelector';
import TimeSlotSelector from '../components/TimeSlotSelector';
import PriceSummary from '../components/PriceSummary';
import { experienceAPI } from '../services/api';
import type { Experience, Slot } from '../types';

const ExperienceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const TAX_AMOUNT = 59;

  useEffect(() => {
    if (id) {
      fetchExperienceDetails(parseInt(id));
    }
  }, [id]);

  const fetchExperienceDetails = async (experienceId: number) => {
    try {
      setLoading(true);
      const data = await experienceAPI.getById(experienceId);
      setExperience(data);
      setSlots(data.slots || []);

      const dates = Array.from(new Set((data.slots || []).map((s: Slot) => formatDate(s.date))));
      setAvailableDates(dates);
      if (dates.length > 0) {
        setSelectedDate(dates[0]);
      }
    } catch (err: any) {
      setError('Failed to load experience details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'pm' : 'am';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const currentSlots = slots
    .filter((slot) => formatDate(slot.date) === selectedDate)
    .map((slot) => ({
      ...slot,
      time: formatTime(slot.time),
    }));

  const subtotal = experience ? experience.price * quantity : 0;
  const total = subtotal + TAX_AMOUNT;

  const handleConfirm = () => {
    if (!experience || !selectedSlot) return;
    
    navigate('/checkout', {
      state: {
        experience,
        slot: selectedSlot,
        quantity,
        subtotal,
        taxes: TAX_AMOUNT,
        total,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-yellow-400"></div>
          <p className="mt-4 text-gray-600">Loading details...</p>
        </div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-red-600 text-lg">{error || 'Experience not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-yellow-400 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-4 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Details</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <img
              src={experience.image_url}
              alt={experience.title}
              className="w-full h-96 object-cover rounded-lg mb-6"
            />
            
            <h1 className="text-3xl font-bold mb-2">{experience.title}</h1>
            <p className="text-gray-600 mb-8">{experience.description}</p>

            <DateSelector
              dates={availableDates}
              selectedDate={selectedDate}
              onSelectDate={(date) => {
                setSelectedDate(date);
                setSelectedSlot(null);
              }}
            />

            <TimeSlotSelector
              slots={currentSlots}
              selectedSlot={selectedSlot}
              onSelectSlot={setSelectedSlot}
            />

            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-bold mb-2">About</h3>
              <p className="text-sm text-gray-600">
                Scenic routes, trained guides, and safety briefing. Minimum age 10.
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <PriceSummary
              price={experience.price}
              quantity={quantity}
              subtotal={subtotal}
              taxes={TAX_AMOUNT}
              total={total}
              onQuantityChange={setQuantity}
              onConfirm={handleConfirm}
              confirmDisabled={!selectedSlot}
              confirmText="Confirm"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExperienceDetails;