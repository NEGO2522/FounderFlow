import React from 'react';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
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
  newAgentModel,
  setNewAgentModel,
  handleAddNewAgent,
  projects
}) {
  const renderAgentsTab = () => {
    return (
      <>
        <div className="settings-header-row">
          <div>
            <h2 className="settings-title">AI Agents Orchestration</h2>
            <div className="settings-subtitle">Enable, disable, and choose underlying LLM models for your co-founder pool.</div>
          </div>
        </div>

        {/* List of Agents Settings */}
        <div className="settings-card-list">
          {agents.map((agent) => (
            <div key={agent.id} className="settings-card">
              <div className="settings-card-left">
                <div className="agent-avatar">
                  {agent.avatar}
                </div>
                <div className="settings-agent-details">
                  <span className="settings-agent-name">{agent.name}</span>
                  <span className="settings-agent-role">{agent.role}</span>
                </div>
              </div>
              
              <div className="settings-card-right">
                {/* Model Selector Dropdown */}
                <select 
                  className="settings-select"
                  value={agent.model}
                  onChange={(e) => handleModelChange(agent.id, e.target.value)}
                >
                  <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                  <option value="GPT-4o">GPT-4o</option>
                  <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
                  <option value="Llama 3.1 70B">Llama 3.1 70B</option>
                  <option value="DeepSeek Coder">DeepSeek Coder</option>
                </select>

                {/* Flat Toggle Switch */}
                <div 
                  className={`flat-toggle ${agent.enabled ? 'enabled' : 'disabled'}`}
                  onClick={() => handleToggleAgent(agent.id)}
                  title={agent.enabled ? 'Click to Disable' : 'Click to Enable'}
                >
                  <span className="toggle-dot"></span>
                </div>

                <button className="outline-btn">Configure</button>
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
          <form onSubmit={handleAddNewAgent} className="settings-form-container" style={{ marginTop: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-lime)' }}>CREATE NEW AI CO-FOUNDER</span>
            <div className="settings-form-grid">
              <div className="settings-form-group">
                <label className="settings-label">Agent Name</label>
                <input 
                  type="text" 
                  className="settings-input" 
                  placeholder="e.g. Vector" 
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  required
                />
              </div>
              <div className="settings-form-group">
                <label className="settings-label">Agent Role</label>
                <input 
                  type="text" 
                  className="settings-input" 
                  placeholder="e.g. Systems engineer" 
                  value={newAgentRole}
                  onChange={(e) => setNewAgentRole(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="settings-form-group" style={{ maxWidth: '300px' }}>
              <label className="settings-label">Primary AI Model</label>
              <select 
                className="settings-select"
                value={newAgentModel}
                onChange={(e) => setNewAgentModel(e.target.value)}
              >
                <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                <option value="GPT-4o">GPT-4o</option>
                <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
                <option value="Llama 3.1 70B">Llama 3.1 70B</option>
                <option value="DeepSeek Coder">DeepSeek Coder</option>
              </select>
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

  const renderGeneralTab = () => (
    <>
      <div className="settings-header-row">
        <div>
          <h2 className="settings-title">General Workspace Settings</h2>
          <div className="settings-subtitle">Configure naming limits and global synchronizations.</div>
        </div>
      </div>
      <div className="settings-form-container" style={{ maxWidth: '500px' }}>
        <div className="settings-dummy-field">
          <label className="settings-label">Workspace Identifier</label>
          <input type="text" className="settings-input" defaultValue="FounderFlow Ops Room" />
        </div>
        <div className="settings-dummy-field">
          <label className="settings-label">Operational Domain</label>
          <input type="text" className="settings-input" defaultValue="ops.founderflow.internal" />
        </div>
        <div className="settings-dummy-field">
          <label className="settings-label">Telemetry Heartbeat Interval</label>
          <select className="settings-select" style={{ minWidth: '100%' }}>
            <option>Every 3 seconds</option>
            <option>Every 10 seconds</option>
            <option>Manual polls only</option>
          </select>
        </div>
        <button className="outline-btn" style={{ width: 'fit-content', marginTop: '8px' }}>Save Changes</button>
      </div>
    </>
  );

  const renderProjectsTab = () => (
    <>
      <div className="settings-header-row">
        <div>
          <h2 className="settings-title">Project Registry</h2>
          <div className="settings-subtitle">Manage namespaces and directories for active code structures.</div>
        </div>
      </div>
      <div className="settings-card-list">
        {Object.keys(projects).map((proj) => (
          <div key={proj} className="settings-card">
            <div className="settings-agent-details">
              <span className="settings-agent-name">{proj}</span>
              <span className="settings-agent-role">Stack: {projects[proj].stack}</span>
            </div>
            <button className="outline-btn">Settings</button>
          </div>
        ))}
      </div>
    </>
  );

  const renderKeysTab = () => (
    <>
      <div className="settings-header-row">
        <div>
          <h2 className="settings-title">API Authentication Keys</h2>
          <div className="settings-subtitle">Configure service tokens to query Anthropic, OpenAI, and Google models.</div>
        </div>
      </div>
      <div className="settings-card-list">
        <div className="settings-card">
          <div className="settings-agent-details">
            <span className="settings-agent-name">Anthropic API Provider</span>
            <span className="settings-agent-role" style={{ fontFamily: 'monospace' }}>sk-ant-•••••••••••••••••</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="outline-btn">Reveal</button>
            <button className="outline-btn">Revoke</button>
          </div>
        </div>
        <div className="settings-card">
          <div className="settings-agent-details">
            <span className="settings-agent-name">OpenAI API Provider</span>
            <span className="settings-agent-role" style={{ fontFamily: 'monospace' }}>sk-proj-•••••••••••••••••</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="outline-btn">Reveal</button>
            <button className="outline-btn">Revoke</button>
          </div>
        </div>
        <div className="settings-card">
          <div className="settings-agent-details">
            <span className="settings-agent-name">Google Gemini Provider</span>
            <span className="settings-agent-role" style={{ fontFamily: 'monospace' }}>AIzaSy•••••••••••••••••</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="outline-btn">Reveal</button>
            <button className="outline-btn">Revoke</button>
          </div>
        </div>
      </div>
    </>
  );

  const renderAppearanceTab = () => (
    <>
      <div className="settings-header-row">
        <div>
          <h2 className="settings-title">Appearance Settings</h2>
          <div className="settings-subtitle">Personalize layout parameters and theme settings.</div>
        </div>
      </div>
      <div className="settings-form-container" style={{ maxWidth: '500px' }}>
        <div className="settings-dummy-field">
          <label className="settings-label">Theme Mode</label>
          <select className="settings-select" style={{ minWidth: '100%' }}>
            <option>Matte Olive (Military Ops)</option>
            <option>Desaturated Slate (Carbon)</option>
            <option>Monochrome Paper (Notion Light)</option>
          </select>
        </div>
        <div className="settings-dummy-field">
          <label className="settings-label">Border Details</label>
          <select className="settings-select" style={{ minWidth: '100%' }}>
            <option>1px Solid dividers (Strict)</option>
            <option>Dashed boundaries (Blueprint)</option>
            <option>No visible lines (Flat)</option>
          </select>
        </div>
      </div>
    </>
  );

  const renderBillingTab = () => (
    <>
      <div className="settings-header-row">
        <div>
          <h2 className="settings-title">Operations Billing</h2>
          <div className="settings-subtitle">Review token usage allowances and historical billing logs.</div>
        </div>
      </div>
      <div className="settings-card-list">
        <div className="settings-card billing-row">
          <div>
            <div className="settings-label">Current Tier</div>
            <div style={{ fontWeight: 'bold', fontSize: '14px', marginTop: '4px' }}>Military Pro</div>
          </div>
          <div>
            <div className="settings-label">Monthly Cost</div>
            <div style={{ fontWeight: 'bold', fontSize: '14px', marginTop: '4px' }}>$49.00 / month</div>
          </div>
          <div>
            <div className="settings-label">Renewal Date</div>
            <div style={{ fontWeight: 'bold', fontSize: '14px', marginTop: '4px' }}>July 28, 2026</div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="dashboard-container">
      <div className="noise-overlay"></div>
      <TopBar title="SETTINGS" />

      <div className="dashboard-body">
        <Sidebar 
          agents={agents} 
          activeAgentId={activeAgent?.id} 
          setActiveAgentId={setActiveAgentId} 
        />

        <div className="settings-container">
          {/* Left Settings Tabs */}
          <aside className="settings-nav">
            <button 
              className={`settings-nav-btn ${activeSettingsTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveSettingsTab('general')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>settings_accessibility</span>
              General
            </button>
            <button 
              className={`settings-nav-btn ${activeSettingsTab === 'agents' ? 'active' : ''}`}
              onClick={() => setActiveSettingsTab('agents')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>smart_toy</span>
              AI Agents
            </button>
            <button 
              className={`settings-nav-btn ${activeSettingsTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveSettingsTab('projects')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>folder</span>
              Projects
            </button>
            <button 
              className={`settings-nav-btn ${activeSettingsTab === 'keys' ? 'active' : ''}`}
              onClick={() => setActiveSettingsTab('keys')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>key</span>
              API Keys
            </button>
            <button 
              className={`settings-nav-btn ${activeSettingsTab === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveSettingsTab('appearance')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>palette</span>
              Appearance
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
            {activeSettingsTab === 'general' && renderGeneralTab()}
            {activeSettingsTab === 'projects' && renderProjectsTab()}
            {activeSettingsTab === 'keys' && renderKeysTab()}
            {activeSettingsTab === 'appearance' && renderAppearanceTab()}
            {activeSettingsTab === 'billing' && renderBillingTab()}
          </section>
        </div>
      </div>
    </div>
  );
}
