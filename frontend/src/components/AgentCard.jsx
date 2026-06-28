import React from 'react';

export default function AgentCard({ agent, isActive, onClick }) {
  return (
    <div className={`agent-card-wrapper ${agent.status === 'Working' && agent.enabled ? 'working' : ''}`}>
      <div 
        className={`agent-card ${isActive ? 'active' : ''}`}
        style={{ opacity: agent.enabled ? 1 : 0.4 }}
        onClick={onClick}
      >
        <div className="agent-avatar">
          {agent.avatar}
        </div>
        
        <div className="agent-info">
          <span className="agent-name">{agent.name}</span>
          <span className="agent-role-badge">{agent.role}</span>
        </div>
      </div>
    </div>
  );
}
