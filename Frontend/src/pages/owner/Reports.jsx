import React, { useState } from "react";
import {
  FaChartBar,
  FaRupeeSign,
  FaBuilding,
  FaPercentage,
  FaDownload,
  FaCalendarAlt,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import "./Reports.css";

export default function Reports() {
  const [timeRange, setTimeRange] = useState("6months");

  // Monthly Revenue Data (Bar Chart)
  const revenueData = [
    { month: "Jan", rentCollected: 110000, maintenanceCost: 15000 },
    { month: "Feb", rentCollected: 125000, maintenanceCost: 8000 },
    { month: "Mar", rentCollected: 120000, maintenanceCost: 22000 },
    { month: "Apr", rentCollected: 135000, maintenanceCost: 12000 },
    { month: "May", rentCollected: 125000, maintenanceCost: 5000 },
    { month: "Jun", rentCollected: 140000, maintenanceCost: 18000 },
  ];

  // Property Type Distribution (Pie Chart)
  const typeData = [
    { name: "Flats & Apartments", value: 6, color: "#3b82f6" },
    { name: "Villas", value: 3, color: "#8b5cf6" },
    { name: "Houses", value: 2, color: "#22c55e" },
    { name: "Commercial Shops", value: 1, color: "#f59e0b" },
  ];

  // Summary Table Data
  const propertyPerformance = [
    {
      name: "Modern Apartment in Downtown",
      type: "Flat",
      rent: "₹25,000 / mo",
      occupancy: "100%",
      revenueYTD: "₹1,50,000",
      status: "Rented",
    },
    {
      name: "Luxury Villa in Green City",
      type: "Villa",
      rent: "₹45,000 / mo",
      occupancy: "100%",
      revenueYTD: "₹2,70,000",
      status: "Rented",
    },
    {
      name: "Studio Apartment",
      type: "Flat",
      rent: "₹12,000 / mo",
      occupancy: "100%",
      revenueYTD: "₹72,000",
      status: "Rented",
    },
    {
      name: "Cozy 3BHK House in Suburbs",
      type: "House",
      rent: "₹18,000 / mo",
      occupancy: "80%",
      revenueYTD: "₹1,08,000",
      status: "Rented",
    },
    {
      name: "Commercial Shop at Main Road",
      type: "Commercial",
      rent: "₹35,000 / mo",
      occupancy: "0%",
      revenueYTD: "₹70,000",
      status: "Vacant",
    },
  ];

  return (
    <div className="reports-page">
      {/* ===== HEADER ===== */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">
            Financial performance, rental yield, and occupancy reports for your portfolio
          </p>
        </div>

        <div className="header-actions">
          <select
            className="time-select"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="6months">Last 6 Months</option>
            <option value="1year">This Year (2025)</option>
            <option value="all">All Time</option>
          </select>

          <button className="export-btn">
            <FaDownload /> Export Report (PDF)
          </button>
        </div>
      </div>

      {/* ===== STAT CARDS ===== */}
      <div className="r-stats-grid">
        <div className="r-stat-card">
          <div className="stat-icon-box bg-green">
            <FaRupeeSign />
          </div>
          <div>
            <p className="stat-label">Total Revenue (YTD)</p>
            <h3 className="stat-number">₹7,55,000</h3>
          </div>
        </div>

        <div className="r-stat-card">
          <div className="stat-icon-box bg-blue">
            <FaPercentage />
          </div>
          <div>
            <p className="stat-label">Average Occupancy Rate</p>
            <h3 className="stat-number">83.3%</h3>
          </div>
        </div>

        <div className="r-stat-card">
          <div className="stat-icon-box bg-purple">
            <FaBuilding />
          </div>
          <div>
            <p className="stat-label">Total Portfolio Units</p>
            <h3 className="stat-number">12 Units</h3>
          </div>
        </div>

        <div className="r-stat-card">
          <div className="stat-icon-box bg-yellow">
            <FaChartBar />
          </div>
          <div>
            <p className="stat-label">Avg. Monthly Yield</p>
            <h3 className="stat-number">₹1,25,833</h3>
          </div>
        </div>
      </div>

      {/* ===== CHARTS ROW ===== */}
      <div className="charts-row">
        {/* Revenue vs Expense Bar Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Monthly Revenue vs Maintenance Costs</h3>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <Tooltip
                formatter={(val) => `₹${val.toLocaleString("en-IN")}`}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Bar dataKey="rentCollected" name="Rent Collected" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="maintenanceCost" name="Maintenance Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: "#22c55e" }}></span> Rent Collected
            </span>
            <span className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: "#ef4444" }}></span> Maintenance Expense
            </span>
          </div>
        </div>

        {/* Portfolio Distribution Pie Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Property Asset Types</h3>
          </div>

          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {typeData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val, name) => [`${val} Units`, name]}
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="pie-legend">
            {typeData.map((item, idx) => (
              <div className="pie-legend-item" key={idx}>
                <span className="legend-dot" style={{ backgroundColor: item.color }}></span>
                <span className="pie-legend-name">{item.name}</span>
                <span className="pie-legend-val">{item.value} Units</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== PERFORMANCE TABLE ===== */}
      <div className="table-card">
        <h3 className="table-title">Individual Property Performance</h3>

        <table className="performance-table">
          <thead>
            <tr>
              <th>Property Name</th>
              <th>Asset Type</th>
              <th>Monthly Rent</th>
              <th>Occupancy</th>
              <th>YTD Earnings</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {propertyPerformance.map((row, idx) => (
              <tr key={idx}>
                <td className="prop-name-cell">{row.name}</td>
                <td>{row.type}</td>
                <td>{row.rent}</td>
                <td>
                  <div className="occupancy-box">
                    <div className="occupancy-bar-bg">
                      <div
                        className="occupancy-bar-fill"
                        style={{ width: row.occupancy }}
                      ></div>
                    </div>
                    <span>{row.occupancy}</span>
                  </div>
                </td>
                <td className="revenue-cell">{row.revenueYTD}</td>
                <td>
                  <span
                    className={`status-pill ${
                      row.status === "Rented" ? "status-rented" : "status-vacant"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}