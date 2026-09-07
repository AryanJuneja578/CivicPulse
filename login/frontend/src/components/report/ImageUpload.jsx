import React, { useState } from 'react';

const ImageUpload = ({ imageFile, imagePreview, onImageSelect, onImageRemove, error }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState('');

  const MAX_FILE_SIZE_MB = 5;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  const validateAndProcessFile = (file) => {
    setFileError('');

    if (!file) return;

    // Type validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      const err = 'Invalid file format. Please upload JPG, PNG, WEBP, or GIF.';
      setFileError(err);
      return;
    }

    // Size validation (5MB = 5 * 1024 * 1024 bytes)
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      const err = `File size exceeds ${MAX_FILE_SIZE_MB}MB limit. Please upload a smaller image.`;
      setFileError(err);
      return;
    }

    // Read and create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageSelect(file, reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    }
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  const currentError = error || fileError;

  return (
    <div className="image-upload-wrapper">
      {!imagePreview ? (
        <div
          className={`image-upload-dropzone ${dragActive ? 'drag-active' : ''} ${currentError ? 'has-error' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="image-file-input"
            className="file-input-hidden"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
          />
          <div className="upload-icon-circle">📸</div>
          <div className="upload-title">Click to upload or drag & drop image</div>
          <div className="upload-subtitle">
            Supported formats: <strong>JPG, PNG, WEBP, GIF</strong> (Max size: <strong>5MB</strong>)
          </div>
        </div>
      ) : (
        <div className="image-preview-card">
          <div className="image-preview-left">
            <img
              src={imagePreview}
              alt="Evidence Preview"
              className="preview-thumbnail"
            />
            <div className="preview-info">
              <span className="preview-filename">
                {imageFile ? imageFile.name : 'evidence_photo.jpg'}
              </span>
              <span className="preview-filesize">
                {imageFile ? formatFileSize(imageFile.size) : 'Selected photo'}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="btn-remove-image"
            onClick={() => {
              setFileError('');
              onImageRemove();
            }}
          >
            <span>🗑️</span>
            <span>Remove</span>
          </button>
        </div>
      )}

      {currentError && (
        <div className="field-error-msg">
          <span>⚠️</span>
          <span>{currentError}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
