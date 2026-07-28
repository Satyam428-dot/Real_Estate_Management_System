import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaBuilding,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaRulerCombined,
} from "react-icons/fa";

import "./MyProperties.css";

import { getUserProfileDetails } from "../../utils/auth";

export default function MyProperties() {
  const navigate = useNavigate();

  // ===== STATE =====
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  // ===== FETCH PROPERTIES ON PAGE LOAD =====
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const details = getUserProfileDetails();
      const ownerId = details?.userId || localStorage.getItem("userId");

      let response;
      if (ownerId) {
        response = await axios.get(`http://localhost:8080/properties/owner/${ownerId}`);
      } else {
        response = await axios.get("http://localhost:8080/properties");
      }
      setProperties(response.data || []);
    } catch (error) {
      console.error("Failed to fetch owner properties:", error);
      // Fallback: fetch all and filter in frontend
      try {
        const details = getUserProfileDetails();
        const ownerId = Number(details?.userId || localStorage.getItem("userId"));
        const res = await axios.get("http://localhost:8080/properties");
        if (ownerId && Array.isArray(res.data)) {
          const ownerProps = res.data.filter((p) => Number(p.ownerId) === ownerId);
          setProperties(ownerProps);
        } else {
          setProperties(res.data || []);
        }
      } catch (err) {
        console.error("Fallback fetch failed", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // ===== HELPER: Get status badge styles =====
  const getStatusBadgeStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "RENTED":
        return { backgroundColor: "#3b82f6", color: "#ffffff" }; // Blue
      case "AVAILABLE":
        return { backgroundColor: "#10b981", color: "#ffffff" }; // Emerald Green
      case "SOLD":
        return { backgroundColor: "#8b5cf6", color: "#ffffff" }; // Purple
      default:
        return { backgroundColor: "#059669", color: "#ffffff" }; // Fallback Green
    }
  };

  // ===== HELPER: Format price =====
  const formatPrice = (price, listingType) => {
    const formatted = Number(price || 0).toLocaleString("en-IN");
    return listingType === "RENT"
      ? `₹${formatted} / month`
      : `₹${formatted}`;
  };

  // ===== FILTER LOGIC =====
  const filteredProperties = properties.filter((property) => {
    const query = searchTerm.trim().toLowerCase();
    const titleMatch = property.title ? property.title.toLowerCase().includes(query) : false;
    const descMatch = property.description ? property.description.toLowerCase().includes(query) : false;
    const cityMatch = property.city ? property.city.toLowerCase().includes(query) : false;
    const stateMatch = property.state ? property.state.toLowerCase().includes(query) : false;
    const addressMatch = property.address ? property.address.toLowerCase().includes(query) : false;
    const typeMatchStr = property.propertyType ? property.propertyType.toLowerCase().includes(query) : false;
    const listingMatchStr = property.listingType ? property.listingType.toLowerCase().includes(query) : false;

    const matchesSearch =
      !query ||
      titleMatch ||
      descMatch ||
      cityMatch ||
      stateMatch ||
      addressMatch ||
      typeMatchStr ||
      listingMatchStr;

    const matchesStatus =
      statusFilter === "All" ||
      (property.status && property.status.toUpperCase() === statusFilter.toUpperCase());

    const matchesType =
      typeFilter === "All" ||
      (property.propertyType && property.propertyType.toUpperCase() === typeFilter.toUpperCase());

    return matchesSearch && matchesStatus && matchesType;
  });

  // ===== HANDLE FORM INPUT CHANGE =====
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ===== ADD PROPERTY — POST to backend =====
  const handleAddProperty = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/properties", formData);
      setShowModal(false);
      // Reset form
      setFormData({
        ownerId: 1,
        title: "",
        description: "",
        price: "",
        propertyType: "FLAT",
        listingType: "RENT",
        address: "",
        city: "",
        state: "",
        pinCode: "",
        bedrooms: 0,
        bathrooms: 0,
        halls: 0,
        areaSqft: "",
      });
      // Refresh list from backend
      fetchProperties();
    } catch (error) {
      console.error("Failed to add property:", error);
      alert("Failed to add property. Please check all fields.");
    }
  };

  // ===== DELETE PROPERTY =====
  const handleDelete = async (propertyId) => {
    if (!window.confirm("Are you sure you want to delete this property?")) {
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/properties/${propertyId}`);
      fetchProperties(); // refresh list
    } catch (error) {
      console.error("Failed to delete property:", error);
    }
  };

  return (
    <div className="my-properties-page">

      {/* ===== PAGE HEADER ===== */}
      <div className="page-header">
        <div>
          <h1 className="page-title">My Properties</h1>
          <p className="page-subtitle">
            Manage all your property listings
          </p>
        </div>
        <button
          className="add-property-btn"
          onClick={() => navigate("/owner/add-property")}
        >
          <FaPlus /> Add Property
        </button>
      </div>

      {/* ===== SEARCH & FILTER BAR ===== */}
      <div className="filter-bar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="RENTED">Rented</option>
          <option value="AVAILABLE">Available</option>
          <option value="SOLD">Sold</option>
        </select>

        <select
          className="filter-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="All">All Type</option>
          <option value="FLAT">Flat</option>
          <option value="HOUSE">House</option>
          <option value="VILLA">Villa</option>
          <option value="PG">PG / Paying Guest</option>
          <option value="COMMERCIAL">Commercial</option>
        </select>
      </div>

      {/* ===== RESULTS COUNT ===== */}
      <p className="results-count">
        Showing {filteredProperties.length} of {properties.length} properties
      </p>

      {/* ===== LOADING STATE ===== */}
      {loading && <p className="loading-text">Loading properties...</p>}

      {/* ===== PROPERTY CARDS GRID ===== */}
      {!loading && (
        <div className="properties-grid">
          {filteredProperties.map((property) => (
            <div className="prop-card" key={property.propertyId}>

              {/* Top: Thumbnail area */}
              <div className="prop-card-thumb">
                {property.images?.[0]?.imageUrl ? (
                  <img
                    className="prop-card-image"
                    src={property.images[0].imageUrl}
                    alt={property.title}
                  />
                ) : (
                  <FaBuilding className="prop-card-thumb-icon" />
                )}
                <span
                  className="prop-card-badge"
                  style={getStatusBadgeStyle(property.status)}
                >
                  {property.status}
                </span>
                {/* Listing type badge */}
                <span className="prop-card-listing-badge">
                  {property.listingType}
                </span>
              </div>

              {/* Middle: Info */}
              <div className="prop-card-body">
                <h3 className="prop-card-title">{property.title}</h3>
                <p className="prop-card-location">
                  <FaMapMarkerAlt /> {property.city}, {property.state}
                </p>
                <p className="prop-card-price">
                  {formatPrice(property.price, property.listingType)}
                </p>

                {/* Property specs row */}
                <div className="prop-card-specs">
                  {property.bedrooms > 0 && (
                    <span className="spec-item">
                      <FaBed /> {property.bedrooms} Beds
                    </span>
                  )}
                  <span className="spec-item">
                    <FaBath /> {property.bathrooms} Bath
                  </span>
                  <span className="spec-item">
                    <FaRulerCombined /> {property.areaSqft} sqft
                  </span>
                </div>
              </div>

              {/* Bottom: Action buttons */}
              <div className="prop-card-actions">
                <button className="action-btn view-btn" title="View">
                  <FaEye />
                </button>
                <button className="action-btn edit-btn" title="Edit">
                  <FaEdit />
                </button>
                <button
                  className="action-btn delete-btn"
                  title="Delete"
                  onClick={() => handleDelete(property.propertyId)}
                >
                  <FaTrash />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredProperties.length === 0 && (
        <div className="empty-state">
          <FaBuilding className="empty-icon" />
          <p>No properties found. Click "Add Property" to get started!</p>
        </div>
      )}

    </div>
  );
}
