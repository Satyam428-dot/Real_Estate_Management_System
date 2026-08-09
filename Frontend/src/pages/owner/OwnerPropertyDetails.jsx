import { JAVA_BACKEND_URL } from "../../utils/config";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaUpload,
  FaBuilding,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaDoorOpen,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaSave,
} from "react-icons/fa";
import { getUserProfileDetails } from "../../utils/auth";
import "./OwnerPropertyDetails.css";

export default function OwnerPropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [savingEdit, setSavingEdit] = useState(false);

  // Image Upload State
  const fileInputRef = useRef(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${JAVA_BACKEND_URL}/properties/${id}`);
      setProperty(res.data);
      setEditForm({
        title: res.data.title || "",
        description: res.data.description || "",
        price: res.data.price || "",
        propertyType: res.data.propertyType || "FLAT",
        listingType: res.data.listingType || "RENT",
        address: res.data.address || "",
        city: res.data.city || "",
        state: res.data.state || "",
        pinCode: res.data.pinCode || "",
        bedrooms: res.data.bedrooms || 0,
        bathrooms: res.data.bathrooms || 0,
        halls: res.data.halls || 0,
        areaSqft: res.data.areaSqft || "",
        status: res.data.status || "AVAILABLE",
      });
    } catch (err) {
      console.error("Error fetching property details:", err);
      alert("Failed to load property details.");
    } finally {
      setLoading(false);
    }
  };

  // ===== HANDLE EDIT FORM INPUT CHANGE =====
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // ===== SUBMIT PROPERTY EDITS =====
  const handleSavePropertyEdits = async (e) => {
    e.preventDefault();
    try {
      setSavingEdit(true);
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${JAVA_BACKEND_URL}/properties/${id}`,
        {
          ...editForm,
          price: parseFloat(editForm.price),
          bedrooms: parseInt(editForm.bedrooms || 0),
          bathrooms: parseInt(editForm.bathrooms || 0),
          halls: parseInt(editForm.halls || 0),
          areaSqft: parseInt(editForm.areaSqft || 0),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProperty(res.data);
      setIsEditing(false);
      alert("Property details updated successfully!");
    } catch (err) {
      console.error("Error updating property:", err);
      const errMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to update property details.";
      alert(errMsg);
    } finally {
      setSavingEdit(false);
    }
  };

  // ===== UPLOAD NEW IMAGES =====
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    try {
      setUploadingImages(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });

      const res = await axios.post(
        `${JAVA_BACKEND_URL}/properties/${id}/images`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProperty(res.data);
      alert("Images uploaded successfully!");
    } catch (err) {
      console.error("Error uploading images:", err);
      const errMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to upload images.";
      alert(errMsg);
    } finally {
      setUploadingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ===== DELETE IMAGE =====
  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `${JAVA_BACKEND_URL}/properties/${id}/images/${imageId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProperty(res.data);
      setActiveImageIndex(0);
      alert("Image deleted successfully.");
    } catch (err) {
      console.error("Error deleting image:", err);
      alert("Failed to delete image.");
    }
  };

  // ===== DELETE ENTIRE PROPERTY =====
  const handleDeleteProperty = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this property?")) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${JAVA_BACKEND_URL}/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Property deleted successfully.");
      navigate("/owner/properties");
    } catch (err) {
      console.error("Error deleting property:", err);
      alert("Failed to delete property.");
    }
  };

  if (loading) {
    return (
      <div className="owner-prop-details-loading">
        <p>Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="owner-prop-details-error">
        <h2>Property not found</h2>
        <button onClick={() => navigate("/owner/properties")}>Back to Properties</button>
      </div>
    );
  }

  const imagesList = property.images && property.images.length > 0 ? property.images : [];
  const currentImage = imagesList[activeImageIndex]?.imageUrl;

  const getStatusBadgeStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "RENTED":
        return { backgroundColor: "#3b82f6", color: "#ffffff" };
      case "AVAILABLE":
        return { backgroundColor: "#10b981", color: "#ffffff" };
      case "SOLD":
        return { backgroundColor: "#8b5cf6", color: "#ffffff" };
      default:
        return { backgroundColor: "#059669", color: "#ffffff" };
    }
  };

  return (
    <div className="owner-prop-details-container">
      {/* ===== TOP NAVIGATION BAR ===== */}
      <div className="owner-prop-details-topbar">
        <button className="back-btn" onClick={() => navigate("/owner/properties")}>
          <FaArrowLeft /> Back to Properties
        </button>

        <div className="topbar-actions">
          <button className="action-btn edit-details-btn" onClick={() => setIsEditing(!isEditing)}>
            <FaEdit /> {isEditing ? "Cancel Edit" : "Edit Property"}
          </button>

          <button className="action-btn delete-prop-btn" onClick={handleDeleteProperty}>
            <FaTrash /> Delete Property
          </button>
        </div>
      </div>

      {/* ===== HEADER BANNER ===== */}
      <div className="owner-prop-details-header">
        <div className="header-title-section">
          <div className="header-badges">
            <span className="badge listing-type">{property.listingType}</span>
            <span className="badge status-type" style={getStatusBadgeStyle(property.status)}>
              {property.status}
            </span>
            <span className="badge prop-type">{property.propertyType}</span>
            {property.verificationStatus === "APPROVED" ? (
              <span className="badge verif-status approved" style={{ backgroundColor: "#dcfce7", color: "#16a34a" }}>✅ Admin Verified</span>
            ) : property.verificationStatus === "REJECTED" ? (
              <span className="badge verif-status rejected" style={{ backgroundColor: "#fee2e2", color: "#dc2626" }} title={property.rejectionReason}>❌ Verification Rejected</span>
            ) : (
              <span className="badge verif-status pending" style={{ backgroundColor: "#fef3c7", color: "#d97706" }}>⏳ Pending Admin Verification</span>
            )}
          </div>
          <h1 className="header-title">{property.title}</h1>
          <p className="header-location">
            <FaMapMarkerAlt /> {property.address}, {property.city}, {property.state} - {property.pinCode}
          </p>
        </div>

        <div className="header-price-section">
          <span className="price-label">Listing Price</span>
          <h2 className="price-value">
            ₹{Number(property.price).toLocaleString("en-IN")}{" "}
            {property.listingType === "RENT" ? "/ month" : ""}
          </h2>
        </div>
      </div>

      {/* ===== EDIT MODAL / FORM ===== */}
      {isEditing && (
        <div className="edit-property-card">
          <div className="edit-card-header">
            <h3><FaEdit /> Edit Property Information</h3>
            <button className="close-edit-btn" onClick={() => setIsEditing(false)}><FaTimes /></button>
          </div>

          <form onSubmit={handleSavePropertyEdits} className="edit-property-form">
            <div className="form-grid cols-2">
              <div className="form-group">
                <label>Property Title</label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={editForm.price}
                  onChange={handleEditChange}
                  required
                />
              </div>
            </div>

            <div className="form-grid cols-3">
              <div className="form-group">
                <label>Listing Type</label>
                <select name="listingType" value={editForm.listingType} onChange={handleEditChange}>
                  <option value="RENT">Rent</option>
                  <option value="SALE">Sale</option>
                </select>
              </div>

              <div className="form-group">
                <label>Property Type</label>
                <select name="propertyType" value={editForm.propertyType} onChange={handleEditChange}>
                  <option value="FLAT">Flat</option>
                  <option value="HOUSE">House</option>
                  <option value="VILLA">Villa</option>
                  <option value="PG">PG / Paying Guest</option>
                  <option value="COMMERCIAL">Commercial</option>
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select name="status" value={editForm.status} onChange={handleEditChange}>
                  <option value="AVAILABLE">Available</option>
                  <option value="RENTED">Rented</option>
                  <option value="SOLD">Sold</option>
                </select>
              </div>
            </div>

            <div className="form-grid cols-4">
              <div className="form-group">
                <label>Bedrooms</label>
                <input type="number" name="bedrooms" value={editForm.bedrooms} onChange={handleEditChange} />
              </div>
              <div className="form-group">
                <label>Bathrooms</label>
                <input type="number" name="bathrooms" value={editForm.bathrooms} onChange={handleEditChange} />
              </div>
              <div className="form-group">
                <label>Halls</label>
                <input type="number" name="halls" value={editForm.halls} onChange={handleEditChange} />
              </div>
              <div className="form-group">
                <label>Area (sq. ft.)</label>
                <input type="number" name="areaSqft" value={editForm.areaSqft} onChange={handleEditChange} />
              </div>
            </div>

            <div className="form-group">
              <label>Street Address</label>
              <input type="text" name="address" value={editForm.address} onChange={handleEditChange} required />
            </div>

            <div className="form-grid cols-3">
              <div className="form-group">
                <label>City</label>
                <input type="text" name="city" value={editForm.city} onChange={handleEditChange} required />
              </div>
              <div className="form-group">
                <label>State</label>
                <input type="text" name="state" value={editForm.state} onChange={handleEditChange} required />
              </div>
              <div className="form-group">
                <label>Pin Code</label>
                <input type="text" name="pinCode" value={editForm.pinCode} onChange={handleEditChange} required />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                rows="4"
                value={editForm.description}
                onChange={handleEditChange}
                required
              />
            </div>

            <div className="edit-form-actions">
              <button type="button" className="cancel-edit-btn" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button type="submit" className="save-edit-btn" disabled={savingEdit}>
                <FaSave /> {savingEdit ? "Saving..." : "Save Property Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===== MAIN GRID: GALLERY & DETAILS ===== */}
      <div className="owner-prop-details-grid">
        {/* LEFT COLUMN: GALLERY */}
        <div className="gallery-card">
          <div className="main-image-viewport">
            {currentImage ? (
              <img src={currentImage} alt={property.title} className="main-image" />
            ) : (
              <div className="no-image-placeholder">
                <FaBuilding className="placeholder-icon" />
                <p>No photos uploaded yet</p>
              </div>
            )}

            {imagesList.length > 1 && (
              <>
                <button
                  className="carousel-btn prev"
                  onClick={() =>
                    setActiveImageIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1))
                  }
                >
                  <FaChevronLeft />
                </button>

                <button
                  className="carousel-btn next"
                  onClick={() =>
                    setActiveImageIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1))
                  }
                >
                  <FaChevronRight />
                </button>
              </>
            )}
          </div>

          {/* THUMBNAIL STRIP + UPLOAD / DELETE CONTROLS */}
          <div className="gallery-footer">
            <div className="gallery-header-row">
              <h4>Property Photos ({imagesList.length})</h4>

              <label className="upload-photo-btn">
                <FaUpload /> {uploadingImages ? "Uploading..." : "Add Photos"}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  multiple
                  accept="image/*"
                  disabled={uploadingImages}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            <div className="thumbnails-grid">
              {imagesList.map((img, idx) => (
                <div
                  key={img.id}
                  className={`thumbnail-item ${idx === activeImageIndex ? "active" : ""}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={img.imageUrl} alt={`Photo ${idx + 1}`} />
                  <button
                    className="delete-photo-overlay-btn"
                    title="Delete Photo"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(img.id);
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SPECS & DESCRIPTION */}
        <div className="details-info-column">
          {/* SPECS CARDS GRID */}
          <div className="specs-grid">
            <div className="spec-card">
              <FaBed className="spec-icon" />
              <div>
                <span className="spec-val">{property.bedrooms || 0}</span>
                <span className="spec-lbl">Bedrooms</span>
              </div>
            </div>

            <div className="spec-card">
              <FaBath className="spec-icon" />
              <div>
                <span className="spec-val">{property.bathrooms || 0}</span>
                <span className="spec-lbl">Bathrooms</span>
              </div>
            </div>

            <div className="spec-card">
              <FaDoorOpen className="spec-icon" />
              <div>
                <span className="spec-val">{property.halls || 0}</span>
                <span className="spec-lbl">Halls</span>
              </div>
            </div>

            <div className="spec-card">
              <FaRulerCombined className="spec-icon" />
              <div>
                <span className="spec-val">{property.areaSqft || 0}</span>
                <span className="spec-lbl">sq. ft. Area</span>
              </div>
            </div>
          </div>

          {/* DESCRIPTION CARD */}
          <div className="info-card">
            <h3 className="card-section-title">Property Description</h3>
            <p className="description-text">{property.description}</p>
          </div>

          {/* LOCATION DETAILS CARD */}
          <div className="info-card">
            <h3 className="card-section-title">Location & Address</h3>
            <div className="address-details-list">
              <p><strong>Street Address:</strong> {property.address}</p>
              <p><strong>City:</strong> {property.city}</p>
              <p><strong>State:</strong> {property.state}</p>
              <p><strong>Pin Code:</strong> {property.pinCode}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
