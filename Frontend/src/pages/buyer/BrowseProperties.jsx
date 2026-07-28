import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
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
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./BrowseProperties.css";

const API_URL = "http://localhost:8080";

// Preset popular locations for IntelliSense suggestions
const presetLocations = [
  "Baner, Pune",
  "Hinjewadi, Pune",
  "Kothrud, Pune",
  "Wakad, Pune",
  "Kharadi, Pune",
  "Viman Nagar, Pune",
  "Hadapsar, Pune",
  "Bavdhan, Pune",
  "Aundh, Pune",
  "Pimple Saudagar, Pune",
  "Bandra, Mumbai",
  "Andheri, Mumbai",
  "Whitefield, Bangalore",
];

// Fallback sample data if backend API is offline or empty
const sampleProperties = [
  {
    id: 1,
    title: "Modern 3BHK Apartment",
    location: "Hinjewadi, Pune",
    city: "Pune",
    price: 7200000,
    tag: "For Sale",
    tagClass: "tag-sale",
    listingType: "SALE",
    propertyType: "APARTMENT",
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 1450,
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
    city: "Pune",
    price: 28000,
    tag: "For Rent",
    tagClass: "tag-rent",
    listingType: "RENT",
    propertyType: "APARTMENT",
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1100,
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
    city: "Pune",
    price: 13500000,
    tag: "For Sale",
    tagClass: "tag-sale",
    listingType: "SALE",
    propertyType: "VILLA",
    bedrooms: 4,
    bathrooms: 4,
    areaSqft: 2800,
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
    city: "Pune",
    price: 16000,
    tag: "For Rent",
    tagClass: "tag-rent",
    listingType: "RENT",
    propertyType: "APARTMENT",
    bedrooms: 1,
    bathrooms: 1,
    areaSqft: 650,
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
    city: "Pune",
    price: 6500000,
    tag: "For Sale",
    tagClass: "tag-sale",
    listingType: "SALE",
    propertyType: "APARTMENT",
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1200,
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
    city: "Pune",
    price: 35000,
    tag: "For Rent",
    tagClass: "tag-rent",
    listingType: "RENT",
    propertyType: "APARTMENT",
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 1600,
    beds: "3 Beds",
    baths: "3 Baths",
    sqft: "1600 sq.ft",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
  },
];

export default function BrowseProperties() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");

  // Property list state from API / Fallback
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toggle state to open/collapse horizontal filters bar
  const [showHorizontalFilters, setShowHorizontalFilters] = useState(true);

  // Search & Filter State
  const [locationInput, setLocationInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const locationRef = useRef(null);

  const [propertyType, setPropertyType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  // Horizontal Filter Bar States
  const [selectedListingType, setSelectedListingType] = useState("ALL");
  const [selectedBathrooms, setSelectedBathrooms] = useState("");
  const [maxBudgetLakhs, setMaxBudgetLakhs] = useState(200); // in Lakhs
  const [selectedBhks, setSelectedBhks] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  // Persistent Saved / Favorite State via localStorage
    // Saved property IDs from backend
  const [savedProperties, setSavedProperties] = useState([]);

  // Fetch saved property IDs from backend on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${API_URL}/saved-properties`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const savedIds = res.data.map((item) => item.property.propertyId);
          setSavedProperties(savedIds);
        })
        .catch(() => setSavedProperties([]));
    }
  }, []);

  // Close IntelliSense suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch properties from backend API
  useEffect(() => {
    axios
      .get(`${API_URL}/properties/available`)
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          const formatted = res.data.map((item) => ({
            id: item.propertyId,
            title: item.title,
            location: `${item.city}, ${item.state}`,
            city: item.city,
            price: item.price,
            tag: item.listingType === "RENT" ? "For Rent" : "For Sale",
            tagClass: item.listingType === "RENT" ? "tag-rent" : "tag-sale",
            listingType: item.listingType?.toUpperCase() || "SALE",
            propertyType: item.propertyType?.toUpperCase() || "FLAT",
            bedrooms: item.bedrooms || 1,
            bathrooms: item.bathrooms || 1,
            areaSqft: item.areaSqft || 0,
            beds: `${item.bedrooms || 1} Beds`,
            baths: `${item.bathrooms || 1} Baths`,
            sqft: `${item.areaSqft || 0} sq.ft`,
            image:
              item.images?.[0]?.imageUrl ||
              "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
          }));
          setAllProperties(formatted);
        } else {
          setAllProperties(sampleProperties);
        }
      })
      .catch(() => setAllProperties(sampleProperties))
      .finally(() => setLoading(false));
  }, []);

  // Compute IntelliSense suggestions dynamically
  const locationSuggestions = useMemo(() => {
    const allLocationsSet = new Set([
      ...presetLocations,
      ...allProperties.map((p) => p.location),
    ]);
    const locationsList = Array.from(allLocationsSet);

    if (!locationInput.trim()) {
      return locationsList.slice(0, 6);
    }

    return locationsList.filter((loc) =>
      loc.toLowerCase().includes(locationInput.toLowerCase())
    );
  }, [locationInput, allProperties]);

    // Toggle favorite: save/unsave property via backend API
  const toggleSaveProperty = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to save properties");
      return;
    }

    const isSaved = savedProperties.includes(id);

    try {
      if (isSaved) {
        // Unsave - DELETE request
        await axios.delete(`${API_URL}/saved-properties/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedProperties((prev) => prev.filter((item) => item !== id));
      } else {
        // Save - POST request
        await axios.post(`${API_URL}/saved-properties/${id}`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedProperties((prev) => [...prev, id]);
      }
      window.dispatchEvent(new Event("savedPropertiesUpdated"));
    } catch (err) {
      console.error("Failed to save/unsave property:", err);
      alert("Failed to update saved property. Please try again.");
    }
  };

  // Toggle BHK Pill
  const handleBhkChange = (bhkVal) => {
    setSelectedBhks((prev) =>
      prev.includes(bhkVal)
        ? prev.filter((b) => b !== bhkVal)
        : [...prev, bhkVal]
    );
  };

  // Toggle Type Pill
  const handleTypeCheckbox = (typeVal) => {
    setSelectedTypes((prev) =>
      prev.includes(typeVal)
        ? prev.filter((t) => t !== typeVal)
        : [...prev, typeVal]
    );
  };

  // Reset all filters to default
  const handleResetFilters = () => {
    setLocationInput("");
    setPropertyType("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedListingType("ALL");
    setSelectedBathrooms("");
    setMaxBudgetLakhs(200);
    setSelectedBhks([]);
    setSelectedTypes([]);
  };

  // Active filter chips calculation
  const activeChips = useMemo(() => {
    const chips = [];
    if (locationInput) chips.push({ id: "loc", label: locationInput, type: "loc" });
    if (propertyType) chips.push({ id: "type", label: propertyType, type: "type" });
    if (selectedListingType !== "ALL")
      chips.push({
        id: "ltype",
        label: selectedListingType === "RENT" ? "For Rent" : "For Sale",
        type: "ltype",
      });
    if (selectedBathrooms)
      chips.push({ id: "bath", label: `${selectedBathrooms}+ Baths`, type: "bath" });
    if (minPrice) chips.push({ id: "minP", label: `Min ₹${minPrice}`, type: "minP" });
    if (maxPrice) chips.push({ id: "maxP", label: `Max ₹${maxPrice}`, type: "maxP" });
    selectedBhks.forEach((b) => chips.push({ id: `bhk-${b}`, label: `${b} BHK`, type: "bhk", val: b }));
    selectedTypes.forEach((t) => chips.push({ id: `stype-${t}`, label: t, type: "stype", val: t }));
    return chips;
  }, [locationInput, propertyType, selectedListingType, selectedBathrooms, minPrice, maxPrice, selectedBhks, selectedTypes]);

  // Remove individual filter chip
  const removeChip = (chip) => {
    if (chip.type === "loc") setLocationInput("");
    if (chip.type === "type") setPropertyType("");
    if (chip.type === "ltype") setSelectedListingType("ALL");
    if (chip.type === "bath") setSelectedBathrooms("");
    if (chip.type === "minP") setMinPrice("");
    if (chip.type === "maxP") setMaxPrice("");
    if (chip.type === "bhk") setSelectedBhks((prev) => prev.filter((b) => b !== chip.val));
    if (chip.type === "stype") setSelectedTypes((prev) => prev.filter((t) => t !== chip.val));
  };

  // Main Filtered & Sorted Properties List
  const filteredProperties = useMemo(() => {
    return allProperties
      .filter((item) => {
        // Location filter
        if (
          locationInput &&
          !item.location.toLowerCase().includes(locationInput.toLowerCase()) &&
          !item.title.toLowerCase().includes(locationInput.toLowerCase())
        ) {
          return false;
        }

        // Listing Purpose filter
        if (selectedListingType !== "ALL" && item.listingType !== selectedListingType) {
          return false;
        }

        // Property Type dropdown filter
        if (propertyType && item.propertyType.toLowerCase() !== propertyType.toLowerCase()) {
          return false;
        }

        // Property Type Checkboxes
        if (selectedTypes.length > 0 && !selectedTypes.includes(item.propertyType)) {
          return false;
        }

        // BHK Checkboxes filter
        if (selectedBhks.length > 0) {
          const matchBhk = selectedBhks.some((bhkNum) =>
            bhkNum === 4 ? item.bedrooms >= 4 : item.bedrooms === bhkNum
          );
          if (!matchBhk) return false;
        }

        // Bathrooms filter
        if (selectedBathrooms !== "") {
          const minBaths = parseInt(selectedBathrooms, 10);
          if (item.bathrooms < minBaths) return false;
        }

        // Price Min & Max filters (in Rupees)
        const priceNum = Number(item.price);
        if (minPrice) {
          const minVal = minPrice === "10l" ? 1000000 : minPrice === "25l" ? 2500000 : 5000000;
          if (priceNum < minVal) return false;
        }

        if (maxPrice) {
          const maxVal = maxPrice === "50l" ? 5000000 : maxPrice === "1cr" ? 10000000 : 20000000;
          if (priceNum > maxVal) return false;
        }

        // Budget Range Slider filter (Lakhs)
        const budgetRupees = maxBudgetLakhs * 100000;
        if (priceNum > budgetRupees) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === "price-low-high") return Number(a.price) - Number(b.price);
        if (sortOption === "price-high-low") return Number(b.price) - Number(a.price);
        return b.id - a.id;
      });
  }, [
    allProperties,
    locationInput,
    propertyType,
    selectedListingType,
    selectedTypes,
    selectedBhks,
    selectedBathrooms,
    minPrice,
    maxPrice,
    maxBudgetLakhs,
    sortOption,
  ]);

  const formatDisplayPrice = (priceVal) => {
    if (typeof priceVal === "string" && priceVal.includes("₹")) return priceVal;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(priceVal);
  };

  return (
    <div className="browse-container">
      {/* Page Title Header */}
      <div className="browse-header">
        <h1>Browse Properties</h1>
        <p>Find the perfect property that matches your needs.</p>
      </div>

      {/* Perfectly Aligned Top Main Search Bar */}
      <div className="top-search-bar">
        {/* Location Input with IntelliSense Auto-suggest */}
        <div className="input-group location-input-group" ref={locationRef}>
          <MapPin size={18} className="input-icon" />
          <input
            type="text"
            placeholder="Enter location or title..."
            value={locationInput}
            onChange={(e) => {
              setLocationInput(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            autoComplete="off"
          />

          {/* IntelliSense Location Dropdown */}
          {showSuggestions && locationSuggestions.length > 0 && (
            <div className="intellisense-dropdown">
              <div className="intellisense-header">Suggestions</div>
              {locationSuggestions.map((loc) => (
                <div
                  key={loc}
                  className="suggestion-item"
                  onClick={() => {
                    setLocationInput(loc);
                    setShowSuggestions(false);
                  }}
                >
                  <MapPin size={14} className="suggestion-icon" />
                  <span>{loc}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Property Type Select */}
        <div className="input-group">
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="">Property Type (All)</option>
            <option value="APARTMENT">Apartment / Flat</option>
            <option value="VILLA">Villa</option>
            <option value="HOUSE">Independent House</option>
            <option value="PLOT">Plot</option>
          </select>
          <ChevronDown size={16} className="dropdown-arrow" />
        </div>

        {/* Min Price Select */}
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

        {/* Max Price Select */}
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

        {/* Primary Search Action Button */}
        <button className="search-btn" onClick={() => setShowSuggestions(false)}>
          <Search size={18} /> Search
        </button>
      </div>

      {/* Active Filters Row with Filters Toggle Button */}
      <div className="active-filters-bar">
        <button
          className={`filters-toggle-btn ${showHorizontalFilters ? "active" : ""}`}
          onClick={() => setShowHorizontalFilters((prev) => !prev)}
        >
          <SlidersHorizontal size={16} /> Filters{" "}
          {activeChips.length > 0 && `(${activeChips.length})`}
        </button>

        <div className="filter-chips">
          {activeChips.map((chip) => (
            <span key={chip.id} className="chip">
              {chip.label}{" "}
              <X
                size={14}
                onClick={() => removeChip(chip)}
                style={{ cursor: "pointer" }}
              />
            </span>
          ))}
          {activeChips.length > 0 && (
            <button className="clear-all-btn" onClick={handleResetFilters}>
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Full-Width Horizontal Filter Bar */}
      {showHorizontalFilters && (
        <div className="horizontal-filter-panel">
          {/* Listing Purpose */}
          <div className="h-filter-item">
            <span className="h-filter-label">Purpose</span>
            <div className="h-pills-row">
              {["ALL", "RENT", "SALE"].map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`h-pill-btn ${selectedListingType === type ? "active" : ""}`}
                  onClick={() => setSelectedListingType(type)}
                >
                  {type === "ALL" ? "All" : type === "RENT" ? "Rent" : "Sale"}
                </button>
              ))}
            </div>
          </div>

          {/* BHK Type */}
          <div className="h-filter-item">
            <span className="h-filter-label">BHK Type</span>
            <div className="h-pills-row">
              {[1, 2, 3, 4].map((bhkNum) => (
                <button
                  key={bhkNum}
                  type="button"
                  className={`h-pill-btn ${selectedBhks.includes(bhkNum) ? "active" : ""}`}
                  onClick={() => handleBhkChange(bhkNum)}
                >
                  {bhkNum === 4 ? "4+ BHK" : `${bhkNum} BHK`}
                </button>
              ))}
            </div>
          </div>

          {/* Property Types */}
          <div className="h-filter-item">
            <span className="h-filter-label">Property Type</span>
            <div className="h-pills-row">
              {[
                { label: "Flat", val: "APARTMENT" },
                { label: "Villa", val: "VILLA" },
                { label: "House", val: "HOUSE" },
                { label: "Plot", val: "PLOT" },
              ].map((typeObj) => (
                <button
                  key={typeObj.val}
                  type="button"
                  className={`h-pill-btn ${selectedTypes.includes(typeObj.val) ? "active" : ""}`}
                  onClick={() => handleTypeCheckbox(typeObj.val)}
                >
                  {typeObj.label}
                </button>
              ))}
            </div>
          </div>

          {/* Max Budget Slider */}
          <div className="h-filter-item slider-item">
            <div className="slider-label-row">
              <span className="h-filter-label">Max Budget:</span>
              <span className="slider-value-badge">₹ {maxBudgetLakhs} Lakhs</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              value={maxBudgetLakhs}
              onChange={(e) => setMaxBudgetLakhs(Number(e.target.value))}
              className="range-slider"
            />
          </div>

          {/* Bathrooms */}
          <div className="h-filter-item">
            <span className="h-filter-label">Baths</span>
            <div className="h-pills-row">
              {["", "1", "2", "3"].map((bathVal) => (
                <button
                  key={bathVal}
                  type="button"
                  className={`h-pill-btn ${selectedBathrooms === bathVal ? "active" : ""}`}
                  onClick={() => setSelectedBathrooms(bathVal)}
                >
                  {bathVal === "" ? "Any" : bathVal === "3" ? "3+" : bathVal}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Action Button */}
          <div className="h-filter-actions">
            <button className="h-reset-btn" onClick={handleResetFilters} title="Reset all filters">
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>
      )}

      {/* Main Results Layout */}
      <div className="results-section full-width">
        {/* Toolbar */}
        <div className="results-toolbar">
          <span className="results-count">
            {filteredProperties.length} Properties Found
          </span>

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
        {loading && <p>Loading properties...</p>}
        {!loading && filteredProperties.length === 0 && (
          <div
            className="no-results-box"
            style={{ padding: "40px 0", textAlign: "center" }}
          >
            <h3>No Properties Found</h3>
            <p>Try resetting or adjusting your filter criteria.</p>
            <button
              className="clear-all-btn"
              onClick={handleResetFilters}
              style={{ marginTop: "12px" }}
            >
              Reset Filters
            </button>
          </div>
        )}

        <div className={`properties-grid ${viewMode}-view full-width-grid`}>
          {filteredProperties.map((property) => {
            const isSaved = savedProperties.includes(property.id);
            return (
              <div
                key={property.id}
                className="property-card"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/buyer/property-details")}
              >
                <div className="card-image-wrapper">
                  <img src={property.image} alt={property.title} />
                  <span className={`tag-badge ${property.tagClass}`}>
                    {property.tag}
                  </span>
                  <button
                    className={`heart-btn ${isSaved ? "saved" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveProperty(property.id);
                    }}
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
                  <div className="property-price">
                    {formatDisplayPrice(property.price)}
                  </div>

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
    </div>
  );
}