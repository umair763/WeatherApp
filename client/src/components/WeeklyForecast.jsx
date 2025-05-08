import React from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '../hooks/useWeather';
import { WeatherIcons } from './WeatherIcons';

export const WeeklyForecast = () => {
  const { forecast, convertTemp } = useWeather();
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  return (
    <div className="mb-8">
      <motion.div 
        className="grid grid-cols-7 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {forecast.map((day, index) => (
          <motion.div 
            key={index}
            className="weather-card flex flex-col items-center bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
            variants={item}
          >
            <p className="text-sm text-gray-600 mb-2">{day.day}</p>
            <div className="relative">
              <WeatherIcons 
                condition={day.condition.toLowerCase()}
                isDay={true}
                className="w-10 h-10 object-contain mb-2"
              />
              
              {/* Rain Animation for rainy days */}
              {day.condition.toLowerCase().includes('rain') && (
                <div className="absolute -right-1 bottom-2">
                  <div className="flex space-x-0.5">
                    <div className="h-4 w-0.5 bg-blue-500 rounded-full"></div>
                    <div className="h-3 w-0.5 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
            <p className="text-sm font-medium">{convertTemp(day.temp)}°</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
