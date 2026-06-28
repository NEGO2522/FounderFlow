import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AgentCard from './AgentCard';

export default function Sidebar({ agents, activeAgentId, setActiveAgentId }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleAgentClick = (agentId) => {
    if (location.pathname === '/settings' || location.pathname.startsWith('/projects')) {
      navigate('/dashboard');
    }
    setActiveAgentId(agentId);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        {agents.map((agent) => {
          const isAgentActive = activeAgentId === agent.id;
          // Filter out disabled agents in dashboard view, but show all in settings view!
          if (location.pathname === '/dashboard' && !agent.enabled) return null;
          
          return (
            <AgentCard 
              key={agent.id}
              agent={agent}
              isActive={isAgentActive && location.pathname === '/dashboard'}
              onClick={() => handleAgentClick(agent.id)}
            />
          );
        })}
      </div>

      {/* Navigation buttons in footer */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border-card)', display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: 'var(--bg-deep)' }}>
        <button 
          className="minimal-project-btn" 
          onClick={() => navigate('/projects')}
          style={{ borderStyle: 'dashed', borderColor: location.pathname.startsWith('/projects') ? 'var(--accent-lime)' : 'var(--border-card)' }}
        >
          <span>PROJECTS</span>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            folder
          </span>
        </button>

        <button 
          className="minimal-project-btn" 
          onClick={() => navigate('/settings')}
          style={{ borderStyle: 'dashed', borderColor: location.pathname === '/settings' ? 'var(--accent-lime)' : 'var(--border-card)' }}
        >
          <span>SETTINGS</span>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            settings
          </span>
        </button>

        {location.pathname !== '/dashboard' && (
          <button 
            className="minimal-project-btn" 
            onClick={() => navigate('/dashboard')}
            style={{ borderStyle: 'dashed', borderColor: 'var(--accent-lime)' }}
          >
            <span>CONSOLE</span>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
              terminal
            </span>
          </button>
        )}

        <button 
          className="minimal-project-btn" 
          onClick={() => navigate('/')}
          style={{ borderColor: '#3d432b' }}
        >
          <span>LOG OUT</span>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            logout
          </span>
        </button>
      </div>
    </aside>
  );
}
