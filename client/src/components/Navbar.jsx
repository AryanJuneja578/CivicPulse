import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname.startsWith('/citizen')) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      navigate('/login');
    }
  };


  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="logo-icon">🏛️</div>
          <div className="brand-text">
            <span className="brand-title">CivicPulse</span>
            <span className="brand-tagline">Report. Resolve. Improve.</span>
          </div>
        </Link>

        <div className="navbar-actions">
          {user ? (
            <div className="user-profile-badge">
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className={`role-tag role-${user.role}`}>
                  {user.role === 'citizen' ? 'Citizen' : user.role === 'officer' ? 'Authority Officer' : 'Supervisor'}
                </span>
              </div>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-links">
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register Citizen
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
