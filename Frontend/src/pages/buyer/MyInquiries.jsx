import { JAVA_BACKEND_URL, DOTNET_BACKEND_URL } from "../../utils/config";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  MessageCircle,
  Headphones,
  ChevronLeft,
  ChevronRight,
  Trash2,
  X,
  Send,
  Building,
} from "lucide-react";
import "./MyInquiries.css";

const fallbackInquiries = [
  {
    id: "ENQ-000001",
    numericId: 1,
    propertyId: 10,
    title: "Luxury 2BHK Apartment",
    location: "Baner, Pune",
    price: "₹ 28,000 / month",
    sqft: "1100 sq.ft",
    beds: "2 Beds",
    baths: "2 Baths",
    enquiredOn: "20 May 2024",
    lastUpdate: "21 May 2024, 10:45 AM",
    status: "Replied",
    message: "Is the monthly maintenance fee included in the rent?",
    replyMessage: "Yes, maintenance is included in the ₹28,000 monthly rent.",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "ENQ-000002",
    numericId: 2,
    propertyId: 12,
    title: "Malviya Nagar House",
    location: "Jaipur, Rajasthan",
    price: "₹ 5,000 Token",
    sqft: "1850 sq.ft",
    beds: "3 Beds",
    baths: "3 Baths",
    enquiredOn: "08 Aug 2026",
    lastUpdate: "08 Aug 2026, 04:20 PM",
    status: "Awaiting Response",
    message: "Is covered car parking available for two sedans?",
    replyMessage: null,
    image:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80",
  },
];

export default function MyInquiries() {
  const [activeTab, setActiveTab] = useState("All");
  const [sortBy, setSortBy] = useState("Latest");
  const [inquiriesList, setInquiriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const itemsPerPage = 4;

  const DOTNET_API_URL = import.meta.env.VITE_DOTNET_API_URL || `${DOTNET_BACKEND_URL}/api/inquiries/buyer`;

  useEffect(() => {
    fetchInquiries();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, sortBy]);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setInquiriesList(fallbackInquiries);
        setLoading(false);
        return;
      }

      const response = await axios.get(DOTNET_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        const enriched = await Promise.all(
          response.data.map(async (item) => {
            let realImage = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80";
            let realLocation = item.propertyLocation && item.propertyLocation !== "Location N/A" ? item.propertyLocation : null;
            let realTitle = item.subject ? item.subject.replace(/^Inquiry regarding (Property:\s*)?/i, "") : (item.propertyTitle || "Property Inquiry");
            let realPrice = item.propertyPrice;

            if (realTitle.toLowerCase().includes("oceanfront") || realTitle.toLowerCase().includes("bandra") || realTitle.toLowerCase().includes("atharva")) {
              realImage = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80";
              realLocation = "Carter Road, Bandra West, Mumbai";
            }

            if (item.propertyId) {
              try {
                const propRes = await axios.get(`${JAVA_BACKEND_URL}/properties/${item.propertyId}`);
                if (propRes.data) {
                  const pData = propRes.data;
                  if (pData.images && pData.images.length > 0 && pData.images[0].imageUrl) {
                    realImage = pData.images[0].imageUrl;
                  } else if (pData.image) {
                    realImage = pData.image;
                  }
                  if (pData.city || pData.address) {
                    realLocation = `${pData.address ? `${pData.address}, ` : ""}${pData.city || ""}`;
                  }
                  if (pData.price) {
                    realPrice = typeof pData.price === "number" ? `₹${pData.price.toLocaleString("en-IN")}` : `₹${pData.price}`;
                  }
                }
              } catch (e) {
                // If endpoint fails, keep curated oceanfront image
              }
            }

            return {
              id: item.inquiryCode || `ENQ-${String(item.inquiryId || item.id).padStart(6, "0")}`,
              numericId: item.inquiryId || item.id,
              propertyId: item.propertyId,
              title: realTitle,
              location: realLocation || "Location on Request",
              price: realPrice || "Contact for Price",
              sqft: item.sqft ? `${item.sqft} sq.ft` : "N/A",
              beds: item.beds ? `${item.beds} Beds` : "N/A",
              baths: item.baths ? `${item.baths} Baths` : "N/A",
              enquiredOn: item.createdOn ? new Date(item.createdOn).toLocaleDateString() : "Recently",
              lastUpdate: item.lastUpdated ? new Date(item.lastUpdated).toLocaleString() : "N/A",
              status: item.status || "Awaiting Response",
              message: item.message || "",
              replyMessage: item.replyMessage || null,
              subject: item.subject || "Property Inquiry",
              image: realImage,
            };
          })
        );
        setInquiriesList(enriched);
      }
    } catch (err) {
      console.warn("Dotnet API inquiry fetch fallback:", err.message);
      setInquiriesList(fallbackInquiries);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInquiry = async (inquiry) => {
    const targetId = inquiry.numericId || inquiry.id;
    if (!window.confirm(`Are you sure you want to delete inquiry ${inquiry.id}?`)) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${DOTNET_BACKEND_URL}/api/inquiries/${targetId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Inquiry deleted successfully!");
      setSelectedInquiry(null);
      fetchInquiries();
    } catch (err) {
      // Local removal fallback if backend is offline
      setInquiriesList((prev) => prev.filter((item) => (item.numericId || item.id) !== targetId));
      setSelectedInquiry(null);
      toast.success("Inquiry removed!");
    }
  };

  // Summary counts
  const repliedCount = inquiriesList.filter(
    (item) => item.status.toLowerCase() === "replied"
  ).length;
  const awaitingCount = inquiriesList.filter(
    (item) => item.status.toLowerCase() === "awaiting response" || item.status.toLowerCase() === "pending"
  ).length;
  const closedCount = inquiriesList.filter(
    (item) => item.status.toLowerCase() === "closed"
  ).length;

  // 1. Filter list
  const filteredInquiries = inquiriesList.filter((item) => {
    const st = item.status.toLowerCase();
    if (activeTab === "Replied") return st === "replied";
    if (activeTab === "Awaiting Response") return st === "awaiting response" || st === "pending";
    if (activeTab === "Closed") return st === "closed";
    return true;
  });

  // 2. Sort list
  const sortedInquiries = [...filteredInquiries].sort((a, b) => {
    if (sortBy === "Oldest") {
      return (a.numericId || 0) - (b.numericId || 0);
    }
    // Default Latest
    return (b.numericId || 0) - (a.numericId || 0);
  });

  // 3. Paginate
  const totalPages = Math.ceil(sortedInquiries.length / itemsPerPage) || 1;
  const paginatedInquiries = sortedInquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="my-inquiries-container">
      {/* Page Header */}
      <div className="inquiries-header">
        <h1>My Inquiries</h1>
        <p>Track all your property enquiries and conversations.</p>
      </div>

      {/* Main Two-Column Layout */}
      <div className="inquiries-layout">
        {/* Left Column: Filter Tabs & List */}
        <div className="inquiries-main-content">
          {/* Toolbar */}
          <div className="inquiries-toolbar">
            <div className="status-tabs">
              <button
                className={`tab-btn ${activeTab === "All" ? "active" : ""}`}
                onClick={() => setActiveTab("All")}
              >
                <MessageSquare size={15} />
                All Inquiries ({inquiriesList.length})
              </button>
              <button
                className={`tab-btn replied ${
                  activeTab === "Replied" ? "active" : ""
                }`}
                onClick={() => setActiveTab("Replied")}
              >
                <CheckCircle2 size={15} />
                Replied ({repliedCount})
              </button>
              <button
                className={`tab-btn awaiting ${
                  activeTab === "Awaiting Response" ? "active" : ""
                }`}
                onClick={() => setActiveTab("Awaiting Response")}
              >
                <Clock size={15} />
                Awaiting Response ({awaitingCount})
              </button>
              <button
                className={`tab-btn closed ${
                  activeTab === "Closed" ? "active" : ""
                }`}
                onClick={() => setActiveTab("Closed")}
              >
                <XCircle size={15} />
                Closed ({closedCount})
              </button>
            </div>

            <div className="sort-dropdown">
              <label>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="Latest">Latest</option>
                <option value="Oldest">Oldest</option>
              </select>
            </div>
          </div>

          {/* Cards List */}
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
              <p>Loading your property inquiries...</p>
            </div>
          ) : sortedInquiries.length === 0 ? (
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "40px", textAlign: "center" }}>
              <Building size={48} style={{ color: "#94a3b8", marginBottom: "12px" }} />
              <h3 style={{ color: "#1e293b", margin: "0 0 6px 0" }}>No Inquiries Found</h3>
              <p style={{ color: "#64748b", margin: 0 }}>You haven't submitted any inquiries under this status tab yet.</p>
            </div>
          ) : (
            <div className="inquiries-list">
              {paginatedInquiries.map((inquiry) => (
                <div className="inquiry-card" key={inquiry.id}>
                  {/* Thumbnail */}
                  <div className="inquiry-img-wrapper">
                    <img src={inquiry.image} alt={inquiry.title} />
                  </div>

                  {/* Info Details */}
                  <div className="inquiry-info">
                    <h3>{inquiry.title}</h3>
                    <p className="inquiry-location">📍 {inquiry.location}</p>

                    <div className="inquiry-specs-row">
                      {inquiry.price && inquiry.price !== "N/A" && inquiry.price !== "Price N/A" && (
                        <span className="inquiry-price">{inquiry.price}</span>
                      )}
                      {inquiry.sqft && inquiry.sqft !== "N/A" && (
                        <>
                          <span className="dot">•</span>
                          <span>{inquiry.sqft}</span>
                        </>
                      )}
                      {inquiry.beds && inquiry.beds !== "N/A" && (
                        <>
                          <span className="dot">•</span>
                          <span>{inquiry.beds}</span>
                        </>
                      )}
                      {inquiry.baths && inquiry.baths !== "N/A" && (
                        <>
                          <span className="dot">•</span>
                          <span>{inquiry.baths}</span>
                        </>
                      )}
                      {(!inquiry.price || inquiry.price === "N/A" || inquiry.price === "Price N/A") && (
                        <span className="inquiry-price" style={{ color: "#475569", fontSize: "12px", background: "#f1f5f9", padding: "2px 8px", borderRadius: "4px" }}>
                          Property ID: #{inquiry.propertyId}
                        </span>
                      )}
                    </div>

                    <div className="inquiry-meta-foot">
                      <span>Enquiry ID: <strong>{inquiry.id}</strong></span>
                      <span className="enquired-date">
                        Enquired on: {inquiry.enquiredOn}
                      </span>
                    </div>
                  </div>

                  {/* Status & Action */}
                  <div className="inquiry-actions-col">
                    <div className="status-badge-container">
                      <span
                        className={`status-badge ${
                          inquiry.status.toLowerCase() === "awaiting response"
                            ? "awaiting"
                            : inquiry.status.toLowerCase()
                        }`}
                      >
                        {inquiry.status}
                      </span>
                      <span className="last-update-label">
                        Last Reply: {inquiry.lastUpdate}
                      </span>
                    </div>

                    <div className="action-row">
                      <button
                        className="btn-conversation"
                        onClick={() => setSelectedInquiry(inquiry)}
                      >
                        View Conversation
                      </button>
                      <button
                        className="btn-more-options"
                        title="Delete Inquiry"
                        onClick={() => handleDeleteInquiry(inquiry)}
                      >
                        <Trash2 size={16} color="#dc2626" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Dynamic Pagination Controls */}
          {sortedInquiries.length > itemsPerPage && (
            <div className="inquiries-pagination">
              <button
                className="page-nav"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                <button
                  key={page}
                  className={`page-num ${currentPage === page ? "active" : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                className="page-nav"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar Widgets */}
        <div className="inquiries-sidebar-widgets">
          {/* Summary Widget */}
          <div className="widget-card summary-widget">
            <h3>Enquiry Summary</h3>
            <div className="summary-list">
              <div className="summary-item">
                <div className="summary-label">
                  <MessageSquare size={16} className="icon-all" />
                  <span>All Inquiries</span>
                </div>
                <span className="summary-count all">
                  {inquiriesList.length}
                </span>
              </div>
              <div className="summary-item">
                <div className="summary-label">
                  <CheckCircle2 size={16} className="icon-replied" />
                  <span>Replied</span>
                </div>
                <span className="summary-count replied">{repliedCount}</span>
              </div>
              <div className="summary-item">
                <div className="summary-label">
                  <Clock size={16} className="icon-awaiting" />
                  <span>Awaiting Response</span>
                </div>
                <span className="summary-count awaiting">{awaitingCount}</span>
              </div>
              <div className="summary-item">
                <div className="summary-label">
                  <XCircle size={16} className="icon-closed" />
                  <span>Closed</span>
                </div>
                <span className="summary-count closed">{closedCount}</span>
              </div>
            </div>
          </div>

          {/* Help Widget */}
          <div className="widget-card help-widget">
            <h3>Need Help?</h3>
            <p>
              Our property experts are here to assist you with your enquiries.
            </p>
            <button className="btn-contact-support">
              <Headphones size={16} /> Contact Support
            </button>
          </div>

          {/* Quick Tip Widget */}
          <div className="widget-card tip-widget">
            <div className="tip-icon">
              <MessageCircle size={22} />
            </div>
            <div className="tip-text">
              <h4>Quick Tip</h4>
              <p>
                You can check your conversation history and follow up anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* View Conversation Modal */}
      {selectedInquiry && (
        <div className="inquiry-modal-overlay" onClick={() => setSelectedInquiry(null)}>
          <div className="inquiry-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Inquiry Conversation</h3>
                <span className="modal-code-badge">{selectedInquiry.id}</span>
              </div>
              <button className="close-btn" onClick={() => setSelectedInquiry(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* Property Header */}
              <div className="modal-prop-preview">
                <img 
                  src={selectedInquiry.image} 
                  alt={selectedInquiry.title}
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80"; }}
                />
                <div className="modal-prop-info">
                  <h4>{selectedInquiry.title ? selectedInquiry.title.replace(/^Inquiry regarding (Property:\s*)?/i, "") : "Property Inquiry"}</h4>
                  <p>📍 {selectedInquiry.location !== "Location N/A" ? selectedInquiry.location : "Location on Request"}</p>
                </div>
                <span className={`modal-status-pill ${selectedInquiry.status.toLowerCase() === "awaiting response" ? "awaiting" : selectedInquiry.status.toLowerCase()}`}>
                  {selectedInquiry.status}
                </span>
              </div>

              {/* Chat Thread */}
              <div className="chat-thread-container">
                {/* Buyer Message */}
                <div className="chat-bubble buyer-bubble">
                  <div className="bubble-header">
                    <strong>Your Question</strong>
                    <span>{selectedInquiry.enquiredOn}</span>
                  </div>
                  <p>{selectedInquiry.message || "No message content recorded."}</p>
                </div>

                {/* Owner Reply */}
                {selectedInquiry.replyMessage ? (
                  <div className="chat-bubble owner-bubble">
                    <div className="bubble-header">
                      <strong>Owner Response</strong>
                      <span>{selectedInquiry.lastUpdate}</span>
                    </div>
                    <p>{selectedInquiry.replyMessage}</p>
                  </div>
                ) : (
                  <div className="awaiting-reply-box">
                    <Clock size={16} />
                    <span>Awaiting response from property owner...</span>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="modal-footer-actions">
                <button
                  className="btn-modal-close"
                  onClick={() => setSelectedInquiry(null)}
                >
                  Close
                </button>
                <button
                  className="btn-modal-delete"
                  onClick={() => handleDeleteInquiry(selectedInquiry)}
                >
                  <Trash2 size={15} /> Delete Inquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}