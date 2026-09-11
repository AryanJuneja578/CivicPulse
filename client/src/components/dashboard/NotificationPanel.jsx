import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationPanel = ({ notifications }) => {
  const navigate = useNavigate();

  const handleViewAll = (e) => {
    e.preventDefault();
    navigate('/citizen/notifications');
  };

  return (
    <div className="dash-section-card">
      <div className="section-header">
        <h2 className="section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span>Notifications</span>
        </h2>
        <a href="/citizen/notifications" onClick={handleViewAll} className="section-link">
          View All →
        </a>
      </div>

      <div className="notif-list">
        {notifications.map((item) => (
          <div key={item.id} className={`notif-item ${item.unread ? 'unread' : ''}`}>
            {item.unread && <span className="notif-indicator" />}
            <div className="notif-body">
              <p className="notif-text">{item.message}</p>
              <span className="notif-time">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPanel;
