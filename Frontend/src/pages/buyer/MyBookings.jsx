import { JAVA_BACKEND_URL } from "../../utils/config";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
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
  Trash2,
  X,
  Building,
  ExternalLink,
} from "lucide-react";
import "./MyBookings.css";

const fallbackBookingsData = [
  {
    id: "BK-000001",
    numericId: 1,
    title: "Luxury 2BHK Apartment",
    location: "Baner, Pune",
    beds: "2 Beds",
    baths: "2 Baths",
    sqft: "1100 sq.ft",
    bookedOn: "2026-08-09",
    visitDate: "2026-08-15",
    visitTime: "BOOK PROPERTY",
    status: "Pending",
    amount: "₹ 50,000",
    rawAmount: 50000,
    feeLabel: "(Token Amount)",
    actionLabel: "View Details",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
  },
];

export default function MyBookings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [sortBy, setSortBy] = useState("Recently Booked");
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const itemsPerPage = 4;

  useEffect(() => {
    fetchBookings();
  }, []);

  // Reset to page 1 when tab or sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, sortBy]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setBookingsList(fallbackBookingsData);
        setLoading(false);
        return;
      }

      const response = await axios.get(`${JAVA_BACKEND_URL}/bookings/buyer`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const mapped = response.data.map((item) => ({
          id: item.bookingCode || `BK-${String(item.bookingId).padStart(6, "0")}`,
          numericId: item.bookingId,
          propertyId: item.propertyId,
          title: item.propertyTitle || "Property",
          location: item.propertyLocation || "Location N/A",
          beds: item.beds ? `${item.beds} Beds` : "N/A",
          baths: item.baths ? `${item.baths} Baths` : "N/A",
          sqft: item.sqft ? `${item.sqft} sq.ft` : "N/A",
          bookedOn: item.bookedOn || "Recently",
          visitDate: item.bookingDate || "Scheduled",
          visitTime: item.bookingType ? item.bookingType.replace(/_/g, " ") : "N/A",
          status: item.status ? item.status.charAt(0) + item.status.slice(1).toLowerCase() : "Pending",
          amount: item.formattedAmount || `₹ ${Number(item.tokenAmount || 0).toLocaleString("en-IN")}`,
          rawAmount: item.tokenAmount || 0,
          feeLabel: "(Token Amount)",
          actionLabel: "View Details",
          fullName: item.fullName,
          email: item.email,
          phone: item.phone,
          messageToOwner: item.messageToOwner,
          image: item.propertyImage || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
        }));
        setBookingsList(mapped);
      } else {
        setBookingsList([]);
      }
    } catch (err) {
      console.error("Failed to fetch bookings from backend:", err);
      setBookingsList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (booking) => {
    const targetId = booking.numericId || booking.id;
    if (!window.confirm(`Are you sure you want to cancel booking ${booking.id}?`)) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${JAVA_BACKEND_URL}/bookings/${targetId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Booking cancelled successfully!");
      setSelectedBooking(null);
      fetchBookings();
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      toast.error("Failed to cancel booking: " + (err.response?.data?.message || err.message || "Unknown error"));
    }
  };

  // Summary Counts
  const confirmedCount = bookingsList.filter(
    (b) => b.status.toLowerCase() === "confirmed"
  ).length;
  const pendingCount = bookingsList.filter(
    (b) => b.status.toLowerCase() === "pending"
  ).length;
  const cancelledCount = bookingsList.filter(
    (b) => b.status.toLowerCase() === "cancelled"
  ).length;

  // 1. Filter Bookings
  const filteredBookings = bookingsList.filter((booking) => {
    if (activeTab === "Confirmed") return booking.status.toLowerCase() === "confirmed";
    if (activeTab === "Pending") return booking.status.toLowerCase() === "pending";
    if (activeTab === "Cancelled") return booking.status.toLowerCase() === "cancelled";
    return true;
  });

  // 2. Sort Bookings
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortBy === "Price: High to Low") {
      return (b.rawAmount || 0) - (a.rawAmount || 0);
    }
    if (sortBy === "Date: Nearest") {
      return new Date(a.visitDate || 0) - new Date(b.visitDate || 0);
    }
    // Default: Recently Booked (highest numericId or newest date)
    return (b.numericId || 0) - (a.numericId || 0);
  });

  // 3. Paginate Bookings
  const totalPages = Math.ceil(sortedBookings.length / itemsPerPage) || 1;
  const paginatedBookings = sortedBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          {loading ? (
            <div className="loading-box" style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
              <div className="spinner"></div>
              <p>Loading your property bookings...</p>
            </div>
          ) : sortedBookings.length === 0 ? (
            <div className="empty-bookings-box" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "40px", textAlign: "center" }}>
              <Building size={48} style={{ color: "#94a3b8", marginBottom: "12px" }} />
              <h3 style={{ color: "#1e293b", margin: "0 0 6px 0" }}>No Bookings Found</h3>
              <p style={{ color: "#64748b", margin: 0 }}>You haven't placed any property bookings under this filter yet.</p>
            </div>
          ) : (
            <div className="bookings-list">
              {paginatedBookings.map((booking) => (
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
                      <span className="meta-label">Booking Date</span>
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
                      <span className="price-label">Token Amount</span>
                      <span className="price-amount">{booking.amount}</span>
                      <span className="price-sub">{booking.feeLabel}</span>
                    </div>

                    <div className="action-buttons-row">
                      <button
                        className="btn-action btn-view"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        View Details
                      </button>
                      {booking.status.toLowerCase() !== "cancelled" && (
                        <button
                          className="btn-icon delete-btn"
                          title="Cancel Booking"
                          onClick={() => handleCancelBooking(booking)}
                        >
                          <Trash2 size={16} color="#dc2626" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Dynamic Pagination Controls */}
          {sortedBookings.length > itemsPerPage && (
            <div className="bookings-pagination">
              <button
                className="page-nav"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                <button
                  key={page}
                  className={`page-num ${currentPage === page ? "active" : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                className="page-nav"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
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
            <button
              className="btn-contact-support"
              onClick={() => alert("Connecting with support...")}
            >
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

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="booking-modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="booking-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Booking Details</h3>
                <span className="modal-code-badge">{selectedBooking.id}</span>
              </div>
              <button className="close-btn" onClick={() => setSelectedBooking(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-prop-preview">
                <img src={selectedBooking.image} alt={selectedBooking.title} />
                <div className="modal-prop-info">
                  <h4>{selectedBooking.title}</h4>
                  <p>📍 {selectedBooking.location}</p>
                </div>
                <span className={`modal-status-badge badge-${selectedBooking.status.toLowerCase()}`}>
                  {selectedBooking.status.toUpperCase()}
                </span>
              </div>

              <div className="modal-grid-info">
                <div className="modal-info-item">
                  <span className="lbl">Booking Date: </span>
                  <span className="val">{selectedBooking.visitDate}</span>
                </div>
                <div className="modal-info-item">
                  <span className="lbl">Booking Type: </span>
                  <span className="val">{selectedBooking.visitTime}</span>
                </div>
                <div className="modal-info-item">
                  <span className="lbl">Token Amount: </span>
                  <span className="val bold-amount">{selectedBooking.amount}</span>
                </div>
                <div className="modal-info-item">
                  <span className="lbl">Status: </span>
                  <span className={`modal-status-badge badge-${selectedBooking.status.toLowerCase()}`}>
                    {selectedBooking.status.toUpperCase()}
                  </span>
                </div>
                <div className="modal-info-item">
                  <span className="lbl">Buyer Name: </span>
                  <span className="val">{selectedBooking.fullName || "N/A"}</span>
                </div>
                <div className="modal-info-item">
                  <span className="lbl">Buyer Email: </span>
                  <span className="val text-break">{selectedBooking.email || "N/A"}</span>
                </div>
                <div className="modal-info-item full-width">
                  <span className="lbl">Buyer Phone: </span>
                  <span className="val">{selectedBooking.phone || "N/A"}</span>
                </div>
              </div>

              {selectedBooking.messageToOwner && (
                <div className="modal-message-box">
                  <strong>Message to Owner:</strong>
                  <p>{selectedBooking.messageToOwner}</p>
                </div>
              )}

              <div className="modal-footer-actions">
                {selectedBooking.propertyId && (
                  <button
                    className="modal-btn btn-property-link"
                    onClick={() => {
                      const pId = selectedBooking.propertyId;
                      setSelectedBooking(null);
                      navigate(`/buyer/property-details/${pId}`);
                    }}
                  >
                    <ExternalLink size={15} /> View Property Page
                  </button>
                )}

                {selectedBooking.status.toLowerCase() !== "cancelled" && (
                  <button
                    className="modal-btn btn-modal-cancel"
                    onClick={() => handleCancelBooking(selectedBooking)}
                  >
                    <Trash2 size={15} /> Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}