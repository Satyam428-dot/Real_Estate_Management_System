import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBuilding,
  FaUsers,
  FaMoneyBillWave,
  FaWrench,
  FaTag,
  FaChartBar,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import "../css/OwnerSidebar.css";

export default function OwnerSidebar() {
  return (
    <aside className="owner-sidebar">

      {/* SECTION 1: Logo area at the top */}
      <div className="owner-sidebar-logo">
        <FaBuilding className="logo-icon" />
        <span>RealEstate</span>
      </div>

      {/* SECTION 2: Navigation menu in the middle */}
      <ul className="owner-sidebar-menu">

        <NavLink to="/owner/dashboard" className="owner-nav-link">
          <li className="owner-sidebar-item">
            <FaHome className="owner-sidebar-icon" />
            <span>Dashboard</span>
          </li>
        </NavLink>

        <NavLink to="/owner/properties" className="owner-nav-link">
          <li className="owner-sidebar-item">
            <FaBuilding className="owner-sidebar-icon" />
            <span>My Properties</span>
          </li>
        </NavLink>

        <NavLink to="/owner/tenants" className="owner-nav-link">
          <li className="owner-sidebar-item">
            <FaUsers className="owner-sidebar-icon" />
            <span>Tenants</span>
          </li>
        </NavLink>

        <NavLink to="/owner/payments" className="owner-nav-link">
          <li className="owner-sidebar-item">
            <FaMoneyBillWave className="owner-sidebar-icon" />
            <span>Rent & Payments</span>
          </li>
        </NavLink>

        <NavLink to="/owner/maintenance" className="owner-nav-link">
          <li className="owner-sidebar-item">
            <FaWrench className="owner-sidebar-icon" />
            <span>Maintenance</span>
          </li>
        </NavLink>

        <NavLink to="/owner/sales" className="owner-nav-link">
          <li className="owner-sidebar-item">
            <FaTag className="owner-sidebar-icon" />
            <span>Sales</span>
          </li>
        </NavLink>

        <NavLink to="/owner/reports" className="owner-nav-link">
          <li className="owner-sidebar-item">
            <FaChartBar className="owner-sidebar-icon" />
            <span>Reports</span>
          </li>
        </NavLink>

        <NavLink to="/owner/profile" className="owner-nav-link">
          <li className="owner-sidebar-item">
            <FaUser className="owner-sidebar-icon" />
            <span>Profile</span>
          </li>
        </NavLink>

        <NavLink to="/owner/settings" className="owner-nav-link">
          <li className="owner-sidebar-item">
            <FaCog className="owner-sidebar-icon" />
            <span>Settings</span>
          </li>
        </NavLink>

      </ul>

      {/* SECTION 3: Logout pinned at the bottom */}
      <div className="owner-sidebar-logout">
        <FaSignOutAlt className="owner-sidebar-icon" />
        <span>Logout</span>
      </div>

    </aside>
  );
}
