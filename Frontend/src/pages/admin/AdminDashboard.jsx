import AdminNavbar from "../../components/jsx/AdminNavbar";
import AdminSidebar from "../../components/jsx/AdminSidebar";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  return (
    <>
      <AdminNavbar />

      <div className="admin-dashboard">
        <AdminSidebar />

        <div className="admin-content">
          <h1>Welcome Admin</h1>
        </div>
      </div>
    </>
  );
}
