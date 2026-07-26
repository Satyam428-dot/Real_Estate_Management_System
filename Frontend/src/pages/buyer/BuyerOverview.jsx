import React from "react";
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
  Star,
} from "lucide-react";
import "./BuyerOverview.css";

export default function BuyerOverview() {
  const recommendedProperties = [
    {
      id: 1,
      type: "Apartment",
      title: "Modern Apartment",
      location: "Baner, Pune",
      price: "₹ 45,00,000",
      bhk: "3 BHK",
      bath: "2 Bath",
      sqft: "1500 sqft",
      rating: "4.5",
      reviews: "120 reviews",
      image:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      type: "Villa",
      title: "Luxury Villa",
      location: "Kothrud, Pune",
      price: "₹ 1,25,00,000",
      bhk: "4 BHK",
      bath: "4 Bath",
      sqft: "2500 sqft",
      rating: "4.8",
      reviews: "85 reviews",
      image:
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 3,
      type: "Apartment",
      title: "Premium Flat",
      location: "Hinjewadi, Pune",
      price: "₹ 32,00,000",
      bhk: "2 BHK",
      bath: "2 Bath",
      sqft: "1100 sqft",
      rating: "4.2",
      reviews: "64 reviews",
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <div className="dashboard-content">
      {/* Welcome Header */}
      <div className="welcome-banner">
        <div>
          <h1>Welcome back, Abhishek! 👋</h1>
          <p>Discover and find the best property for you.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple-bg">
            <Building size={22} />
          </div>
          <div>
            <span className="stat-label">Total Properties</span>
            <h3 className="stat-value">245</h3>
            <span className="stat-sub">Available Properties</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pink-bg">
            <Heart size={22} />
          </div>
          <div>
            <span className="stat-label">Saved Properties</span>
            <h3 className="stat-value">12</h3>
            <span className="stat-sub">Your Favorites</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green-bg">
            <Calendar size={22} />
          </div>
          <div>
            <span className="stat-label">My Visits</span>
            <h3 className="stat-value">4</h3>
            <span className="stat-sub">Scheduled Visits</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange-bg">
            <Bookmark size={22} />
          </div>
          <div>
            <span className="stat-label">My Bookings</span>
            <h3 className="stat-value">2</h3>
            <span className="stat-sub">Active Bookings</span>
          </div>
        </div>
      </section>

      {/* Search Properties Filter Section */}
      <section className="search-section">
        <h3>Search Properties</h3>
        <div className="filter-grid">
          <div className="filter-group">
            <label>Location</label>
            <select defaultValue="Pune, Maharashtra">
              <option>Pune, Maharashtra</option>
              <option>Mumbai, Maharashtra</option>
              <option>Nagpur, Maharashtra</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Property Type</label>
            <select defaultValue="All Type">
              <option>All Type</option>
              <option>Apartment</option>
              <option>Villa</option>
              <option>Plot</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <select defaultValue="₹ 10 Lakh - ₹ 50 Lakh">
              <option>₹ 10 Lakh - ₹ 50 Lakh</option>
              <option>₹ 50 Lakh - ₹ 1 Cr</option>
              <option>₹ 1 Cr+</option>
            </select>
          </div>

          <div className="filter-group">
            <label>BHK</label>
            <select defaultValue="All">
              <option>All</option>
              <option>1 BHK</option>
              <option>2 BHK</option>
              <option>3 BHK</option>
              <option>4+ BHK</option>
            </select>
          </div>

          <button className="search-submit-btn">
            <Search size={18} />
            <span>Search</span>
          </button>
        </div>

        {/* Popular Search Tags */}
        <div className="popular-searches">
          <span>Popular Searches :</span>
          <button className="tag">2 BHK Apartments</button>
          <button className="tag">Flats in Pune</button>
          <button className="tag">Under 20 Lakhs</button>
          <button className="tag">Villa</button>
          <button className="tag">Plot</button>
          <button className="tag">Ready to Move</button>
        </div>
      </section>

      {/* Left Column: Recommended Properties */}
      <div className="left-column">
        <div className="section-header">
          <h3>Recommended Properties</h3>
          <a href="#view-all" className="view-all-link">
            View All
          </a>
        </div>

        <div className="properties-cards-grid">
          {recommendedProperties.map((prop) => (
            <div key={prop.id} className="property-card">
              <div className="card-image-wrapper">
                <img src={prop.image} alt={prop.title} />
                <span className="type-badge">{prop.type}</span>
                <button className="like-btn">
                  <Heart size={16} />
                </button>
              </div>

              <div className="card-details">
                <h4>{prop.title}</h4>
                <p className="location-text">
                  <MapPin size={14} /> {prop.location}
                </p>
                <div className="price-tag">{prop.price}</div>

                <div className="property-specs">
                  <span>
                    <Bed size={14} /> {prop.bhk}
                  </span>
                  <span>
                    <Bath size={14} /> {prop.bath}
                  </span>
                  <span>
                    <Maximize size={14} /> {prop.sqft}
                  </span>
                </div>

                <div className="rating-row">
                  <Star size={14} className="star-filled" />
                  <strong>{prop.rating}</strong>
                  <span>({prop.reviews})</span>
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