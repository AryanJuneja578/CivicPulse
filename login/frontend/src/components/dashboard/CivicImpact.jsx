import React from 'react';

const CivicImpact = ({ impactData }) => {
  const { reportsSubmitted, reportsResolved, communityConfirmations, civicScore, rankTitle } = impactData;

  return (
    <div className="dash-section-card">
      <div className="section-header">
        <h2 className="section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span>Your Civic Impact</span>
        </h2>
      </div>

      <div className="impact-metrics-grid">
        <div className="impact-metric-box">
          <div className="impact-val">{reportsSubmitted}</div>
          <div className="impact-lbl">Issues Reported</div>
        </div>
        <div className="impact-metric-box">
          <div className="impact-val">{reportsResolved}</div>
          <div className="impact-lbl">Issues Resolved</div>
        </div>
        <div className="impact-metric-box">
          <div className="impact-val">{communityConfirmations}</div>
          <div className="impact-lbl">Confirmations</div>
        </div>
      </div>

      <div className="impact-score-banner">
        <div>
          <div className="impact-score-title">Civic Contribution Score</div>
          <span style={{ fontSize: '0.725rem', color: '#047857' }}>{rankTitle}</span>
        </div>
        <div className="impact-score-badge">{civicScore} PTS</div>
      </div>
    </div>
  );
};

export default CivicImpact;
