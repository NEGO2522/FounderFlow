import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TopBar({ title, onMenuClick }) {
  const navigate = useNavigate();

  return (
    <header className="top-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          className="mobile-menu-btn"
          onClick={onMenuClick}
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            color: '#E8EDD4',
            cursor: 'pointer'
          }}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span 
          onClick={() => navigate('/dashboard')}
          style={{ fontSize: '13px', fontWeight: '800', letterSpacing: '0.12em', color: 'var(--text-warm)', cursor: 'pointer' }}
        >
          FOUNDER<span style={{ color: 'var(--accent-lime)' }}>//</span>FLOW
        </span>
      </div>
      
      {/* Project Name Center */}
      <div className="top-bar-title" style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em', color: 'var(--text-warm)' }}>
        {title}
      </div>

      {/* Right Column: + New Project & Status Dot */}
      <div className="top-bar-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={() => {
            if (window.confirm('Start a new project? Current project will be saved.')) {
              navigate('/new-project-fresh');
            }
          }}
          style={{
            background: 'transparent',
            border: '1px dashed #2E3320',
            color: '#6B7155',
            fontFamily: 'Geist Mono',
            fontSize: '10px',
            letterSpacing: '0.1em',
            padding: '6px 14px',
            cursor: 'pointer'
          }}
          onMouseEnter={e => {
            e.target.style.borderColor = '#C8F04A';
            e.target.style.color = '#C8F04A';
          }}
          onMouseLeave={e => {
            e.target.style.borderColor = '#2E3320';
            e.target.style.color = '#6B7155';
          }}
        >
          + New Project
        </button>
        <span 
          style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--accent-lime)',
            display: 'inline-block' 
          }}
        ></span>
      </div>
    </header>
  );
}
