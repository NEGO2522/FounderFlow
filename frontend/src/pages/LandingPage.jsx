import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/hero.png';
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

export default function LandingPage({ setGuestMode }) {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGuestLogin = () => {
    if (setGuestMode) setGuestMode();
    navigate('/dashboard');
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  useEffect(() => {
    const sections = ['features', 'agents', 'pricing'];
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px', // detects center view triggers
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="landing-container">
      <div className="noise-overlay"></div>

      {/* Overhauled Frosted Glass Navbar */}
      <nav className="landing-navbar">
        <span style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '0.12em', color: '#FFF' }}>
          FOUNDER<span style={{ color: 'var(--accent-lime)' }}>//</span>FLOW
        </span>

        {/* Center Nav Links with active section and click handlers */}
        <div className="navbar-center">
          <span 
            className={`navbar-center-link ${activeSection === 'features' ? 'active' : ''}`}
            onClick={() => scrollToSection('features')}
          >
            Features
          </span>
          <span className="navbar-link-divider"></span>
          <span 
            className={`navbar-center-link ${activeSection === 'agents' ? 'active' : ''}`}
            onClick={() => scrollToSection('agents')}
          >
            Agents
          </span>
          <span className="navbar-link-divider"></span>
          <span 
            className={`navbar-center-link ${activeSection === 'pricing' ? 'active' : ''}`}
            onClick={() => scrollToSection('pricing')}
          >
            Pricing
          </span>
        </div>

        <div className="navbar-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button className="navbar-signin-btn" onClick={() => navigate('/login')}>
            Sign In
          </button>
          <button className="navbar-start-btn" onClick={() => navigate('/signup')}>
            Start Free →
          </button>
        </div>

        <button 
          className="navbar-hamburger-btn" 
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className="material-symbols-outlined" style={{ color: '#FFF', fontSize: '24px' }}>menu</span>
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-header">
            <span style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '0.12em', color: '#FFF' }}>
              FOUNDER<span style={{ color: 'var(--accent-lime)' }}>//</span>FLOW
            </span>
            <button className="mobile-menu-close-btn" onClick={() => setMobileMenuOpen(false)}>
              <span className="material-symbols-outlined" style={{ color: '#FFF', fontSize: '24px' }}>close</span>
            </button>
          </div>
          <div className="mobile-menu-links">
            <span onClick={() => { scrollToSection('features'); setMobileMenuOpen(false); }}>Features</span>
            <span onClick={() => { scrollToSection('agents'); setMobileMenuOpen(false); }}>Agents</span>
            <span onClick={() => { scrollToSection('pricing'); setMobileMenuOpen(false); }}>Pricing</span>
            <button className="mobile-menu-signin-btn" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>Sign In</button>
            <button className="mobile-menu-start-btn" onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }}>Start Free →</button>
          </div>
        </div>
      )}

      {/* Hero Section with split columns */}
      <div className="landing-hero-wrapper">
        <header className="landing-hero">
          {/* Left Column (text content) */}
          <div className="hero-left">
            {/* Row 1: Badge */}
            <div className="hero-badge-inline">
              <span className="blinking-dot-inline">●</span>
              YOUR AI STARTUP TEAM
            </div>

            {/* Row 2: Headline */}
            <h1 className="hero-headline">
              YOUR ENTIRE<br />
              FOUNDING TEAM.<br />
              ALWAYS <span style={{ color: 'var(--accent-lime)' }}>ON.</span>
            </h1>

            {/* Row 3: Subtext */}
            <p className="hero-subtext">
              10 AI tools working together on your idea. Code, marketing, research and more. Built for solo builders.
            </p>

            {/* Row 4: CTA buttons */}
            <div className="hero-ctas">
              <button className="hero-btn-filled" onClick={() => navigate('/signup')}>
                Start Building Free →
              </button>
              <button className="hero-btn-dashed" onClick={handleGuestLogin}>
                Enter as Guest
              </button>
            </div>
            {/* Row 6: Stats Row */}
            <div className="hero-stats-row">
              <div className="hero-stat-col">
                <span className="hero-stat-val">10</span>
                <span className="hero-stat-lbl">AI Agents</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat-col">
                <span className="hero-stat-val">3x</span>
                <span className="hero-stat-lbl">Faster Building</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat-col">
                <span className="hero-stat-val">100%</span>
                <span className="hero-stat-lbl">Solo Founder</span>
              </div>
            </div>
          </div>

          {/* Right Column (floating image) */}
          <div className="hero-right">
            <img src={heroImg} alt="Developer Illustration" className="hero-illustration" />
          </div>
        </header>
        <div className="hero-bottom-divider"></div>
      </div>

      {/* Overhauled Clean Features Section with id="features" */}
      <section id="features" className="landing-features">
        <div className="features-header">
          <span className="section-label">WHY USE FOUNDERFLOW</span>
          <h2 className="features-headline">
            Everything you need to build.<br />One place.
          </h2>
          <p className="features-subtext">
            No team needed. Just you and your AI.
          </p>
        </div>

        <div className="features-grid-overhaul">
          <div className="feature-column-clean">
            <span className="feature-num">01</span>
            <h3 className="feature-title-clean">Each AI has one job</h3>
            <p className="feature-desc-clean">
              No confusion. Every AI focuses on what it does best.
            </p>
          </div>

          <div className="feature-column-clean">
            <span className="feature-num">02</span>
            <h3 className="feature-title-clean">One place per project</h3>
            <p className="feature-desc-clean">
              Keep everything organized. Full history, tasks, and progress.
            </p>
          </div>

          <div className="feature-column-clean">
            <span className="feature-num">03</span>
            <h3 className="feature-title-clean">All AIs work at the same time</h3>
            <p className="feature-desc-clean">
              Ship faster. All 10 AIs work on your product together.
            </p>
          </div>
        </div>
      </section>

      {/* YOUR CO-FOUNDERS Section with id="agents" */}
      <section id="agents" className="landing-agents-grid-overhaul">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="section-label">YOUR AI TEAM</span>
          <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '8px 0 0 0', textTransform: 'uppercase', color: '#FFF' }}>
            Real tools. Real roles. Real results.
          </h2>
        </div>

        <div className="agents-grid-container-overhaul">
          {gridAgents.map((agent, i) => (
            <div key={i} className="agent-grid-card-overhaul">
              <div className="agent-grid-avatar-overhaul">
                {agent.avatar}
              </div>
              <div className="agent-grid-info-overhaul">
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#FFF' }}>
                  {agent.name}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--accent-lime)', fontWeight: '700' }}>
                  {agent.role}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted-olive)', marginTop: '4px', lineHeight: '1.4' }}>
                  "{agent.desc}"
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA Section with id="pricing" */}
      <section id="pricing" className="landing-final-cta">
        <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0, textTransform: 'uppercase', color: '#FFF' }}>
          Ready to start building?
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted-olive)', margin: 0 }}>
          Free to start. No card needed.
        </p>
        <button className="hero-btn-filled" style={{ padding: '16px 36px', fontSize: '13px', marginTop: '8px' }} onClick={() => navigate('/signup')}>
          Start Free →
        </button>
      </section>

      {/* Overhauled Footer */}
      <footer className="landing-footer-overhaul">
        <div>
          <span style={{ fontWeight: '800', letterSpacing: '0.12em', color: '#FFF' }}>
            FOUNDER<span style={{ color: 'var(--accent-lime)' }}>//</span>FLOW
          </span>
        </div>
        <div>
          Made for solo builders · 2026
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span className="footer-nav-link" onClick={() => navigate('/login')}>Login</span>
          <span>·</span>
          <span className="footer-nav-link" onClick={() => navigate('/signup')}>Signup</span>
        </div>
      </footer>
    </div>
  );
}
