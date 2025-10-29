import React, { useState } from 'react';
import type { Experience } from '../Types';

interface ExperienceCardProps {
  experience: Experience;
  onViewDetails: (experience: Experience) => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience, onViewDetails }) => {
  const [imageError, setImageError] = useState(false);
  
  // Fallback placeholder image
  const placeholderImage = 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Experience';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={imageError ? placeholderImage : experience.image_url}
          alt={experience.title}
          className="w-full h-48 object-cover"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-900">{experience.title}</h3>
          <span className="text-sm text-gray-600 whitespace-nowrap ml-2">
            {experience.location}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {experience.description}
        </p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs text-gray-500">From </span>
            <span className="font-bold text-lg text-gray-900">₹{experience.price}</span>
          </div>
          <button
            onClick={() => onViewDetails(experience)}
            className="bg-yellow-400 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-500 transition"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;