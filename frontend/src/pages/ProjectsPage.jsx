import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import '../styles/projects.css';

export default function ProjectsPage({ agents, activeAgentId, setActiveAgentId, projectsList }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="noise-overlay"></div>
      <TopBar title="OPERATIONS ROOM" />
      <div className="dashboard-body">
        <Sidebar 
          agents={agents} 
          activeAgentId={activeAgentId} 
          setActiveAgentId={setActiveAgentId} 
        />

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header top section */}
          <div style={{ height: '70px', borderBottom: '1px solid var(--border-card)', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-deep)' }}>
            <div>
              <span style={{ fontSize: '9px', color: '#a4aa8e', fontWeight: '800', letterSpacing: '0.1em' }}>
                OPERATIONS
              </span>
              <h1 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-warm)', margin: '4px 0 0 0' }}>
                Active Projects
              </h1>
            </div>
            <button className="lime-btn" style={{ borderRadius: '0px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>add</span>
              New Project
            </button>
          </div>

          {/* Grid of cards */}
          <div className="projects-grid">
            {Object.values(projectsList).map((project) => {
              const completedTasks = project.roadmap.filter(t => t.completed).length;
              const totalTasks = project.roadmap.length;
              const pct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
              
              return (
                <div key={project.id} className="project-card" onClick={() => navigate(`/projects/${project.id}`)}>
                  <div className="project-card-header">
                    <h3 className="project-card-title">{project.name}</h3>
                    <span className={`status-badge ${project.status.toLowerCase()}`}>
                      {project.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '11px', color: '#a4aa8e', lineHeight: '1.4' }}>
                    {project.stack}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: '700' }}>
                      <span style={{ color: '#a4aa8e' }}>Sprint Progress</span>
                      <span style={{ color: 'var(--accent-lime)' }}>{pct}%</span>
                    </div>
                    <div className="progress-bar-bg" style={{ height: '3px' }}>
                      <div className="progress-bar-fill" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>

                  {/* Assigned Agents */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '9px', color: '#a4aa8e', fontWeight: '800', letterSpacing: '0.05em' }}>
                      ASSIGNED CO-FOUNDERS
                    </span>
                    <div className="project-agents-row">
                      {project.agents.map((agentId) => {
                        const agent = agents.find(a => a.id === agentId);
                        if (!agent) return null;
                        return (
                          <div key={agentId} className="project-agent-bubble" title={`${agent.name} - ${agent.role}`}>
                            {agent.avatar}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="project-card-link">
                    <span>Open Project</span>
                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>arrow_forward</span>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
