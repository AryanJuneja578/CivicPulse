import React from 'react';
import NotificationItem from './NotificationItem';

const groupMeta = {
  today: {
    label: 'Today',
    icon: '⚡'
  },
  yesterday: {
    label: 'Yesterday',
    icon: '📅'
  },
  earlier: {
    label: 'Earlier',
    icon: '🗄️'
  }
};

const NotificationGroup = ({
  groupKey,
  notifications,
  onNotificationClick,
  onToggleRead
}) => {
  if (!notifications || notifications.length === 0) return null;

  const meta = groupMeta[groupKey] || { label: groupKey, icon: '📌' };

  return (
    <section className="notif-group-section" aria-labelledby={`group-${groupKey}-heading`}>
      <div className="notif-group-header">
        <div className="notif-group-title-wrap">
          <span className="notif-group-icon" aria-hidden="true">{meta.icon}</span>
          <h2 id={`group-${groupKey}-heading`} className="notif-group-title">
            {meta.label}
          </h2>
          <span className="notif-group-badge">
            {notifications.length}
          </span>
        </div>
        <div className="notif-group-line" aria-hidden="true" />
      </div>

      <div className="notif-group-items">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onNotificationClick={onNotificationClick}
            onToggleRead={onToggleRead}
          />
        ))}
      </div>
    </section>
  );
};

export default NotificationGroup;
