import React, { useEffect, useState } from "react";
import api from "../api/api";
import "../css/GiveFeedback.css";
export default function GiveFeedback() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get("/doctors")
      .then((res) => setDoctors(res.data))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/feedbacks`, null, {
        params: { doctorId: selectedDoctor, rating, comment },
      });
      setMessage("Feedback submitted successfully!");
      setSelectedDoctor("");
      setRating("");
      setComment("");
    } catch (err) {
      console.error(err);
      setMessage("Error submitting feedback.");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Give Feedback</h3>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Select Doctor</label>
          <select
            className="form-select"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            required
          >
            <option value="">-- Choose a Doctor --</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.user?.fullName || "Unknown Doctor"} ({doc.specialization})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Rating (1–5)</label>
          <input
            type="number"
            className="form-control"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="5"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Comment</label>
          <textarea
            className="form-control"
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary">
          Submit Feedback
        </button>
      </form>

      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}
