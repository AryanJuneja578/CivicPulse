import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import IssueForm from '../components/report/IssueForm';
import SubmissionSuccess from '../components/report/SubmissionSuccess';
import '../styles/dashboard.css';
import '../styles/report.css';

const ReportIssuePage = () => {
  const navigate = useNavigate();
  const [submissionData, setSubmissionData] = useState(null);

  const handleFormSuccess = (payload) => {
    setSubmissionData(payload);
    // Scroll smooth to top for success display
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReportAnother = () => {
    setSubmissionData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="citizen-layout">
      {/* Existing Preserved Sidebar */}
      <Sidebar />

      {/* Main Main Content Container */}
      <main className="citizen-main-content">
        <div className="dashboard-wrapper">
          <div className="report-page-container">
            {/* If complaint submitted successfully, show SubmissionSuccess screen */}
            {submissionData ? (
              <SubmissionSuccess
                submissionData={submissionData}
                onReportAnother={handleReportAnother}
              />
            ) : (
              <>
                {/* 1. Page Header */}
                <div className="report-header-card">
                  <div className="report-header-left">
                    <div className="report-header-icon-badge">📝</div>
                    <div>
                      <h1 className="report-header-title">Report a Civic Issue</h1>
                      <p className="report-header-subtitle">
                        Help improve your community by reporting a problem in your area.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="report-back-btn"
                    onClick={() => navigate('/citizen')}
                  >
                    <span>←</span>
                    <span>Back to Dashboard</span>
                  </button>
                </div>

                {/* 2. Main Form Grid Layout */}
                <div className="report-grid-layout">
                  {/* Form Column */}
                  <IssueForm onSubmitSuccess={handleFormSuccess} />

                  {/* Right Guidance Sidebar */}
                  <aside className="report-info-sidebar">
                    <div className="info-help-card">
                      <h3 className="info-help-title">
                        <span>💡</span>
                        <span>Tips for Quick Action</span>
                      </h3>
                      <ul className="info-step-list">
                        <li className="info-step-item">
                          <span className="info-step-num">1</span>
                          <span className="info-step-text">
                            <strong>Be Precise:</strong> Provide exact landmarks or street names to help field officers locate the issue.
                          </span>
                        </li>
                        <li className="info-step-item">
                          <span className="info-step-num">2</span>
                          <span className="info-step-text">
                            <strong>Attach Photos:</strong> Clear photos speed up verification and department dispatch.
                          </span>
                        </li>
                        <li className="info-step-item">
                          <span className="info-step-num">3</span>
                          <span className="info-step-text">
                            <strong>Correct Category:</strong> Select the matching category for automated AI routing.
                          </span>
                        </li>
                        <li className="info-step-item">
                          <span className="info-step-num">4</span>
                          <span className="info-step-text">
                            <strong>Track Updates:</strong> Receive SMS & dashboard alerts as status progresses from Verified to Resolved.
                          </span>
                        </li>
                      </ul>
                    </div>

                    {/* Support & Contact Card */}
                    <div className="info-help-card" style={{ background: '#f8fafc' }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                        Emergency Civic Concerns?
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 0.75rem 0', lineHeight: 1.4 }}>
                        For immediate hazards like open high-voltage cables or severe pipeline bursts, contact the emergency hotline:
                      </p>
                      <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#1e40af', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span>📞</span>
                        <span>1800-CIVIC-PULSE (Toll-Free)</span>
                      </div>
                    </div>
                  </aside>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportIssuePage;
