import React, { useState } from "react";
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
  MoreVertical,
} from "lucide-react";
import "./MyInquiries.css";

const inquiriesData = [
  {
    id: "ENQ-240520-001",
    title: "Luxury 2BHK Apartment",
    location: "Baner, Pune",
    price: "₹ 28,000 / month",
    sqft: "1100 sq.ft",
    beds: "2 Beds",
    baths: "2 Baths",
    enquiredOn: "20 May 2024",
    lastUpdate: "21 May 2024, 10:45 AM",
    status: "Replied",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "ENQ-240518-002",
    title: "Elegant Villa",
    location: "Kothrud, Pune",
    price: "₹ 1,35,00,000",
    sqft: "2800 sq.ft",
    beds: "4 Beds",
    baths: "4 Baths",
    enquiredOn: "18 May 2024",
    lastUpdate: "18 May 2024, 04:20 PM",
    status: "Awaiting Response",
    image:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "ENQ-240515-003",
    title: "Modern 3BHK Apartment",
    location: "Hinjewadi, Pune",
    price: "₹ 72,00,000",
    sqft: "1450 sq.ft",
    beds: "3 Beds",
    baths: "3 Baths",
    enquiredOn: "15 May 2024",
    lastUpdate: "16 May 2024, 09:15 AM",
    status: "Replied",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "ENQ-240510-004",
    title: "Spacious 1BHK Apartment",
    location: "Wakad, Pune",
    price: "₹ 16,000 / month",
    sqft: "650 sq.ft",
    beds: "1 Bed",
    baths: "1 Bath",
    enquiredOn: "10 May 2024",
    lastUpdate: "10 May 2024, 02:30 PM",
    status: "Awaiting Response",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "ENQ-240508-005",
    title: "Furnished 3BHK Apartment",
    location: "Viman Nagar, Pune",
    price: "₹ 35,000 / month",
    sqft: "1600 sq.ft",
    beds: "3 Beds",
    baths: "3 Baths",
    enquiredOn: "08 May 2024",
    lastUpdate: "09 May 2024, 11:05 AM",
    status: "Replied",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
  },
];

export default function MyInquiries() {
  const [activeTab, setActiveTab] = useState("All");
  const [sortBy, setSortBy] = useState("Latest");

  // Summary counts
  const repliedCount = inquiriesData.filter(
    (item) => item.status === "Replied"
  ).length;
  const awaitingCount = inquiriesData.filter(
    (item) => item.status === "Awaiting Response"
  ).length;
  const closedCount = inquiriesData.filter(
    (item) => item.status === "Closed"
  ).length;

  // Filter list
  const filteredInquiries = inquiriesData.filter((item) => {
    if (activeTab === "Replied") return item.status === "Replied";
    if (activeTab === "Awaiting Response")
      return item.status === "Awaiting Response";
    if (activeTab === "Closed") return item.status === "Closed";
    return true;
  });

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
                All Inquiries ({inquiriesData.length})
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
          <div className="inquiries-list">
            {filteredInquiries.map((inquiry) => (
              <div className="inquiry-card" key={inquiry.id}>
                {/* Thumbnail */}
                <div className="inquiry-img-wrapper">
                  <img src={inquiry.image} alt={inquiry.title} />
                </div>

                {/* Info Details */}
                <div className="inquiry-info">
                  <h3>{inquiry.title}</h3>
                  <p className="inquiry-location">{inquiry.location}</p>

                  <div className="inquiry-specs-row">
                    <span className="inquiry-price">{inquiry.price}</span>
                    <span className="dot">•</span>
                    <span>{inquiry.sqft}</span>
                    <span className="dot">•</span>
                    <span>{inquiry.beds}</span>
                    <span className="dot">•</span>
                    <span>{inquiry.baths}</span>
                  </div>

                  <div className="inquiry-meta-foot">
                    <span>Enquiry ID: {inquiry.id}</span>
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
                        inquiry.status === "Awaiting Response"
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
                    <button className="btn-conversation">
                      View Conversation
                    </button>
                    <button className="btn-more-options" aria-label="More">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="inquiries-pagination">
            <button className="page-nav" disabled>
              <ChevronLeft size={18} />
            </button>
            <button className="page-num active">1</button>
            <button className="page-num">2</button>
            <button className="page-nav">
              <ChevronRight size={18} />
            </button>
          </div>
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
                  {inquiriesData.length}
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
    </div>
  );
}