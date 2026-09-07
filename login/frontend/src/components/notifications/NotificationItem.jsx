import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconAssignment,
  IconInProgress,
  IconResolved,
  IconActionRequired,
  IconNearby,
  IconFeedback,
  IconScore,
  IconNotice,
  IconChevronRight
} from './NotificationIcons';

const getCategoryIcon = (category) => {
  switch (category) {
    case 'assigned':
      return <IconAssignment size={19} />;
    case 'in_progress':
      return <IconInProgress size={19} />;
    case 'resolved':
      return <IconResolved size={19} />;
    case 'action_required':
      return <IconActionRequired size={19} />;
    case 'nearby':
      return <IconNearby size={19} />;
    case 'feedback':
      return <IconFeedback size={19} />;
    case 'score':
      return <IconScore size={19} />;
    case 'notice':
    default:
      return <IconNotice size={19} />;
  }
};

const NotificationItem = ({ notification, onNotificationClick, onToggleRead }) => {
  const navigate = useNavigate();
  const isUnread = notification.unread;
  const hasComplaint = Boolean(notification.complaintId);

  const handleClick = (e) => {
    // If user clicked directly on the toggle read button, let that handler deal with it
    if (e.target.closest('.notif-item-action-btn')) {
      return;
    }

    onNotificationClick(notification);

    if (hasComplaint) {
      navigate(`/citizen/complaints/${notification.complaintId}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    }
  };

  return (
    <div
      tabIndex={0}
      role="button"
      aria-label={`${notification.title}, ${notification.timestamp}${isUnread ? ', unread' : ', read'}`}
      className={`notif-card-item ${isUnread ? 'is-unread' : 'is-read'} ${hasComplaint ? 'is-clickable' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* Left Icon with category color */}
      <div className={`notif-item-icon-wrapper cat-${notification.category}`}>
        {getCategoryIcon(notification.category)}
      </div>

      {/* Main Content */}
      <div className="notif-item-content">
        <div className="notif-item-top">
          <div className="notif-item-title-group">
            <h3 className="notif-item-title">{notification.title}</h3>
            {isUnread && <span className="notif-unread-dot" title="Unread notification" />}
          </div>
          <span className="notif-item-timestamp">{notification.timestamp}</span>
        </div>

        <p className="notif-item-message">{notification.message}</p>

        <div className="notif-item-footer">
          <div className="notif-meta-tags">
            {notification.complaintId && (
              <span className="notif-complaint-badge" title="View Complaint Details">
                Ticket: <strong>{notification.complaintId}</strong>
              </span>
            )}

            {notification.categoryLabel && (
              <span className={`notif-category-badge cat-${notification.category}`}>
                {notification.categoryLabel}
              </span>
            )}

            {notification.department && (
              <span className="notif-dept-badge">
                🏛️ {notification.department}
              </span>
            )}
          </div>

          <div className="notif-item-actions">
            <button
              type="button"
              className="notif-item-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onToggleRead(notification.id);
              }}
              title={isUnread ? 'Mark as read' : 'Mark as unread'}
              aria-label={isUnread ? 'Mark as read' : 'Mark as unread'}
            >
              {isUnread ? 'Mark read' : 'Mark unread'}
            </button>

            {hasComplaint && (
              <span className="notif-nav-link">
                <span>View Details</span>
                <IconChevronRight size={15} />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
