import "../css/AdminSidebar.css";
import {
  FaHome,
  FaUsers,
  FaUserCheck,
  FaBuilding,
  FaListAlt,
  FaChartBar,
} from "react-icons/fa";

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <ul className="sidebar-menu">
        <li className="sidebar-item active">
          <FaHome className="sidebar-icon" />
          <span>Dashboard Overview</span>
        </li>

        <li className="sidebar-item">
          <FaUsers className="sidebar-icon" />
          <span>View All Users</span>
        </li>

        <li className="sidebar-item">
          <FaUserCheck className="sidebar-icon" />
          <span>Approve Owners</span>
        </li>

        <li className="sidebar-item">
          <FaBuilding className="sidebar-icon" />
          <span>Approve Properties</span>
        </li>

        <li className="sidebar-item">
          <FaListAlt className="sidebar-icon" />
          <span>Manage Listings</span>
        </li>

        <li className="sidebar-item">
          <FaChartBar className="sidebar-icon" />
          <span>View Reports</span>
        </li>
      </ul>
    </aside>
  );
}
