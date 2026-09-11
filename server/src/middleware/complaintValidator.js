const ALLOWED_CATEGORIES = [
  'Roads',
  'Garbage',
  'Water',
  'Electricity',
  'Streetlight',
  'Drainage',
  'Public Safety',
  'Other',
  // Frontend variations
  'Road Damage',
  'Garbage / Waste',
  'Water Supply',
  'Water Leakage',
  'Waste Management'
];

const ALLOWED_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

const ALLOWED_STATUSES = ['Reported', 'Verified', 'Assigned', 'In Progress', 'Resolved', 'Rejected'];

/**
 * Validate Complaint Creation Payload
 */
const validateCreateComplaint = (req, res, next) => {
  const { title, description, category, priority, location } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Title is required'
    });
  }

  if (!description || typeof description !== 'string' || !description.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Description is required'
    });
  }

  if (!category || typeof category !== 'string' || !category.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Category is required'
    });
  }

  if (!ALLOWED_CATEGORIES.includes(category.trim())) {
    return res.status(400).json({
      success: false,
      message: `Invalid category. Supported categories: ${ALLOWED_CATEGORIES.slice(0, 8).join(', ')}`
    });
  }

  if (!priority || typeof priority !== 'string' || !priority.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Priority is required'
    });
  }

  if (!ALLOWED_PRIORITIES.includes(priority.trim())) {
    return res.status(400).json({
      success: false,
      message: `Invalid priority: ${priority}. Must be one of: ${ALLOWED_PRIORITIES.join(', ')}`
    });
  }

  // Location validation (can be string or object with address)
  if (!location) {
    return res.status(400).json({
      success: false,
      message: 'Location is required'
    });
  }

  if (typeof location === 'string' && !location.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Location address is required'
    });
  }

  if (typeof location === 'object' && (!location.address || !location.address.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Location address is required'
    });
  }

  next();
};

/**
 * Validate Status Update Payload
 */
const validateStatusUpdate = (req, res, next) => {
  const { status } = req.body;

  if (!status || typeof status !== 'string' || !status.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Status is required'
    });
  }

  if (!ALLOWED_STATUSES.includes(status.trim())) {
    return res.status(400).json({
      success: false,
      message: `Invalid status: ${status}. Must be one of: ${ALLOWED_STATUSES.join(', ')}`
    });
  }

  next();
};

/**
 * Validate Activity Payload
 */
const validateActivity = (req, res, next) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Activity message is required'
    });
  }

  next();
};

/**
 * Validate Resolution Feedback Payload
 */
const validateFeedback = (req, res, next) => {
  const { rating } = req.body;

  if (rating === undefined || rating === null) {
    return res.status(400).json({
      success: false,
      message: 'Rating is required'
    });
  }

  const numRating = Number(rating);
  if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be an integer between 1 and 5'
    });
  }

  next();
};

module.exports = {
  validateCreateComplaint,
  validateStatusUpdate,
  validateActivity,
  validateFeedback,
  ALLOWED_CATEGORIES,
  ALLOWED_PRIORITIES,
  ALLOWED_STATUSES
};
