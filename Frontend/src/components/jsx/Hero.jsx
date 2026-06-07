import "../css/Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>WELCOME TO PROPERTYHQ</h1>
        <p>Find, Manage & List Your Dream Properties with Ease.</p>
        <button className="hero-btn">BROWSE PROPERTIES</button>
      </div>
    </section>
  );
}
