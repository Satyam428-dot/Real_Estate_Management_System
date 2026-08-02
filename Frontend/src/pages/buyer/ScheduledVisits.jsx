import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Bed,
  Bath,
  Maximize,
  RotateCcw,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Headphones,
  ChevronDown,
} from "lucide-react";
import "./ScheduledVisits.css";

export default function ScheduledVisits() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [dateFilter, setDateFilter] = useState("all");

  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("http://localhost:8080/visits/buyer", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formatted = response.data.map((item) => ({
        id: item.id,
        title: item.propertyTitle || "Property Visit",
        location: `${item.propertyLocation || ""}, ${item.propertyCity || ""}`,
        status: item.status === "PENDING" ? "Upcoming" : item.status === "CONFIRMED" ? "Confirmed" : item.status === "COMPLETED" ? "Completed" : "Cancelled",
        statusType: item.status.toLowerCase(),
        date: item.visitDate,
        time: item.timeSlot,
        agent: item.ownerName || "Property Owner",
        beds: "3 Beds",
        baths: "2 Baths",
        sqft: "1200 sq.ft",
        image: item.propertyImage || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
      }));

      setVisits(formatted);
    } catch (err) {
      console.error("Failed to fetch buyer visits from backend:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelVisit = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.delete(`http://localhost:8080/visits/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setVisits((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: "Cancelled", statusType: "cancelled" }
            : item
        )
      );
      toast.success("Visit request cancelled successfully!");
    } catch (err) {
      console.error("Error cancelling visit:", err);
      toast.error("Failed to cancel visit");
    }
  };

  const upcomingCount = visits.filter((v) => v.statusType === "upcoming" || v.statusType === "pending" || v.statusType === "confirmed").length;
  const completedCount = visits.filter((v) => v.statusType === "completed").length;
  const cancelledCount = visits.filter((v) => v.statusType === "cancelled").length;

  const filteredVisits = visits.filter((item) => {
    if (activeTab === "upcoming") return item.statusType === "upcoming" || item.statusType === "pending" || item.statusType === "confirmed";
    if (activeTab === "completed") return item.statusType === "completed";
    if (activeTab === "cancelled") return item.statusType === "cancelled";
    return true;
  });

  return (
    <div className="visits-page-container">
      {/* Title Header */}
      <div className="visits-header">
        <h1>Scheduled Visits</h1>
        <p>Manage your upcoming property visits.</p>
      </div>

      {/* Main Two-Column Layout */}
      <div className="visits-main-layout">
        {/* Left Column: Filter Tabs & Visit List */}
        <div className="visits-content-left">
          {/* Filter Bar */}
          <div className="visits-filter-bar">
            <div className="status-tabs">
              <button
                className={`tab-btn ${activeTab === "upcoming" ? "active" : ""}`}
                onClick={() => setActiveTab("upcoming")}
              >
                <CalendarIcon size={16} />
                Upcoming ({upcomingCount})
              </button>
              <button
                className={`tab-btn ${activeTab === "completed" ? "active" : ""}`}
                onClick={() => setActiveTab("completed")}
              >
                <CheckCircle2 size={16} />
                Completed ({completedCount})
              </button>
              <button
                className={`tab-btn ${activeTab === "cancelled" ? "active" : ""}`}
                onClick={() => setActiveTab("cancelled")}
              >
                <XCircle size={16} />
                Cancelled ({cancelledCount})
              </button>
            </div>

            <div className="date-dropdown-wrapper">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="date-dropdown"
              >
                <option value="all">All Dates</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
              </select>
              <ChevronDown className="dropdown-icon" size={16} />
            </div>
          </div>

          {/* Visits Cards List */}
          <div className="visits-list">
            {filteredVisits.length > 0 ? (
              filteredVisits.map((visit) => (
                <div key={visit.id} className="visit-card">
                  {/* Property Image */}
                  <div className="visit-image-wrapper">
                    <img src={visit.image} alt={visit.title} />
                  </div>

                  {/* Visit Main Info */}
                  <div className="visit-info">
                    <h3 className="visit-title">{visit.title}</h3>
                    <p className="visit-location">{visit.location}</p>
                    <div className="visit-specs">
                      <span>
                        <Bed size={14} /> {visit.beds}
                      </span>
                      <span>
                        <Bath size={14} /> {visit.baths}
                      </span>
                      <span>
                        <Maximize size={14} /> {visit.sqft}
                      </span>
                    </div>
                  </div>

                  {/* Date, Time & Agent Details */}
                  <div className="visit-schedule-details">
                    <div className="schedule-item">
                      <CalendarIcon size={15} className="schedule-icon" />
                      <span>{visit.date}</span>
                    </div>
                    <div className="schedule-item">
                      <Clock size={15} className="schedule-icon" />
                      <span>{visit.time}</span>
                    </div>
                    <div className="schedule-item agent-item">
                      <User size={15} className="schedule-icon" />
                      <div>
                        <div className="agent-name">{visit.agent}</div>
                        <div className="agent-title">Property Consultant</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons & Badge */}
                  <div className="visit-actions">
                    <span className={`status-badge ${visit.statusType}`}>
                      {visit.status}
                    </span>
                    {visit.statusType === "upcoming" && (
                      <div className="action-buttons">
                        <button className="btn-reschedule">
                          <RotateCcw size={14} /> Reschedule
                        </button>
                        <button
                          className="btn-cancel"
                          onClick={() => handleCancelVisit(visit.id)}
                        >
                          <Trash2 size={14} /> Cancel Visit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-visits">No visits found in this category.</div>
            )}
          </div>
        </div>

        {/* Right Column: Calendar Overview & Help Widgets */}
        <div className="visits-sidebar-right">
          {/* Calendar Widget */}
          <div className="sidebar-card calendar-card">
            <div className="calendar-header">
              <h3>Calendar Overview</h3>
            </div>
            <div className="calendar-month-selector">
              <button className="month-nav-btn">
                <ChevronLeft size={16} />
              </button>
              <span className="current-month">May 2024</span>
              <button className="month-nav-btn">
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="calendar-grid">
              <span className="day-name">Su</span>
              <span className="day-name">Mo</span>
              <span className="day-name">Tu</span>
              <span className="day-name">We</span>
              <span className="day-name">Th</span>
              <span className="day-name">Fr</span>
              <span className="day-name">Sa</span>

              <span className="day-number muted">28</span>
              <span className="day-number muted">29</span>
              <span className="day-number muted">30</span>
              <span className="day-number">1</span>
              <span className="day-number">2</span>
              <span className="day-number">3</span>
              <span className="day-number">4</span>

              <span className="day-number">5</span>
              <span className="day-number">6</span>
              <span className="day-number">7</span>
              <span className="day-number">8</span>
              <span className="day-number">9</span>
              <span className="day-number">10</span>
              <span className="day-number">11</span>

              <span className="day-number">12</span>
              <span className="day-number">13</span>
              <span className="day-number">14</span>
              <span className="day-number">15</span>
              <span className="day-number">16</span>
              <span className="day-number has-dot">17</span>
              <span className="day-number has-dot">18</span>

              <span className="day-number">19</span>
              <span className="day-number has-dot">20</span>
              <span className="day-number has-dot">21</span>
              <span className="day-number">22</span>
              <span className="day-number has-dot">23</span>
              <span className="day-number active-date">24</span>
              <span className="day-number active-date">25</span>

              <span className="day-number">26</span>
              <span className="day-number has-dot">27</span>
              <span className="day-number active-date">28</span>
              <span className="day-number">29</span>
              <span className="day-number active-date">30</span>
              <span className="day-number">31</span>
              <span className="day-number muted">1</span>
            </div>
          </div>

          {/* Visit Summary Widget */}
          <div className="sidebar-card summary-card">
            <h3>Visit Summary</h3>
            <div className="summary-list">
              <div className="summary-item">
                <span className="summary-label">
                  <CalendarIcon size={16} className="text-blue" />
                  Upcoming Visits
                </span>
                <span className="summary-count text-blue">{upcomingCount}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">
                  <CheckCircle2 size={16} className="text-green" />
                  Completed Visits
                </span>
                <span className="summary-count text-green">{completedCount}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">
                  <XCircle size={16} className="text-red" />
                  Cancelled Visits
                </span>
                <span className="summary-count text-red">{cancelledCount}</span>
              </div>
              <div className="summary-item total-item">
                <span className="summary-label">
                  <CalendarIcon size={16} />
                  Total Visits
                </span>
                <span className="summary-count">
                  {upcomingCount + completedCount + cancelledCount}
                </span>
              </div>
            </div>
          </div>

          {/* Need Help Widget */}
          <div className="sidebar-card help-card">
            <h3>Need Help?</h3>
            <p>Our property experts are here to help you.</p>
            <button className="support-btn">
              <Headphones size={16} /> Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}