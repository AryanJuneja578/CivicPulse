const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const Complaint = require('../models/Complaint');
const { syncCounterMin } = require('../models/Counter');

const sampleComplaints = [
  {
    complaintId: 'CP1021',
    citizenId: 'CIT001',
    citizenName: 'Aryan',
    title: 'Broken streetlight',
    description:
      'Streetlight pole #42 outside Green Avenue Park has been flickering and completely turned off for the past week, leaving the pedestrian crosswalk completely dark at night.',
    category: 'Streetlight',
    priority: 'Low',
    status: 'Resolved',
    location: {
      address: 'Green Avenue, Near Park Gate 3',
      latitude: 28.7065,
      longitude: 77.1082,
      landmark: 'Opposite Green Park Jogging Track'
    },
    evidence: {
      imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      videoUrl: null
    },
    department: 'Municipal Electrical Dept',
    assignedOfficer: 'Senior Linesman (Lighting Wing)',
    assignedAt: new Date('2026-08-25T10:30:00Z'),
    resolvedAt: new Date('2026-08-25T16:30:00Z'),
    citizenRating: 5,
    citizenFeedback: 'Streetlight LED was replaced quickly. Crosswalk is well lit again.',
    aiCategory: 'Streetlight',
    aiConfidence: 97,
    aiModerationStatus: 'Verified',
    timeline: [
      {
        status: 'Reported',
        message: 'Complaint submitted with night photo evidence.',
        performedBy: 'Aryan',
        timestamp: new Date('2026-08-24T20:10:00Z')
      },
      {
        status: 'Verified',
        message: 'Verified by electrical sub-station desk.',
        performedBy: 'Municipal Moderator',
        timestamp: new Date('2026-08-25T09:15:00Z')
      },
      {
        status: 'Assigned',
        message: 'Assigned to Municipal Electrical Dept for replacement.',
        performedBy: 'CivicPulse System',
        timestamp: new Date('2026-08-25T10:30:00Z')
      },
      {
        status: 'In Progress',
        message: 'Technician on-site replacing burnt ballast unit.',
        performedBy: 'Maintenance Linesman',
        timestamp: new Date('2026-08-25T14:00:00Z')
      },
      {
        status: 'Resolved',
        message: 'Streetlight LED bulb and wiring replaced. Illumination tested and operational.',
        performedBy: 'Municipal Electrical Dept',
        timestamp: new Date('2026-08-25T16:30:00Z')
      }
    ]
  },
  {
    complaintId: 'CP1023',
    citizenId: 'CIT001',
    citizenName: 'Aryan',
    title: 'Garbage accumulation',
    description:
      'Uncollected solid waste and organic refuse accumulated outside the local market perimeter for over 3 days. Overflowing bin causing foul odor and unsanitary conditions near food stalls.',
    category: 'Garbage',
    priority: 'Medium',
    status: 'Reported',
    location: {
      address: 'Sector 4 Market Complex',
      latitude: 28.7012,
      longitude: 77.0984,
      landmark: 'Behind Block C Vegetable Market'
    },
    evidence: {
      imageUrl: null,
      videoUrl: null
    },
    department: 'Municipal Solid Waste Dept',
    assignedOfficer: 'Sanitation Inspector (Pending Assignment)',
    aiCategory: 'Garbage',
    aiConfidence: 91,
    aiModerationStatus: 'Pending',
    timeline: [
      {
        status: 'Reported',
        message: 'Complaint filed and queued in central triage system.',
        performedBy: 'Aryan',
        timestamp: new Date('2026-08-27T11:20:00Z')
      }
    ]
  },
  {
    complaintId: 'CP1025',
    citizenId: 'CIT001',
    citizenName: 'Aryan',
    title: 'Large pothole near main gate',
    description:
      'Severe pothole measuring approximately 4 feet wide on the main sector boulevard. Creating serious hazard for cyclists and daily vehicular commute.',
    category: 'Roads',
    priority: 'High',
    status: 'In Progress',
    location: {
      address: 'Main Gate Road, Model Town',
      latitude: 28.7045,
      longitude: 77.1028,
      landmark: 'Near Main Gate & Transit Station'
    },
    evidence: {
      imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      videoUrl: null
    },
    department: 'Public Works Department (PWD)',
    assignedOfficer: 'Field Officer (Road Maintenance Wing)',
    assignedAt: new Date('2026-08-31T14:15:00Z'),
    aiCategory: 'Roads',
    aiConfidence: 94,
    aiModerationStatus: 'Verified',
    timeline: [
      {
        status: 'Reported',
        message: 'Complaint submitted successfully.',
        performedBy: 'Aryan',
        timestamp: new Date('2026-08-30T18:42:00Z')
      },
      {
        status: 'Verified',
        message: 'Complaint verified successfully.',
        performedBy: 'Municipal Moderator',
        timestamp: new Date('2026-08-31T10:30:00Z')
      },
      {
        status: 'Assigned',
        message: 'Field officer has been assigned to inspect the reported location.',
        performedBy: 'Dispatch Desk',
        timestamp: new Date('2026-08-31T14:15:00Z')
      },
      {
        status: 'In Progress',
        message: 'Repair crew queued for road filling and resurfacing.',
        performedBy: 'PWD Field Team',
        timestamp: new Date('2026-08-31T15:00:00Z')
      }
    ]
  },
  {
    complaintId: 'CP1026',
    citizenId: 'CIT001',
    citizenName: 'Aryan',
    title: 'Internal courtyard water accumulation',
    description:
      'Private apartment courtyard ground floor has water pooling during car wash. Requesting municipal water department to pump it out.',
    category: 'Water',
    priority: 'Low',
    status: 'Rejected',
    rejectionReason:
      'Issue falls inside a private residential society perimeter. Under Section 14 of Municipal Civic Bylaws, internal private plumbing and courtyard drainage are the responsibility of the Society Resident Welfare Association (RWA) rather than municipal public works.',
    location: {
      address: 'Galaxy Apartments, Private Enclave, Sector 4',
      latitude: 28.7088,
      longitude: 77.1042,
      landmark: 'Tower B Ground Floor Courtyard'
    },
    evidence: {
      imageUrl: null,
      videoUrl: null
    },
    department: 'Municipal Drainage & Sanitation Board',
    assignedOfficer: 'Triage Desk Officer',
    aiCategory: 'Water',
    aiConfidence: 88,
    aiModerationStatus: 'Rejected',
    timeline: [
      {
        status: 'Reported',
        message: 'Complaint submitted.',
        performedBy: 'Aryan',
        timestamp: new Date('2026-08-22T15:15:00Z')
      },
      {
        status: 'Rejected',
        message:
          'Complaint rejected: Private society premises are governed by society RWA. Please contact your building management committee.',
        performedBy: 'Municipal Moderation Officer',
        timestamp: new Date('2026-08-23T11:00:00Z')
      }
    ]
  }
];

/**
 * Seed complaints into database without duplicates
 */
async function seedComplaints() {
  console.log('🌱 Starting CivicPulse Complaint Database Seeder...');
  await connectDB();

  let insertedCount = 0;
  let updatedCount = 0;
  let highestNum = 1000;

  for (const item of sampleComplaints) {
    const res = await Complaint.updateOne(
      { complaintId: item.complaintId },
      { $set: item },
      { upsert: true }
    );

    if (res.upsertedCount > 0) {
      insertedCount++;
    } else {
      updatedCount++;
    }

    const numMatch = item.complaintId.match(/\d+/);
    if (numMatch) {
      const num = parseInt(numMatch[0], 10);
      if (num > highestNum) highestNum = num;
    }
  }

  // Ensure sequence counter is positioned after seeded IDs (e.g. at 1026, next will be 1027)
  await syncCounterMin('complaintId', highestNum);

  console.log(`✅ Seeding Complete!`);
  console.log(`   Inserted: ${insertedCount}`);
  console.log(`   Updated: ${updatedCount}`);
  console.log(`   Complaint Counter synced to: ${highestNum} (Next ID will be CP${highestNum + 1})`);
}

if (require.main === module) {
  seedComplaints()
    .then(() => {
      console.log('✨ Seeder process finished successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Seeder failed:', err.message);
      process.exit(1);
    });
}

module.exports = seedComplaints;
