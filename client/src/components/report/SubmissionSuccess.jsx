import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubmissionSuccess = ({ submissionData, onReportAnother }) => {
  const navigate = useNavigate();

  const {
    complaintId = '',
    title = '',
    category = '',
    location = '',
    priority = 'Medium',
    status = 'Reported',
    hasImage = false,
    timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } = submissionData || {};

  const priorityColorMap = {
    High: { bg: '#fef2f2', text: '#dc2626' },
    Medium: { bg: '#fffbeb', text: '#d97706' },
    Low: { bg: '#f0fdf4', text: '#16a34a' }
  };

  const priorityStyle = priorityColorMap[priority] || priorityColorMap.Medium;

  return (
    <div className="success-screen-wrapper">
      <div className="success-animated-icon">
        ✓
      </div>

      <span className="success-badge">Submission Confirmed</span>
      <h1 className="success-main-title">Complaint Submitted Successfully</h1>

      <div className="success-complaint-id-box">
        <span className="id-label">Complaint ID:</span>
        <span className="id-code">{complaintId}</span>
      </div>

      <p className="success-message">
        Your complaint has been received and will be reviewed shortly by our municipal team.
      </p>

      {/* Summary Card */}
      <div className="submitted-summary-card">
        <div className="summary-card-title">Submitted Details Summary</div>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Issue Title</span>
            <span className="summary-value">{title}</span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Category</span>
            <span className="summary-value">{category}</span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Status</span>
            <span className="summary-value">
              <span
                style={{
                  backgroundColor: '#eff6ff',
                  color: '#1d4ed8',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 800
                }}
              >
                {status || 'Reported'}
              </span>
            </span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Location</span>
            <span className="summary-value">{location}</span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Priority / Severity</span>
            <span className="summary-value">
              <span
                style={{
                  backgroundColor: priorityStyle.bg,
                  color: priorityStyle.text,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 800
                }}
              >
                {priority}
              </span>
            </span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Evidence Attached</span>
            <span className="summary-value">
              {hasImage ? '📸 1 Photo Attached' : 'None'}
            </span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Time Submitted</span>
            <span className="summary-value">Today at {timestamp}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="success-action-buttons">
        <button
          type="button"
          className="btn-view-complaint"
          onClick={() => navigate(`/citizen/complaints/${complaintId}`)}
        >
          <span>📋</span>
          <span>View Complaint</span>
        </button>

        <button
          type="button"
          className="btn-back-dashboard"
          onClick={() => navigate('/citizen')}
        >
          <span>🏠</span>
          <span>Back to Dashboard</span>
        </button>

        <button
          type="button"
          className="btn-back-dashboard"
          onClick={onReportAnother}
          style={{ background: '#f1f5f9' }}
        >
          <span>➕</span>
          <span>Report Another Issue</span>
        </button>
      </div>
    </div>
  );
};

export default SubmissionSuccess;
