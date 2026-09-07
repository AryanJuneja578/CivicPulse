import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SidebarLogo from './SidebarLogo';
import NavItem from './NavItem';
import {
  IconDashboard,
  IconReport,
  IconComplaints,
  IconNearby,
  IconNotifications,
  IconProfile,
  IconLogout,
  IconMenu,
  IconClose,
  IconLogo
} from './SidebarIcons';
import '../../styles/sidebar.css';

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: '/citizen',
      icon: IconDashboard,
    },
    {
      label: 'Report an Issue',
      path: '/citizen/report',
      icon: IconReport,
    },
    {
      label: 'My Complaints',
      path: '/citizen/complaints',
      icon: IconComplaints,
      badge: 3
    },
    {
      label: 'Nearby Issues',
      path: '/citizen/nearby',
      icon: IconNearby,
    },
    {
      label: 'Notifications',
      path: '/citizen/notifications',
      icon: IconNotifications,
      badge: 2
    },
    {
      label: 'Profile',
      path: '/citizen/profile',
      icon: IconProfile,
    },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <header className="mobile-sidebar-header">
        <div className="mobile-header-brand">
          <div className="sidebar-logo-icon">
            <IconLogo size={22} />
          </div>
          <span className="mobile-brand-title">CivicPulse</span>
        </div>
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <IconClose size={24} /> : <IconMenu size={24} />}
        </button>
      </header>

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={closeMobileMenu} 
          aria-hidden="true"
        />
      )}

      {/* Main Left Sidebar */}
      <aside className={`civic-sidebar ${mobileOpen ? 'open' : ''}`}>
        {/* Top Header Logo */}
        <SidebarLogo onCloseMobile={closeMobileMenu} />

        {/* Main Navigation Links */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-title">MAIN NAVIGATION</div>
          <ul className="sidebar-menu-list">
            {navItems.map((item) => (
              <li key={item.label} className="sidebar-menu-item">
                <NavItem
                  icon={item.icon}
                  label={item.label}
                  path={item.path}
                  badge={item.badge}
                  onClick={closeMobileMenu}
                />
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section: User Badge & Logout */}
        <div className="sidebar-footer">
          {user && (
            <div className="sidebar-user-card">
              <div className="user-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : 'C'}
              </div>
              <div className="user-details">
                <span className="user-display-name">{user.name || 'Citizen User'}</span>
                <span className="user-role-badge">Citizen</span>
              </div>
            </div>
          )}

          <div className="sidebar-logout-wrapper">
            <NavItem
              icon={IconLogout}
              label="Logout"
              onClick={handleLogout}
              isDanger={true}
              isButton={true}
            />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
