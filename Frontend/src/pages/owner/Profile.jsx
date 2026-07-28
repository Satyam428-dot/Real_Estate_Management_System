import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaShieldAlt,
  FaBuilding,
  FaSave,
  FaKey,
  FaCheckCircle,
  FaUniversity,
  FaFileUpload,
  FaFileAlt,
  FaLock,
  FaIdCard,
} from "react-icons/fa";

import "./Profile.css";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("personal");

  // User Profile Form State
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Owner",
    email: "john.owner@example.com",
    phone: "+91 98765 43210",
    address: "42, Palm Beach Road, Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    pinCode: "400050",
  });

  // Load logged-in user from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (savedUser && (savedUser.firstName || savedUser.email)) {
        setProfile((prev) => ({
          ...prev,
          firstName: savedUser.firstName || prev.firstName,
          lastName: savedUser.lastName || prev.lastName,
          email: savedUser.email || prev.email,
          phone: savedUser.phone || prev.phone,
        }));
      }
    } catch (e) {
      console.warn("Could not parse user from localStorage", e);
    }
  }, []);

  // Verification State (Matches OwnerVerification backend entity)
  const [verification] = useState({
    idType: "Aadhaar Card",
    idNumber: "XXXX-XXXX-8921",
    verificationStatus: "APPROVED",
    governmentIdProofName: "aadhaar_card_john.pdf",
    ownershipProofName: "sale_deed_bandra.pdf",
  });

  // Bank & Payout Details State
  const [bankDetails, setBankDetails] = useState({
    accountHolder: "John Owner",
    bankName: "HDFC Bank",
    branch: "Bandra West Branch",
    accountNumber: "50100234891234",
    ifscCode: "HDFC0000241",
    upiId: "johnowner@okhdfcbank",
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setBankDetails({ ...bankDetails, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    // Update local storage user
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    localStorage.setItem("user", JSON.stringify({ ...savedUser, ...profile }));
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
    alert("Password updated successfully!");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="owner-profile-container">
      {/* ===== PAGE HEADER ===== */}
      <div className="owner-profile-header">
        <div>
          <h1 className="owner-profile-title">Account & Profile</h1>
          <p className="owner-profile-subtitle">
            Manage your personal info, verification documents, payout bank account, and security
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="owner-profile-alert-success">
          <FaCheckCircle /> Profile information updated successfully!
        </div>
      )}

      <div className="owner-profile-grid">
        {/* ===== LEFT COLUMN: AVATAR CARD ===== */}
        <div className="owner-profile-card owner-avatar-card">
          <div className="owner-avatar-wrapper">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
              alt="John Owner"
              className="owner-avatar-img"
            />
          </div>

          <h2 className="owner-user-fullname">
            {profile.firstName} {profile.lastName}
          </h2>
          <span className="owner-role-pill">Property Owner</span>

          <div className="owner-verification-badge">
            <FaShieldAlt className="owner-shield-icon" />
            <span>Verified Owner</span>
          </div>

          <div className="owner-sidebar-info-list">
            <div className="owner-info-item">
              <FaEnvelope className="owner-info-icon" />
              <span>{profile.email}</span>
            </div>
            <div className="owner-info-item">
              <FaPhone className="owner-info-icon" />
              <span>{profile.phone}</span>
            </div>
            <div className="owner-info-item">
              <FaBuilding className="owner-info-icon" />
              <span>Managed Properties</span>
            </div>
          </div>
        </div>

        {/* ===== RIGHT COLUMN: TABBED SECTIONS ===== */}
        <div className="owner-forms-column">
          {/* TAB NAVIGATION BUTTONS */}
          <div className="owner-profile-tabs">
            <button
              className={`owner-tab-btn ${activeTab === "personal" ? "active" : ""}`}
              onClick={() => setActiveTab("personal")}
            >
              <FaUser /> Personal Info
            </button>
            <button
              className={`owner-tab-btn ${activeTab === "verification" ? "active" : ""}`}
              onClick={() => setActiveTab("verification")}
            >
              <FaIdCard /> Verification & IDs
            </button>
            <button
              className={`owner-tab-btn ${activeTab === "bank" ? "active" : ""}`}
              onClick={() => setActiveTab("bank")}
            >
              <FaUniversity /> Bank & Payouts
            </button>
            <button
              className={`owner-tab-btn ${activeTab === "security" ? "active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              <FaLock /> Security
            </button>
          </div>

          {/* TAB 1: PERSONAL INFORMATION */}
          {activeTab === "personal" && (
            <div className="owner-profile-card">
              <h3 className="owner-card-title">
                <FaUser className="owner-section-title-icon" /> Personal Details
              </h3>

              <form onSubmit={handleSave} className="owner-profile-form">
                <div className="owner-form-row cols-2">
                  <div className="owner-form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>

                  <div className="owner-form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                </div>

                <div className="owner-form-row cols-2">
                  <div className="owner-form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>

                  <div className="owner-form-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                </div>

                <div className="owner-form-row">
                  <div className="owner-form-group">
                    <label>Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={profile.address}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className="owner-form-row cols-3">
                  <div className="owner-form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={profile.city}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <div className="owner-form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={profile.state}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <div className="owner-form-group">
                    <label>Pin Code</label>
                    <input
                      type="text"
                      name="pinCode"
                      value={profile.pinCode}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className="owner-form-submit-row">
                  <button type="submit" className="owner-save-btn">
                    <FaSave /> Save Personal Info
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: VERIFICATION & GOVT ID PROOFS */}
          {activeTab === "verification" && (
            <div className="owner-profile-card">
              <h3 className="owner-card-title">
                <FaShieldAlt className="owner-section-title-icon" /> Identity & Property Verification
              </h3>

              <div className="owner-verif-status-box">
                <div className="owner-status-indicator">
                  <FaCheckCircle className="owner-status-icon" />
                  <div>
                    <h4 className="owner-status-title">Owner Account Verified</h4>
                    <p className="owner-status-desc">
                      Your government ID and property documents have been approved by the admin.
                    </p>
                  </div>
                </div>
              </div>

              <div className="owner-doc-section-list">
                <div className="owner-doc-item">
                  <div className="owner-doc-info">
                    <FaFileAlt className="owner-doc-icon" />
                    <div>
                      <span className="owner-doc-name">Government ID Proof (Aadhaar Card)</span>
                      <span className="owner-doc-filename">{verification.governmentIdProofName}</span>
                    </div>
                  </div>
                  <span className="owner-doc-status-tag">Verified</span>
                </div>

                <div className="owner-doc-item">
                  <div className="owner-doc-info">
                    <FaFileAlt className="owner-doc-icon" />
                    <div>
                      <span className="owner-doc-name">Property Sale Deed / Title Proof</span>
                      <span className="owner-doc-filename">{verification.ownershipProofName}</span>
                    </div>
                  </div>
                  <span className="owner-doc-status-tag">Verified</span>
                </div>
              </div>

              <div className="owner-upload-box-wrapper">
                <h4 className="owner-upload-label">Update Verification Document</h4>
                <div className="owner-upload-dropzone">
                  <FaFileUpload className="owner-dropzone-icon" />
                  <p>Click to upload or drag & drop updated document (PDF, PNG, JPG)</p>
                  <span className="owner-file-size-limit">Maximum file size: 5MB</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BANK ACCOUNT & PAYOUTS */}
          {activeTab === "bank" && (
            <div className="owner-profile-card">
              <h3 className="owner-card-title">
                <FaUniversity className="owner-section-title-icon" /> Bank Account & Rent Payout Details
              </h3>
              <p className="owner-section-intro-text">
                Monthly rent payments collected from tenants will be credited directly to this account.
              </p>

              <form onSubmit={handleSave} className="owner-profile-form">
                <div className="owner-form-row cols-2">
                  <div className="owner-form-group">
                    <label>Account Holder Name</label>
                    <input
                      type="text"
                      name="accountHolder"
                      value={bankDetails.accountHolder}
                      onChange={handleBankChange}
                      required
                    />
                  </div>

                  <div className="owner-form-group">
                    <label>Bank Name</label>
                    <input
                      type="text"
                      name="bankName"
                      value={bankDetails.bankName}
                      onChange={handleBankChange}
                      required
                    />
                  </div>
                </div>

                <div className="owner-form-row cols-2">
                  <div className="owner-form-group">
                    <label>Account Number</label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={bankDetails.accountNumber}
                      onChange={handleBankChange}
                      required
                    />
                  </div>

                  <div className="owner-form-group">
                    <label>IFSC Code</label>
                    <input
                      type="text"
                      name="ifscCode"
                      value={bankDetails.ifscCode}
                      onChange={handleBankChange}
                      required
                    />
                  </div>
                </div>

                <div className="owner-form-row cols-2">
                  <div className="owner-form-group">
                    <label>Branch Name</label>
                    <input
                      type="text"
                      name="branch"
                      value={bankDetails.branch}
                      onChange={handleBankChange}
                    />
                  </div>

                  <div className="owner-form-group">
                    <label>UPI ID (Optional)</label>
                    <input
                      type="text"
                      name="upiId"
                      value={bankDetails.upiId}
                      onChange={handleBankChange}
                    />
                  </div>
                </div>

                <div className="owner-form-submit-row">
                  <button type="submit" className="owner-save-btn">
                    <FaSave /> Save Bank Details
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: SECURITY & PASSWORD */}
          {activeTab === "security" && (
            <div className="owner-profile-card">
              <h3 className="owner-card-title">
                <FaKey className="owner-section-title-icon" /> Security & Password
              </h3>

              <form onSubmit={handleUpdatePassword} className="owner-profile-form">
                <div className="owner-form-row">
                  <div className="owner-form-group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div className="owner-form-row cols-2">
                  <div className="owner-form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div className="owner-form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div className="owner-form-submit-row">
                  <button type="submit" className="owner-save-btn owner-btn-dark">
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
