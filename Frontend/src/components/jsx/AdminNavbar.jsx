import "../css/AdminNavbar.css";
import { FaUserCircle } from "react-icons/fa";
import home_icon from "../../assets/home_icon.avif";
import { useEffect, useRef, useState } from "react";
import ProfileDropdown from "../../pages/admin/components/ProfileDropdown";
import { getLoggedInUser } from "../../utils/auth";

export default function AdminNavbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const profileRef = useRef(null);
  const user = getLoggedInUser();
  const adminName = user?.firstName || user?.name || "Admin";

  useEffect(() => {
    const closeDropdown = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setShowDropdown(false);
    };

    document.addEventListener("mousedown", closeDropdown);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeDropdown);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <header className="admin-navbar">
      <div className="admin-navbar-left">
        <div className="logo-container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img
              src={home_icon}
              alt="PropertyHQ Logo"
              width="40"
              height="40"
              className="me-2"
            />
            <span className="fw-bold logo-text">
              PROPERTY<span className="logo-hq">HQ</span>
            </span>
          </a>
        </div>
      </div>

      <div className="admin-navbar-right">
        <div className="profile-wrapper" ref={profileRef}>
          <button
            type="button"
            className="admin-profile-trigger"
            onClick={() => setShowDropdown((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={showDropdown}
          >
            <span className="admin-profile-avatar" aria-hidden="true">
              <FaUserCircle />
            </span>
            <span className="admin-profile-details">
              <span className="admin-name">{adminName}</span>
              <span className="admin-role">Administrator</span>
            </span>
            <span
              className={`dropdown-arrow ${showDropdown ? "open" : ""}`}
              aria-hidden="true"
            >
              ▾
            </span>
          </button>

          {showDropdown && (
            <ProfileDropdown onClose={() => setShowDropdown(false)} />
          )}
        </div>
      </div>
    </header>
  );
}
