import React from 'react';
import { useWeather } from '../hooks/useWeather';
import { motion } from 'framer-motion';

export const WeatherTabs = () => {
  const { activeTab, setActiveTab } = useWeather();
  
  return (
    <div className="flex space-x-4">
      <TabButton 
        label="Today" 
        isActive={activeTab === 'today'} 
        onClick={() => setActiveTab('today')} 
      />
      <TabButton 
        label="Week" 
        isActive={activeTab === 'week'} 
        onClick={() => setActiveTab('week')} 
      />
    </div>
  );
};

const TabButton = ({ label, isActive, onClick }) => {
  return (
    <button 
      className={`pb-1 border-b-2 ${isActive 
        ? 'text-black border-blue-500 font-medium' 
        : 'text-gray-500 border-transparent'
      } transition-all`}
      onClick={onClick}
    >
      {label}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-blue-500"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  );
};
