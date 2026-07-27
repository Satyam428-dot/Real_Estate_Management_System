import React, { useState } from "react";
import {
  FaBell,
  FaGlobe,
  FaEye,
  FaSave,
  FaCheckCircle,
  FaSlidersH,
} from "react-icons/fa";

import "./Settings.css";

export default function Settings() {

  // Settings State
  const [settings, setSettings] = useState({
    // Notifications
    emailRentPayments: true,
    smsMaintenance: true,
    emailBuyerOffers: true,
    monthlyDigest: false,

    // Regional
    currency: "INR",
    timezone: "Asia/Kolkata",
    language: "English",

    // Privacy
    showPhonePublic: true,
    allowDirectMessages: true,
    showEmailPublic: false,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="settings-page">
      {/* ===== PAGE HEADER ===== */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">
            Manage your application preferences, notifications, and privacy options
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="alert-success">
          <FaCheckCircle /> Settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="settings-form-wrapper">

        {/* ===== SECTION 1: NOTIFICATIONS ===== */}
        <div className="settings-card">
          <h3 className="card-title">
            <FaBell className="section-title-icon" /> Notification Preferences
          </h3>
          <p className="card-subtitle">Choose how and when you want to be notified</p>

          <div className="toggle-list">
            <div className="toggle-item">
              <div>
                <span className="toggle-title">Rent Payment Alerts</span>
                <span className="toggle-desc">Receive email notification when a tenant pays rent</span>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.emailRentPayments}
                  onChange={() => handleToggle("emailRentPayments")}
                />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="toggle-item">
              <div>
                <span className="toggle-title">Maintenance Request SMS</span>
                <span className="toggle-desc">Get urgent SMS alerts when a tenant submits a maintenance ticket</span>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.smsMaintenance}
                  onChange={() => handleToggle("smsMaintenance")}
                />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="toggle-item">
              <div>
                <span className="toggle-title">Buyer Offer Notifications</span>
                <span className="toggle-desc">Get notified via email when a buyer makes an offer on your sale property</span>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.emailBuyerOffers}
                  onChange={() => handleToggle("emailBuyerOffers")}
                />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="toggle-item">
              <div>
                <span className="toggle-title">Monthly Financial Digest</span>
                <span className="toggle-desc">Receive a monthly email summary report of revenue & occupancy</span>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.monthlyDigest}
                  onChange={() => handleToggle("monthlyDigest")}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>

        {/* ===== SECTION 2: REGIONAL & SYSTEM ===== */}
        <div className="settings-card">
          <h3 className="card-title">
            <FaGlobe className="section-title-icon" /> Regional & Display Preferences
          </h3>

          <div className="form-row cols-3">
            <div className="form-group">
              <label>Currency</label>
              <select name="currency" value={settings.currency} onChange={handleChange}>
                <option value="INR">₹ INR (Indian Rupee)</option>
                <option value="USD">$ USD (US Dollar)</option>
                <option value="EUR">€ EUR (Euro)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Time Zone</label>
              <select name="timezone" value={settings.timezone} onChange={handleChange}>
                <option value="Asia/Kolkata">(GMT+05:30) Asia/Kolkata (IST)</option>
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="America/New_York">(GMT-05:00) Eastern Time</option>
              </select>
            </div>

            <div className="form-group">
              <label>Language</label>
              <select name="language" value={settings.language} onChange={handleChange}>
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Marathi">Marathi (मराठी)</option>
              </select>
            </div>
          </div>
        </div>

        {/* ===== SECTION 3: PRIVACY & VISIBILITY ===== */}
        <div className="settings-card">
          <h3 className="card-title">
            <FaEye className="section-title-icon" /> Privacy & Contact Visibility
          </h3>

          <div className="toggle-list">
            <div className="toggle-item">
              <div>
                <span className="toggle-title">Display Phone Number on Listings</span>
                <span className="toggle-desc">Allow prospective buyers & tenants to see your phone number on public property pages</span>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.showPhonePublic}
                  onChange={() => handleToggle("showPhonePublic")}
                />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="toggle-item">
              <div>
                <span className="toggle-title">Tenant Direct Messaging</span>
                <span className="toggle-desc">Enable in-app direct messaging with active tenants</span>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.allowDirectMessages}
                  onChange={() => handleToggle("allowDirectMessages")}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>

        {/* ===== SUBMIT BUTTON ===== */}
        <div className="form-submit-row">
          <button type="submit" className="save-btn">
            <FaSave /> Save All Settings
          </button>
        </div>

      </form>
    </div>
  );
}
