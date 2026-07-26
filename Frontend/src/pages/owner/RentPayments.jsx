import { useState } from "react";
import {
  FaSearch,
  FaRupeeSign,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaDownload,
  FaBell,
} from "react-icons/fa";

import "./RentPayments.css";

export default function RentPayments() {

  // Mock Payments Data
  const mockPayments = [
    {
      id: "PAY-1001",
      tenantName: "Rahul Sharma",
      property: "Modern Apartment in Downtown",
      amount: 25000,
      dueDate: "05 Jul 2025",
      paidDate: "04 Jul 2025",
      method: "UPI (Google Pay)",
      status: "Paid",
    },
    {
      id: "PAY-1002",
      tenantName: "Priya Mehta",
      property: "Studio Apartment",
      amount: 12000,
      dueDate: "05 Jul 2025",
      paidDate: "05 Jul 2025",
      method: "Bank Transfer (NEFT)",
      status: "Paid",
    },
    {
      id: "PAY-1003",
      tenantName: "Amit Verma",
      property: "Cozy 3BHK House in Suburbs",
      amount: 18000,
      dueDate: "05 Jul 2025",
      paidDate: "-",
      method: "-",
      status: "Overdue",
    },
    {
      id: "PAY-1004",
      tenantName: "Sneha Patel",
      property: "Luxury Villa in Green City",
      amount: 45000,
      dueDate: "10 Jul 2025",
      paidDate: "-",
      method: "-",
      status: "Pending",
    },
    {
      id: "PAY-1005",
      tenantName: "Vikram Singh",
      property: "Commercial Shop at Main Road",
      amount: 35000,
      dueDate: "01 Jun 2025",
      paidDate: "01 Jun 2025",
      method: "Cheque",
      status: "Paid",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Filter Logic
  const filteredPayments = mockPayments.filter((item) => {
    const matchesSearch =
      item.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate Summary Totals
  const totalCollected = mockPayments
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = mockPayments
    .filter((p) => p.status === "Pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalOverdue = mockPayments
    .filter((p) => p.status === "Overdue")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="payments-page">

      {/* ===== HEADER ===== */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Rent & Payments</h1>
          <p className="page-subtitle">Track rent collection, pending dues, and payment history</p>
        </div>
      </div>

      {/* ===== STAT CARDS ===== */}
      <div className="payments-stats-grid">
        <div className="payment-stat-card">
          <div className="stat-icon-box bg-green">
            <FaCheckCircle />
          </div>
          <div>
            <p className="stat-label">Collected This Month</p>
            <h3 className="stat-number">₹{totalCollected.toLocaleString("en-IN")}</h3>
          </div>
        </div>

        <div className="payment-stat-card">
          <div className="stat-icon-box bg-yellow">
            <FaClock />
          </div>
          <div>
            <p className="stat-label">Pending Rent</p>
            <h3 className="stat-number">₹{totalPending.toLocaleString("en-IN")}</h3>
          </div>
        </div>

        <div className="payment-stat-card">
          <div className="stat-icon-box bg-red">
            <FaExclamationCircle />
          </div>
          <div>
            <p className="stat-label">Overdue Amount</p>
            <h3 className="stat-number">₹{totalOverdue.toLocaleString("en-IN")}</h3>
          </div>
        </div>

        <div className="payment-stat-card">
          <div className="stat-icon-box bg-blue">
            <FaRupeeSign />
          </div>
          <div>
            <p className="stat-label">Total Expected Rent</p>
            <h3 className="stat-number">
              ₹{(totalCollected + totalPending + totalOverdue).toLocaleString("en-IN")}
            </h3>
          </div>
        </div>
      </div>

      {/* ===== SEARCH & FILTER ===== */}
      <div className="filter-bar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by tenant, property, or Txn ID..."
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
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      {/* ===== PAYMENTS TABLE ===== */}
      <div className="payments-table-card">
        <table className="payments-table">
          <thead>
            <tr>
              <th>Txn ID</th>
              <th>Tenant & Property</th>
              <th>Due Date</th>
              <th>Paid Date</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((item) => (
              <tr key={item.id}>
                <td className="txn-id">{item.id}</td>
                <td>
                  <div className="tenant-cell">
                    <span className="tenant-name">{item.tenantName}</span>
                    <span className="property-sub">{item.property}</span>
                  </div>
                </td>
                <td>{item.dueDate}</td>
                <td>{item.paidDate}</td>
                <td className="amount-cell">₹{item.amount.toLocaleString("en-IN")}</td>
                <td>{item.method}</td>
                <td>
                  <span className={`status-pill pill-${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  {item.status === "Paid" ? (
                    <button className="action-btn download-btn" title="Download Receipt">
                      <FaDownload /> Receipt
                    </button>
                  ) : (
                    <button className="action-btn remind-btn" title="Send Payment Reminder">
                      <FaBell /> Remind
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPayments.length === 0 && (
          <div className="empty-payments">
            <p>No payment records found matching your filter.</p>
          </div>
        )}
      </div>

    </div>
  );
}
