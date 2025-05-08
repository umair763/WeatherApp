import axios from 'axios';

export const fetchWeatherByLocation = async (location) => {
  // Geocode
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}`
  );
  const geoData = await geoRes.json();
  if (!geoData.results || !geoData.results[0]) throw new Error("Location not found");
  const { latitude, longitude, name, country } = geoData.results[0];

  // Current + hourly + daily (for week/month)
  const weatherRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto`
  );
  const weather = await weatherRes.json();

  return {
    ...weather,
    location: { name, country, latitude, longitude },
  };
};

export const fetchForecastByLocation = async (location) => {
  const response = await axios.get('/api/forecast', {
    params: { location }
  });
  return response.data;
};

export const fetchHistoricalWeather = async (location) => {
  // For historical weather, you might need a specific date range
  const response = await axios.get('/api/historical', {
    params: { location }
  });
  return response.data;
};

export const getCurrentLocationCoords = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
};

export const timestampToDay = (timestamp) => {
  const date = new Date(timestamp);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
};

export const generateMockForecastData = (currentTemp) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Random temperature variation
    const tempVariation = Math.floor(Math.random() * 10) - 5;
    
    // Random conditions
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Snowy'];
    const conditionIndex = Math.floor(Math.random() * conditions.length);
    const icons = ['sunny', 'partly-cloudy', 'cloudy', 'rainy', 'snowy'];
    
    return {
      day: days[date.getDay()],
      date: date.toISOString().split('T')[0],
      temp: Math.round(currentTemp + tempVariation),
      condition: conditions[conditionIndex],
      icon: icons[conditionIndex],
      rainChance: Math.floor(Math.random() * 100)
    };
  });
};