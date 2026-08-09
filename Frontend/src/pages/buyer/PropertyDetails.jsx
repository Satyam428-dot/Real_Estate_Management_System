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
  Send,
  User as UserIcon,
  Calculator,
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

  // Image Gallery & Slider State
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Reviews States
  const [reviewsList, setReviewsList] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // EMI Calculator States
  const [loanTenureYears, setLoanTenureYears] = useState(20);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);

  // Fetch property details and reviews from backend
  useEffect(() => {
    const targetId = id || location.state?.property?.id || location.state?.property?.propertyId;
    if (targetId) {
      setLoading(true);
      // 1. Fetch Property Details
      axios
        .get(`${API_URL}/properties/${targetId}`)
        .then((res) => {
          if (res.data) {
            setBackendProperty(res.data);
          }
        })
        .catch((err) => console.error("Could not fetch property from backend:", err))
        .finally(() => setLoading(false));

      // 2. Fetch Reviews for Property
      axios
        .get(`${API_URL}/reviews/property/${targetId}`)
        .then((res) => {
          if (Array.isArray(res.data)) {
            setReviewsList(res.data);
          }
        })
        .catch((err) => console.error("Could not fetch property reviews:", err));
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
    parking: "1 Covered",
    propertyType: p?.propertyType || "Apartment",
    listingType: p?.listingType || "RENT",
    listedOn: "21 May 2024",
    possession: "Ready to Move",
    furnishing: "Semi Furnished",
    reraId: "P52100012345",
    description: p?.description || "Experience luxury living in this beautiful property with modern amenities.",
    highlightsPoints: highlightsList.length > 0 ? highlightsList : [
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
      reviewsCount: reviewsList.length || 32,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    },
    rawPropertyObj: p,
    highlightsList: highlightsList,
    amenities: amenitiesList,
  };

  // Submit Review Handler
  const handleAddReview = (e) => {
    e.preventDefault();
    const targetId = id || location.state?.property?.id || location.state?.property?.propertyId;
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to submit a review");
      return;
    }
    if (!newComment.trim()) {
      toast.error("Please enter a review comment");
      return;
    }

    setSubmittingReview(true);
    axios
      .post(
        `${API_URL}/reviews`,
        {
          propertyId: Number(targetId),
          rating: Number(newRating),
          comment: newComment.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        toast.success("Review submitted successfully!");
        setNewComment("");
        setNewRating(5);
        // Refresh reviews list
        return axios.get(`${API_URL}/reviews/property/${targetId}`);
      })
      .then((res) => {
        if (res?.data && Array.isArray(res.data)) {
          setReviewsList(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to submit review:", err);
        toast.error("Could not submit review. Please try again.");
      })
      .finally(() => setSubmittingReview(false));
  };

  // Dynamic EMI Calculation
  const rawPriceNum = typeof p?.price === "number" ? p.price : (parseFloat(p?.price) || 5000000);
  const loanAmount = Math.max(0, rawPriceNum * (1 - downPaymentPercent / 100));
  const monthlyRate = (interestRate / 12) / 100;
  const totalMonths = loanTenureYears * 12;

  const emiVal = monthlyRate > 0 && totalMonths > 0
    ? Math.round((loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1))
    : 0;

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

  // Calculate Average Rating
  const avgRating = reviewsList.length > 0
    ? (reviewsList.reduce((acc, r) => acc + (r.rating || 5), 0) / reviewsList.length).toFixed(1)
    : "4.8";

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

          {/* Quick Specs Bar (Integrated with Real Backend Data) */}
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

          {/* Tabs Navigation */}
          <div className="pdetails-tabs">
            {[
              { id: "Overview", label: "Overview" },
              { id: "Amenities", label: `Amenities (${propertyData.amenities.length})` },
              { id: "Location", label: "Location" },
              { id: "Floor", label: "Floor Plan" },
              { id: "Reviews", label: `Reviews (${reviewsList.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`tab-link ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {(activeTab === "Overview" || activeTab === "all") && (
            <div className="pdetails-section-card">
              <div className="about-property-split">
                <div className="about-text-col" style={{ width: "100%" }}>
                  <h3>About this property</h3>
                  <p style={{ lineHeight: "1.7", color: "#334155" }}>{propertyData.description}</p>

                  <h3 style={{ marginTop: "24px" }}>Property Highlights</h3>
                  <ul className="bullet-highlights">
                    {propertyData.highlightsPoints.map((point, index) => (
                      <li key={index}>
                        <CheckCircle2 size={16} className="check-icon" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Amenities Tab View */}
          {activeTab === "Amenities" && (
            <div className="pdetails-section-card">
              <h3>All Property Amenities ({propertyData.amenities.length})</h3>
              <p style={{ color: "#64748b", marginBottom: "16px", fontSize: "14px" }}>
                Features & services available for this property:
              </p>
              <div className="amenities-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px" }}>
                {propertyData.amenities.map((amenity, idx) => {
                  const IconComp = amenity.icon;
                  return (
                    <div
                      className="amenity-item"
                      key={idx}
                      style={{ padding: "14px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}
                    >
                      <div className="amenity-icon-box" style={{ background: "#eff6ff", color: "#2563eb" }}>
                        <IconComp size={18} />
                      </div>
                      <span style={{ fontWeight: "600", fontSize: "14px" }}>{amenity.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Location */}
          {(activeTab === "Location" || activeTab === "all") && (
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
          )}

          {/* Tab 4: Floor Plan Tab View */}
          {activeTab === "Floor" && (
            <div className="pdetails-section-card floor-plan-card">
              <h3>Architectural Floor Plan & Layout</h3>
              <div className="floor-plan-specs">
                <div className="fp-spec-box">
                  <span className="fp-spec-label">Built-up Area</span>
                  <span className="fp-spec-val">{propertyData.sqft}</span>
                </div>
                <div className="fp-spec-box">
                  <span className="fp-spec-label">Bedrooms</span>
                  <span className="fp-spec-val">{propertyData.beds} Beds</span>
                </div>
                <div className="fp-spec-box">
                  <span className="fp-spec-label">Bathrooms</span>
                  <span className="fp-spec-val">{propertyData.baths} Baths</span>
                </div>
                <div className="fp-spec-box">
                  <span className="fp-spec-label">Halls / Living</span>
                  <span className="fp-spec-val">{propertyData.halls} Hall</span>
                </div>
              </div>

              <div className="floor-plan-diagram-box">
                <div className="fp-diagram-graphic">
                  <Building size={48} color="#3b82f6" style={{ marginBottom: "12px" }} />
                  <h4 style={{ margin: 0, fontSize: "18px" }}>2D Floor Plan Overview</h4>
                </div>
                <div className="fp-room-grid">
                  <div className="fp-room-pill">Master Bedroom ({propertyData.beds > 1 ? "Ensuite Bath" : "Standard"})</div>
                  <div className="fp-room-pill">Living & Dining Room</div>
                  <div className="fp-room-pill">Modular Kitchen</div>
                  <div className="fp-room-pill">Balcony / Utility Space</div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Reviews Tab View */}
          {activeTab === "Reviews" && (
            <div className="pdetails-section-card reviews-section-card">
              <h3>Buyer Ratings & Reviews ({reviewsList.length})</h3>

              <div className="reviews-summary-bar">
                <div className="rev-score-box">
                  <span className="rev-big-num">{avgRating}</span>
                  <div>
                    <div className="rev-stars-row">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={18}
                          fill={star <= Math.round(Number(avgRating)) ? "#f59e0b" : "#e2e8f0"}
                          color={star <= Math.round(Number(avgRating)) ? "#f59e0b" : "#cbd5e1"}
                        />
                      ))}
                    </div>
                    <span className="rev-count-sub">Based on {reviewsList.length} verified reviews</span>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="reviews-list-wrapper">
                {reviewsList.length === 0 ? (
                  <p style={{ color: "#64748b" }}>No reviews submitted yet for this property. Be the first to write a review!</p>
                ) : (
                  reviewsList.map((rev) => (
                    <div className="review-item-card" key={rev.id || Math.random()}>
                      <div className="review-user-header">
                        <div className="rev-user-info">
                          <img
                            src={rev.reviewerAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                            alt={rev.reviewerName || "Buyer"}
                            className="rev-avatar"
                          />
                          <div>
                            <h5 className="rev-user-name">{rev.reviewerName || "Verified Buyer"}</h5>
                            <p className="rev-user-role">Verified Buyer</p>
                          </div>
                        </div>
                        <div className="rev-stars-row">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              fill={star <= rev.rating ? "#f59e0b" : "#e2e8f0"}
                              color={star <= rev.rating ? "#f59e0b" : "#cbd5e1"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="rev-comment-text">{rev.reviewText || rev.comment}</p>
                      {rev.date && <span className="rev-date">{rev.date}</span>}
                    </div>
                  ))
                )}
              </div>

              {/* Write Review Form */}
              <form className="write-review-card" onSubmit={handleAddReview}>
                <h4>Write a Review</h4>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "600" }}>Your Rating:</span>
                  <div className="star-rating-select">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={22}
                        fill={star <= newRating ? "#f59e0b" : "#e2e8f0"}
                        color={star <= newRating ? "#f59e0b" : "#cbd5e1"}
                        onClick={() => setNewRating(star)}
                      />
                    ))}
                  </div>
                </div>

                <textarea
                  className="review-textarea"
                  placeholder="Share your experience regarding this property, location, amenities..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                ></textarea>

                <button
                  type="submit"
                  className="btn-submit-review"
                  disabled={submittingReview}
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          )}
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

          {/* EMI / Home Loan Calculator Widget */}
          <div className="widget-card emi-calculator-widget">
            <div className="emi-widget-header">
              <div className="emi-icon-title">
                <div className="emi-icon-box">
                  <Calculator size={16} />
                </div>
                <h3>Home Loan EMI</h3>
              </div>
              <span className="emi-rate-badge">{interestRate}% p.a.</span>
            </div>

            <div className="emi-result-box">
              <span className="emi-result-label">Est. Monthly EMI</span>
              <div className="emi-result-val">
                ₹{emiVal.toLocaleString("en-IN")} <span className="emi-per-mo">/ mo</span>
              </div>
              <div className="emi-loan-sub">
                Loan Amount: ₹{Math.round(loanAmount).toLocaleString("en-IN")} ({100 - downPaymentPercent}% of price)
              </div>
            </div>

            {/* Slider 1: Down Payment */}
            <div className="emi-slider-group">
              <div className="emi-slider-label">
                <span>Down Payment ({downPaymentPercent}%)</span>
                <span>₹{Math.round(rawPriceNum * (downPaymentPercent / 100)).toLocaleString("en-IN")}</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="emi-slider-input"
              />
            </div>

            {/* Slider 2: Tenure Years */}
            <div className="emi-slider-group">
              <div className="emi-slider-label">
                <span>Tenure</span>
                <span>{loanTenureYears} Years</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={loanTenureYears}
                onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                className="emi-slider-input"
              />
            </div>

            <button
              className="btn-apply-loan"
              onClick={() => toast.info("Connecting with bank partners for pre-approved home loans...")}
            >
              Get Pre-Approved Loan &rarr;
            </button>
          </div>

          {/* Safety & Legal Guarantee Widget */}
          <div className="widget-card safety-guarantee-widget">
            <div className="safety-header">
              <ShieldCheck size={24} className="safety-icon" />
              <div>
                <h4>Verified Guarantee</h4>
                <p>100% Legal & Documented</p>
              </div>
            </div>
            <ul className="safety-bullets">
              <li>
                <CheckCircle2 size={14} color="#16a34a" /> Title Deed & Tax Receipts Checked
              </li>
              <li>
                <CheckCircle2 size={14} color="#16a34a" /> Verified Property Owner Identity
              </li>
              <li>
                <CheckCircle2 size={14} color="#16a34a" /> Zero Brokerage Direct Contact
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
