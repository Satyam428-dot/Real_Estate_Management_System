import React from "react";
import { Search, Bell, MessageSquare, ChevronDown } from "lucide-react";
import "../css/BuyerNavbar.css";

export default function BuyerNavbar() {
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

        <div className="user-profile">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
            alt="Abhishek Dhoran"
            className="avatar"
          />
          <div className="user-info">
            <h4>Abhishek Dhoran</h4>
            <span>Customer</span>
          </div>
          <ChevronDown size={16} />
        </div>
      </div>
    </header>
  );
}