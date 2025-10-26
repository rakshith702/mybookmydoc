import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import "../css/Signup.css";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("ROLE_PATIENT");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/signup", {
        username,
        password,
        fullName,
        email,
        role,
      });
      setMsg("✅ User created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMsg(err.response?.data || "❌ Signup failed. Try again.");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h2 className="signup-title">Create Your Account</h2>
        {msg && <div className="alert-box">{msg}</div>}

        <form onSubmit={submit}>
          <div className="input-group">
            <label>Username</label>
            <input
              className="styled-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              className="styled-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Full Name</label>
            <input
              className="styled-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              className="styled-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Role</label>
            <select
              className="styled-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="ROLE_PATIENT">Patient</option>
              <option value="ROLE_DOCTOR">Doctor</option>
            </select>
          </div>

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>

        <p className="login-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login here</span>
        </p>
      </div>
    </div>
  );
}
