import React, { useState } from "react";
import {
  FaSearch,
  FaTag,
  FaHandHoldingUsd,
  FaCheckCircle,
  FaClock,
  FaBuilding,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
} from "react-icons/fa";

import "./Sales.css";

export default function Sales() {
  // Mock Sales & Buyer Offers Data
  const [offers, setOffers] = useState([
    {
      id: "OFF-301",
      buyerName: "Vikramaditya Roy",
      email: "vikram.roy@example.com",
      phone: "+91 98111 22334",
      property: "Luxury Villa in Green City",
      listingPrice: "₹4,50,00,000",
      offeredPrice: "₹4,25,00,000",
      offerDate: "22 Jul 2025",
      status: "Offer Received",
    },
    {
      id: "OFF-302",
      buyerName: "Ananya Deshmukh",
      email: "ananya.d@example.com",
      phone: "+91 97222 33445",
      property: "Premium Penthouse with Sea View",
      listingPrice: "₹8,50,00,000",
      offeredPrice: "₹8,50,00,000",
      offerDate: "20 Jul 2025",
      status: "Under Negotiation",
    },
    {
      id: "OFF-303",
      buyerName: "Karan Malhotra",
      email: "karan.m@example.com",
      phone: "+91 96333 44556",
      property: "Luxury Villa in Green City",
      listingPrice: "₹4,50,00,000",
      offeredPrice: "₹4,40,00,000",
      offerDate: "15 Jul 2025",
      status: "Accepted",
    },
    {
      id: "OFF-304",
      buyerName: "Siddharth Joshi",
      email: "siddharth.j@example.com",
      phone: "+91 95444 55667",
      property: "Commercial Plot near Highway",
      listingPrice: "₹2,10,00,000",
      offeredPrice: "₹1,80,00,000",
      offerDate: "10 Jul 2025",
      status: "Rejected",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Filter Logic
  const filteredOffers = offers.filter((item) => {
    const matchesSearch =
      item.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle Offer Status Action
  const handleStatusChange = (id, newStatus) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
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
            Manage inquiries, price negotiations, and sales agreements for listed properties
          </p>
        </div>
      </div>

      {/* ===== STAT CARDS ===== */}
      <div className="s-stats-grid">
        <div className="s-stat-card">
          <div className="stat-icon-box bg-blue">
            <FaTag />
          </div>
          <div>
            <p className="stat-label">Properties for Sale</p>
            <h3 className="stat-number">2</h3>
          </div>
        </div>

        <div className="s-stat-card">
          <div className="stat-icon-box bg-purple">
            <FaHandHoldingUsd />
          </div>
          <div>
            <p className="stat-label">Total Offers Received</p>
            <h3 className="stat-number">{totalOffers}</h3>
          </div>
        </div>

        <div className="s-stat-card">
          <div className="stat-icon-box bg-yellow">
            <FaClock />
          </div>
          <div>
            <p className="stat-label">Active Negotiations</p>
            <h3 className="stat-number">{activeNegotiations}</h3>
          </div>
        </div>

        <div className="s-stat-card">
          <div className="stat-icon-box bg-green">
            <FaCheckCircle />
          </div>
          <div>
            <p className="stat-label">Deals Accepted</p>
            <h3 className="stat-number">{acceptedCount}</h3>
          </div>
        </div>
      </div>

      {/* ===== FILTERS ===== */}
      <div className="filter-bar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by buyer name, property, or offer ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Offer Statuses</option>
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
            {/* Top Bar */}
            <div className="offer-card-top">
              <div className="offer-id-box">
                <span className="offer-id">{item.id}</span>
                <span className="date-info">
                  <FaCalendarAlt className="date-icon" /> {item.offerDate}
                </span>
              </div>
              {getStatusBadge(item.status)}
            </div>

            {/* Buyer & Property Info */}
            <div className="offer-main-info">
              <h3 className="property-name">{item.property}</h3>
              
              <div className="contact-details">
                <div className="contact-item">
                  <FaUser className="c-icon" />
                  <span>{item.buyerName}</span>
                </div>
                <div className="contact-item">
                  <FaPhone className="c-icon" />
                  <span>{item.phone}</span>
                </div>
                <div className="contact-item">
                  <FaEnvelope className="c-icon" />
                  <span>{item.email}</span>
                </div>
              </div>
            </div>

            {/* Price Breakdown Box */}
            <div className="price-comparison-box">
              <div className="price-col">
                <span className="price-label">Listing Price</span>
                <span className="price-value original-price">{item.listingPrice}</span>
              </div>

              <div className="price-divider">➔</div>

              <div className="price-col">
                <span className="price-label">Offered Price</span>
                <span className="price-value offer-price">{item.offeredPrice}</span>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="offer-card-actions">
              {item.status !== "Accepted" && item.status !== "Rejected" ? (
                <>
                  <button
                    className="btn-action btn-accept"
                    onClick={() => handleStatusChange(item.id, "Accepted")}
                  >
                    Accept Offer
                  </button>
                  <button
                    className="btn-action btn-negotiate"
                    onClick={() => handleStatusChange(item.id, "Under Negotiation")}
                  >
                    Negotiate
                  </button>
                  <button
                    className="btn-action btn-reject"
                    onClick={() => handleStatusChange(item.id, "Rejected")}
                  >
                    Reject
                  </button>
                </>
              ) : (
                <div className="action-closed-text">
                  Status marked as <strong>{item.status}</strong>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredOffers.length === 0 && (
          <div className="empty-state">
            <FaTag className="empty-icon" />
            <p>No buyer offers match your filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}