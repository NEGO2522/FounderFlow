import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/landing.css';

const gridAgents = [
  { avatar: 'GP', name: 'ChatGPT', role: 'General Intelligence', desc: 'Strategy, copy, ideation' },
  { avatar: 'CL', name: 'Claude', role: 'Reasoning & Writing', desc: 'Deep analysis, documentation' },
  { avatar: 'GM', name: 'Gemini', role: 'Multimodal AI', desc: 'Research, vision tasks' },
  { avatar: 'PX', name: 'Perplexity', role: 'Research & Search', desc: 'Market research, competitors' },
  { avatar: 'DS', name: 'DeepSeek', role: 'Code & Reasoning', desc: 'Backend, algorithms' },
  { avatar: 'AG', name: 'Antigravity', role: 'UI Building', desc: 'Frontend, components' },
  { avatar: 'WS', name: 'Windsurf', role: 'Agentic Coding', desc: 'Full-stack execution' },
  { avatar: 'CR', name: 'Cursor', role: 'Code Editor AI', desc: 'Refactoring, debugging' },
  { avatar: 'CX', name: 'Codex', role: 'Code Generation', desc: 'Boilerplate, scaffolding' },
  { avatar: 'ST', name: 'Stitch', role: 'Design AI', desc: 'UI design, prototyping' }
];

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGuestLogin = () => {
    localStorage.setItem("ff_auth", "guest");
    window.dispatchEvent(new Event("ff_auth_login"));
    navigate('/dashboard');
  };

  return (
    <div className="landing-container">
      <div className="noise-overlay"></div>

      {/* Navbar Section */}
      <nav className="landing-navbar">
        <span style={{ fontSize: '13px', fontWeight: '800', letterSpacing: '0.12em', color: 'var(--text-warm)' }}>
          FOUNDER<span style={{ color: 'var(--accent-lime)' }}>//</span>FLOW
        </span>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="outline-btn" onClick={() => navigate('/login')}>
            Sign In
          </button>
          <button className="lime-btn" style={{ borderRadius: '0px' }} onClick={() => navigate('/signup')}>
            Start Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="landing-hero">
        <span className="landing-label">AI-POWERED CO-FOUNDER STACK</span>
        <h1 className="landing-headline">
          YOUR ENTIRE FOUNDING<br />TEAM. ALWAYS ON.
        </h1>
        <p className="landing-subtext">
          10 specialized AI agents working in parallel on your product — code, growth, research, security, design, and more.
        </p>

        <div className="landing-ctas">
          <button className="lime-btn" style={{ borderRadius: '0px', padding: '14px 28px' }} onClick={() => navigate('/signup')}>
            Start Building Free →
          </button>
          <button className="login-guest-btn" style={{ width: 'auto', padding: '14px 28px' }} onClick={handleGuestLogin}>
            Enter as Guest
          </button>
        </div>

        {/* Small Agent Avatars Row */}
        <div style={{ marginTop: '24px' }}>
          <div className="landing-avatars-row">
            {gridAgents.map((agent, i) => (
              <div key={i} className="project-agent-bubble" style={{ width: '28px', height: '28px' }}>
                {agent.avatar}
              </div>
            ))}
          </div>
          <div style={{ fontSize: '11px', color: '#6a7155', fontWeight: '700', marginTop: '10px' }}>
            10 AI Co-Founders. Ready to deploy.
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="landing-features">
        <div className="features-grid">
          <div className="feature-col">
            <span className="material-symbols-outlined feature-icon">smart_toy</span>
            <h3 className="feature-title">Specialized Agents</h3>
            <p className="feature-desc">
              Each AI has one job. No generalist confusion. Pure focused execution.
            </p>
          </div>
          
          <div className="feature-col">
            <span className="material-symbols-outlined feature-icon">folder_open</span>
            <h3 className="feature-title">Project Workspaces</h3>
            <p className="feature-desc">
              Organize every product in its own workspace with full context and history.
            </p>
          </div>

          <div className="feature-col">
            <span className="material-symbols-outlined feature-icon">bolt</span>
            <h3 className="feature-title">Parallel Execution</h3>
            <p className="feature-desc">
              All agents work simultaneously. Ship in days, not months.
            </p>
          </div>
        </div>
      </section>

      {/* Agents Grid Section */}
      <section className="landing-agents-grid">
        <div style={{ textAlign: 'center' }}>
          <span className="landing-label">MEET YOUR CO-FOUNDERS</span>
          <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '8px 0 0 0', textTransform: 'uppercase' }}>
            Real AI tools. Assigned roles. Actual output.
          </h2>
        </div>

        <div className="agents-grid-container">
          {gridAgents.map((agent, i) => (
            <div key={i} className="agent-grid-card">
              <div className="project-agent-bubble" style={{ width: '32px', height: '32px', borderRadius: '4px' }}>
                {agent.avatar}
              </div>
              <div className="agent-grid-card-details">
                <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-warm)' }}>
                  {agent.name}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--accent-lime)' }}>
                  {agent.role}
                </span>
                <span style={{ fontSize: '11px', color: '#a4aa8e', marginTop: '4px', lineHeight: '1.4' }}>
                  "{agent.desc}"
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="landing-cta-footer">
        <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0, textTransform: 'uppercase' }}>
          Ready to build with your AI team?
        </h2>
        <button className="lime-btn" style={{ borderRadius: '0px', padding: '16px 36px', fontSize: '13px' }} onClick={() => navigate('/signup')}>
          Start Free →
        </button>
        <span style={{ fontSize: '11px', color: '#a4aa8e' }}>
          No credit card. No setup. Just build.
        </span>

        <div className="footer-bottom">
          <span>FOUNDER//FLOW</span>
          <span>·</span>
          <span>Built for solo founders</span>
          <span>·</span>
          <span>2026</span>
        </div>
      </section>
    </div>
  );
}
