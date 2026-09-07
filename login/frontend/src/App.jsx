import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CitizenDashboard from './pages/CitizenDashboard';
import CitizenSubPage from './pages/CitizenSubPage';
import ReportIssuePage from './pages/ReportIssuePage';
import ComplaintDetailsPage from './pages/ComplaintDetailsPage';
import AuthorityDashboard from './pages/AuthorityDashboard';
import NotificationsPage from './pages/NotificationsPage';
import './styles/auth.css';

// Root redirect handler
const RootRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-center loading-container">
        <div className="spinner"></div>
        <p>Loading CivicPulse...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'citizen') {
    return <Navigate to="/citizen" replace />;
  }

  return <Navigate to="/authority" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-root">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected Citizen Routes */}
              <Route
                path="/citizen"
                element={
                  <ProtectedRoute allowedRoles={['citizen']}>
                    <CitizenDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/citizen/report"
                element={
                  <ProtectedRoute allowedRoles={['citizen']}>
                    <ReportIssuePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/citizen/complaints"
                element={
                  <ProtectedRoute allowedRoles={['citizen']}>
                    <CitizenSubPage title="My Complaints" subtitle="Track all your submitted complaints and their resolution status." icon="📋" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/citizen/complaints/:complaintId"
                element={
                  <ProtectedRoute allowedRoles={['citizen']}>
                    <ComplaintDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/citizen/nearby"
                element={
                  <ProtectedRoute allowedRoles={['citizen']}>
                    <CitizenSubPage title="Nearby Issues" subtitle="Explore civic issues reported in your neighborhood." icon="🗺️" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/citizen/notifications"
                element={
                  <ProtectedRoute allowedRoles={['citizen']}>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/citizen/profile"
                element={
                  <ProtectedRoute allowedRoles={['citizen']}>
                    <CitizenSubPage title="Citizen Profile" subtitle="Manage your account information and contact preferences." icon="👤" />
                  </ProtectedRoute>
                }
              />


              {/* Protected Authority Route (Officer and Supervisor) */}
              <Route
                path="/authority"
                element={
                  <ProtectedRoute allowedRoles={['officer', 'supervisor']}>
                    <AuthorityDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
