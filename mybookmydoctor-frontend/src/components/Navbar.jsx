import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { setAuthToken } from "../api/api";
import "../css/NavbarComp.css";

export default function NavbarComp() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setAuthToken(null);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold brand-gradient" to="/">
          <i className="bi bi-heart-pulse-fill me-2"></i>
          MyBookMyDoctor
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {token && (
              <>
                <li className="nav-item">
                  <Link className="nav-link cool-link" to="/appointments">
                    My Appointments
                  </Link>
                </li>

                {role === "ROLE_PATIENT" && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link cool-link" to="/book">
                        Book Appointment
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link cool-link" to="/feedback">
                        Give Feedback
                      </Link>
                    </li>
                  </>
                )}

                {role === "ROLE_DOCTOR" && (
                  <li className="nav-item">
                    <Link className="nav-link cool-link" to="/doctor-feedbacks">
                      My Feedbacks
                    </Link>
                  </li>
                )}

                {role === "ROLE_ADMIN" && (
                  <li className="nav-item">
                    <Link className="nav-link cool-link" to="/admin">
                      Admin Dashboard
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>

          <div className="d-flex align-items-center">
            {token ? (
              <>
                <span className="me-3 fw-semibold text-light username-badge">
                  👋 Hi, {username}
                </span>
                <button
                  className="btn btn-outline-light logout-btn"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-light me-2" to="/login">
                  Login
                </Link>
                <Link
                  className="btn btn-light text-primary fw-semibold"
                  to="/signup"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
