import { useNavigate } from "react-router-dom";
import React from "react";
import buildingImage from "../assets/d1.png";
import "./css/Login.css"
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="login-wrapper">
      <div className="login-container">

        {/* Left Section */}
        <div className="left-panel">
  <img
    src={buildingImage}
    alt="Real Estate Building"
    className="building-image"
  />

</div>

        {/* Right Section */}
        <div className="right-panel">

          <div className="login-form-container">

            <div className="logo-circle">
              🏠
            </div>

            <h2>Hello Again!</h2>

            <p className="subtitle">
              Welcome back to Real Estate Management System
            </p>

            <form>

              <div className="mb-3">
                <input
                  type="email"
                  className="form-control custom-input"
                  placeholder="Email"
                />
              </div>

              <div className="mb-2">
                <input
                  type="password"
                  className="form-control custom-input"
                  placeholder="Password"
                />
              </div>

              <div className="d-flex justify-content-between mb-4">
                <div>
                  <input type="checkbox" /> Remember Me
                </div>

                <a href="/">Forgot Password?</a>
              </div>

              <button
                type="submit"
                className="btn login-btn w-100"
              >
                Login
              </button>

              <button
                type="button"
                className="btn google-btn w-100 mt-3"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
                  alt=""
                  width="20"
                />
                Sign in with Google
              </button>

            </form>

            <div className="signup-text">
              Don't have an account?
              <Link to="/register"> Register</Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default LoginPage;