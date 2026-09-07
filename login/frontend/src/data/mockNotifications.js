// Centralized Mock Data for Citizen Notifications
// CivicPulse Platform

export const initialMockNotifications = [
  {
    id: 'notif-1',
    title: 'Complaint CP1025 Assigned',
    message: 'Your pothole complaint CP1025 has been assigned to the Roads & Infrastructure Department.',
    timestamp: '25 minutes ago',
    dateGroup: 'today',
    unread: true,
    complaintId: 'CP1025',
    category: 'assigned',
    categoryLabel: 'Assignment',
    department: 'Roads & Infrastructure Department'
  },
  {
    id: 'notif-2',
    title: 'Status Update: CP1024',
    message: 'Complaint CP1024 status changed to "In Progress". Field repair crew has been dispatched.',
    timestamp: '2 hours ago',
    dateGroup: 'today',
    unread: true,
    complaintId: 'CP1024',
    category: 'in_progress',
    categoryLabel: 'In Progress',
    department: 'Public Works Department (PWD)'
  },
  {
    id: 'notif-3',
    title: 'Nearby Civic Issue Reported',
    message: 'A new road hazard has been reported 320m away from your location on Main Gate Road.',
    timestamp: '5 hours ago',
    dateGroup: 'today',
    unread: false,
    complaintId: null,
    category: 'nearby',
    categoryLabel: 'Nearby Alert',
    department: 'Civic Community'
  },
  {
    id: 'notif-4',
    title: 'Action Required: CP1023',
    message: 'Your complaint CP1023 requires additional information. Please provide landmark details or updated photo evidence.',
    timestamp: 'Yesterday at 03:45 PM',
    dateGroup: 'yesterday',
    unread: true,
    complaintId: 'CP1023',
    category: 'action_required',
    categoryLabel: 'Info Needed',
    department: 'Waste Management Division'
  },
  {
    id: 'notif-5',
    title: 'Complaint CP1021 Resolved',
    message: 'Complaint CP1021 (Broken streetlight at Green Avenue) has been resolved by Municipal Electrical Wing.',
    timestamp: 'Yesterday at 11:20 AM',
    dateGroup: 'yesterday',
    unread: false,
    complaintId: 'CP1021',
    category: 'resolved',
    categoryLabel: 'Resolved',
    department: 'Electrical Maintenance Wing'
  },
  {
    id: 'notif-6',
    title: 'Resolution Feedback Recorded',
    message: 'Your resolution feedback and 5-star rating for complaint CP1021 have been recorded. Thank you for your civic participation!',
    timestamp: '3 days ago',
    dateGroup: 'earlier',
    unread: false,
    complaintId: 'CP1021',
    category: 'feedback',
    categoryLabel: 'Feedback',
    department: 'Citizen Services'
  },
  {
    id: 'notif-7',
    title: 'Civic Contribution Score Increased',
    message: 'Your civic contribution score increased by +50 points! Current rank: Active Community Guardian.',
    timestamp: '4 days ago',
    dateGroup: 'earlier',
    unread: false,
    complaintId: null,
    category: 'score',
    categoryLabel: 'Civic Score',
    department: 'CivicPulse Rewards'
  },
  {
    id: 'notif-8',
    title: 'Duplicate Notice: CP1026',
    message: 'Complaint CP1026 was marked as a duplicate of an existing public works ticket currently being addressed.',
    timestamp: '6 days ago',
    dateGroup: 'earlier',
    unread: false,
    complaintId: 'CP1026',
    category: 'notice',
    categoryLabel: 'Notice',
    department: 'Civic Operations'
  }
];

export default initialMockNotifications;
