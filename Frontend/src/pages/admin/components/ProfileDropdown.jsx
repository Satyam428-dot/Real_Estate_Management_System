import "./ProfileDropdown.css";
import { FaUser, FaKey, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ProfileDropdown({ onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    onClose();
    navigate("/Login", { replace: true });
  };

  return (
    <div className="profile-dropdown" role="menu" aria-label="Profile options">
      <button
        type="button"
        className="profile-menu-item"
        role="menuitem"
        onClick={() => { onClose(); navigate("/admin/profile"); }}
      >
        <FaUser className="profile-menu-icon" />
        <span className="profile-menu-text">My Profile</span>
      </button>

      <button
        type="button"
        className="profile-menu-item"
        role="menuitem"
        onClick={() => { onClose(); navigate("/admin/change-password"); }}
      >
        <FaKey className="profile-menu-icon" />
        <span className="profile-menu-text">Change Password</span>
      </button>

      <button
        type="button"
        className="profile-menu-item profile-menu-logout"
        role="menuitem"
        onClick={handleLogout}
      >
        <FaSignOutAlt className="profile-menu-icon" />
        <span className="profile-menu-text">Logout</span>
      </button>
    </div>
  );
}
