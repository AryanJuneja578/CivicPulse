import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavItem = ({ icon: Icon, label, path, badge, onClick, isDanger = false, isButton = false }) => {
  const location = useLocation();
  
  // Exact or sub-route matching for active state
  const isActive = !isButton && (
    location.pathname === path || 
    (path !== '/citizen' && location.pathname.startsWith(path))
  );

  const itemContent = (
    <>
      <span className="nav-item-icon">
        <Icon size={20} />
      </span>
      <span className="nav-item-label">{label}</span>
      {badge !== undefined && (
        <span className="nav-item-badge">{badge}</span>
      )}
    </>
  );

  const className = `nav-item ${isActive ? 'active' : ''} ${isDanger ? 'danger' : ''}`;

  if (isButton) {
    return (
      <button onClick={onClick} className={className} type="button">
        {itemContent}
      </button>
    );
  }

  return (
    <Link to={path} onClick={onClick} className={className}>
      {itemContent}
    </Link>
  );
};

export default NavItem;
