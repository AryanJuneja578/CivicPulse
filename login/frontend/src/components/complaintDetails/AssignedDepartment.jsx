import React from 'react';

const AssignedDepartment = ({ department, status }) => {
  if (!department) return null;

  const isResolved = status?.toLowerCase() === 'resolved';
  const isRejected = status?.toLowerCase() === 'rejected';

  return (
    <section className="cd-section-card cd-dept-card">
      <div className="cd-section-header">
        <div className="cd-section-header-title">
          <span className="cd-section-icon">🏛️</span>
          <h2>Assigned Department</h2>
        </div>
        <span className="cd-dept-code-tag">{department.code || 'MUNICIPAL-GOV'}</span>
      </div>

      <div className="cd-dept-body">
        <div className="cd-dept-main-row">
          <div className="cd-dept-icon-circle">🏢</div>
          <div className="cd-dept-info">
            <h3 className="cd-dept-name">{department.name}</h3>
            <p className="cd-dept-status-note">
              {isResolved
                ? 'Resolution completed & verified'
                : isRejected
                ? 'Case reviewed and closed'
                : department.statusNote || 'Currently handling this issue'}
            </p>
          </div>
        </div>

        <div className="cd-dept-meta-grid">
          <div className="cd-dept-meta-item">
            <span className="cd-dept-meta-label">Designated Handler</span>
            <span className="cd-dept-meta-val">
              {department.assignedOfficer || 'Field Officer (Operations Wing)'}
            </span>
          </div>

          <div className="cd-dept-meta-item">
            <span className="cd-dept-meta-label">SLA Benchmark</span>
            <span className="cd-dept-meta-val">{department.slaTarget || 'Within 48 hours'}</span>
          </div>
        </div>

        <div className="cd-dept-footer-notice">
          <span className="cd-dept-footer-icon">ℹ️</span>
          <span>Official municipal field team dispatched according to civic jurisdictional bylaws.</span>
        </div>
      </div>
    </section>
  );
};

export default AssignedDepartment;
