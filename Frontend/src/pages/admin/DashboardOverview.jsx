import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getLoggedInUser } from "../../utils/auth";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import "./DashboardOverview.css";

export default function DashboardOverview() {
  const navigate = useNavigate();
  const loggedInUser = getLoggedInUser();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOwners: 0,
    totalCustomers: 0,
    totalProperties: 0,
    pendingOwners: 0,
    pendingProperties: 0,
    activeListings: 0,
    disabledUsers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tracks whether the component is still mounted
  const isMounted = useRef(true);

  const fetchStats = async () => {
    try {
      setError(null);
      setLoading(true);

      const [owners, customers, properties, pendingOwners] = await Promise.all([
        // BACKEND ROUTE: GET all users with role = OWNER
        axios.get("http://localhost:8080/users/role/owners"),
        // BACKEND ROUTE: GET all users with role = CUSTOMER
        axios.get("http://localhost:8080/users/role/customers"),
        // BACKEND ROUTE: GET all properties
        axios.get("http://localhost:8080/properties"),
        // BACKEND ROUTE: GET owners awaiting approval
        axios.get("http://localhost:8080/verify/owners"),
      ]);

      if (!isMounted.current) return;

      const propData = properties.data || [];
      const ownerData = owners.data || [];
      const customerData = customers.data || [];

      setStats({
        totalUsers: ownerData.length + customerData.length,
        totalOwners: ownerData.length,
        totalCustomers: customerData.length,
        totalProperties: propData.length,
        pendingOwners: (pendingOwners.data || []).length,
        pendingProperties: propData.filter(
          (p) => (p.verificationStatus || "PENDING") === "PENDING" && !p.blacklist
        ).length,
        activeListings: propData.filter(
          (p) =>
            p.verificationStatus === "APPROVED" &&
            p.status === "AVAILABLE" &&
            !p.blacklist
        ).length,
        disabledUsers: [...ownerData, ...customerData].filter(
          (u) => u.status === false
        ).length,
      });
    } catch (err) {
      console.error(err);
      if (isMounted.current) {
        setError(
          "Couldn't load dashboard data. Check that the backend is running and try again."
        );
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    isMounted.current = true;
    fetchStats();

    const interval = setInterval(() => {
      fetchStats();
    }, 60000); // refresh every 60 seconds

    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, []);

  const roleData = [
    { name: "Owners", value: stats.totalOwners },
    { name: "Customers", value: stats.totalCustomers },
  ];
  const COLORS = ["#2d6cdf", "#17a2b8"];

  const approvalData = [
    { name: "Pending Owners", value: stats.pendingOwners },
    { name: "Pending Properties", value: stats.pendingProperties },
    { name: "Active Listings", value: stats.activeListings },
  ];

  const hasRoleData = stats.totalOwners > 0 || stats.totalCustomers > 0;
  const hasApprovalData =
    stats.pendingOwners > 0 ||
    stats.pendingProperties > 0 ||
    stats.activeListings > 0;

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: "👥",
      accent: "#2d6cdf",
    },
    {
      label: "Property Owners",
      value: stats.totalOwners,
      icon: "🏠",
      accent: "#17a2b8",
    },
    {
      label: "Customers",
      value: stats.totalCustomers,
      icon: "🧑‍💼",
      accent: "#6f42c1",
    },
    {
      label: "Total Properties",
      value: stats.totalProperties,
      icon: "🏢",
      accent: "#20c997",
    },
    {
      label: "Pending Owner Approvals",
      value: stats.pendingOwners,
      icon: "⏳",
      accent: "#ffc107",
      warn: stats.pendingOwners > 0,
    },
    {
      label: "Pending Property Approvals",
      value: stats.pendingProperties,
      icon: "📋",
      accent: "#fd7e14",
      warn: stats.pendingProperties > 0,
    },
    {
      label: "Active Listings",
      value: stats.activeListings,
      icon: "✅",
      accent: "#198754",
    },
    {
      label: "Disabled Accounts",
      value: stats.disabledUsers,
      icon: "🔒",
      accent: "#dc3545",
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">
            Welcome, {loggedInUser?.firstName} {loggedInUser?.lastName} 👋
          </h2>
          <p className="page-subtitle">
            Here's what's happening across PropertyHQ today.
          </p>
        </div>
        <button
          className="refresh-btn"
          onClick={fetchStats}
          disabled={loading}
          aria-label="Refresh dashboard data"
        >
          <span className={loading ? "refresh-icon spinning" : "refresh-icon"}>
            ⟳
          </span>
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="error-banner" role="alert">
          <span>⚠️</span>
          <span>{error}</span>
          <button className="error-retry" onClick={fetchStats}>
            Retry
          </button>
        </div>
      )}

      {/* Stat cards */}
      <div className="stats-grid">
        {cards.map((c) => (
          <div
            className={`stat-card glass-card${loading ? " is-loading" : ""}`}
            key={c.label}
            style={{ borderTopColor: c.accent }}
          >
            <div
              className="stat-icon"
              style={{ background: `${c.accent}22`, color: c.accent }}
            >
              {c.icon}
            </div>
            <div className="stat-info">
              {loading ? (
                <span className="stat-skeleton" />
              ) : (
                <span className="stat-value">{c.value}</span>
              )}
              <span className="stat-label">{c.label}</span>
            </div>
            {!loading && c.warn && (
              <span className="stat-badge">Needs Action</span>
            )}
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="charts-row">
        <div className="glass-card chart-card">
          <h3 className="card-title">User Base Breakdown</h3>
          {loading ? (
            <div className="chart-placeholder">Loading chart…</div>
          ) : hasRoleData ? (
            <>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={roleData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                  >
                    {roleData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="legend-row">
                {roleData.map((r, i) => (
                  <span key={r.name} className="legend-item">
                    <span className="dot" style={{ background: COLORS[i] }} />
                    {r.name}: {r.value}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="chart-placeholder">No user data yet.</div>
          )}
        </div>

        <div className="glass-card chart-card">
          <h3 className="card-title">Approvals &amp; Listings Snapshot</h3>
          {loading ? (
            <div className="chart-placeholder">Loading chart…</div>
          ) : hasApprovalData ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={approvalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#2d6cdf" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-placeholder">Nothing to show yet.</div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="glass-card quick-actions">
        <h3 className="card-title">Quick Actions</h3>
        <div className="quick-action-buttons">
          <button className="qa-btn" onClick={() => navigate("/admin/owners")}>
            👤 Review Pending Owners
          </button>
          <button className="qa-btn" onClick={() => navigate("/admin/properties")}>
            🏢 Review Pending Properties
          </button>
          <button className="qa-btn" onClick={() => navigate("/admin/reports")}>
            📊 View Full Reports
          </button>
          <button className="qa-btn" onClick={() => navigate("/admin/users")}>
            👥 Manage All Users
          </button>
        </div>
      </div>
    </div>
  );
}
