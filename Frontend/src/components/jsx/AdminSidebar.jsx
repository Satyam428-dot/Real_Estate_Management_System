import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaUserCheck,
  FaBuilding,
  FaListAlt,
  FaChartBar,
} from "react-icons/fa";

import "../css/AdminSidebar.css";

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <ul className="sidebar-menu">
        <NavLink to="/admin/dashboard" className="nav-link">
          <li className="sidebar-item">
            <FaHome className="sidebar-icon" />
            <span>Dashboard Overview</span>
          </li>
        </NavLink>

        <NavLink to="/admin/users" className="nav-link">
          <li className="sidebar-item">
            <FaUsers className="sidebar-icon" />
            <span>View All Users</span>
          </li>
        </NavLink>

        <NavLink to="/admin/owners" className="nav-link">
          <li className="sidebar-item">
            <FaUserCheck className="sidebar-icon" />
            <span>Approve Owners</span>
          </li>
        </NavLink>

        <NavLink to="/admin/properties" className="nav-link">
          <li className="sidebar-item">
            <FaBuilding className="sidebar-icon" />
            <span>Approve Properties</span>
          </li>
        </NavLink>

        <NavLink to="/admin/listings" className="nav-link">
          <li className="sidebar-item">
            <FaListAlt className="sidebar-icon" />
            <span>Manage Listings</span>
          </li>
        </NavLink>

        <NavLink to="/admin/reports" className="nav-link">
          <li className="sidebar-item">
            <FaChartBar className="sidebar-icon" />
            <span>View Reports</span>
          </li>
        </NavLink>
      </ul>
    </aside>
  );
}
