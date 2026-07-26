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

// Buyer Imports
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import BuyerOverview from "./pages/buyer/BuyerOverview"; // 👈 ADD THIS IMPORT LINE HERE
import BrowseProperties from "./pages/buyer/BrowseProperties";
import SavedProperties from "./pages/buyer/SavedProperties";
import ScheduledVisits from "./pages/buyer/ScheduledVisits";

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
      </Route>

      {/* Buyer Routes */}
      <Route path="/buyer" element={<BuyerDashboard />}>
        <Route index element={<BuyerOverview />} />
        <Route path="dashboard" element={<BuyerOverview />} />
        <Route path="browse" element={<BrowseProperties />} />
        <Route path="saved" element={<SavedProperties />} />
        <Route path="visits" element={<ScheduledVisits />} />
      </Route>
    </Routes>
  );
}

export default App;