import "../css/AgentCard.css";

function AgentCard({ agent }) {
  const {
    name,
    role,
    location,
    rating,
    reviews,
    badge,
    badgeType,
    specializations = [],
    properties,
    experience,
    image
  } = agent || {};

  return (
    <div className="agent-card">
      <div>
        <div className="agent-card-header">
          <img src={image} alt={name} className="agent-avatar" />
          <div className="agent-info">
            <h3 className="agent-name">{name}</h3>
            <p className="agent-role">{role}</p>

            <div className="agent-location">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              <span>{location}</span>
            </div>

            <div className="agent-rating-row">
              <span className="star-icon">★</span>
              <span className="rating-num">{rating}</span>
              <span className="reviews-count">({reviews} Reviews)</span>
            </div>

            {badge && (
              <span className={`agent-badge ${badgeType}`}>
                {badge}
              </span>
            )}
          </div>
        </div>

        <div className="agent-specializations">
          <h4>Specializations</h4>
          <div className="spec-tags">
            {specializations.map((spec, i) => (
              <span key={i} className="spec-tag">{spec}</span>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="agent-stats">
          <div className="stat-item">
            <div className="stat-icon-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                <path d="M7 8h10M7 12h10M7 16h6"></path>
              </svg>
            </div>
            <div className="stat-text">
              <strong>{properties}</strong>
              <span>Properties</span>
            </div>
          </div>

          <div className="stat-divider"></div>

          <div className="stat-item">
            <div className="stat-icon-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <div className="stat-text">
              <strong>{experience ? experience.split(' ')[0] : ''}</strong>
              <span>{experience ? experience.split(' ').slice(1).join(' ') : ''}</span>
            </div>
          </div>
        </div>

        <button className="contact-agent-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>Contact Agent</span>
        </button>
      </div>
    </div>
  );
}

export default AgentCard;