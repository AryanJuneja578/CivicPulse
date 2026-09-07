import React from 'react';
import { IconAllCaughtUp, IconEmptyBell } from './NotificationIcons';

const NotificationEmptyState = ({ filter, onResetFilter }) => {
  const getEmptyDetails = () => {
    switch (filter) {
      case 'unread':
        return {
          icon: <IconAllCaughtUp size={52} className="empty-state-svg" />,
          title: "You're all caught up!",
          message: 'There are no unread notifications. You have reviewed all department updates and civic alerts.'
        };
      case 'read':
        return {
          icon: <IconEmptyBell size={52} className="empty-state-svg" />,
          title: 'No read notifications',
          message: 'You have not archived or read any notifications yet. As you review updates, they will appear here.'
        };
      case 'all':
      default:
        return {
          icon: <IconEmptyBell size={52} className="empty-state-svg" />,
          title: 'No notifications found',
          message: 'There are currently no notifications in your civic inbox. Any new ticket dispatches or community alerts will appear here.'
        };
    }
  };

  const { icon, title, message } = getEmptyDetails();

  return (
    <div className="notif-empty-card" role="status">
      <div className="notif-empty-icon-wrap">
        {icon}
      </div>
      <h3 className="notif-empty-title">{title}</h3>
      <p className="notif-empty-desc">{message}</p>
      {filter !== 'all' && (
        <button
          type="button"
          className="notif-empty-reset-btn"
          onClick={onResetFilter}
        >
          View All Notifications
        </button>
      )}
    </div>
  );
};

export default NotificationEmptyState;
