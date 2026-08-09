import { JAVA_BACKEND_URL } from "../../utils/config";
import { useState, useEffect } from "react";
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
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Fallback Mock Data
  const mockTenants = [
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+91 98765 43210",
      property: "Modern Apartment in Downtown (2BHK)",
      rent: "₹25,000 / mo",
      deposit: "₹75,000",
      leaseStart: "2025-01-01",
      leaseEnd: "2025-12-31",
      paymentStatus: "Paid",
      tenantStatus: "ACTIVE",
    },
    {
      id: 2,
      name: "Priya Mehta",
      email: "priya.mehta@example.com",
      phone: "+91 98123 45678",
      property: "Studio Apartment (1RK)",
      rent: "₹12,000 / mo",
      deposit: "₹36,000",
      leaseStart: "2024-03-15",
      leaseEnd: "2025-03-14",
      paymentStatus: "Pending",
      tenantStatus: "ACTIVE",
    },
    {
      id: 3,
      name: "Amit Verma",
      email: "amit.verma@example.com",
      phone: "+91 97654 32109",
      property: "Cozy 3BHK House in Suburbs",
      rent: "₹18,000 / mo",
      deposit: "₹54,000",
      leaseStart: "2024-06-01",
      leaseEnd: "2025-05-31",
      paymentStatus: "Overdue",
      tenantStatus: "ACTIVE",
    },
  ];

  // Fetch real leases from Backend API
  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      // Get logged-in user from localStorage, fallback to ownerId = 1
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const ownerId = savedUser.id || savedUser.user_id || 1;

      const response = await fetch(`${JAVA_BACKEND_URL}/leases/owner/${ownerId}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          // Transform backend DTO to match component format
          const formattedData = data.map((lease) => ({
            id: lease.leaseId,
            name: lease.tenantName || "Unknown Tenant",
            email: lease.tenantEmail || "N/A",
            phone: lease.tenantPhone || "N/A",
            property: lease.propertyTitle || "Property #" + lease.propertyId,
            rent: lease.rentAmount ? `₹${lease.rentAmount.toLocaleString()} / mo` : "N/A",
            deposit: lease.depositAmount ? `₹${lease.depositAmount.toLocaleString()}` : "N/A",
            leaseStart: lease.leaseStartDate || "N/A",
            leaseEnd: lease.leaseEndDate || "N/A",
            paymentStatus: "Paid",
            tenantStatus: lease.leaseStatus || "ACTIVE",
          }));
          setTenants(formattedData);
        } else {
          setTenants(mockTenants);
        }
      } else {
        setTenants(mockTenants);
      }
    } catch (error) {
      console.warn("Backend server offline, using fallback mock data:", error);
      setTenants(mockTenants);
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic
  const filteredTenants = tenants.filter((tenant) => {
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
            <h3 className="stat-number">{tenants.length}</h3>
          </div>
        </div>

        <div className="tenant-stat-card">
          <div className="stat-icon-box bg-green">
            <FaMoneyBillWave />
          </div>
          <div>
            <p className="stat-label">Active Leases</p>
            <h3 className="stat-number">
              {tenants.filter((t) => t.tenantStatus === "ACTIVE").length}
            </h3>
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
            <h3 className="stat-number">0</h3>
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
          <option value="ACTIVE">Active</option>
          <option value="EXPIRED">Expired</option>
          <option value="TERMINATED">Terminated</option>
        </select>
      </div>

      {/* ===== TENANTS GRID ===== */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
          Loading tenants...
        </div>
      ) : (
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
      )}
    </div>
  );
}
