import React, { useState, useEffect } from "react";
import { useWeather } from "../hooks/useWeather";
import axios from "axios";
import "./WeatherApp.css"; // Importamos el archivo de estilos

// Determine API base url dynamically for both local Vite dev and Docker production
const BACKEND_URL = import.meta.env.VITE_API_URL || (window.location.port === "5173" ? "http://localhost:3000" : "");

export const WeatherApp = () => {
  const [inputLat, setInputLat] = useState("-12.0432");
  const [inputLon, setInputLon] = useState("-77.0282");

  const [queryLat, setQueryLat] = useState("-12.0432");
  const [queryLon, setQueryLon] = useState("-77.0282");

  const [history, setHistory] = useState([]);

  const { weatherData, loading, error, logTrigger, refresh } = useWeather(
    queryLat,
    queryLon,
  );

  // Fetch search history from SQL Server backend
  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/weather-logs`);
      setHistory(response.data);
    } catch (err) {
      console.error("Error fetching history from backend:", err.message);
    }
  };

  // Load history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  // Refresh history whenever a new search log is successfully saved to backend
  useEffect(() => {
    if (logTrigger > 0) {
      fetchHistory();
    }
  }, [logTrigger]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQueryLat(inputLat);
    setQueryLon(inputLon);
  };

  // Handle clicking a history item to reload that search
  const handleLoadHistory = (lat, lon) => {
    setInputLat(lat);
    setInputLon(lon);
    setQueryLat(lat);
    setQueryLon(lon);
  };

  return (
    <div className="weather-container">
      <h1 className="weather-title">Aplicación del Clima</h1>

      {/* Formulario de Búsqueda */}
      <form onSubmit={handleSearch} className="weather-form">
        <div className="input-group">
          <label>Latitud:</label>
          <input
            type="number"
            step="any"
            value={inputLat}
            onChange={(e) => setInputLat(e.target.value)}
            className="weather-input"
            required
          />
        </div>
        <div className="input-group">
          <label>Longitud:</label>
          <input
            type="number"
            step="any"
            value={inputLon}
            onChange={(e) => setInputLon(e.target.value)}
            className="weather-input"
            required
          />
        </div>
        <button type="submit" className="btn-search">
          Buscar Clima
        </button>
      </form>

      {/* Manejo de Estados: Cargando y Error */}
      {loading && <p className="status-text">Cargando datos del clima...</p>}
      {error && (
        <p className="status-text error-text">
          Error al obtener el clima: {error.message}
        </p>
      )}

      {/* Mostrar Datos del Clima */}
      {!loading && !error && weatherData && (
        <div className="weather-card">
          <h2>Clima Actual</h2>
          <div className="current-weather">
            <p>
              <strong>Temperatura:</strong> {weatherData.current.temperature_2m}
              °C
            </p>
            <p>
              <strong>Viento:</strong> {weatherData.current.wind_speed_10m} km/h
            </p>
            <button onClick={refresh} className="btn-refresh">
              Actualizar Ahora
            </button>
          </div>

          <h3>Pronóstico Próximas 5 Horas</h3>
          <ul className="hourly-list">
            {weatherData.hourly.time.slice(0, 5).map((time, index) => {
              const date = new Date(time);
              return (
                <li key={index} className="hourly-item">
                  <span>
                    {date.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span>{weatherData.hourly.temperature_2m[index]}°C</span>
                  <span>
                    {weatherData.hourly.relative_humidity_2m[index]}% Hum.
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Historial de Consultas */}
      <div className="history-container">
        <h2 className="history-title">Historial de Búsquedas (Guardado en SQL Server)</h2>
        {history.length === 0 ? (
          <p className="no-history-text">No hay búsquedas registradas aún.</p>
        ) : (
          <div className="history-list">
            {history.map((item) => (
              <div key={item.id} className="history-item-card">
                <div className="history-item-info">
                  <p className="history-coords">
                    <strong>Coordenadas:</strong> Lat {parseFloat(item.latitude).toFixed(4)}, Lon {parseFloat(item.longitude).toFixed(4)}
                  </p>
                  <p className="history-weather-details">
                    <span>Temp: {item.temperature}°C</span> | <span>Viento: {item.wind_speed} km/h</span> {item.humidity !== null && <span>| Hum: {item.humidity}%</span>}
                  </p>
                  <p className="history-time">
                    {new Date(item.search_time).toLocaleString()}
                  </p>
                </div>
                <button 
                  onClick={() => handleLoadHistory(item.latitude, item.longitude)} 
                  className="btn-load-history"
                >
                  Cargar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
