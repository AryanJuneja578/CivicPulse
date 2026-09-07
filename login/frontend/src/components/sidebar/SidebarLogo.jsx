import React from 'react';
import { IconLogo } from './SidebarIcons';

const SidebarLogo = ({ onCloseMobile }) => {
  return (
    <div className="sidebar-logo-container" onClick={onCloseMobile} style={{ cursor: 'pointer' }}>
      <div className="sidebar-brand">
        <div className="sidebar-logo-icon">
          <IconLogo size={24} />
        </div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-title">CivicPulse</span>
          <span className="sidebar-brand-subtitle">Citizen Portal</span>
        </div>
      </div>
    </div>
  );
};

export default SidebarLogo;
