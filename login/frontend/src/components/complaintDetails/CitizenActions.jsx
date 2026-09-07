import React, { useState } from 'react';

const CitizenActions = ({ complaint, onAddInformation }) => {
  const status = complaint?.status?.toLowerCase();

  // State for "Add Information" action
  const [commentText, setCommentText] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // State for "Rate Resolution" action
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Handle Add Information submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmittingComment(true);
    setTimeout(() => {
      onAddInformation({
        id: `user-comment-${Date.now()}`,
        timestamp: 'Just now',
        author: 'Citizen (You)',
        message: commentText.trim()
      });
      setCommentText('');
      setIsSubmittingComment(false);
      setCommentSuccess(true);
      setTimeout(() => setCommentSuccess(false), 4000);
    }, 400);
  };

  // Handle Rate Resolution submission
  const handleRatingSubmit = (e) => {
    e.preventDefault();
    setRatingSubmitted(true);
  };

  // Render 1: Rejected State Action
  if (status === 'rejected') {
    return (
      <section className="cd-section-card cd-actions-card rejected-card">
        <div className="cd-section-header">
          <div className="cd-section-header-title">
            <span className="cd-section-icon">🚫</span>
            <h2>Rejection Notice & Appeal</h2>
          </div>
          <span className="cd-rejection-pill">Closed Unactioned</span>
        </div>

        <div className="cd-rejection-box">
          <div className="cd-rejection-header">
            <span className="cd-rejection-icon">⚠️</span>
            <span className="cd-rejection-title">Official Rejection Reason</span>
          </div>
          <p className="cd-rejection-text">
            {complaint.rejectionReason ||
              'This complaint does not fall under municipal jurisdiction or conflicts with local bylaws.'}
          </p>

          <div className="cd-rejection-recourse">
            <h4 className="cd-recourse-title">What can you do?</h4>
            <ul className="cd-recourse-list">
              <li>
                <strong>Private Society Concerns:</strong> Present this report to your Resident Welfare Association (RWA) or building maintenance committee.
              </li>
              <li>
                <strong>Contest Decision:</strong> If this location is indeed on a municipal public road, you can request administrative re-triage via the municipal toll-free line.
              </li>
            </ul>

            <div className="cd-recourse-contact">
              <span>📞 Municipal Triage Desk:</span>
              <strong>1800-CIVIC-PULSE (Ext. 4)</strong>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Render 2: Resolved State Action (Rate Resolution)
  if (status === 'resolved') {
    return (
      <section className="cd-section-card cd-actions-card resolved-card">
        <div className="cd-section-header">
          <div className="cd-section-header-title">
            <span className="cd-section-icon">⭐</span>
            <h2>Rate Resolution Experience</h2>
          </div>
          <span className="cd-rating-badge">Citizen Feedback</span>
        </div>

        {ratingSubmitted ? (
          <div className="cd-rating-success-box">
            <div className="cd-rating-success-icon">🎉</div>
            <h3 className="cd-rating-success-title">Thank You for Your Feedback!</h3>
            <p className="cd-rating-success-sub">
              Your rating of <strong>{rating} Stars</strong> has been logged to evaluate municipal department efficiency and officer performance.
            </p>
          </div>
        ) : (
          <form className="cd-rating-form" onSubmit={handleRatingSubmit}>
            <p className="cd-rating-prompt">
              How satisfied are you with the resolution of this civic complaint?
            </p>

            <div className="cd-star-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`cd-star-btn ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  aria-label={`Rate ${star} star`}
                >
                  ★
                </button>
              ))}
              <span className="cd-star-label">
                {rating === 5 && 'Excellent'}
                {rating === 4 && 'Good'}
                {rating === 3 && 'Average'}
                {rating === 2 && 'Poor'}
                {rating === 1 && 'Unsatisfactory'}
              </span>
            </div>

            <div className="cd-form-group">
              <label htmlFor="resolution-feedback" className="cd-form-label">
                Optional Feedback or Comments
              </label>
              <textarea
                id="resolution-feedback"
                className="cd-form-textarea"
                rows="3"
                placeholder="Share your thoughts on work quality, turnaround time, or communication..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              />
            </div>

            <button type="submit" className="cd-btn-primary">
              <span>Submit Rating & Review</span>
            </button>
          </form>
        )}
      </section>
    );
  }

  // Render 3: Active State Action (Add Information / Comment)
  return (
    <section className="cd-section-card cd-actions-card active-card">
      <div className="cd-section-header">
        <div className="cd-section-header-title">
          <span className="cd-section-icon">💬</span>
          <h2>Add Information</h2>
        </div>
        <span className="cd-active-action-tag">Citizen Update</span>
      </div>

      <div className="cd-active-action-body">
        <p className="cd-action-hint">
          Have additional details, changes in the situation, or recent photos? Post an update to help the assigned team.
        </p>

        {commentSuccess && (
          <div className="cd-alert-success">
            <span>✅</span>
            <span>Your update has been added to the activity log.</span>
          </div>
        )}

        <form onSubmit={handleCommentSubmit} className="cd-comment-form">
          <div className="cd-form-group">
            <textarea
              className="cd-form-textarea"
              rows="3"
              placeholder="e.g. The pothole has become larger after the recent rain..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            />
          </div>

          <div className="cd-comment-actions-bar">
            <span className="cd-comment-note">
              ℹ️ Visible to moderation desk & assigned field officers
            </span>
            <button
              type="submit"
              className="cd-btn-primary"
              disabled={isSubmittingComment || !commentText.trim()}
            >
              {isSubmittingComment ? 'Posting Update...' : 'Post Citizen Update'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CitizenActions;
