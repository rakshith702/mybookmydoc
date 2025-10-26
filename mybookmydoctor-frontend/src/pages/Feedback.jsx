import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    if (role === "ROLE_PATIENT") {
      api
        .get("/doctors")
        .then((res) => setDoctors(res.data))
        .catch(console.error);
      api
        .get("/feedbacks/mine")
        .then((res) => setFeedbacks(res.data))
        .catch(console.error);
    } else if (role === "ROLE_DOCTOR") {
      api
        .get("/feedbacks/forMe")
        .then((res) => setFeedbacks(res.data))
        .catch(console.error);
    }
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/feedbacks", null, {
        params: { doctorId, rating, comment },
      });
      alert("Feedback submitted successfully!");
      setDoctorId("");
      setRating(5);
      setComment("");

      const endpoint =
        role === "ROLE_PATIENT" ? "/feedbacks/mine" : "/feedbacks/forMe";
      const res = await api.get(endpoint);
      setFeedbacks(res.data);
    } catch (err) {
      console.error(err);
      alert("Error submitting feedback.");
    }
  };

  return (
    <div className="container mt-4">
      <h3>
        {role === "ROLE_DOCTOR" ? "Feedback from Patients" : "Give Feedback"}
      </h3>

      {role === "ROLE_PATIENT" && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-3">
            <label className="form-label">Select Doctor</label>
            <select
              className="form-select"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              required
            >
              <option value="">-- Select Doctor --</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.user?.fullName || "Unknown Doctor"} ({d.specialization})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Rating</label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Comment</label>
            <textarea
              className="form-control"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary">
            Submit Feedback
          </button>
        </form>
      )}

      <h4 className="mt-4">Feedback List</h4>
      {feedbacks.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Patient</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((f) => (
              <tr key={f.id}>
                <td>{f.doctor?.user?.fullName || "N/A"}</td>
                <td>{f.patient?.user?.fullName || "N/A"}</td>
                <td>{f.rating}</td>
                <td>{f.comment}</td>
                <td>{new Date(f.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No feedbacks found.</p>
      )}
    </div>
  );
}
