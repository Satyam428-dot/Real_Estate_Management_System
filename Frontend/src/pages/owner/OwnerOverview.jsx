import { useState, useEffect } from "react";
import {
  FaHome,
  FaKey,
  FaRupeeSign,
  FaUsers,
  FaMoneyBillWave,
  FaWrench,
  FaBuilding,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

// Recharts components for the two charts
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

import "./OwnerOverview.css";

export default function OwnerOverview() {
  const [statsData, setStatsData] = useState({
    totalProperties: 12,
    rentedProperties: 8,
    totalRentCollected: 125000,
    totalTenants: 10,
  });

  const [recentProperties, setRecentProperties] = useState([
    {
      name: "Modern Apartment in Downtown",
      type: "2BHK",
      location: "Downtown, Mumbai",
      price: "₹25,000 / month",
      status: "RENTED",
      statusColor: "#22c55e",
    },
    {
      name: "Luxury Villa in Green City",
      type: "4BHK",
      location: "Green City, Bangalore",
      price: "₹4,50,00,000",
      status: "FOR SALE",
      statusColor: "#8b5cf6",
    },
    {
      name: "Studio Apartment",
      type: "1BHK",
      location: "Suburbs, Pune",
      price: "₹12,000 / month",
      status: "RENTED",
      statusColor: "#22c55e",
    },
    {
      name: "Cozy 3BHK House",
      type: "3BHK",
      location: "Suburbs, Delhi",
      price: "₹18,000 / month",
      status: "VACANT",
      statusColor: "#3b82f6",
    },
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const ownerId = savedUser.id || savedUser.user_id || 17;

      // 1. Fetch properties
      const propsRes = await fetch("http://localhost:8080/properties");
      if (propsRes.ok) {
        const allProps = await propsRes.json();
        if (allProps && allProps.length > 0) {
          const rentedCount = allProps.filter((p) => p.status === "RENTED").length;
          setStatsData((prev) => ({
            ...prev,
            totalProperties: allProps.length,
            rentedProperties: rentedCount || prev.rentedProperties,
          }));

          const mappedRecent = allProps.slice(0, 4).map((p) => ({
            name: p.title || "Property",
            type: `${p.bedrooms || 2}BHK`,
            location: `${p.city || ""}, ${p.state || ""}`,
            price: `₹${Number(p.price || 0).toLocaleString("en-IN")}`,
            status: p.status || "AVAILABLE",
            statusColor: p.status === "RENTED" ? "#22c55e" : p.status === "AVAILABLE" ? "#3b82f6" : "#8b5cf6",
          }));
          setRecentProperties(mappedRecent);
        }
      }

      // 2. Fetch leases
      const leasesRes = await fetch(`http://localhost:8080/leases/owner/${ownerId}`);
      if (leasesRes.ok) {
        const ownerLeases = await leasesRes.json();
        if (ownerLeases && ownerLeases.length > 0) {
          setStatsData((prev) => ({
            ...prev,
            totalTenants: ownerLeases.length,
          }));
        }
      }

      // 3. Fetch rent payments
      const paymentsRes = await fetch(`http://localhost:8080/payments/owner/${ownerId}`);
      if (paymentsRes.ok) {
        const ownerPayments = await paymentsRes.json();
        if (ownerPayments && ownerPayments.length > 0) {
          const totalPaid = ownerPayments
            .filter((p) => p.paymentStatus === "PAID")
            .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

          if (totalPaid > 0) {
            setStatsData((prev) => ({
              ...prev,
              totalRentCollected: totalPaid,
            }));
          }
        }
      }
    } catch (error) {
      console.warn("Backend offline, original dashboard active:", error);
    }
  };

  // ===== STAT CARDS DATA =====
  const stats = [
    {
      icon: <FaHome />,
      value: statsData.totalProperties.toString(),
      title: "Total Properties",
      subtitle: "All your properties",
      color: "#3b82f6",
      bgColor: "#eff6ff",
    },
    {
      icon: <FaKey />,
      value: statsData.rentedProperties.toString(),
      title: "Rented Properties",
      subtitle: "Currently rented",
      color: "#22c55e",
      bgColor: "#f0fdf4",
    },
    {
      icon: <FaRupeeSign />,
      value: `₹${statsData.totalRentCollected.toLocaleString("en-IN")}`,
      title: "Monthly Rent",
      subtitle: "Total this month",
      color: "#f59e0b",
      bgColor: "#fffbeb",
    },
    {
      icon: <FaUsers />,
      value: statsData.totalTenants.toString(),
      title: "Total Tenants",
      subtitle: "Across all properties",
      color: "#8b5cf6",
      bgColor: "#f5f3ff",
    },
  ];

  // ===== LINE CHART DATA (Rent Collection) =====
  const rentData = [
    { date: "1 Jun",  collected: 20000,  pending: 15000 },
    { date: "5 Jun",  collected: 45000,  pending: 25000 },
    { date: "10 Jun", collected: 60000,  pending: 35000 },
    { date: "15 Jun", collected: 80000,  pending: 50000 },
    { date: "20 Jun", collected: 110000, pending: 60000 },
    { date: "25 Jun", collected: 125000, pending: 55000 },
    { date: "30 Jun", collected: 125000, pending: 50000 },
  ];

  // ===== PIE/DONUT CHART DATA (Property Status) =====
  const propertyStatusData = [
    { name: "Rented",   value: statsData.rentedProperties, color: "#22c55e" },
    { name: "Vacant",   value: Math.max(0, statsData.totalProperties - statsData.rentedProperties - 2), color: "#3b82f6" },
    { name: "For Rent", value: 1, color: "#f59e0b" },
    { name: "For Sale", value: 1, color: "#8b5cf6" },
  ];

  const totalPropsCount = propertyStatusData.reduce(
    (sum, item) => sum + item.value, 0
  );

  // ===== RECENT ACTIVITIES DATA =====
  const recentActivities = [
    {
      icon: <FaMoneyBillWave />,
      iconBg: "#f0fdf4",
      iconColor: "#22c55e",
      title: "Rent Received",
      detail: "Rahul Sharma · Modern Apartment",
      amount: "+₹25,000",
      time: "2 hours ago",
    },
    {
      icon: <FaWrench />,
      iconBg: "#fffbe6",
      iconColor: "#f59e0b",
      title: "Maintenance Request",
      detail: "Priya Mehta · Studio Apartment (Plumbing)",
      amount: "",
      time: "5 hours ago",
    },
    {
      icon: <FaUsers />,
      iconBg: "#eff6ff",
      iconColor: "#3b82f6",
      title: "New Tenant Added",
      detail: "Amit Verma · Cozy 3BHK House",
      amount: "",
      time: "1 day ago",
    },
    {
      icon: <FaMoneyBillWave />,
      iconBg: "#f0fdf4",
      iconColor: "#22c55e",
      title: "Rent Received",
      detail: "Sneha Patel · Luxury Villa",
      amount: "+₹45,000",
      time: "2 days ago",
    },
  ];

  return (
    <div className="owner-overview">

      {/* ===== WELCOME SECTION ===== */}
      <div className="welcome-section">
        <h1 className="welcome-title">Dashboard Overview</h1>
        <p className="welcome-subtitle">
          Welcome back! Here is what's happening with your properties today.
        </p>
      </div>

      {/* ===== STAT CARDS ROW ===== */}
      <div className="stats-row">
        {stats.map((stat, idx) => (
          <div className="stat-card" key={idx}>
            <div
              className="stat-icon-box"
              style={{ backgroundColor: stat.bgColor, color: stat.color }}
            >
              {stat.icon}
            </div>
            <div className="stat-info">
              <span className="stat-title">{stat.title}</span>
              <h2 className="stat-value">{stat.value}</h2>
              <span className="stat-subtitle">{stat.subtitle}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ===== CHARTS ROW ===== */}
      <div className="charts-row">

        {/* LINE CHART: Rent Collection Trend */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Rent Collection Trend</h3>
            <select className="chart-dropdown">
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 6 Months</option>
            </select>
          </div>

          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={rentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  formatter={(val) => [`₹${val.toLocaleString("en-IN")}`, ""]}
                />
                <Line
                  type="monotone"
                  dataKey="collected"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="pending"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  strokeDasharray="4 4"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: "#3b82f6" }} />
              Collected Rent
            </span>
            <span className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: "#f59e0b" }} />
              Pending Rent
            </span>
          </div>
        </div>

        {/* DONUT CHART: Property Status */}
        <div className="chart-card status-chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Property Status</h3>
          </div>

          <div className="donut-wrapper">
            <div style={{ width: "100%", height: 180 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={propertyStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {propertyStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="donut-center-label">
              <span className="donut-total">{totalPropsCount}</span>
              <span className="donut-total-text">Total</span>
            </div>
          </div>

          <div className="status-legend">
            {propertyStatusData.map((item, idx) => (
              <div className="status-legend-item" key={idx}>
                <span
                  className="legend-dot"
                  style={{ backgroundColor: item.color }}
                />
                <span className="status-legend-name">{item.name}</span>
                <span className="status-legend-value">{item.value} properties</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ===== BOTTOM ROW ===== */}
      <div className="bottom-row">

        {/* RECENT PROPERTIES */}
        <div className="recent-card">
          <div className="recent-header">
            <h3 className="recent-title">Recent Properties</h3>
            <NavLink to="/owner/properties" className="view-all-link">
              View All
            </NavLink>
          </div>

          <div className="recent-properties-list">
            {recentProperties.map((prop, idx) => (
              <div className="property-row" key={idx}>
                <div className="property-thumb">
                  <FaBuilding />
                </div>
                <div className="property-details">
                  <h4 className="property-name">{prop.name}</h4>
                  <p className="property-meta">
                    {prop.type} · {prop.location}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className="property-price">{prop.price}</span>
                  <div>
                    <span
                      className="property-status-badge"
                      style={{
                        backgroundColor: prop.statusColor + "20",
                        color: prop.statusColor,
                      }}
                    >
                      {prop.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ACTIVITIES */}
        <div className="recent-card">
          <div className="recent-header">
            <h3 className="recent-title">Recent Activity</h3>
            <span className="view-all-link" style={{ cursor: "pointer" }}>
              View All
            </span>
          </div>

          <div className="recent-activities-list">
            {recentActivities.map((act, idx) => (
              <div className="activity-row" key={idx}>
                <div
                  className="activity-icon-box"
                  style={{
                    backgroundColor: act.iconBg,
                    color: act.iconColor,
                  }}
                >
                  {act.icon}
                </div>
                <div className="activity-info">
                  <h4 className="activity-text">{act.title}</h4>
                  <p className="activity-detail">{act.detail}</p>
                </div>
                <div className="activity-right">
                  {act.amount && (
                    <span className="activity-amount">{act.amount}</span>
                  )}
                  <span className="activity-time">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
