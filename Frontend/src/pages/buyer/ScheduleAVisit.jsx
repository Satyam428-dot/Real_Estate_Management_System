import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Calendar,
  Lock,
  Clock,
  Info,
  ShieldCheck,
  UserCheck,
  Headphones,
  CheckCircle,
} from "lucide-react";
import "./ScheduleAVisit.css";

export default function ScheduleAVisit() {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    fullName: "Abhishek Dhoran",
    email: "abhishek.dhoran@gmail.com",
    phone: "+91 98765 43210",
    visitDate: "2024-05-27",
    timeSlot: "11:00 AM - 01:00 PM",
    specificRequirements: "",
    messageToOwner: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Property visit scheduled successfully!");
    navigate("/buyer/scheduled-visits");
  };

  return (
    <div className="schedule-visit-container">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb-nav">
        <span onClick={() => navigate("/buyer")} className="crumb-link">
          Home
        </span>
        <span className="crumb-separator">&gt;</span>
        <span onClick={() => navigate("/buyer/browse")} className="crumb-link">
          Properties
        </span>
        <span className="crumb-separator">&gt;</span>
        <span className="crumb-active">Schedule Visit</span>
      </nav>

      {/* Main Page Title */}
      <div className="page-header-title">
        <h2>Schedule a Visit</h2>
        <p>Fill in the details below to schedule a visit to the property.</p>
      </div>

      {/* Main Form & Summary Layout Grid */}
      <div className="visit-layout-grid">
        {/* Left Column: Form Section */}
        <div className="visit-form-section">
          <form onSubmit={handleSubmit} className="visit-form">
            {/* Section 1: Your Details */}
            <h3 className="section-title">Your Details</h3>
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

            <hr className="form-divider" />

            {/* Section 2: Visit Details */}
            <h3 className="section-title">Visit Details</h3>
            <div className="form-row-2col">
              <div className="input-group">
                <label>
                  Preferred Date <span className="req">*</span>
                </label>
                <input
                  type="date"
                  name="visitDate"
                  value={formData.visitDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>
                  Preferred Time Slot <span className="req">*</span>
                </label>
                <select
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleChange}
                  required
                >
                  <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                  <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                  <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                  <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                </select>
              </div>
            </div>

            <div className="input-group full-width">
              <label>Any Specific Requirements? (Optional)</label>
              <textarea
                name="specificRequirements"
                placeholder="e.g. I'm interested in the parking area and want more details about the property."
                value={formData.specificRequirements}
                onChange={handleChange}
                maxLength={250}
                rows={3}
              ></textarea>
              <span className="char-count">
                {formData.specificRequirements.length}/250
              </span>
            </div>

            <div className="input-group full-width">
              <label>Message to Property Owner (Optional)</label>
              <textarea
                name="messageToOwner"
                placeholder="Write a message to the property owner..."
                value={formData.messageToOwner}
                onChange={handleChange}
                maxLength={500}
                rows={4}
              ></textarea>
              <span className="char-count">
                {formData.messageToOwner.length}/500
              </span>
            </div>

            {/* Form Bottom Actions */}
            <div className="form-action-bar">
              <div className="info-notice-box">
                <Info size={18} className="info-icon" />
                <span>
                  <strong>Note:</strong> Our team or property owner will contact you to confirm your visit.
                </span>
              </div>

              <button type="submit" className="schedule-visit-btn">
                <Calendar size={18} /> Schedule Visit
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Property Details Sidebar Card */}
        <div className="property-summary-sidebar">
          <div className="summary-card">
            <h4>Property Details</h4>
            
            <div className="sidebar-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
                alt="Luxury 3BHK Apartment"
              />
            </div>

            <div className="sidebar-property-info">
              <h3>Luxury 3BHK Apartment</h3>
              <span className="verified-badge">
                <CheckCircle2 size={13} /> Verified Property
              </span>
              <p className="location-text">📍 Baner, Pune, Maharashtra</p>

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

              <hr className="divider-line" />

              <div className="about-property-mini">
                <h5>About Property</h5>
                <p>
                  Experience luxury living in this beautiful 3BHK apartment located in the prime area of Baner. This property offers spacious rooms, modern amenities, and excellent connectivity to key locations in Pune.
                </p>
              </div>

              <button
                className="view-property-details-btn"
                type="button"
                onClick={() => navigate("/buyer/property-details")}
              >
                👁️ View Property Details
              </button>
            </div>
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
            <Clock size={20} />
          </div>
          <div className="feature-text">
            <h5>Quick Confirmation</h5>
            <p>Get visit confirmation within a few hours</p>
          </div>
        </div>

        <div className="feature-trust-item">
          <div className="feature-icon-circle">
            <UserCheck size={20} />
          </div>
          <div className="feature-text">
            <h5>Expert Assistance</h5>
            <p>Our team is here to help you at every step</p>
          </div>
        </div>

        <div className="feature-trust-item">
          <div className="feature-icon-circle">
            <Lock size={20} />
          </div>
          <div className="feature-text">
            <h5>Secure & Safe</h5>
            <p>Your data is 100% safe and secure with us</p>
          </div>
        </div>
      </div>
    </div>
  );
}