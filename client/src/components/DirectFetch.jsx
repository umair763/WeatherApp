import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const DirectFetch = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/weather', {
          params: {
            location: 'London',
          },
        });
        console.log("Direct fetch response:", response.data);
        setData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error in direct fetch:', err);
        setError('Failed to fetch data directly');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-4 bg-white shadow rounded">Loading...</div>;
  
  if (error) return (
    <div className="p-4 bg-red-100 text-red-800 shadow rounded">
      Error: {error}
    </div>
  );

  if (!data) return <div className="p-4 bg-white shadow rounded">No data received</div>;

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-3">Direct API Test</h2>
      <div>
        <p><strong>Location:</strong> {data.location?.name}, {data.location?.country}</p>
        <p><strong>Temperature:</strong> {data.current?.temperature}°C</p>
        <p><strong>Condition:</strong> {data.current?.weather_descriptions?.[0]}</p>
      </div>
      <pre className="mt-4 bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};