import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  Search,
  Bell,
  MessageSquare,
  ChevronDown,
  X,
  User,
  Heart,
  Calendar,
  MapPin,
  LogOut,
  CheckCheck,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { getLoggedInUser, logout } from "../../utils/auth";
import "../css/BuyerNavbar.css";

const API_URL = "http://localhost:8080";

const defaultNotifications = [
  {
    id: 101,
    title: "Your visit is scheduled",
    message: 'Your visit for "Luxury 2BHK Apartment" is scheduled on 24 May 2024 at 11:00 AM.',
    time: "Today",
    isRead: false,
    category: "Bookings & Visits",
  },
  {
    id: 102,
    title: "New reply to your enquiry",
    message: 'Seller has replied to your enquiry for "Elegant Villa".',
    time: "Yesterday",
    isRead: false,
    category: "Enquiries",
  },
  {
    id: 103,
    title: "Property saved successfully",
    message: '"Modern 3BHK Apartment" has been saved to your collection.',
    time: "22 May 2024",
    isRead: false,
    category: "Saved Properties",
  },
];

const popularSuggestions = [
  "Baner, Pune",
  "Hinjewadi, Pune",
  "Kothrud, Pune",
  "Wakad, Pune",
  "Kharadi, Pune",
  "Viman Nagar, Pune",
  "2 BHK Apartment",
  "3 BHK Apartment",
  "Luxury Villa"
];

export default function BuyerNavbar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Search State
  const initialSearch = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchContainerRef = useRef(null);

  // User State
  const [user, setUser] = useState(() => ({
    ...getLoggedInUser(),
    ...JSON.parse(localStorage.getItem("buyer_profile") || "{}"),
  }));

  // Dropdowns state
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Synchronize profile changes
  useEffect(() => {
    const refresh = () =>
      setUser({
        ...getLoggedInUser(),
        ...JSON.parse(localStorage.getItem("buyer_profile") || "{}"),
      });
    window.addEventListener("profileUpdated", refresh);
    return () => window.removeEventListener("profileUpdated", refresh);
  }, []);

  // Fetch Notifications
  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setNotifications([]);
      return;
    }

    try {
      setLoadingNotifs(true);
      const res = await axios.get(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        const formatted = res.data.map((item) => ({
          id: item.id,
          title: item.title,
          message: item.message,
          isRead: item.read || item.isRead || false,
          category: item.category || "General",
          time: item.createdOn
            ? new Date(item.createdOn).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })
            : "Recently",
        }));
        setNotifications(formatted);
        // Keep localStorage in sync with real DB data
        localStorage.setItem("buyer_notifications", JSON.stringify(formatted));
      } else {
        // DB returned empty — clear everything so no stale data shows
        setNotifications([]);
        localStorage.removeItem("buyer_notifications");
      }
    } catch (err) {
      // API error — show nothing rather than fake data
      setNotifications([]);
    } finally {
      setLoadingNotifs(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    window.addEventListener("notificationsUpdated", fetchNotifications);
    return () => window.removeEventListener("notificationsUpdated", fetchNotifications);
  }, []);

  // Save fallback notification updates to localStorage
  const updateNotificationsList = (updated) => {
    setNotifications(updated);
    localStorage.setItem("buyer_notifications", JSON.stringify(updated));
    window.dispatchEvent(new Event("notificationsUpdated"));
  };

  // Mark single notification read
  const handleMarkAsRead = async (id, isRead) => {
    if (isRead) return;
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await axios.put(`${API_URL}/notifications/${id}/read`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {
        // Fallback local update
      }
    }
    const updated = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    updateNotificationsList(updated);
  };

  // Mark all notifications read
  const handleMarkAllRead = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await axios.put(`${API_URL}/notifications/read-all`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {
        // Fallback local update
      }
    }
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    updateNotificationsList(updated);
  };

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync search input with URL search params when changed outside
  useEffect(() => {
    const q = searchParams.get("search");
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Search Submit Handler
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setShowSearchDropdown(false);
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/buyer/browse?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigate(`/buyer/browse`);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSearchDropdown(false);
    navigate(`/buyer/browse?search=${encodeURIComponent(suggestion)}`);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchDropdown(false);
    navigate(`/buyer/browse`);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "My Profile";
  const userEmail = user?.email || user?.userEmail || "buyer@realestate.com";
  const userInitials = (user?.firstName?.[0] || "B") + (user?.lastName?.[0] || "");

  // Filtered search suggestions
  const filteredSuggestions = popularSuggestions.filter(s =>
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="buyer-top-header">
      {/* Search Input Bar */}
      <div className="header-search-container" ref={searchContainerRef}>
        <form onSubmit={handleSearchSubmit} className="search-form">
          <Search className="search-header-icon" size={18} />
          <input
            type="text"
            className="search-header-input"
            placeholder="Search properties by location, title, or type..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
          />
          {searchQuery && (
            <button type="button" className="clear-search-btn" onClick={clearSearch} title="Clear search">
              <X size={15} />
            </button>
          )}
          <button type="submit" className="search-action-btn">
            Search
          </button>
        </form>

        {/* Live Search Suggestions Dropdown */}
        {showSearchDropdown && (searchQuery.trim().length > 0 || filteredSuggestions.length > 0) && (
          <div className="search-suggestions-dropdown">
            <div className="suggestions-header">
              <span>Popular & Matching Searches</span>
            </div>
            {searchQuery.trim() && (
              <div
                className="suggestion-item primary-search-item"
                onClick={() => handleSelectSuggestion(searchQuery.trim())}
              >
                <Search size={15} className="item-icon" />
                <span>Search for "<strong>{searchQuery}</strong>" in Properties</span>
              </div>
            )}
            {filteredSuggestions.map((s, idx) => (
              <div
                key={idx}
                className="suggestion-item"
                onClick={() => handleSelectSuggestion(s)}
              >
                <MapPin size={14} className="item-icon" />
                <span>{s}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Header Actions */}
      <div className="header-actions">
        {/* Messages Action */}
        <div
          className="header-icon-btn"
          onClick={() => navigate("/buyer/inquiries")}
          title="My Inquiries & Messages"
        >
          <MessageSquare size={20} />
          <span className="icon-badge-dot green"></span>
        </div>

        {/* Notifications Popover Toggle */}
        <div className="notif-wrapper" ref={notifRef}>
          <div
            className={`header-icon-btn ${showNotifications ? "active" : ""}`}
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="icon-badge-count">{unreadCount > 9 ? "9+" : unreadCount}</span>
            )}
          </div>

          {/* Floating Notifications Popover */}
          {showNotifications && (
            <div className="notifications-popover">
              <div className="notif-popover-header">
                <div className="notif-title-row">
                  <h3>Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="notif-count-badge">{unreadCount} New</span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button className="mark-read-all-btn" onClick={handleMarkAllRead}>
                    <CheckCheck size={14} /> Mark all read
                  </button>
                )}
              </div>

              <div className="notif-popover-body">
                {loadingNotifs ? (
                  <div className="notif-loading">Loading updates...</div>
                ) : notifications.length === 0 ? (
                  <div className="notif-empty">
                    <Bell size={28} />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  notifications.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className={`notif-item ${!item.isRead ? "unread" : ""}`}
                      onClick={() => handleMarkAsRead(item.id, item.isRead)}
                    >
                      <div className="notif-item-icon">
                        {item.category?.includes("Visit") ? (
                          <Calendar size={16} />
                        ) : item.category?.includes("Enquir") ? (
                          <MessageSquare size={16} />
                        ) : item.category?.includes("Saved") ? (
                          <Heart size={16} />
                        ) : (
                          <Sparkles size={16} />
                        )}
                      </div>
                      <div className="notif-item-content">
                        <div className="notif-item-top">
                          <h4>{item.title}</h4>
                          <span className="notif-time">{item.time}</span>
                        </div>
                        <p>{item.message}</p>
                      </div>
                      {!item.isRead && <span className="unread-dot"></span>}
                    </div>
                  ))
                )}
              </div>

              <div className="notif-popover-footer">
                <Link
                  to="/buyer/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="view-all-notif-link"
                >
                  View All Notifications <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="profile-wrapper" ref={profileRef}>
          <div
            className={`user-profile-pill ${showProfileMenu ? "active" : ""}`}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            {user?.profileImage ? (
              <img src={user.profileImage} alt={name} className="avatar-img" />
            ) : (
              <div className="avatar-fallback">{userInitials}</div>
            )}
            <div className="user-details-text">
              <h4 className="user-name">{name}</h4>
              <span className="user-role">Buyer</span>
            </div>
            <ChevronDown size={16} className={`chevron-icon ${showProfileMenu ? "rotate" : ""}`} />
          </div>

          {/* User Profile Dropdown */}
          {showProfileMenu && (
            <div className="profile-dropdown-menu">
              <div className="profile-menu-header">
                <div className="header-avatar">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt={name} />
                  ) : (
                    <div className="avatar-fallback-lg">{userInitials}</div>
                  )}
                </div>
                <div className="header-info">
                  <h4>{name}</h4>
                  <p>{userEmail}</p>
                </div>
              </div>

              <div className="profile-menu-items">
                <Link
                  to="/buyer/profile"
                  className="menu-item"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <User size={16} /> My Profile
                </Link>

                <div className="menu-divider"></div>

                <button
                  type="button"
                  className="menu-item logout-item"
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                    navigate("/login");
                  }}
                >
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

