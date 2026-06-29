import React from 'react';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import RightPanel from '../components/RightPanel';
import '../styles/dashboard.css';

export default function DashboardPage({
  agents,
  activeAgent,
  setActiveAgentId,
  userInput,
  setUserInput,
  activeProject,
  setActiveProject,
  copiedId,
  handleCopyText,
  roadmap,
  handleToggleTask,
  completionPercentage,
  projects,
  handleSendMessage,
  chatEndRef
}) {
  return (
    <div className="dashboard-container">
      <div className="noise-overlay"></div>
      <TopBar title={(activeProject || '').toUpperCase()} />
      
      <div className="dashboard-body">
        <Sidebar 
          agents={agents} 
          activeAgentId={activeAgent?.id} 
          setActiveAgentId={setActiveAgentId} 
        />

        {/* Center Workspace (Chat dialogue) */}
        <main className="main-workspace">
          {activeAgent ? (
            <>
              {/* Active Workspace Header */}
              <div className="workspace-header">
                <div className="workspace-title-row">
                  <span style={{ fontWeight: '800', fontSize: '13px', color: 'var(--text-warm)' }}>
                    {activeAgent?.name?.toUpperCase()}
                  </span>
                  <span style={{ color: '#a4aa8e', fontSize: '11px' }}>
                    ({activeAgent?.role})
                  </span>
                </div>
                
                <div className="active-task-indicator">
                  <span>TASK: {activeAgent?.activeTask}</span>
                </div>
              </div>

              {/* Chat Container */}
              <div className="chat-container">
                {activeAgent.messages && activeAgent.messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`chat-message ${msg.sender === 'user' ? 'user' : 'agent'}`}
                  >
                    <div className="chat-bubble">
                      <div className="chat-sender-label">
                        {msg.sender === 'user' ? 'YOU' : activeAgent.name?.toUpperCase()}
                      </div>
                      <div style={{ whiteSpace: 'pre-wrap' }}>
                        {msg.text}
                      </div>
                      
                      {/* Inline Artifact code card rendered inside message bubble */}
                      {msg.artifact && (
                        <div className="inline-artifact-card">
                          <div className="inline-artifact-header">
                            <span className="inline-artifact-title">
                              {msg.artifact.title}
                            </span>
                            <button 
                              className="inline-artifact-copy"
                              onClick={() => handleCopyText(msg.artifact.content, msg.artifact.title)}
                            >
                              {copiedId === msg.artifact.title ? 'COPIED' : 'COPY'}
                            </button>
                          </div>
                          <div className="inline-artifact-body">
                            <pre>
                              <code>{msg.artifact.content}</code>
                            </pre>
                          </div>
                        </div>
                      )}

                      <div className="chat-timestamp">
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Send Input form bar */}
              <form onSubmit={handleSendMessage} className="chat-input-bar">
                <div className="chat-input-container">
                  <input 
                    type="text" 
                    className="chat-text-input" 
                    placeholder={`Message ${activeAgent?.name}...`} 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    autoFocus={false}
                  />
                </div>
                <button type="submit" className="send-button">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', fontWeight: 'bold' }}>send</span>
                </button>
              </form>
            </>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: '12px'
            }}>
              <div style={{
                color: '#C8F04A',
                fontSize: '11px',
                letterSpacing: '0.15em',
                fontFamily: 'Geist Mono'
              }}>
                ● READY
              </div>
              <div style={{
                color: '#6B7155',
                fontSize: '12px',
                fontFamily: 'Geist Mono',
                textAlign: 'center'
              }}>
                Pick an AI from the left to start.
              </div>
            </div>
          )}
        </main>

        <RightPanel 
          activeProject={activeProject}
          setActiveProject={setActiveProject}
          roadmap={roadmap}
          handleToggleTask={handleToggleTask}
          completionPercentage={completionPercentage}
          projects={projects}
        />
      </div>
    </div>
  );
}
