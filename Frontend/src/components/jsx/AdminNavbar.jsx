import "../css/AdminNavbar.css";
import { FaUserCircle } from "react-icons/fa";
import home_icon from "../../assets/home_icon.avif";

export default function AdminNavbar() {
  return (
    <header className="admin-navbar">
      <div className="admin-navbar-left">
        <div className="logo-container">
          {/* <span className="logo-icon">🏠</span>
          <h2 className="logo-text">
            Property<span className="logo-blue">HQ</span>
          </h2> */}
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
        <FaUserCircle className="admin-profile-icon" />
        <span className="admin-name">Admin User</span>
        <span className="dropdown-arrow">▼</span>
      </div>
    </header>
  );
}
