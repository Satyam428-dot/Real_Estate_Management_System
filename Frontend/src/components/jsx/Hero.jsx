import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Hero.css";

import hero1 from "../../assets/hero_1.jpg";
import hero2 from "../../assets/hero_2.jpg";
import hero3 from "../../assets/hero_3.jpg";
import hero4 from "../../assets/hero_4.jpg";

const heroImages = [hero1, hero2, hero3, hero4];

export default function Hero() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="hero">
      {/* Background Slides */}
      <div className="hero-slides">
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? "active" : ""}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
      </div>

      <div className="hero-overlay"></div>

      <div className="hero-content">
        <h1>WELCOME TO PROPERTYHQ</h1>
        <p>Find, Manage & List Your Dream Properties with Ease.</p>
        <button className="hero-btn" onClick={() => navigate("/properties")}>BROWSE PROPERTIES</button>
      </div>

      {/* Navigation Arrows */}
      <button className="hero-arrow hero-arrow-left" onClick={prevSlide} aria-label="Previous Slide">
        &#10094;
      </button>
      <button className="hero-arrow hero-arrow-right" onClick={nextSlide} aria-label="Next Slide">
        &#10095;
      </button>

      {/* Slide Indicators */}
      <div className="hero-dots">
        {heroImages.map((_, index) => (
          <span
            key={index}
            className={`hero-dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </section>
  );
}

