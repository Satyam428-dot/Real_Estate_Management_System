import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
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
  Mail,
  ShieldCheck,
  Dumbbell,
  Trees,
  Zap,
  Info,
  Map as MapIcon,
  ArrowLeft,
  Star,
} from "lucide-react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import "./PropertyDetails.css";

const API_URL = "http://localhost:8080";

// Map Container Styling
const mapContainerStyle = {
  width: "100%",
  height: "350px",
  borderRadius: "12px",
};

// Map Initial Settings (Centered on Baner, Pune)
const mapCenter = {
  lat: 18.559,
  lng: 73.7868,
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
};

export default function PropertyDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  const [backendProperty, setBackendProperty] = useState(location.state?.property || null);
  const [loading, setLoading] = useState(false);

  // Fetch from backend API if ID exists
  useEffect(() => {
    const targetId = id || location.state?.property?.id || location.state?.property?.propertyId;
    if (targetId) {
      setLoading(true);
      axios
        .get(`${API_URL}/properties/${targetId}`)
        .then((res) => {
          if (res.data) setBackendProperty(res.data);
        })
        .catch((err) => console.error("Could not fetch property from backend:", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  // Load Google Maps Script
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  // Construct view object from backendProperty or fallback defaults
  const p = backendProperty;
  const propertyData = {
    id: p?.id || p?.propertyId || "PRP-240521-001",
    title: p?.title || "Luxury 3BHK Apartment",
    verified: true,
    location: p?.address ? `${p.address}, ${p.city || ""}` : (p?.location || "Baner, Pune, Maharashtra"),
    coordinates: { lat: 18.559, lng: 73.7868 },
    price: typeof p?.price === "number" ? `₹${p.price.toLocaleString("en-IN")}` : (p?.price || "₹1,25,00,000"),
    pricePerSqft: "₹8,620 / sq.ft",
    priceNegotiable: true,
    beds: String(p?.bedrooms || p?.beds || "3"),
    baths: String(p?.bathrooms || p?.baths || "3"),
    sqft: p?.areaSqft ? `${p.areaSqft} sq.ft` : (p?.sqft || "1450 sq.ft"),
    parking: "1",
    propertyType: p?.propertyType || "Apartment",
    listedOn: "21 May 2024",
    possession: "Ready to Move",
    furnishing: "Semi Furnished",
    reraId: "P52100012345",
    description: p?.description || "Experience luxury living in this beautiful property with modern amenities.",
    highlightsPoints: [
      "Spacious living and dining area with balcony",
      "Modular kitchen with premium fittings",
      "Vastu compliant and well-ventilated",
      "24x7 security with CCTV surveillance",
    ],
    owner: {
      name: p?.owner ? `${p.owner.firstName || ""} ${p.owner.lastName || ""}` : "Atharv Dadhe",
      role: "Property Owner",
      phone: p?.owner?.phone || "7747926022",
      rating: 4.8,
      reviewsCount: 32,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    },
    images: {
      main: p?.images?.[0]?.imageUrl || p?.image || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      thumb1: p?.images?.[1]?.imageUrl || "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80",
      thumb2: p?.images?.[2]?.imageUrl || "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=400&q=80",
      thumb3: p?.images?.[3]?.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80",
    },
    rawPropertyObj: p,
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

  const handleWhatsAppClick = () => {
    const phoneNumber = propertyData.owner.phone;
    const customMessage = `Hello ${propertyData.owner.name}, I am interested in your property "${propertyData.title}" (ID: ${propertyData.id}) located at ${propertyData.location} listed for ${propertyData.price}. Please provide more details!`;
    const encodedMessage = encodeURIComponent(customMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleContactOwnerClick = () => {
    const ownerEmail = backendProperty?.ownerEmail || propertyData.owner?.email || "rahul.sharma@gmail.com";
    const ownerName = backendProperty?.ownerName || propertyData.owner?.name || "Property Owner";
    
    const subject = `Inquiry regarding Property: ${propertyData.title}`;
    const body = `Hello ${ownerName},

I am interested in your property "${propertyData.title}" (ID: ${propertyData.id}) located at ${propertyData.location} listed for ${propertyData.price}.

Property Specifications:
- Bedrooms: ${propertyData.beds}
- Bathrooms: ${propertyData.baths}
- Area: ${propertyData.sqft}

Please provide more details regarding property availability, scheduling a site visit, and documentation.

Looking forward to hearing from you.

Best regards!`;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(ownerEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast.success(`Opening Gmail Web to contact ${ownerName}...`);
    window.open(gmailUrl, "_blank");
  };

  const handleOpenExternalMap = () => {
    const query = encodeURIComponent(`${propertyData.title}, ${propertyData.location}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  return (
    <div className="property-details-container">
      {/* Header */}
      <div className="pdetails-header">
        <div className="breadcrumbs">
          <span onClick={() => navigate("/buyer")} className="link-crumb">
            Home
          </span>
          <span className="crumb-sep">&gt;</span>
          <span
            onClick={() => navigate("/buyer/browse")}
            className="link-crumb"
          >
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
              <Heart
                size={16}
                fill={isSaved ? "#ef4444" : "none"}
                color={isSaved ? "#ef4444" : "#475569"}
              />
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
        {/* Left Column */}
        <div className="pdetails-left-content">
          {/* Gallery */}
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

          {/* Quick Specs */}
          <div className="quick-specs-bar">
            <div className="spec-item">
              <div className="spec-icon">
                <Bed size={20} />
              </div>
              <div>
                <span className="spec-value">{propertyData.beds}</span>
                <span className="spec-label">Bedrooms</span>
              </div>
            </div>
            <div className="spec-item">
              <div className="spec-icon">
                <Bath size={20} />
              </div>
              <div>
                <span className="spec-value">{propertyData.baths}</span>
                <span className="spec-label">Bathrooms</span>
              </div>
            </div>
            <div className="spec-item">
              <div className="spec-icon">
                <Maximize2 size={20} />
              </div>
              <div>
                <span className="spec-value">{propertyData.sqft}</span>
                <span className="spec-label">Built-up Area</span>
              </div>
            </div>
            <div className="spec-item">
              <div className="spec-icon">
                <Car size={20} />
              </div>
              <div>
                <span className="spec-value">{propertyData.parking}</span>
                <span className="spec-label">Parking</span>
              </div>
            </div>
            <div className="spec-item">
              <div className="spec-icon">
                <Building size={20} />
              </div>
              <div>
                <span className="spec-value">{propertyData.propertyType}</span>
                <span className="spec-label">Property Type</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="pdetails-tabs">
            {[
              "Overview",
              "Amenities",
              "Location",
              "Floor Plan",
              "Reviews (28)",
            ].map((tab) => (
              <button
                key={tab}
                className={`tab-link ${
                  activeTab === tab.split(" ")[0] ? "active" : ""
                }`}
                onClick={() => setActiveTab(tab.split(" ")[0])}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Overview */}
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
                    {propertyData.reraId}{" "}
                    <ShieldCheck size={14} className="rera-icon" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Google Map Section */}
          <div className="pdetails-section-card location-card">
            <div className="location-card-header">
              <div>
                <h3>Location</h3>
                <p className="loc-text">{propertyData.location} 411045</p>
              </div>
              <button className="btn-view-map" onClick={handleOpenExternalMap}>
                <MapIcon size={14} /> Open in Google Maps
              </button>
            </div>

            <div className="map-embed-wrapper" style={{ minHeight: "350px" }}>
              {loadError && (
                <div className="map-error">
                  <p>Unable to load Google Maps. Please check your API key.</p>
                </div>
              )}

              {!isLoaded && !loadError && (
                <div className="map-loading" style={{ height: "350px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span>Loading Map...</span>
                </div>
              )}

              {isLoaded && (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={propertyData.coordinates}
                  zoom={15}
                  options={mapOptions}
                >
                  <MarkerF
                    position={propertyData.coordinates}
                    title={propertyData.title}
                  />
                </GoogleMap>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="pdetails-sidebar">
          {/* Price & Action Widget */}
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
              <button
                className="btn-primary-blue"
                onClick={() => navigate("/buyer/schedule-visit", { state: { property: propertyData.rawPropertyObj || propertyData } })}
              >
                <Calendar size={16} /> Schedule a Visit
              </button>

              <button
                className="btn-primary-green"
                onClick={() => navigate("/buyer/book-property", { state: { property: backendProperty || propertyData.rawPropertyObj || propertyData } })}
              >
                <Building size={16} /> Book Property
              </button>

              <button className="btn-outline-blue" onClick={handleContactOwnerClick}>
                <Mail size={16} /> Contact Owner
              </button>

              <button className="btn-whatsapp" onClick={handleWhatsAppClick}>
                <MessageCircle size={16} /> WhatsApp
              </button>
            </div>
          </div>

          {/* Owner Profile Widget */}
          <div className="widget-card owner-widget">
            <div className="owner-profile">
              <img
                src={propertyData.owner.avatar}
                alt={propertyData.owner.name}
              />
              <div className="owner-info">
                <h4>{propertyData.owner.name}</h4>
                <p>{propertyData.owner.role}</p>
                <div className="owner-rating">
                  <Star size={13} fill="#f59e0b" color="#f59e0b" />
                  <span>{propertyData.owner.rating}</span>
                  <span className="reviews-sub">
                    ({propertyData.owner.reviewsCount} Reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Property Highlights Widget */}
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

          {/* Amenities Widget */}
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
            <button className="btn-view-all-amenities">
              View All Amenities &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
