const mongoose = require('mongoose');
const Complaint = require('../models/Complaint');
const { getNextComplaintId } = require('../models/Counter');

/**
 * Helper to find complaint by complaintId (case-insensitive) or MongoDB _id
 */
async function findComplaintByIdOrCode(identifier) {
  if (!identifier) return null;
  const trimmed = identifier.trim();
  const upper = trimmed.toUpperCase();

  // Primary lookup by human-readable complaintId (e.g. CP1025)
  let complaint = await Complaint.findOne({ complaintId: upper });
  if (complaint) return complaint;

  // Fallback if client passed MongoDB ObjectId
  if (mongoose.Types.ObjectId.isValid(trimmed)) {
    complaint = await Complaint.findById(trimmed);
  }

  return complaint;
}

/**
 * Create a new Complaint
 * POST /api/complaints
 */
const createComplaint = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      location,
      evidence,
      imageUrl,
      videoUrl,
      citizenId,
      citizenName
    } = req.body;

    // Generate unique collision-safe human-readable ID
    const complaintId = await getNextComplaintId();

    // Format location
    let locationObj;
    if (typeof location === 'string') {
      locationObj = {
        address: location.trim(),
        latitude: null,
        longitude: null,
        landmark: null
      };
    } else {
      locationObj = {
        address: location.address ? location.address.trim() : '',
        latitude: typeof location.latitude === 'number' ? location.latitude : null,
        longitude: typeof location.longitude === 'number' ? location.longitude : null,
        landmark: location.landmark ? location.landmark.trim() : null
      };
    }

    // Format evidence metadata
    const evidenceObj = {
      imageUrl: (evidence && evidence.imageUrl) || imageUrl || null,
      videoUrl: (evidence && evidence.videoUrl) || videoUrl || null
    };

    // Derive citizen identity from authenticated JWT (req.user)
    const resolvedCitizenId = req.user ? req.user._id.toString() : (citizenId ? citizenId.trim() : 'CIT001');
    const resolvedCitizenName = req.user ? (req.user.name || 'Citizen') : (citizenName ? citizenName.trim() : 'Citizen');

    // Initial activity log entry
    const initialActivity = {
      status: 'Reported',
      message: 'Complaint reported',
      performedBy: resolvedCitizenName,
      timestamp: new Date()
    };

    const complaint = new Complaint({
      complaintId,
      citizenId: resolvedCitizenId,
      citizenName: resolvedCitizenName,
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      priority: priority.trim(),
      status: 'Reported',
      location: locationObj,
      evidence: evidenceObj,
      timeline: [initialActivity]
    });

    const savedComplaint = await complaint.save();

    res.status(201).json({
      success: true,
      data: savedComplaint
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all complaints with optional filters
 * GET /api/complaints
 * Query Params: citizenId, status, category, priority
 */
const getComplaints = async (req, res, next) => {
  try {
    const { citizenId, status, category, priority } = req.query;

    const filter = {};
    if (citizenId) filter.citizenId = citizenId.trim();
    if (status) filter.status = status.trim();
    if (category) filter.category = category.trim();
    if (priority) filter.priority = priority.trim();

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single complaint by complaintId or _id
 * GET /api/complaints/:complaintId
 */
const getComplaintById = async (req, res, next) => {
  try {
    const { complaintId } = req.params;
    const complaint = await findComplaintByIdOrCode(complaintId);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update complaint status
 * PATCH /api/complaints/:complaintId/status
 */
const updateComplaintStatus = async (req, res, next) => {
  try {
    const { complaintId } = req.params;
    const { status, message, performedBy, department, assignedOfficer, rejectionReason, resolutionDescription } = req.body;

    const complaint = await findComplaintByIdOrCode(complaintId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    const previousStatus = complaint.status;
    complaint.status = status.trim();

    // Contextual timestamp and assignment updates
    if (status === 'Assigned') {
      if (!complaint.assignedAt) complaint.assignedAt = new Date();
      if (department) complaint.department = department.trim();
      if (assignedOfficer) complaint.assignedOfficer = assignedOfficer.trim();
    } else if (status === 'In Progress') {
      if (department && !complaint.department) complaint.department = department.trim();
      if (assignedOfficer && !complaint.assignedOfficer) complaint.assignedOfficer = assignedOfficer.trim();
    } else if (status === 'Resolved') {
      if (!complaint.resolvedAt) complaint.resolvedAt = new Date();
      if (resolutionDescription) complaint.resolutionDescription = resolutionDescription.trim();
    } else if (status === 'Rejected') {
      if (rejectionReason) complaint.rejectionReason = rejectionReason.trim();
    }

    // Append to activity timeline
    const activityMessage = message && message.trim()
      ? message.trim()
      : `Status changed from ${previousStatus} to ${complaint.status}`;

    complaint.timeline.push({
      status: complaint.status,
      message: activityMessage,
      performedBy: performedBy ? performedBy.trim() : 'Officer',
      timestamp: new Date()
    });

    const updatedComplaint = await complaint.save();

    res.status(200).json({
      success: true,
      data: updatedComplaint
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add citizen or officer activity information to complaint
 * POST /api/complaints/:complaintId/activity
 */
const addComplaintActivity = async (req, res, next) => {
  try {
    const { complaintId } = req.params;
    const { message, performedBy } = req.body;

    const complaint = await findComplaintByIdOrCode(complaintId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    complaint.timeline.push({
      status: complaint.status,
      message: message.trim(),
      performedBy: performedBy ? performedBy.trim() : (complaint.citizenName || 'Citizen'),
      timestamp: new Date()
    });

    const updatedComplaint = await complaint.save();

    res.status(200).json({
      success: true,
      data: updatedComplaint
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit citizen resolution feedback and star rating
 * POST /api/complaints/:complaintId/feedback
 */
const submitComplaintFeedback = async (req, res, next) => {
  try {
    const { complaintId } = req.params;
    const { rating, feedback } = req.body;

    const complaint = await findComplaintByIdOrCode(complaintId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    complaint.citizenRating = Number(rating);
    if (feedback) {
      complaint.citizenFeedback = feedback.trim();
    }

    // Append rating to activity timeline
    const feedbackSummary = feedback && feedback.trim()
      ? `Citizen submitted rating: ${rating}/5 stars - "${feedback.trim()}"`
      : `Citizen submitted rating: ${rating}/5 stars`;

    complaint.timeline.push({
      status: complaint.status,
      message: feedbackSummary,
      performedBy: complaint.citizenName || 'Citizen',
      timestamp: new Date()
    });

    const updatedComplaint = await complaint.save();

    res.status(200).json({
      success: true,
      data: updatedComplaint
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  addComplaintActivity,
  submitComplaintFeedback
};
