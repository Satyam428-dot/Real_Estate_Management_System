import "../css/Navbar.css";
import home_icon from "../../assets/home_icon.avif";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm px-5">
      <div className="container-fluid">
        {/* Logo */}
        <a className="navbar-brand d-flex align-items-center" href="/">
          <img
            src={home_icon}
            alt="PropertyHQ Logo"
            width="40"
            height="40"
            className="me-2"
          />
          <span className="fw-bold logo-text">
            PROPERTY<span className="logo-hq">HQ</span>
          </span>
        </a>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse justify-content-center">
          <ul className="navbar-nav gap-3">
            <li className="nav-item">
              <a className="nav-link active text-primary fw-semibold" href="/">
                HOME
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/properties">
                PROPERTIES
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/agents">
                AGENTS
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/contact">
                CONTACT
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/blog">
                BLOG
              </a>
            </li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="d-flex gap-2">
          <button className="btn btn-primary">REGISTER</button>
          <button className="btn btn-outline-primary">SIGN IN</button>
        </div>
      </div>
    </nav>
  );
}
