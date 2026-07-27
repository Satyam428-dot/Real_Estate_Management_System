import "./ChangePassword.css";
import { useState } from "react";

export default function ChangePassword() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const token = loggedInUser?.token;

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      alert("Please fill all fields.");
      return;
    }

    if (form.newPassword.length < 8) {
      alert("Password should be at least 8 characters.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch("http://localhost:8080/users/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      alert("Password changed successfully.");

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="change-password-page">
      <div className="change-password-card">
        <h2>Change Password</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Current Password</label>

            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>New Password</label>

            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="change-btn" disabled={isSaving}>
            {isSaving ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
