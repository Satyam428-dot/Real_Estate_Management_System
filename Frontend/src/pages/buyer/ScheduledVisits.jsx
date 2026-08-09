import { JAVA_BACKEND_URL } from "../../utils/config";
import React, { useState, useEffect, useMemo } from "react";
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

  // Real-time Calendar States
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(`${JAVA_BACKEND_URL}/visits/buyer`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formatted = response.data.map((item) => ({
        id: item.id,
        title: item.propertyTitle || "Property Visit",
        location: `${item.propertyLocation || ""}, ${item.propertyCity || ""}`,
        status:
          item.status === "PENDING"
            ? "Upcoming"
            : item.status === "CONFIRMED"
            ? "Confirmed"
            : item.status === "COMPLETED"
            ? "Completed"
            : "Cancelled",
        statusType: (item.status || "").toLowerCase(),
        date: item.visitDate,
        time: item.timeSlot,
        agent: item.ownerName || "Property Owner",
        beds: "3 Beds",
        baths: "2 Baths",
        sqft: "1200 sq.ft",
        image:
          item.propertyImage ||
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
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
        await axios.delete(`${JAVA_BACKEND_URL}/visits/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setVisits((prev) => prev.filter((item) => item.id !== id));
      toast.success("Scheduled visit cancelled and removed successfully!");
    } catch (err) {
      console.error("Error cancelling visit:", err);
      toast.error(
        "Failed to cancel visit: " +
          (err.response?.data?.message || err.message || "Unknown error occurred.")
      );
    }
  };

  // Calendar Navigation Handlers
  const handlePrevMonth = () => {
    setCurrentCalendarDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentCalendarDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const handleTodayClick = () => {
    const today = new Date();
    setCurrentCalendarDate(today);
    const todayStr = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    setSelectedCalendarDate(todayStr);
  };

  // Real-Time Calendar Calculations
  const currentMonthName = currentCalendarDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const calendarCells = useMemo(() => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const todayObj = new Date();
    const todayStr = `${todayObj.getFullYear()}-${String(
      todayObj.getMonth() + 1
    ).padStart(2, "0")}-${String(todayObj.getDate()).padStart(2, "0")}`;

    const cells = [];

    // Trailing days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      cells.push({
        dayNum,
        isCurrentMonth: false,
        dateStr: "",
      });
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const monthStr = String(month + 1).padStart(2, "0");
      const dayStr = String(d).padStart(2, "0");
      const dateStr = `${year}-${monthStr}-${dayStr}`;

      const dayVisits = visits.filter((v) => {
        if (!v.date) return false;
        return v.date.includes(dateStr) || v.date === dateStr;
      });

      cells.push({
        dayNum: d,
        isCurrentMonth: true,
        dateStr,
        isToday: dateStr === todayStr,
        isSelected: dateStr === selectedCalendarDate,
        hasEvent: dayVisits.length > 0,
        hasUpcoming: dayVisits.some(
          (v) =>
            v.statusType === "upcoming" ||
            v.statusType === "pending" ||
            v.statusType === "confirmed"
        ),
        hasCompleted: dayVisits.some((v) => v.statusType === "completed"),
        eventCount: dayVisits.length,
      });
    }

    // Leading days for next month to complete 35 or 42 slots
    const totalSlots = cells.length > 35 ? 42 : 35;
    const remaining = totalSlots - cells.length;
    for (let d = 1; d <= remaining; d++) {
      cells.push({
        dayNum: d,
        isCurrentMonth: false,
        dateStr: "",
      });
    }

    return cells;
  }, [currentCalendarDate, visits, selectedCalendarDate]);

  const upcomingCount = visits.filter(
    (v) =>
      v.statusType === "upcoming" ||
      v.statusType === "pending" ||
      v.statusType === "confirmed"
  ).length;
  const completedCount = visits.filter((v) => v.statusType === "completed").length;
  const cancelledCount = visits.filter((v) => v.statusType === "cancelled").length;

  const filteredVisits = visits.filter((item) => {
    if (
      activeTab === "upcoming" &&
      !(
        item.statusType === "upcoming" ||
        item.statusType === "pending" ||
        item.statusType === "confirmed"
      )
    )
      return false;
    if (activeTab === "completed" && item.statusType !== "completed")
      return false;
    if (activeTab === "cancelled" && item.statusType !== "cancelled")
      return false;

    // Filter by real-time calendar date selection
    if (selectedCalendarDate) {
      if (!item.date || !item.date.includes(selectedCalendarDate)) {
        return false;
      }
    }

    // Filter by dropdown selection (All / This Week / This Month)
    if (dateFilter === "this-week") {
      if (item.date) {
        const vDate = new Date(item.date);
        const now = new Date();
        const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const lastDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
        if (vDate < firstDayOfWeek || vDate > lastDayOfWeek) return false;
      }
    } else if (dateFilter === "this-month") {
      if (item.date) {
        const vDate = new Date(item.date);
        const now = new Date();
        if (
          vDate.getMonth() !== now.getMonth() ||
          vDate.getFullYear() !== now.getFullYear()
        ) {
          return false;
        }
      }
    }

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

          {selectedCalendarDate && (
            <div className="active-date-banner">
              <span>
                Showing visits for{" "}
                <strong>
                  {new Date(selectedCalendarDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </strong>
              </span>
              <button
                className="clear-date-banner-btn"
                onClick={() => setSelectedCalendarDate(null)}
              >
                Show All Dates
              </button>
            </div>
          )}

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
                    {visit.statusType !== "cancelled" && (
                      <div className="action-buttons">
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
              <button
                className="today-pill-btn"
                onClick={handleTodayClick}
                title="Go to Today"
              >
                Today
              </button>
            </div>
            <div className="calendar-month-selector">
              <button
                className="month-nav-btn"
                onClick={handlePrevMonth}
                title="Previous Month"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="current-month">{currentMonthName}</span>
              <button
                className="month-nav-btn"
                onClick={handleNextMonth}
                title="Next Month"
              >
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

              {calendarCells.map((cell, idx) => (
                <span
                  key={idx}
                  className={`day-number ${
                    !cell.isCurrentMonth ? "muted" : ""
                  } ${cell.isToday ? "today-date" : ""} ${
                    cell.isSelected ? "selected-date" : ""
                  } ${cell.hasEvent ? "has-dot" : ""} ${
                    cell.hasUpcoming ? "dot-upcoming" : ""
                  } ${cell.hasCompleted ? "dot-completed" : ""}`}
                  onClick={() => {
                    if (cell.isCurrentMonth && cell.dateStr) {
                      setSelectedCalendarDate((prev) =>
                        prev === cell.dateStr ? null : cell.dateStr
                      );
                    }
                  }}
                  title={
                    cell.hasEvent
                      ? `${cell.eventCount} visit(s) on ${cell.dateStr}`
                      : cell.dateStr
                  }
                >
                  {cell.dayNum}
                </span>
              ))}
            </div>

            {selectedCalendarDate && (
              <div className="calendar-filter-indicator">
                <span>Filter: {selectedCalendarDate}</span>
                <button
                  onClick={() => setSelectedCalendarDate(null)}
                  className="clear-cal-filter"
                >
                  Clear Filter
                </button>
              </div>
            )}
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