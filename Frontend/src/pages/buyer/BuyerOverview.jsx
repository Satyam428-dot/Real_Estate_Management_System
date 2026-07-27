import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { favouritesApi } from "../../utils/buyerApi";
import {
  Building,
  Heart,
  Calendar,
  Bookmark,
  Search,
  MapPin,
  Bed,
  Bath,
  Maximize,
  ChevronDown,
} from "lucide-react";
import "./BuyerOverview.css";

const API_URL = "http://localhost:8080";

export default function BuyerOverview() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Real-time Saved Properties Count state
  const [savedCount, setSavedCount] = useState(0);

  // Form Filter State
  const [location, setLocation] = useState("Pune, Maharashtra");
  const [propertyType, setPropertyType] = useState("ALL");
  const [priceRange, setPriceRange] = useState("ALL");
  const [bhk, setBhk] = useState("ALL");

  // Active Applied Search State
  const [activeSearch, setActiveSearch] = useState({
    location: "Pune, Maharashtra",
    propertyType: "ALL",
    priceRange: "ALL",
    bhk: "ALL",
  });

  useEffect(() => {
    // Fetch available properties from backend
    axios
      .get(`${API_URL}/properties/available`)
      .then((response) => setProperties(response.data))
      .catch(() =>
        setError("Unable to load available properties. Please try again.")
      )
      .finally(() => setLoading(false));

    const updateSavedCount = () => favouritesApi.ids().then(({ data }) => setSavedCount(data.length)).catch(() => setSavedCount(0));

    updateSavedCount();
    window.addEventListener("savedPropertiesUpdated", updateSavedCount);
    return () =>
      window.removeEventListener("savedPropertiesUpdated", updateSavedCount);
  }, []);

  const formatPrice = (price, listingType) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price) + (listingType === "RENT" ? " / month" : "");

  // Trigger search execution
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setActiveSearch({
      location,
      propertyType,
      priceRange,
      bhk,
    });
  };

  // Popular search chip click handler
  const handlePopularSearch = (chipText) => {
    let newSearch = { location: "ALL", propertyType: "ALL", priceRange: "ALL", bhk: "ALL" };

    if (chipText === "2 BHK Apartments") {
      newSearch = { location: "ALL", propertyType: "APARTMENT", priceRange: "ALL", bhk: "2" };
    } else if (chipText === "Flats in Pune") {
      newSearch = { location: "Pune, Maharashtra", propertyType: "APARTMENT", priceRange: "ALL", bhk: "ALL" };
    } else if (chipText === "Under 20 Lakhs") {
      newSearch = { location: "ALL", propertyType: "ALL", priceRange: "0-2000000", bhk: "ALL" };
    } else if (chipText === "Villa") {
      newSearch = { location: "ALL", propertyType: "VILLA", priceRange: "ALL", bhk: "ALL" };
    } else if (chipText === "Plot") {
      newSearch = { location: "ALL", propertyType: "PLOT", priceRange: "ALL", bhk: "ALL" };
    } else if (chipText === "Ready to Move") {
      newSearch = { location: "ALL", propertyType: "ALL", priceRange: "ALL", bhk: "ALL" };
    }

    setLocation(newSearch.location);
    setPropertyType(newSearch.propertyType);
    setPriceRange(newSearch.priceRange);
    setBhk(newSearch.bhk);
    setActiveSearch(newSearch);
  };

  // Filter properties logic
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // Location filter
      if (activeSearch.location !== "ALL" && !`${prop.city || ""} ${prop.address || ""}`.toLowerCase().includes(activeSearch.location.toLowerCase().split(",")[0])) return false;

      // Property Type filter
      if (
        activeSearch.propertyType !== "ALL" &&
        prop.propertyType?.toUpperCase() !== activeSearch.propertyType.toUpperCase()
      ) {
        return false;
      }

      // BHK Filter
      if (activeSearch.bhk !== "ALL") {
        const reqBhk = parseInt(activeSearch.bhk, 10);
        if (reqBhk === 4 ? prop.bedrooms < 4 : prop.bedrooms !== reqBhk) {
          return false;
        }
      }

      // Price Range Filter
      if (activeSearch.priceRange !== "ALL") {
        const [minStr, maxStr] = activeSearch.priceRange.split("-");
        const minPrice = parseFloat(minStr);
        const maxPrice = parseFloat(maxStr);
        if (prop.price < minPrice || prop.price > maxPrice) {
          return false;
        }
      }

      return true;
    });
  }, [properties, activeSearch]);

  return (
    <div className="dashboard-content">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div>
          <h1>Welcome back!</h1>
          <p>Discover and find the best property for you.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple-bg">
            <Building size={22} />
          </div>
          <div>
            <span className="stat-label">Total Properties</span>
            <h3 className="stat-value">{properties.length}</h3>
            <span className="stat-sub">Available Properties</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pink-bg">
            <Heart size={22} />
          </div>
          <div>
            <span className="stat-label">Saved Properties</span>
            <h3 className="stat-value">{savedCount}</h3>
            <span className="stat-sub">Your Favorites</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green-bg">
            <Calendar size={22} />
          </div>
          <div>
            <span className="stat-label">My Visits</span>
            <h3 className="stat-value">0</h3>
            <span className="stat-sub">Scheduled Visits</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange-bg">
            <Bookmark size={22} />
          </div>
          <div>
            <span className="stat-label">My Bookings</span>
            <h3 className="stat-value">0</h3>
            <span className="stat-sub">Active Bookings</span>
          </div>
        </div>
      </section>

      {/* Search Properties Card matching image UI */}
      <section className="dash-search-card">
        <h3 className="dash-search-title">Search Properties</h3>

        <form className="dash-search-form" onSubmit={handleSearchSubmit}>
          {/* Location Dropdown */}
          <div className="dash-field-group">
            <label>Location</label>
            <div className="dash-select-box">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="Pune, Maharashtra">Pune, Maharashtra</option>
                <option value="Baner">Baner, Pune</option>
                <option value="Hinjewadi">Hinjewadi, Pune</option>
                <option value="Kothrud">Kothrud, Pune</option>
                <option value="Mumbai">Mumbai, Maharashtra</option>
                <option value="ALL">All Locations</option>
              </select>
              <ChevronDown className="dash-select-arrow" size={16} />
            </div>
          </div>

          {/* Property Type Dropdown */}
          <div className="dash-field-group">
            <label>Property Type</label>
            <div className="dash-select-box">
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="ALL">All Type</option>
                <option value="APARTMENT">Apartment / Flat</option>
                <option value="VILLA">Villa</option>
                <option value="PLOT">Plot</option>
                <option value="COMMERCIAL">Commercial</option>
              </select>
              <ChevronDown className="dash-select-arrow" size={16} />
            </div>
          </div>

          {/* Price Range Dropdown */}
          <div className="dash-field-group">
            <label>Price Range</label>
            <div className="dash-select-box">
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <option value="ALL">All Prices</option>
                <option value="0-2000000">Under ₹ 20 Lakhs</option>
                <option value="1000000-5000000">₹ 10 Lakh - ₹ 50 Lakh</option>
                <option value="5000000-10000000">₹ 50 Lakh - ₹ 1 Crore</option>
                <option value="10000000-999999999">₹ 1 Crore +</option>
              </select>
              <ChevronDown className="dash-select-arrow" size={16} />
            </div>
          </div>

          {/* BHK Dropdown */}
          <div className="dash-field-group">
            <label>BHK</label>
            <div className="dash-select-box">
              <select
                value={bhk}
                onChange={(e) => setBhk(e.target.value)}
              >
                <option value="ALL">All</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4+ BHK</option>
              </select>
              <ChevronDown className="dash-select-arrow" size={16} />
            </div>
          </div>

          {/* Search Action Button */}
          <button type="submit" className="dash-search-btn">
            <Search size={18} />
            <span>Search</span>
          </button>
        </form>

        {/* Popular Searches Row */}
        <div className="dash-popular-row">
          <span className="dash-popular-label">Popular Searches :</span>
          <div className="dash-pills-list">
            {[
              "2 BHK Apartments",
              "Flats in Pune",
              "Under 20 Lakhs",
              "Villa",
              "Plot",
              "Ready to Move",
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                className="dash-pill-tag"
                onClick={() => handlePopularSearch(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Available Properties Section */}
      <div className="left-column">
        <div className="section-header">
          <h3>Available Properties ({filteredProperties.length})</h3>
        </div>
        {loading && <p>Loading available properties...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && filteredProperties.length === 0 && (
          <p>No properties match your current search criteria.</p>
        )}
        <div className="properties-cards-grid">
          {filteredProperties.map((property) => (
            <div key={property.propertyId} className="property-card">
              <div className="card-image-wrapper">
                {property.images?.[0] ? (
                  <img
                    src={property.images[0].imageUrl}
                    alt={property.title}
                  />
                ) : (
                  <div className="card-image-placeholder">
                    No image available
                  </div>
                )}
                <span className="type-badge">{property.propertyType}</span>
                <button className="like-btn">
                  <Heart size={16} />
                </button>
              </div>
              <div className="card-details">
                <h4>{property.title}</h4>
                <p className="location-text">
                  <MapPin size={14} /> {property.city}, {property.state}
                </p>
                <div className="price-tag">
                  {formatPrice(property.price, property.listingType)}
                </div>
                <div className="property-specs">
                  <span>
                    <Bed size={14} /> {property.bedrooms ?? 0} BHK
                  </span>
                  <span>
                    <Bath size={14} /> {property.bathrooms ?? 0} Bath
                  </span>
                  <span>
                    <Maximize size={14} /> {property.areaSqft ?? 0} sqft
                  </span>
                </div>
                <button className="details-btn">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
