import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [activeTab, setActiveTab] = useState('citizen'); // 'citizen' | 'authority'
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [forgotPasswordMsg, setForgotPasswordMsg] = useState(false);

  // If user is already logged in, redirect automatically according to backend role
  useEffect(() => {
    if (user && !authLoading) {
      if (user.role === 'citizen') {
        navigate('/citizen', { replace: true });
      } else {
        navigate('/authority', { replace: true });
      }
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setForgotPasswordMsg(false);

    if (!email || !password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    setSubmitting(true);
    try {
      const authenticatedUser = await login(email, password, rememberMe);
      // Backend is authoritative source for user.role
      if (authenticatedUser.role === 'citizen') {
        navigate('/citizen', { replace: true });
      } else {
        navigate('/authority', { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* CivicPulse Branding */}
        <div className="auth-header">
          <div className="auth-logo-badge">🏛️</div>
          <h1 className="auth-title">CivicPulse</h1>
          <p className="auth-tagline">Report. Resolve. Improve.</p>
        </div>

        {/* Login Type Tabs (Citizen vs Authority) */}
        <div className="login-tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'citizen' ? 'active' : ''}`}
            onClick={() => setActiveTab('citizen')}
          >
            Citizen Login
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'authority' ? 'active' : ''}`}
            onClick={() => setActiveTab('authority')}
          >
            Authority Login
          </button>
        </div>

        <p className="login-tab-hint">
          {activeTab === 'citizen'
            ? 'Access citizen portal to report & track civic issues.'
            : 'Access official portal for Officers and Supervisors.'}
        </p>

        {errorMessage && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {forgotPasswordMsg && (
          <div className="alert alert-info">
            <span className="alert-icon">ℹ️</span>
            <span>To reset your password, please contact system administration or support.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder={activeTab === 'citizen' ? 'citizen@example.com' : 'officer@gov.org'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="password">Password</label>
              <button
                type="button"
                className="link-btn text-sm"
                onClick={() => setForgotPasswordMsg(true)}
              >
                Forgot password?
              </button>
            </div>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="form-row flex-between">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-block btn-lg"
          >
            {submitting ? (
              <span className="btn-loading flex-center">
                <span className="spinner-sm"></span> Logging in...
              </span>
            ) : (
              `Sign In as ${activeTab === 'citizen' ? 'Citizen' : 'Officer / Supervisor'}`
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have a Citizen account?{' '}
            <Link to="/register" className="auth-link">
              Register as Citizen
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
