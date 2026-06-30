import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AgentCard from './AgentCard';

export default function Sidebar({ 
  agents, activeAgentId, setActiveAgentId, 
  isOpen, onClose 
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleAgentClick = (agentId) => {
    if (location.pathname === '/settings' || location.pathname.startsWith('/projects')) {
      navigate('/dashboard');
    }
    setActiveAgentId(agentId);
    if (onClose) onClose();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.dispatchEvent(new Event("ff_guest_logout"));
    navigate('/');
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div 
          className="sidebar-mobile-backdrop"
          onClick={onClose}
        />
      )}
      
      <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
        {/* Mobile close button */}
        <button 
          className="sidebar-mobile-close"
          onClick={onClose}
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="sidebar-content">
          {agents
            .filter(agent => agent.enabled !== false)
            .map((agent) => {
              const isAgentActive = activeAgentId === agent.id;
              
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
            onClick={() => {
              navigate('/projects');
              if (onClose) onClose();
            }}
            style={{ borderStyle: 'dashed', borderColor: location.pathname.startsWith('/projects') ? 'var(--accent-lime)' : 'var(--border-card)' }}
          >
            <span>Projects</span>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
              folder
            </span>
          </button>

          <button 
            className="minimal-project-btn" 
            onClick={() => {
              navigate('/settings');
              if (onClose) onClose();
            }}
            style={{ borderStyle: 'dashed', borderColor: location.pathname === '/settings' ? 'var(--accent-lime)' : 'var(--border-card)' }}
          >
            <span>Settings</span>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
              settings
            </span>
          </button>

          <button onClick={handleLogout} style={{
            width: '100%',
            padding: '10px 16px',
            background: 'transparent',
            border: '1px solid #2E3320',
            color: '#6B7155',
            fontFamily: 'Geist Mono',
            fontSize: '10px',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            textAlign: 'left',
            marginTop: '8px'
          }}>
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
