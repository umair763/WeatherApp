import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Cloud, CloudRain, CloudSnow, CloudFog, CloudLightning } from 'lucide-react';

export const WeatherIcon = ({ 
  condition, 
  className = "", 
  size = "md", 
  animated = true 
}) => {
  // Determine size class
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  };
  
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  
  // Animation variants
  const sunVariants = {
    animate: animated ? { 
      rotate: [0, 180],
      transition: { 
        repeat: Infinity,
        duration: 20,
        ease: "linear"
      }
    } : {}
  };
  
  const cloudVariants = {
    animate: animated ? { 
      x: [0, 5, 0, -5, 0],
      transition: { 
        repeat: Infinity,
        duration: 5,
        ease: "easeInOut" 
      }
    } : {}
  };
  
  const rainVariants = {
    animate: animated ? { 
      y: [0, 5],
      opacity: [1, 0.7],
      transition: { 
        repeat: Infinity,
        duration: 1,
        ease: "easeIn" 
      }
    } : {}
  };
  
  const snowVariants = {
    animate: animated ? { 
      rotate: [0, 180],
      y: [0, 5],
      transition: { 
        repeat: Infinity,
        duration: 3,
        ease: "linear" 
      }
    } : {}
  };
  
  const lightningVariants = {
    animate: animated ? { 
      opacity: [0, 1, 0.5, 0],
      transition: { 
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1.5,
        ease: "easeOut" 
      }
    } : {}
  };
  
  // Handle common weather descriptions and return appropriate icon
  const conditionLower = condition ? condition.toLowerCase() : '';
  
  if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
    return (
      <motion.div 
        className={`text-yellow-400 ${sizeClass} ${className}`}
        variants={sunVariants}
        animate="animate"
      >
        <Sun className="w-full h-full" />
      </motion.div>
    );
  }
  
  if (conditionLower.includes('partly cloudy') || (conditionLower.includes('cloud') && (conditionLower.includes('partial') || conditionLower.includes('partly') || conditionLower.includes('scattered')))) {
    return (
      <motion.div 
        className={`text-gray-400 ${sizeClass} ${className}`}
        variants={cloudVariants}
        animate="animate"
      >
        <div className="relative">
          <Cloud className="w-full h-full" />
          <motion.div 
            className="absolute -top-1/4 -right-1/4 text-yellow-400" 
            style={{ width: '60%', height: '60%' }}
            variants={sunVariants}
            animate="animate"
          >
            <Sun className="w-full h-full" />
          </motion.div>
        </div>
      </motion.div>
    );
  }
  
  if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
    return (
      <motion.div 
        className={`text-gray-400 ${sizeClass} ${className}`}
        variants={cloudVariants}
        animate="animate"
      >
        <Cloud className="w-full h-full" />
      </motion.div>
    );
  }
  
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle') || conditionLower.includes('shower')) {
    return (
      <motion.div 
        className={`text-blue-500 ${sizeClass} ${className}`}
      >
        <div className="relative">
          <motion.div
            variants={cloudVariants}
            animate="animate"
          >
            <Cloud className="w-full h-full text-gray-400" />
          </motion.div>
          <motion.div 
            className="absolute bottom-0 left-1/4"
            variants={rainVariants}
            animate="animate"
          >
            <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
          </motion.div>
          <motion.div 
            className="absolute bottom-0 left-1/2"
            variants={rainVariants}
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          </motion.div>
          <motion.div 
            className="absolute bottom-0 left-3/4"
            variants={rainVariants}
            animate="animate"
            transition={{ delay: 0.4 }}
          >
            <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
          </motion.div>
        </div>
      </motion.div>
    );
  }
  
  if (conditionLower.includes('snow') || conditionLower.includes('blizzard') || conditionLower.includes('ice')) {
    return (
      <motion.div 
        className={`text-blue-100 ${sizeClass} ${className}`}
      >
        <div className="relative">
          <motion.div
            variants={cloudVariants}
            animate="animate"
          >
            <Cloud className="w-full h-full text-gray-400" />
          </motion.div>
          <motion.div 
            className="absolute bottom-0 left-1/4"
            variants={snowVariants}
            animate="animate"
          >
            <div className="w-2 h-2 bg-blue-100 rounded-full"></div>
          </motion.div>
          <motion.div 
            className="absolute bottom-0 left-1/2"
            variants={snowVariants}
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            <div className="w-2 h-2 bg-blue-100 rounded-full"></div>
          </motion.div>
          <motion.div 
            className="absolute bottom-0 left-3/4"
            variants={snowVariants}
            animate="animate"
            transition={{ delay: 0.4 }}
          >
            <div className="w-2 h-2 bg-blue-100 rounded-full"></div>
          </motion.div>
        </div>
      </motion.div>
    );
  }
  
  if (conditionLower.includes('fog') || conditionLower.includes('mist') || conditionLower.includes('haz')) {
    return (
      <motion.div 
        className={`text-gray-300 ${sizeClass} ${className}`}
        variants={cloudVariants}
        animate="animate"
      >
        <CloudFog className="w-full h-full" />
      </motion.div>
    );
  }
  
  if (conditionLower.includes('thunder') || conditionLower.includes('lightning') || conditionLower.includes('storm')) {
    return (
      <motion.div 
        className={`text-yellow-500 ${sizeClass} ${className}`}
      >
        <div className="relative">
          <motion.div
            variants={cloudVariants}
            animate="animate"
          >
            <Cloud className="w-full h-full text-gray-600" />
          </motion.div>
          <motion.div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
            variants={lightningVariants}
            animate="animate"
          >
            <CloudLightning className="w-2/3 h-2/3" />
          </motion.div>
        </div>
      </motion.div>
    );
  }
  
  // Default icon for unknown conditions
  return (
    <motion.div 
      className={`text-yellow-400 ${sizeClass} ${className}`}
      variants={sunVariants}
      animate="animate"
    >
      <Sun className="w-full h-full" />
    </motion.div>
  );
};