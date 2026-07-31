import React from 'react';
import { useDraggable } from '@dnd-kit/core';

export default function SectionItem({ course, section }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${section.idSeccion}`,
    data: {
      courseId: course.idCurso,
      section: section
    }
  });

  const style = {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderLeft: `4px solid ${course.colorBase || '#4F46E5'}`,
    padding: '10px',
    borderRadius: '6px',
    cursor: 'grab',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    transition: 'box-shadow 0.2s, transform 0.2s',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    position: 'relative',
    ...(transform ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(1.05)`,
      zIndex: 999,
      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    } : {})
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.08)'}
      onMouseLeave={(e) => { if (!transform) e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a' }}>
          Sec: {section.idSeccion}
        </span>
        <span style={{ fontSize: '10px', fontWeight: '600', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', color: '#475569' }}>
          {section.modalidad}
        </span>
      </div>
      
      <div style={{ fontSize: '11px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
          {section.docente}
        </span>
      </div>

      <div style={{ marginTop: '2px', paddingTop: '6px', borderTop: '1px dashed #e2e8f0', fontSize: '10px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {section.sesiones.map((ses, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '500' }}>{ses.dia}</span>
            <span style={{ fontWeight: '600', color: '#334155' }}>{ses.horaInicio} - {ses.horaFin}</span>
          </div>
        ))}
      </div>
    </div>
  );
}