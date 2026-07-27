import React, { useEffect, useState } from "react";
import axios from "axios";
import { Building, Heart, Calendar, Bookmark, Search, MapPin, Bed, Bath, Maximize } from "lucide-react";
import "./BuyerOverview.css";

const API_URL = "http://localhost:8080";

export default function BuyerOverview() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${API_URL}/properties/available`)
      .then((response) => setProperties(response.data))
      .catch(() => setError("Unable to load available properties. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const formatPrice = (price, listingType) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price) +
    (listingType === "RENT" ? " / month" : "");

  return (
    <div className="dashboard-content">
      <div className="welcome-banner">
        <div><h1>Welcome back!</h1><p>Discover and find the best property for you.</p></div>
      </div>

      <section className="stats-grid">
        <div className="stat-card"><div className="stat-icon purple-bg"><Building size={22} /></div><div><span className="stat-label">Total Properties</span><h3 className="stat-value">{properties.length}</h3><span className="stat-sub">Available Properties</span></div></div>
        <div className="stat-card"><div className="stat-icon pink-bg"><Heart size={22} /></div><div><span className="stat-label">Saved Properties</span><h3 className="stat-value">0</h3><span className="stat-sub">Your Favorites</span></div></div>
        <div className="stat-card"><div className="stat-icon green-bg"><Calendar size={22} /></div><div><span className="stat-label">My Visits</span><h3 className="stat-value">0</h3><span className="stat-sub">Scheduled Visits</span></div></div>
        <div className="stat-card"><div className="stat-icon orange-bg"><Bookmark size={22} /></div><div><span className="stat-label">My Bookings</span><h3 className="stat-value">0</h3><span className="stat-sub">Active Bookings</span></div></div>
      </section>

      <section className="search-section">
        <h3>Search Properties</h3>
        <div className="filter-grid"><div className="filter-group"><label>Location</label><select><option>All locations</option></select></div><div className="filter-group"><label>Property Type</label><select><option>All Types</option></select></div><button className="search-submit-btn"><Search size={18} /><span>Search</span></button></div>
      </section>

      <div className="left-column">
        <div className="section-header"><h3>Available Properties</h3></div>
        {loading && <p>Loading available properties...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && properties.length === 0 && <p>No properties are available right now.</p>}
        <div className="properties-cards-grid">
          {properties.map((property) => (
            <div key={property.propertyId} className="property-card">
              <div className="card-image-wrapper">
                {property.images?.[0] ? <img src={property.images[0].imageUrl} alt={property.title} /> : <div className="card-image-placeholder">No image available</div>}
                <span className="type-badge">{property.propertyType}</span>
                <button className="like-btn"><Heart size={16} /></button>
              </div>
              <div className="card-details">
                <h4>{property.title}</h4>
                <p className="location-text"><MapPin size={14} /> {property.city}, {property.state}</p>
                <div className="price-tag">{formatPrice(property.price, property.listingType)}</div>
                <div className="property-specs"><span><Bed size={14} /> {property.bedrooms ?? 0} BHK</span><span><Bath size={14} /> {property.bathrooms ?? 0} Bath</span><span><Maximize size={14} /> {property.areaSqft ?? 0} sqft</span></div>
                <button className="details-btn">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
