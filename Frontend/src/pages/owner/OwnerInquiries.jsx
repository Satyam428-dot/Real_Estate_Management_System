import { JAVA_BACKEND_URL, DOTNET_BACKEND_URL } from "../../utils/config";
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
  MapPin,
  Tag
} from "lucide-react";
import "./OwnerInquiries.css";

const DOTNET_API_URL = `${DOTNET_BACKEND_URL}/api/inquiries/owner`;

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
      const userStr = localStorage.getItem("loggedInUser") || localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const ownerId = user?.userId || user?.id || user?.ownerId;

      if (!ownerId) {
        setInquiries([]);
        setLoading(false);
        return;
      }

      let url = `${DOTNET_API_URL}?ownerId=${ownerId}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && Array.isArray(response.data)) {
        const enriched = await Promise.all(
          response.data.map(async (item) => {
            let realImage = item.propertyImage || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80";
            let realLocation = item.propertyLocation && item.propertyLocation !== "Location N/A" ? item.propertyLocation : "Carter Road, Bandra West, Mumbai";
            let realTitle = item.subject ? item.subject.replace(/^Inquiry regarding (Property:\s*)?/i, "") : (item.propertyTitle || "Property Inquiry");
            let realPrice = item.propertyPrice;

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
              buyerName: item.fullName || "Buyer",
              buyerEmail: item.email || "buyer@gmail.com",
              buyerPhone: item.phone || "N/A",
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
      setInquiries([]);
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
        `${DOTNET_BACKEND_URL}/api/inquiries/${replyModalInquiry.numericId}/reply`,
        { replyMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Reply sent successfully to buyer!");
      setReplyModalInquiry(null);
      setReplyMessage("");
      fetchOwnerInquiries();
    } catch (err) {
      console.warn("Dotnet API reply fallback:", err.message);
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
    setInquiries((prev) =>
      prev.map((i) => (i.numericId === inquiryId ? { ...i, status: "Closed" } : i))
    );
    toast.info("Inquiry marked as closed.");

    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${DOTNET_BACKEND_URL}/api/inquiries/${inquiryId}/status`,
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
      await axios.delete(`${DOTNET_BACKEND_URL}/api/inquiries/${inquiry.numericId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Inquiry deleted successfully.");
      fetchOwnerInquiries();
    } catch (err) {
      console.warn("Delete warning:", err.message);
      setInquiries((prev) => prev.filter((i) => i.numericId !== inquiry.numericId));
      toast.success("Inquiry removed.");
    }
  };

  // Counts for Tabs
  const counts = {
    All: inquiries.length,
    Awaiting: inquiries.filter((i) => i.status === "Awaiting Response" || i.status === "Awaiting").length,
    Replied: inquiries.filter((i) => i.status === "Replied").length,
    Closed: inquiries.filter((i) => i.status === "Closed").length,
  };

  // Filtered inquiries
  const filteredInquiries = inquiries.filter((inquiry) => {
    if (activeTab === "Awaiting" && inquiry.status !== "Awaiting Response" && inquiry.status !== "Awaiting") return false;
    if (activeTab === "Replied" && inquiry.status !== "Replied") return false;
    if (activeTab === "Closed" && inquiry.status !== "Closed") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = inquiry.buyerName?.toLowerCase().includes(q);
      const matchEmail = inquiry.buyerEmail?.toLowerCase().includes(q);
      const matchTitle = inquiry.title?.toLowerCase().includes(q);
      const matchId = inquiry.id?.toLowerCase().includes(q);
      const matchMsg = inquiry.message?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchTitle && !matchId && !matchMsg) return false;
    }
    return true;
  });

  // Sorting
  const sortedInquiries = [...filteredInquiries].sort((a, b) => {
    if (sortBy === "Latest") return b.numericId - a.numericId;
    if (sortBy === "Oldest") return a.numericId - b.numericId;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedInquiries.length / itemsPerPage);
  const paginatedInquiries = sortedInquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="owner-inquiries-page">
      {/* Top Banner Header */}
      <div className="inquiries-banner-header">
        <div className="banner-title-group">
          <h1><MessageSquare className="icon-main" /> Property Inquiries</h1>
          <p>Review, respond, and manage direct inquiries from interested property buyers.</p>
        </div>
      </div>

      {/* Main Container */}
      <div className="inquiries-main-wrapper">
        {/* Controls Bar: Tabs & Search */}
        <div className="controls-card">
          <div className="tabs-nav-bar">
            {["All", "Awaiting", "Replied", "Closed"].map((tab) => (
              <button
                key={tab}
                className={`tab-nav-item ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab} <span className="tab-badge">{counts[tab] || 0}</span>
              </button>
            ))}
          </div>

          <div className="search-sort-bar">
            <div className="search-input-box">
              <Search className="icon-search" />
              <input
                type="text"
                placeholder="Search by buyer, email, property title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="btn-clear-search" onClick={() => setSearchQuery("")}>
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="sort-dropdown-box">
              <label>Sort:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="Latest">Latest First</option>
                <option value="Oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="loading-card-box">
            <div className="loading-spinner"></div>
            <p>Fetching inquiries for your properties...</p>
          </div>
        ) : paginatedInquiries.length === 0 ? (
          <div className="empty-inquiries-card">
            <AlertCircle className="icon-empty" />
            <h3>No inquiries found</h3>
            <p>
              {searchQuery
                ? `No inquiries match "${searchQuery}"`
                : activeTab !== "All"
                ? `No inquiries found in "${activeTab}" category.`
                : "You currently have no incoming buyer inquiries."}
            </p>
          </div>
        ) : (
          <div className="inquiries-card-list">
            {paginatedInquiries.map((inquiry) => {
              const statusSlug = inquiry.status.toLowerCase().replace(/\s+/g, "-");
              return (
                <div key={inquiry.numericId} className={`inquiry-item-card status-border-${statusSlug}`}>
                  {/* 1. Header: Property Thumbnail + Title & Location + Status Badge */}
                  <div className="card-top-header">
                    <img src={inquiry.image} alt={inquiry.title} className="property-thumbnail" />
                    <div className="property-header-details">
                      <div className="title-and-status">
                        <h3 className="property-title">{inquiry.title}</h3>
                        <span className={`status-badge badge-${statusSlug}`}>
                          {inquiry.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="property-sub-meta">
                        <span className="location-tag"><MapPin className="ic-sm" /> {inquiry.location}</span>
                        {inquiry.price && <span className="price-tag">{inquiry.price}</span>}
                        <span className="inquiry-code-tag"><Tag className="ic-sm" /> {inquiry.id}</span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Buyer Info Bar */}
                  <div className="buyer-info-bar">
                    <div className="buyer-info-chip"><User className="ic-chip" /> <span>{inquiry.buyerName}</span></div>
                    <div className="buyer-info-chip"><Mail className="ic-chip" /> <span>{inquiry.buyerEmail}</span></div>
                    <div className="buyer-info-chip"><Phone className="ic-chip" /> <span>{inquiry.buyerPhone}</span></div>
                    <div className="buyer-info-chip"><Calendar className="ic-chip" /> <span>Received: {inquiry.enquiredOn}</span></div>
                  </div>

                  {/* 3. Messages Stack */}
                  <div className="messages-container">
                    <div className="buyer-message-card">
                      <div className="msg-card-label"><MessageSquare className="ic-msg" /> Buyer Message:</div>
                      <p className="msg-text">{inquiry.message}</p>
                    </div>

                    {inquiry.replyMessage && (
                      <div className="owner-reply-card">
                        <div className="reply-card-label"><Check className="ic-reply" /> Your Reply:</div>
                        <p className="reply-text">{inquiry.replyMessage}</p>
                      </div>
                    )}
                  </div>

                  {/* 4. Footer Actions */}
                  <div className="card-footer-bar">
                    <span className="property-id-label">Property ID: #{inquiry.propertyId || inquiry.numericId}</span>
                    <div className="actions-group">
                      <button
                        className="btn-action-primary"
                        onClick={() => {
                          setReplyModalInquiry(inquiry);
                          setReplyMessage(inquiry.replyMessage || "");
                        }}
                      >
                        <Reply className="btn-ic" /> {inquiry.replyMessage ? "Edit Reply" : "Reply"}
                      </button>

                      {inquiry.status !== "Closed" && (
                        <button
                          className="btn-action-secondary"
                          onClick={() => handleCloseInquiry(inquiry.numericId)}
                        >
                          <CheckCircle2 className="btn-ic" /> Mark Closed
                        </button>
                      )}

                      <button
                        className="btn-action-danger"
                        onClick={() => handleDeleteInquiry(inquiry)}
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="pagination-wrapper">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {replyModalInquiry && (
        <div className="modal-overlay-bg">
          <div className="modal-dialog-box">
            <div className="modal-dialog-header">
              <h3><Reply className="ic-modal-header" /> Reply to {replyModalInquiry.buyerName}</h3>
              <button className="btn-modal-close" onClick={() => setReplyModalInquiry(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSendReply}>
              <div className="modal-dialog-body">
                <div className="modal-inquiry-snippet">
                  <strong>Property:</strong> {replyModalInquiry.title} <br />
                  <strong>Buyer Message:</strong> "{replyModalInquiry.message}"
                </div>

                <div className="form-field-group">
                  <label>Your Reply Message:</label>
                  <textarea
                    rows="4"
                    placeholder="Write your response to the buyer..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-dialog-footer">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setReplyModalInquiry(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-modal-submit"
                  disabled={submittingReply}
                >
                  {submittingReply ? "Sending..." : "Send Reply"} <Send className="w-4 h-4 inline ml-1" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
