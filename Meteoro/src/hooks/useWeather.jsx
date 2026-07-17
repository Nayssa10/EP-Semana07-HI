import { useState, useEffect } from "react";
import { fetchWeather } from "../api_weather/weatherService";
import axios from "axios";

// Determine API base url dynamically for both local Vite dev and Docker production
const BACKEND_URL = import.meta.env.VITE_API_URL || (window.location.port === "5173" ? "http://localhost:3000" : "");

export const useWeather = (lat, lon) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logTrigger, setLogTrigger] = useState(0); // Trigger to let components know history should be refreshed

  const getWeatherData = async () => {
    try {
      setLoading(true);
      const data = await fetchWeather(lat, lon);
      setWeatherData(data);

      // Call our simple Node backend to save the weather log in SQL Server
      try {
        await axios.post(`${BACKEND_URL}/api/weather-logs`, {
          latitude: lat,
          longitude: lon,
          temperature: data.current.temperature_2m,
          wind_speed: data.current.wind_speed_10m,
          humidity: data.hourly?.relative_humidity_2m ? data.hourly.relative_humidity_2m[0] : null
        });
        // Increment trigger to signal that a log was successfully saved
        setLogTrigger(prev => prev + 1);
      } catch (logErr) {
        console.error("Failed to save weather log to backend:", logErr.message);
      }
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

  return { weatherData, loading, error, logTrigger, refresh: getWeatherData };
};
