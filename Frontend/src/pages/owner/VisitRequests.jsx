import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCheckCircle,
  FaTimesCircle,
  FaCheckDouble,
  FaBuilding,
  FaCommentAlt,
  FaFileAlt,
  FaFilter,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import "./VisitRequests.css";

const API_URL = "http://localhost:8080";

export default function VisitRequests() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOwnerVisits();
  }, []);

  const fetchOwnerVisits = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${API_URL}/visits/owner`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(res.data)) {
        setVisits(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch owner visit requests:", err);
      toast.error("Failed to load visit requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (visitId, newStatus) => {
    setUpdatingId(visitId);
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${API_URL}/visits/${visitId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Visit status updated to ${newStatus}`);
      fetchOwnerVisits();
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error(
        "Failed to update status: " +
          (err.response?.data?.message || err.message || "Unknown error")
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtered visits calculation
  const filteredVisits = visits.filter((v) => {
    if (activeTab === "ALL") return true;
    return (v.status || "PENDING").toUpperCase() === activeTab;
  });

  // Status counters
  const counts = {
    ALL: visits.length,
    PENDING: visits.filter((v) => (v.status || "PENDING").toUpperCase() === "PENDING").length,
    CONFIRMED: visits.filter((v) => v.status?.toUpperCase() === "CONFIRMED").length,
    COMPLETED: visits.filter((v) => v.status?.toUpperCase() === "COMPLETED").length,
    CANCELLED: visits.filter((v) => v.status?.toUpperCase() === "CANCELLED").length,
  };

  return (
    <div className="visit-requests-container">
      {/* Header */}
      <div className="visit-requests-header">
        <div>
          <h2>Property Visit Requests</h2>
          <p>Review and manage property visit appointments scheduled by potential buyers.</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="visit-tabs-bar">
        <button
          className={`visit-tab ${activeTab === "ALL" ? "active" : ""}`}
          onClick={() => setActiveTab("ALL")}
        >
          <FaFilter /> All ({counts.ALL})
        </button>
        <button
          className={`visit-tab ${activeTab === "PENDING" ? "active" : ""}`}
          onClick={() => setActiveTab("PENDING")}
        >
          ⏳ Pending ({counts.PENDING})
        </button>
        <button
          className={`visit-tab ${activeTab === "CONFIRMED" ? "active" : ""}`}
          onClick={() => setActiveTab("CONFIRMED")}
        >
          <FaCheckCircle /> Confirmed ({counts.CONFIRMED})
        </button>
        <button
          className={`visit-tab ${activeTab === "COMPLETED" ? "active" : ""}`}
          onClick={() => setActiveTab("COMPLETED")}
        >
          <FaCheckDouble /> Completed ({counts.COMPLETED})
        </button>
        <button
          className={`visit-tab ${activeTab === "CANCELLED" ? "active" : ""}`}
          onClick={() => setActiveTab("CANCELLED")}
        >
          <FaTimesCircle /> Cancelled ({counts.CANCELLED})
        </button>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="loading-spinner-box">
          <div className="spinner"></div>
          <p>Loading visit requests...</p>
        </div>
      ) : filteredVisits.length === 0 ? (
        <div className="empty-requests-box">
          <FaCalendarAlt className="empty-icon" size={42} />
          <h3>No Visit Requests Found</h3>
          <p>There are no visit requests matching the selected status filter.</p>
        </div>
      ) : (
        <div className="requests-grid">
          {filteredVisits.map((visit) => {
            const statusUpper = (visit.status || "PENDING").toUpperCase();
            return (
              <div key={visit.id} className={`request-card status-${statusUpper.toLowerCase()}`}>
                {/* Card Header: Property Info & Status */}
                <div className="card-top-header">
                  <div className="property-mini-preview">
                    <div className="prop-img-box">
                      {visit.propertyImage ? (
                        <img src={visit.propertyImage} alt={visit.propertyTitle || "Property"} />
                      ) : (
                        <FaBuilding className="placeholder-icon" size={20} />
                      )}
                    </div>
                    <div className="prop-text-info">
                      <h4>{visit.propertyTitle || "Property Visit"}</h4>
                      <p>📍 {visit.propertyLocation || visit.propertyCity || "Location N/A"}</p>
                    </div>
                  </div>
                  <span className={`status-badge badge-${statusUpper.toLowerCase()}`}>
                    {statusUpper}
                  </span>
                </div>

                {/* Card Body: Visit Date, Slot & Buyer Details */}
                <div className="card-details-body">
                  <div className="info-row-grid">
                    <div className="info-item">
                      <span className="label"><FaCalendarAlt /> Visit Date:</span>
                      <span className="value">{visit.visitDate}</span>
                    </div>
                    <div className="info-item">
                      <span className="label"><FaClock /> Time Slot:</span>
                      <span className="value">{visit.timeSlot || "Not specified"}</span>
                    </div>
                  </div>

                  <div className="buyer-contact-card">
                    <h5><FaUser /> Buyer Details</h5>
                    <div className="buyer-field">
                      <strong>Name:</strong> {visit.fullName || visit.buyerName || "N/A"}
                    </div>
                    <div className="buyer-field">
                      <FaEnvelope /> {visit.email || "N/A"}
                    </div>
                    <div className="buyer-field">
                      <FaPhone /> {visit.phone || "N/A"}
                    </div>
                  </div>

                  {/* Requirements / Notes if any */}
                  {visit.specificRequirements && (
                    <div className="notes-box">
                      <span className="notes-label"><FaFileAlt /> Specific Requirements:</span>
                      <p>{visit.specificRequirements}</p>
                    </div>
                  )}

                  {visit.messageToOwner && (
                    <div className="notes-box">
                      <span className="notes-label"><FaCommentAlt /> Message to Owner:</span>
                      <p>{visit.messageToOwner}</p>
                    </div>
                  )}
                </div>

                {/* Card Footer: Action Buttons */}
                <div className="card-actions">
                  {statusUpper === "PENDING" && (
                    <>
                      <button
                        className="btn-action confirm-btn"
                        disabled={updatingId === visit.id}
                        onClick={() => handleUpdateStatus(visit.id, "CONFIRMED")}
                      >
                        <FaCheck /> Confirm Visit
                      </button>
                      <button
                        className="btn-action reject-btn"
                        disabled={updatingId === visit.id}
                        onClick={() => handleUpdateStatus(visit.id, "CANCELLED")}
                      >
                        <FaTimes /> Reject
                      </button>
                    </>
                  )}

                  {statusUpper === "CONFIRMED" && (
                    <>
                      <button
                        className="btn-action complete-btn"
                        disabled={updatingId === visit.id}
                        onClick={() => handleUpdateStatus(visit.id, "COMPLETED")}
                      >
                        <FaCheckDouble /> Mark Completed
                      </button>
                      <button
                        className="btn-action reject-btn"
                        disabled={updatingId === visit.id}
                        onClick={() => handleUpdateStatus(visit.id, "CANCELLED")}
                      >
                        <FaTimes /> Cancel Visit
                      </button>
                    </>
                  )}

                  {statusUpper === "COMPLETED" && (
                    <span className="completed-text">
                      <FaCheckDouble /> Visit Completed
                    </span>
                  )}

                  {statusUpper === "CANCELLED" && (
                    <span className="cancelled-text">
                      <FaTimesCircle /> Request Cancelled
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
