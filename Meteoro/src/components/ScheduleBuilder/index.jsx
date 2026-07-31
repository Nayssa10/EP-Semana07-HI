import React, { useState, useEffect } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import CourseList from './Sidebar/CourseList';
import ScheduleGrid from './Grid/ScheduleGrid';
import html2pdf from 'html2pdf.js';
import initialJsonData from './data.json'; 

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function ScheduleBuilder() {
  const [courses, setCourses] = useState(initialJsonData);
  const [jsonInput, setJsonInput] = useState(JSON.stringify(initialJsonData, null, 2));
  const [jsonError, setJsonError] = useState("");
  const [showConfig, setShowConfig] = useState(false);
  // Diccionario: { idCurso: objetoSeccionCompleto }
  const [selectedSections, setSelectedSections] = useState({});

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleJsonSubmit = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) throw new Error("El JSON debe ser un arreglo de cursos.");
      setCourses(parsed);
      setSelectedSections({}); // Limpiar el horario al cargar nuevos datos
      setJsonError("");
      setShowConfig(false);
    } catch (err) {
      setJsonError("JSON Inválido: " + err.message);
    }
  };

  const checkCollision = (newSection, newCourseId) => {
    for (const [courseId, existingSection] of Object.entries(selectedSections)) {
      if (courseId === newCourseId) continue;
      
      for (const newSess of newSection.sesiones) {
        for (const extSess of existingSection.sesiones) {
          if (newSess.dia === extSess.dia) {
            const nStart = parseInt(newSess.horaInicio.replace(':', ''));
            const nEnd = parseInt(newSess.horaFin.replace(':', ''));
            const eStart = parseInt(extSess.horaInicio.replace(':', ''));
            const eEnd = parseInt(extSess.horaFin.replace(':', ''));
            
            if (Math.max(nStart, eStart) < Math.min(nEnd, eEnd)) {
              return true; 
            }
          }
        }
      }
    }
    return false;
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over || over.id !== 'schedule-grid') return;

    const { courseId, section } = active.data.current;
    const course = courses.find(c => c.idCurso === courseId);

    if (checkCollision(section, courseId)) {
      alert("Cruce de horarios detectado. No se puede colocar esta sección.");
      return;
    }

    setSelectedSections(prev => ({
      ...prev,
      [courseId]: { 
        ...section, 
        idCurso: courseId, 
        colorBase: course.colorBase,
        nombreCurso: course.nombreCurso,
        ciclo: course.ciclo
      }
    }));
  };

  const removeSection = (courseId) => {
    setSelectedSections(prev => {
      const newSelections = { ...prev };
      delete newSelections[courseId];
      return newSelections;
    });
  };

  const handleExportPDF = () => {
    const element = document.getElementById('printable-schedule');
    
    const usedHours = new Set();
    Object.values(selectedSections).forEach(sec => {
        sec.sesiones.forEach(sess => {
            const startH = parseInt(sess.horaInicio.split(':')[0]);
            const endH = parseInt(sess.horaFin.split(':')[0]);
            for(let i = startH; i <= endH; i++){
                usedHours.add(i);
            }
        });
    });

    const timeRows = element.querySelectorAll('.time-row');
    timeRows.forEach(row => {
        const hour = parseInt(row.getAttribute('data-hour'));
        if (!usedHours.has(hour) && usedHours.size > 0) {
            row.style.display = 'none';
        }
    });

    const opt = {
      margin:       0.5,
      filename:     'mi_horario.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      timeRows.forEach(row => row.style.display = 'flex');
    });
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', backgroundColor: '#f1f5f9', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        
        {/* Top Section: Courses Tray & Config */}
        <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', zIndex: 10, display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid #f1f5f9' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Cursos Disponibles</h2>
                <span style={{ fontSize: '11px', color: '#64748b', backgroundColor: '#e2e8f0', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>
                  {courses.length} Cursos
                </span>
             </div>
             
             <button 
                onClick={() => setShowConfig(!showConfig)}
                style={{ background: 'none', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
             >
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Configurar Datos JSON
             </button>
          </div>

          {/* Collapsible JSON Area */}
          {showConfig && (
            <div style={{ padding: '15px 20px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <textarea 
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                style={{ 
                  width: '100%', height: '120px', padding: '10px', fontSize: '12px', 
                  fontFamily: 'monospace', borderRadius: '8px', border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff', color: '#334155', resize: 'vertical', outline: 'none',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)', boxSizing: 'border-box'
                }}
                placeholder="Pega aquí tu arreglo JSON..."
              />
              {jsonError && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px', fontWeight: '600' }}>{jsonError}</p>}
              
              <button 
                onClick={handleJsonSubmit}
                style={{ 
                  marginTop: '10px', padding: '8px 16px', backgroundColor: '#3b82f6', 
                  color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', 
                  cursor: 'pointer', transition: 'background-color 0.2s', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
              >
                Cargar JSON
              </button>
            </div>
          )}

          {/* Course Tray (Horizontal Scroll) */}
          <div style={{ padding: '12px 20px' }}>
            <CourseList courses={courses} />
          </div>

        </div>
        
        {/* Main Grid Area (Bottom) */}
        <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Mi Horario de Clases</h1>
              <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0 0', fontWeight: '500' }}>Arrastra los bloques desde la bandeja superior hacia la cuadrícula.</p>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
               {Object.keys(selectedSections).length > 0 && (
                 <button 
                   onClick={() => setSelectedSections({})}
                   style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: '600', fontSize: '13px', cursor: 'pointer', padding: '8px' }}
                 >
                   Limpiar Todo
                 </button>
               )}
               <button 
                 onClick={handleExportPDF}
                 style={{ 
                   backgroundColor: '#10b981', color: 'white', padding: '10px 18px', 
                   borderRadius: '8px', cursor: 'pointer', border: 'none', fontWeight: '700',
                   display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px',
                   boxShadow: '0 4px 6px rgba(16, 185, 129, 0.25)', transition: 'transform 0.1s, background-color 0.2s'
                 }}
                 onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                 onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                 onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
                 onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
               >
                 <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                 Exportar PDF
               </button>
            </div>
          </div>

          {/* Selected courses tags for quick removal */}
          {Object.keys(selectedSections).length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              {Object.values(selectedSections).map(sec => (
                <div key={sec.idCurso} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff', color: '#1e293b', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', border: '1px solid #cbd5e1', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: sec.colorBase }}></span>
                  <span>{sec.nombreCurso} (Sec: {sec.idSeccion})</span>
                  <button 
                    onClick={() => removeSection(sec.idCurso)}
                    style={{ background: '#f1f5f9', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', borderRadius: '50%', transition: 'background-color 0.2s' }}
                    title="Remover curso"
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#fee2e2'; e.currentTarget.style.color = '#ef4444'; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; }}
                  >
                    <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div id="printable-schedule" style={{ flex: 1, minHeight: '800px', width: '100%' }}>
            <ScheduleGrid selectedSections={Object.values(selectedSections)} days={DAYS} />
          </div>
          
        </div>
      </div>
    </DndContext>
  );
}