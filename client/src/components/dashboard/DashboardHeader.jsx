import React from 'react';

const DashboardHeader = ({ user, onNotifClick }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const userName = user?.name || 'Aryan';
  const initial = userName.charAt(0).toUpperCase();

  return (
    <header className="dash-header-container">
      <div className="dash-header-left">
        <h1 className="dash-header-greeting">
          {getGreeting()}, {userName}
        </h1>
        <p className="dash-header-subtitle">
          Here's what's happening with your civic reports.
        </p>
      </div>

      <div className="dash-header-right">
        <button
          className="dash-notification-btn"
          onClick={onNotifClick}
          aria-label="View notifications"
          title="Notifications"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="dash-notif-dot" />
        </button>

        <div className="dash-profile-chip">
          <div className="dash-avatar">{initial}</div>
          <span className="dash-profile-name">{userName}</span>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
