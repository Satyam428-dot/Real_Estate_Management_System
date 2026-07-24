import React, { useState } from "react";
import {
  Search,
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
  SlidersHorizontal,
} from "lucide-react";
import "./SavedProperties.css";

export default function SavedProperties() {
  const [activeTab, setActiveTab] = useState("all");
  const [sortOption, setSortOption] = useState("recently-saved");
  const [viewMode, setViewMode] = useState("grid");

  const [savedProperties, setSavedProperties] = useState([
    {
      id: 1,
      title: "Modern 3BHK Apartment",
      location: "Hinjewadi, Pune",
      price: "₹ 72,00,000",
      status: "For Sale",
      tagClass: "tag-sale",
      type: "sale",
      beds: "3 Beds",
      baths: "3 Baths",
      sqft: "1450 sq.ft",
      savedDate: "20 May 2024",
      image:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      title: "Luxury 2BHK Apartment",
      location: "Baner, Pune",
      price: "₹ 28,000 /month",
      status: "For Rent",
      tagClass: "tag-rent",
      type: "rent",
      beds: "2 Beds",
      baths: "2 Baths",
      sqft: "1100 sq.ft",
      savedDate: "18 May 2024",
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 3,
      title: "Elegant Villa",
      location: "Kothrud, Pune",
      price: "₹ 1,35,00,000",
      status: "For Sale",
      tagClass: "tag-sale",
      type: "sale",
      beds: "4 Beds",
      baths: "4 Baths",
      sqft: "2800 sq.ft",
      savedDate: "15 May 2024",
      image:
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 4,
      title: "Spacious 1BHK Apartment",
      location: "Wakad, Pune",
      price: "₹ 16,000 /month",
      status: "For Rent",
      tagClass: "tag-rent",
      type: "rent",
      beds: "1 Bed",
      baths: "1 Bath",
      sqft: "650 sq.ft",
      savedDate: "12 May 2024",
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 5,
      title: "Premium 2BHK Apartment",
      location: "Kharadi, Pune",
      price: "₹ 65,00,000",
      status: "For Sale",
      tagClass: "tag-sale",
      type: "sale",
      beds: "2 Beds",
      baths: "2 Baths",
      sqft: "1200 sq.ft",
      savedDate: "10 May 2024",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 6,
      title: "Furnished 3BHK Apartment",
      location: "Viman Nagar, Pune",
      price: "₹ 35,000 /month",
      status: "For Rent",
      tagClass: "tag-rent",
      type: "rent",
      beds: "3 Beds",
      baths: "3 Baths",
      sqft: "1600 sq.ft",
      savedDate: "8 May 2024",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 7,
      title: "Independent House",
      location: "Aundh, Pune",
      price: "₹ 2,10,00,000",
      status: "For Sale",
      tagClass: "tag-sale",
      type: "sale",
      beds: "4 Beds",
      baths: "4 Baths",
      sqft: "3200 sq.ft",
      savedDate: "5 May 2024",
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 8,
      title: "2BHK Apartment",
      location: "Kharadi, Pune",
      price: "₹ 27,000 /month",
      status: "For Rent",
      tagClass: "tag-rent",
      type: "rent",
      beds: "2 Beds",
      baths: "2 Baths",
      sqft: "1050 sq.ft",
      savedDate: "3 May 2024",
      image:
        "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=600&q=80",
    },
  ]);

  // Handle Unsaving/Removing Property
  const handleRemoveSaved = (id) => {
    setSavedProperties((prev) => prev.filter((item) => item.id !== id));
  };

  // Filter Properties based on active tab
  const filteredProperties = savedProperties.filter((property) => {
    if (activeTab === "sale") return property.type === "sale";
    if (activeTab === "rent") return property.type === "rent";
    return true;
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

      {/* Property Grid Container */}
      <div className={`saved-grid ${viewMode}-view`}>
        {filteredProperties.map((property) => (
          <div key={property.id} className="saved-card">
            {/* Image Container */}
            <div className="card-image-wrapper">
              <img src={property.image} alt={property.title} />
              <span className={`status-badge ${property.tagClass}`}>
                {property.status}
              </span>
              <button
                className="favorite-btn active"
                onClick={() => handleRemoveSaved(property.id)}
                title="Remove from saved"
              >
                <Heart size={16} fill="#ef4444" color="#ef4444" />
              </button>
            </div>

            {/* Card Content Details */}
            <div className="card-content">
              <h3 className="property-title">{property.title}</h3>
              <p className="property-location">{property.location}</p>
              <div className="property-price">{property.price}</div>

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

      {/* Load More Button */}
      {filteredProperties.length > 0 && (
        <div className="load-more-wrapper">
          <button className="load-more-btn">
            Load More Properties <ChevronDown size={16} />
          </button>
        </div>
      )}
    </div>
  );
}