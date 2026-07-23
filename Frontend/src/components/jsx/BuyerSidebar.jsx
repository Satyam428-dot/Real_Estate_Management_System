import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaSearch,
  FaHeart,
  FaBalanceScale,
  FaCalendarCheck,
  FaClipboardCheck,
  FaComments,
  FaBell,
  FaStar,
  FaUserCircle,
  FaHeadset,
  FaSignOutAlt,
} from "react-icons/fa";

import "../css/BuyerSidebar.css";

export default function BuyerSidebar() {
  return (
    <aside className="buyer-sidebar">

      <div className="sidebar-logo">
        <h2>Real Estate</h2>
        <p>Buyer Panel</p>
      </div>

      <ul className="sidebar-menu">

        <NavLink to="/buyer" className="nav-link">
          <li className="sidebar-item">
            <FaHome className="sidebar-icon" />
            <span>Dashboard</span>
          </li>
        </NavLink>

        <NavLink to="/buyer/properties" className="nav-link">
          <li className="sidebar-item">
            <FaSearch className="sidebar-icon" />
            <span>Browse Properties</span>
          </li>
        </NavLink>

        <NavLink to="/buyer/saved" className="nav-link">
          <li className="sidebar-item">
            <FaHeart className="sidebar-icon" />
            <span>Saved Properties</span>
          </li>
        </NavLink>

        <NavLink to="/buyer/compare" className="nav-link">
          <li className="sidebar-item">
            <FaBalanceScale className="sidebar-icon" />
            <span>Compare Properties</span>
          </li>
        </NavLink>

        <NavLink to="/buyer/visit" className="nav-link">
          <li className="sidebar-item">
            <FaCalendarCheck className="sidebar-icon" />
            <span>Schedule Visit</span>
          </li>
        </NavLink>

        <NavLink to="/buyer/bookings" className="nav-link">
          <li className="sidebar-item">
            <FaClipboardCheck className="sidebar-icon" />
            <span>My Bookings</span>
          </li>
        </NavLink>

        <NavLink to="/buyer/inquiries" className="nav-link">
          <li className="sidebar-item">
            <FaComments className="sidebar-icon" />
            <span>My Inquiries</span>
          </li>
        </NavLink>

        <NavLink to="/buyer/notifications" className="nav-link">
          <li className="sidebar-item">
            <FaBell className="sidebar-icon" />
            <span>Notifications</span>
          </li>
        </NavLink>

        <NavLink to="/buyer/reviews" className="nav-link">
          <li className="sidebar-item">
            <FaStar className="sidebar-icon" />
            <span>Reviews & Ratings</span>
          </li>
        </NavLink>

        <NavLink to="/buyer/profile" className="nav-link">
          <li className="sidebar-item">
            <FaUserCircle className="sidebar-icon" />
            <span>My Profile</span>
          </li>
        </NavLink>

        <NavLink to="/buyer/support" className="nav-link">
          <li className="sidebar-item">
            <FaHeadset className="sidebar-icon" />
            <span>Help & Support</span>
          </li>
        </NavLink>

      </ul>

      <div className="logout-section">
        <button className="logout-btn">
          <FaSignOutAlt />
          Logout
        </button>
      </div>

    </aside>
  );
}