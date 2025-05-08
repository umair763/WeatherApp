import React, { createContext, useState, useEffect } from 'react';
import { fetchWeatherByLocation, generateMockForecastData, getCurrentLocationCoords } from '../lib/api';
import { useToast } from '@/hooks/use-toast';

export const WeatherContext = createContext({
  loading: false,
  error: null,
  weatherData: null,
  forecast: [],
  location: 'New York',
  activeTab: 'week',
  tempUnit: 'C',
  setLocation: () => {},
  searchLocation: async () => {},
  getCurrentLocation: async () => {},
  setActiveTab: () => {},
  toggleTempUnit: () => {},
  convertTemp: (temp) => temp,
});

export const WeatherProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [location, setLocation] = useState('New York');
  const [activeTab, setActiveTab] = useState('week');
  const [tempUnit, setTempUnit] = useState('C');
  const { toast } = useToast();

  console.log("WeatherProvider state:", { weatherData, forecast, loading, error });

  const convertTemp = (temp) => {
    if (tempUnit === 'F') {
      return Math.round((temp * 9) / 5 + 32);
    }
    return Math.round(temp);
  };

  const toggleTempUnit = () => {
    setTempUnit(tempUnit === 'C' ? 'F' : 'C');
  };

  const fetchWeatherData = async (locationName) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching weather for:", locationName);

      const data = await fetchWeatherByLocation(locationName);
      console.log("Weather data received:", data);

      if (!data || !data.current) {
        throw new Error("Invalid or missing weather data from API");
      }

      setWeatherData(data);

      const forecastData = generateMockForecastData(data.current.temperature);
      console.log("Generated forecast data:", forecastData);
      setForecast(forecastData);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to fetch weather data. Please try again.');
      setLoading(false);
      toast({
        title: "Error",
        description: "Could not fetch weather data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const searchLocation = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    setLocation(searchQuery);
    await fetchWeatherData(searchQuery);
  };

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const position = await getCurrentLocationCoords();
      const { latitude, longitude } = position.coords;
      const locationQuery = `${latitude},${longitude}`;
      setLocation(`Current Location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`);
      await fetchWeatherData(locationQuery);
      toast({
        title: "Success",
        description: "Weather updated for your current location.",
      });
    } catch (err) {
      console.error('Error getting current location:', err);
      setError('Could not access your location. Please check your browser permissions.');
      setLoading(false);
      toast({
        title: "Error",
        description: "Could not access your location. Please check browser permissions.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchWeatherData(location);
  }, []);

  return (
    <WeatherContext.Provider
      value={{
        loading,
        error,
        weatherData,
        forecast,
        location,
        activeTab,
        tempUnit,
        setLocation,
        searchLocation,
        getCurrentLocation,
        setActiveTab,
        toggleTempUnit,
        convertTemp,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};
