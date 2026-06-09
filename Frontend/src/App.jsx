import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import LoginPage from "./pages/Login";
import Properties from "./pages/Properties";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DashboardOverview from "./pages/admin/DashboardOverview";
import ViewAllUsers from "./pages/admin/ViewAllUsers";
import ApproveOwners from "./pages/admin/ApproveOwner";
import ApproveProperties from "./pages/admin/ApproveProperties";
import ManageListings from "./pages/admin/ManageListing";
import ViewReports from "./pages/admin/ViewReport";

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/properties" element={<Properties />} />

        {/* Admin Routes */}
        {/* <Route path="/admin" element={<AdminDashboard />} />
        <Route index element={<DashboardOverview />} />
        <Route path="dashboard" element={<DashboardOverview />} />
        <Route path="users" element={<ViewAllUsers />} />
        <Route path="owners" element={<ApproveOwners />} />
        <Route path="properties" element={<ApproveProperties />} />
        <Route path="listings" element={<ManageListings />} />
        <Route path="reports" element={<ViewReports />} />
      </Routes> */}

        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<DashboardOverview />} />
          <Route path="dashboard" element={<DashboardOverview />} />
          <Route path="users" element={<ViewAllUsers />} />
          <Route path="owners" element={<ApproveOwners />} />
          <Route path="properties" element={<ApproveProperties />} />
          <Route path="listings" element={<ManageListings />} />
          <Route path="reports" element={<ViewReports />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
