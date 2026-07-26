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
      const response = await axios.get("http://localhost:8080/properties");
      setProperties(response.data);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setLoading(false);
    }
  };

  // ===== HELPER: Get status color =====
  const getStatusColor = (status) => {
    switch (status) {
      case "RENTED":    return "#22c55e";
      case "AVAILABLE": return "#f59e0b";
      case "SOLD":      return "#8b5cf6";
      default:          return "#64748b";
    }
  };

  // ===== HELPER: Format price =====
  const formatPrice = (price, listingType) => {
    const formatted = Number(price).toLocaleString("en-IN");
    return listingType === "RENT"
      ? `₹${formatted} / month`
      : `₹${formatted}`;
  };

  // ===== FILTER LOGIC =====
  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || property.status === statusFilter;

    const matchesType =
      typeFilter === "All" || property.propertyType === typeFilter;

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
                <FaBuilding className="prop-card-thumb-icon" />
                <span
                  className="prop-card-badge"
                  style={{
                    backgroundColor: getStatusColor(property.status) + "20",
                    color: getStatusColor(property.status),
                  }}
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
