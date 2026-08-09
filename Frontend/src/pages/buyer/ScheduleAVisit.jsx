import { JAVA_BACKEND_URL } from "../../utils/config";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
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
  const location = useLocation();

  // Selected property passed from Property Details or Catalog
  const selectedProp = location.state?.property;

  const property = {
    id: selectedProp?.id || selectedProp?.propertyId || 1,
    title: selectedProp?.title || "Luxury 3BHK Apartment",
    location: selectedProp?.location || (selectedProp?.city ? `${selectedProp.address || ''}, ${selectedProp.city}` : "Baner, Pune, Maharashtra"),
    price: typeof selectedProp?.price === "number" ? `₹${selectedProp.price.toLocaleString("en-IN")}` : (selectedProp?.price || "₹1,25,00,000"),
    beds: String(selectedProp?.bedrooms || selectedProp?.beds || "3"),
    baths: String(selectedProp?.bathrooms || selectedProp?.baths || "3"),
    sqft: selectedProp?.areaSqft ? `${selectedProp.areaSqft} sq.ft` : (selectedProp?.sqft || "1450 sq.ft"),
    image: selectedProp?.images?.[0]?.imageUrl || selectedProp?.image || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    description: selectedProp?.description || "Experience luxury living in this beautiful property with modern amenities.",
    rawObj: selectedProp
  };

  // Form State
  const [formData, setFormData] = useState({
    fullName: "Abhishek Dhoran",
    email: "abhishek.dhoran@gmail.com",
    phone: "+91 98765 43210",
    visitDate: new Date().toISOString().split("T")[0],
    timeSlot: "11:00 AM - 01:00 PM",
    specificRequirements: "",
    messageToOwner: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        propertyId: property.id,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        visitDate: formData.visitDate,
        timeSlot: formData.timeSlot,
        specificRequirements: formData.specificRequirements,
        messageToOwner: formData.messageToOwner,
      };

      await axios.post(`${JAVA_BACKEND_URL}/visits`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Property visit scheduled successfully!");
      navigate("/buyer/visits");
    } catch (err) {
      console.error("Failed to save scheduled visit:", err);
      toast.error(
        "Failed to schedule visit: " +
          (err.response?.data?.message || err.message || "Unknown error occurred.")
      );
    } finally {
      setSubmitting(false);
    }
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
                src={property.image}
                alt={property.title}
              />
            </div>

            <div className="sidebar-property-info">
              <h3>{property.title}</h3>
              <span className="verified-badge">
                <CheckCircle2 size={13} /> Verified Property
              </span>
              <p className="location-text">📍 {property.location}</p>

              <div className="specs-pills-row">
                <span className="spec-pill">🛏️ {property.beds} Beds</span>
                <span className="spec-pill">🛁 {property.baths} Baths</span>
                <span className="spec-pill">📐 {property.sqft}</span>
              </div>

              <div className="price-tag-row">
                <span className="price-val">{property.price}</span>
              </div>

              <hr className="divider-line" />

              <div className="about-property-mini">
                <h5>About Property</h5>
                <p>{property.description}</p>
              </div>

              <button
                className="view-property-details-btn"
                type="button"
                onClick={() => navigate(`/buyer/property-details/${property.id}`, { state: { property: property.rawObj } })}
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