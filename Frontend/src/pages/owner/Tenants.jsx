import { useState } from "react";
import {
  FaSearch,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaBuilding,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUserCheck,
  FaExclamationTriangle,
  FaClock,
} from "react-icons/fa";

import "./Tenants.css";

export default function Tenants() {

  // Mock Tenant Data
  const mockTenants = [
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+91 98765 43210",
      property: "Modern Apartment in Downtown (2BHK)",
      location: "Mumbai",
      rent: "₹25,000 / mo",
      deposit: "₹75,000",
      leaseStart: "01 Jan 2025",
      leaseEnd: "31 Dec 2025",
      paymentStatus: "Paid",
      tenantStatus: "Active",
    },
    {
      id: 2,
      name: "Priya Mehta",
      email: "priya.mehta@example.com",
      phone: "+91 98123 45678",
      property: "Studio Apartment (1RK)",
      location: "Bangalore",
      rent: "₹12,000 / mo",
      deposit: "₹36,000",
      leaseStart: "15 Mar 2024",
      leaseEnd: "14 Mar 2025",
      paymentStatus: "Pending",
      tenantStatus: "Lease Expiring Soon",
    },
    {
      id: 3,
      name: "Amit Verma",
      email: "amit.verma@example.com",
      phone: "+91 97654 32109",
      property: "Cozy 3BHK House in Suburbs",
      location: "Pune",
      rent: "₹18,000 / mo",
      deposit: "₹54,000",
      leaseStart: "01 Jun 2024",
      leaseEnd: "31 May 2025",
      paymentStatus: "Overdue",
      tenantStatus: "Active",
    },
    {
      id: 4,
      name: "Sneha Patel",
      email: "sneha.patel@example.com",
      phone: "+91 99887 76655",
      property: "Luxury Villa in Green City",
      location: "Bangalore",
      rent: "₹45,000 / mo",
      deposit: "₹1,35,000",
      leaseStart: "01 Aug 2024",
      leaseEnd: "31 Jul 2025",
      paymentStatus: "Paid",
      tenantStatus: "Active",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Filter Logic
  const filteredTenants = mockTenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.property.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || tenant.tenantStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getPaymentBadge = (status) => {
    switch (status) {
      case "Paid":
        return <span className="badge badge-paid">Paid</span>;
      case "Pending":
        return <span className="badge badge-pending">Pending</span>;
      case "Overdue":
        return <span className="badge badge-overdue">Overdue</span>;
      default:
        return null;
    }
  };

  return (
    <div className="tenants-page">

      {/* ===== HEADER ===== */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Tenants Management</h1>
          <p className="page-subtitle">View and manage all active rental agreements and tenants</p>
        </div>
      </div>

      {/* ===== STAT CARDS ===== */}
      <div className="tenant-stats-grid">
        <div className="tenant-stat-card">
          <div className="stat-icon-box bg-blue">
            <FaUserCheck />
          </div>
          <div>
            <p className="stat-label">Total Tenants</p>
            <h3 className="stat-number">4</h3>
          </div>
        </div>

        <div className="tenant-stat-card">
          <div className="stat-icon-box bg-green">
            <FaMoneyBillWave />
          </div>
          <div>
            <p className="stat-label">Paid This Month</p>
            <h3 className="stat-number">2</h3>
          </div>
        </div>

        <div className="tenant-stat-card">
          <div className="stat-icon-box bg-yellow">
            <FaClock />
          </div>
          <div>
            <p className="stat-label">Pending Payments</p>
            <h3 className="stat-number">1</h3>
          </div>
        </div>

        <div className="tenant-stat-card">
          <div className="stat-icon-box bg-red">
            <FaExclamationTriangle />
          </div>
          <div>
            <p className="stat-label">Overdue Payments</p>
            <h3 className="stat-number">1</h3>
          </div>
        </div>
      </div>

      {/* ===== SEARCH & FILTER ===== */}
      <div className="filter-bar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search tenant name or property..."
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
          <option value="Active">Active</option>
          <option value="Lease Expiring Soon">Lease Expiring Soon</option>
        </select>
      </div>

      {/* ===== TENANTS GRID ===== */}
      <div className="tenants-grid">
        {filteredTenants.map((tenant) => (
          <div className="tenant-card" key={tenant.id}>
            
            {/* Card Header */}
            <div className="tenant-card-header">
              <div className="tenant-avatar">
                <FaUser />
              </div>
              <div className="tenant-main-info">
                <h3 className="tenant-name">{tenant.name}</h3>
                <span className="tenant-status-pill">{tenant.tenantStatus}</span>
              </div>
              {getPaymentBadge(tenant.paymentStatus)}
            </div>

            {/* Card Body */}
            <div className="tenant-card-body">
              
              <div className="tenant-detail-row">
                <FaBuilding className="detail-icon" />
                <span>{tenant.property}</span>
              </div>

              <div className="tenant-detail-row">
                <FaPhone className="detail-icon" />
                <span>{tenant.phone}</span>
              </div>

              <div className="tenant-detail-row">
                <FaEnvelope className="detail-icon" />
                <span>{tenant.email}</span>
              </div>

              <div className="tenant-meta-grid">
                <div className="meta-box">
                  <span className="meta-label">Monthly Rent</span>
                  <span className="meta-value text-blue">{tenant.rent}</span>
                </div>

                <div className="meta-box">
                  <span className="meta-label">Deposit</span>
                  <span className="meta-value">{tenant.deposit}</span>
                </div>
              </div>

              <div className="lease-dates">
                <FaCalendarAlt className="detail-icon" />
                <span>Lease: {tenant.leaseStart} — {tenant.leaseEnd}</span>
              </div>

            </div>

            {/* Card Footer Actions */}
            <div className="tenant-card-footer">
              <button className="btn-secondary">Message</button>
              <button className="btn-primary">View Agreement</button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
