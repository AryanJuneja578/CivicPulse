import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import '../styles/dashboard.css';

const CitizenSubPage = ({ title, subtitle, icon }) => {
  const navigate = useNavigate();

  return (
    <div className="citizen-layout">
      <Sidebar />
      <main className="citizen-main-content">
        <div className="dashboard-wrapper">
          <div className="dash-header-container">
            <div>
              <h1 className="dash-header-greeting" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{icon || '📄'}</span>
                <span>{title}</span>
              </h1>
              <p className="dash-header-subtitle">
                {subtitle || 'This module is part of the CivicPulse citizen workspace.'}
              </p>
            </div>
            <button
              onClick={() => navigate('/citizen')}
              className="dash-notification-btn"
              style={{ width: 'auto', padding: '0.5rem 1rem', borderRadius: '10px' }}
            >
              ← Back to Dashboard
            </button>
          </div>

          <div className="dash-section-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon || '🛠️'}</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              {title} Page
            </h2>
            <p style={{ color: '#64748b', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
              You have navigated to <strong>{title}</strong>. This route is configured and ready for full feature integration.
            </p>
            <button
              className="report-cta-btn"
              style={{ background: '#1e40af', color: '#ffffff', margin: '0 auto' }}
              onClick={() => navigate('/citizen')}
            >
              Return to Citizen Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CitizenSubPage;
