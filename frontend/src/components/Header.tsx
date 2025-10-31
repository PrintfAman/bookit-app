import React from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onSearch?: () => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange, onSearch }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
            onClick={() => navigate('/')}
          >
            <img 
              src="/image.png" 
              alt="HD Logo" 
              className="h-12 w-auto object-contain"
            />
            <div className="flex flex-col leading-none">
              <span className="font-semibold text-lg text-gray-900 tracking-tight">
                highway
              </span>
              <span className="font-semibold text-lg text-gray-900 tracking-tight">
                delite
              </span>
            </div>
          </div>

          {onSearchChange && (
            <div className="flex items-center gap-4 flex-1 max-w-xl ml-8">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search experiences..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <button
                onClick={onSearch}
                className="bg-yellow-400 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
              >
                Search
              </button>
            </div>
          )}

          {!onSearchChange && (
            <button className="bg-yellow-400 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition">
              Search
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;