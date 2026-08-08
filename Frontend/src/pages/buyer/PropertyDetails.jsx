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
  Mail,
  ShieldCheck,
  Dumbbell,
  Trees,
  Zap,
  Info,
  Map as MapIcon,
  ArrowLeft,
  Star,
  Layers,
  ChevronLeft,
  ChevronRight,
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

  // Image Gallery & Lightbox States
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  // Fetch from backend API if ID exists
  useEffect(() => {
    const targetId = id || location.state?.property?.id || location.state?.property?.propertyId;
    if (targetId) {
      setLoading(true);
      axios
        .get(`${API_URL}/properties/${targetId}`)
        .then((res) => {
          if (res.data) {
            setBackendProperty(res.data);
          }
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

  // Extract Real Cloudinary Images Array
  const imageList = p?.images && p.images.length > 0
    ? p.images.map((img) => img.imageUrl)
    : [
        p?.image ||
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      ];

  // Dynamic Icon Resolver for Amenities
  const getAmenityIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes("gym") || lower.includes("fitness")) return Dumbbell;
    if (lower.includes("club") || lower.includes("lift") || lower.includes("building") || lower.includes("hall")) return Building;
    if (lower.includes("security") || lower.includes("cctv") || lower.includes("guard")) return ShieldCheck;
    if (lower.includes("park") || lower.includes("car") || lower.includes("garage")) return Car;
    if (lower.includes("backup") || lower.includes("power") || lower.includes("wifi") || lower.includes("ac")) return Zap;
    if (lower.includes("garden") || lower.includes("pool") || lower.includes("tree")) return Trees;
    return CheckCircle2;
  };

  // Parse Backend Amenities
  const rawAmenities = p?.amenities
    ? (typeof p.amenities === "string" ? p.amenities.split(",").map((s) => s.trim()) : p.amenities)
    : [
        "Gym",
        "Club House",
        "Swimming Pool",
        "Garden",
        "24x7 Security",
        "Power Backup",
        "Reserved Parking",
        "CCTV Surveillance",
      ];

  const amenitiesList = rawAmenities.filter(Boolean).map((name) => ({
    name,
    icon: getAmenityIcon(name),
  }));

  // Parse Backend Highlights
  const rawHighlights = p?.highlights
    ? (typeof p.highlights === "string" ? p.highlights.split(",").map((s) => s.trim()) : p.highlights)
    : [
        "Prime Location",
        "Gated Community",
        "Power Backup",
        "Lift Available",
        "Children Play Area",
      ];

  const highlightsList = rawHighlights.filter(Boolean);

  const propertyData = {
    id: p?.id || p?.propertyId || "PRP-240521-001",
    title: p?.title || "Property Details",
    verified: p?.verificationStatus === "APPROVED",
    location: p?.address
      ? `${p.address}${p.city ? `, ${p.city}` : ""}${p.state ? `, ${p.state}` : ""}${p.pinCode ? ` - ${p.pinCode}` : ""}`
      : (p?.location || "Location on Request"),
    coordinates: { lat: 18.559, lng: 73.7868 },
    price: typeof p?.price === "number" ? `₹${p.price.toLocaleString("en-IN")}` : (p?.price ? `₹${p.price}` : "Price on Request"),
    pricePerSqft: p?.price && p?.areaSqft ? `₹${Math.round(p.price / p.areaSqft).toLocaleString("en-IN")} / sq.ft` : "₹8,620 / sq.ft",
    priceNegotiable: true,
    beds: String(p?.bedrooms || p?.beds || "1"),
    baths: String(p?.bathrooms || p?.baths || "1"),
    halls: String(p?.halls || "1"),
    sqft: p?.areaSqft ? `${p.areaSqft} sq.ft` : (p?.sqft || "N/A"),
    parking: "1",
    propertyType: p?.propertyType || "Apartment",
    listingType: p?.listingType || "RENT",
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
      name: p?.ownerName || (p?.owner ? `${p.owner.firstName || ""} ${p.owner.lastName || ""}`.trim() : "Atharva Dadhe"),
      role: "Property Owner",
      phone: p?.ownerPhone || p?.owner?.phone || "7747926022",
      email: p?.ownerEmail || p?.owner?.email || "owner@estate.com",
      rating: 4.8,
      reviewsCount: 32,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    },
    rawPropertyObj: p,
    highlightsList: highlightsList,
    amenities: amenitiesList,
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = propertyData.owner.phone;
    const customMessage = `Hello ${propertyData.owner.name}, I am interested in your property "${propertyData.title}" (ID: ${propertyData.id}) located at ${propertyData.location} listed for ${propertyData.price}. Please provide more details!`;
    const encodedMessage = encodeURIComponent(customMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleContactOwnerClick = () => {
    const ownerEmail = propertyData.owner.email;
    const ownerName = propertyData.owner.name;

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
          {/* In-Page Property Slider Gallery */}
          <div className="property-gallery-slider">
            <div className="gallery-slider-main">
              <span className="featured-badge">
                {propertyData.listingType === "RENT" ? "For Rent" : "For Sale"}
              </span>

              <img
                src={imageList[selectedImageIndex] || imageList[0]}
                alt={propertyData.title}
                className="slider-main-img"
              />

              {/* Prev / Next Controls overlay on image */}
              {imageList.length > 1 && (
                <>
                  <button
                    className="slider-arrow slider-arrow-prev"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex((prev) =>
                        prev === 0 ? imageList.length - 1 : prev - 1
                      );
                    }}
                    title="Previous Photo"
                  >
                    <ChevronLeft size={22} />
                  </button>

                  <button
                    className="slider-arrow slider-arrow-next"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex((prev) =>
                        prev === imageList.length - 1 ? 0 : prev + 1
                      );
                    }}
                    title="Next Photo"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}

              {/* Image Counter Badge */}
              <div className="slider-counter-badge">
                📷 {selectedImageIndex + 1} / {imageList.length} Photos
              </div>
            </div>

            {/* Horizontal Scrollable Thumbnails Strip for ALL Images */}
            {imageList.length > 1 && (
              <div className="gallery-slider-thumbs-strip">
                {imageList.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className={`slider-thumb-item ${idx === selectedImageIndex ? "active-slider-thumb" : ""}`}
                    onClick={() => setSelectedImageIndex(idx)}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} />
                  </div>
                ))}
              </div>
            )}
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
                  <span className="meta-val">PRP-{propertyData.id}</span>
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
                <p className="loc-text">{propertyData.location}</p>
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
                <div
                  className="map-loading"
                  style={{
                    height: "350px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
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
              <span className="sqft-price">
                ({propertyData.listingType === "RENT" ? "Rent / month" : propertyData.pricePerSqft})
              </span>
            </div>
            <div className="negotiable-label">
              <span>Price Negotiable</span>
              <Info size={13} />
            </div>

            <div className="action-btns-group">
              <button
                className="btn-primary-blue"
                onClick={() =>
                  navigate("/buyer/schedule-visit", {
                    state: { property: propertyData.rawPropertyObj || propertyData },
                  })
                }
              >
                <Calendar size={16} /> Schedule a Visit
              </button>

              <button
                className="btn-primary-green"
                onClick={() =>
                  navigate("/buyer/book-property", {
                    state: {
                      property: backendProperty || propertyData.rawPropertyObj || propertyData,
                    },
                  })
                }
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
            <h3>Amenities ({propertyData.amenities.length})</h3>
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
          </div>
        </div>
      </div>
    </div>
  );
}
