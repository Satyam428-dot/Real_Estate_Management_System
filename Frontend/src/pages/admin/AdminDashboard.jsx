import AdminNavbar from "../../components/jsx/AdminNavbar";
import AdminSidebar from "../../components/jsx/AdminSidebar";
import "./AdminDashboard.css";
import { Outlet } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <>
      <AdminNavbar />

      <div className="admin-dashboard">
        <AdminSidebar />

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </>
  );
}
