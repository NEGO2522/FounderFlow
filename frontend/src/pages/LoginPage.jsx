import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import '../styles/login.css';

const brandTools = [
  { avatar: 'GP', name: 'ChatGPT', tagline: 'OpenAI' },
  { avatar: 'CL', name: 'Claude', tagline: 'Anthropic' },
  { avatar: 'GM', name: 'Gemini', tagline: 'Google' },
  { avatar: 'PX', name: 'Perplexity', tagline: 'Research AI' },
  { avatar: 'DS', name: 'DeepSeek', tagline: 'Code & Reasoning' },
  { avatar: 'AG', name: 'Antigravity', tagline: 'UI Builder' },
  { avatar: 'WS', name: 'Windsurf', tagline: 'Agentic IDE' },
  { avatar: 'CR', name: 'Cursor', tagline: 'AI Code Editor' },
  { avatar: 'CX', name: 'Codex', tagline: 'OpenAI Codex' },
  { avatar: 'ST', name: 'Stitch', tagline: 'Google Design AI' }
];

export default function LoginPage({ setGuestMode }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showNotRegistered, setShowNotRegistered] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setError('No account found with this email. Please sign up first.');
        setShowNotRegistered(true);
      } else {
        setError(error.message);
      }
    } else {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          prompt: 'select_account'
        }
      }
    });
    if (error) setError(error.message);
  };

  return (
    <div className="login-page-container">
      {/* Left Side - Branding */}
      <div className="login-left-brand">
        {/* Logo */}
        <div>
          <span style={{ fontSize: '13px', fontWeight: '800', letterSpacing: '0.12em', color: 'var(--text-warm)' }}>
            FOUNDER<span style={{ color: 'var(--accent-lime)' }}>//</span>FLOW
          </span>
        </div>

        {/* Center tagline + agent list */}
        <div className="login-center-content">
          <h1 className="login-tagline">
            Your AI team.<br />Always ready.
          </h1>
          
          <div className="login-agent-previews">
            {brandTools.map((tool, idx) => (
              <div key={idx} className="login-agent-preview-card">
                <div className="agent-avatar">{tool.avatar}</div>
                <div className="agent-info">
                  <span className="agent-name" style={{ fontWeight: '700' }}>{tool.name}</span>
                  <span className="agent-role-badge">{tool.tagline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom footnote */}
        <div className="login-footer-text">
          Used by solo builders
        </div>
      </div>

      {/* Right Side - Auth */}
      <div className="login-right-auth">
        <div className="login-auth-card">
          <div className="login-auth-header">
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-warm)', margin: 0 }}>Welcome back</h2>
            <span style={{ fontSize: '12px', color: '#a4aa8e' }}>Sign in to continue</span>
          </div>

          <form onSubmit={handleEmailLogin} className="login-form">
            <div className="settings-dummy-field">
              <label className="settings-label">Email Address</label>
              <input 
                type="email" 
                className="settings-input" 
                placeholder="name@company.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="settings-dummy-field">
              <label className="settings-label">Password</label>
              <input 
                type="password" 
                className="settings-input" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <button type="submit" className="login-submit-btn" style={{ marginTop: '8px' }} disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {error && (
            <div style={{
              color: '#ff6b6b',
              fontSize: '11px',
              fontFamily: 'Geist Mono',
              marginTop: '8px',
              padding: '10px',
              border: '1px solid rgba(255,107,107,0.3)',
              background: 'rgba(255,107,107,0.05)'
            }}>
              {error}
            </div>
          )}

          <div className="login-divider">or continue with</div>

          <button className="login-google-btn" onClick={handleGoogleLogin}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="login-footer-link" onClick={() => navigate('/signup')}>
            Don't have an account? Start free →
          </div>
        </div>
      </div>

      {/* Account Not Found Popup Modal */}
      {showNotRegistered && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 999
        }}>
          <div style={{
            background: '#12150D',
            border: '1px solid #2E3320',
            padding: '32px',
            maxWidth: '360px',
            width: '90%',
            fontFamily: 'Geist Mono'
          }}>
            <div style={{
              color: '#C8F04A', fontSize: '11px',
              letterSpacing: '0.1em', marginBottom: '12px'
            }}>
              ● ACCOUNT NOT FOUND
            </div>
            <p style={{
              color: '#E8EDD4', fontSize: '14px',
              marginBottom: '8px', fontWeight: 'bold'
            }}>
              No account with this email.
            </p>
            <p style={{
              color: '#6B7155', fontSize: '12px',
              marginBottom: '24px', lineHeight: '1.6'
            }}>
              This email is not registered on FounderFlow. 
              Create a new workspace to get started.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowNotRegistered(false)}
                style={{
                  flex: 1, padding: '10px',
                  background: 'transparent',
                  border: '1px solid #2E3320',
                  color: '#6B7155', cursor: 'pointer',
                  fontFamily: 'Geist Mono', fontSize: '11px'
                }}>
                CANCEL
              </button>
              <button onClick={() => navigate('/signup')}
                style={{
                  flex: 1, padding: '10px',
                  background: '#C8F04A',
                  border: 'none',
                  color: '#000', cursor: 'pointer',
                  fontFamily: 'Geist Mono', fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                CREATE ACCOUNT →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
