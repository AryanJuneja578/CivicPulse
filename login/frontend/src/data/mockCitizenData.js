// Mock Data for CivicPulse Citizen Dashboard

export const mockUserData = {
  name: 'Aryan',
  email: 'aryan@civicpulse.gov.in',
  role: 'Citizen',
  avatar: 'A',
  location: 'Model Town, Sector 4'
};

export const mockQuickStats = [
  {
    id: 'total',
    label: 'Total Reports',
    value: 12,
    iconType: 'total',
    indicator: '+2 this month',
    indicatorType: 'neutral',
    color: '#2563eb', // Blue
    bgColor: '#eff6ff'
  },
  {
    id: 'pending',
    label: 'Pending',
    value: 3,
    iconType: 'pending',
    indicator: 'Awaiting verification',
    indicatorType: 'warning',
    color: '#d97706', // Amber
    bgColor: '#fffbeb'
  },
  {
    id: 'in_progress',
    label: 'In Progress',
    value: 4,
    iconType: 'in_progress',
    indicator: 'Under active resolution',
    indicatorType: 'info',
    color: '#0284c7', // Sky Blue
    bgColor: '#f0f9ff'
  },
  {
    id: 'resolved',
    label: 'Resolved',
    value: 5,
    iconType: 'resolved',
    indicator: '83% resolution rate',
    indicatorType: 'success',
    color: '#059669', // Emerald Green
    bgColor: '#ecfdf5'
  }
];

export const mockActiveComplaint = {
  id: 'CP1024',
  title: 'Large pothole near main gate',
  category: 'Road Damage',
  location: 'Model Town',
  department: 'Public Works Department (PWD)',
  lastUpdated: 'Today at 08:45 AM',
  currentStatus: 'In Progress',
  stages: [
    { key: 'reported', label: 'Reported', completed: true, timestamp: 'Aug 28, 09:30 AM' },
    { key: 'verified', label: 'Verified', completed: true, timestamp: 'Aug 28, 02:15 PM' },
    { key: 'assigned', label: 'Assigned', completed: true, timestamp: 'Aug 29, 10:00 AM' },
    { key: 'in_progress', label: 'In Progress', completed: true, timestamp: 'Aug 30, 08:45 AM' },
    { key: 'resolved', label: 'Resolved', completed: false, timestamp: 'Pending completion' }
  ]
};

export const mockRecentComplaints = [
  {
    id: 'CP1024',
    title: 'Large pothole near main gate',
    category: 'Road Damage',
    location: 'Model Town',
    dateReported: '2026-08-28',
    priority: 'High',
    status: 'In Progress'
  },
  {
    id: 'CP1023',
    title: 'Garbage accumulation',
    category: 'Waste Management',
    location: 'Sector 4',
    dateReported: '2026-08-27',
    priority: 'Medium',
    status: 'Pending'
  },
  {
    id: 'CP1021',
    title: 'Broken streetlight',
    category: 'Streetlight',
    location: 'Green Avenue',
    dateReported: '2026-08-24',
    priority: 'Low',
    status: 'Resolved'
  },
  {
    id: 'CP1019',
    title: 'Water leakage from main pipe',
    category: 'Water Leakage',
    location: 'Civil Lines',
    dateReported: '2026-08-20',
    priority: 'High',
    status: 'Verified'
  },
  {
    id: 'CP1015',
    title: 'Clogged drainage channel',
    category: 'Drainage',
    location: 'Block B, Park Rd',
    dateReported: '2026-08-15',
    priority: 'Medium',
    status: 'Assigned'
  }
];

export const mockNearbyIssues = [
  {
    id: 'NB-1',
    type: 'Pothole',
    category: 'Road Damage',
    distance: '250m away',
    location: 'Main Gate Road',
    status: 'In Progress',
    gridPos: { top: '35%', left: '42%' },
    color: '#0284c7'
  },
  {
    id: 'NB-2',
    type: 'Garbage accumulation',
    category: 'Garbage',
    distance: '420m away',
    location: 'Sector 4 Market',
    status: 'Pending',
    gridPos: { top: '60%', left: '25%' },
    color: '#d97706'
  },
  {
    id: 'NB-3',
    type: 'Water Leakage',
    category: 'Water Leakage',
    distance: '650m away',
    location: 'Crossroad 3',
    status: 'Verified',
    gridPos: { top: '22%', left: '68%' },
    color: '#2563eb'
  },
  {
    id: 'NB-4',
    type: 'Broken Streetlight',
    category: 'Streetlight',
    distance: '800m away',
    location: 'Green Avenue Park',
    status: 'Resolved',
    gridPos: { top: '75%', left: '72%' },
    color: '#059669'
  },
  {
    id: 'NB-5',
    type: 'Drainage Block',
    category: 'Drainage',
    distance: '1.1km away',
    location: 'East Gate Alley',
    status: 'Assigned',
    gridPos: { top: '48%', left: '85%' },
    color: '#7c3aed'
  }
];

export const mockNotifications = [
  {
    id: 'N1',
    title: 'Assignment Update',
    message: 'Your complaint CP1024 has been assigned to the Roads Department.',
    time: '2 hours ago',
    unread: true,
    complaintId: 'CP1024'
  },
  {
    id: 'N2',
    title: 'Issue Resolved',
    message: 'Complaint CP1021 has been marked as resolved.',
    time: '1 day ago',
    unread: true,
    complaintId: 'CP1021'
  },
  {
    id: 'N3',
    title: 'Verification Pending',
    message: 'Your complaint CP1023 is awaiting verification.',
    time: '2 days ago',
    unread: false,
    complaintId: 'CP1023'
  },
  {
    id: 'N4',
    title: 'Community Alert',
    message: 'A new water leakage issue was reported near your sector.',
    time: '3 days ago',
    unread: false
  }
];

export const mockCivicImpact = {
  reportsSubmitted: 12,
  reportsResolved: 9,
  communityConfirmations: 18,
  civicScore: 850,
  rankTitle: 'Active Community Guardian'
};

export const mockResolvedFeedback = {
  complaintId: 'CP1021',
  title: 'Broken streetlight at Green Avenue',
  category: 'Streetlight',
  resolvedDate: 'Aug 24, 2026'
};
