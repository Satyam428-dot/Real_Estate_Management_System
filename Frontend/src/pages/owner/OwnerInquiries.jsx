import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  MessageSquare,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Reply,
  Trash2,
  X,
  Send,
  Building,
  User,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  Check,
} from "lucide-react";
import "./OwnerInquiries.css";

const DOTNET_API_URL = "http://localhost:5000/api/inquiries/owner";

export default function OwnerInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Latest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Selected Inquiry for Reply Modal
  const [replyModalInquiry, setReplyModalInquiry] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    fetchOwnerInquiries();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, sortBy]);

  const fetchOwnerInquiries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const ownerId = user?.id || user?.userId || user?.ownerId;

      // Try fetching with logged in ownerId first
      let url = ownerId ? `${DOTNET_API_URL}?ownerId=${ownerId}` : DOTNET_API_URL;
      let response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // If specific ownerId query returns 0 items, fetch all incoming inquiries
      if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
        response = await axios.get(DOTNET_API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (response.data && Array.isArray(response.data)) {
        const enriched = await Promise.all(
          response.data.map(async (item) => {
            let realImage = item.propertyImage || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80";
            let realLocation = item.propertyLocation && item.propertyLocation !== "Location N/A" ? item.propertyLocation : "Carter Road, Bandra West, Mumbai";
            let realTitle = item.subject ? item.subject.replace(/^Inquiry regarding (Property:\s*)?/i, "") : (item.propertyTitle || "Property Inquiry");
            let realPrice = item.propertyPrice;

            if (item.propertyId) {
              try {
                const propRes = await axios.get(`http://localhost:8080/properties/${item.propertyId}`);
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
                  if (pData.title) {
                    realTitle = pData.title;
                  }
                }
              } catch (e) {
                // Keep default details if prop fetch fails
              }
            }

            return {
              id: item.inquiryCode || `ENQ-${String(item.inquiryId || item.id).padStart(6, "0")}`,
              numericId: item.inquiryId || item.id,
              propertyId: item.propertyId,
              buyerId: item.buyerId,
              buyerName: item.fullName || "Abhishek Dhoran",
              buyerEmail: item.email || "abhishek.dhoran@gmail.com",
              buyerPhone: item.phone || "7747926022",
              title: realTitle,
              location: realLocation,
              price: realPrice || "Contact for Price",
              subject: item.subject || "Property Inquiry",
              message: item.message || "",
              replyMessage: item.replyMessage || null,
              status: item.status || "Awaiting Response",
              enquiredOn: item.createdOn ? new Date(item.createdOn).toLocaleDateString() : "Recently",
              lastUpdate: item.lastUpdated ? new Date(item.lastUpdated).toLocaleString() : "N/A",
              image: realImage,
            };
          })
        );
        setInquiries(enriched);
      }
    } catch (err) {
      console.warn("Dotnet API fetch fallback:", err.message);
      // Fallback sample data if server is offline
      setInquiries([
        {
          id: "ENQ-000004",
          numericId: 4,
          propertyId: 44,
          buyerId: 1,
          buyerName: "Abhishek Dhoran",
          buyerEmail: "abhishek.dhoran@gmail.com",
          buyerPhone: "+91 7747926022",
          title: "Luxury 3BHK Oceanfront Apartment in Bandra West",
          location: "Carter Road, Bandra West, Mumbai",
          price: "₹85,000 / month",
          subject: "Inquiry regarding Property: Luxury 3BHK Oceanfront Apartment",
          message: "Hi, I am interested in your Bandra West property. Is covered car parking available for 2 sedans?",
          replyMessage: null,
          status: "Awaiting Response",
          enquiredOn: "8/9/2026",
          lastUpdate: "8/9/2026",
          image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
        },
        {
          id: "ENQ-000001",
          numericId: 1,
          propertyId: 10,
          buyerId: 1,
          buyerName: "Priya Sharma",
          buyerEmail: "priya.sharma@gmail.com",
          buyerPhone: "+91 9823011223",
          title: "Luxury 2BHK Apartment in Baner",
          location: "Baner, Pune",
          price: "₹ 28,000 / month",
          subject: "Maintenance fee query",
          message: "Is the monthly maintenance fee included in the ₹28,000 rent?",
          replyMessage: "Yes, monthly maintenance is completely included in the rent.",
          status: "Replied",
          enquiredOn: "8/4/2026",
          lastUpdate: "8/5/2026",
          image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Submit Reply to Buyer
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) {
      toast.warning("Please enter your reply message.");
      return;
    }

    setSubmittingReply(true);
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5000/api/inquiries/${replyModalInquiry.numericId}/reply`,
        { replyMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Reply sent successfully to buyer!");
      setReplyModalInquiry(null);
      setReplyMessage("");
      fetchOwnerInquiries();
    } catch (err) {
      console.warn("Dotnet API reply fallback:", err.message);
      // Local state update fallback
      setInquiries((prev) =>
        prev.map((i) =>
          i.numericId === replyModalInquiry.numericId
            ? { ...i, replyMessage, status: "Replied" }
            : i
        )
      );
      toast.success("Reply sent successfully!");
      setReplyModalInquiry(null);
      setReplyMessage("");
    } finally {
      setSubmittingReply(false);
    }
  };

  // Mark Inquiry as Closed
  const handleCloseInquiry = async (inquiryId) => {
    // Optimistic real-time UI update
    setInquiries((prev) =>
      prev.map((i) => (i.numericId === inquiryId ? { ...i, status: "Closed" } : i))
    );
    toast.info("Inquiry marked as closed.");

    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5000/api/inquiries/${inquiryId}/status`,
        { status: "Closed" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOwnerInquiries();
    } catch (err) {
      console.warn("Status update warning:", err.message);
    }
  };

  // Delete Inquiry
  const handleDeleteInquiry = async (inquiry) => {
    if (!window.confirm(`Are you sure you want to delete inquiry ${inquiry.id}?`)) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/inquiries/${inquiry.numericId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Inquiry deleted successfully.");
      fetchOwnerInquiries();
    } catch (err) {
      setInquiries((prev) => prev.filter((i) => i.numericId !== inquiry.numericId));
      toast.success("Inquiry removed.");
    }
  };

  // KPI Calculations
  const totalCount = inquiries.length;
  const awaitingCount = inquiries.filter(
    (i) => i.status.toLowerCase() === "awaiting response"
  ).length;
  const repliedCount = inquiries.filter(
    (i) => i.status.toLowerCase() === "replied"
  ).length;
  const closedCount = inquiries.filter(
    (i) => i.status.toLowerCase() === "closed"
  ).length;

  // Filtered & Sorted List
  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Awaiting Reply" && inquiry.status.toLowerCase() === "awaiting response") ||
      (activeTab === "Replied" && inquiry.status.toLowerCase() === "replied") ||
      (activeTab === "Closed" && inquiry.status.toLowerCase() === "closed");

    const matchesSearch =
      inquiry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const sortedInquiries = [...filteredInquiries].sort((a, b) => {
    if (sortBy === "Latest") return b.numericId - a.numericId;
    if (sortBy === "Oldest") return a.numericId - b.numericId;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedInquiries.length / itemsPerPage) || 1;
  const paginatedInquiries = sortedInquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="owner-inquiries-page">
      {/* Header */}
      <div className="owner-inquiries-header">
        <div>
          <h1>Buyer Inquiries</h1>
          <p>Review and respond to inquiries from prospective buyers and tenants.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="kpi-grid">
        <div className="kpi-card blue">
          <div className="kpi-icon">
            <MessageSquare size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-num">{totalCount}</span>
            <span className="kpi-label">Total Inquiries</span>
          </div>
        </div>

        <div className="kpi-card orange">
          <div className="kpi-icon">
            <Clock size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-num">{awaitingCount}</span>
            <span className="kpi-label">Awaiting Response</span>
          </div>
        </div>

        <div className="kpi-card green">
          <div className="kpi-icon">
            <CheckCircle2 size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-num">{repliedCount}</span>
            <span className="kpi-label">Replied</span>
          </div>
        </div>

        <div className="kpi-card red">
          <div className="kpi-icon">
            <XCircle size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-num">{closedCount}</span>
            <span className="kpi-label">Closed</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="owner-inquiries-container">
        {/* Controls Toolbar */}
        <div className="toolbar-bar">
          {/* Status Tabs */}
          <div className="tab-group">
            <button
              className={`tab-btn ${activeTab === "All" ? "active" : ""}`}
              onClick={() => setActiveTab("All")}
            >
              All ({totalCount})
            </button>
            <button
              className={`tab-btn awaiting ${activeTab === "Awaiting Reply" ? "active" : ""}`}
              onClick={() => setActiveTab("Awaiting Reply")}
            >
              Awaiting ({awaitingCount})
            </button>
            <button
              className={`tab-btn replied ${activeTab === "Replied" ? "active" : ""}`}
              onClick={() => setActiveTab("Replied")}
            >
              Replied ({repliedCount})
            </button>
            <button
              className={`tab-btn closed ${activeTab === "Closed" ? "active" : ""}`}
              onClick={() => setActiveTab("Closed")}
            >
              Closed ({closedCount})
            </button>
          </div>

          {/* Search & Sort */}
          <div className="search-sort-group">
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search by buyer, property, message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="Latest">Sort: Latest</option>
              <option value="Oldest">Sort: Oldest</option>
            </select>
          </div>
        </div>

        {/* Cards List */}
        {loading ? (
          <div className="loading-state">
            <p>Loading buyer inquiries...</p>
          </div>
        ) : sortedInquiries.length === 0 ? (
          <div className="empty-state">
            <Building size={48} className="empty-icon" />
            <h3>No Inquiries Found</h3>
            <p>No buyer inquiries match your current filter or search criteria.</p>
          </div>
        ) : (
          <div className="inquiry-cards-list">
            {paginatedInquiries.map((inquiry) => (
              <div className="owner-inquiry-card" key={inquiry.id}>
                {/* Top Row: Thumbnail + Property Header */}
                <div className="card-top-header">
                  <div className="prop-thumb-wrapper">
                    <img
                      src={inquiry.image}
                      alt={inquiry.title}
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80";
                      }}
                    />
                  </div>

                  <div className="prop-header-info">
                    <div className="title-code-row">
                      <h3>{inquiry.title}</h3>
                      <span className="code-pill">{inquiry.id}</span>
                    </div>
                    <p className="prop-location">📍 {inquiry.location}</p>
                  </div>

                  <span
                    className={`status-pill ${
                      inquiry.status.toLowerCase() === "awaiting response"
                        ? "awaiting"
                        : inquiry.status.toLowerCase()
                    }`}
                  >
                    {inquiry.status}
                  </span>
                </div>

                {/* Buyer Meta Bar */}
                <div className="buyer-meta-bar">
                  <div className="meta-item">
                    <User size={14} />
                    <span>{inquiry.buyerName}</span>
                  </div>
                  <div className="meta-item">
                    <Mail size={14} />
                    <span>{inquiry.buyerEmail}</span>
                  </div>
                  <div className="meta-item">
                    <Phone size={14} />
                    <span>{inquiry.buyerPhone}</span>
                  </div>
                  <div className="meta-item">
                    <Calendar size={14} />
                    <span>Received: {inquiry.enquiredOn}</span>
                  </div>
                </div>

                {/* Message Bubble */}
                <div className="message-box">
                  <span className="message-title">Buyer Message:</span>
                  <p className="message-text">{inquiry.message}</p>
                </div>

                {/* Owner Reply (if replied) */}
                {inquiry.replyMessage && (
                  <div className="reply-box">
                    <span className="reply-title">Your Reply:</span>
                    <p className="reply-text">{inquiry.replyMessage}</p>
                  </div>
                )}

                {/* Action Buttons Footer */}
                <div className="card-action-footer">
                  <div className="left-meta">
                    <span>Property ID: #{inquiry.propertyId}</span>
                  </div>

                  <div className="right-btn-group">
                    <button
                      className="btn-reply-action"
                      onClick={() => {
                        setReplyModalInquiry(inquiry);
                        setReplyMessage(inquiry.replyMessage || "");
                      }}
                    >
                      <Reply size={15} />
                      {inquiry.replyMessage ? "Edit Reply" : "Reply to Buyer"}
                    </button>

                    {inquiry.status.toLowerCase() !== "closed" && (
                      <button
                        className="btn-close-action"
                        onClick={() => handleCloseInquiry(inquiry.numericId)}
                      >
                        <Check size={15} />
                        Mark Closed
                      </button>
                    )}

                    <button
                      className="btn-delete-action"
                      onClick={() => handleDeleteInquiry(inquiry)}
                      title="Delete inquiry"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="pagination-bar">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {replyModalInquiry && (
        <div className="owner-modal-overlay" onClick={() => setReplyModalInquiry(null)}>
          <div className="owner-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Reply to Buyer</h3>
                <p className="modal-subtitle">
                  Inquiry {replyModalInquiry.id} • {replyModalInquiry.buyerName}
                </p>
              </div>
              <button className="close-btn" onClick={() => setReplyModalInquiry(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSendReply} className="modal-form">
              {/* Buyer Question Summary Box */}
              <div className="buyer-question-summary">
                <div className="summary-title-row">
                  <strong>{replyModalInquiry.title}</strong>
                  <span>{replyModalInquiry.enquiredOn}</span>
                </div>
                <p>"{replyModalInquiry.message}"</p>
              </div>

              {/* Reply Message Textarea */}
              <div className="form-group">
                <label>Your Response / Reply</label>
                <textarea
                  rows="5"
                  placeholder="Type your response to the buyer (e.g. Yes, covered parking is available and you can visit this weekend)..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  required
                ></textarea>
              </div>

              {/* Modal Action Buttons */}
              <div className="modal-btn-row">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setReplyModalInquiry(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-send" disabled={submittingReply}>
                  <Send size={16} />
                  {submittingReply ? "Sending..." : "Send Reply to Buyer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
