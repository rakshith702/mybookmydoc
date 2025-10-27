import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";
import NavbarComp from "./components/Navbar";
import { setAuthToken } from "./api/api";
import AdminDashboard from "./pages/AdminDashboard";

import GiveFeedback from "./pages/GiveFeedback";
import DoctorFeedbacks from "./pages/DoctorFeedbacks";

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthToken(token);
  }, []);

  return (
    <BrowserRouter>
      <NavbarComp />
      <div className="container mt-4">
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/" element={<Navigate to="/appointments" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/book" element={<BookAppointment />} />
          <Route path="/appointments" element={<MyAppointments />} />

          {/* New Feedback Routes */}
          <Route path="/feedback" element={<GiveFeedback />} />
          <Route path="/doctor-feedbacks" element={<DoctorFeedbacks />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
