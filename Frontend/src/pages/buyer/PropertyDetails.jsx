import React, { useState } from "react";
import {
  MapPin,
  Heart,
  Share2,
  Bed,
  Bath,
  Maximize2,
  Car,
  Building,
  CheckCircle2,
  Calendar,
  MessageCircle,
  Phone,
  ShieldCheck,
  Dumbbell,
  Trees,
  Zap,
  Info,
  Map,
  ArrowLeft,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./PropertyDetails.css";

export default function PropertyDetails() {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  const propertyData = {
    id: "PRP-240521-001",
    title: "Luxury 3BHK Apartment",
    verified: true,
    location: "Baner, Pune, Maharashtra",
    price: "₹1,25,00,000",
    pricePerSqft: "₹8,620 / sq.ft",
    priceNegotiable: true,
    beds: "3",
    baths: "3",
    sqft: "1450 sq.ft",
    parking: "1",
    propertyType: "Apartment",
    listedOn: "21 May 2024",
    possession: "Ready to Move",
    furnishing: "Semi Furnished",
    reraId: "P52100012345",
    description:
      "Experience luxury living in this beautiful 3BHK apartment located in the prime area of Baner. This property offers spacious rooms, modern amenities, and excellent connectivity to key locations in Pune.",
    highlightsPoints: [
      "Spacious living and dining area with balcony",
      "Modular kitchen with premium fittings",
      "Vastu compliant and well-ventilated",
      "24x7 security with CCTV surveillance",
    ],
    owner: {
      name: "Rahul Sharma",
      role: "Property Owner",
      rating: 4.8,
      reviewsCount: 32,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    },
    images: {
      main: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      thumb1: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80",
      thumb2: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=400&q=80",
      thumb3: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80",
    },
    highlightsList: [
      "Prime Location",
      "Gated Community",
      "Power Backup",
      "Lift Available",
      "Children Play Area",
    ],
    amenities: [
      { name: "Gym", icon: Dumbbell },
      { name: "Club House", icon: Building },
      { name: "Swimming Pool", icon: Trees },
      { name: "Garden", icon: Trees },
      { name: "24x7 Security", icon: ShieldCheck },
      { name: "Power Backup", icon: Zap },
      { name: "Reserved Parking", icon: Car },
      { name: "CCTV Surveillance", icon: ShieldCheck },
    ],
  };

  return (
    <div className="property-details-container">
      {/* Top Header Breadcrumb & Actions */}
      <div className="pdetails-header">
        <div className="breadcrumbs">
          <span onClick={() => navigate("/buyer")} className="link-crumb">
            Home
          </span>
          <span className="crumb-sep">&gt;</span>
          <span onClick={() => navigate("/buyer/browse")} className="link-crumb">
            Properties
          </span>
          <span className="crumb-sep">&gt;</span>
          <span className="current-crumb">{propertyData.title}</span>
        </div>

        <div className="pdetails-title-row">
          <div className="title-left">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="title-verified">
                <h1>{propertyData.title}</h1>
                {propertyData.verified && (
                  <span className="verified-badge">
                    <CheckCircle2 size={13} /> Verified Property
                  </span>
                )}
              </div>
              <p className="property-address">
                <MapPin size={14} /> {propertyData.location}
              </p>
            </div>
          </div>

          <div className="title-actions">
            <button
              className={`action-btn-outline ${isSaved ? "saved" : ""}`}
              onClick={() => setIsSaved(!isSaved)}
            >
              <Heart size={16} fill={isSaved ? "#ef4444" : "none"} color={isSaved ? "#ef4444" : "#475569"} />
              <span>{isSaved ? "Saved" : "Save"}</span>
            </button>
            <button className="action-btn-outline">
              <Share2 size={16} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="pdetails-main-layout">
        {/* Left Column: Photos, Details, Tabs */}
        <div className="pdetails-left-content">
          {/* Gallery Section */}
          <div className="property-gallery">
            <div className="gallery-main">
              <span className="featured-badge">Featured</span>
              <img src={propertyData.images.main} alt={propertyData.title} />
            </div>
            <div className="gallery-thumbs">
              <div className="thumb-box">
                <img src={propertyData.images.thumb1} alt="Kitchen" />
              </div>
              <div className="thumb-box">
                <img src={propertyData.images.thumb2} alt="Bedroom" />
              </div>
              <div className="thumb-box overlay-thumb">
                <img src={propertyData.images.thumb3} alt="Living" />
                <div className="more-photos-overlay">+12 Photos</div>
              </div>
            </div>
          </div>

          {/* Quick Info Spec Bar */}
          <div className="quick-specs-bar">
            <div className="spec-item">
              <div className="spec-icon"><Bed size={20} /></div>
              <div>
                <span className="spec-value">{propertyData.beds}</span>
                <span className="spec-label">Bedrooms</span>
              </div>
            </div>
            <div className="spec-item">
              <div className="spec-icon"><Bath size={20} /></div>
              <div>
                <span className="spec-value">{propertyData.baths}</span>
                <span className="spec-label">Bathrooms</span>
              </div>
            </div>
            <div className="spec-item">
              <div className="spec-icon"><Maximize2 size={20} /></div>
              <div>
                <span className="spec-value">{propertyData.sqft}</span>
                <span className="spec-label">Built-up Area</span>
              </div>
            </div>
            <div className="spec-item">
              <div className="spec-icon"><Car size={20} /></div>
              <div>
                <span className="spec-value">{propertyData.parking}</span>
                <span className="spec-label">Parking</span>
              </div>
            </div>
            <div className="spec-item">
              <div className="spec-icon"><Building size={20} /></div>
              <div>
                <span className="spec-value">{propertyData.propertyType}</span>
                <span className="spec-label">Property Type</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="pdetails-tabs">
            {["Overview", "Amenities", "Location", "Floor Plan", "Reviews (28)"].map((tab) => (
              <button
                key={tab}
                className={`tab-link ${activeTab === tab.split(" ")[0] ? "active" : ""}`}
                onClick={() => setActiveTab(tab.split(" ")[0])}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview & About Property */}
          <div className="pdetails-section-card">
            <div className="about-property-split">
              <div className="about-text-col">
                <h3>About this property</h3>
                <p>{propertyData.description}</p>
                <ul className="bullet-highlights">
                  {propertyData.highlightsPoints.map((point, index) => (
                    <li key={index}>
                      <CheckCircle2 size={16} className="check-icon" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="property-meta-table">
                <div className="meta-row">
                  <span className="meta-key">Property ID</span>
                  <span className="meta-val">{propertyData.id}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">Listed On</span>
                  <span className="meta-val">{propertyData.listedOn}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">Possession</span>
                  <span className="meta-val">{propertyData.possession}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">Furnishing</span>
                  <span className="meta-val">{propertyData.furnishing}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">RERA ID</span>
                  <span className="meta-val rera-val">
                    {propertyData.reraId} <ShieldCheck size={14} className="rera-icon" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Location Map Section */}
          <div className="pdetails-section-card location-card">
            <div className="location-card-header">
              <div>
                <h3>Location</h3>
                <p className="loc-text">{propertyData.location} 411045</p>
              </div>
              <button className="btn-view-map">
                <Map size={14} /> View on Map
              </button>
            </div>
            <div className="map-embed-wrapper">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=80"
                alt="Map View Location"
              />
              <div className="map-pin-overlay">
                <MapPin size={24} color="#ef4444" fill="#ef4444" />
                <span>{propertyData.title}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Widgets */}
        <div className="pdetails-sidebar">
          {/* Price & Action Box */}
          <div className="widget-card price-action-widget">
            <div className="price-tag-row">
              <span className="main-price">{propertyData.price}</span>
              <span className="sqft-price">({propertyData.pricePerSqft})</span>
            </div>
            <div className="negotiable-label">
              <span>Price Negotiable</span>
              <Info size={13} />
            </div>

            <div className="action-btns-group">
              <button className="btn-primary-blue">
                <Calendar size={16} /> Schedule a Visit
              </button>
              <button className="btn-primary-green">
                <Building size={16} /> Book Property
              </button>
              <button className="btn-outline-blue">
                <Phone size={16} /> Contact Owner
              </button>
              <button className="btn-whatsapp">
                <MessageCircle size={16} /> WhatsApp
              </button>
            </div>
          </div>

          {/* Owner Profile Card */}
          <div className="widget-card owner-widget">
            <div className="owner-profile">
              <img src={propertyData.owner.avatar} alt={propertyData.owner.name} />
              <div className="owner-info">
                <h4>{propertyData.owner.name}</h4>
                <p>{propertyData.owner.role}</p>
                <div className="owner-rating">
                  <Star size={13} fill="#f59e0b" color="#f59e0b" />
                  <span>{propertyData.owner.rating}</span>
                  <span className="reviews-sub">({propertyData.owner.reviewsCount} Reviews)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Property Highlights */}
          <div className="widget-card highlights-widget">
            <h3>Property Highlights</h3>
            <ul className="highlights-list">
              {propertyData.highlightsList.map((item, idx) => (
                <li key={idx}>
                  <CheckCircle2 size={15} className="highlight-icon" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Amenities Summary */}
          <div className="widget-card amenities-widget">
            <h3>Amenities</h3>
            <div className="amenities-grid">
              {propertyData.amenities.map((amenity, idx) => {
                const IconComp = amenity.icon;
                return (
                  <div className="amenity-item" key={idx}>
                    <div className="amenity-icon-box">
                      <IconComp size={16} />
                    </div>
                    <span>{amenity.name}</span>
                  </div>
                );
              })}
            </div>
            <button className="btn-view-all-amenities">View All Amenities &rarr;</button>
          </div>
        </div>
      </div>
    </div>
  );
}