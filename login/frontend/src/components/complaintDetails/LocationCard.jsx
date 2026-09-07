import React from 'react';

const LocationCard = ({ location, landmark, coordinates }) => {
  return (
    <section className="cd-section-card cd-location-card">
      <div className="cd-section-header">
        <div className="cd-section-header-title">
          <span className="cd-section-icon">📍</span>
          <h2>Location Details</h2>
        </div>
        <span className="cd-location-badge">GPS Tagged</span>
      </div>

      <div className="cd-location-body">
        {/* Mock Static Map Canvas */}
        <div className="cd-mock-map">
          <div className="cd-map-grid-h1" />
          <div className="cd-map-grid-h2" />
          <div className="cd-map-grid-v1" />
          <div className="cd-map-grid-v2" />
          <div className="cd-map-park-zone" />
          <div className="cd-map-road-main" />

          {/* Placed Pin */}
          <div className="cd-map-pin">
            <div className="cd-pin-pulse" />
            <div className="cd-pin-marker">📍</div>
          </div>

          <div className="cd-map-overlay-badge">
            <span>🗺️ CivicPulse Mock Map</span>
          </div>
        </div>

        {/* Address and Landmark details */}
        <div className="cd-location-details">
          <div className="cd-loc-row">
            <span className="cd-loc-icon">📌</span>
            <div className="cd-loc-text">
              <span className="cd-loc-label">Reported Address</span>
              <strong className="cd-loc-value">{location || 'Model Town, Sector 4'}</strong>
            </div>
          </div>

          {landmark && (
            <div className="cd-loc-row">
              <span className="cd-loc-icon">🏛️</span>
              <div className="cd-loc-text">
                <span className="cd-loc-label">Nearest Landmark</span>
                <span className="cd-loc-value">{landmark}</span>
              </div>
            </div>
          )}

          {coordinates && (
            <div className="cd-loc-coordinates-chip">
              <span>🌐 Geo-Coordinates:</span>
              <code>
                {coordinates.lat}° N, {coordinates.lng}° E
              </code>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LocationCard;
