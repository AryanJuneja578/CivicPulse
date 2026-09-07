import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import NotificationsHeader from '../components/notifications/NotificationsHeader';
import NotificationFilters from '../components/notifications/NotificationFilters';
import NotificationGroup from '../components/notifications/NotificationGroup';
import NotificationEmptyState from '../components/notifications/NotificationEmptyState';
import { initialMockNotifications } from '../data/mockNotifications';
import '../styles/dashboard.css';
import '../styles/notifications.css';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(initialMockNotifications);
  const [activeFilter, setActiveFilter] = useState('all');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Compute counts
  const counts = useMemo(() => {
    const unread = notifications.filter((n) => n.unread).length;
    const read = notifications.length - unread;
    return {
      all: notifications.length,
      unread,
      read
    };
  }, [notifications]);

  // Filter notifications based on active tab
  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'unread') {
      return notifications.filter((n) => n.unread);
    }
    if (activeFilter === 'read') {
      return notifications.filter((n) => !n.unread);
    }
    return notifications;
  }, [notifications, activeFilter]);

  // Group notifications into today, yesterday, earlier
  const groupedNotifications = useMemo(() => {
    const groups = {
      today: [],
      yesterday: [],
      earlier: []
    };

    filteredNotifications.forEach((item) => {
      const key = item.dateGroup || 'earlier';
      if (groups[key]) {
        groups[key].push(item);
      } else {
        groups.earlier.push(item);
      }
    });

    return groups;
  }, [filteredNotifications]);

  // Mark all notifications as read
  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        unread: false
      }))
    );
  };

  // Mark a single notification as read on click
  const handleNotificationClick = (notification) => {
    if (notification.unread) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, unread: false } : n))
      );
    }
  };

  // Toggle single notification read/unread state
  const handleToggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  const handleResetFilter = () => {
    setActiveFilter('all');
  };

  const hasAnyItems = filteredNotifications.length > 0;

  return (
    <div className="citizen-layout">
      {/* Existing Preserved Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="citizen-main-content">
        <div className="notif-page-wrapper">
          {/* 1. Header with Title, Description, and Unread Count */}
          <NotificationsHeader unreadCount={counts.unread} />

          {/* 2. Notification Controls (Filters + Mark All As Read) */}
          <NotificationFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={counts}
            onMarkAllAsRead={handleMarkAllAsRead}
          />

          {/* 3. Notification Groups or Empty State */}
          {!hasAnyItems ? (
            <NotificationEmptyState
              filter={activeFilter}
              onResetFilter={handleResetFilter}
            />
          ) : (
            <div className="notif-list-container">
              {groupedNotifications.today.length > 0 && (
                <NotificationGroup
                  groupKey="today"
                  notifications={groupedNotifications.today}
                  onNotificationClick={handleNotificationClick}
                  onToggleRead={handleToggleRead}
                />
              )}

              {groupedNotifications.yesterday.length > 0 && (
                <NotificationGroup
                  groupKey="yesterday"
                  notifications={groupedNotifications.yesterday}
                  onNotificationClick={handleNotificationClick}
                  onToggleRead={handleToggleRead}
                />
              )}

              {groupedNotifications.earlier.length > 0 && (
                <NotificationGroup
                  groupKey="earlier"
                  notifications={groupedNotifications.earlier}
                  onNotificationClick={handleNotificationClick}
                  onToggleRead={handleToggleRead}
                />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;
