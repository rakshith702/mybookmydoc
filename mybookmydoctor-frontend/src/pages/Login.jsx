import React, { useState } from "react";
import api, { setAuthToken } from "../api/api";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { username, password });
      const { token, username: user, role } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("username", user);
      localStorage.setItem("role", role);
      setAuthToken(token);
      navigate("/appointments");
    } catch (error) {
      setErr(error.response?.data || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Welcome Back 👋</h2>
        <p className="login-subtitle">Sign in to continue</p>

        {err && <div className="alert alert-danger">{err}</div>}

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Username</label>
            <input
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
