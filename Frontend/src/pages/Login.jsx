import { useNavigate, Link } from "react-router-dom";
import React, { useState } from "react";
import buildingImage from "../assets/d1.png";
import "./css/Login.css";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/login", {
        email,
        password,
      });

      const user = response.data;
      alert(`🎉 Welcome ${user.firstName}!`);

      // Store currently logged-in user
      localStorage.setItem("loggedInUser", JSON.stringify(user));

      // Role-based navigation
      if (user.userRoles === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (user.userRoles === "OWNER") {
        navigate("/owner/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
    } catch (error) {
      console.log("Error logging in");
      alert("❌ Invalid Email or Password");
    }
  };

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
            <div className="logo-circle">🏠</div>

            <h2>Hello Again!</h2>

            <p className="subtitle">
              Welcome back to Real Estate Management System
            </p>

            <form onSubmit={handleLogin}>
              {/* Email */}
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control custom-input"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-2">
                <input
                  type="password"
                  className="form-control custom-input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex justify-content-between mb-4">
                <div>
                  <input type="checkbox" /> Remember Me
                </div>

                <a href="/">Forgot Password?</a>
              </div>

              {/* Login Button */}
              <button type="submit" className="btn login-btn w-100">
                Login
              </button>

              {/* Google Login Button */}
              <button type="button" className="btn google-btn w-100 mt-3">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
                  alt="Google"
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
