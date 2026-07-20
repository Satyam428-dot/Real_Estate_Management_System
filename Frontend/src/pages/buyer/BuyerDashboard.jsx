import React from "react";
import BuyerSidebar from "../../components/jsx/BuyerSidebar";
import "./BuyerDashboard.css";

export default function BuyerDashboard() {
  const properties = [
    {
      id: 1,
      title: "Modern Apartment",
      location: "Pune, Maharashtra",
      price: "₹45,00,000",
      image: "https://picsum.photos/400/250?random=1",
    },
    {
      id: 2,
      title: "Luxury Villa",
      location: "Mumbai, Maharashtra",
      price: "₹1,25,00,000",
      image: "https://picsum.photos/400/250?random=2",
    },
    {
      id: 3,
      title: "Independent House",
      location: "Nagpur, Maharashtra",
      price: "₹72,00,000",
      image: "https://picsum.photos/400/250?random=3",
    },
    {
      id: 4,
      title: "Studio Apartment",
      location: "Nashik, Maharashtra",
      price: "₹38,00,000",
      image: "https://picsum.photos/400/250?random=4",
    },
    {
      id: 5,
      title: "Farm House",
      location: "Lonavala",
      price: "₹95,00,000",
      image: "https://picsum.photos/400/250?random=5",
    },
    {
      id: 6,
      title: "Luxury Penthouse",
      location: "Pune, Maharashtra",
      price: "₹2,10,00,000",
      image: "https://picsum.photos/400/250?random=6",
    },
    {
      id: 7,
      title: "Residential Plot",
      location: "Aurangabad",
      price: "₹30,00,000",
      image: "https://picsum.photos/400/250?random=7",
    },
    {
      id: 8,
      title: "Commercial Office",
      location: "Thane",
      price: "₹1,80,00,000",
      image: "https://picsum.photos/400/250?random=8",
    },
  ];

  return (
    <div className="buyer-dashboard">
      <BuyerSidebar />

      <main className="content">
        {/* Top Bar */}
        <header className="topbar">
          <input
            type="text"
            placeholder="Search properties, location..."
          />

          <div className="profile">
            <strong>Abhishek Dhoran</strong>
          </div>
        </header>

        {/* Welcome */}
        <section className="welcome">
          <h1>Welcome back, Abhishek 👋</h1>
          <p>Discover and find the perfect property for you.</p>
        </section>

        {/* Statistics */}
        <section className="stats">
          <div className="card">
            <h4>Total Properties</h4>
            <h2>245</h2>
          </div>

          <div className="card">
            <h4>Saved Properties</h4>
            <h2>12</h2>
          </div>

          <div className="card">
            <h4>My Visits</h4>
            <h2>4</h2>
          </div>

          <div className="card">
            <h4>My Bookings</h4>
            <h2>2</h2>
          </div>
        </section>

        {/* Search */}
        <section className="search-box">
          <h3>Search Properties</h3>

          <div className="filters">
            <input type="text" placeholder="Location" />

            <select>
              <option>Property Type</option>
              <option>Apartment</option>
              <option>Villa</option>
              <option>House</option>
              <option>Commercial</option>
            </select>

            <select>
              <option>Price Range</option>
              <option>₹10L - ₹25L</option>
              <option>₹25L - ₹50L</option>
              <option>₹50L - ₹1Cr</option>
              <option>₹1Cr+</option>
            </select>

            <select>
              <option>BHK</option>
              <option>1 BHK</option>
              <option>2 BHK</option>
              <option>3 BHK</option>
              <option>4+ BHK</option>
            </select>

            <button>Search</button>
          </div>
        </section>

        {/* Property Cards */}
        <section className="grid">
          <div className="properties">
            <h3>Recommended Properties</h3>

            <div className="cards">
              {properties.map((property) => (
                <div className="property-card" key={property.id}>
                  <img
                    src={property.image}
                    alt={property.title}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      marginBottom: "12px",
                    }}
                  />

                  <h4>{property.title}</h4>

                  <p>📍 {property.location}</p>

                  <h3>{property.price}</h3>

                  <button>View Details</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <div className="qa">❤️ Saved</div>
          <div className="qa">📅 Visits</div>
          <div className="qa">📄 Bookings</div>
          <div className="qa">💬 Inquiries</div>
          <div className="qa">🔔 Notifications</div>
          <div className="qa">👤 Profile</div>
        </section>
      </main>
    </div>
  );
}