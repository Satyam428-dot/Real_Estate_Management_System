import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  MoreVertical,
  Headphones,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import "./MyBookings.css";

const fallbackBookingsData = [
  {
    id: "BK-240520-001",
    title: "Luxury 2BHK Apartment",
    location: "Baner, Pune",
    beds: "2 Beds",
    baths: "2 Baths",
    sqft: "1100 sq.ft",
    bookedOn: "20 May 2024",
    visitDate: "24 May 2024",
    visitTime: "11:00 AM",
    status: "Confirmed",
    amount: "₹ 1,000",
    feeLabel: "(Booking Fee)",
    actionLabel: "View Details",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
  },
];

export default function MyBookings() {
  const [activeTab, setActiveTab] = useState("All");
  const [sortBy, setSortBy] = useState("Recently Booked");
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setBookingsList(fallbackBookingsData);
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:8080/bookings/buyer", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        const mapped = response.data.map((item) => ({
          id: item.bookingCode || `BK-${item.bookingId}`,
          numericId: item.bookingId,
          title: item.propertyTitle || "Property",
          location: item.propertyLocation || "Location N/A",
          beds: item.beds ? `${item.beds} Beds` : "N/A",
          baths: item.baths ? `${item.baths} Baths` : "N/A",
          sqft: item.sqft ? `${item.sqft} sq.ft` : "N/A",
          bookedOn: item.bookedOn || "Recently",
          visitDate: item.bookingDate || "Scheduled",
          visitTime: item.bookingType ? item.bookingType.replace(/_/g, " ") : "N/A",
          status: item.status ? item.status.charAt(0) + item.status.slice(1).toLowerCase() : "Pending",
          amount: item.formattedAmount || `₹ ${item.tokenAmount || 0}`,
          feeLabel: "(Token Amount)",
          actionLabel: "View Details",
          image: item.propertyImage || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
        }));
        setBookingsList(mapped);
      } else {
        setBookingsList([]);
      }
    } catch (err) {
      console.error("Failed to fetch bookings from backend:", err);
      // Fallback to offline/mock data if unauthenticated or network error occurs
      setBookingsList(fallbackBookingsData);
    } finally {
      setLoading(false);
    }
  };

  // Calculate Summary Counts
  const confirmedCount = bookingsList.filter(
    (b) => b.status.toLowerCase() === "confirmed"
  ).length;
  const pendingCount = bookingsList.filter(
    (b) => b.status.toLowerCase() === "pending"
  ).length;
  const cancelledCount = bookingsList.filter(
    (b) => b.status.toLowerCase() === "cancelled"
  ).length;

  // Filter Bookings based on Tab Selection
  const filteredBookings = bookingsList.filter((booking) => {
    if (activeTab === "Confirmed") return booking.status.toLowerCase() === "confirmed";
    if (activeTab === "Pending") return booking.status.toLowerCase() === "pending";
    if (activeTab === "Cancelled") return booking.status.toLowerCase() === "cancelled";
    return true;
  });

  return (
    <div className="my-bookings-container">
      {/* Page Title & Subtitle */}
      <div className="bookings-header">
        <h1>My Bookings</h1>
        <p>View and manage all your property bookings.</p>
      </div>

      {/* Main Two-Column Layout */}
      <div className="bookings-layout">
        {/* Left Column: Filter Tabs & Booking Cards List */}
        <div className="bookings-main-content">
          {/* Filter Bar & Sort Controls */}
          <div className="bookings-toolbar">
            <div className="status-tabs">
              <button
                className={`tab-btn ${activeTab === "All" ? "active" : ""}`}
                onClick={() => setActiveTab("All")}
              >
                All Bookings ({bookingsList.length})
              </button>
              <button
                className={`tab-btn confirmed ${
                  activeTab === "Confirmed" ? "active" : ""
                }`}
                onClick={() => setActiveTab("Confirmed")}
              >
                <CheckCircle2 size={16} />
                Confirmed ({confirmedCount})
              </button>
              <button
                className={`tab-btn pending ${
                  activeTab === "Pending" ? "active" : ""
                }`}
                onClick={() => setActiveTab("Pending")}
              >
                <Clock size={16} />
                Pending ({pendingCount})
              </button>
              <button
                className={`tab-btn cancelled ${
                  activeTab === "Cancelled" ? "active" : ""
                }`}
                onClick={() => setActiveTab("Cancelled")}
              >
                <XCircle size={16} />
                Cancelled ({cancelledCount})
              </button>
            </div>

            <div className="sort-dropdown">
              <label>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="Recently Booked">Recently Booked</option>
                <option value="Date: Nearest">Date: Nearest</option>
                <option value="Price: High to Low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Bookings List */}
          <div className="bookings-list">
            {filteredBookings.map((booking) => (
              <div className="booking-card" key={booking.id}>
                {/* Property Thumbnail */}
                <div className="booking-img-wrapper">
                  <img src={booking.image} alt={booking.title} />
                </div>

                {/* Property Main Details */}
                <div className="booking-info">
                  <h3>{booking.title}</h3>
                  <div className="booking-location">
                    <MapPin size={14} />
                    <span>{booking.location}</span>
                  </div>

                  <div className="booking-specs">
                    <span>
                      <Bed size={14} /> {booking.beds}
                    </span>
                    <span>
                      <Bath size={14} /> {booking.baths}
                    </span>
                    <span>
                      <Maximize2 size={14} /> {booking.sqft}
                    </span>
                  </div>

                  <div className="booked-date-meta">
                    <Calendar size={14} />
                    <span>Booked on: {booking.bookedOn}</span>
                  </div>
                </div>

                {/* Booking ID & Visit Details */}
                <div className="booking-meta">
                  <div className="meta-item">
                    <span className="meta-label">Booking ID</span>
                    <span className="meta-value id-code">{booking.id}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Visit Date</span>
                    <span className="meta-value">
                      <Calendar size={13} /> {booking.visitDate}
                    </span>
                    <span className="meta-subvalue">
                      <Clock size={13} /> {booking.visitTime}
                    </span>
                  </div>
                </div>

                {/* Status, Payment & Actions */}
                <div className="booking-actions-col">
                  <span
                    className={`status-badge ${booking.status.toLowerCase()}`}
                  >
                    {booking.status}
                  </span>

                  <div className="booking-price-tag">
                    <span className="price-label">Total Amount</span>
                    <span className="price-amount">{booking.amount}</span>
                    <span className="price-sub">{booking.feeLabel}</span>
                  </div>

                  <div className="action-buttons-row">
                    <button
                      className={`btn-action ${
                        booking.status === "Pending" ? "btn-reschedule" : "btn-view"
                      }`}
                    >
                      {booking.actionLabel}
                    </button>
                    <button className="btn-icon" aria-label="More Options">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="bookings-pagination">
            <button className="page-nav" disabled>
              <ChevronLeft size={18} />
            </button>
            <button className="page-num active">1</button>
            <button className="page-nav">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Right Sidebar Widgets */}
        <div className="bookings-sidebar-widgets">
          {/* Widget 1: Booking Summary */}
          <div className="widget-card summary-widget">
            <h3>Booking Summary</h3>
            <div className="summary-list">
              <div className="summary-item">
                <div className="summary-label">
                  <CheckCircle2 size={16} className="icon-confirmed" />
                  <span>Confirmed Bookings</span>
                </div>
                <span className="summary-count confirmed">{confirmedCount}</span>
              </div>
              <div className="summary-item">
                <div className="summary-label">
                  <Clock size={16} className="icon-pending" />
                  <span>Pending Bookings</span>
                </div>
                <span className="summary-count pending">{pendingCount}</span>
              </div>
              <div className="summary-item">
                <div className="summary-label">
                  <XCircle size={16} className="icon-cancelled" />
                  <span>Cancelled Bookings</span>
                </div>
                <span className="summary-count cancelled">{cancelledCount}</span>
              </div>
              <hr />
              <div className="summary-item total-item">
                <div className="summary-label">
                  <Calendar size={16} className="icon-total" />
                  <span>Total Bookings</span>
                </div>
                <span className="summary-count total">{bookingsList.length}</span>
              </div>
            </div>
          </div>

          {/* Widget 2: Need Help */}
          <div className="widget-card help-widget">
            <h3>Need Help?</h3>
            <p>
              If you have any questions or need assistance with your bookings,
              we're here to help!
            </p>
            <button className="btn-contact-support">
              <Headphones size={16} /> Contact Support
            </button>
          </div>

          {/* Widget 3: Secure Bookings Banner */}
          <div className="widget-card secure-widget">
            <div className="secure-icon">
              <ShieldCheck size={24} />
            </div>
            <div className="secure-text">
              <h4>Secure Bookings</h4>
              <p>
                Your payments and personal information are 100% secure with{" "}
                <strong>EstateHub</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}