import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import ComplaintDetailsHeader from '../components/complaintDetails/ComplaintDetailsHeader';
import ComplaintOverview from '../components/complaintDetails/ComplaintOverview';
import ComplaintTimeline from '../components/complaintDetails/ComplaintTimeline';
import AIAnalysisSection from '../components/complaintDetails/AIAnalysisSection';
import AssignedDepartment from '../components/complaintDetails/AssignedDepartment';
import ComplaintActivity from '../components/complaintDetails/ComplaintActivity';
import EvidenceSection from '../components/complaintDetails/EvidenceSection';
import CitizenActions from '../components/complaintDetails/CitizenActions';
import LocationCard from '../components/complaintDetails/LocationCard';
import { getComplaintDetailsById } from '../data/mockComplaintDetails';
import '../styles/dashboard.css';
import '../styles/complaintDetails.css';

const ComplaintDetailsPage = () => {
  const { complaintId } = useParams();
  const navigate = useNavigate();

  // Load complaint data from mock dataset
  const complaint = useMemo(() => getComplaintDetailsById(complaintId), [complaintId]);
  const [userAddedActivitiesMap, setUserAddedActivitiesMap] = useState({});

  // Combine user added activities with complaint base activities
  const activities = useMemo(() => {
    const base = complaint?.activityLog || [];
    const userItems = userAddedActivitiesMap[complaintId] || [];
    return [...userItems, ...base];
  }, [complaint, userAddedActivitiesMap, complaintId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [complaintId]);

  // Handler for citizen adding new information
  const handleAddInformation = (newActivity) => {
    setUserAddedActivitiesMap((prev) => ({
      ...prev,
      [complaintId]: [newActivity, ...(prev[complaintId] || [])]
    }));
  };

  // If complaint is not found, render a clean, friendly 404 fallback
  if (!complaint) {
    return (
      <div className="citizen-layout">
        <Sidebar />
        <main className="citizen-main-content">
          <div className="cd-page-wrapper">
            <div className="cd-not-found-card">
              <div className="cd-not-found-icon">🔍</div>
              <h1 className="cd-not-found-title">Complaint Not Found</h1>
              <p className="cd-not-found-desc">
                No complaint record exists for identifier <strong>"{complaintId}"</strong> in the system.
              </p>

              <div className="cd-demo-ids-card">
                <div className="cd-demo-ids-title">Explore Sample Complaints:</div>
                <div className="cd-demo-id-pills">
                  <button
                    type="button"
                    className="cd-demo-pill"
                    onClick={() => navigate('/citizen/complaints/CP1025')}
                  >
                    <span>🔄</span>
                    <span>CP1025 (In Progress)</span>
                  </button>
                  <button
                    type="button"
                    className="cd-demo-pill"
                    onClick={() => navigate('/citizen/complaints/CP1024')}
                  >
                    <span>🔄</span>
                    <span>CP1024 (In Progress)</span>
                  </button>
                  <button
                    type="button"
                    className="cd-demo-pill"
                    onClick={() => navigate('/citizen/complaints/CP1023')}
                  >
                    <span>⏳</span>
                    <span>CP1023 (Pending)</span>
                  </button>
                  <button
                    type="button"
                    className="cd-demo-pill"
                    onClick={() => navigate('/citizen/complaints/CP1021')}
                  >
                    <span>✅</span>
                    <span>CP1021 (Resolved)</span>
                  </button>
                  <button
                    type="button"
                    className="cd-demo-pill"
                    onClick={() => navigate('/citizen/complaints/CP1026')}
                  >
                    <span>❌</span>
                    <span>CP1026 (Rejected)</span>
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="cd-btn-primary"
                onClick={() => navigate('/citizen/complaints')}
              >
                ← Return to My Complaints
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const isRejected = complaint.status?.toLowerCase() === 'rejected';

  return (
    <div className="citizen-layout">
      {/* Existing Preserved Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="citizen-main-content">
        <div className="cd-page-wrapper">
          {/* 1. Header with Breadcrumb, ID, Status Badge */}
          <ComplaintDetailsHeader complaint={complaint} />

          {/* 2. Responsive Multi-Column Grid */}
          <div className="cd-main-grid">
            {/* Left Column (Main Focus) */}
            <div className="cd-col-left">
              {/* Complaint Overview */}
              <ComplaintOverview complaint={complaint} />

              {/* Status / Progress Timeline */}
              <ComplaintTimeline stages={complaint.stages} isRejected={isRejected} />

              {/* Uploaded Evidence Section */}
              <EvidenceSection evidence={complaint.evidence} />

              {/* Department Updates & Activity Log */}
              <ComplaintActivity activities={activities} />

              {/* Citizen Actions (Add Information / Rate Resolution / Rejection Notice) */}
              <CitizenActions
                complaint={complaint}
                onAddInformation={handleAddInformation}
              />
            </div>

            {/* Right Column (Supporting Context & Metadata) */}
            <div className="cd-col-right">
              {/* AI-Assisted Classification Preview */}
              <AIAnalysisSection aiAnalysis={complaint.aiAnalysis} />

              {/* Assigned Department */}
              <AssignedDepartment
                department={complaint.department}
                status={complaint.status}
              />

              {/* Nearby / Location Information with Mock Static Map */}
              <LocationCard
                location={complaint.location}
                landmark={complaint.landmark}
                coordinates={complaint.coordinates}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComplaintDetailsPage;
