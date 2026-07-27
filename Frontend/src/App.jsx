// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import LoginPage from "./pages/Login";
import Properties from "./pages/Properties";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Agents from "./pages/Agents";

// Admin Imports
import AdminDashboard from "./pages/admin/AdminDashboard";
import DashboardOverview from "./pages/admin/DashboardOverview";
import ViewAllUsers from "./pages/admin/ViewAllUsers";
import ApproveOwners from "./pages/admin/ApproveOwner";
import ApproveProperties from "./pages/admin/ApproveProperties";
import ManageListings from "./pages/admin/ManageListing";
import ViewReports from "./pages/admin/ViewReport";

// Buyer Imports
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import BuyerOverview from "./pages/buyer/BuyerOverview";
import BrowseProperties from "./pages/buyer/BrowseProperties";
import SavedProperties from "./pages/buyer/SavedProperties";
import ScheduledVisits from "./pages/buyer/ScheduledVisits";
import MyBookings from "./pages/buyer/MyBookings";
import Notifications from "./pages/buyer/Notifications";
import ReviewsAndRatings from "./pages/buyer/ReviewsAndRatings";
import MyProfile from "./pages/buyer/MyProfile";

// Owner Imports
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerOverview from "./pages/owner/OwnerOverview";
import MyProperties from "./pages/owner/MyProperties";
import AddProperty from "./pages/owner/AddProperty";
import Tenants from "./pages/owner/Tenants";
import RentPayments from "./pages/owner/RentPayments";
import Profile from "./pages/owner/Profile";
import Settings from "./pages/owner/Settings";
import MyInquiries from "./pages/buyer/MyInquiries";
import Maintenance from "./pages/owner/Maintenance";
import Sales from "./pages/owner/Sales";

function App() {
  return (
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

      {/* Buyer Routes */}
      <Route path="/buyer" element={<BuyerDashboard />}>
        <Route index element={<BuyerOverview />} />
        <Route path="dashboard" element={<BuyerOverview />} />
        <Route path="browse" element={<BrowseProperties />} />
        <Route path="saved" element={<SavedProperties />} />
        <Route path="visits" element={<ScheduledVisits />} />
        <Route path="bookings" element={<MyBookings />} />
        <Route path="inquiries" element={<MyInquiries />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="reviews" element={<ReviewsAndRatings />} />
        <Route path="profile" element={<MyProfile />} />
      </Route>

      {/* Owner Routes */}
      <Route path="/owner" element={<OwnerDashboard />}>
        <Route index element={<OwnerOverview />} />
        <Route path="dashboard" element={<OwnerOverview />} />
        <Route path="properties" element={<MyProperties />} />
        <Route path="add-property" element={<AddProperty />} />
        <Route path="tenants" element={<Tenants />} />
        <Route path="payments" element={<RentPayments />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="maintenance" element={<Maintenance />} />
        <Route path="sales" element={<Sales />} />
      </Route>
    </Routes>
  );
}

export default App;
