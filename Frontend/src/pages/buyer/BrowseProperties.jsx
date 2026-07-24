import React, { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Heart,
  Grid,
  List,
  X,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import "./BrowseProperties.css";

export default function BrowseProperties() {
  const [viewMode, setViewMode] = useState("grid");
  const [locationInput, setLocationInput] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [budgetRange, setBudgetRange] = useState(100);

  // Filter Chips state
  const [activeFilters, setActiveFilters] = useState([
    { id: 1, label: "Apartment", key: "type" },
    { id: 2, label: "For Sale", key: "status" },
    { id: 3, label: "2+ BHK", key: "bhk" },
  ]);

  // Saved/Favorite State
  const [savedProperties, setSavedProperties] = useState([]);

  const toggleSaveProperty = (id) => {
    setSavedProperties((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const removeFilterTag = (id) => {
    setActiveFilters((prev) => prev.filter((filter) => filter.id !== id));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
  };

  // Sample Property Data matching browse.png
  const properties = [
    {
      id: 1,
      title: "Modern 3BHK Apartment",
      location: "Hinjewadi, Pune",
      price: "₹ 72,00,000",
      tag: "For Sale",
      tagClass: "tag-sale",
      beds: "3 Beds",
      baths: "3 Baths",
      sqft: "1450 sq.ft",
      image:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      title: "Luxury 2BHK Apartment",
      location: "Baner, Pune",
      price: "₹ 28,000 /month",
      tag: "For Rent",
      tagClass: "tag-rent",
      beds: "2 Beds",
      baths: "2 Baths",
      sqft: "1100 sq.ft",
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 3,
      title: "Elegant Villa",
      location: "Kothrud, Pune",
      price: "₹ 1,35,00,000",
      tag: "For Sale",
      tagClass: "tag-sale",
      beds: "4 Beds",
      baths: "4 Baths",
      sqft: "2800 sq.ft",
      image:
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 4,
      title: "Spacious 1BHK Apartment",
      location: "Wakad, Pune",
      price: "₹ 16,000 /month",
      tag: "For Rent",
      tagClass: "tag-rent",
      beds: "1 Bed",
      baths: "1 Bath",
      sqft: "650 sq.ft",
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 5,
      title: "Premium 2BHK Apartment",
      location: "Kharadi, Pune",
      price: "₹ 65,00,000",
      tag: "For Sale",
      tagClass: "tag-sale",
      beds: "2 Beds",
      baths: "2 Baths",
      sqft: "1200 sq.ft",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 6,
      title: "Furnished 3BHK Apartment",
      location: "Viman Nagar, Pune",
      price: "₹ 35,000 /month",
      tag: "For Rent",
      tagClass: "tag-rent",
      beds: "3 Beds",
      baths: "3 Baths",
      sqft: "1600 sq.ft",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <div className="browse-container">
      {/* Page Title Header */}
      <div className="browse-header">
        <h1>Browse Properties</h1>
        <p>Find the perfect property that matches your needs.</p>
      </div>

      {/* Top Main Search Controls */}
      <div className="top-search-bar">
        <div className="input-group location-input-group">
          <MapPin size={18} className="input-icon" />
          <input
            type="text"
            placeholder="Enter location"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
          />
        </div>

        <div className="input-group">
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="">Property Type</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="independent-house">Independent House</option>
            <option value="plot">Plot</option>
          </select>
          <ChevronDown size={16} className="dropdown-arrow" />
        </div>

        <div className="input-group">
          <select
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          >
            <option value="">Min Price</option>
            <option value="10l">₹ 10 Lakhs</option>
            <option value="25l">₹ 25 Lakhs</option>
            <option value="50l">₹ 50 Lakhs</option>
          </select>
          <ChevronDown size={16} className="dropdown-arrow" />
        </div>

        <div className="input-group">
          <select
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          >
            <option value="">Max Price</option>
            <option value="50l">₹ 50 Lakhs</option>
            <option value="1cr">₹ 1 Crore</option>
            <option value="2cr">₹ 2 Crores+</option>
          </select>
          <ChevronDown size={16} className="dropdown-arrow" />
        </div>

        <button className="search-btn">
          <Search size={18} /> Search
        </button>
      </div>

      {/* Active Filters Row */}
      <div className="active-filters-bar">
        <button className="filters-toggle-btn">
          <SlidersHorizontal size={16} /> Filters
        </button>

        <div className="filter-chips">
          {activeFilters.map((filter) => (
            <span key={filter.id} className="chip">
              {filter.label}{" "}
              <X size={14} onClick={() => removeFilterTag(filter.id)} />
            </span>
          ))}
          {activeFilters.length > 0 && (
            <button className="clear-all-btn" onClick={clearAllFilters}>
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="browse-content-layout">
        {/* Left Section: Results Header & Grid */}
        <div className="results-section">
          {/* Toolbar */}
          <div className="results-toolbar">
            <span className="results-count">128 Properties Found</span>

            <div className="toolbar-controls">
              <div className="sort-dropdown-container">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="newest">Sort by: Newest</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                </select>
                <ChevronDown size={16} className="dropdown-arrow" />
              </div>

              <div className="view-mode-switch">
                <button
                  className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid size={18} />
                </button>
                <button
                  className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className={`properties-grid ${viewMode}-view`}>
            {properties.map((property) => {
              const isSaved = savedProperties.includes(property.id);
              return (
                <div key={property.id} className="property-card">
                  <div className="card-image-wrapper">
                    <img src={property.image} alt={property.title} />
                    <span className={`tag-badge ${property.tagClass}`}>
                      {property.tag}
                    </span>
                    <button
                      className={`heart-btn ${isSaved ? "saved" : ""}`}
                      onClick={() => toggleSaveProperty(property.id)}
                    >
                      <Heart
                        size={16}
                        fill={isSaved ? "#ef4444" : "none"}
                        color={isSaved ? "#ef4444" : "#64748b"}
                      />
                    </button>
                  </div>

                  <div className="card-details">
                    <h3 className="property-title">{property.title}</h3>
                    <p className="property-location">
                      <MapPin size={13} /> {property.location}
                    </p>
                    <div className="property-price">{property.price}</div>

                    <div className="property-specs">
                      <span>
                        <Bed size={14} /> {property.beds}
                      </span>
                      <span>
                        <Bath size={14} /> {property.baths}
                      </span>
                      <span>
                        <Maximize size={14} /> {property.sqft}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar Section: Map & Quick Filters */}
        <div className="browse-sidebar">
          {/* Map Container Widget */}
          <div className="sidebar-card map-card">
            <div className="card-header">
              <h3>Explore on Map</h3>
              <a href="#map-expand" className="external-link-btn">
                <ExternalLink size={16} />
              </a>
            </div>
            <div className="map-view-box">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80"
                alt="Map Pin View"
              />
              <span className="map-pin pin-hinjewadi">
                <MapPin size={12} className="pin-icon" /> Hinjewadi
              </span>
              <span className="map-pin pin-baner">
                <MapPin size={12} className="pin-icon" /> Baner
              </span>
              <span className="map-pin pin-pune">Pune</span>
              <span className="map-pin pin-kothrud">
                <MapPin size={12} className="pin-icon" /> Kothrud
              </span>
              <span className="map-pin pin-kharadi">
                <MapPin size={12} className="pin-icon" /> Kharadi
              </span>
              <span className="map-pin pin-viman">
                <MapPin size={12} className="pin-icon" /> Viman Nagar
              </span>
            </div>
          </div>

          {/* Quick Filters Widget */}
          <div className="sidebar-card quick-filters-card">
            <h3>Quick Filters</h3>

            {/* Budget Range Slider */}
            <div className="filter-group">
              <label>Budget Range</label>
              <input
                type="range"
                min="10"
                max="200"
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="range-slider"
              />
              <div className="range-labels">
                <span>₹ 10L</span>
                <span>₹ 2Cr+</span>
              </div>
            </div>

            {/* BHK Type Filter */}
            <div className="filter-group">
              <label>BHK Type</label>
              <div className="checkbox-grid">
                <label className="checkbox-label">
                  <input type="checkbox" /> 1 BHK
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" /> 2 BHK
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked /> 3 BHK
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" /> 4+ BHK
                </label>
              </div>
            </div>

            {/* Property Type Filter */}
            <div className="filter-group">
              <label>Property Type</label>
              <div className="checkbox-list">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked /> Apartment
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" /> Villa
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" /> Independent House
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" /> Plot
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="quick-filter-actions">
              <button className="apply-btn">Apply Filters</button>
              <button className="reset-btn">Reset</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}