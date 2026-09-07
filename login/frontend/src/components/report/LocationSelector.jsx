import React, { useState } from 'react';

const LocationSelector = ({ value, onChange, error }) => {
  const [showMap, setShowMap] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [pinPosition, setPinPosition] = useState({ top: 45, left: 50 }); // percentage

  // Mock addresses linked to relative map coordinates
  const presetLocations = [
    { label: 'Main Gate Road', text: 'Main Gate Road, Model Town', top: 30, left: 40 },
    { label: 'Sector 4 Market', text: 'Sector 4 Market Complex', top: 65, left: 25 },
    { label: 'Green Park North', text: 'Green Park North, Sector 4', top: 25, left: 75 },
    { label: 'Civic Center Circle', text: 'Civic Center Circle, Avenue 3', top: 70, left: 60 }
  ];

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(4);
          const lng = position.coords.longitude.toFixed(4);
          const detectedAddr = `Model Town, Sector 4 (GPS: ${lat}, ${lng})`;
          onChange(detectedAddr);
          setIsLocating(false);
        },
        (err) => {
          console.warn('Geolocation error / permission denied:', err);
          // Fallback to realistic mock location
          setTimeout(() => {
            onChange('Model Town, Sector 4, Central District');
            setIsLocating(false);
          }, 600);
        },
        { timeout: 5000 }
      );
    } else {
      setTimeout(() => {
        onChange('Model Town, Sector 4, Central District');
        setIsLocating(false);
      }, 600);
    }
  };

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const leftPercent = Math.round((x / rect.width) * 100);
    const topPercent = Math.round((y / rect.height) * 100);

    setPinPosition({ top: topPercent, left: leftPercent });

    // Generate address description based on position
    const zoneName = topPercent < 50 ? 'North Sector' : 'South Sector';
    const aveName = leftPercent < 50 ? 'West Gate Rd' : 'East Market Ave';
    const selectedAddress = `${zoneName}, ${aveName} (Pin Selected)`;
    
    onChange(selectedAddress);
  };

  const handlePresetSelect = (preset) => {
    setPinPosition({ top: preset.top, left: preset.left });
    onChange(preset.text);
  };

  return (
    <div className="location-selector-container">
      <div className="location-input-row">
        <input
          type="text"
          id="location-input"
          className={`form-input ${error ? 'has-error' : ''}`}
          placeholder="Enter street name, landmark, or sector..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        <button
          type="button"
          className="btn-location-action btn-gps"
          onClick={handleGetCurrentLocation}
          disabled={isLocating}
          title="Use current device GPS location"
        >
          <span>{isLocating ? '⏳' : '📍'}</span>
          <span>{isLocating ? 'Detecting...' : 'Current Location'}</span>
        </button>

        <button
          type="button"
          className={`btn-location-action btn-map-toggle ${showMap ? 'active' : ''}`}
          onClick={() => setShowMap(!showMap)}
          title="Open interactive mock map to select point"
        >
          <span>🗺️</span>
          <span>{showMap ? 'Hide Map' : 'Select on Map'}</span>
        </button>
      </div>

      {showMap && (
        <div className="mock-map-wrapper">
          <div className="mock-map-hint-banner">
            👇 Click anywhere on the map to drop pin & update location
          </div>
          
          <div 
            className="mock-map-canvas"
            onClick={handleMapClick}
            role="region"
            aria-label="Mock Interactive Map"
          >
            {/* Grid street mock lines */}
            <div className="mock-map-grid-line h1" />
            <div className="mock-map-grid-line h2" />
            <div className="mock-map-grid-line v1" />
            <div className="mock-map-grid-line v2" />

            {/* Placed Location Pin */}
            <div 
              className="mock-map-pin-placed"
              style={{ top: `${pinPosition.top}%`, left: `${pinPosition.left}%` }}
            >
              <div className="mock-pin-head">
                <span className="mock-pin-icon">📍</span>
              </div>
            </div>
          </div>

          {/* Quick Preset Location Chips */}
          <div className="mock-map-preset-bar">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginRight: '0.25rem' }}>
              Quick Landmarks:
            </span>
            {presetLocations.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className="preset-chip"
                onClick={() => handlePresetSelect(preset)}
              >
                📍 {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
