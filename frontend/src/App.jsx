import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Curated military/matte earth tones for avatars
const initialAgents = [
  {
    id: 'atlas',
    name: 'Atlas',
    role: 'Lead Architect',
    avatar: 'AT',
    avatarBg: '#8F9E6C', // Muted olive
    status: 'Working', // starts in Working status to demonstrate border pulse
    activeTask: 'Refactoring API Gateway in Rust',
    messages: [
      { sender: 'agent', text: "Systems verified. audited postgres database schemas and verified OTP connection pooling parameters.", timestamp: '19:02' },
      { sender: 'user', text: "Can you design the Postgres database schema for the user profiles, dishes, and order queues?", timestamp: '19:10' },
      { sender: 'agent', text: "Designed. Relational schema constructed with support for fast index lookups and status enumerations.", timestamp: '19:11',
        artifact: {
          title: 'schema.sql',
          content: `-- PostgreSQL Database Schema for FoodieFlow
-- Designed by Atlas (Lead Architect)

CREATE TYPE order_status AS ENUM (
  'pending', 'preparing', 'in_transit', 'delivered', 'cancelled'
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  is_available BOOLEAN DEFAULT TRUE
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  status order_status DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`
        }
      }
    ]
  },
  {
    id: 'nova',
    name: 'Nova',
    role: 'Growth Hacker',
    avatar: 'NV',
    avatarBg: '#BDBE82', // Khaki
    status: 'Idle',
    activeTask: 'Awaiting instruction',
    messages: [
      { sender: 'agent', text: "Growth acquisition flows mapped. Ready to draft landing page headlines or funnel frameworks.", timestamp: '18:50' }
    ]
  },
  {
    id: 'solis',
    name: 'Solis',
    role: 'Product Lead',
    avatar: 'SL',
    avatarBg: '#889782', // Sage
    status: 'Active',
    activeTask: 'Reviewing User Feedback Metrics',
    messages: [
      { sender: 'agent', text: "Sprint tasks analyzed. Recommend focusing on delivery speed parameters to differentiate.", timestamp: '18:34' }
    ]
  },
  {
    id: 'vera',
    name: 'Vera',
    role: 'SecOps & QA',
    avatar: 'VR',
    avatarBg: '#B5996E', // Camel
    status: 'Working',
    activeTask: 'Fuzzing auth endpoints for vulnerabilities',
    messages: [
      { sender: 'agent', text: "Security scanner validated. Auth endpoints checked against OTP token bypass vulnerabilities.", timestamp: '19:15',
        artifact: {
          title: 'audit.json',
          content: `{
  "audit_version": "1.0.4",
  "status": "SECURE",
  "endpoints_scanned": 12,
  "vulnerabilities": []
}`
        }
      }
    ]
  },
  {
    id: 'aura',
    name: 'Aura',
    role: 'Creative Dir.',
    avatar: 'AR',
    avatarBg: '#6B7D5F', // Forest green
    status: 'Active',
    activeTask: 'Polishing UI styling system',
    messages: [
      { sender: 'agent', text: "Color system loaded. Matte dark olive palette compiled with crisp electric lime highlights.", timestamp: '18:42' }
    ]
  }
];

export default function App() {
  const [agents, setAgents] = useState(initialAgents);
  const [activeAgentId, setActiveAgentId] = useState('atlas');
  const [userInput, setUserInput] = useState('');
  const [activeProject, setActiveProject] = useState('Food Delivery App');
  const [copiedId, setCopiedId] = useState(null);
  
  // Minimal completion ratio
  const [completionPercentage, setCompletionPercentage] = useState(60);

  // Project sprint items
  const [roadmap, setRoadmap] = useState([
    { id: 1, text: 'Design relational database layout & geospatial indexing', completed: true },
    { id: 2, text: 'Establish JWT and OTP Authentication schemes', completed: true },
    { id: 3, text: 'Build real-time courier geo-coordinate dispatch module', completed: true },
    { id: 4, text: 'Create checkout funnel and Stripe API integration', completed: false },
    { id: 5, text: 'Set up end-to-end integration and load testing suites', completed: false }
  ]);

  const projects = {
    'Food Delivery App': {
      stack: 'React Native, FastAPI, PostgreSQL, Redis'
    },
    'FounderFlow Dashboard': {
      stack: 'React, Vite, CSS Grid, Geist Mono'
    },
    'Autonomous Logistics': {
      stack: 'Rust, Go, C++, AWS IoT'
    }
  };

  const activeAgent = agents.find(a => a.id === activeAgentId);
  const chatEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeAgent.messages]);

  // Sync completion ratio on initial mount
  useEffect(() => {
    const completedCount = roadmap.filter(t => t.completed).length;
    setCompletionPercentage(Math.round((completedCount / roadmap.length) * 100));
  }, []);

  // Toggle checklist tasks
  const handleToggleTask = (id) => {
    const updatedRoadmap = roadmap.map(task => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setRoadmap(updatedRoadmap);

    const completedCount = updatedRoadmap.filter(t => t.completed).length;
    setCompletionPercentage(Math.round((completedCount / updatedRoadmap.length) * 100));
  };

  // Copy code artifact to clipboard
  const handleCopyText = (content, title) => {
    navigator.clipboard.writeText(content);
    setCopiedId(title);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handle message post
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMessageText = userInput;
    setUserInput('');

    // Append user message
    const userMessage = {
      sender: 'user',
      text: userMessageText,
      timestamp: new Date().toTimeString().slice(0, 5)
    };

    setAgents(prevAgents => 
      prevAgents.map(agent => {
        if (agent.id === activeAgentId) {
          return {
            ...agent,
            messages: [...agent.messages, userMessage],
            status: 'Working',
            activeTask: `Refining requested deliverables`
          };
        }
        return agent;
      })
    );

    // Simulate thinking delay (1.5 seconds)
    setTimeout(() => {
      const response = getSimulatedResponse(activeAgent.name, userMessageText);
      setAgents(prevAgents => 
        prevAgents.map(agent => {
          if (agent.id === activeAgentId) {
            return {
              ...agent,
              status: 'Active',
              activeTask: 'Awaiting instruction',
              messages: [
                ...agent.messages,
                {
                  sender: 'agent',
                  text: response.text,
                  timestamp: new Date().toTimeString().slice(0, 5),
                  artifact: response.artifact
                }
              ]
            };
          }
          return agent;
        })
      );
    }, 1500);
  };

  // Mock responses with matching artifacts
  const getSimulatedResponse = (agentName, query) => {
    const q = query.toLowerCase();
    
    if (agentName === 'Atlas') {
      if (q.includes('schema') || q.includes('database') || q.includes('sql')) {
        return {
          text: "I've structured a migration update. Exposing relational tables and active coordinates tracker index mapping.",
          artifact: {
            title: 'migration.sql',
            content: `-- PostgreSQL Database Update
ALTER TABLE orders ADD COLUMN tracker POINT;
CREATE INDEX idx_orders_tracker ON orders USING gist(tracker);`
          }
        };
      }
      return {
        text: "I've structured the Actix-web listener wrapper setup config files.",
        artifact: {
          title: 'main.rs',
          content: `// Minimal API Wrapper
use actix_web::{get, App, HttpResponse, HttpServer, Responder};

#[get("/status")]
async fn status() -> impl Responder {
    HttpResponse::Ok().body("OK")
}`
        }
      };
    } else if (agentName === 'Nova') {
      return {
        text: "Launch slogans and copy structures updated for the campaign.",
        artifact: {
          title: 'copy.md',
          content: `# Launch Campaign Copy
- Tagline: Local gourmet, 15-minute delivery.
- Objective: Convert top-of-funnel downtown traffic.`
        }
      };
    } else if (agentName === 'Vera') {
      return {
        text: "Security headers audited. Recommendations exported below.",
        artifact: {
          title: 'security.yaml',
          content: `headers:
  strict-transport-security: max-age=31536000; includeSubDomains
  x-frame-options: DENY`
        }
      };
    }
    
    return {
      text: "Deliverables compiled and cached in workspace registry.",
      artifact: null
    };
  };

  return (
    <div className="dashboard-container">
      {/* Matte paper grain texture overlay */}
      <div className="noise-overlay"></div>

      {/* Top Bar */}
      <header className="top-bar">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: '800', letterSpacing: '0.12em', color: 'var(--text-warm)' }}>
            FOUNDER<span style={{ color: 'var(--accent-lime)' }}>//</span>FLOW
          </span>
        </div>
        
        {/* Project Name Center */}
        <div style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em', color: 'var(--text-warm)' }}>
          {activeProject.toUpperCase()}
        </div>

        {/* One status dot right */}
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

      {/* Main Container */}
      <div className="dashboard-body">
        
        {/* Left Sidebar (AI Agents list) */}
        <aside className="sidebar">
          <div className="sidebar-content">
            {agents.map((agent) => (
              <div 
                key={agent.id} 
                className={`agent-card-wrapper ${agent.status === 'Working' ? 'working' : ''}`}
              >
                <div 
                  className={`agent-card ${activeAgentId === agent.id ? 'active' : ''}`}
                  onClick={() => setActiveAgentId(agent.id)}
                >
                  <div className="agent-avatar" style={{ backgroundColor: agent.avatarBg }}>
                    {agent.avatar}
                  </div>
                  
                  <div className="agent-info">
                    <span className="agent-name">{agent.name}</span>
                    <span className="agent-role-badge">{agent.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Center Workspace (Chat dialogue) */}
        <main className="main-workspace">
          {/* Active Workspace Header */}
          <div className="workspace-header">
            <div className="workspace-title-row">
              <span style={{ fontWeight: '800', fontSize: '13px', color: 'var(--text-warm)' }}>
                {activeAgent.name.toUpperCase()}
              </span>
              <span style={{ color: '#a4aa8e', fontSize: '11px' }}>
                ({activeAgent.role})
              </span>
            </div>
            
            <div className="active-task-indicator">
              <span>TASK: {activeAgent.activeTask}</span>
            </div>
          </div>

          {/* Chat Container */}
          <div className="chat-container">
            {activeAgent.messages.map((msg, index) => (
              <div 
                key={index} 
                className={`chat-message ${msg.sender === 'user' ? 'user' : 'agent'}`}
              >
                <div className="chat-bubble">
                  <div className="chat-sender-label">
                    {msg.sender === 'user' ? 'YOU' : activeAgent.name.toUpperCase()}
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

          {/* Minimal Send Input bar */}
          <form onSubmit={handleSendMessage} className="chat-input-bar">
            <div className="chat-input-container">
              <input 
                type="text" 
                className="chat-text-input" 
                placeholder={`Message ${activeAgent.name}...`} 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
            </div>
            <button type="submit" className="send-button">
              <span className="material-symbols-outlined" style={{ fontSize: '18px', fontWeight: 'bold' }}>send</span>
            </button>
          </form>
        </main>

        {/* Right Project Context Panel */}
        <aside className="right-panel">
          {/* Project Details Header */}
          <div className="right-panel-header">
            <span style={{ fontSize: '9px', color: '#a4aa8e', fontWeight: '700', letterSpacing: '0.1em' }}>
              PROJECT
            </span>
            <h2 className="right-panel-title" style={{ marginTop: '6px' }}>
              {activeProject}
            </h2>
            
            {/* 3-4 Tech Tags */}
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
            
            {/* Simple switch project options */}
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

      </div>
    </div>
  );
}