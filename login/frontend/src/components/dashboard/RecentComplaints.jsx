import React from 'react';
import { useNavigate } from 'react-router-dom';

const getStatusBadgeClass = (status) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'status-pending';
    case 'verified':
      return 'status-verified';
    case 'assigned':
      return 'status-assigned';
    case 'in progress':
      return 'status-in-progress';
    case 'resolved':
      return 'status-resolved';
    case 'rejected':
      return 'status-rejected';
    default:
      return 'status-pending';
  }
};

const getPriorityBadgeClass = (priority) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'priority-high';
    case 'medium':
      return 'priority-medium';
    case 'low':
      return 'priority-low';
    default:
      return 'priority-low';
  }
};

const RecentComplaints = ({ complaints }) => {
  const navigate = useNavigate();

  const handleViewAll = (e) => {
    e.preventDefault();
    navigate('/citizen/complaints');
  };

  return (
    <div className="dash-section-card">
      <div className="section-header">
        <h2 className="section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span>Recent Complaints</span>
        </h2>
        <a href="/citizen/complaints" onClick={handleViewAll} className="section-link">
          View All →
        </a>
      </div>

      <div className="complaints-table-wrapper">
        <table className="complaints-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title & Category</th>
              <th>Location</th>
              <th>Date</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((item) => (
              <tr key={item.id}>
                <td className="complaint-id">{item.id}</td>
                <td>
                  <div className="complaint-title-cell">{item.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.category}</div>
                </td>
                <td>{item.location}</td>
                <td>{item.dateReported}</td>
                <td>
                  <span className={`priority-badge ${getPriorityBadgeClass(item.priority)}`}>
                    {item.priority}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${getStatusBadgeClass(item.status)}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentComplaints;
