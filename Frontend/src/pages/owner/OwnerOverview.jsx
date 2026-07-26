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
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

import "./OwnerOverview.css";

export default function OwnerOverview() {

  // ===== STAT CARDS DATA =====
  const stats = [
    {
      icon: <FaHome />,
      value: "12",
      title: "Total Properties",
      subtitle: "All your properties",
      color: "#3b82f6",
      bgColor: "#eff6ff",
    },
    {
      icon: <FaKey />,
      value: "8",
      title: "Rented Properties",
      subtitle: "Currently rented",
      color: "#22c55e",
      bgColor: "#f0fdf4",
    },
    {
      icon: <FaRupeeSign />,
      value: "₹1,25,000",
      title: "Monthly Rent",
      subtitle: "Total this month",
      color: "#f59e0b",
      bgColor: "#fffbeb",
    },
    {
      icon: <FaUsers />,
      value: "10",
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
    { name: "Rented",   value: 8, color: "#22c55e" },
    { name: "Vacant",   value: 2, color: "#3b82f6" },
    { name: "For Rent", value: 1, color: "#f59e0b" },
    { name: "For Sale", value: 1, color: "#8b5cf6" },
  ];

  const totalProperties = propertyStatusData.reduce(
    (sum, item) => sum + item.value, 0
  );

  // ===== RECENT PROPERTIES DATA =====
  const recentProperties = [
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
      type: "1RK",
      location: "Electronic City, Bangalore",
      price: "₹12,000 / month",
      status: "RENTED",
      statusColor: "#22c55e",
    },
    {
      name: "Commercial Shop at Main Road",
      type: "500 sq.ft",
      location: "Main Road, Pune",
      price: "₹35,000 / month",
      status: "VACANT",
      statusColor: "#3b82f6",
    },
  ];

  // ===== RECENT ACTIVITIES DATA =====
  const recentActivities = [
    {
      icon: <FaMoneyBillWave />,
      iconColor: "#22c55e",
      iconBg: "#f0fdf4",
      text: "Rent received from Rahul Sharma",
      detail: "Property: Modern Apartment in Downtown",
      amount: "₹25,000",
      time: "2 hours ago",
    },
    {
      icon: <FaWrench />,
      iconColor: "#f59e0b",
      iconBg: "#fffbeb",
      text: "New maintenance request received",
      detail: "Property: Luxury Villa in Green City",
      amount: "",
      time: "5 hours ago",
    },
    {
      icon: <FaMoneyBillWave />,
      iconColor: "#22c55e",
      iconBg: "#f0fdf4",
      text: "Rent received from Priya Mehta",
      detail: "Property: Studio Apartment",
      amount: "₹12,000",
      time: "1 day ago",
    },
    {
      icon: <FaBuilding />,
      iconColor: "#3b82f6",
      iconBg: "#eff6ff",
      text: "Property \"Commercial Shop\" marked as vacant",
      detail: "",
      amount: "",
      time: "1 day ago",
    },
  ];

  return (
    <div className="owner-overview">

      {/* ===== WELCOME HEADER ===== */}
      <div className="welcome-section">
        <h1 className="welcome-title">Welcome back, John Owner 👋</h1>
        <p className="welcome-subtitle">
          Here's what's happening with your properties today.
        </p>
      </div>

      {/* ===== STAT CARDS ROW ===== */}
      <div className="stats-row">
        {stats.map((stat, index) => (
          <div className="stat-card" key={index}>
            <div
              className="stat-icon-box"
              style={{ backgroundColor: stat.bgColor, color: stat.color }}
            >
              {stat.icon}
            </div>
            <div className="stat-info">
              <p className="stat-title">{stat.title}</p>
              <h2 className="stat-value">{stat.value}</h2>
              <p className="stat-subtitle">{stat.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ===== CHARTS ROW ===== */}
      <div className="charts-row">

        {/* LEFT: Rent Collection Line Chart */}
        <div className="chart-card rent-chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Rent Collection Overview</h3>
            <select className="chart-dropdown">
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={rentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <Tooltip
                formatter={(value) => `₹${value.toLocaleString()}`}
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
              />
              <Line
                type="monotone"
                dataKey="collected"
                stroke="#22c55e"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#22c55e" }}
                name="Collected"
              />
              <Line
                type="monotone"
                dataKey="pending"
                stroke="#3b82f6"
                strokeWidth={2.5}
                strokeDasharray="6 4"
                dot={{ r: 4, fill: "#3b82f6" }}
                name="Pending"
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Legend below chart */}
          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: "#22c55e" }}></span>
              Collected
            </span>
            <span className="legend-item">
              <span className="legend-dot legend-dot-dashed" style={{ backgroundColor: "#3b82f6" }}></span>
              Pending
            </span>
          </div>
        </div>

        {/* RIGHT: Property Status Donut Chart */}
        <div className="chart-card status-chart-card">
          <h3 className="chart-title">Property Status</h3>

          <div className="donut-wrapper">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={propertyStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {propertyStatusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value}`, name]}
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center label inside donut hole */}
            <div className="donut-center-label">
              <span className="donut-total">{totalProperties}</span>
              <span className="donut-total-text">Total</span>
            </div>
          </div>

          {/* Status Legend */}
          <div className="status-legend">
            {propertyStatusData.map((item, index) => (
              <div className="status-legend-item" key={index}>
                <span className="legend-dot" style={{ backgroundColor: item.color }}></span>
                <span className="status-legend-name">{item.name}</span>
                <span className="status-legend-value">
                  {item.value} ({((item.value / totalProperties) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ===== BOTTOM ROW: Recent Properties + Recent Activities ===== */}
      <div className="bottom-row">

        {/* LEFT: Recent Properties */}
        <div className="recent-card">
          <div className="recent-header">
            <h3 className="recent-title">Recent Properties</h3>
            <NavLink to="/owner/properties" className="view-all-link">
              View All Properties
            </NavLink>
          </div>

          <div className="recent-properties-list">
            {recentProperties.map((property, index) => (
              <div className="property-row" key={index}>
                {/* Property thumbnail placeholder */}
                <div className="property-thumb">
                  <FaBuilding />
                </div>

                <div className="property-details">
                  <p className="property-name">{property.name}</p>
                  <p className="property-meta">{property.type} · {property.location}</p>
                </div>

                <div className="property-price">{property.price}</div>

                <span
                  className="property-status-badge"
                  style={{ backgroundColor: property.statusColor + "18", color: property.statusColor }}
                >
                  {property.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Recent Activities */}
        <div className="recent-card">
          <div className="recent-header">
            <h3 className="recent-title">Recent Activities</h3>
            <span className="view-all-link" style={{ cursor: "pointer" }}>View All</span>
          </div>

          <div className="recent-activities-list">
            {recentActivities.map((activity, index) => (
              <div className="activity-row" key={index}>
                <div
                  className="activity-icon-box"
                  style={{ backgroundColor: activity.iconBg, color: activity.iconColor }}
                >
                  {activity.icon}
                </div>

                <div className="activity-info">
                  <p className="activity-text">{activity.text}</p>
                  {activity.detail && (
                    <p className="activity-detail">{activity.detail}</p>
                  )}
                </div>

                <div className="activity-right">
                  {activity.amount && (
                    <span className="activity-amount">{activity.amount}</span>
                  )}
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
