// import React, { useEffect } from "react";
// import buildingImage from "../assets/d1.png";
// import "./css/Register.css"
// import { Link } from "react-router-dom";

// const Register = () => {
//   useEffect(() => {
//     document.body.classList.add("register-active");
//     return () => {
//       document.body.classList.remove("register-active");
//     };
//   }, []);

//   return (
//     <div className="register-wrapper">
//       <div className="register-container">

//         {/* Left Form Section */}
//         <div className="form-section">

//           <div className="brand">
//             🏠 <span>RealEstate</span>
//           </div>

//           <h1>Create an Account</h1>

//           <p className="subtitle">
//             Join now to streamline your property management experience.
//           </p>

//           <form>

//             <div className="mb-3">
//               <label>Name</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Enter your name"
//               />
//             </div>

//             <div className="mb-3">
//               <label>Email</label>
//               <input
//                 type="email"
//                 className="form-control"
//                 placeholder="Enter your email"
//               />
//             </div>

//             <div className="mb-3">
//               <label>Password</label>
//               <input
//                 type="password"
//                 className="form-control"
//                 placeholder="Enter password"
//               />
//             </div>

//             <div className="mb-4">
//               <label>Confirm Password</label>
//               <input
//                 type="password"
//                 className="form-control"
//                 placeholder="Confirm password"
//               />
//             </div>

//             <button
//               type="submit"
//               className="btn register-btn w-100"
//             >
//               Register
//             </button>

//             <div className="divider">
//               <span>Or Register With</span>
//             </div>

//             <div className="social-buttons">

//             <button type="button" className="btn social-btn">
//                 <img
//                 src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
//                 alt="Google"
//                 width="20"
//                 />
//                 Google
//             </button>

//             <button type="button" className="btn social-btn">
//                 <img
//                 src="https://cdn-icons-png.flaticon.com/512/0/747.png"
//                 alt="Apple"
//                 width="20"
//                 />
//                 Apple
//             </button>

//             </div>

//             <p className="signin-text">
//             Already have an account?
//             <Link to="/"> Sign In</Link>
//             </p>
//           </form>

//         </div>

//         {/* Right Image Section */}
//         <div className="image-section">
//           <img
//             src={buildingImage}
//             alt="Real Estate"
//             className="building-image"
//           />

//           <div className="image-overlay">
//             <h2>Find Your Dream Property</h2>

//             <p>
//               Buy, Sell and Manage Properties with confidence
//               using our Real Estate Management System.
//             </p>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Register;

import React, { useEffect, useState } from "react";
import buildingImage from "../assets/d1.png";
import "./css/Register.css";
import { Link } from "react-router-dom";

const Register = () => {
  useEffect(() => {
    document.body.classList.add("register-active");

    return () => {
      document.body.classList.remove("register-active");
    };
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    // Check empty fields
    if (!name || !email || !role || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    // Password match validation
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Get existing users
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Check duplicate email
    const emailExists = existingUsers.find((user) => user.email === email);

    if (emailExists) {
      alert("Email already registered");
      return;
    }

    // Create user object
    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role,
    };

    // Save user
    existingUsers.push(newUser);

    localStorage.setItem("users", JSON.stringify(existingUsers));

    alert("🎉 User Registered Successfully!");

    // Clear form
    setName("");
    setEmail("");
    setRole("CUSTOMER");
    setPassword("");
    setConfirmPassword("");
  };

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

          <form onSubmit={handleRegister}>
            {/* Name */}
            <div className="mb-3">
              <label>Name</label>

              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label>Email</label>

              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Role */}
            <div className="mb-3">
              <label>Role</label>

              <select
                className="form-control role-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="CUSTOMER">Customer</option>

                <option value="OWNER">Property Owner</option>

                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label>Password</label>

              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label>Confirm Password</label>

              <input
                type="password"
                className="form-control"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {/* Register Button */}
            <button type="submit" className="btn register-btn w-100">
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
              <Link to="/login"> Sign In</Link>
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
              Buy, Sell and Manage Properties with confidence using our Real
              Estate Management System.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
