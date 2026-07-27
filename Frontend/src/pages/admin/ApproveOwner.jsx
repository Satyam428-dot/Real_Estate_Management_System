import { useEffect, useState } from "react";
import axios from "axios";
import { FaCheck, FaFileAlt, FaIdCard, FaTimes, FaUserShield } from "react-icons/fa";
import "./ApproveOwner.css";

function ProofPreview({ label, source, type }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="proof-preview-group">
      <div className="proof-label"><span>{type === "selfie" ? <FaUserShield /> : <FaIdCard />}</span>{label}</div>
      <div className="proof-frame">
        {source && !hasError ? (
          <img src={source} alt={label} onError={() => setHasError(true)} />
        ) : (
          <div className="proof-placeholder"><FaFileAlt /><span>Document preview unavailable</span></div>
        )}
      </div>
    </div>
  );
}

export default function ApproveOwners() {
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

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

  useEffect(() => { fetchPendingRequests(); }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      setUpdating(true);
      await axios.put(`http://localhost:8080/verify/owners/status/${id}`, { status });
      setPendingRequests((prev) => prev.filter((request) => request.id !== id));
      setSelectedOwner(null);
    } catch (err) {
      console.error("Error updating status:", err);
      alert(`Failed to update status to ${status}. Please try again.`);
    } finally {
      setUpdating(false);
    }
  };

  const formatDateTime = (value) => value ? new Date(value).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true,
  }) : "N/A";

  return (
    <div className="approve-owners-container">
      <div className="owners-page-heading">
        <div><p className="owners-eyebrow">Owner verification</p><h1>Review Owner Requests</h1><p className="subtitle">Review identity documents before approving a property owner account.</p></div>
        <span className="badge-counter">{pendingRequests.length} Pending</span>
      </div>

      {loading && <div className="empty-state">Loading pending verification items...</div>}
      {error && <div className="empty-state error-state">{error}</div>}

      {!loading && !error && (
        <div className="requests-list">
          {pendingRequests.length === 0 ? <div className="empty-state">No pending verification requests remaining.</div> : pendingRequests.map((request) => {
            const firstName = request.owner?.firstName || "";
            const lastName = request.owner?.lastName || "";
            const fullName = `${firstName} ${lastName}`.trim() || "Unknown Owner";
            return <article key={request.id} className="request-card">
              <div className="owner-profile-summary"><div className="avatar-placeholder">{firstName ? firstName.charAt(0).toUpperCase() : "O"}</div><div className="owner-text-details"><h3>{fullName}</h3><p className="owner-email">{request.owner?.email || "No email provided"}</p><p className="submission-time">Submitted {formatDateTime(request.verificationDatetime)}</p></div></div>
              <button className="review-btn" onClick={() => setSelectedOwner(request)}>Review request</button>
            </article>;
          })}
        </div>
      )}

      {selectedOwner && <div className="owner-modal-backdrop" onClick={() => !updating && setSelectedOwner(null)}>
        <section className="owner-review-modal" role="dialog" aria-modal="true" aria-labelledby="verify-owner-title" onClick={(event) => event.stopPropagation()}>
          <header className="owner-modal-header"><div><p className="owners-eyebrow">Identity verification</p><h2 id="verify-owner-title">Verify {`${selectedOwner.owner?.firstName || ""} ${selectedOwner.owner?.lastName || ""}`.trim()}</h2><p>Confirm the submitted documents before updating this request.</p></div><button className="close-modal-btn" onClick={() => setSelectedOwner(null)} disabled={updating} aria-label="Close verification dialog"><FaTimes /></button></header>
          <div className="owner-modal-body">
            <div className="proofs-column"><ProofPreview label="Selfie image" source={selectedOwner.selfieImage} type="selfie" /><ProofPreview label="Government-issued ID" source={selectedOwner.governmentIdProof} type="id" /></div>
            <aside className="verification-panel"><h3>Verification checklist</h3><ul><li><FaCheck /> Face matches the photo on the ID.</li><li><FaCheck /> Document text is clear and readable.</li><li><FaCheck /> Legal name matches the registered profile.</li></ul><div className="owner-review-actions"><button className="owner-review-action owner-reject-action" onClick={() => handleStatusUpdate(selectedOwner.id, "REJECTED")} disabled={updating}>Reject request</button><button className="owner-review-action owner-approve-action" onClick={() => handleStatusUpdate(selectedOwner.id, "APPROVED")} disabled={updating}>{updating ? "Updating..." : "Approve owner"}</button></div></aside>
          </div>
        </section>
      </div>}
    </div>
  );
}
