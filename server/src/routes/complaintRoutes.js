const express = require('express');
const router = express.Router();

const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  addComplaintActivity,
  submitComplaintFeedback
} = require('../controllers/complaintController');

const {
  validateCreateComplaint,
  validateStatusUpdate,
  validateActivity,
  validateFeedback
} = require('../middleware/complaintValidator');

const { authenticateToken } = require('../middleware/authMiddleware');

// 1. Create Complaint (Protected: derives citizen from JWT)
router.post('/', authenticateToken, validateCreateComplaint, createComplaint);

// 2. Get Complaints (with filtering by citizenId, status, category, priority)
router.get('/', getComplaints);

// 3. Get Single Complaint by complaintId (e.g. CP1025)
router.get('/:complaintId', getComplaintById);

// 4. Update Complaint Status
router.patch('/:complaintId/status', validateStatusUpdate, updateComplaintStatus);

// 5. Add Complaint Activity / Info
router.post('/:complaintId/activity', validateActivity, addComplaintActivity);

// 6. Submit Resolution Feedback (Rating & Review)
router.post('/:complaintId/feedback', validateFeedback, submitComplaintFeedback);

module.exports = router;
