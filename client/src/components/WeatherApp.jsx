import React from 'react';
import { CurrentWeatherSidebar } from './CurrentWeatherSidebar';
import { WeatherTabs } from './WeatherTabs';
import { WeeklyForecast } from './WeeklyForecast';
import { TodaysHighlights } from './TodaysHighlights';
import { useWeather } from '../hooks/useWeather';
import { Skeleton } from './ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export const WeatherApp = () => {
  const { loading, error, activeTab, tempUnit, toggleTempUnit, weatherData } = useWeather();
  
  console.log("WeatherApp render - weatherData:", weatherData);

  console.log("WeatherApp complete state:", { loading, error, weatherData, activeTab, tempUnit });
  
  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto p-4 md:py-8 max-w-6xl">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 bg-gradient-to-br from-blue-50 to-blue-100 p-6 md:p-8 relative">
              <Skeleton className="h-10 w-full mb-8" />
              <Skeleton className="h-32 w-32 rounded-full mx-auto mb-6" />
              <Skeleton className="h-16 w-40 mx-auto mb-2" />
              <Skeleton className="h-8 w-60 mx-auto mb-8" />
              <Skeleton className="h-8 w-full mb-8" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
            <div className="w-full md:w-2/3 p-6 md:p-8">
              <div className="flex justify-between items-center mb-8">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-32" />
              </div>
              <div className="mb-8">
                <div className="grid grid-cols-7 gap-4">
                  {[...Array(7)].map((_, i) => (
                    <Skeleton key={i} className="h-28 w-full rounded-2xl" />
                  ))}
                </div>
              </div>
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full rounded-2xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto p-4 md:py-8 max-w-6xl flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-500 mb-4">
              <AlertCircle />
              <h2 className="text-xl font-bold">Error Loading Weather Data</h2>
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:py-8 max-w-6xl">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Sidebar: Current Weather */}
          <CurrentWeatherSidebar />
          
          {/* Main Content */}
          <div className="w-full md:w-2/3 p-6 md:p-8">
            {/* Header with Temperature Unit Toggle */}
            <div className="flex justify-between items-center mb-8">
              {/* Tabs */}
              <WeatherTabs />
              
              {/* Unit and User Profile */}
              <div className="flex items-center space-x-3">
                {/* Temperature Unit Toggle */}
                <button 
                  className={`${tempUnit === 'C' ? 'bg-gray-900 text-white' : 'text-gray-400'} w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors`}
                  onClick={toggleTempUnit}
                >
                  °C
                </button>
                
                {/* Fahrenheit Toggle */}
                <button 
                  className={`${tempUnit === 'F' ? 'bg-gray-900 text-white' : 'text-gray-400'} w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors`}
                  onClick={toggleTempUnit}
                >
                  °F
                </button>
                
                {/* User Profile */}
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                    alt="User profile" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
            </div>
            
            {/* Show Weekly Forecast or Today's Forecast based on active tab */}
            {activeTab === 'week' && <WeeklyForecast />}
            
            {/* Today's Highlights */}
            <TodaysHighlights />
          </div>
        </div>
      </div>
    </div>
  );
};
