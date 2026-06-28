import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { initialAgents } from './data/agents';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import './styles/global.css';

export default function App() {
  const [agents, setAgents] = useState(initialAgents);
  const [activeAgentId, setActiveAgentId] = useState('chatgpt');
  const [userInput, setUserInput] = useState('');
  const [activeProject, setActiveProject] = useState('Food Delivery App');
  const [copiedId, setCopiedId] = useState(null);

  // Settings tab selections
  const [activeSettingsTab, setActiveSettingsTab] = useState('agents');
  
  // Add Agent Form State
  const [isAddingAgent, setIsAddingAgent] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentRole, setNewAgentRole] = useState('');
  const [newAgentModel, setNewAgentModel] = useState('Claude 3.5 Sonnet');

  // completion metrics
  const [completionPercentage, setCompletionPercentage] = useState(60);

  // sprint roadmap checklist
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

  const visibleAgents = agents.filter(agent => agent.enabled);
  const activeAgent = agents.find(a => a.id === activeAgentId) || visibleAgents[0] || agents[0];
  
  const chatEndRef = useRef(null);

  // Scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeAgent?.messages]);

  // Sync completion ratio
  useEffect(() => {
    const completedCount = roadmap.filter(t => t.completed).length;
    setCompletionPercentage(Math.round((completedCount / roadmap.length) * 100));
  }, []);

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

  const handleCopyText = (content, title) => {
    navigator.clipboard.writeText(content);
    setCopiedId(title);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleAgent = (id) => {
    setAgents(prev => prev.map(agent => {
      if (agent.id === id) {
        return { ...agent, enabled: !agent.enabled };
      }
      return agent;
    }));
  };

  const handleModelChange = (id, model) => {
    setAgents(prev => prev.map(agent => {
      if (agent.id === id) {
        return { ...agent, model };
      }
      return agent;
    }));
  };

  const handleAddNewAgent = (e) => {
    e.preventDefault();
    if (!newAgentName.trim() || !newAgentRole.trim()) return;

    const newId = newAgentName.toLowerCase().replace(/\s+/g, '-');
    const initials = newAgentName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    
    const colors = ['#8F9E6C', '#BDBE82', '#889782', '#B5996E', '#6B7D5F'];
    const randomBg = colors[Math.floor(Math.random() * colors.length)];

    const newAgent = {
      id: newId,
      name: newAgentName,
      role: newAgentRole,
      avatar: initials,
      avatarBg: randomBg,
      status: 'Active',
      enabled: true,
      model: newAgentModel,
      activeTask: 'Awaiting instruction',
      messages: [
        { sender: 'agent', text: `Agent ${newAgentName} provisioned successfully. Running on ${newAgentModel}. How can I assist?`, timestamp: new Date().toTimeString().slice(0, 5) }
      ]
    };

    setAgents(prev => [...prev, newAgent]);
    setNewAgentName('');
    setNewAgentRole('');
    setIsAddingAgent(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userInput.trim() || !activeAgent) return;

    const userMessageText = userInput;
    setUserInput('');

    const userMessage = {
      sender: 'user',
      text: userMessageText,
      timestamp: new Date().toTimeString().slice(0, 5)
    };

    setAgents(prevAgents => 
      prevAgents.map(agent => {
        if (agent.id === activeAgent.id) {
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

    setTimeout(() => {
      const response = getSimulatedResponse(activeAgent.name, userMessageText);
      setAgents(prevAgents => 
        prevAgents.map(agent => {
          if (agent.id === activeAgent.id) {
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

  const getSimulatedResponse = (agentName, query) => {
    const q = query.toLowerCase();
    
    if (agentName === 'DeepSeek' || agentName === 'Claude') {
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
    } else if (agentName === 'ChatGPT') {
      return {
        text: "Launch slogans and copy structures updated for the campaign.",
        artifact: {
          title: 'copy.md',
          content: `# Launch Campaign Copy
- Tagline: Local gourmet, 15-minute delivery.
- Objective: Convert top-of-funnel downtown traffic.`
        }
      };
    } else if (agentName === 'Gemini' || agentName === 'Perplexity') {
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
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/dashboard" element={
        <DashboardPage 
          agents={agents}
          activeAgent={activeAgent}
          setActiveAgentId={setActiveAgentId}
          userInput={userInput}
          setUserInput={setUserInput}
          activeProject={activeProject}
          setActiveProject={setActiveProject}
          copiedId={copiedId}
          handleCopyText={handleCopyText}
          roadmap={roadmap}
          handleToggleTask={handleToggleTask}
          completionPercentage={completionPercentage}
          projects={projects}
          handleSendMessage={handleSendMessage}
          chatEndRef={chatEndRef}
        />
      } />
      <Route path="/settings" element={
        <SettingsPage 
          agents={agents}
          activeAgent={activeAgent}
          setActiveAgentId={setActiveAgentId}
          activeSettingsTab={activeSettingsTab}
          setActiveSettingsTab={setActiveSettingsTab}
          handleToggleAgent={handleToggleAgent}
          handleModelChange={handleModelChange}
          isAddingAgent={isAddingAgent}
          setIsAddingAgent={setIsAddingAgent}
          newAgentName={newAgentName}
          setNewAgentName={setNewAgentName}
          newAgentRole={newAgentRole}
          setNewAgentRole={setNewAgentRole}
          newAgentModel={newAgentModel}
          setNewAgentModel={setNewAgentModel}
          handleAddNewAgent={handleAddNewAgent}
          projects={projects}
        />
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
