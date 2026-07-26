import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaBuilding,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaBed,
  FaArrowLeft,
  FaPlus,
} from "react-icons/fa";

import "./AddProperty.css";

export default function AddProperty() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/properties", formData);
      alert("Property added successfully!");
      navigate("/owner/properties");
    } catch (error) {
      console.error("Failed to add property:", error);
      alert("Failed to add property. Please check all fields.");
    }
  };

  return (
    <div className="add-property-page">

      {/* Page Header with Back button */}
      <div className="add-page-header">
        <button className="back-btn" onClick={() => navigate("/owner/properties")}>
          <FaArrowLeft /> Back to Properties
        </button>
        <h1 className="add-page-title">Add New Property</h1>
        <p className="add-page-subtitle">Fill in the details to list your property</p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="add-property-form">

        {/* Section 1: Property Details */}
        <div className="form-section">
          <h4 className="form-section-title">
            <FaBuilding className="section-icon" /> Property Details
          </h4>

          <div className="form-row">
            <div className="form-group">
              <label>Property Title <span className="required">*</span></label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Modern 2BHK Apartment in Mumbai"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your property — amenities, neighbourhood, special features..."
                rows="4"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Type */}
        <div className="form-section">
          <h4 className="form-section-title">
            <FaRulerCombined className="section-icon" /> Pricing & Type
          </h4>

          <div className="form-row cols-3">
            <div className="form-group">
              <label>Price (₹) <span className="required">*</span></label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 25000"
                required
              />
            </div>
            <div className="form-group">
              <label>Property Type <span className="required">*</span></label>
              <select name="propertyType" value={formData.propertyType} onChange={handleChange}>
                <option value="FLAT">🏢 Flat</option>
                <option value="HOUSE">🏠 House</option>
                <option value="VILLA">🏡 Villa</option>
              </select>
            </div>
            <div className="form-group">
              <label>Listing Type <span className="required">*</span></label>
              <select name="listingType" value={formData.listingType} onChange={handleChange}>
                <option value="RENT">📋 For Rent</option>
                <option value="SALE">💰 For Sale</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Location */}
        <div className="form-section">
          <h4 className="form-section-title">
            <FaMapMarkerAlt className="section-icon" /> Location
          </h4>

          <div className="form-row">
            <div className="form-group">
              <label>Street Address <span className="required">*</span></label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. 42, MG Road, Andheri West"
                required
              />
            </div>
          </div>

          <div className="form-row cols-3">
            <div className="form-group">
              <label>City <span className="required">*</span></label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Mumbai"
                required
              />
            </div>
            <div className="form-group">
              <label>State <span className="required">*</span></label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Maharashtra"
                required
              />
            </div>
            <div className="form-group">
              <label>Pin Code <span className="required">*</span></label>
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                placeholder="400001"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 4: Property Specs */}
        <div className="form-section">
          <h4 className="form-section-title">
            <FaBed className="section-icon" /> Property Specifications
          </h4>

          <div className="form-row cols-4">
            <div className="form-group">
              <label>Bedrooms</label>
              <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} min="0" />
            </div>
            <div className="form-group">
              <label>Bathrooms</label>
              <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} min="0" />
            </div>
            <div className="form-group">
              <label>Halls</label>
              <input type="number" name="halls" value={formData.halls} onChange={handleChange} min="0" />
            </div>
            <div className="form-group">
              <label>Area (sqft) <span className="required">*</span></label>
              <input
                type="number"
                name="areaSqft"
                value={formData.areaSqft}
                onChange={handleChange}
                placeholder="1100"
                required
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate("/owner/properties")}>
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            <FaPlus /> Add Property
          </button>
        </div>

      </form>
    </div>
  );
}
