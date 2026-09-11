import React from 'react';

const AIAnalysisSection = ({ aiAnalysis }) => {
  if (!aiAnalysis) return null;

  return (
    <section className="cd-section-card cd-ai-card">
      <div className="cd-section-header">
        <div className="cd-section-header-title">
          <span className="cd-section-icon">🤖</span>
          <h2>AI Classification Preview</h2>
        </div>
        <span className="cd-ai-badge-preview">Preview / Mock</span>
      </div>

      <div className="cd-ai-body">
        <p className="cd-ai-intro">
          This preview showcases how CivicPulse's upcoming computer-vision and NLP deep-learning models
          will automatically classify and route incoming civic reports:
        </p>

        <div className="cd-ai-stats-grid">
          <div className="cd-ai-metric-box">
            <span className="cd-ai-metric-label">Predicted Category</span>
            <span className="cd-ai-metric-val">{aiAnalysis.category}</span>
          </div>

          <div className="cd-ai-metric-box">
            <span className="cd-ai-metric-label">Model Confidence</span>
            <div className="cd-ai-confidence-wrap">
              <span className="cd-ai-confidence-pill">✨ {aiAnalysis.confidence}%</span>
              <div className="cd-ai-confidence-bar">
                <div
                  className="cd-ai-confidence-fill"
                  style={{ width: `${aiAnalysis.confidence}%` }}
                />
              </div>
            </div>
          </div>

          <div className="cd-ai-metric-box">
            <span className="cd-ai-metric-label">Suggested Department</span>
            <span className="cd-ai-metric-val highlighted">{aiAnalysis.suggestedDept}</span>
          </div>

          <div className="cd-ai-metric-box">
            <span className="cd-ai-metric-label">Assessed Priority</span>
            <span className="cd-ai-metric-val">{aiAnalysis.priority}</span>
          </div>
        </div>

        {aiAnalysis.note && (
          <div className="cd-ai-note-box">
            <span className="cd-ai-note-icon">💡</span>
            <span className="cd-ai-note-text">{aiAnalysis.note}</span>
          </div>
        )}

        <div className="cd-ai-footer-badge">
          <span>⚡</span>
          <span>Powered by CivicPulse Deep Learning Model (Preview)</span>
        </div>
      </div>
    </section>
  );
};

export default AIAnalysisSection;
