import React from 'react';

const ComplaintOverview = ({ complaint }) => {
  return (
    <section className="cd-section-card cd-overview-card">
      <div className="cd-section-header">
        <div className="cd-section-header-title">
          <span className="cd-section-icon">📄</span>
          <h2>Complaint Overview</h2>
        </div>
        <span className="cd-overview-category-tag">{complaint?.category}</span>
      </div>

      <div className="cd-overview-body">
        <p className="cd-overview-description">{complaint?.description}</p>

        <div className="cd-meta-grid">
          <div className="cd-meta-box">
            <span className="cd-meta-label">Category</span>
            <span className="cd-meta-value">{complaint?.category}</span>
          </div>

          <div className="cd-meta-box">
            <span className="cd-meta-label">Location</span>
            <span className="cd-meta-value">{complaint?.location}</span>
          </div>

          <div className="cd-meta-box">
            <span className="cd-meta-label">Priority Level</span>
            <span className="cd-meta-value">
              <span className={`cd-priority-tag priority-${complaint?.priority?.toLowerCase()}`}>
                {complaint?.priority === 'High' && '🔴 High'}
                {complaint?.priority === 'Medium' && '🟡 Medium'}
                {complaint?.priority === 'Low' && '🟢 Low'}
              </span>
            </span>
          </div>

          <div className="cd-meta-box">
            <span className="cd-meta-label">Reported On</span>
            <span className="cd-meta-value">{complaint?.dateReported}</span>
          </div>

          <div className="cd-meta-box">
            <span className="cd-meta-label">Last Status Update</span>
            <span className="cd-meta-value">{complaint?.lastUpdated}</span>
          </div>

          <div className="cd-meta-box">
            <span className="cd-meta-label">Assigned Department</span>
            <span className="cd-meta-value">{complaint?.department?.name || 'Pending Assignment'}</span>
          </div>
        </div>

        {complaint?.evidence?.hasImage && complaint?.evidence?.imageUrl && (
          <div className="cd-overview-evidence-banner">
            <div className="cd-overview-evidence-img-wrap">
              <img
                src={complaint.evidence.imageUrl}
                alt="Complaint Evidence Preview"
                className="cd-overview-evidence-img"
              />
            </div>
            <div className="cd-overview-evidence-info">
              <span className="cd-evidence-badge">Attached Evidence</span>
              <span className="cd-evidence-filename">{complaint.evidence.fileName}</span>
              <span className="cd-evidence-date">Uploaded on {complaint.evidence.uploadDate}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ComplaintOverview;
