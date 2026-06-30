import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import '../styles/projects.css';

export default function ProjectsPage({ agents, activeAgentId, setActiveAgentId, projectsList }) {
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  return (
    <div className="dashboard-container">
      <div className="noise-overlay"></div>
      <TopBar title="OPERATIONS ROOM" onMenuClick={() => setMobileSidebarOpen(true)} />
      <div className="dashboard-body">
        <Sidebar 
          agents={agents} 
          activeAgentId={activeAgentId} 
          setActiveAgentId={setActiveAgentId} 
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header top section */}
          <div style={{ height: '70px', borderBottom: '1px solid var(--border-card)', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-deep)' }}>
            <div>
              <span style={{ fontSize: '9px', color: '#a4aa8e', fontWeight: '800', letterSpacing: '0.1em' }}>
                PROJECTS
              </span>
              <h1 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-warm)', margin: '4px 0 0 0' }}>
                Your Projects
              </h1>
            </div>
            <button 
              className="lime-btn" 
              style={{ borderRadius: '0px' }}
              onClick={() => navigate('/new-project-fresh')}
            >
              <span className="material-symbols-outlined" 
                style={{ fontSize: '14px' }}>add</span>
              New Project
            </button>
          </div>

          {/* Empty state when no projects */}
          {Object.values(projectsList).length === 0 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: '12px',
              fontFamily: 'Geist Mono'
            }}>
              <div style={{ 
                color: '#C8F04A', fontSize: '11px',
                letterSpacing: '0.15em'
              }}>
                ● NO PROJECTS YET
              </div>
              <div style={{ color: '#6B7155', fontSize: '12px' }}>
                Start your first project to see it here.
              </div>
              <button 
                className="lime-btn"
                style={{ borderRadius: '0px', marginTop: '8px' }}
                onClick={() => navigate('/new-project-fresh')}
              >
                + Start a Project
              </button>
            </div>
          )}

          {/* Grid of cards */}
          {Object.values(projectsList).length > 0 && (
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
                        AI TEAM ON THIS
                      </span>
                      <div className="project-agents-row">
                        {project.agents.map((agentId) => {
                          const agent = agents.find(a => 
                            a.id === agentId || 
                            a.avatar === agentId || 
                            a.id === agentId.toLowerCase()
                          );
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
                      <span>Open</span>
                      <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>arrow_forward</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
