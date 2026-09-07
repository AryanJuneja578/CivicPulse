import React from 'react';
import { IconCheckAll } from './NotificationIcons';

const NotificationFilters = ({
  activeFilter,
  onFilterChange,
  counts = { all: 0, unread: 0, read: 0 },
  onMarkAllAsRead
}) => {
  const filters = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'unread', label: 'Unread', count: counts.unread },
    { key: 'read', label: 'Read', count: counts.read }
  ];

  return (
    <div className="notif-controls-bar">
      <div className="notif-filter-tabs" role="tablist" aria-label="Notification filters">
        {filters.map((tab) => {
          const isActive = activeFilter === tab.key;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              className={`notif-filter-tab ${isActive ? 'active' : ''}`}
              onClick={() => onFilterChange(tab.key)}
            >
              <span>{tab.label}</span>
              <span className={`notif-filter-count ${isActive ? 'active-count' : ''}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="notif-actions-bar">
        <button
          type="button"
          className={`notif-mark-read-btn ${counts.unread === 0 ? 'disabled' : ''}`}
          onClick={onMarkAllAsRead}
          disabled={counts.unread === 0}
          title={counts.unread === 0 ? 'All notifications are already read' : 'Mark all notifications as read'}
        >
          <IconCheckAll size={16} />
          <span>Mark all as read</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationFilters;
