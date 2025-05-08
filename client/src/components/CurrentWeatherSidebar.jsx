import React from 'react';
import { motion } from 'framer-motion';
import { SearchBar } from './SearchBar';
import { useWeather } from '../hooks/useWeather';
import { WeatherIcons } from './WeatherIcons';

export const CurrentWeatherSidebar = () => {
  const { weatherData, convertTemp, tempUnit } = useWeather();
  
  if (!weatherData) {
    console.log("CurrentWeatherSidebar: No weather data");
    return (
      <div className="w-full md:w-1/3 bg-gradient-to-br from-blue-50 to-blue-100 p-6 md:p-8 relative">
        <SearchBar />
        <div className="text-center p-4">
          <p className="text-gray-500">No weather data available</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 text-white rounded px-4 py-2"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }
  
  console.log("CurrentWeatherSidebar: Rendering with data", weatherData);
  
  const current = weatherData.current;
  const location = weatherData.location;
  
  // Format date and time
  const datetime = new Date(location.localtime);
  const day = datetime.toLocaleDateString('en-US', { weekday: 'long' });
  const time = datetime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  
  // Determine if it's rainy
  const isRainy = current.precip > 0 || 
    current.weather_descriptions.some(desc => 
      desc.toLowerCase().includes('rain') || 
      desc.toLowerCase().includes('drizzle')
    );
  
  // Rain probability as percentage
  const rainProbability = Math.min(Math.round(current.precip * 33), 100); // Simplified calculation
  
  // Get weather condition
  const weatherCondition = current.weather_descriptions[0] || 'Unknown';
  
  // Get rain indicator count (1-4 based on probability)
  const rainIndicatorCount = Math.max(1, Math.min(4, Math.ceil(rainProbability / 25)));
  
  return (
    <div className="w-full md:w-1/3 bg-gradient-to-br from-blue-50 to-blue-100 p-6 md:p-8 relative">
      {/* Search Bar */}
      <SearchBar />
      
      {/* Weather Icon */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <WeatherIcons 
            condition={weatherCondition.toLowerCase()} 
            isDay={current.is_day === 'yes'} 
            className="w-32 h-32"
          />
          
          {/* Animated Rain Lines (conditionally rendered) */}
          {isRainy && (
            <div className="absolute bottom-0 right-0">
              <div className="flex space-x-1">
                {[...Array(4)].map((_, i) => (
                  <motion.div 
                    key={i}
                    className="h-10 w-1 bg-blue-500 rounded-full"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 20, opacity: [0, 1, 0] }}
                    transition={{ 
                      duration: 1.5 + (i * 0.2),
                      repeat: Infinity,
                      delay: i * 0.3
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Temperature and Day */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h1 className="text-7xl font-medium mb-2">
          {convertTemp(current.temperature)}°{tempUnit}
        </h1>
        <p className="text-lg mb-1">
          {day}, <span className="text-gray-500">{time}</span>
        </p>
        <div className="flex items-center justify-center text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          <span>{weatherCondition}</span>
        </div>
      </motion.div>
      
      {/* Weather Details */}
      {isRainy && (
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <div className="w-5 h-5 mr-2 flex-shrink-0">
              <div className="flex">
                {[...Array(rainIndicatorCount)].map((_, i) => (
                  <div key={i} className="h-5 w-1 bg-blue-500 rounded-full mx-px"></div>
                ))}
              </div>
            </div>
            <span>Rain - {rainProbability}%</span>
          </div>
        </motion.div>
      )}
      
      {/* Location */}
      <motion.div 
        className="mt-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="rounded-xl overflow-hidden h-20 relative">
          <img 
            src={`https://source.unsplash.com/300x150/?${location.name},city`} 
            className="w-full h-full object-cover" 
            alt={`${location.name} view`} 
          />
          <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center">
            <p className="text-white font-medium">
              {location.name}, {location.country}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
