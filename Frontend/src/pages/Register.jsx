import React from "react";
import buildingImage from "../assets/d1.png";
import "./css/Register.css"
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="register-wrapper">
      <div className="register-container">

        {/* Left Form Section */}
        <div className="form-section">

          <div className="brand">
            🏠 <span>RealEstate</span>
          </div>

          <h1>Create an Account</h1>

          <p className="subtitle">
            Join now to streamline your property management experience.
          </p>

          <form>

            <div className="mb-3">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
              />
            </div>

            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
              />
            </div>

            <div className="mb-4">
              <label>Confirm Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm password"
              />
            </div>

            <button
              type="submit"
              className="btn register-btn w-100"
            >
              Register
            </button>

            <div className="divider">
              <span>Or Register With</span>
            </div>

            <div className="social-buttons">

            <button type="button" className="btn social-btn">
                <img
                src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
                alt="Google"
                width="20"
                />
                Google
            </button>

            <button type="button" className="btn social-btn">
                <img
                src="https://cdn-icons-png.flaticon.com/512/0/747.png"
                alt="Apple"
                width="20"
                />
                Apple
            </button>

            </div>

            <p className="signin-text">
            Already have an account?
            <Link to="/"> Sign In</Link>
            </p>
          </form>

        </div>

        {/* Right Image Section */}
        <div className="image-section">
          <img
            src={buildingImage}
            alt="Real Estate"
            className="building-image"
          />

          <div className="image-overlay">
            <h2>Find Your Dream Property</h2>

            <p>
              Buy, Sell and Manage Properties with confidence
              using our Real Estate Management System.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;