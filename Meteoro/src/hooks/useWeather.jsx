import { useState, useEffect } from 'react';
import { fetchWeather } from '../services/weatherService';

export const useWeather = (lat, lon) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getWeatherData = async () => {
    try {
      setLoading(true);
      const data = await fetchWeather(lat, lon);
      setWeatherData(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lat && lon) {
      getWeatherData();
    }
  }, [lat, lon]);

  return { weatherData, loading, error, refresh: getWeatherData };
};