import React from "react";
import { Outlet } from "react-router-dom";
import BuyerSidebar from "../../components/jsx/BuyerSidebar";
import BuyerNavbar from "../../components/jsx/BuyerNavbar";
import Chatbot from "../../components/jsx/Chatbot";
import "./BuyerDashboard.css";

export default function BuyerDashboard() {
  return (
    <div className="buyer-dashboard-layout">
      {/* Shared Persistent Sidebar Component */}
      <BuyerSidebar />

      {/* Main Content Container */}
      <main className="main-wrapper">
        {/* Shared Persistent Navbar Component */}
        <BuyerNavbar />

        {/* Dynamic sub-page content loads HERE via React Router */}
        <div className="page-body">
          <Outlet />
        </div>
      </main>

      {/* Floating AI Assistant Chatbot */}
      <Chatbot mode="floating" title="Real Estate AI Assistant" />
    </div>
  );
}