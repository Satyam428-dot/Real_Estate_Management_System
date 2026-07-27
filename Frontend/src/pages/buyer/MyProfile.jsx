import React from "react";
import {
  CheckCircle2,
  Camera,
  Edit2,
  Bookmark,
  Calendar,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  Smartphone,
  Laptop,
  MoreVertical,
  Headphones,
  Home,
  DollarSign,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import "./MyProfile.css";

export default function MyProfile() {
  const profileData = {
    fullName: "Abhishek Vinod Dhoran",
    email: "abhishek.dhoran@gmail.com",
    phone: "+91 98765 43210",
    dob: "15 May 2002",
    location: "Pune, Maharashtra, India",
    gender: "Male",
    occupation: "Software Developer",
    memberSince: "20 April 2024",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    stats: {
      savedProperties: 12,
      scheduledVisits: 5,
      bookings: 4,
      inquiries: 7,
    },
    preferences: {
      propertyType: "Apartment, Villa",
      budgetRange: "₹ 30 Lakh - ₹ 1.5 Cr",
      preferredLocation: "Pune, PCMC, Wakad",
      purpose: "Buy",
    },
  };

  return (
    <div className="my-profile-container">
      {/* Header */}
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your personal information and preferences.</p>
      </div>

      <div className="profile-layout">
        {/* Main Content (Left Column) */}
        <div className="profile-main-content">
          {/* Top Banner & Profile Overview Card */}
          <div className="profile-card hero-card">
            <div className="hero-banner-bg"></div>
            <div className="hero-profile-info">
              <div className="avatar-wrapper">
                <img
                  src={profileData.avatar}
                  alt={profileData.fullName}
                  className="profile-avatar"
                />
                <button className="avatar-edit-btn" aria-label="Change photo">
                  <Camera size={14} />
                </button>
              </div>

              <div className="user-text-details">
                <div className="user-name-badge">
                  <h2>{profileData.fullName}</h2>
                  <span className="verified-tag">
                    <CheckCircle2 size={13} /> Verified Buyer
                  </span>
                </div>
                <p className="user-email">{profileData.email}</p>
                <div className="user-contact-meta">
                  <span>{profileData.phone}</span>
                  <span className="dot-sep">•</span>
                  <span>{profileData.location}</span>
                </div>
              </div>

              <button className="btn-edit-profile">
                <Edit2 size={14} /> Edit Profile
              </button>
            </div>
          </div>

          {/* Activity Statistics Bar */}
          <div className="profile-stats-grid">
            <div className="stat-card">
              <div className="stat-icon-box bg-red">
                <Bookmark size={20} />
              </div>
              <div className="stat-info">
                <h3>{profileData.stats.savedProperties}</h3>
                <p>Saved Properties</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-box bg-green">
                <Calendar size={20} />
              </div>
              <div className="stat-info">
                <h3>{profileData.stats.scheduledVisits}</h3>
                <p>Scheduled Visits</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-box bg-purple">
                <BookOpen size={20} />
              </div>
              <div className="stat-info">
                <h3>{profileData.stats.bookings}</h3>
                <p>Bookings</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-box bg-orange">
                <MessageSquare size={20} />
              </div>
              <div className="stat-info">
                <h3>{profileData.stats.inquiries}</h3>
                <p>Enquiries</p>
              </div>
            </div>
          </div>

          {/* Personal Information Card */}
          <div className="profile-card details-card">
            <div className="card-header-row">
              <h3>Personal Information</h3>
              <button className="btn-small-edit">
                <Edit2 size={13} /> Edit
              </button>
            </div>

            <div className="personal-info-grid">
              <div className="info-item">
                <label>Full Name</label>
                <p>{profileData.fullName}</p>
              </div>

              <div className="info-item">
                <label>Location</label>
                <p>{profileData.location}</p>
              </div>

              <div className="info-item">
                <label>Email Address</label>
                <p>{profileData.email}</p>
              </div>

              <div className="info-item">
                <label>Gender</label>
                <p>{profileData.gender}</p>
              </div>

              <div className="info-item">
                <label>Phone Number</label>
                <p>{profileData.phone}</p>
              </div>

              <div className="info-item">
                <label>Occupation</label>
                <p>{profileData.occupation}</p>
              </div>

              <div className="info-item">
                <label>Date of Birth</label>
                <p>{profileData.dob}</p>
              </div>

              <div className="info-item">
                <label>Member Since</label>
                <p className="icon-text">
                  <Calendar size={14} /> {profileData.memberSince}
                </p>
              </div>
            </div>
          </div>

          {/* Preferences Card */}
          <div className="profile-card preferences-card">
            <div className="card-header-row">
              <h3>Preferences</h3>
              <button className="btn-small-edit">Edit Preferences</button>
            </div>

            <div className="preferences-grid">
              <div className="pref-item">
                <div className="pref-icon icon-blue">
                  <Home size={18} />
                </div>
                <div className="pref-text">
                  <label>Property Type</label>
                  <p>{profileData.preferences.propertyType}</p>
                </div>
              </div>

              <div className="pref-item">
                <div className="pref-icon icon-blue-light">
                  <DollarSign size={18} />
                </div>
                <div className="pref-text">
                  <label>Budget Range</label>
                  <p>{profileData.preferences.budgetRange}</p>
                </div>
              </div>

              <div className="pref-item">
                <div className="pref-icon icon-blue-soft">
                  <MapPin size={18} />
                </div>
                <div className="pref-text">
                  <label>Preferred Location</label>
                  <p>{profileData.preferences.preferredLocation}</p>
                </div>
              </div>

              <div className="pref-item">
                <div className="pref-icon icon-green">
                  <ShoppingBag size={18} />
                </div>
                <div className="pref-text">
                  <label>Purpose</label>
                  <p>{profileData.preferences.purpose}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets (Right Column) */}
        <div className="profile-sidebar-widgets">
          {/* Account Security Widget */}
          <div className="widget-card security-widget">
            <div className="widget-title-row">
              <div className="shield-title">
                <ShieldCheck size={20} className="text-blue" />
                <h3>Account Security</h3>
              </div>
            </div>
            <p className="widget-sub">Keep your account secure</p>

            <div className="security-rows">
              <div className="security-row">
                <div className="sec-label">
                  <span>Password</span>
                  <p className="dots-pass">••••••••</p>
                </div>
                <button className="btn-link">Change</button>
              </div>

              <div className="security-row">
                <div className="sec-label">
                  <span>Two-Factor Authentication</span>
                </div>
                <span className="status-green">Enabled</span>
              </div>
            </div>

            <button className="btn-manage-sec">Manage Security</button>
          </div>

          {/* Active Sessions Widget */}
          <div className="widget-card sessions-widget">
            <div className="widget-title-row">
              <div className="shield-title">
                <Laptop size={20} className="text-slate" />
                <h3>Active Sessions</h3>
              </div>
            </div>
            <p className="widget-sub">You are currently signed in on 1 device.</p>

            <div className="session-item">
              <div className="session-header">
                <span className="session-title">Current Session</span>
                <span className="device-tag">This Device</span>
              </div>
              <div className="session-details">
                <p>Windows • Chrome</p>
                <div className="session-loc-status">
                  <span>Pune, India</span>
                  <span className="dot-sep">•</span>
                  <span className="active-text">Active now</span>
                </div>
              </div>
              <button className="btn-icon-more">
                <MoreVertical size={16} />
              </button>
            </div>

            <button className="btn-outline-wide">View All Sessions</button>
          </div>

          {/* Need Help Widget */}
          <div className="widget-card help-widget">
            <h3>Need Help?</h3>
            <p>
              Our support team is here to help you with any queries.
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