import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

export default function OwnerNavbar() {
  const navigate = useNavigate();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userProfile, setUserProfile] = useState({
    fullName: "Property Owner",
    role: "Owner",
  });

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
  }, []);

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

  return (
    <header className="owner-navbar">
      {/* Left side: empty spacer (hamburger removed per user request) */}
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
            <span className="notification-badge">3</span>
          </button>

          {showNotifications && (
            <div className="notif-popup">
              <div className="notif-popup-header">
                <h4>Notifications</h4>
                <span className="notif-count-pill">3 New</span>
              </div>
              <div className="notif-popup-list">
                <div className="notif-popup-item">
                  <div className="notif-popup-icon green">
                    <FaCheckCircle />
                  </div>
                  <div className="notif-popup-content">
                    <p className="notif-popup-text">Rent received from Rahul Sharma</p>
                    <span className="notif-popup-meta">Property: Modern Apartment in Downtown</span>
                    <span className="notif-popup-time">2 hours ago</span>
                  </div>
                  <span className="notif-popup-amount green">₹25,000</span>
                </div>

                <div className="notif-popup-item">
                  <div className="notif-popup-icon blue">
                    <FaWrench />
                  </div>
                  <div className="notif-popup-content">
                    <p className="notif-popup-text">New maintenance request received</p>
                    <span className="notif-popup-meta">Property: Luxury Villa in Green City</span>
                    <span className="notif-popup-time">5 hours ago</span>
                  </div>
                </div>

                <div className="notif-popup-item">
                  <div className="notif-popup-icon green">
                    <FaCheckCircle />
                  </div>
                  <div className="notif-popup-content">
                    <p className="notif-popup-text">Rent received from Priya Mehta</p>
                    <span className="notif-popup-meta">Property: Studio Apartment</span>
                    <span className="notif-popup-time">1 day ago</span>
                  </div>
                  <span className="notif-popup-amount green">₹12,000</span>
                </div>

                <div className="notif-popup-item">
                  <div className="notif-popup-icon orange">
                    <FaExclamationCircle />
                  </div>
                  <div className="notif-popup-content">
                    <p className="notif-popup-text">Property "Commercial Shop" marked as vacant</p>
                    <span className="notif-popup-time">1 day ago</span>
                  </div>
                </div>
              </div>
              <div className="notif-popup-footer">
                <button className="notif-view-all">View All Notifications</button>
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
