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
import { supabase } from './lib/supabase';
import './styles/global.css';

export default function App() {
  const [agents, setAgents] = useState(initialAgents);
  const [activeAgentId, setActiveAgentId] = useState('chatgpt');
  const [userInput, setUserInput] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  // Settings tab selections
  const [activeSettingsTab, setActiveSettingsTab] = useState('agents');
  
  // Add Agent Form State
  const [isAddingAgent, setIsAddingAgent] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentRole, setNewAgentRole] = useState('');
  const [newAgentModel, setNewAgentModel] = useState('Claude 3.5 Sonnet');
  const chatEndRef = useRef(null);

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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setAuthLoading(false);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session);
        if (!session) {
          setIsGuest(false);
        }
      }
    );

    const handleGuestLogout = () => {
      setIsGuest(false);
    };

    window.addEventListener("ff_guest_logout", handleGuestLogout);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("ff_guest_logout", handleGuestLogout);
    };
  }, []);

  if (authLoading) return (
    <div style={{
      display: 'flex', alignItems: 'center', 
      justifyContent: 'center', height: '100vh',
      background: '#0F1109', color: '#C8F04A',
      fontFamily: 'Geist Mono', fontSize: '12px',
      letterSpacing: '0.1em'
    }}>
      INITIALIZING FOUNDERFLOW...
    </div>
  );

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

  const handleToggleProjectTask = (projectId, taskId) => {
    setProjectsList(prev => {
      const proj = prev[projectId];
      if (!proj) return prev;
      const updatedRoadmap = proj.roadmap.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      return {
        ...prev,
        [projectId]: {
          ...proj,
          roadmap: updatedRoadmap
        }
      };
    });
  };

  const handleToggleTask = (taskId) => {
    handleToggleProjectTask(activeProjectKey, taskId);
  };

  const handleToggleAgent = (agentId) => {
    setAgents(
      agents.map((agent) =>
        agent.id === agentId ? { ...agent, enabled: !agent.enabled } : agent
      )
    );
  };

  const handleModelChange = (agentId, modelName) => {
    setAgents(
      agents.map((agent) =>
        agent.id === agentId ? { ...agent, activeModel: modelName } : agent
      )
    );
  };

  const handleAddNewAgent = (e) => {
    e.preventDefault();
    if (!newAgentName || !newAgentRole) return;

    const newAgent = {
      id: newAgentName.toLowerCase().replace(/\s+/g, '-'),
      name: newAgentName,
      role: newAgentRole,
      avatar: newAgentName.slice(0, 2).toUpperCase(),
      enabled: true,
      activeModel: newAgentModel,
      activeTask: 'Awaiting directive...',
      messages: [
        {
          sender: 'agent',
          text: `Co-founder ${newAgentName} has initialized. Role specified: "${newAgentRole}". Ready for deployment.`,
          timestamp: new Date().toTimeString().slice(0, 5)
        }
      ]
    };

    setAgents([...agents, newAgent]);
    setIsAddingAgent(false);
    setNewAgentName('');
    setNewAgentRole('');
  };

  const activeAgent = agents.find((a) => a.id === activeAgentId) || agents[0];

  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const projects = Object.values(projectsList).map(proj => ({
    id: proj.id,
    name: proj.name,
    status: proj.status,
    progress: getProgress(proj),
    agentsCount: proj.agents.length
  }));

  const setActiveProject = (projectName) => {
    const foundKey = Object.keys(projectsList).find(
      key => projectsList[key].name === projectName
    );
    if (foundKey) {
      setActiveProjectKey(foundKey);
    }
  };

  const handleSendMessage = (text) => {
    if (!text.trim()) return;

    setAgents(
      agents.map((agent) => {
        if (agent.id === activeAgentId) {
          return {
            ...agent,
            messages: [
              ...agent.messages,
              {
                sender: 'user',
                text: text,
                timestamp: new Date().toTimeString().slice(0, 5)
              }
            ]
          };
        }
        return agent;
      })
    );

    setUserInput('');

    setTimeout(() => {
      const response = getSimulatedResponse(activeAgent.name, text);
      setAgents(prevAgents => 
        prevAgents.map((agent) => {
          if (agent.id === activeAgentId) {
            return {
              ...agent,
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
            content: `-- PostgreSQL Database Update\nALTER TABLE orders ADD COLUMN tracker POINT;\nCREATE INDEX idx_orders_tracker ON orders USING gist(tracker);`
          }
        };
      }
      return {
        text: "I've structured the Actix-web listener wrapper setup config files.",
        artifact: {
          title: 'main.rs',
          content: `// Minimal API Wrapper\nuse actix_web::{get, App, HttpResponse, HttpServer, Responder};\n\n#[get("/status")]\nasync fn status() -> impl Responder {\n    HttpResponse::Ok().body("OK")\n}`
        }
      };
    } else if (agentName === 'ChatGPT') {
      return {
        text: "Launch slogans and copy structures updated for the campaign.",
        artifact: {
          title: 'copy.md',
          content: `# Launch Campaign Copy\n- Tagline: Local gourmet, 15-minute delivery.\n- Objective: Convert top-of-funnel downtown traffic.`
        }
      };
    } else if (agentName === 'Gemini' || agentName === 'Perplexity') {
      return {
        text: "Security headers audited. Recommendations exported below.",
        artifact: {
          title: 'security.yaml',
          content: `headers:\n  strict-transport-security: max-age=31536000; includeSubDomains\n  x-frame-options: DENY`
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
    return (isAuthenticated || isGuest) ? children : <Navigate to="/" replace />;
  };

  const Public = ({ children }) => {
    return (isAuthenticated || isGuest) ? <Navigate to="/dashboard" replace /> : children;
  };

  return (
    <Routes>
      <Route path="/" element={
        (isAuthenticated || isGuest) ? <Navigate to="/dashboard" replace /> : <LandingPage setGuestMode={() => setIsGuest(true)} />
      } />
      <Route path="/login" element={
        <Public>
          <LoginPage setGuestMode={() => setIsGuest(true)} />
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
