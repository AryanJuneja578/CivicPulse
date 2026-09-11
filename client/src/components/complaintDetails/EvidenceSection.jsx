import React, { useState } from 'react';

const EvidenceSection = ({ evidence }) => {
  const [modalOpen, setModalOpen] = useState(false);

  if (!evidence || !evidence.hasImage || !evidence.imageUrl) {
    return (
      <section className="cd-section-card cd-evidence-card">
        <div className="cd-section-header">
          <div className="cd-section-header-title">
            <span className="cd-section-icon">📷</span>
            <h2>Attached Evidence</h2>
          </div>
          <span className="cd-evidence-empty-pill">None Attached</span>
        </div>

        <div className="cd-evidence-empty-state">
          <div className="cd-evidence-empty-icon">📁</div>
          <p className="cd-evidence-empty-title">No photographic evidence attached</p>
          <p className="cd-evidence-empty-sub">
            This issue was submitted without supplementary media. Field officers will conduct direct on-site verification.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="cd-section-card cd-evidence-card">
      <div className="cd-section-header">
        <div className="cd-section-header-title">
          <span className="cd-section-icon">📷</span>
          <h2>Attached Evidence</h2>
        </div>
        <span className="cd-evidence-count-pill">1 Photo Attached</span>
      </div>

      <div className="cd-evidence-content">
        <div className="cd-evidence-media-card" onClick={() => setModalOpen(true)}>
          <div className="cd-evidence-img-container">
            <img
              src={evidence.imageUrl}
              alt="Citizen Evidence"
              className="cd-evidence-main-img"
            />
            <div className="cd-evidence-zoom-overlay">
              <span>🔍 Click to Expand</span>
            </div>
          </div>

          <div className="cd-evidence-details-bar">
            <div className="cd-evidence-meta-left">
              <span className="cd-evidence-name">{evidence.fileName || 'evidence_photo.jpg'}</span>
              <span className="cd-evidence-sub">
                Uploaded: {evidence.uploadDate} {evidence.fileSize && `• ${evidence.fileSize}`}
              </span>
            </div>
            <span className="cd-evidence-tag">Verified Photo</span>
          </div>
        </div>

        {/* Secure Lightbox Modal */}
        {modalOpen && (
          <div className="cd-modal-backdrop" onClick={() => setModalOpen(false)}>
            <div className="cd-modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="cd-modal-header">
                <h3>{evidence.fileName || 'Citizen Photo Evidence'}</h3>
                <button
                  type="button"
                  className="cd-modal-close"
                  onClick={() => setModalOpen(false)}
                  aria-label="Close image modal"
                >
                  ✕
                </button>
              </div>
              <div className="cd-modal-body">
                <img
                  src={evidence.imageUrl}
                  alt="Full size evidence"
                  className="cd-modal-full-img"
                />
              </div>
              <div className="cd-modal-footer">
                <span>Upload date: {evidence.uploadDate}</span>
                <span>Protected Civic Evidence</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EvidenceSection;
