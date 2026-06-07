import "../css/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h6>COMPANY</h6>
          <a href="/">About</a>
          <a href="/">Careers</a>
          <a href="/">Contact</a>
        </div>

        <div className="footer-section">
          <h6>RESOURCES</h6>
          <a href="/">Blog</a>
          <a href="/">FAQs</a>
          <a href="/">Support</a>
        </div>

        <div className="footer-section">
          <h6>CONNECT</h6>
          <div className="d-flex gap-3 fs-4">
            <i className="bi bi-facebook"></i>
            <i className="bi bi-twitter-x"></i>
            <i className="bi bi-linkedin"></i>
          </div>
        </div>

        <div className="footer-section">
          <div className="footer-logo">
            PROPERTY<span className="logo-hq">HQ</span>
          </div>

          <p>
            123 Real Estate Ave,
            <br />
            San Francisco, CA 94105
          </p>

          <p>📞 (123) 544-8590</p>
        </div>
      </div>
    </footer>
  );
}
