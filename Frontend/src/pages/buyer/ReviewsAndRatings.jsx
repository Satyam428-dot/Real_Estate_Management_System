import React, { useState } from "react";
import {
  Star,
  Building,
  DollarSign,
  Sparkles,
  PenSquare,
  CheckCircle2,
  MoreVertical,
  HelpCircle,
  Headphones,
  ArrowRight,
  Filter,
} from "lucide-react";
import "./ReviewsAndRatings.css";

const recentReviewsData = [
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
            <span className="big-rating-number">4.6</span>
            <div className="rating-stars-col">
              <div className="stars-row">{renderStars(4.5)}</div>
              <span className="sub-text">Based on 128 reviews</span>
            </div>
          </div>

          <div className="rating-progress-bars">
            <div className="progress-item">
              <span className="star-level">5 <Star size={10} fill="#f59e0b" color="#f59e0b" /></span>
              <div className="bar-bg"><div className="bar-fill" style={{ width: "61%" }}></div></div>
              <span className="count-text">78 (61%)</span>
            </div>
            <div className="progress-item">
              <span className="star-level">4 <Star size={10} fill="#f59e0b" color="#f59e0b" /></span>
              <div className="bar-bg"><div className="bar-fill" style={{ width: "25%" }}></div></div>
              <span className="count-text">32 (25%)</span>
            </div>
            <div className="progress-item">
              <span className="star-level">3 <Star size={10} fill="#f59e0b" color="#f59e0b" /></span>
              <div className="bar-bg"><div className="bar-fill" style={{ width: "8%" }}></div></div>
              <span className="count-text">10 (8%)</span>
            </div>
            <div className="progress-item">
              <span className="star-level">2 <Star size={10} fill="#f59e0b" color="#f59e0b" /></span>
              <div className="bar-bg"><div className="bar-fill" style={{ width: "4%" }}></div></div>
              <span className="count-text">5 (4%)</span>
            </div>
            <div className="progress-item">
              <span className="star-level">1 <Star size={10} fill="#f59e0b" color="#f59e0b" /></span>
              <div className="bar-bg"><div className="bar-fill" style={{ width: "2%" }}></div></div>
              <span className="count-text">3 (2%)</span>
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
                  strokeDasharray="61, 100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="circle-segment segment-4"
                  strokeDasharray="25, 100"
                  strokeDashoffset="-61"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="circle-segment segment-3"
                  strokeDasharray="8, 100"
                  strokeDashoffset="-86"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="circle-segment segment-2"
                  strokeDasharray="4, 100"
                  strokeDashoffset="-94"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="circle-segment segment-1"
                  strokeDasharray="2, 100"
                  strokeDashoffset="-98"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="donut-center-label">
                <span className="donut-total">128</span>
                <span className="donut-sub">Reviews</span>
              </div>
            </div>

            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color color-5"></span>
                <span>5 Star (61%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color color-4"></span>
                <span>4 Star (25%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color color-3"></span>
                <span>3 Star (8%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color color-2"></span>
                <span>2 Star (4%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color color-1"></span>
                <span>1 Star (2%)</span>
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
            <h2>Recent Reviews</h2>
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
            {recentReviewsData.map((item) => (
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
                      <span className="rating-num-bold">{item.rating.toFixed(1)}</span>
                    </div>

                    <span className="verified-badge">
                      <CheckCircle2 size={12} /> Verified Buyer
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
            <button className="btn-write-review">
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
            <a href="#guidelines" className="view-guidelines-link">
              View full guidelines <ArrowRight size={14} />
            </a>
          </div>

          {/* Need Help Widget */}
          <div className="widget-card help-widget">
            <h3>Need Help?</h3>
            <p>
              Facing an issue with a review? Our support team is here to help.
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