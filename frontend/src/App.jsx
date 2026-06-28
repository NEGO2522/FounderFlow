import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { initialAgents } from './data/agents';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import LandingPage from './pages/LandingPage';
import './styles/global.css';

export default function App() {
  const [agents, setAgents] = useState(initialAgents);
  const [activeAgentId, setActiveAgentId] = useState('chatgpt');
  const [userInput, setUserInput] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("ff_auth"));

  // Settings tab selections
  const [activeSettingsTab, setActiveSettingsTab] = useState('agents');
  
  // Add Agent Form State
  const [isAddingAgent, setIsAddingAgent] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentRole, setNewAgentRole] = useState('');
  const [newAgentModel, setNewAgentModel] = useState('Claude 3.5 Sonnet');

  // Lifted projects list state
  const [activeProjectKey, setActiveProjectKey] = useState('food-delivery-app');
  const [projectsList, setProjectsList] = useState({
    'food-delivery-app': {
      id: 'food-delivery-app',
      name: 'Food Delivery App',
      status: 'ACTIVE',
      stack: 'React Native, FastAPI, PostgreSQL, Redis',
      agents: ['chatgpt', 'claude', 'gemini', 'perplexity'],
      roadmap: [
        { id: 1, text: 'Design relational database layout & geospatial indexing', completed: true },
        { id: 2, text: 'Establish JWT and OTP Authentication schemes', completed: true },
        { id: 3, text: 'Build real-time courier geo-coordinate dispatch module', completed: true },
        { id: 4, text: 'Create checkout funnel and Stripe API integration', completed: false },
        { id: 5, text: 'Set up end-to-end integration and load testing suites', completed: false }
      ]
    },
    'founderflow-dashboard': {
      id: 'founderflow-dashboard',
      name: 'FounderFlow Dashboard',
      status: 'ACTIVE',
      stack: 'React, Vite, CSS Grid, Geist Mono',
      agents: ['deepseek', 'antigravity', 'windsurf'],
      roadmap: [
        { id: 1, text: 'Decompose monolithic code files into pages and components', completed: true },
        { id: 2, text: 'Configure custom layout routes and useNavigate redirects', completed: true },
        { id: 3, text: 'Style flat monochrome avatars with Geist Mono initials', completed: true },
        { id: 4, text: 'Integrate dynamic Projects registry list pages', completed: false }
      ]
    },
    'autonomous-logistics': {
      id: 'autonomous-logistics',
      name: 'Autonomous Logistics',
      status: 'PAUSED',
      stack: 'Rust, Go, C++, AWS IoT',
      agents: ['cursor', 'codex'],
      roadmap: [
        { id: 1, text: 'Provision AWS IoT device shadows and endpoints gateway', completed: true },
        { id: 2, text: 'Implement Rust packet parser logic with zero copy bindings', completed: false },
        { id: 3, text: 'Verify coordinate coordinate calculations fuzz scans', completed: false }
      ]
    }
  });

  // Synchronization callback listener for auth changes
  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(!!localStorage.getItem("ff_auth"));
    };
    window.addEventListener("ff_auth_login", handleAuthChange);
    window.addEventListener("ff_auth_logout", handleAuthChange);
    return () => {
      window.removeEventListener("ff_auth_login", handleAuthChange);
      window.removeEventListener("ff_auth_logout", handleAuthChange);
    };
  }, []);

  const activeProjectData = projectsList[activeProjectKey] || Object.values(projectsList)[0];

  // Derived states to maintain full backward compatibility with DashboardPage / SettingsPage props!
  const activeProject = activeProjectData.name;
  const roadmap = activeProjectData.roadmap;

  const getProgress = (proj) => {
    const r = proj.roadmap;
    const completedCount = r.filter(t => t.completed).length;
    return Math.round((completedCount / r.length) * 100);
  };

  const completionPercentage = getProgress(activeProjectData);

  const projects = Object.values(projectsList).reduce((acc, p) => {
    acc[p.name] = { stack: p.stack };
    return acc;
  }, {});

  const setActiveProject = (name) => {
    const found = Object.values(projectsList).find(p => p.name === name);
    if (found) {
      setActiveProjectKey(found.id);
    }
  };

  const visibleAgents = agents.filter(agent => agent.enabled);
  const activeAgent = agents.find(a => a.id === activeAgentId) || visibleAgents[0] || agents[0];
  
  const chatEndRef = useRef(null);

  // Scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeAgent?.messages]);

  const handleToggleTask = (id) => {
    setProjectsList(prev => {
      const currentProject = prev[activeProjectKey];
      const updatedRoadmap = currentProject.roadmap.map(task => {
        if (task.id === id) {
          return { ...task, completed: !task.completed };
        }
        return task;
      });
      return {
        ...prev,
        [activeProjectKey]: {
          ...currentProject,
          roadmap: updatedRoadmap
        }
      };
    });
  };

  const handleToggleProjectTask = (projectId, taskId) => {
    setProjectsList(prev => {
      const targetProject = prev[projectId];
      if (!targetProject) return prev;
      const updatedRoadmap = targetProject.roadmap.map(task => {
        if (task.id === taskId) {
          return { ...task, completed: !task.completed };
        }
        return task;
      });
      return {
        ...prev,
        [projectId]: {
          ...targetProject,
          roadmap: updatedRoadmap
        }
      };
    });
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
    
    const newAgent = {
      id: newId,
      name: newAgentName,
      role: newAgentRole,
      avatar: initials,
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

  // Auth Protection Guard Wrappers
  const Protected = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/" replace />;
  };

  const Public = ({ children }) => {
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
  };

  return (
    <Routes>
      <Route path="/" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />
      } />
      <Route path="/login" element={
        <Public>
          <LoginPage />
        </Public>
      } />
      <Route path="/signup" element={
        <Public>
          <SignUpPage />
        </Public>
      } />
      <Route path="/dashboard" element={
        <Protected>
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
        </Protected>
      } />
      <Route path="/settings" element={
        <Protected>
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
        </Protected>
      } />
      <Route path="/projects" element={
        <Protected>
          <ProjectsPage 
            agents={agents}
            activeAgentId={activeAgentId}
            setActiveAgentId={setActiveAgentId}
            projectsList={projectsList}
          />
        </Protected>
      } />
      <Route path="/projects/:id" element={
        <Protected>
          <ProjectDetailPage 
            agents={agents}
            activeAgentId={activeAgentId}
            setActiveAgentId={setActiveAgentId}
            projectsList={projectsList}
            handleToggleProjectTask={handleToggleProjectTask}
          />
        </Protected>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
