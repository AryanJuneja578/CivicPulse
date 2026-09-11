import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconBell, IconArrowLeft } from './NotificationIcons';

const NotificationsHeader = ({ unreadCount = 0 }) => {
  const navigate = useNavigate();

  return (
    <div className="notif-page-header">
      <div className="notif-header-left">
        <div className="notif-title-row">
          <div className="notif-title-icon-badge">
            <IconBell size={24} />
          </div>
          <h1 className="notif-header-title">Notifications</h1>
          {unreadCount > 0 ? (
            <span className="notif-unread-badge" title={`${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`}>
              {unreadCount} Unread
            </span>
          ) : (
            <span className="notif-caught-up-badge">
              All caught up
            </span>
          )}
        </div>
        <p className="notif-header-subtitle">
          Stay updated with real-time progress on your complaints, department dispatches, and community civic alerts.
        </p>
      </div>

      <div className="notif-header-actions">
        <button
          type="button"
          className="notif-back-btn"
          onClick={() => navigate('/citizen')}
          aria-label="Back to Dashboard"
        >
          <IconArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationsHeader;
