const http = require('http');
const dotenv = require('dotenv');
dotenv.config();

// Ensure tests use an isolated test database to protect production/dev data
process.env.MONGODB_URI = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/civicpulse_test';

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = require('../src/server');
const connectDB = require('../src/config/db');
const User = require('../src/models/User');
const Complaint = require('../src/models/Complaint');
const seedComplaints = require('../src/scripts/seedComplaints');

const PORT = 5098;

function makeRequest(path, method, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : '';
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: PORT,
        path: path,
        method: method,
        headers
      },
      (res) => {
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          try {
            const parsed = rawData ? JSON.parse(rawData) : {};
            resolve({ status: res.statusCode, data: parsed });
          } catch (e) {
            resolve({ status: res.statusCode, data: rawData });
          }
        });
      }
    );

    req.on('error', (e) => reject(e));
    if (body) {
      req.write(postData);
    }
    req.end();
  });
}

async function runComplaintVerificationTests() {
  console.log('🚀 Starting CivicPulse Complaint Backend Verification Test Suite...\n');

  // Connect to DB and seed initial development data
  await connectDB();
  console.log('📦 Seeding initial development complaints...');
  await seedComplaints();

  // Find or create test citizen user for authenticated tests
  let testUser = await User.findOne({ email: 'aryan@civicpulse.gov.in' });
  if (!testUser) {
    testUser = await User.findOne({ role: 'citizen' });
  }
  if (!testUser) {
    testUser = await User.create({
      name: 'Aryan Test',
      email: 'aryan@civicpulse.gov.in',
      phone: '+91 98765 43210',
      password: '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012',
      role: 'citizen'
    });
  }
  const testToken = jwt.sign(
    { id: testUser._id, role: testUser.role },
    process.env.JWT_SECRET || 'civicpulse_super_secret_jwt_key_2026',
    { expiresIn: '1d' }
  );

  const server = app.listen(PORT, async () => {
    console.log(`📡 Temporary test server running on port ${PORT}\n`);

    try {
      let createdComplaintId = null;

      // 0. Unauthenticated create complaint must be rejected
      console.log('--- Test 0: Unauthenticated Create Complaint (POST /api/complaints without JWT) ---');
      const unauthRes = await makeRequest('/api/complaints', 'POST', {
        title: 'Unauthorized leak',
        description: 'Should fail without JWT',
        category: 'Water',
        priority: 'High',
        location: 'Nowhere'
      });
      if (unauthRes.status !== 401 || unauthRes.data.success !== false) {
        throw new Error(`Expected 401 for unauthenticated request, got ${JSON.stringify(unauthRes)}`);
      }
      console.log(`✅ PASS: Unauthenticated request rejected with 401.`);

      // 1. Create Complaint with valid JWT
      console.log('\n--- Test 1: Create Complaint (POST /api/complaints with JWT) ---');
      const createRes = await makeRequest(
        '/api/complaints',
        'POST',
        {
          title: 'Water pipe leakage near Park Gate',
          description: 'Underground potable water pipe has burst creating massive flooding on the walkway.',
          category: 'Water',
          priority: 'High',
          location: {
            address: 'Park Gate Road, Block C',
            latitude: 28.7055,
            longitude: 77.1065,
            landmark: 'In front of Gate 1'
          },
          evidence: {
            imageUrl: 'https://example.com/water_leak.jpg'
          }
        },
        testToken
      );

      if (createRes.status !== 201 || !createRes.data.success || !createRes.data.data.complaintId) {
        throw new Error(`Create complaint failed: ${JSON.stringify(createRes.data)}`);
      }
      createdComplaintId = createRes.data.data.complaintId;
      console.log(`✅ PASS: Complaint created with ID: ${createdComplaintId}`);
      if (createRes.data.data.citizenId !== testUser._id.toString()) {
        throw new Error(`Expected citizenId to be derived from JWT (${testUser._id}), got: ${createRes.data.data.citizenId}`);
      }
      console.log(`✅ PASS: Citizen identity successfully derived from JWT (${createRes.data.data.citizenId}).`);
      if (createRes.data.data.status !== 'Reported') {
        throw new Error(`Expected initial status to be 'Reported', got: ${createRes.data.data.status}`);
      }
      if (!createRes.data.data.timeline || createRes.data.data.timeline.length !== 1) {
        throw new Error(`Expected initial activity timeline entry, got: ${JSON.stringify(createRes.data.data.timeline)}`);
      }
      console.log(`✅ PASS: Initial status is 'Reported' and first activity is logged.`);

      // Direct MongoDB check to verify persistence
      const dbRecord = await Complaint.findOne({ complaintId: createdComplaintId });
      if (!dbRecord) {
        throw new Error(`Complaint ${createdComplaintId} not found directly in MongoDB!`);
      }
      console.log(`✅ PASS: Verified complaint ${createdComplaintId} exists in MongoDB.`);

      // 2. Get All Complaints
      console.log('\n--- Test 2: Get All Complaints (GET /api/complaints) ---');
      const allRes = await makeRequest('/api/complaints', 'GET');
      if (allRes.status !== 200 || !allRes.data.success || !Array.isArray(allRes.data.data)) {
        throw new Error(`Get all complaints failed: ${JSON.stringify(allRes.data)}`);
      }
      console.log(`✅ PASS: Retrieved ${allRes.data.count} complaints (sorted newest first)`);
      if (allRes.data.count < 5) {
        throw new Error(`Expected at least 5 complaints after seed and creation, got ${allRes.data.count}`);
      }

      // 3. Filter by Citizen
      console.log('\n--- Test 3: Filter by Citizen (GET /api/complaints?citizenId=CIT001) ---');
      const citizenFilterRes = await makeRequest('/api/complaints?citizenId=CIT001', 'GET');
      if (citizenFilterRes.status !== 200 || !citizenFilterRes.data.success) {
        throw new Error(`Filter by citizen failed: ${JSON.stringify(citizenFilterRes.data)}`);
      }
      const matchCitizen = citizenFilterRes.data.data.every((c) => c.citizenId === 'CIT001');
      if (!matchCitizen || citizenFilterRes.data.count < 1) {
        throw new Error(`Citizen filter returned non-matching records`);
      }
      console.log(`✅ PASS: Filtered by citizenId=CIT002 returned ${citizenFilterRes.data.count} record(s) correctly.`);

      // 4. Filter by Status
      console.log('\n--- Test 4: Filter by Status (GET /api/complaints?status=In Progress) ---');
      const statusFilterRes = await makeRequest('/api/complaints?status=In%20Progress', 'GET');
      if (statusFilterRes.status !== 200 || !statusFilterRes.data.success) {
        throw new Error(`Filter by status failed: ${JSON.stringify(statusFilterRes.data)}`);
      }
      const matchStatus = statusFilterRes.data.data.every((c) => c.status === 'In Progress');
      if (!matchStatus || statusFilterRes.data.count < 1) {
        throw new Error(`Status filter returned non-matching records`);
      }
      console.log(`✅ PASS: Filtered by status='In Progress' returned ${statusFilterRes.data.count} record(s) correctly.`);

      // 5. Get Single Complaint by ID
      console.log('\n--- Test 5: Get Single Complaint (GET /api/complaints/CP1025) ---');
      const singleRes = await makeRequest('/api/complaints/CP1025', 'GET');
      if (singleRes.status !== 200 || !singleRes.data.success || singleRes.data.data.complaintId !== 'CP1025') {
        throw new Error(`Get complaint by ID failed: ${JSON.stringify(singleRes.data)}`);
      }
      console.log(`✅ PASS: Retrieved complaint CP1025 with complete details.`);

      // Also verify lowercase lookup works
      const singleLowerRes = await makeRequest('/api/complaints/cp1025', 'GET');
      if (singleLowerRes.status !== 200 || singleLowerRes.data.data.complaintId !== 'CP1025') {
        throw new Error(`Case-insensitive lookup for cp1025 failed`);
      }
      console.log(`✅ PASS: Case-insensitive lookup (cp1025) returned CP1025.`);

      // 6. Update Complaint Status
      console.log('\n--- Test 6: Update Complaint Status (PATCH /api/complaints/:complaintId/status) ---');
      const updateStatusRes = await makeRequest(`/api/complaints/${createdComplaintId}/status`, 'PATCH', {
        status: 'In Progress',
        message: 'Water board maintenance van and repair crew arrived at site.',
        performedBy: 'Delhi Jal Board Desk'
      });
      if (updateStatusRes.status !== 200 || !updateStatusRes.data.success) {
        throw new Error(`Update status failed: ${JSON.stringify(updateStatusRes.data)}`);
      }
      if (updateStatusRes.data.data.status !== 'In Progress') {
        throw new Error(`Expected status 'In Progress', got ${updateStatusRes.data.data.status}`);
      }
      const lastActivity = updateStatusRes.data.data.timeline[updateStatusRes.data.data.timeline.length - 1];
      if (lastActivity.status !== 'In Progress' || !lastActivity.message.includes('van and repair crew')) {
        throw new Error(`Activity timeline was not updated properly: ${JSON.stringify(lastActivity)}`);
      }
      console.log(`✅ PASS: Updated status to 'In Progress' and logged activity timeline entry.`);

      // 7. Add Activity Information
      console.log('\n--- Test 7: Add Complaint Activity (POST /api/complaints/:complaintId/activity) ---');
      const addActRes = await makeRequest(`/api/complaints/${createdComplaintId}/activity`, 'POST', {
        message: 'Citizen note: The main valve has been closed by local watchman.',
        performedBy: 'Priya Sharma (Citizen)'
      });
      if (addActRes.status !== 200 || !addActRes.data.success) {
        throw new Error(`Add activity failed: ${JSON.stringify(addActRes.data)}`);
      }
      const latestAct = addActRes.data.data.timeline[addActRes.data.data.timeline.length - 1];
      if (!latestAct.message.includes('main valve has been closed')) {
        throw new Error(`Activity message was not added to timeline`);
      }
      console.log(`✅ PASS: Added citizen activity update to complaint timeline.`);

      // 8. Submit Feedback
      console.log('\n--- Test 8: Submit Resolution Feedback (POST /api/complaints/:complaintId/feedback) ---');
      // First resolve the complaint
      await makeRequest(`/api/complaints/${createdComplaintId}/status`, 'PATCH', {
        status: 'Resolved',
        message: 'Pipe welded and pressure restored.',
        performedBy: 'Water Board Engineer'
      });

      const feedbackRes = await makeRequest(`/api/complaints/${createdComplaintId}/feedback`, 'POST', {
        rating: 5,
        feedback: 'Leak was fixed within 2 hours. Very satisfied!'
      });
      if (feedbackRes.status !== 200 || !feedbackRes.data.success) {
        throw new Error(`Submit feedback failed: ${JSON.stringify(feedbackRes.data)}`);
      }
      if (feedbackRes.data.data.citizenRating !== 5 || !feedbackRes.data.data.citizenFeedback.includes('fixed within 2 hours')) {
        throw new Error(`Rating and feedback not properly saved: ${JSON.stringify(feedbackRes.data.data)}`);
      }
      console.log(`✅ PASS: Submitted 5-star resolution feedback and feedback comment.`);

      // 9. Validation: Invalid Complaint Data (missing required fields)
      console.log('\n--- Test 9: Validation - Missing Required Fields (POST /api/complaints) ---');
      const missingTitleRes = await makeRequest('/api/complaints', 'POST', {
        description: 'Missing title test',
        category: 'Roads',
        priority: 'Medium',
        location: 'Sector 1'
      }, testToken);
      if (missingTitleRes.status !== 400 || missingTitleRes.data.success !== false || missingTitleRes.data.message !== 'Title is required') {
        throw new Error(`Expected 400 'Title is required', got: ${JSON.stringify(missingTitleRes)}`);
      }

      const missingDescRes = await makeRequest('/api/complaints', 'POST', {
        title: 'Test',
        category: 'Roads',
        priority: 'Medium',
        location: 'Sector 1'
      }, testToken);
      if (missingDescRes.status !== 400 || missingDescRes.data.message !== 'Description is required') {
        throw new Error(`Expected 400 'Description is required', got: ${JSON.stringify(missingDescRes)}`);
      }

      const invalidCatRes = await makeRequest('/api/complaints', 'POST', {
        title: 'Test Title',
        description: 'Some valid description text here',
        category: 'Spacecraft',
        priority: 'Medium',
        location: 'Sector 1'
      }, testToken);
      if (invalidCatRes.status !== 400 || !invalidCatRes.data.message.includes('Invalid category')) {
        throw new Error(`Expected 400 'Invalid category', got: ${JSON.stringify(invalidCatRes)}`);
      }
      console.log(`✅ PASS: Properly rejected invalid create requests with consistent error message.`);

      // 10. Validation: Invalid Status
      console.log('\n--- Test 10: Validation - Invalid Status (PATCH /api/complaints/:id/status) ---');
      const invalidStatusRes = await makeRequest('/api/complaints/CP1025/status', 'PATCH', {
        status: 'Flying'
      });
      if (invalidStatusRes.status !== 400 || invalidStatusRes.data.success !== false || !invalidStatusRes.data.message.includes('Invalid status')) {
        throw new Error(`Expected 400 'Invalid status', got: ${JSON.stringify(invalidStatusRes)}`);
      }
      console.log(`✅ PASS: Rejected invalid status 'Flying' with 400 error.`);

      // 11. Validation: Invalid Rating
      console.log('\n--- Test 11: Validation - Invalid Rating (POST /api/complaints/:id/feedback) ---');
      const invalidRatingRes = await makeRequest('/api/complaints/CP1025/feedback', 'POST', {
        rating: 6,
        feedback: 'Too high'
      });
      if (invalidRatingRes.status !== 400 || invalidRatingRes.data.success !== false || !invalidRatingRes.data.message.includes('Rating must be an integer between 1 and 5')) {
        throw new Error(`Expected 400 'Rating must be an integer between 1 and 5', got: ${JSON.stringify(invalidRatingRes)}`);
      }
      const invalidRatingZeroRes = await makeRequest('/api/complaints/CP1025/feedback', 'POST', {
        rating: 0
      });
      if (invalidRatingZeroRes.status !== 400) {
        throw new Error(`Expected 400 for rating 0, got: ${invalidRatingZeroRes.status}`);
      }
      console.log(`✅ PASS: Rejected ratings 0 and 6 with 400 error.`);

      // 12. Non-existent Complaint
      console.log('\n--- Test 12: Non-existent Complaint (GET /api/complaints/CP9999) ---');
      const notFoundRes = await makeRequest('/api/complaints/CP9999', 'GET');
      if (notFoundRes.status !== 404 || notFoundRes.data.success !== false || notFoundRes.data.message !== 'Complaint not found') {
        throw new Error(`Expected 404 'Complaint not found', got: ${JSON.stringify(notFoundRes)}`);
      }
      console.log(`✅ PASS: Non-existent complaint returned 404 with standard error format.`);

      console.log('\n======================================================');
      console.log('🎉 ALL 12 COMPLAINT VERIFICATION TESTS PASSED SUCCESSFULLY!');
      console.log('======================================================\n');

      server.close(async () => {
        try {
          if (mongoose.connection.readyState === 1 && mongoose.connection.name === 'civicpulse_test') {
            await mongoose.connection.dropDatabase();
            await mongoose.connection.close();
          }
        } catch (e) {
          // ignore
        }
        process.exit(0);
      });
    } catch (err) {
      console.error('\n❌ TEST FAILED:', err.message);
      server.close(async () => {
        try {
          if (mongoose.connection.readyState === 1 && mongoose.connection.name === 'civicpulse_test') {
            await mongoose.connection.dropDatabase();
            await mongoose.connection.close();
          }
        } catch (e) {
          // ignore
        }
        process.exit(1);
      });
    }
  });
}

runComplaintVerificationTests().catch((err) => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
