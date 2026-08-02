import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
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

const API_URL = "http://localhost:8080";

export default function BuyerSidebar() {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data && Array.isArray(res.data)) {
        const unread = res.data.filter((n) => !n.read && !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);

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
    { name: "Notifications", path: "/buyer/notifications", icon: <Bell size={18} />, badge: unreadCount > 0 ? unreadCount : null },
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