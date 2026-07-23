import { Outlet } from "react-router-dom";
import OwnerSidebar from "../../components/jsx/OwnerSidebar";
import OwnerNavbar from "../../components/jsx/OwnerNavbar";
import "./OwnerDashboard.css";

export default function OwnerDashboard() {
  return (
    <div className="owner-layout">
      {/* Left fixed sidebar */}
      <OwnerSidebar />

      {/* Right area: Top Navbar + Page Content */}
      <div className="owner-main-wrapper">
        <OwnerNavbar />
        
        <main className="owner-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
