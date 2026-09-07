// Centralized mock data service for Complaint Details & Tracking
import { mockActiveComplaint } from './mockCitizenData';

/**
 * Detailed tracking records keyed by complaintId.
 * Reuses and expands on existing Citizen Dashboard & My Complaints data to maintain consistency.
 */
export const mockComplaintDetailsDatabase = {
  // 1. In Progress Complaint (matching CP1024 from dashboard, with CP1025 alias)
  CP1024: {
    id: 'CP1024',
    title: mockActiveComplaint.title, // 'Large pothole near main gate'
    category: mockActiveComplaint.category, // 'Road Damage'
    description:
      'Severe pothole measuring approximately 4 feet wide and 6 inches deep on the main approach road near Gate 2. It is causing major traffic bottlenecks during peak morning hours and poses a critical hazard to two-wheeler riders and ambulances.',
    dateReported: '28 Aug 2026, 09:30 AM',
    lastUpdated: '31 Aug 2026, 08:45 AM',
    location: 'Main Gate Road, Model Town, Sector 4',
    landmark: 'Opposite Community Market Gate 2',
    coordinates: { lat: '28.7041', lng: '77.1025' },
    priority: 'High',
    status: 'In Progress',
    department: {
      name: 'Public Works Department (PWD)',
      code: 'PWD-NORTH',
      statusNote: 'Currently handling this issue',
      assignedOfficer: 'Field Officer (Road Maintenance Wing)',
      slaTarget: 'Estimated completion by 02 Sep 2026'
    },
    evidence: {
      hasImage: true,
      imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      fileName: 'pothole_main_gate_photo_01.jpg',
      fileSize: '2.4 MB',
      uploadDate: '28 Aug 2026, 09:30 AM'
    },
    stages: [
      {
        key: 'reported',
        label: 'Reported',
        completed: true,
        current: false,
        timestamp: '28 Aug 2026, 09:30 AM',
        description: 'Complaint registered by citizen with photo evidence.'
      },
      {
        key: 'verified',
        label: 'Verified',
        completed: true,
        current: false,
        timestamp: '28 Aug 2026, 02:15 PM',
        description: 'Complaint verified by CivicPulse moderation & severity confirmed.'
      },
      {
        key: 'assigned',
        label: 'Assigned',
        completed: true,
        current: false,
        timestamp: '29 Aug 2026, 10:00 AM',
        description: 'Work order dispatched to Public Works Department (PWD).'
      },
      {
        key: 'in_progress',
        label: 'In Progress',
        completed: false,
        current: true,
        timestamp: '30 Aug 2026, 08:45 AM',
        description: 'Road repair maintenance crew and asphalt supply dispatched to site.'
      },
      {
        key: 'resolved',
        label: 'Resolved',
        completed: false,
        current: false,
        timestamp: 'Pending completion',
        description: 'Final resurfacing inspection and citizen sign-off.'
      }
    ],
    aiAnalysis: {
      category: 'Road Damage',
      confidence: 96,
      suggestedDept: 'Public Works Department (PWD)',
      priority: 'High',
      tag: 'Infrastructure Risk',
      note: 'Predicted based on computer vision edge detection and citizen description keywords.'
    },
    activityLog: [
      {
        id: 'act-1',
        timestamp: '31 Aug 2026 — 08:45 AM',
        author: 'PWD Field Team',
        message: 'Patchwork repair team deployed with cold-mix asphalt. Work currently 60% complete.'
      },
      {
        id: 'act-2',
        timestamp: '30 Aug 2026 — 02:15 PM',
        author: 'Field Officer',
        message: 'Site inspection conducted. Road safety cones placed around pothole perimeter.'
      },
      {
        id: 'act-3',
        timestamp: '29 Aug 2026 — 10:00 AM',
        author: 'CivicPulse System',
        message: 'Complaint assigned to Public Works Department (Road Maintenance Division).'
      },
      {
        id: 'act-4',
        timestamp: '28 Aug 2026 — 02:15 PM',
        author: 'Municipal Moderator',
        message: 'Complaint verified and validated with submitted photographic evidence.'
      },
      {
        id: 'act-5',
        timestamp: '28 Aug 2026 — 09:30 AM',
        author: 'Citizen (You)',
        message: 'Complaint submitted successfully with geo-tagged photograph.'
      }
    ]
  },

  // 2. CP1025 Alias (matching prompt example, in-progress state)
  CP1025: {
    id: 'CP1025',
    title: 'Large pothole near main gate',
    category: 'Road Damage',
    description:
      'Severe pothole measuring approximately 4 feet wide on the main sector boulevard. Creating serious hazard for cyclists and daily vehicular commute.',
    dateReported: '30 Aug 2026, 06:42 PM',
    lastUpdated: '31 Aug 2026, 02:15 PM',
    location: 'Main Gate Road, Model Town',
    landmark: 'Near Main Gate & Transit Station',
    coordinates: { lat: '28.7045', lng: '77.1028' },
    priority: 'High',
    status: 'In Progress',
    department: {
      name: 'Public Works Department',
      code: 'PWD-CIVIC',
      statusNote: 'Currently handling this issue',
      assignedOfficer: 'Field Officer (Road Maintenance Wing)',
      slaTarget: 'Resolution target: 48 hours'
    },
    evidence: {
      hasImage: true,
      imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      fileName: 'pothole_evidence_30aug.jpg',
      fileSize: '1.9 MB',
      uploadDate: '30 Aug 2026, 06:42 PM'
    },
    stages: [
      {
        key: 'reported',
        label: 'Reported',
        completed: true,
        current: false,
        timestamp: '30 Aug 2026, 06:42 PM',
        description: 'Complaint submitted successfully.'
      },
      {
        key: 'verified',
        label: 'Verified',
        completed: true,
        current: false,
        timestamp: '31 Aug 2026, 10:30 AM',
        description: 'Complaint verified by CivicPulse moderation.'
      },
      {
        key: 'assigned',
        label: 'Assigned',
        completed: true,
        current: false,
        timestamp: '31 Aug 2026, 02:15 PM',
        description: 'Field officer has been assigned to inspect the reported location.'
      },
      {
        key: 'in_progress',
        label: 'In Progress',
        completed: false,
        current: true,
        timestamp: '31 Aug 2026, 03:00 PM',
        description: 'Repair crew queued for road filling and resurfacing.'
      },
      {
        key: 'resolved',
        label: 'Resolved',
        completed: false,
        current: false,
        timestamp: 'Pending completion',
        description: 'Work verification and road clearance.'
      }
    ],
    aiAnalysis: {
      category: 'Road Damage',
      confidence: 94,
      suggestedDept: 'Public Works',
      priority: 'High',
      tag: 'Pothole & Surface Wear',
      note: 'Analyzed via CivicPulse prototype image classifier.'
    },
    activityLog: [
      {
        id: 'act-25-1',
        timestamp: '31 Aug 2026 — 2:15 PM',
        author: 'Dispatch Desk',
        message: 'Field officer has been assigned to inspect the reported location.'
      },
      {
        id: 'act-25-2',
        timestamp: '31 Aug 2026 — 10:30 AM',
        author: 'Municipal Moderator',
        message: 'Complaint verified successfully.'
      },
      {
        id: 'act-25-3',
        timestamp: '30 Aug 2026 — 6:42 PM',
        author: 'Citizen (You)',
        message: 'Complaint submitted successfully.'
      }
    ]
  },

  // 3. Pending Complaint (matching CP1023 from mockRecentComplaints)
  CP1023: {
    id: 'CP1023',
    title: 'Garbage accumulation',
    category: 'Waste Management',
    description:
      'Uncollected solid waste and organic refuse accumulated outside the local market perimeter for over 3 days. Overflowing bin causing foul odor and unsanitary conditions near food stalls.',
    dateReported: '27 Aug 2026, 11:20 AM',
    lastUpdated: '27 Aug 2026, 11:20 AM',
    location: 'Sector 4 Market Complex',
    landmark: 'Behind Block C Vegetable Market',
    coordinates: { lat: '28.7012', lng: '77.0984' },
    priority: 'Medium',
    status: 'Pending',
    department: {
      name: 'Municipal Solid Waste Dept',
      code: 'MSW-ZONE-4',
      statusNote: 'Awaiting moderation verification',
      assignedOfficer: 'Sanitation Inspector (Pending Assignment)',
      slaTarget: 'Standard review window: 24 hours'
    },
    evidence: {
      hasImage: false,
      imageUrl: null,
      fileName: null,
      fileSize: null,
      uploadDate: null
    },
    stages: [
      {
        key: 'reported',
        label: 'Reported',
        completed: true,
        current: true,
        timestamp: '27 Aug 2026, 11:20 AM',
        description: 'Report filed by citizen. In queue for moderator review.'
      },
      {
        key: 'verified',
        label: 'Verified',
        completed: false,
        current: false,
        timestamp: 'Pending verification',
        description: 'Moderator validation and priority assessment.'
      },
      {
        key: 'assigned',
        label: 'Assigned',
        completed: false,
        current: false,
        timestamp: 'Pending assignment',
        description: 'Dispatching sanitation truck and field team.'
      },
      {
        key: 'in_progress',
        label: 'In Progress',
        completed: false,
        current: false,
        timestamp: 'Pending action',
        description: 'Waste collection and sanitization of area.'
      },
      {
        key: 'resolved',
        label: 'Resolved',
        completed: false,
        current: false,
        timestamp: 'Pending completion',
        description: 'Bin cleaned and verified.'
      }
    ],
    aiAnalysis: {
      category: 'Garbage / Waste',
      confidence: 91,
      suggestedDept: 'Municipal Solid Waste Dept',
      priority: 'Medium',
      tag: 'Sanitation & Hygiene',
      note: 'Category inferred from text description & sector pattern history.'
    },
    activityLog: [
      {
        id: 'act-23-1',
        timestamp: '27 Aug 2026 — 11:20 AM',
        author: 'Citizen (You)',
        message: 'Complaint filed and queued in central triage system.'
      }
    ]
  },

  // 4. Resolved Complaint (matching CP1021 from mockRecentComplaints & mockResolvedFeedback)
  CP1021: {
    id: 'CP1021',
    title: 'Broken streetlight',
    category: 'Streetlight',
    description:
      'Streetlight pole #42 outside Green Avenue Park has been flickering and completely turned off for the past week, leaving the pedestrian crosswalk completely dark at night.',
    dateReported: '24 Aug 2026, 08:10 PM',
    lastUpdated: '25 Aug 2026, 04:30 PM',
    location: 'Green Avenue, Near Park Gate 3',
    landmark: 'Opposite Green Park Jogging Track',
    coordinates: { lat: '28.7065', lng: '77.1082' },
    priority: 'Low',
    status: 'Resolved',
    department: {
      name: 'Municipal Electrical Dept',
      code: 'MED-LIGHTING',
      statusNote: 'Issue resolved & verified by field team',
      assignedOfficer: 'Senior Linesman (Lighting Wing)',
      slaTarget: 'Completed within 24h SLA'
    },
    evidence: {
      hasImage: true,
      imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      fileName: 'dark_streetlight_pole42.jpg',
      fileSize: '1.2 MB',
      uploadDate: '24 Aug 2026, 08:10 PM'
    },
    stages: [
      {
        key: 'reported',
        label: 'Reported',
        completed: true,
        current: false,
        timestamp: '24 Aug 2026, 08:10 PM',
        description: 'Report filed by citizen.'
      },
      {
        key: 'verified',
        label: 'Verified',
        completed: true,
        current: false,
        timestamp: '25 Aug 2026, 09:15 AM',
        description: 'Verified by electrical sub-station desk.'
      },
      {
        key: 'assigned',
        label: 'Assigned',
        completed: true,
        current: false,
        timestamp: '25 Aug 2026, 10:30 AM',
        description: 'Assigned to Sector 4 maintenance linesman.'
      },
      {
        key: 'in_progress',
        label: 'In Progress',
        completed: true,
        current: false,
        timestamp: '25 Aug 2026, 02:00 PM',
        description: 'Faulty LED fixture and circuit breaker replaced.'
      },
      {
        key: 'resolved',
        label: 'Resolved',
        completed: true,
        current: true,
        timestamp: '25 Aug 2026, 04:30 PM',
        description: 'Illumination tested and marked fully resolved.'
      }
    ],
    aiAnalysis: {
      category: 'Streetlight',
      confidence: 97,
      suggestedDept: 'Municipal Electrical Dept',
      priority: 'Low',
      tag: 'Public Lighting Infrastructure',
      note: 'High confidence category match based on electrical keywords.'
    },
    activityLog: [
      {
        id: 'act-21-1',
        timestamp: '25 Aug 2026 — 04:30 PM',
        author: 'Municipal Electrical Dept',
        message: 'Streetlight LED bulb and wiring replaced. Illumination tested and operational.'
      },
      {
        id: 'act-21-2',
        timestamp: '25 Aug 2026 — 02:00 PM',
        author: 'Maintenance Linesman',
        message: 'Technician on-site. Replacing burnt ballast unit.'
      },
      {
        id: 'act-21-3',
        timestamp: '25 Aug 2026 — 10:30 AM',
        author: 'CivicPulse System',
        message: 'Assigned to Municipal Electrical Dept for replacement.'
      },
      {
        id: 'act-21-4',
        timestamp: '24 Aug 2026 — 08:10 PM',
        author: 'Citizen (You)',
        message: 'Complaint submitted with night photo evidence.'
      }
    ]
  },

  // 5. Rejected Complaint (Realistic scenario for testing rejected state)
  CP1026: {
    id: 'CP1026',
    title: 'Internal courtyard water accumulation',
    category: 'Water Supply',
    description:
      'Private apartment courtyard ground floor has water pooling during car wash. Requesting municipal water department to pump it out.',
    dateReported: '22 Aug 2026, 03:15 PM',
    lastUpdated: '23 Aug 2026, 11:00 AM',
    location: 'Galaxy Apartments, Private Enclave, Sector 4',
    landmark: 'Tower B Ground Floor Courtyard',
    coordinates: { lat: '28.7088', lng: '77.1042' },
    priority: 'Low',
    status: 'Rejected',
    rejectionReason:
      'Issue falls inside a private residential society perimeter. Under Section 14 of Municipal Civic Bylaws, internal private plumbing and courtyard drainage are the responsibility of the Society Resident Welfare Association (RWA) rather than municipal public works.',
    department: {
      name: 'Municipal Drainage & Sanitation Board',
      code: 'MDSB-CENTRAL',
      statusNote: 'Closed - Outside municipal public jurisdiction',
      assignedOfficer: 'Triage Desk Officer',
      slaTarget: 'Case closed'
    },
    evidence: {
      hasImage: false,
      imageUrl: null,
      fileName: null,
      fileSize: null,
      uploadDate: null
    },
    stages: [
      {
        key: 'reported',
        label: 'Reported',
        completed: true,
        current: false,
        timestamp: '22 Aug 2026, 03:15 PM',
        description: 'Report submitted by resident.'
      },
      {
        key: 'verified',
        label: 'Triage Review',
        completed: true,
        current: false,
        timestamp: '23 Aug 2026, 10:15 AM',
        description: 'Reviewed by municipal jurisdiction officer.'
      },
      {
        key: 'rejected',
        label: 'Rejected',
        completed: true,
        current: true,
        timestamp: '23 Aug 2026, 11:00 AM',
        description: 'Complaint rejected: Located on private property outside municipal purview.'
      }
    ],
    aiAnalysis: {
      category: 'Drainage / Private',
      confidence: 88,
      suggestedDept: 'Municipal Drainage Board',
      priority: 'Low',
      tag: 'Jurisdiction Check Needed',
      note: 'Potential private domain flagged by address parser.'
    },
    activityLog: [
      {
        id: 'act-26-1',
        timestamp: '23 Aug 2026 — 11:00 AM',
        author: 'Municipal Moderation Officer',
        message:
          'Complaint rejected: Private society premises are governed by society RWA. Please contact your building management committee.'
      },
      {
        id: 'act-26-2',
        timestamp: '22 Aug 2026 — 03:15 PM',
        author: 'Citizen (You)',
        message: 'Complaint submitted.'
      }
    ]
  }
};

/**
 * Fetch a complaint by ID with case-insensitive fallback or first item fallback
 */
export const getComplaintDetailsById = (complaintId) => {
  if (!complaintId) return null;
  const normalizedId = complaintId.trim().toUpperCase();

  if (mockComplaintDetailsDatabase[normalizedId]) {
    return mockComplaintDetailsDatabase[normalizedId];
  }

  // If someone passed lowercase cp1024 or CP1024
  const foundKey = Object.keys(mockComplaintDetailsDatabase).find(
    (key) => key.toUpperCase() === normalizedId
  );
  if (foundKey) {
    return mockComplaintDetailsDatabase[foundKey];
  }

  return null;
};
