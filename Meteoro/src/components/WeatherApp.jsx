import React, { useState } from "react";
import { useWeather } from "../hooks/useWeather";
import "./WeatherApp.css"; // Importamos el archivo de estilos

export const WeatherApp = () => {
  const [inputLat, setInputLat] = useState("-12.0432");
  const [inputLon, setInputLon] = useState("-77.0282");

  const [queryLat, setQueryLat] = useState("-12.0432");
  const [queryLon, setQueryLon] = useState("-77.0282");

  const { weatherData, loading, error, refresh } = useWeather(
    queryLat,
    queryLon,
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setQueryLat(inputLat);
    setQueryLon(inputLon);
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
    </div>
  );
};
