import React, { useState } from 'react';

const FeedbackCard = ({ resolvedFeedback }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!resolvedFeedback) return null;

  const { complaintId, title } = resolvedFeedback;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating > 0) {
      setSubmitted(true);
    }
  };

  return (
    <div className="dash-section-card">
      <div className="section-header">
        <h2 className="section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>Resolution Feedback</span>
        </h2>
      </div>

      <div className="feedback-card-content">
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <div className="feedback-question">
              Was <span className="complaint-id">{complaintId}</span> ({title}) resolved satisfactorily?
            </div>

            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${(hoverRating || rating) >= star ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`Rate ${star} stars`}
                >
                  ★
                </button>
              ))}
            </div>

            {rating > 0 && (
              <>
                <input
                  type="text"
                  className="feedback-input"
                  placeholder="Optional comment on resolution quality..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button type="submit" className="feedback-submit-btn">
                  Submit Feedback
                </button>
              </>
            )}
          </form>
        ) : (
          <div className="feedback-success-msg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Thank you! Your feedback helps us improve municipal services.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackCard;
