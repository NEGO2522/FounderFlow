import React from 'react';

export default function TopBar({ title }) {
  return (
    <header className="top-bar">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: '800', letterSpacing: '0.12em', color: 'var(--text-warm)' }}>
          FOUNDER<span style={{ color: 'var(--accent-lime)' }}>//</span>FLOW
        </span>
      </div>
      
      {/* Project Name Center */}
      <div style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em', color: 'var(--text-warm)' }}>
        {title}
      </div>

      {/* Status Dot */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
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
