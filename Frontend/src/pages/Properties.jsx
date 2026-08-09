import { JAVA_BACKEND_URL } from "../utils/config";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  Lock,
  UserPlus,
  LogIn,
} from "lucide-react";
import Navbar from "../components/jsx/Navbar";
import Footer from "../components/jsx/Footer";
import "./buyer/BrowseProperties.css";

const API_URL = `${JAVA_BACKEND_URL}`;

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

export default function Properties() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");

  // Property list state from API / Fallback
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State for Unregistered / Guest Users
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedPropertyTitle, setSelectedPropertyTitle] = useState("");

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
  const [selectedBhks, setSelectedBhks] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  // Calculate lowest and highest property price available in database
  const { minDbPrice, maxDbPrice } = useMemo(() => {
    if (!allProperties || allProperties.length === 0) {
      return { minDbPrice: 0, maxDbPrice: 20000000 };
    }
    const prices = allProperties
      .map((p) => Number(p.price) || 0)
      .filter((p) => p > 0);
    if (prices.length === 0) {
      return { minDbPrice: 0, maxDbPrice: 20000000 };
    }
    return {
      minDbPrice: Math.min(...prices),
      maxDbPrice: Math.max(...prices),
    };
  }, [allProperties]);

  const [budgetMin, setBudgetMin] = useState(null);
  const [budgetMax, setBudgetMax] = useState(null);

  // Sync default budget range when database properties are loaded
  useEffect(() => {
    if (minDbPrice !== undefined && maxDbPrice !== undefined) {
      setBudgetMin((prev) => (prev === null || prev < minDbPrice ? minDbPrice : prev));
      setBudgetMax((prev) => (prev === null || prev > maxDbPrice ? maxDbPrice : prev));
    }
  }, [minDbPrice, maxDbPrice]);

  const effectiveMinBudget = budgetMin !== null ? budgetMin : minDbPrice;
  const effectiveMaxBudget = budgetMax !== null ? budgetMax : maxDbPrice;

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

  // Handle guest card click -> Prompt Register First Modal
  const handleCardClick = (title) => {
    setSelectedPropertyTitle(title || "this property");
    setShowRegisterModal(true);
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

  const formatShortPrice = (val) => {
    if (val === undefined || val === null || isNaN(val)) return "₹0";
    if (val >= 10000000) {
      const cr = val / 10000000;
      return `₹${cr % 1 === 0 ? cr : cr.toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      const lakh = val / 100000;
      return `₹${lakh % 1 === 0 ? lakh : lakh.toFixed(2)} L`;
    }
    return `₹${Number(val).toLocaleString("en-IN")}`;
  };

  // Reset all filters to default
  const handleResetFilters = () => {
    setLocationInput("");
    setPropertyType("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedListingType("ALL");
    setSelectedBathrooms("");
    setBudgetMin(minDbPrice);
    setBudgetMax(maxDbPrice);
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
    if (minPrice) chips.push({ id: "minP", label: `Min ${formatShortPrice(Number(minPrice))}`, type: "minP" });
    if (maxPrice) chips.push({ id: "maxP", label: `Max ${formatShortPrice(Number(maxPrice))}`, type: "maxP" });
    if (effectiveMinBudget > minDbPrice)
      chips.push({ id: "bMin", label: `Min ${formatShortPrice(effectiveMinBudget)}`, type: "bMin" });
    if (effectiveMaxBudget < maxDbPrice)
      chips.push({ id: "bMax", label: `Max ${formatShortPrice(effectiveMaxBudget)}`, type: "bMax" });
    selectedBhks.forEach((b) => chips.push({ id: `bhk-${b}`, label: `${b} BHK`, type: "bhk", val: b }));
    selectedTypes.forEach((t) => chips.push({ id: `stype-${t}`, label: t, type: "stype", val: t }));
    return chips;
  }, [
    locationInput,
    propertyType,
    selectedListingType,
    selectedBathrooms,
    minPrice,
    maxPrice,
    effectiveMinBudget,
    effectiveMaxBudget,
    minDbPrice,
    maxDbPrice,
    selectedBhks,
    selectedTypes,
  ]);

  // Remove individual filter chip
  const removeChip = (chip) => {
    if (chip.type === "loc") setLocationInput("");
    if (chip.type === "type") setPropertyType("");
    if (chip.type === "ltype") setSelectedListingType("ALL");
    if (chip.type === "bath") setSelectedBathrooms("");
    if (chip.type === "minP") setMinPrice("");
    if (chip.type === "maxP") setMaxPrice("");
    if (chip.type === "bMin") setBudgetMin(minDbPrice);
    if (chip.type === "bMax") setBudgetMax(maxDbPrice);
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

        const priceNum = Number(item.price);

        // Price Min & Max filters from top dropdowns
        if (minPrice && priceNum < Number(minPrice)) return false;
        if (maxPrice && priceNum > Number(maxPrice)) return false;

        // Dynamic Budget Range Filter (Lowest to Highest DB Price)
        if (priceNum < effectiveMinBudget || priceNum > effectiveMaxBudget) {
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
    effectiveMinBudget,
    effectiveMaxBudget,
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
    <div className="public-properties-wrapper">
      <Navbar />

      <div className="browse-container">
        {/* Page Title Header */}
        <div className="browse-header">
          <h1>Explore Our Properties</h1>
          <p>Discover premium homes, luxury apartments, and modern condos tailored to your lifestyle.</p>
        </div>

        {/* Top Main Search Bar */}
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
              <option value="">Min Price (Any)</option>
              <option value="15000">₹ 15,000</option>
              <option value="30000">₹ 30,000</option>
              <option value="1000000">₹ 10 Lakhs</option>
              <option value="2500000">₹ 25 Lakhs</option>
              <option value="5000000">₹ 50 Lakhs</option>
              <option value="10000000">₹ 1 Crore</option>
            </select>
            <ChevronDown size={16} className="dropdown-arrow" />
          </div>

          {/* Max Price Select */}
          <div className="input-group">
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            >
              <option value="">Max Price (Any)</option>
              <option value="50000">₹ 50,000</option>
              <option value="2500000">₹ 25 Lakhs</option>
              <option value="5000000">₹ 50 Lakhs</option>
              <option value="10000000">₹ 1 Crore</option>
              <option value="20000000">₹ 2 Crores+</option>
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

            {/* Dynamic Budget Range Filter */}
            <div className="h-filter-item slider-item budget-range-container">
              <div className="slider-label-row">
                <span className="h-filter-label">Budget Range:</span>
                <span className="slider-value-badge">
                  {formatShortPrice(effectiveMinBudget)} - {formatShortPrice(effectiveMaxBudget)}
                </span>
              </div>
              <div className="range-inputs-wrapper">
                <div className="range-slider-group">
                  <span className="range-bound-label">Min:</span>
                  <input
                    type="range"
                    min={minDbPrice}
                    max={maxDbPrice}
                    step={maxDbPrice - minDbPrice > 1000000 ? 50000 : 1000}
                    value={effectiveMinBudget}
                    onChange={(e) => {
                      const val = Math.min(Number(e.target.value), effectiveMaxBudget);
                      setBudgetMin(val);
                    }}
                    className="range-slider min-slider"
                  />
                </div>
                <div className="range-slider-group">
                  <span className="range-bound-label">Max:</span>
                  <input
                    type="range"
                    min={minDbPrice}
                    max={maxDbPrice}
                    step={maxDbPrice - minDbPrice > 1000000 ? 50000 : 1000}
                    value={effectiveMaxBudget}
                    onChange={(e) => {
                      const val = Math.max(Number(e.target.value), effectiveMinBudget);
                      setBudgetMax(val);
                    }}
                    className="range-slider max-slider"
                  />
                </div>
              </div>
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
          {loading && <p className="text-center text-muted py-4">Loading properties...</p>}
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
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="property-card"
                style={{ cursor: "pointer" }}
                onClick={() => handleCardClick(property.title)}
              >
                <div className="card-image-wrapper">
                  <img src={property.image} alt={property.title} />
                  <span className={`tag-badge ${property.tagClass}`}>
                    {property.tag}
                  </span>
                  <button
                    className="heart-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(property.title);
                    }}
                    title="Register to save property"
                  >
                    <Heart size={16} color="#64748b" />
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
            ))}
          </div>
        </div>
      </div>

      <Footer />

      {/* Register First Modal for Guest Users */}
      {showRegisterModal && (
        <div className="register-modal-overlay">
          <div className="register-modal-content">
            <button
              className="modal-close-btn"
              onClick={() => setShowRegisterModal(false)}
            >
              <X size={20} />
            </button>

            <div className="register-modal-header">
              <div className="modal-icon-badge">
                <Lock size={32} />
              </div>
              <h2>Please Register First</h2>
              <p>
                To view complete details, save favorites, or schedule site visits for{" "}
                <strong>{selectedPropertyTitle}</strong>, please create an account or sign in to your PropertyHQ account.
              </p>
            </div>

            <div className="register-modal-actions">
              <button
                className="modal-btn modal-btn-primary"
                onClick={() => navigate("/Register")}
              >
                <UserPlus size={18} /> Register Now
              </button>
              <button
                className="modal-btn modal-btn-outline"
                onClick={() => navigate("/Login")}
              >
                <LogIn size={18} /> Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded CSS for Modal Styling */}
      <style>{`
        .register-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
          animation: modalFadeIn 0.25s ease-out;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .register-modal-content {
          position: relative;
          background: #ffffff;
          border-radius: 20px;
          padding: 36px 32px;
          max-width: 460px;
          width: 100%;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          text-align: center;
          border: 1px solid #e2e8f0;
        }

        .modal-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: #f1f5f9;
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          cursor: pointer;
          transition: background-color 0.2s ease, color 0.2s ease;
        }

        .modal-close-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .modal-icon-badge {
          width: 68px;
          height: 68px;
          margin: 0 auto 20px auto;
          border-radius: 50%;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
        }

        .register-modal-header h2 {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 12px 0;
          letter-spacing: -0.3px;
        }

        .register-modal-header p {
          font-size: 14.5px;
          color: #64748b;
          line-height: 1.6;
          margin: 0 0 28px 0;
        }

        .register-modal-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .modal-btn {
          width: 100%;
          height: 48px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .modal-btn-primary {
          background-color: #2563eb;
          color: #ffffff;
          border: none;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
        }

        .modal-btn-primary:hover {
          background-color: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
        }

        .modal-btn-outline {
          background-color: #ffffff;
          color: #2563eb;
          border: 2px solid #2563eb;
        }

        .modal-btn-outline:hover {
          background-color: #eff6ff;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
