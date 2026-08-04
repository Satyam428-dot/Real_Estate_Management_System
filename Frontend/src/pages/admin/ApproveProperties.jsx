import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCheck,
  FaTimes,
  FaFileAlt,
  FaEye,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaUser,
  FaBan,
} from "react-icons/fa";
import "./ApproveProperties.css";

export default function ApproveProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("PENDING");

  // Modal States
  const [selectedDoc, setSelectedDoc] = useState(null); // { title: string, url: string }
  const [rejectingPropertyId, setRejectingPropertyId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const [banningPropertyId, setBanningPropertyId] = useState(null);
  const [banReason, setBanReason] = useState("Flagged for policy violation / illegal activity");

  const [updating, setUpdating] = useState(false);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.get("http://localhost:8080/properties", config);
      setProperties(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Failed to load property listings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleStatusChange = async (propertyId, status, reason = "") => {
    try {
      setUpdating(true);
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      let url = `http://localhost:8080/properties/${propertyId}/verification-status?status=${status}`;
      if (reason) {
        url += `&rejectionReason=${encodeURIComponent(reason)}`;
      }

      await axios.put(url, {}, config);

      // If restoring from blacklist, also set blacklist to false
      await axios.put(
        `http://localhost:8080/properties/${propertyId}`,
        { blacklist: false },
        config
      );

      // Update local state
      setProperties((prev) =>
        prev.map((prop) =>
          prop.propertyId === propertyId
            ? { ...prop, verificationStatus: status, rejectionReason: reason, blacklist: false }
            : prop
        )
      );

      setRejectingPropertyId(null);
      setRejectionReason("");
    } catch (err) {
      console.error("Error updating status:", err);
      alert(`Failed to update status to ${status}. Please try again.`);
    } finally {
      setUpdating(false);
    }
  };

  const confirmBanProperty = async () => {
    if (!banningPropertyId) return;

    try {
      setUpdating(true);
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      await axios.put(
        `http://localhost:8080/properties/${banningPropertyId}`,
        { blacklist: true },
        config
      );
      await axios.put(
        `http://localhost:8080/properties/${banningPropertyId}/verification-status?status=REJECTED&rejectionReason=${encodeURIComponent(
          banReason || "Banned by Admin for policy violation"
        )}`,
        {},
        config
      );

      setProperties((prev) =>
        prev.map((p) =>
          p.propertyId === banningPropertyId
            ? {
                ...p,
                blacklist: true,
                verificationStatus: "REJECTED",
                rejectionReason: banReason || "Banned by Admin",
              }
            : p
        )
      );

      setBanningPropertyId(null);
      setBanReason("Flagged for policy violation / illegal activity");
    } catch (err) {
      console.error("Error banning property:", err);
      alert("Failed to ban property.");
    } finally {
      setUpdating(false);
    }
  };

  const handleUnblacklistProperty = async (propertyId) => {
    try {
      setUpdating(true);
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      await axios.put(
        `http://localhost:8080/properties/${propertyId}`,
        { blacklist: false },
        config
      );
      await axios.put(
        `http://localhost:8080/properties/${propertyId}/verification-status?status=APPROVED`,
        {},
        config
      );

      setProperties((prev) =>
        prev.map((p) =>
          p.propertyId === propertyId
            ? { ...p, blacklist: false, verificationStatus: "APPROVED", rejectionReason: null }
            : p
        )
      );
      alert("Property unblacklisted and restored to APPROVED status! It is now live for buyers.");
    } catch (err) {
      console.error("Error unblacklisting property:", err);
      alert("Failed to unblacklist property.");
    } finally {
      setUpdating(false);
    }
  };

  const filteredProperties = properties.filter((prop) => {
    const isBlacklisted = Boolean(prop.blacklist);
    const status = prop.verificationStatus || "PENDING";

    if (activeTab === "BLACKLISTED") return isBlacklisted;
    if (activeTab === "ALL") return true;

    // For PENDING, APPROVED, REJECTED tabs, exclude blacklisted properties
    if (isBlacklisted) return false;
    return status === activeTab;
  });

  const getCount = (tabKey) => {
    if (tabKey === "ALL") return properties.length;
    if (tabKey === "BLACKLISTED") return properties.filter((p) => Boolean(p.blacklist)).length;
    return properties.filter(
      (p) => !p.blacklist && (p.verificationStatus || "PENDING") === tabKey
    ).length;
  };

  return (
    <div className="approve-properties-container">
      <div className="ap-header">
        <h1>Approve Property Listings</h1>
        <p>Review uploaded legal verification documents and manage property listing status</p>
      </div>

      {/* Tabs */}
      <div className="ap-tabs">
        <button
          className={`ap-tab-btn ${activeTab === "PENDING" ? "active" : ""}`}
          onClick={() => setActiveTab("PENDING")}
        >
          Pending Approvals <span className="ap-count-badge">{getCount("PENDING")}</span>
        </button>
        <button
          className={`ap-tab-btn ${activeTab === "APPROVED" ? "active" : ""}`}
          onClick={() => setActiveTab("APPROVED")}
        >
          Approved <span className="ap-count-badge">{getCount("APPROVED")}</span>
        </button>
        <button
          className={`ap-tab-btn ${activeTab === "REJECTED" ? "active" : ""}`}
          onClick={() => setActiveTab("REJECTED")}
        >
          Rejected <span className="ap-count-badge">{getCount("REJECTED")}</span>
        </button>
        <button
          className={`ap-tab-btn ${activeTab === "BLACKLISTED" ? "active" : ""}`}
          onClick={() => setActiveTab("BLACKLISTED")}
        >
          Blacklisted <span className="ap-count-badge">{getCount("BLACKLISTED")}</span>
        </button>
        <button
          className={`ap-tab-btn ${activeTab === "ALL" ? "active" : ""}`}
          onClick={() => setActiveTab("ALL")}
        >
          All Listings <span className="ap-count-badge">{getCount("ALL")}</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
          Loading property submissions...
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#dc2626" }}>{error}</div>
      ) : filteredProperties.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#94a3b8" }}>
          No properties found under <strong>{activeTab}</strong> tab.
        </div>
      ) : (
        <div className="ap-grid">
          {filteredProperties.map((property) => {
            const mainImg = property.images && property.images.length > 0 ? property.images[0].imageUrl : null;
            const status = property.verificationStatus || "PENDING";
            const isBlacklisted = Boolean(property.blacklist);

            return (
              <div key={property.propertyId} className="ap-card">
                <div className="ap-card-img-wrapper">
                  {mainImg ? (
                    <img src={mainImg} alt={property.title} className="ap-card-img" />
                  ) : (
                    <div className="ap-no-img">No Image Available</div>
                  )}
                  {isBlacklisted ? (
                    <span className="ap-badge rejected">BLACKLISTED</span>
                  ) : (
                    <span className={`ap-badge ${status.toLowerCase()}`}>{status}</span>
                  )}
                </div>

                <div className="ap-card-content">
                  <h3 className="ap-card-title">{property.title}</h3>
                  <div className="ap-card-price">
                    ₹{property.price ? property.price.toLocaleString("en-IN") : "N/A"}{" "}
                    <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                      ({property.listingType === "RENT" ? "Rent/month" : "Sale"})
                    </span>
                  </div>

                  <div className="ap-card-meta">
                    <div>
                      <FaMapMarkerAlt /> {property.address}, {property.city}, {property.state} - {property.pinCode}
                    </div>
                    <div>
                      <FaUser /> Owner: <strong>{property.ownerName || `ID #${property.ownerId}`}</strong>
                    </div>
                    <div style={{ display: "flex", gap: "1rem", marginTop: "0.25rem" }}>
                      <span><FaBed /> {property.bedrooms || 0} Beds</span>
                      <span><FaBath /> {property.bathrooms || 0} Baths</span>
                      <span><FaRulerCombined /> {property.areaSqft || 0} sqft</span>
                    </div>
                  </div>

                  {/* Verification Documents Section */}
                  <div className="ap-doc-section">
                    <div className="ap-doc-title">Legal Verification Documents</div>
                    <div className="ap-doc-list">
                      {property.titleDeedUrl ? (
                        <button
                          className="ap-doc-btn"
                          onClick={() => setSelectedDoc({ title: "Title Deed", url: property.titleDeedUrl })}
                        >
                          <FaFileAlt /> Title Deed
                        </button>
                      ) : (
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>No Title Deed</span>
                      )}

                      {property.taxReceiptUrl ? (
                        <button
                          className="ap-doc-btn"
                          onClick={() => setSelectedDoc({ title: "Tax Receipt", url: property.taxReceiptUrl })}
                        >
                          <FaFileAlt /> Tax Receipt
                        </button>
                      ) : (
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>No Tax Receipt</span>
                      )}

                      {property.nocCertificateUrl ? (
                        <button
                          className="ap-doc-btn"
                          onClick={() => setSelectedDoc({ title: "NOC / OC", url: property.nocCertificateUrl })}
                        >
                          <FaFileAlt /> NOC / OC
                        </button>
                      ) : (
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>No NOC</span>
                      )}
                    </div>
                  </div>

                  {property.rejectionReason && (
                    <div style={{ fontSize: "0.85rem", color: "#dc2626", marginBottom: "1rem", background: "#fee2e2", padding: "0.5rem", borderRadius: "6px" }}>
                      <strong>{isBlacklisted ? "Ban Reason:" : "Rejection Reason:"}</strong> {property.rejectionReason}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="ap-card-actions">
                    {isBlacklisted ? (
                      <button
                        className="ap-btn-approve"
                        disabled={updating}
                        onClick={() => handleUnblacklistProperty(property.propertyId)}
                      >
                        <FaCheck /> Unblacklist / Restore
                      </button>
                    ) : status === "APPROVED" ? (
                      <button
                        className="ap-btn-reject"
                        style={{ backgroundColor: "#dc2626" }}
                        disabled={updating}
                        onClick={() => {
                          setBanningPropertyId(property.propertyId);
                          setBanReason("Flagged for policy violation / illegal activity");
                        }}
                      >
                        <FaBan /> Ban / Blacklist Property
                      </button>
                    ) : status === "REJECTED" ? (
                      <button
                        className="ap-btn-approve"
                        disabled={updating}
                        onClick={() => handleStatusChange(property.propertyId, "APPROVED")}
                      >
                        <FaCheck /> Approve Listing
                      </button>
                    ) : (
                      <>
                        <button
                          className="ap-btn-approve"
                          disabled={updating}
                          onClick={() => handleStatusChange(property.propertyId, "APPROVED")}
                        >
                          <FaCheck /> Approve
                        </button>
                        <button
                          className="ap-btn-reject"
                          disabled={updating}
                          onClick={() => setRejectingPropertyId(property.propertyId)}
                        >
                          <FaTimes /> Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Document View Modal */}
      {selectedDoc && (
        <div className="ap-modal-overlay" onClick={() => setSelectedDoc(null)}>
          <div className="ap-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="ap-modal-header">
              <h3>📄 {selectedDoc.title}</h3>
              <button className="ap-modal-close" onClick={() => setSelectedDoc(null)}>
                <FaTimes />
              </button>
            </div>
            <div className="ap-modal-body" style={{ textAlign: "center" }}>
              {selectedDoc.url.toLowerCase().includes(".pdf") ? (
                <object
                  data={selectedDoc.url}
                  type="application/pdf"
                  width="100%"
                  height="450px"
                  style={{ border: "1px solid #cbd5e1", borderRadius: "8px" }}
                >
                  <div
                    style={{
                      padding: "2.5rem 1.5rem",
                      background: "#f8fafc",
                      borderRadius: "12px",
                      border: "1px dashed #cbd5e1",
                    }}
                  >
                    <FaFileAlt style={{ fontSize: "3rem", color: "#3b82f6", marginBottom: "1rem" }} />
                    <h4 style={{ margin: "0 0 0.5rem 0", color: "#0f172a" }}>{selectedDoc.title} Document</h4>
                    <p style={{ fontSize: "0.9rem", color: "#64748b", margin: "0 0 1.25rem 0" }}>
                      Preview is ready. Click the button below to view or download the full document.
                    </p>
                    <a
                      href={selectedDoc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ap-btn-approve"
                      style={{ display: "inline-flex", textDecoration: "none", width: "auto", padding: "0.65rem 1.5rem" }}
                    >
                      <FaEye /> Open Document in Browser
                    </a>
                  </div>
                </object>
              ) : (
                <img
                  src={selectedDoc.url}
                  alt={selectedDoc.title}
                  className="ap-doc-preview-img"
                  onError={(e) => {
                    e.target.style.display = "none";
                    if (e.target.nextSibling) e.target.nextSibling.style.display = "block";
                  }}
                />
              )}

              <div
                style={{
                  marginTop: "1.25rem",
                  display: "flex",
                  justify: "center",
                  gap: "1rem",
                }}
              >
                <a
                  href={selectedDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ap-doc-btn"
                  style={{ display: "inline-flex", fontWeight: "600" }}
                >
                  <FaEye /> View / Download Document ({selectedDoc.title})
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectingPropertyId && (
        <div className="ap-modal-overlay" onClick={() => setRejectingPropertyId(null)}>
          <div className="ap-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="ap-modal-header">
              <h3>Reject Property Listing</h3>
              <button className="ap-modal-close" onClick={() => setRejectingPropertyId(null)}>
                <FaTimes />
              </button>
            </div>
            <div className="ap-modal-body">
              <p style={{ fontSize: "0.9rem", color: "#475569" }}>
                Please provide a clear reason for rejecting this property listing. The owner will be notified.
              </p>
              <textarea
                rows="4"
                placeholder="e.g. Invalid Title Deed provided, address mismatch with tax receipt..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
            <div className="ap-modal-actions">
              <button className="ap-doc-btn" onClick={() => setRejectingPropertyId(null)}>
                Cancel
              </button>
              <button
                className="ap-btn-reject"
                disabled={updating || !rejectionReason.trim()}
                onClick={() => handleStatusChange(rejectingPropertyId, "REJECTED", rejectionReason)}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ban / Blacklist Reason Modal */}
      {banningPropertyId && (
        <div className="ap-modal-overlay" onClick={() => setBanningPropertyId(null)}>
          <div className="ap-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="ap-modal-header">
              <h3 style={{ color: "#dc2626", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FaBan /> Ban & Blacklist Property
              </h3>
              <button className="ap-modal-close" onClick={() => setBanningPropertyId(null)}>
                <FaTimes />
              </button>
            </div>
            <div className="ap-modal-body">
              <p style={{ fontSize: "0.9rem", color: "#475569", marginBottom: "1rem" }}>
                This action will immediately blacklist the property, flag it for policy violation, and hide it from all customers.
              </p>
              <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1e293b", display: "block", marginBottom: "0.35rem" }}>
                Reason for Banning / Blacklisting <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <textarea
                rows="4"
                placeholder="e.g. Flagged for policy violation / illegal activity"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
              />
            </div>
            <div className="ap-modal-actions">
              <button className="ap-doc-btn" onClick={() => setBanningPropertyId(null)}>
                Cancel
              </button>
              <button
                className="ap-btn-reject"
                style={{ backgroundColor: "#dc2626" }}
                disabled={updating || !banReason.trim()}
                onClick={confirmBanProperty}
              >
                <FaBan /> Confirm Ban & Blacklist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
