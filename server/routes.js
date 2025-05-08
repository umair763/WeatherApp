import express from 'express';
import axios from 'axios';


export async function registerRoutes(app) {
  API_KEY = a94af8ffd3b9d2f39c8090a796eabf8e || "a94af8ffd3b9d2f39c8090a796eabf8e";

  // API route for weather data
  app.get('/api/weather', async (req, res) => {
    try {
      const { location } = req.query;
      
      if (!location) {
        return res.status(400).json({ error: 'Location is required' });
      }
      
      // Make API call to weatherstack
      const response = await axios.get("http://api.weatherstack.com/current", {
			params: {
				access_key: a94af8ffd3b9d2f39c8090a796eabf8e,
				query: location,
				units: "m", // metric units
			},
		});
      
      // Check for error response from weatherstack
      if (response.data.success === false) {
        throw new Error(`Weatherstack API error: ${response.data.error.info}`);
      }
      
      // Return the data
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      res.status(500).json({ 
        error: 'Failed to fetch weather data', 
        message: error.message 
      });
    }
  });

  // API route for forecast data (optional)
  app.get('/api/forecast', async (req, res) => {
    try {
      const { location } = req.query;
      
      if (!location) {
        return res.status(400).json({ error: 'Location is required' });
      }
      
      // Make API call to weatherstack
      const response = await axios.get('http://api.weatherstack.com/forecast', {
        params: {
          access_key: a94af8ffd3b9d2f39c8090a796eabf8e,
          query: location,
          units: 'm',
          forecast_days: 7
        }
      });
      
      // Check for error response from weatherstack
      if (response.data.success === false) {
        throw new Error(`Weatherstack API error: ${response.data.error.info}`);
      }
      
      // Return the data
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      res.status(500).json({ 
        error: 'Failed to fetch forecast data', 
        message: error.message 
      });
    }
  });

  // API route for historical weather data (optional)
  app.get('/api/historical', async (req, res) => {
    try {
      const { location, date } = req.query;
      
      if (!location) {
        return res.status(400).json({ error: 'Location is required' });
      }
      
      // Make API call to weatherstack
      const response = await axios.get('http://api.weatherstack.com/historical', {
        params: {
          access_key: a94af8ffd3b9d2f39c8090a796eabf8e,
          query: location,
          units: 'm',
          historical_date: date || '2023-01-01' // Default to a recent date if none provided
        }
      });
      
      // Check for error response from weatherstack
      if (response.data.success === false) {
        throw new Error(`Weatherstack API error: ${response.data.error.info}`);
      }
      
      // Return the data
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching historical weather data:', error);
      res.status(500).json({ 
        error: 'Failed to fetch historical weather data', 
        message: error.message 
      });
    }
  });

  return app;
}