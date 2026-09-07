import React from 'react';

const ComplaintTimeline = ({ activeComplaint }) => {
  if (!activeComplaint) return null;

  const { id, title, category, department, stages } = activeComplaint;

  // Calculate fill percentage for progress line
  const completedCount = stages.filter(s => s.completed).length;
  const progressPercent = Math.max(0, ((completedCount - 1) / (stages.length - 1)) * 100);

  return (
    <div className="dash-section-card">
      <div className="section-header">
        <h2 className="section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <span>Active Complaint Progress</span>
        </h2>
        <span className="status-badge status-in-progress">In Progress</span>
      </div>

      <div className="timeline-card-inner">
        <div className="timeline-meta">
          <div>
            <h3 className="timeline-meta-title">
              <span className="complaint-id">{id}</span> — {title}
            </h3>
            <span className="timeline-meta-sub">
              Category: <strong>{category}</strong> | Department: <strong>{department}</strong>
            </span>
          </div>
        </div>

        <div className="timeline-track">
          <div className="timeline-progress-line-bg" />
          <div
            className="timeline-progress-line-fill"
            style={{ width: `calc(${progressPercent}% * 0.85)` }}
          />

          {stages.map((stage, index) => {
            const isCompleted = stage.completed;
            const isCurrentActive = isCompleted && index === completedCount - 1;
            
            let stepClass = '';
            if (isCurrentActive) stepClass = 'active';
            else if (isCompleted) stepClass = 'completed';

            return (
              <div key={stage.key} className={`timeline-step ${stepClass}`}>
                <div className="timeline-dot">
                  {isCompleted ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="timeline-step-label">{stage.label}</span>
                <span className="timeline-step-time">{stage.timestamp}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ComplaintTimeline;
