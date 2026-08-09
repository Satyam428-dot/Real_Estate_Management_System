import { JAVA_BACKEND_URL } from "../../utils/config";
import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaTag,
  FaHandHoldingUsd,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
} from "react-icons/fa";

import "./Sales.css";

export default function Sales() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Original Mock Sales Data (Fallback)
  const mockOffers = [
    {
      id: "OFF-301",
      offerId: 1,
      buyerName: "Vikramaditya Roy",
      email: "vikram.roy@example.com",
      phone: "+91 98111 22334",
      property: "Luxury Villa in Green City",
      listingPrice: "₹4,50,00,000",
      offeredPrice: "₹4,25,00,000",
      offerDate: "22 Jul 2025",
      status: "Offer Received",
      counterPrice: null,
    },
    {
      id: "OFF-302",
      offerId: 2,
      buyerName: "Ananya Deshmukh",
      email: "ananya.d@example.com",
      phone: "+91 97222 33445",
      property: "Premium Penthouse with Sea View",
      listingPrice: "₹8,50,00,000",
      offeredPrice: "₹8,50,00,000",
      offerDate: "20 Jul 2025",
      status: "Under Negotiation",
      counterPrice: "₹8,60,00,000",
    },
    {
      id: "OFF-303",
      offerId: 3,
      buyerName: "Karan Malhotra",
      email: "karan.m@example.com",
      phone: "+91 96333 44556",
      property: "Luxury Villa in Green City",
      listingPrice: "₹4,50,00,000",
      offeredPrice: "₹4,40,00,000",
      offerDate: "15 Jul 2025",
      status: "Accepted",
      counterPrice: null,
    },
  ];

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const ownerId = savedUser.id || savedUser.user_id || 17;

      const response = await fetch(`${JAVA_BACKEND_URL}/sales-offers/owner/${ownerId}`);
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data) && data.length > 0) {
          const formattedData = data.map((item) => ({
            id: `OFF-${item.offerId}`,
            offerId: item.offerId,
            buyerName: item.buyerName || `Buyer #${item.buyerId}`,
            email: item.buyerEmail || "N/A",
            phone: item.buyerPhone || "N/A",
            property: item.propertyTitle || `Property #${item.propertyId}`,
            listingPrice: item.propertyPrice ? `₹${Number(item.propertyPrice).toLocaleString("en-IN")}` : "N/A",
            offeredPrice: `₹${Number(item.offerPrice || 0).toLocaleString("en-IN")}`,
            counterPrice: item.counterPrice ? `₹${Number(item.counterPrice).toLocaleString("en-IN")}` : null,
            offerDate: item.offerDate || "N/A",
            status: item.offerStatus === "ACCEPTED" ? "Accepted" : item.offerStatus === "REJECTED" ? "Rejected" : item.offerStatus === "COUNTERED" ? "Under Negotiation" : "Offer Received",
          }));
          setOffers(formattedData);
        } else {
          setOffers(mockOffers);
        }
      } else {
        setOffers(mockOffers);
      }
    } catch (error) {
      console.warn("Backend offline, using fallback mock data:", error);
      setOffers(mockOffers);
    } finally {
      setLoading(false);
    }
  };

  // Handle Accept/Reject Offer Action with API call
  const handleStatusChange = async (offerId, displayStatus, apiStatus, counterAmount = null) => {
    try {
      const bodyPayload = { status: apiStatus };
      if (counterAmount) {
        bodyPayload.counterPrice = counterAmount;
      }

      const response = await fetch(`${JAVA_BACKEND_URL}/sales-offers/${offerId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      if (response.ok) {
        alert(`Offer updated to ${displayStatus}${counterAmount ? ` with Counter Price ₹${counterAmount.toLocaleString('en-IN')}` : ''}!`);
        fetchOffers();
      } else {
        setOffers((prev) =>
          prev.map((o) => (o.offerId === offerId ? { 
            ...o, 
            status: displayStatus,
            counterPrice: counterAmount ? `₹${Number(counterAmount).toLocaleString('en-IN')}` : o.counterPrice 
          } : o))
        );
      }
    } catch (error) {
      setOffers((prev) =>
        prev.map((o) => (o.offerId === offerId ? { 
          ...o, 
          status: displayStatus,
          counterPrice: counterAmount ? `₹${Number(counterAmount).toLocaleString('en-IN')}` : o.counterPrice 
        } : o))
      );
    }
  };

  // Negotiate Counter Offer Action
  const handleNegotiateClick = (offerId) => {
    const input = prompt("Enter your Counter Price offer (in ₹):", "4350000");
    if (input && !isNaN(input)) {
      handleStatusChange(offerId, "Under Negotiation", "COUNTERED", Number(input));
    }
  };

  // Helper Badge Renderer
  const getStatusBadge = (status) => {
    switch (status) {
      case "Accepted":
        return <span className="status-badge s-accepted">Accepted</span>;
      case "Under Negotiation":
        return <span className="status-badge s-negotiation">In Negotiation</span>;
      case "Rejected":
        return <span className="status-badge s-rejected">Rejected</span>;
      default:
        return <span className="status-badge s-received">Offer Received</span>;
    }
  };

  // Filter Logic
  const filteredOffers = offers.filter((item) => {
    const matchesSearch =
      (item.buyerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.property || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.id).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Stat Counters
  const totalOffers = offers.length;
  const activeNegotiations = offers.filter(
    (o) => o.status === "Offer Received" || o.status === "Under Negotiation"
  ).length;
  const acceptedCount = offers.filter((o) => o.status === "Accepted").length;

  return (
    <div className="sales-page">

      {/* ===== HEADER ===== */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Sales & Buyer Offers</h1>
          <p className="page-subtitle">
            Manage purchase inquiries, price negotiations, and sales agreements for listed properties
          </p>
        </div>
      </div>

      {/* ===== STAT CARDS GRID ===== */}
      <div className="s-stats-grid">
        <div className="s-stat-card">
          <div className="stat-icon-box bg-blue">
            <FaTag />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Received Offers</span>
            <h3 className="stat-number">{totalOffers}</h3>
          </div>
        </div>

        <div className="s-stat-card">
          <div className="stat-icon-box bg-yellow">
            <FaClock />
          </div>
          <div className="stat-info">
            <span className="stat-label">Active Negotiations</span>
            <h3 className="stat-number">{activeNegotiations}</h3>
          </div>
        </div>

        <div className="s-stat-card">
          <div className="stat-icon-box bg-green">
            <FaCheckCircle />
          </div>
          <div className="stat-info">
            <span className="stat-label">Offers Accepted</span>
            <h3 className="stat-number">{acceptedCount}</h3>
          </div>
        </div>
      </div>

      {/* ===== SEARCH & FILTER ===== */}
      <div className="filter-bar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by buyer name, property, or Offer ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Offer Received">Offer Received</option>
          <option value="Under Negotiation">Under Negotiation</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* ===== OFFERS GRID ===== */}
      <div className="offers-grid">
        {filteredOffers.map((item) => (
          <div className="offer-card" key={item.id}>
            
            {/* Top row: ID, Date, Status */}
            <div className="offer-card-top">
              <div className="offer-id-box">
                <span className="offer-id">{item.id}</span>
                <span className="date-info">
                  <FaCalendarAlt /> {item.offerDate}
                </span>
              </div>
              {getStatusBadge(item.status)}
            </div>

            {/* Main Info: Property & Buyer Details */}
            <div className="offer-main-info">
              <h3 className="property-name">{item.property}</h3>

              <div className="contact-details">
                <div className="contact-item">
                  <FaUser className="c-icon" />
                  <span>{item.buyerName}</span>
                </div>
                <div className="contact-item">
                  <FaEnvelope className="c-icon" />
                  <span>{item.email}</span>
                </div>
                <div className="contact-item">
                  <FaPhone className="c-icon" />
                  <span>{item.phone}</span>
                </div>
              </div>
            </div>

            {/* Price Comparison Box */}
            <div className="price-comparison-box">
              <div className="price-col">
                <span className="price-label">Listing Price</span>
                <span className="price-value original-price">
                  {item.listingPrice}
                </span>
              </div>
              <span className="price-divider">➔</span>
              <div className="price-col">
                <span className="price-label">
                  {item.counterPrice ? "Counter Offer" : "Offered Price"}
                </span>
                <span className="price-value offer-price">
                  {item.counterPrice || item.offeredPrice}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="offer-card-actions">
              {item.status === "Accepted" || item.status === "Rejected" ? (
                <span className="action-closed-text">
                  Status: <strong>{item.status}</strong>
                </span>
              ) : (
                <>
                  <button
                    className="btn-action btn-accept"
                    onClick={() => handleStatusChange(item.offerId, "Accepted", "ACCEPTED")}
                  >
                    Accept Offer
                  </button>
                  <button
                    className="btn-action btn-negotiate"
                    onClick={() => handleNegotiateClick(item.offerId)}
                  >
                    Negotiate
                  </button>
                  <button
                    className="btn-action btn-reject"
                    onClick={() => handleStatusChange(item.offerId, "Rejected", "REJECTED")}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>

          </div>
        ))}

        {filteredOffers.length === 0 && (
          <div className="empty-state">
            <FaHandHoldingUsd className="empty-icon" />
            <p>No buyer offers found matching your filter.</p>
          </div>
        )}
      </div>

    </div>
  );
}