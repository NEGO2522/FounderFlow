import React from 'react';

export default function RightPanel({ 
  activeProject, 
  setActiveProject, 
  roadmap, 
  handleToggleTask, 
  completionPercentage, 
  projects 
}) {
  return (
    <aside className="right-panel">
      {/* Project Details Header */}
      <div className="right-panel-header">
        <span style={{ fontSize: '9px', color: '#a4aa8e', fontWeight: '700', letterSpacing: '0.1em' }}>
          PROJECT
        </span>
        <h2 className="right-panel-title" style={{ marginTop: '6px' }}>
          {activeProject}
        </h2>
        
        {/* Tech Tags */}
        <div className="tech-tags-list">
          {projects[activeProject]?.stack.split(', ').slice(0, 4).map((tech, i) => (
            <span key={i} className="tech-tag">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Project Roadmap Progress & Tasks */}
      <div className="right-panel-body">
        <div className="widget-card">
          <div className="progress-header">
            <span className="progress-title">Sprint Progress</span>
            <span className="progress-percent">{completionPercentage}%</span>
          </div>
          
          {/* Flat Progress Bar */}
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>

          {/* Task Roadmap checklist */}
          <div className="roadmap-container">
            {roadmap.map((task) => (
              <div 
                key={task.id} 
                className={`roadmap-item ${task.completed ? 'completed' : ''}`}
                onClick={() => handleToggleTask(task.id)}
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
        
        {/* Switch project options */}
        <div style={{ marginTop: 'auto' }}>
          <span style={{ fontSize: '9px', color: '#a4aa8e', fontWeight: '700', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>
            SWITCH OPERATIONS
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.keys(projects).map((proj) => (
              proj !== activeProject && (
                <button 
                  key={proj} 
                  className="minimal-project-btn"
                  onClick={() => setActiveProject(proj)}
                >
                  <span>{proj}</span>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                </button>
              )
            ))}
          </div>
        </div>
        
      </div>
    </aside>
  );
}
