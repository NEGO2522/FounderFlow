import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import RightPanel from '../components/RightPanel';
import { supabase } from '../lib/supabase';
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
  chatEndRef,
  setAgents,
  activeAgentId,
  activeProjectData,
  saveMessages
}) {
  const navigate = useNavigate();
  const [isTyping, setIsTyping] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);

  const sendToBackend = async (agentId, message, history) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return { error: 'Not logged in' }

    const token = session.access_token

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/chat/send`, 
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            agentId,
            message,
            projectContext: activeProjectData?.name 
              ? `Working on: ${activeProjectData.name}. Idea: ${activeProjectData.idea_text || ''}`
              : '',
            history
          })
        }
      )
      if (!response.ok && response.status === 0) {
        return { error: 'Cannot reach the server. Is the backend running?' }
      }
      const data = await response.json()
      return data
    } catch (err) {
      return { error: 'Connection failed. Check if backend is running on port 3001.' }
    }
  }

  const handleSendMessage = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!userInput.trim()) return
    const text = userInput.trim()
    setUserInput('')

    const currentAgent = agents.find(a => a.id === activeAgentId)
    if (!currentAgent) return

    // Add user message immediately
    const userMsg = {
      sender: 'user',
      text: text,
      timestamp: new Date().toTimeString().slice(0, 5)
    }

    const updatedMessages = [...currentAgent.messages, userMsg]
    
    setAgents(prev => prev.map(a => 
      a.id === activeAgentId 
        ? { ...a, messages: updatedMessages }
        : a
    ))
    
    saveMessages(activeAgentId, updatedMessages)
    setIsTyping(true)

    // Call real backend
    const result = await sendToBackend(
      activeAgentId, 
      text, 
      currentAgent.messages
    )

    setIsTyping(false)

    if (result.error) {
      const errorMsg = {
        sender: 'agent',
        text: result.error,
        timestamp: new Date().toTimeString().slice(0, 5),
        isError: true
      }
      const withError = [...updatedMessages, errorMsg]
      setAgents(prev => prev.map(a => 
        a.id === activeAgentId 
          ? { ...a, messages: withError }
          : a
      ))
      saveMessages(activeAgentId, withError)
      return
    }

    const agentMsg = {
      sender: 'agent',
      text: result.reply,
      timestamp: new Date().toTimeString().slice(0, 5)
    }

    const finalMessages = [...updatedMessages, agentMsg]
    
    setAgents(prev => prev.map(a => 
      a.id === activeAgentId 
        ? { ...a, messages: finalMessages }
        : a
    ))
    
    saveMessages(activeAgentId, finalMessages)
  }

  return (
    <div className="dashboard-container">
      <div className="noise-overlay"></div>
      <TopBar title={(activeProject || '').toUpperCase()} onMenuClick={() => setMobileSidebarOpen(true)} />
      
      <div className="dashboard-body">
        <Sidebar 
          agents={agents} 
          activeAgentId={activeAgent?.id} 
          setActiveAgentId={setActiveAgentId} 
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
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
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="active-task-indicator">
                    <span>TASK: {activeAgent?.activeTask}</span>
                  </div>
                  <button 
                    className="toggle-rightpanel-btn"
                    onClick={() => setRightPanelOpen(!rightPanelOpen)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'none',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-lime)'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>assignment</span>
                  </button>
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
                      <div 
                        className={`message-text ${msg.isError ? 'error-message' : ''}`}
                        style={msg.isError ? { 
                          color: '#ff6b6b', 
                          border: '1px solid rgba(255,107,107,0.3)',
                          background: 'rgba(255,107,107,0.05)',
                          padding: '10px',
                          fontSize: '12px',
                          whiteSpace: 'pre-wrap'
                        } : { whiteSpace: 'pre-wrap' }}
                      >
                        {msg.text}
                      </div>
                      
                      {msg.isError && (msg.text.includes('API key') || msg.text.includes('Settings')) && (
                        <button 
                          type="button"
                          onClick={() => navigate('/settings')}
                          style={{
                            marginTop: '8px',
                            padding: '6px 12px',
                            background: 'transparent',
                            border: '1px solid #C8F04A',
                            color: '#C8F04A',
                            fontSize: '10px',
                            fontFamily: 'Geist Mono',
                            cursor: 'pointer',
                            width: 'fit-content'
                          }}
                        >
                          Go to Settings →
                        </button>
                      )}
                      
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
                {isTyping && (
                  <div className="chat-message agent agent-message">
                    <div className="chat-bubble">
                      <div className="chat-sender-label message-sender">{activeAgent.name?.toUpperCase()}</div>
                      <div className="message-text" style={{ color: '#6B7155', fontFamily: 'Geist Mono', fontSize: '12px' }}>
                        Thinking...
                      </div>
                    </div>
                  </div>
                )}
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

        <div className={`rightpanel-drawer-wrapper ${rightPanelOpen ? 'open' : ''}`}>
          <div className="rightpanel-backdrop" onClick={() => setRightPanelOpen(false)}></div>
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
    </div>
  );
}
