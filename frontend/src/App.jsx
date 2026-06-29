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
import ProjectSetupPage from './pages/ProjectSetupPage';
import { supabase } from './lib/supabase';
import { useDatabase } from './hooks/useDatabase';
import './styles/global.css';

// Auth Protection Guard Wrappers
const Protected = ({ isAuthenticated, isGuest, children }) => {
  return (isAuthenticated || isGuest) ? children : <Navigate to="/" replace />;
};

const Public = ({ isAuthenticated, isGuest, hasProjects, children }) => {
  if (isAuthenticated || isGuest) {
    return hasProjects ? <Navigate to="/dashboard" replace /> : <Navigate to="/new-project" replace />;
  }
  return children;
};

export default function App() {
  const [agents, setAgents] = useState(initialAgents);
  const [activeAgentId, setActiveAgentId] = useState('chatgpt');
  const [userInput, setUserInput] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [user, setUser] = useState(null);
  const [hasProjects, setHasProjects] = useState(null);

  // Database Sync Hook
  const { 
    saveProject, 
    saveTasks, 
    loadProjects, 
    saveAgents, 
    loadAgents 
  } = useDatabase(user);

  // Settings tab selections
  const [activeSettingsTab, setActiveSettingsTab] = useState('agents');
  
  // Add Agent Form State
  const [isAddingAgent, setIsAddingAgent] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentRole, setNewAgentRole] = useState('');
  const [newAgentLink, setNewAgentLink] = useState('');
  const chatEndRef = useRef(null);

  // Lifted projects list state
  const [activeProjectKey, setActiveProjectKey] = useState(null);
  const [projectsList, setProjectsList] = useState({});

  // Synchronization callback listener for auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setUser(session?.user || null);
      setAuthLoading(false);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session);
        setUser(session?.user || null);
        if (!session) {
          setIsGuest(false);
          setHasProjects(null);
        }
      }
    );

    const handleGuestLogout = () => {
      setIsGuest(false);
      setHasProjects(null);
    };

    window.addEventListener("ff_guest_logout", handleGuestLogout);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("ff_guest_logout", handleGuestLogout);
    };
  }, []);

  // Data loading useEffect (called unconditionally to follow the Rules of Hooks)
  useEffect(() => {
    if (!user) {
      setHasProjects(null);
      return;
    }

    const initData = async () => {
      const savedProjects = await loadProjects();
      if (savedProjects && Object.keys(savedProjects).length > 0) {
        setProjectsList(savedProjects);
        const keys = Object.keys(savedProjects);
        setActiveProjectKey(keys[0]);
        setHasProjects(true);
      } else {
        // First-time user - they have no projects yet
        setHasProjects(false);
      }

      const savedAgents = await loadAgents();
      if (savedAgents && savedAgents.length > 0) {
        setAgents(savedAgents);
        setActiveAgentId(savedAgents[0].id);
      }
    };

    initData();
  }, [user]);

  // Guest bypass skips setup
  useEffect(() => {
    if (isGuest) {
      setHasProjects(true);
    }
  }, [isGuest]);

  if (authLoading || (user && hasProjects === null)) return (
    <div style={{
      display: 'flex', alignItems: 'center', 
      justifyContent: 'center', height: '100vh',
      background: '#0F1109', color: '#C8F04A',
      fontFamily: 'Geist Mono', fontSize: '12px',
      letterSpacing: '0.15em'
    }}>
      INITIALIZING FOUNDERFLOW...
    </div>
  );

  const activeProjectData = activeProjectKey 
    ? projectsList[activeProjectKey] 
    : Object.values(projectsList)[0] || null;

  // Derived states to maintain full backward compatibility with DashboardPage / SettingsPage props!
  const activeProject = activeProjectData?.name || 'No Project';
  const roadmap = activeProjectData?.roadmap || [];

  const getProgress = (proj) => {
    if (!proj || !proj.roadmap || proj.roadmap.length === 0) return 0;
    const r = proj.roadmap;
    const completedCount = r.filter(t => t.completed).length;
    return Math.round((completedCount / r.length) * 100);
  };

  const completionPercentage = activeProjectData 
    ? getProgress(activeProjectData) 
    : 0;

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
    if (!activeProjectKey || !activeProjectData) return;
    handleToggleProjectTask(activeProjectKey, taskId);
    const updated = activeProjectData.roadmap.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    saveTasks(activeProjectKey, updated);
  };

  const handleToggleAgent = (agentId) => {
    const updated = agents.map(a =>
      a.id === agentId 
        ? { ...a, enabled: !a.enabled } 
        : a
    );
    setAgents(updated);
    saveAgents(updated);
    
    // If disabled agent was active, 
    // switch to first enabled agent
    const toggledAgent = updated.find(a => a.id === agentId);
    if (!toggledAgent.enabled && activeAgentId === agentId) {
      const firstEnabled = updated.find(a => a.enabled);
      if (firstEnabled) setActiveAgentId(firstEnabled.id);
    }
  };

  const handleModelChange = (agentId, modelName) => {
    setAgents(
      agents.map((agent) =>
        agent.id === agentId ? { ...agent, activeModel: modelName } : agent
      )
    );
  };

  const handleRoleChange = (agentId, newRole) => {
    const updated = agents.map(a => 
      a.id === agentId ? { ...a, role: newRole } : a
    );
    setAgents(updated);
    saveAgents(updated);
  };

  const handleAddNewAgent = (e) => {
    e.preventDefault();
    
    // Validation
    if (!newAgentName.trim()) {
      alert('Agent name is required');
      return;
    }
    if (!newAgentRole.trim()) {
      alert('Agent role is required');
      return;
    }
    if (!newAgentLink.trim()) {
      alert('AI Tool link is required');
      return;
    }
    if (!newAgentLink.startsWith('http')) {
      alert('Please enter a valid URL starting with http');
      return;
    }

    const newAgent = {
      id: newAgentName.toLowerCase().replace(/\s+/g, '-'),
      name: newAgentName,
      role: newAgentRole,
      avatar: newAgentName.slice(0, 2).toUpperCase(),
      enabled: true,
      activeModel: 'Claude 3.5 Sonnet',
      activeTask: 'Awaiting directive...',
      link: newAgentLink,
      messages: [
        {
          sender: 'agent',
          text: `Co-founder ${newAgentName} has initialized. Role specified: "${newAgentRole}". Ready for deployment.`,
          timestamp: new Date().toTimeString().slice(0, 5)
        }
      ]
    };

    const updatedAgents = [...agents, newAgent];
    setAgents(updatedAgents);
    saveAgents(updatedAgents);
    setIsAddingAgent(false);
    setNewAgentName('');
    setNewAgentRole('');
    setNewAgentLink('');
  };

  const handleProjectLaunch = (newProject, configuredAgents) => {
    setProjectsList(prev => ({
      ...prev,
      [newProject.id]: newProject
    }));
    setAgents(configuredAgents);
    setActiveProjectKey(newProject.id);
    // Set first agent as active
    if (configuredAgents.length > 0) {
      setActiveAgentId(configuredAgents[0].id);
    }
    setHasProjects(true);
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

  return (
    <Routes>
      <Route path="/" element={
        (isAuthenticated || isGuest) ? (hasProjects ? <Navigate to="/dashboard" replace /> : <Navigate to="/new-project" replace />) : <LandingPage setGuestMode={() => setIsGuest(true)} />
      } />
      <Route path="/login" element={
        <Public isAuthenticated={isAuthenticated} isGuest={isGuest} hasProjects={hasProjects}>
          <LoginPage setGuestMode={() => setIsGuest(true)} />
        </Public>
      } />
      <Route path="/signup" element={
        <Public isAuthenticated={isAuthenticated} isGuest={isGuest} hasProjects={hasProjects}>
          <SignUpPage />
        </Public>
      } />
      <Route path="/new-project" element={
        <Protected isAuthenticated={isAuthenticated} isGuest={isGuest}>
          {hasProjects ? <Navigate to="/dashboard" replace /> : (
            <ProjectSetupPage 
              saveProject={saveProject}
              saveTasks={saveTasks}
              saveAgents={saveAgents}
              onProjectLaunch={handleProjectLaunch}
            />
          )}
        </Protected>
      } />
      <Route path="/new-project-fresh" element={
        <Protected isAuthenticated={isAuthenticated} isGuest={isGuest}>
          <ProjectSetupPage 
            saveProject={saveProject}
            saveTasks={saveTasks}
            saveAgents={saveAgents}
            onProjectLaunch={handleProjectLaunch}
            freshStart={true}
          />
        </Protected>
      } />
      <Route path="/dashboard" element={
        <Protected isAuthenticated={isAuthenticated} isGuest={isGuest}>
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
        <Protected isAuthenticated={isAuthenticated} isGuest={isGuest}>
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
            newAgentLink={newAgentLink}
            setNewAgentLink={setNewAgentLink}
            handleAddNewAgent={handleAddNewAgent}
            projects={projects}
            handleRoleChange={handleRoleChange}
            setActiveProjectKey={setActiveProjectKey}
          />
        </Protected>
      } />
      <Route path="/projects" element={
        <Protected isAuthenticated={isAuthenticated} isGuest={isGuest}>
          <ProjectsPage 
            agents={agents}
            activeAgentId={activeAgentId}
            setActiveAgentId={setActiveAgentId}
            projectsList={projectsList}
          />
        </Protected>
      } />
      <Route path="/projects/:id" element={
        <Protected isAuthenticated={isAuthenticated} isGuest={isGuest}>
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
