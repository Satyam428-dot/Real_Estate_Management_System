import React, { useEffect, useState } from "react";
import { Search, Bell, MessageSquare, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getLoggedInUser } from "../../utils/auth";
import "../css/BuyerNavbar.css";

export default function BuyerNavbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => ({ ...getLoggedInUser(), ...JSON.parse(localStorage.getItem("buyer_profile") || "{}") }));
  useEffect(() => {
    const refresh = () => setUser({ ...getLoggedInUser(), ...JSON.parse(localStorage.getItem("buyer_profile") || "{}") });
    window.addEventListener("profileUpdated", refresh);
    return () => window.removeEventListener("profileUpdated", refresh);
  }, []);
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "My Profile";
  return (
    <header className="top-header">
      {/* Search Input Bar */}
      <div className="search-bar-header">
        <input type="text" placeholder="Search properties, location..." />
        <Search className="search-header-icon" size={18} />
      </div>

      {/* Header Notification & Profile Icons */}
      <div className="header-actions">
        <div className="icon-badge">
          <Bell size={20} />
          <span className="dot-badge red">5</span>
        </div>
        
        <div className="icon-badge">
          <MessageSquare size={20} />
          <span className="dot-badge red">3</span>
        </div>

        <button className="user-profile" onClick={() => navigate("/buyer/profile")} aria-label="Open my profile">
          <span className="avatar avatar-initials">{name.charAt(0).toUpperCase()}</span>
          <div className="user-info">
            <h4>{name}</h4>
            <span>Customer</span>
          </div>
          <ChevronDown size={16} />
        </button>
      </div>
    </header>
  );
}
