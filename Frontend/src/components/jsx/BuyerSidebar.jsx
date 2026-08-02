import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  LayoutDashboard,
  Building,
  Heart,
  Calendar,
  Bookmark,
  MessageSquare,
  Bell,
  Star,
  User,
  LogOut,
} from "lucide-react";
import "../css/BuyerSidebar.css";

export default function BuyerSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    toast.info("Logged out successfully.");
    navigate("/login");
  };

  const sidebarItems = [
    { name: "Dashboard", path: "/buyer/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Browse Properties", path: "/buyer/browse", icon: <Building size={18} /> },
    { name: "Saved Properties", path: "/buyer/saved", icon: <Heart size={18} /> },
    { name: "Scheduled Visit", path: "/buyer/visits", icon: <Calendar size={18} /> },
    { name: "My Bookings", path: "/buyer/bookings", icon: <Bookmark size={18} /> },
    { name: "My Inquiries", path: "/buyer/inquiries", icon: <MessageSquare size={18} /> },
    { name: "Notifications", path: "/buyer/notifications", icon: <Bell size={18} />, badge: 5 },
    { name: "Reviews & Ratings", path: "/buyer/reviews", icon: <Star size={18} /> },
    { name: "My Profile", path: "/buyer/profile", icon: <User size={18} /> },
  ];

  return (
    <aside className="buyer-sidebar">
      {/* Brand Logo Header */}
      <div className="brand">
        <Building className="brand-logo" size={26} />
        <div>
          <h2>PROPERTY HQ</h2>
          <p>Find Your Dream Property</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        {sidebarItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.name}</span>
            {item.badge && <span className="badge">{item.badge}</span>}
          </NavLink>
        ))}

        {/* Red Logout Button under My Profile */}
        <div className="nav-item logout-nav-item" onClick={handleLogout}>
          <span className="nav-icon"><LogOut size={18} /></span>
          <span className="nav-text">Logout</span>
        </div>
      </nav>
    </aside>
  );
}