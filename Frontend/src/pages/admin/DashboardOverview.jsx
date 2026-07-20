import { useEffect, useState } from "react";
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

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [owners, customers, properties, pendingOwners, pendingProps] =
        await Promise.all([
          axios.get("http://localhost:8080/users/role/owners"),
          axios.get("http://localhost:8080/users/role/customers"),
          axios.get("http://localhost:8080/properties"),
          axios.get("http://localhost:8080/owners/pending"),
          axios.get("http://localhost:8080/properties/pending"),
        ]);

      setStats({
        totalUsers: owners.data.length + customers.data.length,
        totalOwners: owners.data.length,
        totalCustomers: customers.data.length,
        totalProperties: properties.data.length,
        pendingOwners: pendingOwners.data.length,
        pendingProperties: pendingProps.data.length,
        activeListings: properties.data.filter((p) => p.status === "ACTIVE")
          .length,
        disabledUsers: [...owners.data, ...customers.data].filter(
          (u) => u.disabled,
        ).length,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
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
      <h2 className="page-title">Welcome, Admin</h2>
      <p className="page-subtitle">
        Here's what's happening across PropertyHQ today.
      </p>

      {/* Stat cards */}
      <div className="stats-grid">
        {cards.map((c) => (
          <div
            className="stat-card glass-card"
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
              <span className="stat-value">{loading ? "…" : c.value}</span>
              <span className="stat-label">{c.label}</span>
            </div>
            {c.warn && <span className="stat-badge">Needs Action</span>}
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="charts-row">
        <div className="glass-card chart-card">
          <h3 className="card-title">User Base Breakdown</h3>
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
        </div>

        <div className="glass-card chart-card">
          <h3 className="card-title">Approvals & Listings Snapshot</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={approvalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#2d6cdf" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick actions */}
      <div className="glass-card quick-actions">
        <h3 className="card-title">Quick Actions</h3>
        <div className="action-buttons">
          <button className="qa-btn qa-primary">
            👤 Review Pending Owners
          </button>
          <button className="qa-btn qa-primary">
            🏢 Review Pending Properties
          </button>
          <button className="qa-btn qa-secondary">📊 View Full Reports</button>
          <button className="qa-btn qa-secondary">👥 Manage All Users</button>
        </div>
      </div>
    </div>
  );
}
