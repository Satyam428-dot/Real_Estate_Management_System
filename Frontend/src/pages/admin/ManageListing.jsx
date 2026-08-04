import { useEffect, useState } from "react";
import axios from "axios";
import { FaBan, FaTrash, FaSearch, FaCheckCircle, FaBuilding } from "react-icons/fa";
import "./ManageListing.css";

export default function ManageListings() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.get("http://localhost:8080/properties", config);
      setProperties(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Failed to load listings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleToggleBlacklist = async (property) => {
    const newBlacklist = !property.blacklist;
    const action = newBlacklist ? "blacklist" : "remove from blacklist";
    if (!window.confirm(`Are you sure you want to ${action} this property listing?`)) return;

    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.put(
        `http://localhost:8080/properties/${property.propertyId}`,
        { blacklist: newBlacklist },
        config
      );

      setProperties((prev) =>
        prev.map((p) =>
          p.propertyId === property.propertyId ? { ...p, blacklist: newBlacklist } : p
        )
      );
    } catch (err) {
      console.error("Failed to update blacklist status:", err);
      alert("Failed to update property status.");
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm("Are you sure you want to PERMANENTLY DELETE this property listing?")) return;

    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.delete(`http://localhost:8080/properties/${propertyId}`, config);
      setProperties((prev) => prev.filter((p) => p.propertyId !== propertyId));
    } catch (err) {
      console.error("Failed to delete property:", err);
      alert("Failed to delete property.");
    }
  };

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.ownerName && p.ownerName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = typeFilter === "ALL" || p.listingType === typeFilter;
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="manage-listings-container">
      <div className="ml-header">
        <h1>Manage Property Listings</h1>
        <p>Monitor, feature, blacklist, or remove active property listings on the platform</p>
      </div>

      {/* Controls */}
      <div className="ml-controls">
        <input
          type="text"
          className="ml-search-input"
          placeholder="Search by title, city, or owner name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="ml-filter-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="ALL">All Listing Types</option>
          <option value="RENT">Rent</option>
          <option value="SALE">Sale</option>
        </select>

        <select
          className="ml-filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Property Statuses</option>
          <option value="AVAILABLE">Available</option>
          <option value="RENTED">Rented</option>
          <option value="SOLD">Sold</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>Loading listings...</div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#dc2626" }}>{error}</div>
      ) : (
        <div className="ml-table-container">
          <table className="ml-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Owner</th>
                <th>Price</th>
                <th>Location</th>
                <th>Listing Type</th>
                <th>Property Status</th>
                <th>Verification</th>
                <th>Blacklisted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
                    No listings match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProperties.map((p) => {
                  const mainImg = p.images && p.images.length > 0 ? p.images[0].imageUrl : null;
                  return (
                    <tr key={p.propertyId}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          {mainImg ? (
                            <img src={mainImg} alt={p.title} className="ml-prop-thumb" />
                          ) : (
                            <div className="ml-prop-thumb" style={{ background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <FaBuilding color="#94a3b8" />
                            </div>
                          )}
                          <div>
                            <strong>{p.title}</strong>
                            <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{p.propertyType}</div>
                          </div>
                        </div>
                      </td>
                      <td>{p.ownerName || `Owner #${p.ownerId}`}</td>
                      <td>₹{p.price ? p.price.toLocaleString("en-IN") : "0"}</td>
                      <td>{p.city}, {p.state}</td>
                      <td>{p.listingType}</td>
                      <td>
                        <span className={`ml-badge ${(p.status || "AVAILABLE").toLowerCase()}`}>
                          {p.status || "AVAILABLE"}
                        </span>
                      </td>
                      <td>
                        <span className={`ml-badge ${(p.verificationStatus || "PENDING").toLowerCase()}`}>
                          {p.verificationStatus || "PENDING"}
                        </span>
                      </td>
                      <td>
                        {p.blacklist ? (
                          <span className="ml-badge blacklisted">Yes</span>
                        ) : (
                          <span className="ml-badge active-status">No</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="ml-btn-icon ml-btn-blacklist"
                          title={p.blacklist ? "Unblacklist Property" : "Blacklist Property"}
                          onClick={() => handleToggleBlacklist(p)}
                        >
                          {p.blacklist ? <FaCheckCircle color="#16a34a" /> : <FaBan />}
                        </button>

                        <button
                          className="ml-btn-icon ml-btn-delete"
                          title="Delete Property"
                          onClick={() => handleDeleteProperty(p.propertyId)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
