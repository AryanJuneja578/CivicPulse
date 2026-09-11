import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/api';
import LocationSelector from './LocationSelector';
import ImageUpload from './ImageUpload';
import AIAnalysisPreview from './AIAnalysisPreview';

const CATEGORY_OPTIONS = [
  'Road Damage',
  'Garbage / Waste',
  'Water Supply',
  'Drainage',
  'Streetlight',
  'Electricity',
  'Public Safety',
  'Other'
];

const IssueForm = ({ onSubmitSuccess }) => {
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    priority: 'Medium'
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftToast, setDraftToast] = useState('');

  // Check for saved draft in localStorage on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('civicpulse_report_draft');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        setFormData({
          title: parsed.title || '',
          category: parsed.category || '',
          description: parsed.description || '',
          location: parsed.location || '',
          priority: parsed.priority || 'Medium'
        });
        if (parsed.savedTime) {
          setDraftToast(`Draft loaded from ${parsed.savedTime}`);
          setTimeout(() => setDraftToast(''), 4000);
        }
      }
    } catch (e) {
      console.warn('Could not read draft from localStorage', e);
    }
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (apiError) {
      setApiError('');
    }
  };

  const handleImageSelect = (file, previewUrl) => {
    setImageFile(file);
    setImagePreview(previewUrl);
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Please provide an issue title.';
    } else if (formData.title.trim().length < 4) {
      newErrors.title = 'Title should be at least 4 characters long.';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category for this issue.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please describe the issue in detail.';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description should be at least 10 characters long.';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Please specify or select a location.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = () => {
    try {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const draftObj = {
        ...formData,
        savedTime: now
      };
      localStorage.setItem('civicpulse_report_draft', JSON.stringify(draftObj));
      setDraftToast(`Draft saved successfully at ${now}`);
      setTimeout(() => setDraftToast(''), 4000);
    } catch (e) {
      console.error('Error saving draft', e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    // Prevent duplicate submissions
    if (isSubmitting) return;

    if (!validateForm()) {
      // Scroll smoothly to top error if any
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const errorElem = document.getElementById(`${firstErrorKey}-field`);
        if (errorElem) {
          errorElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }

    if (!token || token.startsWith('mock-')) {
      setApiError('Authentication required: You must be logged in with a valid citizen account to submit a complaint. Please log in.');
      return;
    }

    setIsSubmitting(true);

    try {
      const requestPayload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        priority: formData.priority.trim(),
        location: {
          address: formData.location.trim()
        },
        evidence: {
          imageUrl: null,
          videoUrl: null
        }
      };

      const response = await fetch(`${API_BASE_URL}/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestPayload)
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error(`Server returned unexpected format (Status: ${response.status})`);
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit complaint. Please try again.');
      }

      // Clear saved draft on successful submission
      try {
        localStorage.removeItem('civicpulse_report_draft');
      } catch {
        // ignore
      }

      const saved = data.data;
      const submissionPayload = {
        complaintId: saved.complaintId,
        title: saved.title,
        category: saved.category,
        description: saved.description,
        location: typeof saved.location === 'object' ? saved.location.address : saved.location,
        priority: saved.priority,
        status: saved.status || 'Reported',
        createdAt: saved.createdAt,
        hasImage: !!imagePreview,
        timestamp: new Date(saved.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        rawComplaint: saved
      };

      onSubmitSuccess(submissionPayload);
    } catch (err) {
      console.error('Complaint submission error:', err);
      const message = err.name === 'TypeError' && err.message.includes('fetch')
        ? 'Unable to reach CivicPulse server. Please check your internet connection or server status.'
        : err.message || 'An unexpected error occurred while submitting your complaint.';
      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="report-form-card" onSubmit={handleSubmit} noValidate>
      {apiError && (
        <div
          className="report-api-error-alert"
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '0.85rem 1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            color: '#991b1b',
            fontSize: '0.875rem'
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>⚠️</span>
          <span>{apiError}</span>
        </div>
      )}
      {/* 1. Issue Title */}
      <div className="form-field-group" id="title-field">
        <label htmlFor="issue-title" className="field-label">
          <span className="field-label-text">
            <span>Issue Title</span>
            <span className="required-asterisk">*</span>
          </span>
          <span className="field-helper">Short & descriptive summary</span>
        </label>
        <input
          type="text"
          id="issue-title"
          className={`form-input ${errors.title ? 'has-error' : ''}`}
          placeholder="e.g. Large pothole near main gate"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
        {errors.title && (
          <div className="field-error-msg">
            <span>⚠️</span>
            <span>{errors.title}</span>
          </div>
        )}
      </div>

      {/* 2. Category Dropdown */}
      <div className="form-field-group" id="category-field">
        <label htmlFor="issue-category" className="field-label">
          <span className="field-label-text">
            <span>Category</span>
            <span className="required-asterisk">*</span>
          </span>
          <span className="field-helper">Select appropriate civic sector</span>
        </label>
        <div className="category-select-wrapper">
          <select
            id="issue-category"
            className={`form-select ${errors.category ? 'has-error' : ''}`}
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <option value="" disabled>
              -- Select Category --
            </option>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        {errors.category && (
          <div className="field-error-msg">
            <span>⚠️</span>
            <span>{errors.category}</span>
          </div>
        )}
      </div>

      {/* 3. Description Textarea */}
      <div className="form-field-group" id="description-field">
        <label htmlFor="issue-description" className="field-label">
          <span className="field-label-text">
            <span>Description</span>
            <span className="required-asterisk">*</span>
          </span>
          <span className="field-helper">Provide specific details</span>
        </label>
        <textarea
          id="issue-description"
          className={`form-textarea ${errors.description ? 'has-error' : ''}`}
          placeholder="Describe the issue, where it is located, and any other useful information..."
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
        {errors.description && (
          <div className="field-error-msg">
            <span>⚠️</span>
            <span>{errors.description}</span>
          </div>
        )}
      </div>

      {/* 4. Location Selector */}
      <div className="form-field-group" id="location-field">
        <label htmlFor="location-input" className="field-label">
          <span className="field-label-text">
            <span>Location</span>
            <span className="required-asterisk">*</span>
          </span>
          <span className="field-helper">Address, landmark or map point</span>
        </label>
        <LocationSelector
          value={formData.location}
          onChange={(loc) => handleChange('location', loc)}
          error={errors.location}
        />
        {errors.location && (
          <div className="field-error-msg">
            <span>⚠️</span>
            <span>{errors.location}</span>
          </div>
        )}
      </div>

      {/* 5. Upload Evidence */}
      <div className="form-field-group">
        <label className="field-label">
          <span className="field-label-text">
            <span>Upload Evidence</span>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>(Optional)</span>
          </span>
          <span className="field-helper">Photo improves resolution speed</span>
        </label>
        <ImageUpload
          imageFile={imageFile}
          imagePreview={imagePreview}
          onImageSelect={handleImageSelect}
          onImageRemove={handleImageRemove}
          error={errors.image}
        />
      </div>

      {/* 6. Priority / Severity Selector */}
      <div className="form-field-group">
        <label className="field-label">
          <span className="field-label-text">
            <span>Priority / Severity</span>
          </span>
          <span className="field-helper">Indicate urgency level</span>
        </label>
        <div className="priority-selector-grid">
          {[
            { level: 'Low', label: 'Low Urgency', desc: 'Minor issue, non-urgent' },
            { level: 'Medium', label: 'Medium Urgency', desc: 'Standard priority issue' },
            { level: 'High', label: 'High Urgency', desc: 'Critical or safety risk' }
          ].map((p) => {
            const isSelected = formData.priority === p.level;
            const selectClass = isSelected ? `selected-${p.level.toLowerCase()}` : '';
            return (
              <button
                key={p.level}
                type="button"
                className={`priority-option-chip ${selectClass}`}
                onClick={() => handleChange('priority', p.level)}
              >
                <span className="priority-chip-title">
                  {p.level === 'Low' && '🟢 '}
                  {p.level === 'Medium' && '🟡 '}
                  {p.level === 'High' && '🔴 '}
                  {p.label}
                </span>
                <span className="priority-chip-sub">{p.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. AI-Assisted Classification Preview */}
      <div className="form-field-group" style={{ marginTop: '2rem' }}>
        <AIAnalysisPreview
          selectedCategory={formData.category}
          title={formData.title}
        />
      </div>

      {/* Draft Notification Toast */}
      {draftToast && (
        <div className="draft-toast">
          <span>💾</span>
          <span>{draftToast}</span>
        </div>
      )}

      {/* 8. Form Action Buttons */}
      <div className="form-actions-bar">
        <button
          type="submit"
          className="btn-submit-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
              <span>Submitting Complaint...</span>
            </>
          ) : (
            <>
              <span>🚀</span>
              <span>Submit Complaint</span>
            </>
          )}
        </button>

        <button
          type="button"
          className="btn-draft-secondary"
          onClick={handleSaveDraft}
          disabled={isSubmitting}
        >
          <span>💾</span>
          <span>Save as Draft</span>
        </button>
      </div>
    </form>
  );
};

export default IssueForm;
