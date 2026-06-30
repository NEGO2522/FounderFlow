import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import { supabase } from '../lib/supabase';
import '../styles/settings.css';

export default function SettingsPage({
  agents,
  activeAgent,
  setActiveAgentId,
  activeSettingsTab,
  setActiveSettingsTab,
  handleToggleAgent,
  handleModelChange,
  isAddingAgent,
  setIsAddingAgent,
  newAgentName,
  setNewAgentName,
  newAgentRole,
  setNewAgentRole,
  newAgentLink,
  setNewAgentLink,
  handleAddNewAgent,
  projects,
  handleRoleChange,
  setActiveProjectKey,
  user,
  apiKey,
  setApiKey,
  handleSaveApiKey,
  keySaved
}) {
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!newAgentName.trim()) errors.name = true;
    if (!newAgentRole.trim()) errors.role = true;
    if (!newAgentLink.trim()) errors.link = true;
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    handleAddNewAgent(e);
  };

  const renderAgentsTab = () => {
    return (
      <>
        <div className="settings-header-row">
          <div>
            <h2 className="settings-title">Your AI Team</h2>
            <div className="settings-subtitle">Turn agents on or off. Edit what each one does.</div>
            <button 
              onClick={() => navigate('/new-project')}
              style={{
                background: 'transparent',
                border: '1px solid #C8F04A',
                color: '#C8F04A',
                fontFamily: 'Geist Mono',
                fontSize: '10px',
                letterSpacing: '0.1em',
                padding: '8px 16px',
                cursor: 'pointer',
                marginTop: '8px'
              }}
            >
              ⟳ Change Workflow
            </button>
          </div>
        </div>

        {/* List of Agents Settings */}
        <div className="settings-card-list">
          {agents.map((agent) => (
            <div 
              key={agent.id} 
              className="settings-card"
              style={{ 
                opacity: agent.enabled ? 1 : 0.4,
                transition: 'opacity 0.2s ease'
              }}
            >
              <div className="settings-card-left">
                <div 
                  className="agent-avatar"
                  style={{ borderColor: agent.enabled ? '' : '#2E3320' }}
                >
                  {agent.avatar}
                </div>
                <div className="settings-agent-details">
                  <span className="settings-agent-name">{agent.name}</span>
                  <span 
                    className="settings-agent-role"
                    style={{ color: agent.enabled ? '' : '#6B7155' }}
                  >
                    {agent.role}
                  </span>
                </div>
              </div>
              
              <div className="settings-card-right">

                {/* Flat Toggle Switch */}
                <div 
                  className={`flat-toggle ${agent.enabled ? 'enabled' : 'disabled'}`}
                  onClick={() => handleToggleAgent(agent.id)}
                  title={agent.enabled ? 'Click to Disable' : 'Click to Enable'}
                >
                  <span className="toggle-dot"></span>
                </div>

                <button 
                  className="outline-btn"
                  onClick={() => {
                    const newRole = prompt(`New role for ${agent.name}:`, agent.role)
                    if (newRole && newRole.trim()) {
                      handleRoleChange(agent.id, newRole.trim())
                    }
                  }}
                >
                  Edit Role
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Agent trigger button */}
        {!isAddingAgent ? (
          <button className="lime-btn" style={{ marginTop: '8px' }} onClick={() => setIsAddingAgent(true)}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
            Add New Agent
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="settings-form-container" style={{ marginTop: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-lime)' }}>CREATE NEW AI CO-FOUNDER</span>
            <div className="settings-form-grid">
              <div className="settings-form-group">
                <label className="settings-label">Agent Name</label>
                <input 
                  type="text" 
                  className="settings-input" 
                  placeholder="e.g. Vector" 
                  value={newAgentName}
                  onChange={(e) => {
                    setNewAgentName(e.target.value);
                    setFormErrors(prev => ({ ...prev, name: false }));
                  }}
                  required
                  style={{ border: formErrors.name ? '1px solid #ff6b6b' : '1px solid #2E3320' }}
                />
                {formErrors.name && (
                  <span style={{
                    color: '#ff6b6b',
                    fontSize: '10px',
                    fontFamily: 'Geist Mono',
                    display: 'block',
                    marginTop: '4px'
                  }}>
                    This field is required
                  </span>
                )}
              </div>
              <div className="settings-form-group">
                <label className="settings-label">Agent Role</label>
                <input 
                  type="text" 
                  className="settings-input" 
                  placeholder="e.g. Systems engineer" 
                  value={newAgentRole}
                  onChange={(e) => {
                    setNewAgentRole(e.target.value);
                    setFormErrors(prev => ({ ...prev, role: false }));
                  }}
                  required
                  style={{ border: formErrors.role ? '1px solid #ff6b6b' : '1px solid #2E3320' }}
                />
                {formErrors.role && (
                  <span style={{
                    color: '#ff6b6b',
                    fontSize: '10px',
                    fontFamily: 'Geist Mono',
                    display: 'block',
                    marginTop: '4px'
                  }}>
                    This field is required
                  </span>
                )}
              </div>
            </div>
            <div className="settings-form-group" style={{ maxWidth: '400px' }}>
              <label className="settings-label">AI Tool Link</label>
              <input 
                type="url"
                className="settings-input"
                placeholder="e.g. https://chat.openai.com"
                value={newAgentLink}
                onChange={(e) => {
                  setNewAgentLink(e.target.value);
                  setFormErrors(prev => ({ ...prev, link: false }));
                }}
                required
                style={{ border: formErrors.link ? '1px solid #ff6b6b' : '1px solid #2E3320' }}
              />
              {formErrors.link && (
                <span style={{
                  color: '#ff6b6b',
                  fontSize: '10px',
                  fontFamily: 'Geist Mono',
                  display: 'block',
                  marginTop: '4px'
                }}>
                  This field is required
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button type="submit" className="lime-btn">Create Agent</button>
              <button type="button" className="outline-btn" onClick={() => setIsAddingAgent(false)}>Cancel</button>
            </div>
          </form>
        )}
      </>
    );
  };

  const renderApiKeyTab = () => (
    <>
      <div className="settings-header-row">
        <div>
          <h2 className="settings-title">Connect Your AI</h2>
          <div className="settings-subtitle">
            Add your OpenAI key to make your AI team actually work.
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '500px', marginTop: '24px' }}>
        <label className="settings-label">OpenAI API Key</label>
        <input
          type="password"
          className="settings-input"
          placeholder="sk-..."
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <p style={{ 
          fontSize: '11px', color: '#6B7155', 
          marginTop: '8px', fontFamily: 'Geist Mono' 
        }}>
          Your key is encrypted and only used to power your 5 AI agents. 
          Get one at platform.openai.com/api-keys
        </p>

        <button 
          onClick={handleSaveApiKey}
          style={{
            marginTop: '16px',
            padding: '10px 20px',
            background: '#C8F04A',
            border: 'none',
            color: '#0F1109',
            fontSize: '11px',
            fontWeight: 'bold',
            fontFamily: 'Geist Mono',
            cursor: 'pointer'
          }}
        >
          Save Key
        </button>

        {keySaved && (
          <span style={{ 
            marginLeft: '12px', color: '#C8F04A', 
            fontSize: '11px', fontFamily: 'Geist Mono' 
          }}>
            ● Saved
          </span>
        )}
      </div>
    </>
  );

  const renderBillingTab = () => (
    <>
      <div className="settings-header-row">
        <div>
          <h2 className="settings-title">Pick Your Plan</h2>
          <div className="settings-subtitle">
            Start free. Upgrade when you're ready.
          </div>
        </div>
      </div>

      <div className="billing-plans-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr', 
        gap: '16px',
        marginTop: '24px'
      }}>
        
        {/* FREE PLAN */}
        <div style={{
          background: '#12150D',
          border: '1px solid #2E3320',
          padding: '28px',
          fontFamily: 'Geist Mono'
        }}>
          <div style={{ 
            fontSize: '10px', color: '#6B7155', 
            letterSpacing: '0.1em', marginBottom: '12px' 
          }}>FREE</div>
          <div style={{ 
            fontSize: '28px', fontWeight: 'bold', 
            color: '#E8EDD4', marginBottom: '4px' 
          }}>$0</div>
          <div style={{ 
            fontSize: '11px', color: '#6B7155', 
            marginBottom: '24px' 
          }}>Always free, no card needed</div>
          
          <div style={{ 
            fontSize: '11px', color: '#9AA066', 
            lineHeight: '2', marginBottom: '24px' 
          }}>
            ✓ 3 AI Agents<br/>
            ✓ 1 Active Project<br/>
            ✓ Basic workflow<br/>
            ✓ Community help
          </div>

          <div style={{
            padding: '10px',
            border: '1px solid #2E3320',
            color: '#6B7155',
            fontSize: '11px',
            textAlign: 'center',
            letterSpacing: '0.05em'
          }}>
            Your Current Plan
          </div>
        </div>

        {/* PREMIUM PLAN */}
        <div style={{
          background: '#12150D',
          border: '2px solid #C8F04A',
          padding: '28px',
          fontFamily: 'Geist Mono',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '-1px', right: '20px',
            background: '#C8F04A',
            color: '#0F1109',
            fontSize: '9px',
            fontWeight: 'bold',
            padding: '3px 10px',
            letterSpacing: '0.1em'
          }}>POPULAR</div>

          <div style={{ 
            fontSize: '10px', color: '#C8F04A', 
            letterSpacing: '0.1em', marginBottom: '12px' 
          }}>PREMIUM</div>
          <div style={{ 
            fontSize: '28px', fontWeight: 'bold', 
            color: '#E8EDD4', marginBottom: '4px' 
          }}>$25</div>
          <div style={{ 
            fontSize: '11px', color: '#6B7155', 
            marginBottom: '24px' 
          }}>billed monthly</div>
          
          <div style={{ 
            fontSize: '11px', color: '#9AA066', 
            lineHeight: '2', marginBottom: '24px' 
          }}>
            ✓ All 5 AI Agents<br/>
            ✓ Unlimited Projects<br/>
            ✓ Custom workflows<br/>
            ✓ Fast support<br/>
            ✓ Ready templates<br/>
            ✓ Team access
          </div>

          <button style={{
            width: '100%',
            padding: '10px',
            background: '#C8F04A',
            border: 'none',
            color: '#0F1109',
            fontSize: '11px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontFamily: 'Geist Mono',
            letterSpacing: '0.05em'
          }}>
            Upgrade Now →
          </button>
        </div>

        {/* ENTERPRISE PLAN */}
        <div style={{
          background: '#12150D',
          border: '1px solid #2E3320',
          padding: '28px',
          fontFamily: 'Geist Mono'
        }}>
          <div style={{ 
            fontSize: '10px', color: '#6B7155', 
            letterSpacing: '0.1em', marginBottom: '12px' 
          }}>ENTERPRISE</div>
          <div style={{ 
            fontSize: '28px', fontWeight: 'bold', 
            color: '#E8EDD4', marginBottom: '4px' 
          }}>Custom</div>
          <div style={{ 
            fontSize: '11px', color: '#6B7155', 
            marginBottom: '24px' 
          }}>let's talk pricing</div>
          
          <div style={{ 
            fontSize: '11px', color: '#9AA066', 
            lineHeight: '2', marginBottom: '24px' 
          }}>
            ✓ Everything in Premium<br/>
            ✓ Your own support team<br/>
            ✓ We build what you need<br/>
            ✓ Uptime guaranteed<br/>
            ✓ Host it yourself<br/>
            ✓ We train your team
          </div>

          <button 
            onClick={() => window.open('mailto:hello@founderflow.ai', '_blank')}
            style={{
              width: '100%',
              padding: '10px',
              background: 'transparent',
              border: '1px solid #2E3320',
              color: '#E8EDD4',
              fontSize: '11px',
              cursor: 'pointer',
              fontFamily: 'Geist Mono',
              letterSpacing: '0.05em'
            }}
            onMouseEnter={e => {
              e.target.style.borderColor = '#C8F04A'
              e.target.style.color = '#C8F04A'
            }}
            onMouseLeave={e => {
              e.target.style.borderColor = '#2E3320'
              e.target.style.color = '#E8EDD4'
            }}
          >
            Talk to Us →
          </button>
        </div>
      </div>
    </>
  );

  const renderProjectsTab = () => (
    <>
      <div className="settings-header-row">
        <div>
          <h2 className="settings-title">Your Projects</h2>
          <div className="settings-subtitle">All your active projects in one place.</div>
        </div>
      </div>
      <div className="settings-card-list">
        {Object.values(projects).map((project) => (
          <div key={project.id} className="settings-card">
            <div className="settings-agent-details">
              <span className="settings-agent-name">
                {project.name || project.id}
              </span>
              <span className="settings-agent-role">
                {project.status || 'ACTIVE'} · Created by you
              </span>
            </div>
            <button 
              className="outline-btn"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              Open →
            </button>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="dashboard-container">
      <div className="noise-overlay"></div>
      <TopBar title="SETTINGS" onMenuClick={() => setMobileSidebarOpen(true)} />

      <div className="dashboard-body">
        <Sidebar 
          agents={agents} 
          activeAgentId={activeAgent?.id} 
          setActiveAgentId={setActiveAgentId} 
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        <div className="settings-container">
          {/* Left Settings Tabs */}
          <aside className="settings-nav">
            <button 
              className={`settings-nav-btn ${activeSettingsTab === 'agents' ? 'active' : ''}`}
              onClick={() => setActiveSettingsTab('agents')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>smart_toy</span>
              AI Agents
            </button>
            <button 
              className={`settings-nav-btn ${activeSettingsTab === 'api-key' ? 'active' : ''}`}
              onClick={() => setActiveSettingsTab('api-key')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>key</span>
              API Key
            </button>
            <button 
              className={`settings-nav-btn ${activeSettingsTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveSettingsTab('projects')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>folder</span>
              Projects
            </button>
            <button 
              className={`settings-nav-btn ${activeSettingsTab === 'billing' ? 'active' : ''}`}
              onClick={() => setActiveSettingsTab('billing')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>credit_card</span>
              Billing
            </button>
          </aside>

          {/* Right Tab Content */}
          <section className="settings-content">
            {activeSettingsTab === 'agents' && renderAgentsTab()}
            {activeSettingsTab === 'api-key' && renderApiKeyTab()}
            {activeSettingsTab === 'projects' && renderProjectsTab()}
            {activeSettingsTab === 'billing' && renderBillingTab()}
          </section>
        </div>
      </div>
    </div>
  );
}
