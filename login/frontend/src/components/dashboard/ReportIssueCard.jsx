import React from 'react';
import { useNavigate } from 'react-router-dom';

const ReportIssueCard = () => {
  const navigate = useNavigate();

  const handleReportClick = () => {
    navigate('/citizen/report');
  };

  return (
    <div className="report-cta-card">
      <div className="report-cta-content">
        <span className="report-cta-badge">Civic Action</span>
        <h2 className="report-cta-title">Report a Civic Issue</h2>
        <p className="report-cta-desc">
          See something that needs attention? Report it and help improve your community.
        </p>
      </div>
      <button className="report-cta-btn" onClick={handleReportClick}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span>Report Issue</span>
      </button>
    </div>
  );
};

export default ReportIssueCard;
