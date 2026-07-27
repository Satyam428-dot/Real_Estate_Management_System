import React, { useState } from "react";
import {
  FaSearch,
  FaWrench,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBuilding,
  FaUser,
  FaCalendarAlt,
  FaTools,
} from "react-icons/fa";

import "./Maintenance.css";

export default function Maintenance() {
  // Mock Maintenance Requests Data
  const [requests, setRequests] = useState([
    {
      id: "REQ-501",
      title: "Plumbing Leakage in Master Bathroom",
      category: "Plumbing",
      priority: "High",
      tenantName: "Rahul Sharma",
      property: "Modern Apartment in Downtown (2BHK)",
      unit: "Apt 402",
      reportedDate: "20 Jul 2025",
      status: "Pending",
      description: "Water leaking under the sink pipe continuously.",
    },
    {
      id: "REQ-502",
      title: "AC Not Cooling Properly",
      category: "Appliance",
      priority: "Medium",
      tenantName: "Priya Mehta",
      property: "Studio Apartment (1RK)",
      unit: "Apt 105",
      reportedDate: "18 Jul 2025",
      status: "In Progress",
      description: "Air conditioner blowing warm air. Servicing required.",
    },
    {
      id: "REQ-503",
      title: "Main Door Lock Jammed",
      category: "Carpentry",
      priority: "Urgent",
      tenantName: "Amit Verma",
      property: "Cozy 3BHK House in Suburbs",
      unit: "House #12",
      reportedDate: "21 Jul 2025",
      status: "Pending",
      description: "Key getting stuck in the deadbolt lock. Hard to open.",
    },
    {
      id: "REQ-504",
      title: "Geyser Power Socket Sparking",
      category: "Electrical",
      priority: "Urgent",
      tenantName: "Sneha Patel",
      property: "Luxury Villa in Green City",
      unit: "Villa 8B",
      reportedDate: "12 Jul 2025",
      status: "Completed",
      description: "Bathroom geyser switch board replaced safely.",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // Filter Logic
  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || req.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" || req.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Handle Status Update
  const handleStatusChange = (id, newStatus) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  // Helper Badge Renderers
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "Urgent":
        return <span className="p-badge p-urgent">Urgent</span>;
      case "High":
        return <span className="p-badge p-high">High</span>;
      case "Medium":
        return <span className="p-badge p-medium">Medium</span>;
      default:
        return <span className="p-badge p-low">Low</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return <span className="s-badge s-completed">Completed</span>;
      case "In Progress":
        return <span className="s-badge s-progress">In Progress</span>;
      default:
        return <span className="s-badge s-pending">Pending</span>;
    }
  };

  // Stat Counters
  const totalReqs = requests.length;
  const pendingCount = requests.filter((r) => r.status === "Pending").length;
  const progressCount = requests.filter((r) => r.status === "In Progress").length;
  const completedCount = requests.filter((r) => r.status === "Completed").length;

  return (
    <div className="maintenance-page">
      {/* ===== HEADER ===== */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Maintenance Requests</h1>
          <p className="page-subtitle">
            Track and manage property repair tickets reported by tenants
          </p>
        </div>
      </div>

      {/* ===== STAT CARDS ===== */}
      <div className="m-stats-grid">
        <div className="m-stat-card">
          <div className="stat-icon-box bg-blue">
            <FaTools />
          </div>
          <div>
            <p className="stat-label">Total Requests</p>
            <h3 className="stat-number">{totalReqs}</h3>
          </div>
        </div>

        <div className="m-stat-card">
          <div className="stat-icon-box bg-yellow">
            <FaClock />
          </div>
          <div>
            <p className="stat-label">Pending</p>
            <h3 className="stat-number">{pendingCount}</h3>
          </div>
        </div>

        <div className="m-stat-card">
          <div className="stat-icon-box bg-purple">
            <FaWrench />
          </div>
          <div>
            <p className="stat-label">In Progress</p>
            <h3 className="stat-number">{progressCount}</h3>
          </div>
        </div>

        <div className="m-stat-card">
          <div className="stat-icon-box bg-green">
            <FaCheckCircle />
          </div>
          <div>
            <p className="stat-label">Completed</p>
            <h3 className="stat-number">{completedCount}</h3>
          </div>
        </div>
      </div>

      {/* ===== FILTERS ===== */}
      <div className="filter-bar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search ticket title, tenant, or property..."
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
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          className="filter-select"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="All">All Priorities</option>
          <option value="Urgent">Urgent</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
        </select>
      </div>

      {/* ===== REQUESTS CARDS LIST ===== */}
      <div className="requests-list">
        {filteredRequests.map((req) => (
          <div className="req-card" key={req.id}>
            <div className="req-card-top">
              <div className="req-id-box">
                <span className="req-id">{req.id}</span>
                <span className="category-pill">{req.category}</span>
                {getPriorityBadge(req.priority)}
              </div>
              {getStatusBadge(req.status)}
            </div>

            <div className="req-card-mid">
              <h3 className="req-title">{req.title}</h3>
              <p className="req-desc">{req.description}</p>
            </div>

            <div className="req-meta-row">
              <div className="meta-item">
                <FaUser className="m-icon" />
                <span>{req.tenantName} ({req.unit})</span>
              </div>
              <div className="meta-item">
                <FaBuilding className="m-icon" />
                <span>{req.property}</span>
              </div>
              <div className="meta-item">
                <FaCalendarAlt className="m-icon" />
                <span>Reported: {req.reportedDate}</span>
              </div>
            </div>

            <div className="req-card-bottom">
              <span className="status-label">Update Status:</span>
              <div className="status-actions">
                <button
                  className={`status-btn ${req.status === "Pending" ? "active-pending" : ""}`}
                  onClick={() => handleStatusChange(req.id, "Pending")}
                >
                  Pending
                </button>
                <button
                  className={`status-btn ${req.status === "In Progress" ? "active-progress" : ""}`}
                  onClick={() => handleStatusChange(req.id, "In Progress")}
                >
                  In Progress
                </button>
                <button
                  className={`status-btn ${req.status === "Completed" ? "active-completed" : ""}`}
                  onClick={() => handleStatusChange(req.id, "Completed")}
                >
                  Completed
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredRequests.length === 0 && (
          <div className="empty-state">
            <FaTools className="empty-icon" />
            <p>No maintenance requests match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}