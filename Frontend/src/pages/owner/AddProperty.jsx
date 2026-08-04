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
  FaSpinner,
} from "react-icons/fa";

import "./AddProperty.css";

export default function AddProperty() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
  const [images, setImages] = useState([]);
  const [titleDeed, setTitleDeed] = useState(null);
  const [taxReceipt, setTaxReceipt] = useState(null);
  const [noc, setNoc] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in as an owner before adding a property.");
        setIsSubmitting(false);
        return;
      }
      const requestConfig = { headers: { Authorization: `Bearer ${token}` } };
      let userId = localStorage.getItem("userId");
      if (!userId) {
        try {
          const loggedInUserStr = localStorage.getItem("loggedInUser") || localStorage.getItem("user");
          if (loggedInUserStr) {
            const parsed = JSON.parse(loggedInUserStr);
            userId = parsed.userId || parsed.id;
          }
        } catch (e) {
          console.error("Error reading userId from localStorage:", e);
        }
      }

      if (!userId) {
        alert("User ID not found. Please log in again.");
        setIsSubmitting(false);
        return;
      }

      // Check owner verification status from backend table owner_verification
      const verificationResponse = await axios.get(
        `http://localhost:8080/verify/owner/${userId}/status`,
        requestConfig
      );

      const status =
        verificationResponse.data?.verification_status ||
        verificationResponse.data?.verificationStatus;

      // Check if the owner's verification status is APPROVED
      if (status !== "APPROVED") {
        alert("First verify yourself before adding a property.");
        navigate("/owner/profile?tab=verification");
        return;
      }

      const propertyResponse = await axios.post(
        "http://localhost:8080/properties",
        formData,
        requestConfig,
      );

      const propertyId = propertyResponse.data.propertyId || propertyResponse.data.id;

      if (images.length > 0) {
        const imageData = new FormData();
        images.forEach((image) => imageData.append("images", image));
        await axios.post(
          `http://localhost:8080/properties/${propertyId}/images`,
          imageData,
          requestConfig,
        );
      }

      if (titleDeed || taxReceipt || noc) {
        const docData = new FormData();
        if (titleDeed) docData.append("titleDeed", titleDeed);
        if (taxReceipt) docData.append("taxReceipt", taxReceipt);
        if (noc) docData.append("noc", noc);

        await axios.post(
          `http://localhost:8080/properties/${propertyId}/verification-docs`,
          docData,
          requestConfig,
        );
      }

      alert("Property submitted successfully! It will be reviewed by an Admin before publishing.");
      navigate("/owner/properties");
    } catch (error) {
      console.error("Failed to add property:", error);
      alert("Failed to add property. Please check all fields.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-property-page">
      {/* Page Header with Back button */}
      <div className="add-page-header">
        <button
          className="back-btn"
          onClick={() => navigate("/owner/properties")}
        >
          <FaArrowLeft /> Back to Properties
        </button>
        <h1 className="add-page-title">Add New Property</h1>
        <p className="add-page-subtitle">
          Fill in the details to list your property
        </p>
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
              <label>
                Property Title <span className="required">*</span>
              </label>
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
              <label>
                Price (₹) <span className="required">*</span>
              </label>
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
              <label>
                Property Type <span className="required">*</span>
              </label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
              >
                <option value="FLAT">🏢 Flat</option>
                <option value="HOUSE">🏠 House</option>
                <option value="VILLA">🏡 Villa</option>
              </select>
            </div>
            <div className="form-group">
              <label>
                Listing Type <span className="required">*</span>
              </label>
              <select
                name="listingType"
                value={formData.listingType}
                onChange={handleChange}
              >
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
              <label>
                Street Address <span className="required">*</span>
              </label>
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
              <label>
                City <span className="required">*</span>
              </label>
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
              <label>
                State <span className="required">*</span>
              </label>
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
              <label>
                Pin Code <span className="required">*</span>
              </label>
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
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Halls</label>
              <input
                type="number"
                name="halls"
                value={formData.halls}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>
                Area (sqft) <span className="required">*</span>
              </label>
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

        <div className="form-section">
          <h4 className="form-section-title">Property Images</h4>
          <div className="form-group">
            <label>Upload up to 10 images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(event) =>
                setImages(Array.from(event.target.files).slice(0, 10))
              }
            />
          </div>
        </div>

        {/* Section 6: Legal Verification Documents */}
        <div className="form-section">
          <h4 className="form-section-title">
            📄 Legal Property Verification Documents
          </h4>
          <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "1rem" }}>
            Upload legal documents to verify ownership and obtain Admin approval.
          </p>

          <div className="form-row cols-3">
            <div className="form-group">
              <label>
                Title Deed / Ownership Proof <span className="required">*</span>
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setTitleDeed(e.target.files[0])}
                required
              />
            </div>
            <div className="form-group">
              <label>
                Property Tax Receipt / Index II <span className="required">*</span>
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setTaxReceipt(e.target.files[0])}
                required
              />
            </div>
            <div className="form-group">
              <label>No Objection Certificate (NOC) / OC</label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setNoc(e.target.files[0])}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            disabled={isSubmitting}
            onClick={() => navigate("/owner/properties")}
          >
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <FaSpinner className="spinner-icon" /> Uploading & Adding Property...
              </>
            ) : (
              <>
                <FaPlus /> Add Property
              </>
            )}
          </button>
        </div>
      </form>

      {/* Submitting Loading Overlay */}
      {isSubmitting && (
        <div className="submitting-overlay">
          <div className="submitting-box">
            <FaSpinner className="spinner-icon-lg" />
            <h3>Uploading Property & Legal Documents</h3>
            <p>Please wait while your details and verification files are processed...</p>
          </div>
        </div>
      )}
    </div>
  );
}
