import React from "react";
import "./BuyerDashboard.css";

export default function BuyerDashboard() {
  return (
    <div className="buyer-dashboard">
      <aside className="sidebar">
        <div className="logo">Real Estate</div>
        <ul>
          <li className="active">Dashboard</li>
          <li>Browse Properties</li>
          <li>Saved Properties</li>
          <li>Compare Properties</li>
          <li>Schedule Visit</li>
          <li>My Bookings</li>
          <li>My Inquiries</li>
          <li>Notifications</li>
          <li>Reviews & Ratings</li>
          <li>My Profile</li>
          <li>Help & Support</li>
          <li className="logout">Logout</li>
        </ul>
      </aside>

      <main className="content">
        <header className="topbar">
          <input placeholder="Search properties, location..." />
          <div className="profile">Abhishek Dhoran</div>
        </header>

        <section className="welcome">
          <h1>Welcome back, Abhishek! 👋</h1>
          <p>Discover and find the best property for you.</p>
        </section>

        <section className="stats">
          {[
            ["Total Properties","245"],
            ["Saved Properties","12"],
            ["My Visits","4"],
            ["My Bookings","2"],
          ].map(([t,v])=>(
            <div className="card" key={t}>
              <h4>{t}</h4>
              <h2>{v}</h2>
            </div>
          ))}
        </section>

        <section className="search-box">
          <h3>Search Properties</h3>
          <div className="filters">
            <input placeholder="Location"/>
            <select><option>Property Type</option></select>
            <select><option>Price Range</option></select>
            <select><option>BHK</option></select>
            <button>Search</button>
          </div>
        </section>

        <section className="grid">
          <div className="properties">
            <h3>Recommended Properties</h3>
            <div className="cards">
              {[1,2,3,4].map(i=>(
                <div className="property-card" key={i}>
                  <div className="image">Image {i}</div>
                  <h4>Modern Apartment</h4>
                  <p>Pune, Maharashtra</p>
                  <h3>₹45,00,000</h3>
                  <button>View Details</button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
