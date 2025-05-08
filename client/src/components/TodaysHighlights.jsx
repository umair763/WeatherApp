import React from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '../hooks/useWeather';
import { ArrowUp, Sun, Sunrise, Sunset } from 'lucide-react';

export const TodaysHighlights = () => {
  const { weatherData } = useWeather();
  
  if (!weatherData) return null;
  
  const current = weatherData.current;
  
  // Calculate UV index rotation (0-12 scale)
  const uvIndex = current.uv_index || 5;
  const uvRotation = (uvIndex / 12) * 180; // 180 degrees represents half circle
  
  // Mock data for sunrise/sunset (API might not provide)
  const sunriseTime = '6:35 AM';
  const sunriseChange = '+3 min';
  const sunsetTime = '5:42 PM';
  const sunsetChange = '-2m 32s';
  
  // Determine air quality status
  const airQuality = 105; // Mock value, API might not provide
  let airQualityStatus = 'Good';
  let airQualityEmoji = '😊';
  let airQualityColor = 'text-green-500';
  
  if (airQuality > 50 && airQuality <= 100) {
    airQualityStatus = 'Moderate';
    airQualityEmoji = '😐';
    airQualityColor = 'text-yellow-500';
  } else if (airQuality > 100) {
    airQualityStatus = 'Unhealthy';
    airQualityEmoji = '🤒';
    airQualityColor = 'text-red-500';
  }
  
  // Determine humidity status
  let humidityStatus = 'Normal';
  let humidityEmoji = '👍';
  
  if (current.humidity < 30) {
    humidityStatus = 'Low';
    humidityEmoji = '👎';
  } else if (current.humidity > 70) {
    humidityStatus = 'High';
    humidityEmoji = '💧';
  }
  
  // Determine visibility status
  const visibility = current.visibility;
  let visibilityStatus = 'Good';
  let visibilityEmoji = '👁️';
  
  if (visibility < 5) {
    visibilityStatus = 'Poor';
    visibilityEmoji = '👁️‍🗨️';
  } else if (visibility >= 5 && visibility < 10) {
    visibilityStatus = 'Average';
    visibilityEmoji = '😐';
  }
  
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
    <div>
      <h2 className="text-xl font-semibold mb-4">Today's Highlights</h2>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* UV Index */}
        <motion.div className="weather-card bg-white rounded-2xl p-5 shadow-sm" variants={item}>
          <p className="text-gray-500 text-sm mb-3">UV Index</p>
          <div className="flex items-end justify-between mb-2">
            <div className="relative">
              <div className="w-36 h-36 rounded-full" style={{
                background: 'conic-gradient(#FCD34D 0% 30%, #FBBF24 30% 60%, #F59E0B 60% 80%, #D97706 80% 100%)'
              }}></div>
              <div className="absolute inset-0 bg-white rounded-full scale-[0.85] flex items-center justify-center">
                <span className="text-5xl font-semibold">{uvIndex}</span>
              </div>
              {/* Indicator */}
              <motion.div 
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 h-16 w-1 bg-black rounded-full origin-bottom"
                style={{ rotate: `${uvRotation}deg` }}
                initial={{ rotate: 0 }}
                animate={{ rotate: `${uvRotation}deg` }}
                transition={{ duration: 1.5, type: "spring" }}
              >
                <div className="w-3 h-3 rounded-full bg-black absolute -left-1 -top-1"></div>
              </motion.div>
            </div>
            
            <div className="flex flex-col justify-between h-24">
              <div className="text-sm text-gray-500">0</div>
              <div className="text-sm text-gray-500">6</div>
              <div className="text-sm text-gray-500">12</div>
            </div>
          </div>
        </motion.div>
        
        {/* Wind Status */}
        <motion.div className="weather-card bg-white rounded-2xl p-5 shadow-sm" variants={item}>
          <p className="text-gray-500 text-sm mb-4">Wind Status</p>
          <h3 className="text-4xl font-semibold mb-2">
            {current.wind_speed}
            <span className="text-xl font-normal text-gray-500 ml-1">km/h</span>
          </h3>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
              <ArrowUp className="h-4 w-4 text-blue-600" style={{ 
                transform: `rotate(${current.wind_degree}deg)` 
              }} />
            </div>
            <span className="text-gray-600">{current.wind_dir}</span>
          </div>
        </motion.div>
        
        {/* Sunrise & Sunset */}
        <motion.div className="weather-card bg-white rounded-2xl p-5 shadow-sm" variants={item}>
          <p className="text-gray-500 text-sm mb-4">Sunrise & Sunset</p>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                <Sunrise className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <p className="text-lg font-medium">{sunriseTime}</p>
                <p className="text-xs text-gray-500">{sunriseChange}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                <Sunset className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <p className="text-lg font-medium">{sunsetTime}</p>
                <p className="text-xs text-gray-500">{sunsetChange}</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Humidity */}
        <motion.div className="weather-card bg-white rounded-2xl p-5 shadow-sm" variants={item}>
          <p className="text-gray-500 text-sm mb-4">Humidity</p>
          <h3 className="text-4xl font-semibold mb-3">
            {current.humidity}
            <span className="text-xl text-gray-500">%</span>
          </h3>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Status:</span>
            <span className="text-sm font-medium">{humidityStatus}</span>
            <span className="ml-1">{humidityEmoji}</span>
          </div>
        </motion.div>
        
        {/* Visibility */}
        <motion.div className="weather-card bg-white rounded-2xl p-5 shadow-sm" variants={item}>
          <p className="text-gray-500 text-sm mb-4">Visibility</p>
          <h3 className="text-4xl font-semibold mb-3">
            {visibility}
            <span className="text-xl text-gray-500 ml-1">km</span>
          </h3>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Status:</span>
            <span className="text-sm font-medium">{visibilityStatus}</span>
            <span className="ml-1">{visibilityEmoji}</span>
          </div>
        </motion.div>
        
        {/* Air Quality */}
        <motion.div className="weather-card bg-white rounded-2xl p-5 shadow-sm" variants={item}>
          <p className="text-gray-500 text-sm mb-4">Air Quality</p>
          <h3 className="text-4xl font-semibold mb-3">
            {airQuality}
          </h3>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Status:</span>
            <span className={`text-sm font-medium ${airQualityColor}`}>{airQualityStatus}</span>
            <span className="ml-1">{airQualityEmoji}</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
