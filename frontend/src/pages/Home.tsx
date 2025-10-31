import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ExperienceCard from '../components/ExperienceCard';
import { experienceAPI } from '../services/api';
import type { Experience } from '../types';

const Home: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ✅ Single fetch function
  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const data = await experienceAPI.getAll();
      console.log('Fetched experiences:', data);
      setExperiences(data);
      setFilteredExperiences(data);
    } catch (err: any) {
      console.error('Error fetching experiences:', err);
      setError('Failed to load experiences. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Call it once on mount
  useEffect(() => {
    fetchExperiences();
  }, []);

  // ✅ Filter logic
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredExperiences(experiences);
    } else {
      const filtered = experiences.filter(
        (exp) =>
          exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exp.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredExperiences(filtered);
    }
  }, [searchQuery, experiences]);

  const handleViewDetails = (experience: Experience) => {
    navigate(`/experience/${experience.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={() => {}}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-yellow-400"></div>
            <p className="mt-4 text-gray-600">Loading experiences...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!loading && !error && filteredExperiences.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No experiences found.</p>
          </div>
        )}

        {!loading && !error && filteredExperiences.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredExperiences.map((exp) => (
              <ExperienceCard
                key={exp.id}
                experience={exp}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
