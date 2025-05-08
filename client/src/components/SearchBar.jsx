import React, { useState } from 'react';
import { useWeather } from '../hooks/useWeather';
import { Search, MapPin } from 'lucide-react';

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { searchLocation, getCurrentLocation } = useWeather();
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchLocation(searchQuery);
    }
  };
  
  return (
    <form 
      className="flex items-center bg-white rounded-full p-2 mb-8 shadow-sm"
      onSubmit={handleSearch}
    >
      <Search className="h-5 w-5 text-gray-400 ml-2" />
      <input 
        type="text" 
        placeholder="Search for places ..." 
        className="w-full bg-transparent border-none focus:outline-none px-3 py-1 text-sm"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button 
        type="button" 
        className="bg-white rounded-full p-1 ml-1 shadow-sm transition-all hover:bg-gray-100"
        onClick={() => getCurrentLocation()}
        aria-label="Get current location"
      >
        <MapPin className="h-5 w-5 text-gray-500" />
      </button>
    </form>
  );
};
