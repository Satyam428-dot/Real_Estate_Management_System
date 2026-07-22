import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUsers,
  FaUserCheck,
  FaUser,
  FaLock,
  FaUnlock,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheck,
  FaExclamationTriangle
} from "react-icons/fa";
import "./ViewAllUsers.css";

export default function ViewAllUsers() {
  const [owners, setOwners] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  // Modal States
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const ownerResponse = await axios.get(
        "http://localhost:8080/users/role/owners",
      );
      setOwners(ownerResponse.data);

      const customerResponse = await axios.get(
        "http://localhost:8080/users/role/customers",
      );
      setCustomers(customerResponse.data);
    } catch (error) {
      console.error(error);
      showToast("Error loading users from server", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleReset = () => {
    setSearchQuery("");
    setRoleFilter("all");
    setStatusFilter("all");
    setActiveTab("all");
    showToast("Filters reset successfully", "info");
  };

  const handleToggleStatus = (user) => {
    const updatedStatus = !user.disabled;

    // In-memory update
    if (user.role === "Owner") {
      setOwners(prev => prev.map(u => u.id === user.id ? { ...u, disabled: updatedStatus } : u));
    } else {
      setCustomers(prev => prev.map(u => u.id === user.id ? { ...u, disabled: updatedStatus } : u));
    }

    showToast(
      `Account of ${user.firstName} is now ${updatedStatus ? "Disabled" : "Active"}`,
      updatedStatus ? "info" : "success"
    );
  };

  const handleDeleteUser = (user) => {
    // In-memory delete
    if (user.role === "Owner") {
      setOwners(prev => prev.filter(u => u.id !== user.id));
    } else {
      setCustomers(prev => prev.filter(u => u.id !== user.id));
    }

    setDeleteConfirmUser(null);
    showToast(`Account of ${user.firstName} ${user.lastName} deleted`, "error");
  };

  const handleUpdateUser = (updatedUser) => {
    // In-memory update
    if (updatedUser.role === "Owner") {
      setOwners(prev => prev.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u));
    } else {
      setCustomers(prev => prev.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u));
    }

    setEditUser(null);
    showToast("User profile updated successfully", "success");
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const getAvatarColor = (firstName, lastName) => {
    const colors = [
      "#3b82f6", // Blue
      "#6366f1", // Indigo
      "#8b5cf6", // Violet
      "#ec4899", // Pink
      "#f97316", // Orange
      "#14b8a6", // Teal
      "#10b981", // Emerald
      "#ef4444", // Red
    ];
    const name = `${firstName || ""}${lastName || ""}`;
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  // Process data for tables and stats
  const allUsers = [
    ...owners.map((o) => ({ ...o, role: "Owner" })),
    ...customers.map((c) => ({ ...c, role: "Customer" })),
  ];

  const disabledCount = allUsers.filter((u) => u.disabled).length;

  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.phone && user.phone.includes(searchQuery));

    const matchesRole =
      roleFilter === "all" ||
      (roleFilter === "owner" && user.role === "Owner") ||
      (roleFilter === "customer" && user.role === "Customer");

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !user.disabled) ||
      (statusFilter === "disabled" && user.disabled);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const renderUserTable = (users) => {
    if (users.length === 0) {
      return (
        <div className="empty-table-state p-5 text-center shadow-sm">
          <FaUsers className="empty-icon text-muted mb-3" />
          <h4>No Users Found</h4>
          <p className="text-muted">
            Try adjusting your filters or search query to find users.
          </p>
        </div>
      );
    }

    return (
      <div className="card table-card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table custom-users-table align-middle mb-0">
              <thead>
                <tr>
                  <th className="ps-4">User</th>
                  <th>Contact Info</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created On</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isUserDisabled = u.disabled === true;
                  const initials = getInitials(u.firstName, u.lastName);
                  const avatarColor = getAvatarColor(u.firstName, u.lastName);

                  return (
                    <tr
                      key={`${u.role}-${u.id}`}
                      className={isUserDisabled ? "user-disabled-row" : ""}
                    >
                      <td className="ps-4">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="user-avatar"
                            style={{ backgroundColor: avatarColor }}
                          >
                            {initials || "U"}
                          </div>
                          <div>
                            <div className="fw-bold user-fullname">
                              {u.firstName} {u.lastName}
                            </div>
                            <div className="text-muted user-id-sub">
                              ID: {u.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="user-email-text" title={u.email}>
                          {u.email}
                        </div>
                        <div className="text-muted user-phone-textSmall">
                          {u.phone || "N/A"}
                        </div>
                      </td>
                      <td>
                        <span className={`role-badge ${u.role.toLowerCase()}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${isUserDisabled ? "disabled" : "active"
                            }`}
                        >
                          <span className="status-dot"></span>
                          {isUserDisabled ? "Disabled" : "Active"}
                        </span>
                      </td>
                      <td>
                        <div className="user-date-text">
                          {formatDate(u.createdOn)}
                        </div>
                      </td>
                      <td className="pe-4">
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            className="btn-action-icon btn-view"
                            title="View Details"
                            onClick={() => setSelectedUser(u)}
                          >
                            <FaEye />
                          </button>
                          <button
                            className="btn-action-icon btn-edit"
                            title="Edit Profile"
                            onClick={() => setEditUser(u)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className={`btn-action-icon ${isUserDisabled ? "btn-enable" : "btn-disable"
                              }`}
                            title={
                              isUserDisabled
                                ? "Enable Account"
                                : "Disable Account"
                            }
                            onClick={() => handleToggleStatus(u)}
                          >
                            {isUserDisabled ? <FaUnlock /> : <FaLock />}
                          </button>
                          <button
                            className="btn-action-icon btn-delete"
                            title="Delete User"
                            onClick={() => setDeleteConfirmUser(u)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="users-page container-fluid px-0 pt-0">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="page-title">Users Directory</h2>
          <p className="page-subtitle">
            Manage, verify and monitor the registered system users, roles and statuses.
          </p>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="stats-row mb-4">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <FaUsers className="stat-icon" />
          </div>
          <div className="stat-content">
            <span className="stat-num">{allUsers.length}</span>
            <span className="stat-label">Total Users</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper indigo">
            <FaUserCheck className="stat-icon" />
          </div>
          <div className="stat-content">
            <span className="stat-num">{owners.length}</span>
            <span className="stat-label">Property Owners</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper teal">
            <FaUser className="stat-icon" />
          </div>
          <div className="stat-content">
            <span className="stat-num">{customers.length}</span>
            <span className="stat-label">Customers</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper red">
            <FaLock className="stat-icon" />
          </div>
          <div className="stat-content">
            <span className="stat-num">{disabledCount}</span>
            <span className="stat-label">Disabled Accounts</span>
          </div>
        </div>
      </div>

      {/* Filter Options */}
      <div className="card filter-card border-0 shadow-sm mb-4">
        <div className="card-body p-3 d-flex gap-3 flex-wrap align-items-center justify-content-between">
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search by name, email, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="d-flex gap-3 align-items-center flex-wrap">
            <select
              className="form-select filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>

            <button className="btn btn-reset border px-4" onClick={handleReset}>
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Tabs list Navigation */}
      <div className="tabs-container mb-3">
        <button
          className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("all");
            setRoleFilter("all");
          }}
        >
          All Users <span className="tab-count">{allUsers.length}</span>
        </button>
        <button
          className={`tab-btn ${activeTab === "owners" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("owners");
            setRoleFilter("owner");
          }}
        >
          Owners <span className="tab-count">{owners.length}</span>
        </button>
        <button
          className={`tab-btn ${activeTab === "customers" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("customers");
            setRoleFilter("customer");
          }}
        >
          Customers <span className="tab-count">{customers.length}</span>
        </button>
      </div>

      {loading ? (
        <div className="loading-container text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Fetching user directory...</p>
        </div>
      ) : (
        renderUserTable(filteredUsers)
      )}

      {/* View Details Modal */}
      {selectedUser && (
        <div
          className="custom-modal-backdrop"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="custom-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-custom">
              <h3 className="modal-title">User Details</h3>
              <button
                className="close-btn"
                onClick={() => setSelectedUser(null)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body-custom text-center">
              <div
                className="user-avatar-large mx-auto mb-3"
                style={{
                  backgroundColor: getAvatarColor(
                    selectedUser.firstName,
                    selectedUser.lastName,
                  ),
                }}
              >
                {getInitials(selectedUser.firstName, selectedUser.lastName)}
              </div>
              <h4 className="fw-bold mb-1">
                {selectedUser.firstName} {selectedUser.lastName}
              </h4>
              <span
                className={`role-badge large mb-3 ${selectedUser.role.toLowerCase()}`}
              >
                {selectedUser.role}
              </span>

              <div className="details-grid mt-4">
                <div className="detail-item">
                  <span className="detail-label">User ID</span>
                  <span className="detail-value">{selectedUser.id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email Address</span>
                  <span className="detail-value">{selectedUser.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone Number</span>
                  <span className="detail-value">
                    {selectedUser.phone || "N/A"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Account Status</span>
                  <span
                    className={`status-badge-inline ${selectedUser.disabled ? "disabled" : "active"
                      }`}
                  >
                    {selectedUser.disabled ? "Disabled" : "Active"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Created On</span>
                  <span className="detail-value">
                    {formatDate(selectedUser.createdOn)}
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer-custom">
              <button
                className="btn btn-secondary px-4"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editUser && (
        <div className="custom-modal-backdrop" onClick={() => setEditUser(null)}>
          <div
            className="custom-modal-content edit-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-custom">
              <h3 className="modal-title">Edit User Profile</h3>
              <button className="close-btn" onClick={() => setEditUser(null)}>
                <FaTimes />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateUser(editUser);
              }}
            >
              <div className="modal-body-custom">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">First Name</label>
                    <input
                      type="text"
                      className="form-control form-input-field"
                      required
                      value={editUser.firstName || ""}
                      onChange={(e) =>
                        setEditUser({ ...editUser, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Last Name</label>
                    <input
                      type="text"
                      className="form-control form-input-field"
                      required
                      value={editUser.lastName || ""}
                      onChange={(e) =>
                        setEditUser({ ...editUser, lastName: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control form-input-field"
                      required
                      value={editUser.email || ""}
                      onChange={(e) =>
                        setEditUser({ ...editUser, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      className="form-control form-input-field"
                      value={editUser.phone || ""}
                      onChange={(e) =>
                        setEditUser({ ...editUser, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer-custom">
                <button
                  type="button"
                  className="btn btn-light border px-4"
                  onClick={() => setEditUser(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-4 btn-save-changes"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmUser && (
        <div
          className="custom-modal-backdrop"
          onClick={() => setDeleteConfirmUser(null)}
        >
          <div
            className="custom-modal-content confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-custom border-0 pb-0">
              <button
                className="close-btn ms-auto"
                onClick={() => setDeleteConfirmUser(null)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body-custom text-center pt-0">
              <div className="delete-warning-icon mx-auto mb-3">
                <FaExclamationTriangle />
              </div>
              <h3 className="fw-bold text-danger mb-2">Delete Account</h3>
              <p className="text-muted px-3">
                Are you sure you want to permanently delete the account of{" "}
                <strong>
                  {deleteConfirmUser.firstName} {deleteConfirmUser.lastName}
                </strong>
                ? This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer-custom border-0 d-flex justify-content-center gap-3 pt-0 pb-4">
              <button
                className="btn btn-light border px-4"
                onClick={() => setDeleteConfirmUser(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger px-4"
                onClick={() => handleDeleteUser(deleteConfirmUser)}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification System */}
      {toast && (
        <div className={`custom-toast-container ${toast.type}`}>
          <span className="toast-icon">
            {toast.type === "success" && <FaCheck />}
            {toast.type === "error" && <FaTimes />}
            {toast.type === "info" && <FaExclamationTriangle />}
          </span>
          <span className="toast-msg">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
