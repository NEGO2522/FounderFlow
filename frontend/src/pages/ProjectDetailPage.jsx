import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import '../styles/projects.css';

export default function ProjectDetailPage({ agents, activeAgentId, setActiveAgentId, projectsList, handleToggleProjectTask }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const project = projectsList[id];

  if (!project) {
    return (
      <div style={{ padding: '40px', color: 'var(--text-warm)', fontFamily: 'var(--font-geist-mono)', backgroundColor: 'var(--bg-deep)', height: '100vh' }}>
        <div style={{ color: 'var(--accent-lime)', cursor: 'pointer', marginBottom: '20px' }} onClick={() => navigate('/projects')}>
          ← Back to Operations Room
        </div>
        <div>Error: Registry scope does not contain project id "{id}".</div>
      </div>
    );
  }

  const completedCount = project.roadmap.filter(t => t.completed).length;
  const totalCount = project.roadmap.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const sampleLogs = [
    { avatar: 'CL', name: 'Claude', action: 'Reviewed authentication middleware', time: '2h ago' },
    { avatar: 'GP', name: 'ChatGPT', action: 'Generated marketing copy draft', time: '4h ago' },
    { avatar: 'DS', name: 'DeepSeek', action: 'Refactored database schema', time: '6h ago' },
    { avatar: 'GM', name: 'Gemini', action: 'Completed competitor research', time: '8h ago' }
  ];

  return (
    <div className="dashboard-container">
      <div className="noise-overlay"></div>
      <TopBar title={`PROJECT DETAILS // ${project.name.toUpperCase()}`} />
      
      <div className="dashboard-body">
        <Sidebar 
          agents={agents} 
          activeAgentId={activeAgentId} 
          setActiveAgentId={setActiveAgentId} 
        />

        <div className="project-detail-container">
          <div className="project-detail-main">
            {/* Left Column (60%) */}
            <div className="detail-left-col">
              <div>
                <div 
                  onClick={() => navigate('/projects')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--accent-lime)', cursor: 'pointer', marginBottom: '16px', userSelect: 'none' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_back</span>
                  Back to Projects
                </div>

                <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                  {project.name}
                </h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span className={`status-badge ${project.status.toLowerCase()}`}>
                    {project.status}
                  </span>
                  <div className="tech-tags-list" style={{ marginTop: 0 }}>
                    {project.stack.split(', ').map((tech, i) => (
                      <span key={i} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sprint Roadmap Section */}
              <div className="project-detail-card">
                <h3 className="project-detail-card-title">Sprint Roadmap</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700' }}>
                    <span style={{ color: '#a4aa8e' }}>Roadmap Progress</span>
                    <span style={{ color: 'var(--accent-lime)' }}>{pct}%</span>
                  </div>
                  <div className="progress-bar-bg" style={{ height: '4px' }}>
                    <div className="progress-bar-fill" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>

                <div className="roadmap-container">
                  {project.roadmap.map((task) => (
                    <div 
                      key={task.id} 
                      className={`roadmap-item ${task.completed ? 'completed' : ''}`}
                      onClick={() => handleToggleProjectTask(project.id, task.id)}
                    >
                      <div className="roadmap-checkbox">
                        {task.completed && (
                          <span className="material-symbols-outlined" style={{ fontSize: '12px', fontWeight: 'bold' }}>done</span>
                        )}
                      </div>
                      <span>{task.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Log Section */}
              <div className="activity-log-container">
                <h3 className="project-detail-card-title" style={{ paddingLeft: '4px' }}>Activity Log</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {sampleLogs.map((log, i) => (
                    <div key={i} className="activity-log-row">
                      <div className="activity-log-left">
                        <div className="activity-log-avatar">{log.avatar}</div>
                        <span className="activity-log-text">
                          <strong>{log.name}</strong> — {log.action}
                        </span>
                      </div>
                      <span className="activity-log-time">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (40%) */}
            <div className="detail-right-col">
              {/* Assigned Agents Card */}
              <div className="project-detail-card">
                <h3 className="project-detail-card-title">Assigned Agents</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {project.agents.map((agentId) => {
                    const agent = agents.find(a => a.id === agentId);
                    if (!agent) return null;
                    return (
                      <div key={agentId} className="agent-card" style={{ cursor: 'default' }}>
                        <div className="agent-avatar">{agent.avatar}</div>
                        <div className="agent-info">
                          <span className="agent-name">{agent.name}</span>
                          <span className="agent-role-badge">{agent.role}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button className="outline-btn" style={{ width: '100%', marginTop: '8px' }}>
                  + Assign Agent
                </button>
              </div>

              {/* Project Stats Card */}
              <div className="project-detail-card">
                <h3 className="project-detail-card-title">Project Stats</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="detail-stats-row">
                    <span className="detail-stats-label">Tasks Completed</span>
                    <span className="detail-stats-value">{completedCount}/{totalCount}</span>
                  </div>
                  <div className="detail-stats-row">
                    <span className="detail-stats-label">Agents Active</span>
                    <span className="detail-stats-value">{project.agents.length}</span>
                  </div>
                  <div className="detail-stats-row">
                    <span className="detail-stats-label">Last Activity</span>
                    <span className="detail-stats-value">2 hours ago</span>
                  </div>
                  <div className="detail-stats-row">
                    <span className="detail-stats-label">Created</span>
                    <span className="detail-stats-value">June 2026</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
