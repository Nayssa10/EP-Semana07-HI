import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export default function ScheduleGrid({ selectedSections, days }) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'schedule-grid',
  });

  const startHour = 8;
  const endHour = 22;
  const totalHours = endHour - startHour;
  
  const hoursList = Array.from({ length: totalHours + 1 }, (_, i) => i + startHour);

  const getSessionStyle = (dia, horaInicio, horaFin, colorBase) => {
    const dayIndex = days.indexOf(dia);
    if (dayIndex === -1) return { display: 'none' };

    const [hIni, mIni] = horaInicio.split(':').map(Number);
    const [hFin, mFin] = horaFin.split(':').map(Number);
    
    const startMinutes = (hIni - startHour) * 60 + mIni;
    const durationMinutes = ((hFin * 60) + mFin) - ((hIni * 60) + mIni);
    
    const topPercentage = (startMinutes / (totalHours * 60)) * 100;
    const heightPercentage = (durationMinutes / (totalHours * 60)) * 100;
    
    return {
      position: 'absolute',
      top: `${topPercentage}%`,
      left: `${(dayIndex + 1) * (100 / 8)}%`, 
      width: `calc(${100 / 8}% - 6px)`,
      marginLeft: '3px',
      height: `calc(${heightPercentage}% - 2px)`,
      backgroundColor: colorBase || '#4F46E5',
      padding: '8px 10px',
      boxSizing: 'border-box',
      border: 'none',
      borderLeft: '4px solid rgba(0,0,0,0.2)',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
      overflowY: 'auto',
      overflowX: 'hidden',
      color: 'white',
      borderRadius: '6px',
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      transition: 'all 0.2s ease',
      scrollbarWidth: 'none', // For Firefox
    };
  };

  return (
    <div 
      ref={setNodeRef} 
      className="schedule-grid-container"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '800px',
        backgroundColor: isOver ? '#f8fafc' : '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isOver ? '0 0 0 2px #60a5fa inset' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
        transition: 'background-color 0.2s, box-shadow 0.2s'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', zIndex: 20, position: 'sticky', top: 0 }}>
        <div style={{ width: `${100 / 8}%`, padding: '12px 8px', fontWeight: '700', color: '#64748b', textAlign: 'center', borderRight: '1px solid #e2e8f0', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Hora
        </div>
        {days.map(day => (
          <div key={day} style={{ width: `${100 / 8}%`, padding: '12px 8px', fontWeight: '700', color: '#334155', textAlign: 'center', borderRight: '1px solid #e2e8f0', fontSize: '13px' }}>
            {day}
          </div>
        ))}
      </div>

      {/* Grid Lines */}
      <div style={{ position: 'relative', flex: 1, display: 'flex' }}>
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, display: 'flex', flexDirection: 'column' }}>
           {hoursList.map(h => (
             <div key={h} className="time-row" data-hour={h} style={{ flex: 1, borderBottom: '1px solid #f1f5f9', display: 'flex', position: 'relative', minHeight: '60px' }}>
                {/* Half-hour dashed line */}
                <div style={{ position: 'absolute', top: '50%', left: `${100/8}%`, right: 0, borderTop: '1px dashed #e2e8f0', zIndex: 1 }}></div>

                <div style={{ width: `${100 / 8}%`, padding: '8px 4px', textAlign: 'center', fontSize: '12px', color: '#94a3b8', borderRight: '1px solid #e2e8f0', fontWeight: '600', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
                  {h.toString().padStart(2, '0')}:00
                </div>
                {days.map(d => (
                  <div key={`${h}-${d}`} style={{ width: `${100 / 8}%`, borderRight: '1px solid #f1f5f9', position: 'relative', zIndex: 2 }}></div>
                ))}
             </div>
           ))}
        </div>

        {/* Render Sessions with Detailed Information */}
        {selectedSections.map(section => 
          section.sesiones.map((sesion, index) => (
            <div 
              key={`${section.idSeccion}-${index}`} 
              style={getSessionStyle(sesion.dia, sesion.horaInicio, sesion.horaFin, section.colorBase)}
            >
              {/* Header inside card: Course Name */}
              <div style={{ fontWeight: '800', fontSize: '13px', lineHeight: '1.2', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '4px', marginBottom: '2px' }}>
                {section.nombreCurso}
              </div>
              
              {/* Meta info: Section, Cycle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', fontWeight: '600', opacity: 0.95 }}>
                <span>Sec: {section.idSeccion}</span>
                {section.ciclo && <span>{section.ciclo}</span>}
              </div>

              {/* Modality */}
              <div style={{ fontSize: '10px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', width: 'fit-content' }}>
                {section.modalidad}
              </div>

              {/* Teacher */}
              <div style={{ fontSize: '11px', display: 'flex', alignItems: 'flex-start', gap: '4px', marginTop: '2px', lineHeight: '1.2' }}>
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginTop: '1px', flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                <span>{section.docente}</span>
              </div>
              
              {/* Time (Pushed to bottom) */}
              <div style={{ marginTop: 'auto', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px', paddingTop: '4px' }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {sesion.horaInicio} - {sesion.horaFin}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}