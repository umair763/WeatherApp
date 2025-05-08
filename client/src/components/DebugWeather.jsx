import React from 'react';
import { useWeather } from '../hooks/useWeather';

export const DebugWeather = () => {
  const { 
    loading, 
    error, 
    weatherData, 
    forecast, 
    location,
    activeTab
  } = useWeather();

  return (
    <div className="bg-white p-4 m-4 rounded shadow-md">
      <h2 className="text-xl font-bold mb-3">Debug Weather Data</h2>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-gray-100 p-2 rounded">
          <strong>Loading:</strong> {loading ? 'True' : 'False'}
        </div>
        
        <div className="bg-gray-100 p-2 rounded">
          <strong>Error:</strong> {error ? error : 'None'}
        </div>
        
        <div className="bg-gray-100 p-2 rounded">
          <strong>Location:</strong> {location}
        </div>
        
        <div className="bg-gray-100 p-2 rounded">
          <strong>Active Tab:</strong> {activeTab}
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="font-bold">Weather Data:</h3>
        {weatherData ? (
          <pre className="bg-gray-100 p-2 rounded mt-2 text-xs overflow-auto max-h-40">
            {JSON.stringify(weatherData, null, 2)}
          </pre>
        ) : (
          <p className="text-red-500">No weather data available</p>
        )}
      </div>
      
      <div className="mt-4">
        <h3 className="font-bold">Forecast:</h3>
        {forecast && forecast.length > 0 ? (
          <pre className="bg-gray-100 p-2 rounded mt-2 text-xs overflow-auto max-h-40">
            {JSON.stringify(forecast, null, 2)}
          </pre>
        ) : (
          <p className="text-red-500">No forecast data available</p>
        )}
      </div>
    </div>
  );
};