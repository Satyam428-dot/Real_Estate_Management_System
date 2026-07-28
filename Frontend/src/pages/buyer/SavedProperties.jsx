import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  List,
  Heart,
  Bed,
  Bath,
  Maximize,
  Calendar,
  MoreVertical,
  ChevronDown,
  Building2,
  Home,
  Loader,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./SavedProperties.css";

const API_URL = "http://localhost:8080";

export default function SavedProperties() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [sortOption, setSortOption] = useState("recently-saved");
  const [viewMode, setViewMode] = useState("grid");
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch saved properties from backend
  const fetchSavedProperties = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/saved-properties`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formatted = res.data.map((item) => ({
        id: item.savedId,
        propertyId: item.property.propertyId,
        title: item.property.title,
        location: `${item.property.city}, ${item.property.state}`,
        price: item.property.price,
        status: item.property.listingType === "RENT" ? "For Rent" : "For Sale",
        tagClass:
          item.property.listingType === "RENT" ? "tag-rent" : "tag-sale",
        type: item.property.listingType === "RENT" ? "rent" : "sale",
        beds: `${item.property.bedrooms || 1} Beds`,
        baths: `${item.property.bathrooms || 1} Baths`,
        sqft: `${item.property.areaSqft || 0} sq.ft`,
        savedDate: item.savedOn
          ? new Date(item.savedOn).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "Recently",
        image:
          item.property.images?.[0]?.imageUrl ||
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
      }));

      setSavedProperties(formatted);
    } catch (err) {
      console.error("Failed to fetch saved properties:", err);
      setSavedProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedProperties();
  }, []);

  // Listen for save/unsave events from BrowseProperties page
  useEffect(() => {
    const handleUpdate = () => fetchSavedProperties();
    window.addEventListener("savedPropertiesUpdated", handleUpdate);
    return () =>
      window.removeEventListener("savedPropertiesUpdated", handleUpdate);
  }, []);

  // Handle Unsaving/Removing Property via backend
  const handleRemoveSaved = async (propertyId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`${API_URL}/saved-properties/${propertyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedProperties((prev) =>
        prev.filter((item) => item.propertyId !== propertyId)
      );
      window.dispatchEvent(new Event("savedPropertiesUpdated"));
    } catch (err) {
      console.error("Failed to remove saved property:", err);
      alert("Failed to remove property. Please try again.");
    }
  };

  // Format price for display
  const formatDisplayPrice = (priceVal) => {
    if (typeof priceVal === "string" && priceVal.includes("₹")) return priceVal;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(priceVal);
  };

  // Filter Properties based on active tab
  const filteredProperties = savedProperties.filter((property) => {
    if (activeTab === "sale") return property.type === "sale";
    if (activeTab === "rent") return property.type === "rent";
    return true;
  });

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortOption === "price-low-high")
      return Number(a.price) - Number(b.price);
    if (sortOption === "price-high-low")
      return Number(b.price) - Number(a.price);
    return b.id - a.id; // recently-saved (newest first)
  });

  const countSale = savedProperties.filter((p) => p.type === "sale").length;
  const countRent = savedProperties.filter((p) => p.type === "rent").length;

  return (
    <div className="saved-properties-container">
      {/* Header Title Section */}
      <div className="saved-header">
        <h1>Saved Properties</h1>
        <p>Your saved properties that you might be interested in.</p>
      </div>

      {/* Toolbar / Filter Options Bar */}
      <div className="saved-toolbar">
        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button
            className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            <Grid className="tab-icon" size={16} />
            All Properties ({savedProperties.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "sale" ? "active" : ""}`}
            onClick={() => setActiveTab("sale")}
          >
            <Building2 className="tab-icon" size={16} />
            For Sale ({countSale})
          </button>
          <button
            className={`tab-btn ${activeTab === "rent" ? "active" : ""}`}
            onClick={() => setActiveTab("rent")}
          >
            <Home className="tab-icon" size={16} />
            For Rent ({countRent})
          </button>
        </div>

        {/* Right Action Controls: Sort & View Switches */}
        <div className="toolbar-actions">
          <div className="sort-dropdown-container">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="sort-dropdown"
            >
              <option value="recently-saved">Sort by: Recently Saved</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>
          </div>

          <div className="view-mode-toggle">
            <button
              className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Grid View"
            >
              <Grid size={18} />
            </button>
            <button
              className={`view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
              title="List View"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ padding: "60px 0", textAlign: "center" }}>
          <Loader size={32} className="spinning" />
          <p style={{ marginTop: "12px", color: "#64748b" }}>
            Loading saved properties...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && savedProperties.length === 0 && (
        <div style={{ padding: "60px 0", textAlign: "center" }}>
          <Heart size={48} color="#cbd5e1" />
          <h3 style={{ marginTop: "16px", color: "#334155" }}>
            No Saved Properties
          </h3>
          <p style={{ color: "#64748b" }}>
            Browse properties and click the heart icon to save them here.
          </p>
          <button
            onClick={() => navigate("/buyer/browse")}
            style={{
              marginTop: "16px",
              padding: "10px 24px",
              background: "#6366f1",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Browse Properties
          </button>
        </div>
      )}

      {/* Property Grid Container */}
      {!loading && sortedProperties.length > 0 && (
        <div className={`saved-grid ${viewMode}-view`}>
          {sortedProperties.map((property) => (
            <div key={property.id} className="saved-card">
              {/* Image Container */}
              <div className="card-image-wrapper">
                <img src={property.image} alt={property.title} />
                <span className={`status-badge ${property.tagClass}`}>
                  {property.status}
                </span>
                <button
                  className="favorite-btn active"
                  onClick={() => handleRemoveSaved(property.propertyId)}
                  title="Remove from saved"
                >
                  <Heart size={16} fill="#ef4444" color="#ef4444" />
                </button>
              </div>

              {/* Card Content Details */}
              <div className="card-content">
                <h3 className="property-title">{property.title}</h3>
                <p className="property-location">{property.location}</p>
                <div className="property-price">
                  {formatDisplayPrice(property.price)}
                </div>

                {/* Specifications Bar */}
                <div className="property-specs">
                  <span className="spec-item">
                    <Bed size={15} /> {property.beds}
                  </span>
                  <span className="spec-item">
                    <Bath size={15} /> {property.baths}
                  </span>
                  <span className="spec-item">
                    <Maximize size={15} /> {property.sqft}
                  </span>
                </div>

                {/* Saved Date & Actions Footer */}
                <div className="card-footer">
                  <div className="saved-date">
                    <Calendar size={14} /> Saved on {property.savedDate}
                  </div>
                  <button className="more-options-btn">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
