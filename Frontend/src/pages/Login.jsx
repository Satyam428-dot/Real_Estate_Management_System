// import { useNavigate } from "react-router-dom";
// import React from "react";
// import buildingImage from "../assets/d1.png";
// import "./css/Login.css"
// import { Link } from "react-router-dom";

// const LoginPage = () => {
//   return (
//     <div className="login-wrapper">
//       <div className="login-container">

//         {/* Left Section */}
//         <div className="left-panel">
//   <img
//     src={buildingImage}
//     alt="Real Estate Building"
//     className="building-image"
//   />

// </div>

//         {/* Right Section */}
//         <div className="right-panel">

//           <div className="login-form-container">

//             <div className="logo-circle">
//               🏠
//             </div>

//             <h2>Hello Again!</h2>

//             <p className="subtitle">
//               Welcome back to Real Estate Management System
//             </p>

//             <form>

//               <div className="mb-3">
//                 <input
//                   type="email"
//                   className="form-control custom-input"
//                   placeholder="Email"
//                 />
//               </div>

//               <div className="mb-2">
//                 <input
//                   type="password"
//                   className="form-control custom-input"
//                   placeholder="Password"
//                 />
//               </div>

//               <div className="d-flex justify-content-between mb-4">
//                 <div>
//                   <input type="checkbox" /> Remember Me
//                 </div>

//                 <a href="/">Forgot Password?</a>
//               </div>

//               <button
//                 type="submit"
//                 className="btn login-btn w-100"
//               >
//                 Login
//               </button>

//               <button
//                 type="button"
//                 className="btn google-btn w-100 mt-3"
//               >
//                 <img
//                   src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
//                   alt=""
//                   width="20"
//                 />
//                 Sign in with Google
//               </button>

//             </form>

//             <div className="signup-text">
//               Don't have an account?
//               <Link to="/register"> Register</Link>
//             </div>

//           </div>

//         </div>

//       </div>
//     </div>
//   );
// };

// export default LoginPage;

import { useNavigate, Link } from "react-router-dom";
import React, { useState } from "react";
import buildingImage from "../assets/d1.png";
import "./css/Login.css";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      alert("❌ Invalid Email or Password");
      return;
    }

    // Store currently logged-in user
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    alert(`🎉 Welcome ${user.name}!`);

    // Role-based navigation
    if (user.role === "ADMIN") {
      navigate("/admin/dashboard");
    } else if (user.role === "OWNER") {
      navigate("/owner/dashboard");
    } else {
      navigate("/customer/dashboard");
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
