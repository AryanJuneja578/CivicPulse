import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-center loading-container">
        <div className="spinner"></div>
        <p>Authenticating session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'citizen') {
      return <Navigate to="/citizen" replace />;
    } else {
      return <Navigate to="/authority" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
