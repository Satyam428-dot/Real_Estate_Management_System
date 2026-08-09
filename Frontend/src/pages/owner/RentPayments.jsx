import { JAVA_BACKEND_URL } from "../../utils/config";
import { useState, useEffect } from "react";
import {
  FaSearch,
  FaRupeeSign,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaDownload,
  FaBell,
  FaPlus,
  FaTimes,
  FaSync,
} from "react-icons/fa";

import "./RentPayments.css";

export default function RentPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Get active ownerId from localStorage, default to 17 (your database owner ID!)
  const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const initialOwnerId = savedUser.id || savedUser.user_id || savedUser.userId || 17;
  const [currentOwnerId, setCurrentOwnerId] = useState(initialOwnerId);

  // Modal State for Adding New Payment
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPayment, setNewPayment] = useState({
    propertyId: 22,
    tenantId: 24,
    amount: 25000,
    dueDate: new Date().toISOString().split("T")[0],
    paymentType: "RENT",
    paymentStatus: "PAID",
    transactionId: "TXN-" + Math.floor(100000 + Math.random() * 900000),
  });

  useEffect(() => {
    fetchPayments(currentOwnerId);
  }, [currentOwnerId]);

  const fetchPayments = async (ownerId) => {
    setLoading(true);
    try {
      console.log(`Fetching payments for Owner ID: ${ownerId}`);
      const response = await fetch(`${JAVA_BACKEND_URL}/payments/owner/${ownerId}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched payments data from backend:", data);

        if (data && Array.isArray(data)) {
          const formattedData = data.map((item) => ({
            id: item.transactionId || `PAY-${item.paymentId}`,
            paymentId: item.paymentId,
            tenantName: item.tenantName || "Tenant #" + (item.tenantId || "N/A"),
            property: item.propertyTitle || "Property #" + (item.propertyId || "N/A"),
            amount: item.amount || 0,
            dueDate: item.dueDate || "N/A",
            paidDate: item.paymentDate || "-",
            method: item.paymentType || "RENT",
            status: item.paymentStatus || "PENDING",
          }));
          setPayments(formattedData);
        } else {
          setPayments([]);
        }
      } else {
        console.warn("Backend error response:", response.status);
        setPayments([]);
      }
    } catch (error) {
      console.error("Backend server error:", error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  // Submit new payment POST to Spring Boot
  const handleCreatePayment = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newPayment,
        ownerId: Number(currentOwnerId),
        amount: Number(newPayment.amount),
        propertyId: Number(newPayment.propertyId),
        tenantId: Number(newPayment.tenantId),
        paymentDate: newPayment.paymentStatus === "PAID" ? new Date().toISOString().split("T")[0] : null,
      };

      const response = await fetch(`${JAVA_BACKEND_URL}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(`New payment record saved to MySQL database for Owner ${currentOwnerId}!`);
        setShowAddModal(false);
        fetchPayments(currentOwnerId); // Refresh live
      } else {
        alert("Failed to add payment. Check Spring Boot logs.");
      }
    } catch (error) {
      alert("Error connecting to backend server.");
    }
  };

  // Filter Logic
  const filteredPayments = payments.filter((item) => {
    const matchesSearch =
      (item.tenantName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.property || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.id).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate Summary Totals
  const totalCollected = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const totalPending = payments
    .filter((p) => p.status === "PENDING")
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const totalOverdue = payments
    .filter((p) => p.status === "OVERDUE")
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  return (
    <div className="payments-page">
      {/* ===== HEADER ===== */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 className="page-title">Rent & Payments</h1>
          <p className="page-subtitle">Track rent collection, pending dues, and payment history</p>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {/* Owner ID Switcher badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#f1f5f9", padding: "6px 12px", borderRadius: "8px", fontSize: "13px" }}>
            <span style={{ color: "#64748b", fontWeight: "600" }}>Owner ID:</span>
            <input
              type="number"
              value={currentOwnerId}
              onChange={(e) => setCurrentOwnerId(Number(e.target.value))}
              style={{ width: "50px", border: "1px solid #cbd5e1", borderRadius: "4px", padding: "2px 6px", textAlign: "center", fontWeight: "700" }}
            />
            <button
              onClick={() => fetchPayments(currentOwnerId)}
              title="Refresh Payments"
              style={{ background: "none", border: "none", cursor: "pointer", color: "#1d4ed8" }}
            >
              <FaSync />
            </button>
          </div>

          <button
            className="add-payment-btn"
            onClick={() => setShowAddModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              backgroundColor: "#1d4ed8",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            <FaPlus /> Record Payment
          </button>
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
          <option value="PAID">Paid</option>
          <option value="PENDING">Pending</option>
          <option value="OVERDUE">Overdue</option>
        </select>
      </div>

      {/* ===== PAYMENTS TABLE ===== */}
      <div className="payments-table-card">
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
            Loading payments from database for Owner #{currentOwnerId}...
          </div>
        ) : (
          <table className="payments-table">
            <thead>
              <tr>
                <th>Txn ID</th>
                <th>Tenant & Property</th>
                <th>Due Date</th>
                <th>Paid Date</th>
                <th>Amount</th>
                <th>Type</th>
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
                  <td className="amount-cell">₹{(Number(item.amount) || 0).toLocaleString("en-IN")}</td>
                  <td>{item.method}</td>
                  <td>
                    <span className={`status-pill pill-${(item.status || "").toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    {item.status === "PAID" ? (
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
        )}

        {!loading && filteredPayments.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ color: "#64748b", margin: "0 0 12px 0" }}>
              No payment records found in database for Owner #{currentOwnerId}.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#1d4ed8",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              + Add First Payment Record
            </button>
          </div>
        )}
      </div>

      {/* ===== RECORD PAYMENT MODAL ===== */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "14px",
              padding: "28px",
              width: "440px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", color: "#0f172a" }}>Record New Rent Payment</h3>
              <FaTimes style={{ cursor: "pointer", color: "#94a3b8" }} onClick={() => setShowAddModal(false)} />
            </div>

            <form onSubmit={handleCreatePayment} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>Property ID</label>
                <input
                  type="number"
                  value={newPayment.propertyId}
                  onChange={(e) => setNewPayment({ ...newPayment, propertyId: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>Tenant ID</label>
                <input
                  type="number"
                  value={newPayment.tenantId}
                  onChange={(e) => setNewPayment({ ...newPayment, tenantId: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>Amount (₹)</label>
                <input
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>Payment Status</label>
                <select
                  value={newPayment.paymentStatus}
                  onChange={(e) => setNewPayment({ ...newPayment, paymentStatus: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
                >
                  <option value="PAID">PAID</option>
                  <option value="PENDING">PENDING</option>
                  <option value="OVERDUE">OVERDUE</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "none", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "10px 20px", borderRadius: "8px", border: "none", backgroundColor: "#1d4ed8", color: "#ffffff", fontWeight: "600", cursor: "pointer" }}
                >
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
