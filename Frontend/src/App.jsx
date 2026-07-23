import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import LoginPage from "./pages/Login";
import Properties from "./pages/Properties";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Agents from "./pages/Agents";

import AdminDashboard from "./pages/admin/AdminDashboard";
import DashboardOverview from "./pages/admin/DashboardOverview";
import ViewAllUsers from "./pages/admin/ViewAllUsers";
import ApproveOwners from "./pages/admin/ApproveOwner";
import ApproveProperties from "./pages/admin/ApproveProperties";
import ManageListings from "./pages/admin/ManageListing";
import ViewReports from "./pages/admin/ViewReport";

// import BuyerDashboard from "./pages/buyer/BuyerDashboard";

import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerOverview from "./pages/owner/OwnerOverview";

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/agents" element={<Agents />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<DashboardOverview />} />
          <Route path="dashboard" element={<DashboardOverview />} />
          <Route path="users" element={<ViewAllUsers />} />
          <Route path="owners" element={<ApproveOwners />} />
          <Route path="properties" element={<ApproveProperties />} />
          <Route path="listings" element={<ManageListings />} />
          <Route path="reports" element={<ViewReports />} />
        </Route>

         {/* Buyer Dashboard (commented out until page is created) */}
         {/* <Route path="/buyer" element={<BuyerDashboard />} /> */}

        {/* Owner Routes */}
        <Route path="/owner" element={<OwnerDashboard />}>
          <Route index element={<OwnerOverview />} />
          <Route path="dashboard" element={<OwnerOverview />} />
        </Route>
          
      </Routes>
    </>
  );
}

export default App;
