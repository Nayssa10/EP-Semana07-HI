import axios from 'axios';

const API_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
//Generando conflicto 2

export const fetchWeather = async (lat, lon) => {
  try {
    const response = await axios.get(API_BASE_URL, {
      params: {
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,wind_speed_10m',
        hourly: 'temperature_2m,relative_humidity_2m,wind_speed_10m',
        timezone: 'auto' // Ajusta automáticamente a la zona horaria local
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};