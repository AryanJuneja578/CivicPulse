import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NearbyIssues = ({ nearbyIssues }) => {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const navigate = useNavigate();

  const handleViewMap = (e) => {
    e.preventDefault();
    navigate('/citizen/nearby');
  };

  return (
    <div className="dash-section-card">
      <div className="section-header">
        <h2 className="section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>Nearby Civic Issues</span>
        </h2>
        <a href="/citizen/nearby" onClick={handleViewMap} className="section-link">
          Full Map →
        </a>
      </div>

      <div className="nearby-layout">
        {/* Polished Mock Map Visualizer */}
        <div className="mock-map-container">
          {/* Simulated Street Grid Overlay */}
          <div className="map-street-line" style={{ top: '40%', left: 0, right: 0, height: '14px' }} />
          <div className="map-street-line" style={{ top: 0, bottom: 0, left: '50%', width: '14px' }} />
          <div className="map-street-line" style={{ top: '70%', left: 0, right: 0, height: '10px' }} />

          {/* Issue Map Markers */}
          {nearbyIssues.map((issue) => (
            <div
              key={issue.id}
              className="map-pin"
              style={{ top: issue.gridPos.top, left: issue.gridPos.left }}
              onClick={() => setSelectedIssue(issue)}
              title={`${issue.type} - ${issue.distance}`}
            >
              <div className="pin-bubble" style={{ backgroundColor: issue.color }}>
                <span>📍</span>
                <span>{issue.type}</span>
              </div>
              <div className="pin-shadow" />
            </div>
          ))}

          <div className="map-controls-watermark">
            🗺️ CivicPulse Live Neighborhood Radar
          </div>
        </div>

        {/* Nearby Issues List */}
        <div className="nearby-list">
          {nearbyIssues.map((issue) => (
            <div
              key={issue.id}
              className="nearby-item"
              style={{
                borderColor: selectedIssue?.id === issue.id ? issue.color : '#f1f5f9',
                backgroundColor: selectedIssue?.id === issue.id ? '#ffffff' : '#f8fafc'
              }}
              onClick={() => setSelectedIssue(issue)}
            >
              <div className="nearby-item-info">
                <span className="nearby-item-type">{issue.type}</span>
                <span className="nearby-item-dist">
                  {issue.distance} • {issue.location}
                </span>
              </div>
              <span
                className="status-badge"
                style={{
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  backgroundColor: '#ffffff',
                  borderColor: issue.color,
                  color: issue.color
                }}
              >
                {issue.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NearbyIssues;
