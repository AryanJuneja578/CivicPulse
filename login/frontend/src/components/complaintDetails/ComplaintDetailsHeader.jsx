import React from 'react';
import { useNavigate } from 'react-router-dom';

const ComplaintDetailsHeader = ({ complaint }) => {
  const navigate = useNavigate();

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'in progress':
        return 'status-badge-in-progress';
      case 'resolved':
        return 'status-badge-resolved';
      case 'pending':
        return 'status-badge-pending';
      case 'rejected':
        return 'status-badge-rejected';
      case 'verified':
        return 'status-badge-verified';
      case 'assigned':
        return 'status-badge-assigned';
      default:
        return 'status-badge-neutral';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'in progress':
        return '🔄';
      case 'resolved':
        return '✅';
      case 'pending':
        return '⏳';
      case 'rejected':
        return '❌';
      case 'verified':
        return '🔍';
      case 'assigned':
        return '👷';
      default:
        return '📋';
    }
  };

  return (
    <div className="cd-header-card">
      <div className="cd-header-top">
        <button
          type="button"
          className="cd-back-btn"
          onClick={() => navigate('/citizen/complaints')}
          aria-label="Back to My Complaints"
        >
          <span className="cd-back-arrow">←</span>
          <span>Back to My Complaints</span>
        </button>

        <div className="cd-header-meta">
          <span className="cd-meta-item">
            Reported: <strong>{complaint?.dateReported}</strong>
          </span>
          <span className="cd-meta-dot">•</span>
          <span className="cd-meta-item">
            Last Updated: <strong>{complaint?.lastUpdated}</strong>
          </span>
        </div>
      </div>

      <div className="cd-header-main">
        <div className="cd-title-group">
          <div className="cd-id-badge-row">
            <span className="cd-complaint-id">{complaint?.id}</span>
            <span className={`cd-status-badge ${getStatusBadgeClass(complaint?.status)}`}>
              <span className="cd-status-dot" />
              <span>{getStatusIcon(complaint?.status)}</span>
              <span>{complaint?.status}</span>
            </span>
            <span className={`cd-priority-pill priority-${complaint?.priority?.toLowerCase()}`}>
              {complaint?.priority} Priority
            </span>
          </div>
          <h1 className="cd-issue-title">{complaint?.title}</h1>
        </div>

        <div className="cd-header-quick-info">
          <div className="cd-quick-stat">
            <span className="cd-quick-stat-label">Category</span>
            <span className="cd-quick-stat-val">{complaint?.category}</span>
          </div>
          <div className="cd-quick-stat">
            <span className="cd-quick-stat-label">Location Area</span>
            <span className="cd-quick-stat-val">{complaint?.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailsHeader;
