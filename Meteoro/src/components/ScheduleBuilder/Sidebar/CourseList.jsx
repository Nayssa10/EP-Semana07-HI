import React from 'react';
import SectionItem from './SectionItem';

export default function CourseList({ courses }) {
  if (!courses || courses.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#9ca3af', fontSize: '14px', width: '100%' }}>
        No hay cursos cargados. Ingresa el JSON en "Configurar Datos".
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      gap: '16px', 
      overflowX: 'auto', 
      padding: '4px 4px 12px 4px',
      alignItems: 'flex-start'
    }}>
      {courses.map(course => (
        <div key={course.idCurso} style={{ 
          minWidth: '280px',
          maxWidth: '280px',
          backgroundColor: '#ffffff', 
          borderRadius: '10px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Course Header */}
          <div style={{ 
            padding: '12px 16px', 
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            borderTop: `4px solid ${course.colorBase || '#4F46E5'}`
          }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold', color: '#1e293b', lineHeight: '1.2' }}>
              {course.nombreCurso}
            </h3>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>ID: {course.idCurso}</span>
              {course.ciclo && (
                <span style={{ fontSize: '10px', color: course.colorBase || '#4F46E5', backgroundColor: `${course.colorBase}15` || '#4F46E515', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>
                  {course.ciclo}
                </span>
              )}
            </div>
          </div>
          
          {/* Sections List */}
          <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '220px', overflowY: 'auto' }}>
            {course.secciones.map(section => (
              <SectionItem key={section.idSeccion} course={course} section={section} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}