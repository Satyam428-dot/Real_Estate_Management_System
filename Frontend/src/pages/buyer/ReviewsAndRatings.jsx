import { JAVA_BACKEND_URL } from "../../utils/config";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Star,
  Building,
  DollarSign,
  Sparkles,
  PenSquare,
  CheckCircle2,
  MoreVertical,
  Headphones,
  ArrowRight,
  X,
} from "lucide-react";
import "./ReviewsAndRatings.css";

const seedReviewsData = [
  {
    id: 1,
    title: "Luxury 2BHK Apartment",
    location: "Baner, Pune",
    rating: 5.0,
    reviewText:
      "Excellent property with premium amenities and great location. The visit experience was smooth and the staff was very helpful.",
    reviewerName: "Priya Mehta",
    reviewerRole: "Verified Buyer",
    date: "22 May 2024",
    reviewerAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    propertyImage:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    title: "Elegant Villa",
    location: "Kothrud, Pune",
    rating: 4.0,
    reviewText:
      "Beautiful villa with spacious rooms and a lovely garden. Parking space could be better.",
    reviewerName: "Rohan Kulkarni",
    reviewerRole: "Verified Buyer",
    date: "18 May 2024",
    reviewerAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    propertyImage:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    title: "Modern 3BHK Apartment",
    location: "Hinjewadi, Pune",
    rating: 4.5,
    reviewText:
      "Great connectivity and all daily needs are near by. Overall a wonderful experience!",
    reviewerName: "Anjali Deshmukh",
    reviewerRole: "Verified Buyer",
    date: "15 May 2024",
    reviewerAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    propertyImage:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    title: "Spacious 1BHK Apartment",
    location: "Wakad, Pune",
    rating: 3.0,
    reviewText:
      "Good for singles or couples. The area is peaceful but a bit far from city center.",
    reviewerName: "Amit Patil",
    reviewerRole: "Verified Buyer",
    date: "10 May 2024",
    reviewerAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    propertyImage:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80",
  },
];

export default function ReviewsAndRatings() {
  const [propertyFilter, setPropertyFilter] = useState("All Properties");
  const [timeFilter, setTimeFilter] = useState("All Time");
  const [sortBy, setSortBy] = useState("Most Recent");

  const [reviews, setReviews] = useState([]);
  const [propertiesList, setPropertiesList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal State for Writing a Review
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [ratingScore, setRatingScore] = useState(5);
  const [locationRating, setLocationRating] = useState(4.5);
  const [valueRating, setValueRating] = useState(4.5);
  const [amenitiesRating, setAmenitiesRating] = useState(4.5);
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBackendReviews();
    fetchBackendProperties();
  }, []);

  const fetchBackendReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      // Fetch this buyer's own submitted reviews
      const endpoint = token
        ? `${JAVA_BACKEND_URL}/reviews/buyer`
        : `${JAVA_BACKEND_URL}/reviews`;
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.get(endpoint, config);
      if (res.data && res.data.length > 0) {
        const formatted = res.data.map((item) => ({
          id: item.id,
          propertyId: item.propertyId,
          title: item.propertyTitle || "Property Review",
          location: item.propertyLocation || "",
          rating: item.rating || 5.0,
          reviewText: item.reviewText || item.comment || "",
          reviewerName: item.reviewerName || "You",
          reviewerRole: item.reviewerRole || "Verified Buyer",
          date: item.date
            ? new Date(item.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
            : "Just now",
          reviewerAvatar: item.reviewerAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
          propertyImage: item.propertyImage || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
          locationRating: item.locationRating || 4.5,
          valueForMoneyRating: item.valueForMoneyRating || 4.5,
          amenitiesRating: item.amenitiesRating || 4.5,
          verifiedBuyer: item.verifiedBuyer || false,
        }));
        setReviews(formatted);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.log("Could not fetch reviews:", err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBackendProperties = async () => {
    try {
      const res = await axios.get(`${JAVA_BACKEND_URL}/properties`);
      if (res.data && res.data.length > 0) {
        setPropertiesList(res.data);
        setSelectedPropertyId(res.data[0].id);
      }
    } catch (err) {
      console.log("Could not fetch properties list for review modal:", err);
    }
  };

  const handleCreateReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPropertyId) {
      toast.warn("Please select a property to review.");
      return;
    }
    if (!reviewComment.trim()) {
      toast.warn("Please enter your review comment.");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        propertyId: parseInt(selectedPropertyId),
        rating: parseFloat(ratingScore),
        comment: reviewComment,
        locationRating: parseFloat(locationRating),
        valueForMoneyRating: parseFloat(valueRating),
        amenitiesRating: parseFloat(amenitiesRating),
      };

      await axios.post(`${JAVA_BACKEND_URL}/reviews`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Review submitted successfully!");
      setIsModalOpen(false);
      setReviewComment("");
      // Re-fetch buyer's own reviews to show the new one
      await fetchBackendReviews();
    } catch (err) {
      console.error("Failed to submit review:", err);
      toast.error(
        "Failed to submit review: " +
          (err.response?.data?.message || err.message || "Unknown error occurred.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Dynamic Rating Calculations
  const totalReviewsCount = reviews.length;
  const avgRatingScore =
    totalReviewsCount > 0
      ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / totalReviewsCount).toFixed(1)
      : "4.6";

  const star5Count = reviews.filter((r) => r.rating >= 4.8).length;
  const star4Count = reviews.filter((r) => r.rating >= 3.8 && r.rating < 4.8).length;
  const star3Count = reviews.filter((r) => r.rating >= 2.8 && r.rating < 3.8).length;
  const star2Count = reviews.filter((r) => r.rating >= 1.8 && r.rating < 2.8).length;
  const star1Count = reviews.filter((r) => r.rating < 1.8).length;

  const getPercent = (count) => (totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0);

  // Helper for rendering star icons
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <Star key={i} size={16} className="star-filled" fill="#f59e0b" color="#f59e0b" />
        );
      } else if (i - 0.5 <= rating) {
        stars.push(
          <Star key={i} size={16} className="star-half" fill="#f59e0b" color="#f59e0b" />
        );
      } else {
        stars.push(
          <Star key={i} size={16} className="star-empty" color="#cbd5e1" />
        );
      }
    }
    return stars;
  };

  return (
    <div className="reviews-page-container">
      {/* Header Bar */}
      <div className="reviews-header">
        <div>
          <h1>Reviews & Ratings</h1>
          <p>See what our users are saying about properties and their experience.</p>
        </div>

        {/* Top Dropdown Filters */}
        <div className="top-filter-dropdowns">
          <div className="filter-select-wrapper">
            <select
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
            >
              <option value="All Properties">All Properties</option>
              <option value="Apartments">Apartments</option>
              <option value="Villas">Villas</option>
            </select>
          </div>

          <div className="filter-select-wrapper">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="All Time">All Time</option>
              <option value="This Month">This Month</option>
              <option value="This Year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Top 3 Metric Cards Grid */}
      <div className="metrics-cards-grid">
        {/* Card 1: Overall Rating */}
        <div className="metric-card overall-rating-card">
          <h4>Overall Rating</h4>
          <div className="rating-score-row">
            <span className="big-rating-number">{avgRatingScore}</span>
            <div className="rating-stars-col">
              <div className="stars-row">{renderStars(parseFloat(avgRatingScore))}</div>
              <span className="sub-text">Based on {totalReviewsCount} reviews</span>
            </div>
          </div>

          <div className="rating-progress-bars">
            <div className="progress-item">
              <span className="star-level">5 <Star size={10} fill="#f59e0b" color="#f59e0b" /></span>
              <div className="bar-bg"><div className="bar-fill" style={{ width: `${getPercent(star5Count)}%` }}></div></div>
              <span className="count-text">{star5Count} ({getPercent(star5Count)}%)</span>
            </div>
            <div className="progress-item">
              <span className="star-level">4 <Star size={10} fill="#f59e0b" color="#f59e0b" /></span>
              <div className="bar-bg"><div className="bar-fill" style={{ width: `${getPercent(star4Count)}%` }}></div></div>
              <span className="count-text">{star4Count} ({getPercent(star4Count)}%)</span>
            </div>
            <div className="progress-item">
              <span className="star-level">3 <Star size={10} fill="#f59e0b" color="#f59e0b" /></span>
              <div className="bar-bg"><div className="bar-fill" style={{ width: `${getPercent(star3Count)}%` }}></div></div>
              <span className="count-text">{star3Count} ({getPercent(star3Count)}%)</span>
            </div>
            <div className="progress-item">
              <span className="star-level">2 <Star size={10} fill="#f59e0b" color="#f59e0b" /></span>
              <div className="bar-bg"><div className="bar-fill" style={{ width: `${getPercent(star2Count)}%` }}></div></div>
              <span className="count-text">{star2Count} ({getPercent(star2Count)}%)</span>
            </div>
            <div className="progress-item">
              <span className="star-level">1 <Star size={10} fill="#f59e0b" color="#f59e0b" /></span>
              <div className="bar-bg"><div className="bar-fill" style={{ width: `${getPercent(star1Count)}%` }}></div></div>
              <span className="count-text">{star1Count} ({getPercent(star1Count)}%)</span>
            </div>
          </div>
        </div>

        {/* Card 2: What users like most */}
        <div className="metric-card features-like-card">
          <h4>What users like most</h4>
          <div className="feature-items-list">
            <div className="feature-item">
              <div className="feature-icon icon-blue">
                <Building size={18} />
              </div>
              <div className="feature-info">
                <span className="feature-name">Property Location</span>
              </div>
              <span className="feature-score">4.7/5</span>
            </div>

            <div className="feature-item">
              <div className="feature-icon icon-green">
                <DollarSign size={18} />
              </div>
              <div className="feature-info">
                <span className="feature-name">Value for Money</span>
              </div>
              <span className="feature-score">4.5/5</span>
            </div>

            <div className="feature-item">
              <div className="feature-icon icon-purple">
                <Sparkles size={18} />
              </div>
              <div className="feature-info">
                <span className="feature-name">Amenities</span>
              </div>
              <span className="feature-score">4.4/5</span>
            </div>
          </div>
        </div>

        {/* Card 3: Rating Distribution Chart */}
        <div className="metric-card chart-distribution-card">
          <h4>Rating Distribution</h4>
          <div className="donut-chart-container">
            <div className="donut-graphic">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path
                  className="circle-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="circle-segment segment-5"
                  strokeDasharray={`${getPercent(star5Count)}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="donut-center-label">
                <span className="donut-total">{totalReviewsCount}</span>
                <span className="donut-sub">Reviews</span>
              </div>
            </div>

            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color color-5"></span>
                <span>5 Star ({getPercent(star5Count)}%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color color-4"></span>
                <span>4 Star ({getPercent(star4Count)}%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color color-3"></span>
                <span>3 Star ({getPercent(star3Count)}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="reviews-main-layout">
        {/* Left Column: Recent Reviews List */}
        <div className="reviews-list-section">
          <div className="reviews-list-toolbar">
            <h2>Recent Reviews ({reviews.length})</h2>
            <div className="sort-wrapper">
              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="Most Recent">Most Recent</option>
                <option value="Highest Rated">Highest Rated</option>
                <option value="Lowest Rated">Lowest Rated</option>
              </select>
            </div>
          </div>

          <div className="reviews-cards-stack">
            {reviews.map((item) => (
              <div className="review-item-card" key={item.id}>
                <div className="review-card-left">
                  <div className="property-thumb-wrapper">
                    <img src={item.propertyImage} alt={item.title} />
                  </div>
                  <div className="property-review-details">
                    <h3>{item.title}</h3>
                    <p className="property-loc">{item.location}</p>

                    <div className="rating-score-badge-row">
                      <div className="stars-inline">{renderStars(item.rating)}</div>
                      <span className="rating-num-bold">{Number(item.rating).toFixed(1)}</span>
                    </div>

                    <span className="verified-badge">
                      <CheckCircle2 size={12} /> {item.reviewerRole || "Verified Buyer"}
                    </span>
                  </div>
                </div>

                <div className="review-card-right">
                  <p className="user-review-comment">"{item.reviewText}"</p>

                  <div className="reviewer-profile-footer">
                    <div className="reviewer-user">
                      <img
                        src={item.reviewerAvatar}
                        alt={item.reviewerName}
                        className="reviewer-avatar"
                      />
                      <div className="reviewer-info">
                        <span className="reviewer-name">{item.reviewerName}</span>
                        <span className="reviewer-role">{item.reviewerRole}</span>
                      </div>
                    </div>

                    <div className="review-date-meta">
                      <span>{item.date}</span>
                      <button className="btn-more-options" aria-label="More Options">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar Widgets */}
        <div className="reviews-sidebar-widgets">
          {/* Share Experience Widget */}
          <div className="widget-card share-review-widget">
            <h3>Share your experience</h3>
            <p>Your reviews help others find the right property.</p>
            <button className="btn-write-review" onClick={() => setIsModalOpen(true)}>
              <PenSquare size={16} /> Write a Review
            </button>
          </div>

          {/* Guidelines Widget */}
          <div className="widget-card guidelines-widget">
            <h3>Review Guidelines</h3>
            <ul className="guidelines-list">
              <li>
                <CheckCircle2 size={16} className="icon-green" />
                <span>Be honest and respectful</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="icon-green" />
                <span>Focus on your own experience</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="icon-green" />
                <span>Avoid personal information</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="icon-green" />
                <span>Use proper language</span>
              </li>
            </ul>
          </div>

          {/* Need Help Widget */}
          <div className="widget-card help-widget">
            <h3>Need Help?</h3>
            <p>Facing an issue with a review? Our support team is here to help.</p>
            <button className="btn-contact-support">
              <Headphones size={16} /> Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Write a Review Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card review-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Write a Property Review</h3>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateReviewSubmit} className="review-modal-form">
              <div className="form-group">
                <label>Select Property <span className="req">*</span></label>
                {propertiesList.length > 0 ? (
                  <select
                    value={selectedPropertyId}
                    onChange={(e) => setSelectedPropertyId(e.target.value)}
                    required
                    className="modal-select"
                  >
                    {propertiesList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.city || "Pune"})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    value={selectedPropertyId || 1}
                    onChange={(e) => setSelectedPropertyId(e.target.value)}
                    placeholder="Enter Property ID (e.g. 1)"
                    required
                    className="modal-input"
                  />
                )}
              </div>

              <div className="form-group">
                <label>Overall Rating Score <span className="req">*</span></label>
                <div className="star-rating-picker">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={`star-pick-btn ${star <= ratingScore ? "selected" : ""}`}
                      onClick={() => setRatingScore(star)}
                    >
                      <Star size={24} fill={star <= ratingScore ? "#f59e0b" : "none"} color={star <= ratingScore ? "#f59e0b" : "#cbd5e1"} />
                    </button>
                  ))}
                  <span className="rating-score-label">{ratingScore}.0 / 5.0</span>
                </div>
              </div>

              <div className="form-group">
                <label>Review Comment <span className="req">*</span></label>
                <textarea
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your detailed experience regarding amenities, location, and owner interaction..."
                  required
                  className="modal-textarea"
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-modal-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-primary" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}