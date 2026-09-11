import React from 'react';

const ComplaintTimeline = ({ stages, isRejected = false }) => {
  if (!stages || stages.length === 0) return null;

  return (
    <section className="cd-section-card cd-timeline-card">
      <div className="cd-section-header">
        <div className="cd-section-header-title">
          <span className="cd-section-icon">⏱️</span>
          <h2>Resolution Progress Timeline</h2>
        </div>
        {isRejected ? (
          <span className="cd-timeline-status-tag rejected">Case Terminated</span>
        ) : (
          <span className="cd-timeline-status-tag active">Live Status Tracking</span>
        )}
      </div>

      <div className="cd-timeline-container">
        {stages.map((stage, index) => {
          const isCompleted = stage.completed;
          const isCurrent = stage.current;
          const isLast = index === stages.length - 1;
          const isRejectedStage = stage.key === 'rejected';

          let nodeClass = 'cd-tl-node-pending';
          if (isRejectedStage) {
            nodeClass = 'cd-tl-node-rejected';
          } else if (isCurrent) {
            nodeClass = 'cd-tl-node-current';
          } else if (isCompleted) {
            nodeClass = 'cd-tl-node-completed';
          }

          return (
            <div key={stage.key || index} className={`cd-tl-item ${isCurrent ? 'is-current' : ''}`}>
              <div className="cd-tl-marker-col">
                <div className={`cd-tl-node ${nodeClass}`}>
                  {isRejectedStage ? (
                    <span>✕</span>
                  ) : isCompleted && !isCurrent ? (
                    <span>✓</span>
                  ) : isCurrent ? (
                    <span className="cd-tl-pulse-dot" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                {!isLast && (
                  <div
                    className={`cd-tl-connector ${
                      isCompleted ? 'connector-completed' : 'connector-pending'
                    }`}
                  />
                )}
              </div>

              <div className="cd-tl-content">
                <div className="cd-tl-top-row">
                  <h3 className={`cd-tl-title ${isCurrent ? 'title-active' : ''} ${isRejectedStage ? 'title-rejected' : ''}`}>
                    {stage.label}
                    {isCurrent && !isRejectedStage && (
                      <span className="cd-tl-current-pill">Current Stage</span>
                    )}
                    {isRejectedStage && (
                      <span className="cd-tl-rejected-pill">Closed</span>
                    )}
                  </h3>
                  <span className="cd-tl-timestamp">{stage.timestamp}</span>
                </div>

                <p className="cd-tl-description">{stage.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ComplaintTimeline;
