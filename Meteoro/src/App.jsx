import React, { useState } from "react";
import { WeatherApp } from "./components/WeatherApp";
import ScheduleBuilder from "./components/ScheduleBuilder";

function App() {
  const [activeTab, setActiveTab] = useState("schedule");

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Navigation Bar */}
      <nav style={{ 
        display: 'flex', 
        backgroundColor: '#0f172a', 
        color: 'white', 
        padding: '0 24px', 
        height: '60px',
        alignItems: 'center',
        gap: '30px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="24" height="24" fill="none" stroke="#60a5fa" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.5px' }}>App Estudiantil</h1>
        </div>
        
        <div style={{ display: 'flex', height: '100%' }}>
          <button 
            onClick={() => setActiveTab("schedule")}
            style={{ 
              background: 'none', 
              border: 'none', 
              borderBottom: activeTab === 'schedule' ? '3px solid #3b82f6' : '3px solid transparent',
              color: activeTab === 'schedule' ? '#3b82f6' : '#94a3b8', 
              cursor: 'pointer', 
              fontWeight: '600', 
              fontSize: '14px',
              padding: '0 16px',
              transition: 'color 0.2s, border-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            Armador de Horario
          </button>
          <button 
            onClick={() => setActiveTab("weather")}
            style={{ 
              background: 'none', 
              border: 'none', 
              borderBottom: activeTab === 'weather' ? '3px solid #3b82f6' : '3px solid transparent',
              color: activeTab === 'weather' ? '#3b82f6' : '#94a3b8', 
              cursor: 'pointer', 
              fontWeight: '600', 
              fontSize: '14px',
              padding: '0 16px',
              transition: 'color 0.2s, border-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
            Clima (Meteoro)
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {activeTab === "weather" && <WeatherApp />}
        {activeTab === "schedule" && <ScheduleBuilder />}
      </div>
    </div>
  );
}

export default App;