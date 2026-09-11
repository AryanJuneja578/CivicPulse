import React from 'react';

const departmentMap = {
  'Road Damage': 'Public Works Department (PWD)',
  'Garbage / Waste': 'Municipal Solid Waste Dept',
  'Water Supply': 'Water & Sanitation Board',
  'Drainage': 'Urban Drainage Authority',
  'Streetlight': 'Municipal Electrical Dept',
  'Electricity': 'State Electricity Board',
  'Public Safety': 'Local Police & Patrol Service',
  'Other': 'General Municipal Administration'
};

const AIAnalysisPreview = ({ selectedCategory, title }) => {
  // Determine mock prediction based on user selection
  const predictedCategory = selectedCategory && selectedCategory !== '' ? selectedCategory : 'Road Damage';
  const suggestedDept = departmentMap[predictedCategory] || 'Public Works Department (PWD)';

  // Calculate mock confidence score
  const hasTitle = title && title.trim().length > 5;
  const confidence = hasTitle ? 96 : 94;

  return (
    <div className="ai-preview-card">
      <div className="ai-preview-header">
        <span className="ai-preview-badge">
          <span>🤖</span>
          <span>AI-Assisted Analysis</span>
        </span>
        <span className="ai-preview-mock-tag">Preview / Mock</span>
      </div>

      <div className="ai-preview-content">
        <p style={{ fontSize: '0.8rem', color: '#334155', margin: '0 0 0.4rem 0', lineHeight: 1.45 }}>
          After submission, CivicPulse will analyze your report using custom deep-learning models to suggest category & routing:
        </p>

        <div className="ai-meta-row">
          <span className="ai-meta-label">Predicted Category:</span>
          <span className="ai-meta-value">{predictedCategory}</span>
        </div>

        <div className="ai-meta-row">
          <span className="ai-meta-label">AI Model Confidence:</span>
          <span className="ai-confidence-pill">
            <span>✨</span>
            <span>{confidence}%</span>
          </span>
        </div>

        <div className="ai-meta-row">
          <span className="ai-meta-label">Suggested Department:</span>
          <span className="ai-meta-value" style={{ color: '#1e40af' }}>
            {suggestedDept}
          </span>
        </div>

        <div className="ai-disclaimer-note">
          ℹ️ <strong>Note:</strong> The actual deep learning (DL) model will be integrated via Python service backend in production.
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisPreview;
