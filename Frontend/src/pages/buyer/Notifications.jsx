import { JAVA_BACKEND_URL } from "../../utils/config";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
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
  Headphones,
  CheckCheck,
  Trash2,
} from "lucide-react";
import "./Notifications.css";

const API_URL = `${JAVA_BACKEND_URL}`;

const fallbackNotifications = [
  {
    id: 101,
    title: "Your visit is scheduled",
    message: 'Your visit for "Luxury 2BHK Apartment" is scheduled on 24 May 2024 at 11:00 AM.',
    time: "Today",
    isRead: false,
    category: "Bookings & Visits",
  },
  {
    id: 102,
    title: "New reply to your enquiry",
    message: 'Seller has replied to your enquiry for "Elegant Villa".',
    time: "Yesterday",
    isRead: false,
    category: "Enquiries",
  },
  {
    id: 103,
    title: "Property saved successfully",
    message: '"Modern 3BHK Apartment" has been saved to your collection.',
    time: "22 May 2024",
    isRead: false,
    category: "Saved Properties",
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All Notifications");

  const fetchNotifications = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      const stored = localStorage.getItem("buyer_notifications");
      setNotifications(stored ? JSON.parse(stored) : fallbackNotifications);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        const formatted = res.data.map((item) => ({
          id: item.id,
          title: item.title,
          message: item.message,
          isRead: item.read || item.isRead || false,
          category: item.category || "General",
          time: item.createdOn
            ? new Date(item.createdOn).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "Recently",
        }));
        setNotifications(formatted);
        // Sync real DB data to localStorage so navbar stays consistent
        localStorage.setItem("buyer_notifications", JSON.stringify(formatted));
        window.dispatchEvent(new Event("notificationsUpdated"));
      } else {
        // API returned 0 items — clear localStorage too so navbar is consistent
        localStorage.removeItem("buyer_notifications");
        setNotifications([]);
        window.dispatchEvent(new Event("notificationsUpdated"));
      }
    } catch (err) {
      console.error("Failed to fetch notifications from backend:", err);
      const stored = localStorage.getItem("buyer_notifications");
      setNotifications(stored ? JSON.parse(stored) : fallbackNotifications);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Helper: persist updated list to localStorage and sync navbar
  const syncToStorage = (updated) => {
    localStorage.setItem("buyer_notifications", JSON.stringify(updated));
    window.dispatchEvent(new Event("notificationsUpdated"));
  };

  // Mark all as read handler
  const handleMarkAllRead = async () => {
    const token = localStorage.getItem("token");
    // Optimistic update
    const updated = notifications.map((item) => ({ ...item, isRead: true }));
    setNotifications(updated);
    syncToStorage(updated);
    toast.success("All notifications marked as read.");
    try {
      if (token) {
        await axios.put(
          `${API_URL}/notifications/read-all`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  // Toggle single item read status
  const handleToggleRead = async (id, currentStatus) => {
    if (currentStatus) return; // already read

    // Optimistic update
    const updated = notifications.map((item) =>
      item.id === id ? { ...item, isRead: true } : item
    );
    setNotifications(updated);
    syncToStorage(updated);

    const token = localStorage.getItem("token");
    try {
      if (token) {
        await axios.put(
          `${API_URL}/notifications/${id}/read`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // Delete notification
  const handleDeleteNotification = async (id, e) => {
    e.stopPropagation();

    // Optimistic real-time removal
    const updated = notifications.filter((item) => item.id !== id);
    setNotifications(updated);
    syncToStorage(updated);
    toast.info("Notification removed.");

    const token = localStorage.getItem("token");
    try {
      if (token) {
        await axios.delete(`${API_URL}/notifications/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  // Map Category to Icon & Styling
  const getIconForCategory = (category, title = "") => {
    const titleLower = title.toLowerCase();
    if (category === "Bookings & Visits" || titleLower.includes("visit") || titleLower.includes("booking")) {
      if (titleLower.includes("confirmed")) {
        return { icon: CheckCircle2, bg: "#eff6ff", color: "#2563eb" };
      }
      return { icon: Calendar, bg: "#eff6ff", color: "#2563eb" };
    }
    if (category === "Enquiries" || titleLower.includes("enquiry") || titleLower.includes("reply")) {
      return { icon: MessageSquare, bg: "#f0fdf4", color: "#16a34a" };
    }
    if (category === "Saved Properties" || titleLower.includes("saved")) {
      return { icon: Bookmark, bg: "#fff7ed", color: "#ea580c" };
    }
    if (category === "Offers & Updates" || titleLower.includes("offer")) {
      return { icon: Tag, bg: "#fefce8", color: "#ca8a04" };
    }
    if (category === "Account & Security" || titleLower.includes("security")) {
      return { icon: ShieldAlert, bg: "#fef2f2", color: "#dc2626" };
    }
    return { icon: Info, bg: "#faf5ff", color: "#9333ea" };
  };

  // Category counts
  const totalCount = notifications.length;
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const bookingsCount = notifications.filter((n) => n.category === "Bookings & Visits").length;
  const enquiriesCount = notifications.filter((n) => n.category === "Enquiries").length;
  const savedPropsCount = notifications.filter((n) => n.category === "Saved Properties").length;
  const offersCount = notifications.filter((n) => n.category === "Offers & Updates").length;
  const accountCount = notifications.filter((n) => n.category === "Account & Security").length;

  // Filter List Logic
  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === "Unread" && item.isRead) return false;

    if (activeCategory === "Unread" && item.isRead) return false;
    if (activeCategory === "Bookings & Visits" && item.category !== "Bookings & Visits") return false;
    if (activeCategory === "Enquiries" && item.category !== "Enquiries") return false;
    if (activeCategory === "Saved Properties" && item.category !== "Saved Properties") return false;
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
        {unreadCount > 0 && (
          <button className="btn-mark-all-read" onClick={handleMarkAllRead}>
            <CheckCheck size={16} /> Mark all as read
          </button>
        )}
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
            {loading ? (
              <div className="empty-state">
                <p>Loading notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="empty-state">
                <Bell size={32} />
                <p>No notifications found.</p>
              </div>
            ) : (
              filteredNotifications.map((item) => {
                const { icon: IconComponent, bg, color } = getIconForCategory(
                  item.category,
                  item.title
                );
                return (
                  <div
                    key={item.id}
                    className={`notification-item ${!item.isRead ? "unread" : ""}`}
                    onClick={() => handleToggleRead(item.id, item.isRead)}
                  >
                    <div
                      className="notification-icon"
                      style={{ backgroundColor: bg, color: color }}
                    >
                      <IconComponent size={20} />
                    </div>

                    <div className="notification-content">
                      <div className="notification-top">
                        <h4>{item.title}</h4>
                      </div>
                      <p>{item.message}</p>
                    </div>

                    <div className="notification-meta" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="notification-time">{item.time}</span>
                      <span
                        className={`status-dot ${!item.isRead ? "dot-unread" : "dot-read"}`}
                      ></span>
                      <button
                        title="Remove notification"
                        onClick={(e) => handleDeleteNotification(item.id, e)}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "#94a3b8",
                          padding: "4px",
                          borderRadius: "4px",
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
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
                  activeCategory === "Saved Properties" ? "active" : ""
                }`}
                onClick={() => setActiveCategory("Saved Properties")}
              >
                <div className="filter-item-left">
                  <Bookmark size={16} />
                  <span>Saved Properties</span>
                </div>
                <span className="badge-count">{savedPropsCount}</span>
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