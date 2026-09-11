import React from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/sidebar/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatCard from '../components/dashboard/StatCard';
import ReportIssueCard from '../components/dashboard/ReportIssueCard';
import ComplaintTimeline from '../components/dashboard/ComplaintTimeline';
import RecentComplaints from '../components/dashboard/RecentComplaints';
import NearbyIssues from '../components/dashboard/NearbyIssues';
import NotificationPanel from '../components/dashboard/NotificationPanel';
import CivicImpact from '../components/dashboard/CivicImpact';
import FeedbackCard from '../components/dashboard/FeedbackCard';
import {
  mockUserData,
  mockQuickStats,
  mockActiveComplaint,
  mockRecentComplaints,
  mockNearbyIssues,
  mockNotifications,
  mockCivicImpact,
  mockResolvedFeedback
} from '../data/mockCitizenData';
import '../styles/dashboard.css';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const currentUser = user || mockUserData;

  const handleNotifClick = () => {
    const notifElem = document.getElementById('notifications-panel');
    if (notifElem) {
      notifElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="citizen-layout">
      {/* Existing Sidebar Preserved */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="citizen-main-content">
        <div className="dashboard-wrapper">
          {/* 1. Dashboard Header */}
          <DashboardHeader user={currentUser} onNotifClick={handleNotifClick} />

          {/* 2. Quick Statistics */}
          <section className="dash-stats-grid">
            {mockQuickStats.map((stat) => (
              <StatCard key={stat.id} {...stat} />
            ))}
          </section>

          {/* 3. Primary "Report an Issue" CTA */}
          <ReportIssueCard />

          {/* Main Content Multi-Column Grid */}
          <div className="dash-main-grid">
            {/* Left Column */}
            <div className="dash-col-left">
              {/* 5. Active Complaint Progress / Timeline */}
              <ComplaintTimeline activeComplaint={mockActiveComplaint} />

              {/* 4. Recent Complaints */}
              <RecentComplaints complaints={mockRecentComplaints} />

              {/* 6. Nearby Civic Issues */}
              <NearbyIssues nearbyIssues={mockNearbyIssues} />
            </div>

            {/* Right Column */}
            <div className="dash-col-right">
              {/* 7. Notifications */}
              <div id="notifications-panel">
                <NotificationPanel notifications={mockNotifications} />
              </div>

              {/* 8. Community Contribution */}
              <CivicImpact impactData={mockCivicImpact} />

              {/* 9. Resolved Complaint Feedback */}
              <FeedbackCard resolvedFeedback={mockResolvedFeedback} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CitizenDashboard;
