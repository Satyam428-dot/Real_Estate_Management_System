import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  CheckCircle,
  Calendar,
  Lock,
  Headphones,
  HelpCircle,
  ArrowRight,
  Info,
  Check,
} from "lucide-react";
import "./BookProperty.css";

export default function BookProperty() {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    fullName: "Abhishek Dhoran",
    email: "abhishek.dhoran@gmail.com",
    phone: "+91 98765 43210",
    bookingDate: "2024-05-25",
    bookingType: "Book Property",
    tokenAmount: "50,000",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for booking submission
    alert("Booking order placed successfully!");
    navigate("/buyer/bookings");
  };

  return (
    <div className="book-property-container">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb-nav">
        <span onClick={() => navigate("/")} className="crumb-link">
          Home
        </span>
        <span className="crumb-separator">&gt;</span>
        <span onClick={() => navigate("/buyer/browse")} className="crumb-link">
          Properties
        </span>
        <span className="crumb-separator">&gt;</span>
        <span
          onClick={() => navigate("/buyer/property-details")}
          className="crumb-link"
        >
          Luxury 3BHK Apartment
        </span>
        <span className="crumb-separator">&gt;</span>
        <span className="crumb-active">Book Property</span>
      </nav>

      {/* Main Page Title */}
      <div className="page-header-title">
        <h2>Book Property</h2>
        <p>Fill in the details below to book this property.</p>
      </div>

      {/* Top Banner: Property Card Preview Header */}
      <div className="property-banner-card">
        <div className="banner-image-wrapper">
          <img
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
            alt="Luxury 3BHK Apartment"
          />
        </div>
        <div className="banner-details">
          <div className="title-row">
            <h3>Luxury 3BHK Apartment</h3>
            <span className="verified-badge">
              <CheckCircle size={14} /> Verified Property
            </span>
          </div>
          <p className="location-text">Baner, Pune, Maharashtra</p>

          <div className="specs-pills-row">
            <span className="spec-pill">🛏️ 3 Beds</span>
            <span className="spec-pill">🛁 3 Baths</span>
            <span className="spec-pill">📐 1450 sq.ft</span>
            <span className="spec-pill">🚘 1 Parking</span>
          </div>

          <div className="price-tag-row">
            <span className="price-val">₹1,25,00,000</span>
            <span className="per-sqft-val">(₹8,620 / sq.ft)</span>
          </div>
        </div>
      </div>

      {/* Main Form & Summary Layout Grid */}
      <div className="booking-layout-grid">
        {/* Left Column: Form Section */}
        <div className="booking-form-section">
          <h3 className="section-title">Booking Details</h3>
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-row-3col">
              <div className="input-group">
                <label>
                  Full Name <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>
                  Email Address <span className="req">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>
                  Phone Number <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row-3col">
              <div className="input-group date-input-wrapper">
                <label>
                  Booking Date <span className="req">*</span>
                </label>
                <div className="relative-input">
                  <input
                    type="date"
                    name="bookingDate"
                    value={formData.bookingDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>
                  Booking Type <span className="req">*</span>
                </label>
                <select
                  name="bookingType"
                  value={formData.bookingType}
                  onChange={handleChange}
                >
                  <option value="Book Property">Book Property</option>
                  <option value="Token Payment">Token Payment</option>
                  <option value="Full Purchase Advance">Full Purchase Advance</option>
                </select>
              </div>

              <div className="input-group">
                <label>
                  Token Amount (₹) <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="tokenAmount"
                  value={formData.tokenAmount}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group full-width">
              <label>Message to Owner (Optional)</label>
              <textarea
                name="message"
                placeholder="Write a message to the property owner..."
                value={formData.message}
                onChange={handleChange}
                maxLength={500}
                rows={4}
              ></textarea>
              <span className="char-count">
                {formData.message.length}/500
              </span>
            </div>

            {/* Form Bottom Actions */}
            <div className="form-action-bar">
              <div className="security-notice-box">
                <Lock size={16} className="sec-icon" />
                <span>
                  Your information is secure and will only be shared with the
                  property owner for booking purposes.
                </span>
              </div>

              <button type="submit" className="confirm-booking-btn">
                <Lock size={16} /> Confirm Booking
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Summary Cards */}
        <div className="booking-summary-sidebar">
          {/* Booking Summary Box */}
          <div className="summary-card">
            <h4>Booking Summary</h4>
            <div className="summary-list">
              <div className="summary-item">
                <span className="lbl">Property</span>
                <span className="val bold">Luxury 3BHK Apartment</span>
              </div>
              <div className="summary-item">
                <span className="lbl">Location</span>
                <span className="val bold">Baner, Pune, Maharashtra</span>
              </div>
              <div className="summary-item">
                <span className="lbl">Price</span>
                <span className="val">₹1,25,00,000</span>
              </div>
              <div className="summary-item">
                <span className="lbl">Booking Type</span>
                <span className="val">Book Property</span>
              </div>
              <div className="summary-item">
                <span className="lbl">Booking Date</span>
                <span className="val">25 May 2024</span>
              </div>
              <div className="summary-item">
                <span className="lbl">Token Amount</span>
                <span className="val">₹50,000</span>
              </div>
            </div>

            <hr className="divider-line" />

            {/* Amount Summary Section */}
            <h4>Amount Summary</h4>
            <div className="summary-list">
              <div className="summary-item">
                <span className="lbl">Property Price</span>
                <span className="val">₹1,25,00,000</span>
              </div>
              <div className="summary-item">
                <span className="lbl">Token Amount</span>
                <span className="val">₹50,000</span>
              </div>
              <div className="summary-item total-row">
                <span className="lbl-total">Total Amount</span>
                <span className="val-total">₹50,000</span>
              </div>
            </div>

            {/* Token Info Alert */}
            <div className="token-info-alert">
              <ShieldCheck size={20} className="shield-icon" />
              <p>
                The token amount will be adjusted in the total price. Our team
                will contact you soon to complete the process.
              </p>
            </div>
          </div>

          {/* Need Help Box */}
          <div className="help-card">
            <h4>Need Help?</h4>
            <p>Our support team is here to help you.</p>
            <button
              className="contact-support-btn"
              onClick={() => alert("Connecting with support...")}
            >
              <Headphones size={16} /> Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Features Strip */}
      <div className="trust-features-strip">
        <div className="feature-trust-item">
          <div className="feature-icon-circle">
            <ShieldCheck size={20} />
          </div>
          <div className="feature-text">
            <h5>Verified Properties</h5>
            <p>All properties are verified for your safety</p>
          </div>
        </div>

        <div className="feature-trust-item">
          <div className="feature-icon-circle">
            <Lock size={20} />
          </div>
          <div className="feature-text">
            <h5>Secure & Safe</h5>
            <p>Your data is 100% secure with us</p>
          </div>
        </div>

        <div className="feature-trust-item">
          <div className="feature-icon-circle">
            <Calendar size={20} />
          </div>
          <div className="feature-text">
            <h5>Easy Booking</h5>
            <p>Book your dream property in just a few clicks</p>
          </div>
        </div>

        <div className="feature-trust-item">
          <div className="feature-icon-circle">
            <Headphones size={20} />
          </div>
          <div className="feature-text">
            <h5>24/7 Support</h5>
            <p>We're here to help you anytime</p>
          </div>
        </div>
      </div>
    </div>
  );
}