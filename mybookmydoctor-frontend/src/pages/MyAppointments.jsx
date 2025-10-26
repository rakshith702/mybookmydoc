import React, { useEffect, useState } from "react";
import api from "../api/api";
import "../css/MyAppointments.css";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const role = localStorage.getItem("role");

  useEffect(() => {
    api
      .get("/appointments")
      .then((res) => setAppointments(res.data))
      .catch(console.error);
  }, []);

  const approve = async (id) => {
    try {
      await api.put(`/appointments/${id}/approve`);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "APPROVED" } : a))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const cancel = async (id) => {
    try {
      await api.put(`/appointments/${id}/cancel`);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "CANCELLED" } : a))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return <span className="status-badge approved">Approved</span>;
      case "CANCELLED":
        return <span className="status-badge cancelled">Cancelled</span>;
      case "PENDING":
      default:
        return <span className="status-badge pending">Pending</span>;
    }
  };

  return (
    <div className="appointments-container">
      <h2 className="appointments-title">📅 My Appointments</h2>
      {appointments.length > 0 ? (
        <div className="table-wrapper">
          <table className="styled-table">
            <thead>
              <tr>
                {role === "ROLE_DOCTOR" ? <th>Patient</th> : <th>Doctor</th>}
                <th>Date & Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  {role === "ROLE_DOCTOR" ? (
                    <td>{a.patient?.user?.fullName || "Unknown Patient"}</td>
                  ) : (
                    <td>{a.doctor?.user?.fullName || "Unknown Doctor"}</td>
                  )}
                  <td>
                    {a.appointmentDateTime
                      ? new Date(a.appointmentDateTime).toLocaleString()
                      : "N/A"}
                  </td>
                  <td>{a.reason || "No reason provided"}</td>
                  <td>{getStatusBadge(a.status)}</td>
                  <td>
                    {a.status === "PENDING" && (
                      <>
                        {role === "ROLE_PATIENT" && (
                          <button
                            className="btn-action cancel"
                            onClick={() => cancel(a.id)}
                          >
                            Cancel
                          </button>
                        )}
                        {role === "ROLE_DOCTOR" && (
                          <>
                            <button
                              className="btn-action approve"
                              onClick={() => approve(a.id)}
                            >
                              Approve
                            </button>
                            <button
                              className="btn-action cancel"
                              onClick={() => cancel(a.id)}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="No appointments"
          />
          <p>No appointments found.</p>
        </div>
      )}
    </div>
  );
}
