import { JAVA_BACKEND_URL } from "../../utils/config";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaBuilding, FaCheckCircle, FaClock, FaTags } from "react-icons/fa";
import "./ViewReport.css";

export default function ViewReports() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const response = await axios.get(`${JAVA_BACKEND_URL}/properties`, config);
        setProperties(response.data);
      } catch (err) {
        console.error("Error fetching report analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const totalProperties = properties.length;
  const approvedProperties = properties.filter((p) => (p.verificationStatus || "PENDING") === "APPROVED").length;
  const pendingProperties = properties.filter((p) => (p.verificationStatus || "PENDING") === "PENDING").length;
  const rejectedProperties = properties.filter((p) => p.verificationStatus === "REJECTED").length;

  const rentCount = properties.filter((p) => p.listingType === "RENT").length;
  const saleCount = properties.filter((p) => p.listingType === "SALE").length;

  const flatCount = properties.filter((p) => p.propertyType === "FLAT").length;
  const houseCount = properties.filter((p) => p.propertyType === "HOUSE").length;
  const villaCount = properties.filter((p) => p.propertyType === "VILLA").length;

  const availableCount = properties.filter((p) => p.status === "AVAILABLE").length;
  const rentedCount = properties.filter((p) => p.status === "RENTED").length;
  const soldCount = properties.filter((p) => p.status === "SOLD").length;

  const getPercent = (count) => (totalProperties > 0 ? Math.round((count / totalProperties) * 100) : 0);

  return (
    <div className="view-reports-container">
      <div className="vr-header">
        <h1>Platform Analytics & Reports</h1>
        <p>Real-time statistical breakdown of listings, verification status, and market distribution</p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>Loading analytics report...</div>
      ) : (
        <>
          {/* Summary Metric Cards */}
          <div className="vr-metrics-grid">
            <div className="vr-metric-card">
              <div className="vr-metric-icon blue">
                <FaBuilding />
              </div>
              <div>
                <div className="vr-metric-val">{totalProperties}</div>
                <div className="vr-metric-lbl">Total Properties Listed</div>
              </div>
            </div>

            <div className="vr-metric-card">
              <div className="vr-metric-icon green">
                <FaCheckCircle />
              </div>
              <div>
                <div className="vr-metric-val">{approvedProperties}</div>
                <div className="vr-metric-lbl">Verified & Approved</div>
              </div>
            </div>

            <div className="vr-metric-card">
              <div className="vr-metric-icon amber">
                <FaClock />
              </div>
              <div>
                <div className="vr-metric-val">{pendingProperties}</div>
                <div className="vr-metric-lbl">Pending Admin Approval</div>
              </div>
            </div>

            <div className="vr-metric-card">
              <div className="vr-metric-icon purple">
                <FaTags />
              </div>
              <div>
                <div className="vr-metric-val">{rentCount} / {saleCount}</div>
                <div className="vr-metric-lbl">Rent vs Sale Ratio</div>
              </div>
            </div>
          </div>

          {/* Graphical Progress Bars */}
          <div className="vr-charts-grid">
            {/* Property Types */}
            <div className="vr-chart-card">
              <h3>Property Categories</h3>
              <div className="vr-bar-group">
                <div className="vr-bar-info">
                  <span>🏢 Flats & Apartments ({flatCount})</span>
                  <span>{getPercent(flatCount)}%</span>
                </div>
                <div className="vr-bar-bg">
                  <div className="vr-bar-fill blue" style={{ width: `${getPercent(flatCount)}%` }} />
                </div>
              </div>

              <div className="vr-bar-group">
                <div className="vr-bar-info">
                  <span>🏠 Houses ({houseCount})</span>
                  <span>{getPercent(houseCount)}%</span>
                </div>
                <div className="vr-bar-bg">
                  <div className="vr-bar-fill green" style={{ width: `${getPercent(houseCount)}%` }} />
                </div>
              </div>

              <div className="vr-bar-group">
                <div className="vr-bar-info">
                  <span>🏡 Villas ({villaCount})</span>
                  <span>{getPercent(villaCount)}%</span>
                </div>
                <div className="vr-bar-bg">
                  <div className="vr-bar-fill purple" style={{ width: `${getPercent(villaCount)}%` }} />
                </div>
              </div>
            </div>

            {/* Verification Status Distribution */}
            <div className="vr-chart-card">
              <h3>Verification & Listing Status</h3>
              <div className="vr-bar-group">
                <div className="vr-bar-info">
                  <span>✅ Approved & Published ({approvedProperties})</span>
                  <span>{getPercent(approvedProperties)}%</span>
                </div>
                <div className="vr-bar-bg">
                  <div className="vr-bar-fill green" style={{ width: `${getPercent(approvedProperties)}%` }} />
                </div>
              </div>

              <div className="vr-bar-group">
                <div className="vr-bar-info">
                  <span>⏳ Pending Admin Review ({pendingProperties})</span>
                  <span>{getPercent(pendingProperties)}%</span>
                </div>
                <div className="vr-bar-bg">
                  <div className="vr-bar-fill amber" style={{ width: `${getPercent(pendingProperties)}%` }} />
                </div>
              </div>

              <div className="vr-bar-group">
                <div className="vr-bar-info">
                  <span>🔑 Active Available Properties ({availableCount})</span>
                  <span>{getPercent(availableCount)}%</span>
                </div>
                <div className="vr-bar-bg">
                  <div className="vr-bar-fill blue" style={{ width: `${getPercent(availableCount)}%` }} />
                </div>
              </div>

              <div className="vr-bar-group">
                <div className="vr-bar-info">
                  <span>🤝 Rented / Sold Properties ({rentedCount + soldCount})</span>
                  <span>{getPercent(rentedCount + soldCount)}%</span>
                </div>
                <div className="vr-bar-bg">
                  <div className="vr-bar-fill purple" style={{ width: `${getPercent(rentedCount + soldCount)}%` }} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
