import React from 'react';
import { useAuth } from '../context/AuthContext';

const AuthorityDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-card authority-theme">
        <div className="dashboard-icon">🛡️</div>
        <h1 className="dashboard-title">CivicPulse Authority Dashboard</h1>
        <p className="dashboard-welcome">Welcome, <strong>{user?.name}</strong></p>
        <div className="coming-soon-badge">Coming soon</div>
        <p className="dashboard-subtitle">
          Official management console for Officers and Supervisors. Resolution dispatch, SLA tracking, and department analytics will be available here.
        </p>
        <div className="user-details-card">
          <h3>Officer Profile</h3>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Phone:</strong> {user?.phone}</p>
          <p><strong>Authorized Role:</strong> {user?.role === 'officer' ? 'Authority Officer' : 'Supervisor'}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthorityDashboard;
