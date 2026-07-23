import { FaBars, FaBell, FaChevronDown } from "react-icons/fa";
import "../css/OwnerNavbar.css";

export default function OwnerNavbar() {
  return (
    <header className="owner-navbar">
      
      {/* Left side: Hamburger menu button */}
      <div className="navbar-left">
        <button className="menu-toggle-btn" aria-label="Toggle Sidebar">
          <FaBars />
        </button>
      </div>

      {/* Right side: Notifications & Profile */}
      <div className="navbar-right">
        
        {/* Bell icon with red badge count */}
        <div className="notification-wrapper">
          <FaBell className="bell-icon" />
          <span className="notification-badge">3</span>
        </div>

        {/* Profile User Badge */}
        <div className="user-profile">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="John Owner"
            className="user-avatar"
          />
          <div className="user-info">
            <span className="user-name">John Owner</span>
            <span className="user-role">Owner</span>
          </div>
          <FaChevronDown className="dropdown-icon" />
        </div>

      </div>

    </header>
  );
}
