import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ApproveOwner.css";

export default function ApproveOwners() {
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch pending verifications from backend on component mount
  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/verify/owners");
      setPendingRequests(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching verification records:", err);
      setError("Failed to load verification requests. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Status Update API Call
  const handleStatusUpdate = async (id, status) => {
    try {
      console.log(`Setting verification ID ${id} to status: ${status}`);

      // Update backend status state
      await axios.put(`http://localhost:8080/verify/owners/status/${id}`, {
        status: status,
      });

      // Optimistically remove from active UI view list after successful API response
      setPendingRequests((prev) => prev.filter((req) => req.id !== id));
      setSelectedOwner(null);
    } catch (err) {
      console.error("Error updating status:", err);
      alert(`Failed to update status to ${status}. Please try again.`);
    }
  };

  // Helper function to format ISO Date string from backend into standard display format
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="approve-owners-container">
      <div className="header-inline-group">
        <h1>Approve Owners</h1>
        <span className="badge-counter">{pendingRequests.length} Pending</span>
      </div>
      <p className="subtitle">
        Review and verify registration documents submitted by new owners.
      </p>

      {/* Loading & Error States */}
      {loading && (
        <div className="empty-state">Loading pending verification items...</div>
      )}
      {error && (
        <div
          className="empty-state"
          style={{ color: "#dc2626", borderColor: "#fca5a5" }}
        >
          {error}
        </div>
      )}

      {/* Main Grid List View */}
      {!loading && !error && (
        <div className="requests-list">
          {pendingRequests.length === 0 ? (
            <div className="empty-state">
              No pending verification requests remaining.
            </div>
          ) : (
            pendingRequests.map((request) => {
              // Safely pull and construct the full name from the nested object
              const ownerFirstName = request.owner?.firstName || "";
              const ownerLastName = request.owner?.lastName || "";
              const fullOwnerName =
                `${ownerFirstName} ${ownerLastName}`.trim() || "Unknown Owner";

              return (
                <div key={request.id} className="request-card">
                  <div className="owner-profile-summary">
                    <div className="avatar-placeholder">
                      {ownerFirstName
                        ? ownerFirstName.charAt(0).toUpperCase()
                        : "O"}
                    </div>
                    <div className="owner-text-details">
                      <h3>{fullOwnerName}</h3>
                      <p className="owner-email">
                        {request.owner?.email || "No Email Provided"}
                      </p>
                      <p className="submission-time">
                        Submitted:{" "}
                        {formatDateTime(request.verificationDatetime)}
                      </p>
                    </div>
                  </div>
                  <button
                    className="review-btn"
                    onClick={() => setSelectedOwner(request)}
                  >
                    Review Request
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Identity Review Modal Layer */}
      {selectedOwner && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <div>
                <h2>Verify Identity</h2>
                <p>
                  Applicant Record:{" "}
                  {`${selectedOwner.owner?.firstName || ""} ${selectedOwner.owner?.lastName || ""}`.trim()}
                </p>
              </div>
              <button
                className="close-modal-btn"
                onClick={() => setSelectedOwner(null)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {/* Media Proof Gallery Column */}
              <div className="proofs-column">
                <div className="image-preview-group">
                  <label>Selfie Image</label>
                  <div className="img-frame">
                    <img src={selectedOwner.selfieImage} alt="Selfie upload" />
                  </div>
                </div>

                <div className="image-preview-group">
                  <label>Government Issued ID Proof</label>
                  <div className="img-frame">
                    <img
                      src={selectedOwner.governmentIdProof}
                      alt="Government Document upload"
                    />
                  </div>
                </div>
              </div>

              {/* Action Operations Column */}
              <div className="actions-column">
                <div className="checklist-box">
                  <h4>Verification Checklist</h4>
                  <ul>
                    <li>
                      💡 Does the face match the photo printed on the ID card?
                    </li>
                    <li>
                      💡 Is the text on the government record crisp and fully
                      readable?
                    </li>
                    <li>
                      💡 Does the legal record match their registered system
                      profile name?
                    </li>
                  </ul>
                </div>

                <div className="modal-actions-footer">
                  <button
                    className="action-btn reject-btn"
                    onClick={() =>
                      handleStatusUpdate(selectedOwner.id, "REJECTED")
                    }
                  >
                    Reject Request
                  </button>
                  <button
                    className="action-btn approve-btn"
                    onClick={() =>
                      handleStatusUpdate(selectedOwner.id, "APPROVED")
                    }
                  >
                    Approve Owner
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
