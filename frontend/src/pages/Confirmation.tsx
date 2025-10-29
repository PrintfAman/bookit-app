import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import Header from '../Components/Header';

interface LocationState {
  bookingReference: string;
  experience: string;
}

const Confirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  if (!state) {
    navigate('/');
    return null;
  }

  const { bookingReference } = state;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-green-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <Check className="w-12 h-12 text-white" />
        </div>

        <h1 className="text-4xl font-bold mb-2">Booking Confirmed</h1>
        <p className="text-gray-600 mb-2">Thank you for your booking!</p>
        <p className="text-gray-800 font-semibold mb-8">
          Ref ID: <span className="text-yellow-600">{bookingReference}</span>
        </p>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-md mx-auto">
          <p className="text-sm text-gray-600 mb-2">
            A confirmation email has been sent to your registered email address.
          </p>
          <p className="text-sm text-gray-600">
            Please keep your reference ID for future correspondence.
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="bg-gray-200 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          Back to Home
        </button>
      </main>
    </div>
  );
};

export default Confirmation;