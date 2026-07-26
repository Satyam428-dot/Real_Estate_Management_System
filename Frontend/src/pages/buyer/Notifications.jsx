import React, { useState } from "react";
import {
  Bell,
  Calendar,
  MessageSquare,
  Bookmark,
  Sparkles,
  CheckCircle2,
  Tag,
  ShieldAlert,
  Info,
  ChevronRight,
  Headphones,
  CheckCheck,
} from "lucide-react";
import "./Notifications.css";

const initialNotifications = [
  {
    id: 1,
    title: "Your visit is scheduled",
    message: 'Your visit for "Luxury 2BHK Apartment" is scheduled on 24 May 2024 at 11:00 AM.',
    time: "10:15 AM",
    date: "Today",
    isRead: false,
    category: "Bookings & Visits",
    icon: Calendar,
    iconBg: "#eff6ff",
    iconColor: "#2563eb",
  },
  {
    id: 2,
    title: "New reply to your enquiry",
    message: 'Seller has replied to your enquiry for "Elegant Villa".',
    time: "Yesterday",
    date: "Yesterday",
    isRead: false,
    category: "Enquiries",
    icon: MessageSquare,
    iconBg: "#f0fdf4",
    iconColor: "#16a34a",
  },
  {
    id: 3,
    title: "Property saved successfully",
    message: '"Modern 3BHK Apartment" has been saved to your collection.',
    time: "22 May 2024",
    date: "22 May 2024",
    isRead: false,
    category: "Saved Properties",
    icon: Bookmark,
    iconBg: "#fff7ed",
    iconColor: "#ea580c",
  },
  {
    id: 4,
    title: "New property matches your search",
    message: "We found 5 new properties that match your preferences.",
    time: "20 May 2024",
    date: "20 May 2024",
    isRead: true,
    category: "Offers & Updates",
    icon: Sparkles,
    iconBg: "#faf5ff",
    iconColor: "#9333ea",
  },
  {
    id: 5,
    title: "Booking confirmed",
    message: 'Your booking for "Furnished 3BHK Apartment" is confirmed.',
    time: "18 May 2024",
    date: "18 May 2024",
    isRead: true,
    category: "Bookings & Visits",
    icon: CheckCircle2,
    iconBg: "#eff6ff",
    iconColor: "#2563eb",
  },
  {
    id: 6,
    title: "Special offer for you!",
    message: "Get up to 10% off on select properties. Limited time offer.",
    time: "17 May 2024",
    date: "17 May 2024",
    isRead: true,
    category: "Offers & Updates",
    icon: Tag,
    iconBg: "#fefce8",
    iconColor: "#ca8a04",
  },
  {
    id: 7,
    title: "Security alert",
    message: "New login detected on your account from Chrome on Windows.",
    time: "15 May 2024",
    date: "15 May 2024",
    isRead: true,
    category: "Account & Security",
    icon: ShieldAlert,
    iconBg: "#fef2f2",
    iconColor: "#dc2626",
  },
  {
    id: 8,
    title: "Welcome to EstateHub!",
    message: "Thank you for joining EstateHub. Let's help you find your dream home.",
    time: "10 May 2024",
    date: "10 May 2024",
    isRead: true,
    category: "Account & Security",
    icon: Info,
    iconBg: "#eff6ff",
    iconColor: "#2563eb",
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All Notifications");

  // Mark all as read handler
  const handleMarkAllRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, isRead: true }))
    );
  };

  // Toggle single item read status
  const handleToggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isRead: true } : item
      )
    );
  };

  // Category counts
  const totalCount = notifications.length;
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const bookingsCount = notifications.filter((n) => n.category === "Bookings & Visits").length;
  const enquiriesCount = notifications.filter((n) => n.category === "Enquiries").length;
  const offersCount = notifications.filter((n) => n.category === "Offers & Updates").length;
  const accountCount = notifications.filter((n) => n.category === "Account & Security").length;

  // Filter List Logic
  const filteredNotifications = notifications.filter((item) => {
    // Read status tab filter
    if (activeTab === "Unread" && item.isRead) return false;

    // Sidebar category filter
    if (activeCategory === "Unread" && item.isRead) return false;
    if (activeCategory === "Bookings & Visits" && item.category !== "Bookings & Visits") return false;
    if (activeCategory === "Enquiries" && item.category !== "Enquiries") return false;
    if (activeCategory === "Offers & Updates" && item.category !== "Offers & Updates") return false;
    if (activeCategory === "Account & Security" && item.category !== "Account & Security") return false;

    return true;
  });

  return (
    <div className="notifications-container">
      {/* Header */}
      <div className="notifications-header">
        <div>
          <h1>Notifications</h1>
          <p>Stay updated with the latest alerts and activities.</p>
        </div>
        <button className="btn-mark-all-read" onClick={handleMarkAllRead}>
          <CheckCheck size={16} /> Mark all as read
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="notifications-layout">
        {/* Left Column: List */}
        <div className="notifications-main-content">
          {/* Read Status Filter Tabs */}
          <div className="status-tabs">
            <button
              className={`tab-btn ${activeTab === "All" ? "active" : ""}`}
              onClick={() => setActiveTab("All")}
            >
              <Bell size={15} /> All ({totalCount})
            </button>
            <button
              className={`tab-btn ${activeTab === "Unread" ? "active" : ""}`}
              onClick={() => setActiveTab("Unread")}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notifications List */}
          <div className="notifications-list">
            {filteredNotifications.length === 0 ? (
              <div className="empty-state">
                <Bell size={32} />
                <p>No notifications found.</p>
              </div>
            ) : (
              filteredNotifications.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.id}
                    className={`notification-item ${!item.isRead ? "unread" : ""}`}
                    onClick={() => handleToggleRead(item.id)}
                  >
                    <div
                      className="notification-icon"
                      style={{ backgroundColor: item.iconBg, color: item.iconColor }}
                    >
                      <IconComponent size={20} />
                    </div>

                    <div className="notification-content">
                      <div className="notification-top">
                        <h4>{item.title}</h4>
                      </div>
                      <p>{item.message}</p>
                    </div>

                    <div className="notification-meta">
                      <span className="notification-time">{item.time}</span>
                      <span
                        className={`status-dot ${!item.isRead ? "dot-unread" : "dot-read"}`}
                      ></span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="notifications-sidebar">
          {/* Category Filter Widget */}
          <div className="widget-card filter-widget">
            <h3>Filter Notifications</h3>
            <div className="filter-menu">
              <button
                className={`filter-item ${
                  activeCategory === "All Notifications" ? "active" : ""
                }`}
                onClick={() => setActiveCategory("All Notifications")}
              >
                <div className="filter-item-left">
                  <Bell size={16} />
                  <span>All Notifications</span>
                </div>
                <span className="badge-count">{totalCount}</span>
              </button>

              <button
                className={`filter-item ${activeCategory === "Unread" ? "active" : ""}`}
                onClick={() => setActiveCategory("Unread")}
              >
                <div className="filter-item-left">
                  <span className="blue-dot"></span>
                  <span>Unread</span>
                </div>
                <span className="badge-count">{unreadCount}</span>
              </button>

              <button
                className={`filter-item ${
                  activeCategory === "Bookings & Visits" ? "active" : ""
                }`}
                onClick={() => setActiveCategory("Bookings & Visits")}
              >
                <div className="filter-item-left">
                  <Calendar size={16} />
                  <span>Bookings & Visits</span>
                </div>
                <span className="badge-count">{bookingsCount}</span>
              </button>

              <button
                className={`filter-item ${
                  activeCategory === "Enquiries" ? "active" : ""
                }`}
                onClick={() => setActiveCategory("Enquiries")}
              >
                <div className="filter-item-left">
                  <MessageSquare size={16} />
                  <span>Enquiries</span>
                </div>
                <span className="badge-count">{enquiriesCount}</span>
              </button>

              <button
                className={`filter-item ${
                  activeCategory === "Offers & Updates" ? "active" : ""
                }`}
                onClick={() => setActiveCategory("Offers & Updates")}
              >
                <div className="filter-item-left">
                  <Tag size={16} />
                  <span>Offers & Updates</span>
                </div>
                <span className="badge-count">{offersCount}</span>
              </button>

              <button
                className={`filter-item ${
                  activeCategory === "Account & Security" ? "active" : ""
                }`}
                onClick={() => setActiveCategory("Account & Security")}
              >
                <div className="filter-item-left">
                  <ShieldAlert size={16} />
                  <span>Account & Security</span>
                </div>
                <span className="badge-count">{accountCount}</span>
              </button>
            </div>
          </div>

          {/* Need Help Widget */}
          <div className="widget-card help-widget">
            <h3>Need Help?</h3>
            <p>
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <button className="btn-contact-support">
              <Headphones size={16} /> Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}