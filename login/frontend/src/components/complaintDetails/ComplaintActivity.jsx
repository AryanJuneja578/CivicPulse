import React from 'react';

const ComplaintActivity = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <section className="cd-section-card cd-activity-card">
        <div className="cd-section-header">
          <div className="cd-section-header-title">
            <span className="cd-section-icon">📢</span>
            <h2>Department Updates & Activity</h2>
          </div>
        </div>
        <div className="cd-empty-activity">No activity recorded yet.</div>
      </section>
    );
  }

  return (
    <section className="cd-section-card cd-activity-card">
      <div className="cd-section-header">
        <div className="cd-section-header-title">
          <span className="cd-section-icon">📢</span>
          <h2>Department Updates & Activity</h2>
        </div>
        <span className="cd-activity-count-tag">{activities.length} Updates</span>
      </div>

      <div className="cd-activity-list">
        {activities.map((act) => {
          const isCitizenAuthor = act.author?.toLowerCase().includes('citizen');

          return (
            <div
              key={act.id}
              className={`cd-activity-item ${isCitizenAuthor ? 'author-citizen' : 'author-official'}`}
            >
              <div className="cd-activity-avatar">
                {isCitizenAuthor ? '👤' : '🏛️'}
              </div>

              <div className="cd-activity-bubble">
                <div className="cd-activity-meta-row">
                  <span className="cd-activity-author">{act.author}</span>
                  <span className="cd-activity-time">{act.timestamp}</span>
                </div>
                <p className="cd-activity-text">{act.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ComplaintActivity;
