import React, { useEffect, useState } from "react";
import api from "../api/api";
import "../css/BookAppointment.css";

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api
      .get("/doctors")
      .then((res) => setDoctors(res.data))
      .catch(console.error);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        doctorId: Number(doctorId),
        appointmentDateTime: dateTime,
        reason,
      };
      await api.post("/appointments", payload);
      setMsg("Appointment requested — pending approval");
    } catch (err) {
      setMsg(err.response?.data || "error");
    }
  };

  return (
    <div className="book-appointment-container">
      <div className="book-appointment-card">
        <h3>Book Appointment</h3>
        {msg && <div className="alert alert-info">{msg}</div>}
        <form onSubmit={submit}>
          <div className="mb-3">
            <label>Doctor</label>
            <select
              className="form-select"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              required
            >
              <option value="">Select</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.user.fullName} — {d.specialization}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label>Appointment date & time</label>
            <input
              type="datetime-local"
              className="form-control"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Reason</label>
            <input
              className="form-control"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary">Request Appointment</button>
        </form>
      </div>
    </div>
  );
}
