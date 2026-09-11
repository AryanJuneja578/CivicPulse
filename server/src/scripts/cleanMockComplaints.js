const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Complaint = require('../models/Complaint');
const { syncCounterMin } = require('../models/Counter');

/**
 * Script to clean mock and test complaints from MongoDB,
 * retaining only authentic user-registered complaints.
 */
async function cleanMockComplaints() {
  console.log('🧹 Connecting to MongoDB to clean mock complaint data...');
  await connectDB();

  const mockIds = ['CP1021', 'CP1023', 'CP1025', 'CP1026', 'CP1027', 'CP1028', 'CP1029'];
  const mockCitizenIds = ['CIT001', 'CIT002'];

  const deleteFilter = {
    $or: [
      { complaintId: { $in: mockIds } },
      { citizenId: { $in: mockCitizenIds } },
      { title: 'Water pipe leakage near Park Gate' }
    ]
  };

  const toDelete = await Complaint.find(deleteFilter);
  console.log(`Found ${toDelete.length} mock/test complaint(s) to remove:`);
  toDelete.forEach((c) => {
    console.log(`  - [${c.complaintId}] "${c.title}" (Citizen: ${c.citizenName || c.citizenId})`);
  });

  const deleteResult = await Complaint.deleteMany(deleteFilter);
  console.log(`\n✅ Successfully deleted ${deleteResult.deletedCount} mock complaint(s).`);

  const remaining = await Complaint.find({}).sort({ createdAt: 1 });
  console.log(`\n📋 Remaining authentic registered complaint(s) (${remaining.length}):`);
  let maxSeq = 1000;
  remaining.forEach((c) => {
    console.log(`  + [${c.complaintId}] "${c.title}" (Citizen: ${c.citizenName}, Created: ${c.createdAt})`);
    const match = c.complaintId.match(/\d+/);
    if (match) {
      const num = parseInt(match[0], 10);
      if (num > maxSeq) maxSeq = num;
    }
  });

  // Sync sequence counter to the highest remaining registered complaint
  await syncCounterMin('complaintId', maxSeq);
  console.log(`\n🔢 Complaint ID counter synced to: ${maxSeq} (Next complaint will be CP${maxSeq + 1})`);
}

if (require.main === module) {
  cleanMockComplaints()
    .then(() => {
      console.log('✨ Cleanup complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Cleanup failed:', err);
      process.exit(1);
    });
}

module.exports = cleanMockComplaints;
