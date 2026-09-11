const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['Reported', 'Verified', 'Assigned', 'In Progress', 'Resolved', 'Rejected', null],
      default: null
    },
    message: {
      type: String,
      required: [true, 'Activity message is required'],
      trim: true
    },
    performedBy: {
      type: String,
      default: 'System',
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const locationSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: [true, 'Location address is required'],
      trim: true
    },
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    },
    landmark: {
      type: String,
      default: null,
      trim: true
    }
  },
  { _id: false }
);

const evidenceSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      default: null,
      trim: true
    },
    videoUrl: {
      type: String,
      default: null,
      trim: true
    }
  },
  { _id: false }
);

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: [true, 'Complaint ID is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    citizenId: {
      type: String,
      required: [true, 'Citizen ID is required'],
      default: 'CIT001',
      trim: true,
      index: true
    },
    citizenName: {
      type: String,
      required: [true, 'Citizen name is required'],
      default: 'Citizen',
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'Roads',
          'Garbage',
          'Water',
          'Electricity',
          'Streetlight',
          'Drainage',
          'Public Safety',
          'Other',
          // Frontend variations:
          'Road Damage',
          'Garbage / Waste',
          'Water Supply',
          'Water Leakage',
          'Waste Management'
        ],
        message: 'Invalid category: {VALUE}'
      },
      trim: true,
      index: true
    },
    location: {
      type: locationSchema,
      required: [true, 'Location is required']
    },
    evidence: {
      type: evidenceSchema,
      default: () => ({ imageUrl: null, videoUrl: null })
    },
    priority: {
      type: String,
      required: [true, 'Priority is required'],
      enum: {
        values: ['Low', 'Medium', 'High', 'Critical'],
        message: 'Invalid priority: {VALUE}. Must be Low, Medium, High, or Critical'
      },
      default: 'Medium',
      index: true
    },
    status: {
      type: String,
      enum: {
        values: ['Reported', 'Verified', 'Assigned', 'In Progress', 'Resolved', 'Rejected'],
        message: 'Invalid status: {VALUE}. Must be Reported, Verified, Assigned, In Progress, Resolved, or Rejected'
      },
      default: 'Reported',
      index: true
    },
    department: {
      type: String,
      default: null,
      trim: true
    },
    assignedOfficer: {
      type: String,
      default: null,
      trim: true
    },
    assignedAt: {
      type: Date,
      default: null
    },
    slaDeadline: {
      type: Date,
      default: null
    },
    aiCategory: {
      type: String,
      default: null,
      trim: true
    },
    aiConfidence: {
      type: Number,
      default: null
    },
    aiModerationStatus: {
      type: String,
      default: 'Pending',
      trim: true
    },
    timeline: {
      type: [activitySchema],
      default: []
    },
    resolutionDescription: {
      type: String,
      default: null,
      trim: true
    },
    resolvedAt: {
      type: Date,
      default: null
    },
    citizenRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      default: null
    },
    citizenFeedback: {
      type: String,
      default: null,
      trim: true
    },
    rejectionReason: {
      type: String,
      default: null,
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Indexes for query performance
complaintSchema.index({ citizenId: 1, createdAt: -1 });
complaintSchema.index({ status: 1, createdAt: -1 });
complaintSchema.index({ category: 1, createdAt: -1 });
complaintSchema.index({ priority: 1, createdAt: -1 });

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
