import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
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
  FaClock,
  FaTimesCircle,
  FaSpinner,
} from "react-icons/fa";

import "./Profile.css";

import { getUserProfileDetails } from "../../utils/auth";

export default function Profile() {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam || "personal");

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // User Profile Form State
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // Verification Dynamic States
  const [verifDetails, setVerifDetails] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [govIdFile, setGovIdFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Load logged-in user profile details on mount
  useEffect(() => {
    const details = getUserProfileDetails();
    if (details) {
      setProfile((prev) => ({
        ...prev,
        firstName: details.firstName || prev.firstName,
        lastName: details.lastName || prev.lastName,
        email: details.email || prev.email,
        phone: details.phone || prev.phone,
      }));
    }

    const fetchFullProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        let userId = localStorage.getItem("userId");
        if (!userId && details) userId = details.userId;

        if (userId && token) {
          const res = await axios.get(`http://localhost:8080/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.data) {
            setProfile((prev) => ({
              ...prev,
              firstName: res.data.firstName || prev.firstName,
              lastName: res.data.lastName || prev.lastName,
              email: res.data.email || prev.email,
              phone: res.data.phone || prev.phone,
            }));
          }
        }
      } catch (e) {
        console.warn("Could not fetch full user profile from backend:", e);
      }
    };

    fetchFullProfile();
  }, []);

  // Fetch Owner Verification Details from Backend
  const fetchVerificationDetails = async () => {
    try {
      setFetchLoading(true);
      const token = localStorage.getItem("token");
      let userId = localStorage.getItem("userId");
      if (!userId) {
        const userObj = JSON.parse(
          localStorage.getItem("loggedInUser") ||
            localStorage.getItem("user") ||
            "{}"
        );
        userId = userObj.userId || userObj.id;
      }
      if (userId) {
        const response = await axios.get(
          `http://localhost:8080/verify/owner/${userId}/details`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        setVerifDetails(response.data);
      }
    } catch (e) {
      console.error("Error fetching verification details:", e);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchVerificationDetails();
  }, []);

  // Handle Verification Document Submission to Cloudinary & Backend
  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    if (!govIdFile || !selfieFile) {
      alert("Please select both Government ID Proof and Selfie image before submitting.");
      return;
    }

    const token = localStorage.getItem("token");
    let userId = localStorage.getItem("userId");
    if (!userId) {
      const userObj = JSON.parse(
        localStorage.getItem("loggedInUser") ||
          localStorage.getItem("user") ||
          "{}"
      );
      userId = userObj.userId || userObj.id;
    }

    if (!userId) {
      alert("User session not found. Please log in again.");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("governmentIdProof", govIdFile);
      formData.append("selfieImage", selfieFile);

      const response = await axios.post(
        `http://localhost:8080/verify/owner/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      alert("Verification documents submitted successfully! Status is set to PENDING admin review.");
      setGovIdFile(null);
      setSelfieFile(null);
      fetchVerificationDetails();
    } catch (error) {
      console.error("Failed to submit verification documents:", error);
      const errMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to submit verification documents.";
      alert(errMsg);
    } finally {
      setIsUploading(false);
    }
  };

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

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const details = getUserProfileDetails();
      const token = localStorage.getItem("token");
      let userId = localStorage.getItem("userId");
      if (!userId && details) userId = details.userId;

      const payload = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
      };

      if (userId && token) {
        await axios.put(`http://localhost:8080/users/${userId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setSavedSuccess(true);
      const savedUser = JSON.parse(
        localStorage.getItem("loggedInUser") ||
          localStorage.getItem("user") ||
          "{}"
      );
      const updated = { ...savedUser, ...profile };
      localStorage.setItem("user", JSON.stringify(updated));
      localStorage.setItem("loggedInUser", JSON.stringify(updated));
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating profile in backend:", error);
      const errMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to update profile in database.";
      alert(errMsg);
    }
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

  const currentStatus = verifDetails?.verificationStatus || "NOT_SUBMITTED";

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

          {currentStatus === "APPROVED" && (
            <div className="owner-verification-badge approved">
              <FaShieldAlt className="owner-shield-icon" />
              <span>Verified Owner</span>
            </div>
          )}
          {currentStatus === "PENDING" && (
            <div className="owner-verification-badge pending">
              <FaClock className="owner-shield-icon" />
              <span>Verification Pending</span>
            </div>
          )}
          {currentStatus === "REJECTED" && (
            <div className="owner-verification-badge rejected">
              <FaTimesCircle className="owner-shield-icon" />
              <span>Verification Rejected</span>
            </div>
          )}
          {currentStatus === "NOT_SUBMITTED" && (
            <div className="owner-verification-badge not-submitted">
              <FaShieldAlt className="owner-shield-icon" />
              <span>Unverified Account</span>
            </div>
          )}

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

              {fetchLoading ? (
                <div className="owner-verif-loading">
                  <FaSpinner className="spinner-icon" /> Loading verification status...
                </div>
              ) : (
                <>
                  {/* STATUS BANNERS */}
                  {currentStatus === "APPROVED" && (
                    <div className="owner-verif-status-box approved">
                      <div className="owner-status-indicator">
                        <FaCheckCircle className="owner-status-icon approved" />
                        <div>
                          <h4 className="owner-status-title approved">Owner Account Verified</h4>
                          <p className="owner-status-desc">
                            Your government ID and selfie photo have been reviewed and approved by the admin.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStatus === "PENDING" && (
                    <div className="owner-verif-status-box pending">
                      <div className="owner-status-indicator">
                        <FaClock className="owner-status-icon pending" />
                        <div>
                          <h4 className="owner-status-title pending">Verification Under Review</h4>
                          <p className="owner-status-desc">
                            Your verification documents have been submitted and are currently awaiting admin review.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStatus === "REJECTED" && (
                    <div className="owner-verif-status-box rejected">
                      <div className="owner-status-indicator">
                        <FaTimesCircle className="owner-status-icon rejected" />
                        <div>
                          <h4 className="owner-status-title rejected">Verification Rejected</h4>
                          <p className="owner-status-desc">
                            Your verification application was rejected by the admin. Document re-submission is disabled. Please contact support.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStatus === "NOT_SUBMITTED" && (
                    <div className="owner-verif-status-box info">
                      <div className="owner-status-indicator">
                        <FaShieldAlt className="owner-status-icon info" />
                        <div>
                          <h4 className="owner-status-title info">Verification Documents Required</h4>
                          <p className="owner-status-desc">
                            Upload your Government ID proof and a Selfie photo to verify your owner profile before listing properties.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* DISPLAY SUBMITTED DOCUMENTS (If APPROVED, PENDING, or REJECTED) */}
                  {currentStatus !== "NOT_SUBMITTED" && verifDetails && (
                    <div className="owner-doc-section-list">
                      <div className="owner-doc-item">
                        <div className="owner-doc-info">
                          <FaFileAlt className="owner-doc-icon" />
                          <div>
                            <span className="owner-doc-name">Government ID Proof</span>
                            {verifDetails.governmentIdProof && (
                              <a
                                href={verifDetails.governmentIdProof}
                                target="_blank"
                                rel="noreferrer"
                                className="owner-doc-link"
                              >
                                View ID Document
                              </a>
                            )}
                          </div>
                        </div>
                        <span className={`owner-doc-status-tag ${currentStatus.toLowerCase()}`}>
                          {currentStatus}
                        </span>
                      </div>

                      <div className="owner-doc-item">
                        <div className="owner-doc-info">
                          <FaFileAlt className="owner-doc-icon" />
                          <div>
                            <span className="owner-doc-name">Selfie Image</span>
                            {verifDetails.selfieImage && (
                              <a
                                href={verifDetails.selfieImage}
                                target="_blank"
                                rel="noreferrer"
                                className="owner-doc-link"
                              >
                                View Selfie Photo
                              </a>
                            )}
                          </div>
                        </div>
                        <span className={`owner-doc-status-tag ${currentStatus.toLowerCase()}`}>
                          {currentStatus}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* UPLOAD FORM (Only shown when NOT_SUBMITTED) */}
                  {currentStatus === "NOT_SUBMITTED" ? (
                    <form onSubmit={handleVerificationSubmit} className="owner-verif-upload-form">
                      <h4 className="owner-upload-label">Upload Required Documents</h4>

                      <div className="owner-form-row cols-2">
                        <div className="owner-form-group">
                          <label>
                            Government ID Proof (Aadhaar / PAN / DL / Passport) <span className="required-star">*</span>
                          </label>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => setGovIdFile(e.target.files[0])}
                            required
                          />
                          {govIdFile && <span className="file-name-preview">Selected: {govIdFile.name}</span>}
                        </div>

                        <div className="owner-form-group">
                          <label>
                            Selfie Image <span className="required-star">*</span>
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setSelfieFile(e.target.files[0])}
                            required
                          />
                          {selfieFile && <span className="file-name-preview">Selected: {selfieFile.name}</span>}
                        </div>
                      </div>

                      <div className="owner-form-submit-row mt-3">
                        <button type="submit" className="owner-save-btn" disabled={isUploading}>
                          <FaFileUpload /> {isUploading ? "Uploading to Cloudinary..." : "Submit Verification Documents"}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="owner-no-resubmit-card">
                      <p>
                        {currentStatus === "APPROVED" && "🔒 Document submission is closed because your account is already fully verified."}
                        {currentStatus === "PENDING" && "⏳ Document re-submission is disabled while your verification is pending admin review."}
                        {currentStatus === "REJECTED" && "❌ Document re-submission is disabled for rejected accounts. Please contact admin support."}
                      </p>
                    </div>
                  )}
                </>
              )}
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
