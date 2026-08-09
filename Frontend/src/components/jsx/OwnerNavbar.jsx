import { JAVA_BACKEND_URL } from "../../utils/config";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getUserProfileDetails } from "../../utils/auth";
import {
  FaBell,
  FaChevronDown,
  FaUser,
  FaSignOutAlt,
  FaCheckCircle,
  FaWrench,
  FaExclamationCircle,
} from "react-icons/fa";
import "../css/OwnerNavbar.css";

const API_URL = `${JAVA_BACKEND_URL}`;

export default function OwnerNavbar() {
  const navigate = useNavigate();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userProfile, setUserProfile] = useState({
    fullName: "Property Owner",
    role: "Owner",
  });
  const [notifications, setNotifications] = useState([]);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const details = getUserProfileDetails();
    if (details && details.fullName) {
      setUserProfile({
        fullName: details.fullName,
        role: details.role === "OWNER" ? "Owner" : details.role,
      });
    }
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data && Array.isArray(res.data)) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch owner notifications:", err);
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.clear();
    navigate("/Login");
  };

  const unreadCount = notifications.filter((n) => !n.read && !n.isRead).length;

  return (
    <header className="owner-navbar">
      {/* Left side spacer */}
      <div className="navbar-left"></div>

      {/* Right side: Notifications + Profile */}
      <div className="navbar-right">

        {/* Notification Bell with Popup */}
        <div className="notification-wrapper" ref={notifRef}>
          <button
            className="icon-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileDropdown(false);
            }}
            title="Notifications"
          >
            <FaBell className="bell-icon" />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notif-popup">
              <div className="notif-popup-header">
                <h4>Notifications</h4>
                <span className="notif-count-pill">{unreadCount} New</span>
              </div>
              <div className="notif-popup-list">
                {notifications.length === 0 ? (
                  <div style={{ padding: "16px", textAlign: "center", color: "#64748b" }}>
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div key={item.id} className="notif-popup-item">
                      <div className="notif-popup-icon blue">
                        <FaCheckCircle />
                      </div>
                      <div className="notif-popup-content">
                        <p className="notif-popup-text">{item.title}</p>
                        <span className="notif-popup-meta">{item.message}</span>
                        <span className="notif-popup-time">{item.createdOn || "Recently"}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge + Dropdown */}
        <div className="user-profile-wrapper" ref={profileRef}>
          <div
            className="user-profile"
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown);
              setShowNotifications(false);
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt={userProfile.fullName}
              className="user-avatar"
            />
            <div className="user-info">
              <span className="user-name">{userProfile.fullName}</span>
              <span className="user-role">{userProfile.role}</span>
            </div>
            <FaChevronDown
              className={`dropdown-chevron ${showProfileDropdown ? "rotate" : ""}`}
            />
          </div>

          {showProfileDropdown && (
            <div className="profile-dropdown">
              <button
                className="profile-dropdown-item"
                onClick={() => {
                  setShowProfileDropdown(false);
                  navigate("/owner/profile");
                }}
              >
                <FaUser className="profile-dropdown-icon" />
                <span>My Profile</span>
              </button>

              <div className="profile-dropdown-divider"></div>

              <button
                className="profile-dropdown-item logout"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="profile-dropdown-icon" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
