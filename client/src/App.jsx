import React from 'react';
import { WeatherProvider } from './context/WeatherContext';
import { WeatherApp } from './components/WeatherApp';
import './index.css';

function App() {
  return (
    <WeatherProvider>
      <div className="min-h-screen bg-gray-100">
        <WeatherApp />
      </div>
    </WeatherProvider>
  );
}

export default App;