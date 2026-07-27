import React, { useState } from "react";
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

  // Verification State (Matches OwnerVerification backend entity)
  const [verification, setVerification] = useState({
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
    <div className="profile-page">
      {/* ===== PAGE HEADER ===== */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Account & Profile</h1>
          <p className="page-subtitle">
            Manage your personal info, verification documents, payout bank account, and security
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="alert-success">
          <FaCheckCircle /> Profile information updated successfully!
        </div>
      )}

      <div className="profile-grid">
        {/* ===== LEFT COLUMN: AVATAR CARD ===== */}
        <div className="profile-card avatar-card">
          <div className="avatar-wrapper">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
              alt="John Owner"
              className="profile-avatar-img"
            />
          </div>

          <h2 className="user-fullname">
            {profile.firstName} {profile.lastName}
          </h2>
          <span className="role-pill">Property Owner</span>

          <div className="verification-badge">
            <FaShieldAlt className="shield-icon" />
            <span>Verified Owner (ID Proof Approved)</span>
          </div>

          <div className="sidebar-info-list">
            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <span>{profile.email}</span>
            </div>
            <div className="info-item">
              <FaPhone className="info-icon" />
              <span>{profile.phone}</span>
            </div>
            <div className="info-item">
              <FaBuilding className="info-icon" />
              <span>12 Managed Properties</span>
            </div>
          </div>
        </div>

        {/* ===== RIGHT COLUMN: TABBED SECTIONS ===== */}
        <div className="profile-forms-column">
          {/* TAB NAVIGATION BUTTONS */}
          <div className="profile-tabs">
            <button
              className={`tab-btn ${activeTab === "personal" ? "active" : ""}`}
              onClick={() => setActiveTab("personal")}
            >
              <FaUser /> Personal Info
            </button>
            <button
              className={`tab-btn ${activeTab === "verification" ? "active" : ""}`}
              onClick={() => setActiveTab("verification")}
            >
              <FaIdCard /> Verification & IDs
            </button>
            <button
              className={`tab-btn ${activeTab === "bank" ? "active" : ""}`}
              onClick={() => setActiveTab("bank")}
            >
              <FaUniversity /> Bank & Payouts
            </button>
            <button
              className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              <FaLock /> Security
            </button>
          </div>

          {/* TAB 1: PERSONAL INFORMATION */}
          {activeTab === "personal" && (
            <div className="profile-card">
              <h3 className="card-title">
                <FaUser className="section-title-icon" /> Personal Details
              </h3>

              <form onSubmit={handleSave} className="profile-form">
                <div className="form-row cols-2">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>

                  <div className="form-group">
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

                <div className="form-row cols-2">
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>

                  <div className="form-group">
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

                <div className="form-row">
                  <div className="form-group">
                    <label>Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={profile.address}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className="form-row cols-3">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={profile.city}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={profile.state}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Pin Code</label>
                    <input
                      type="text"
                      name="pinCode"
                      value={profile.pinCode}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className="form-submit-row">
                  <button type="submit" className="save-btn">
                    <FaSave /> Save Personal Info
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: VERIFICATION & GOVT ID PROOFS */}
          {activeTab === "verification" && (
            <div className="profile-card">
              <h3 className="card-title">
                <FaShieldAlt className="section-title-icon" /> Identity & Property Verification
              </h3>

              <div className="verification-status-box">
                <div className="status-indicator approved">
                  <FaCheckCircle className="status-icon" />
                  <div>
                    <h4 className="status-title">Owner Account Verified</h4>
                    <p className="status-desc">
                      Your government ID and property documents have been approved by the admin.
                    </p>
                  </div>
                </div>
              </div>

              <div className="doc-section-list">
                <div className="doc-item">
                  <div className="doc-info">
                    <FaFileAlt className="doc-icon" />
                    <div>
                      <span className="doc-name">Government ID Proof (Aadhaar Card)</span>
                      <span className="doc-filename">{verification.governmentIdProofName}</span>
                    </div>
                  </div>
                  <span className="doc-status-tag">Verified</span>
                </div>

                <div className="doc-item">
                  <div className="doc-info">
                    <FaFileAlt className="doc-icon" />
                    <div>
                      <span className="doc-name">Property Sale Deed / Title Proof</span>
                      <span className="doc-filename">{verification.ownershipProofName}</span>
                    </div>
                  </div>
                  <span className="doc-status-tag">Verified</span>
                </div>
              </div>

              <div className="upload-box-wrapper">
                <h4 className="upload-label">Update Verification Document</h4>
                <div className="upload-dropzone">
                  <FaFileUpload className="dropzone-icon" />
                  <p>Click to upload or drag & drop updated document (PDF, PNG, JPG)</p>
                  <span className="file-size-limit">Maximum file size: 5MB</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BANK ACCOUNT & PAYOUTS */}
          {activeTab === "bank" && (
            <div className="profile-card">
              <h3 className="card-title">
                <FaUniversity className="section-title-icon" /> Bank Account & Rent Payout Details
              </h3>
              <p className="section-intro-text">
                Monthly rent payments collected from tenants will be credited directly to this account.
              </p>

              <form onSubmit={handleSave} className="profile-form">
                <div className="form-row cols-2">
                  <div className="form-group">
                    <label>Account Holder Name</label>
                    <input
                      type="text"
                      name="accountHolder"
                      value={bankDetails.accountHolder}
                      onChange={handleBankChange}
                      required
                    />
                  </div>

                  <div className="form-group">
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

                <div className="form-row cols-2">
                  <div className="form-group">
                    <label>Account Number</label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={bankDetails.accountNumber}
                      onChange={handleBankChange}
                      required
                    />
                  </div>

                  <div className="form-group">
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

                <div className="form-row cols-2">
                  <div className="form-group">
                    <label>Branch Name</label>
                    <input
                      type="text"
                      name="branch"
                      value={bankDetails.branch}
                      onChange={handleBankChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>UPI ID (Optional)</label>
                    <input
                      type="text"
                      name="upiId"
                      value={bankDetails.upiId}
                      onChange={handleBankChange}
                    />
                  </div>
                </div>

                <div className="form-submit-row">
                  <button type="submit" className="save-btn">
                    <FaSave /> Save Bank Details
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: SECURITY & PASSWORD */}
          {activeTab === "security" && (
            <div className="profile-card">
              <h3 className="card-title">
                <FaKey className="section-title-icon" /> Security & Password
              </h3>

              <form onSubmit={handleUpdatePassword} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
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

                <div className="form-row cols-2">
                  <div className="form-group">
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

                  <div className="form-group">
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

                <div className="form-submit-row">
                  <button type="submit" className="save-btn btn-dark">
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
