import React, { useEffect, useState } from "react";
import api from "../api/api";
import "../css/Feedback.css";
export default function FeedbackPage() {
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get("/doctors")
      .then((res) => setDoctors(res.data))
      .catch(console.error);
  }, []);

  const submitFeedback = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/feedbacks", null, {
        params: { doctorId, rating, comment },
      });
      setMessage("✅ Feedback submitted successfully!");
      setComment("");
      setRating(5);
      setDoctorId("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to submit feedback");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Give Feedback</h3>
      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={submitFeedback} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Select Doctor</label>
          <select
            className="form-select"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            required
          >
            <option value="">-- Choose a Doctor --</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.user?.fullName} ({d.specialization})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Rating (1–5)</label>
          <input
            type="number"
            min="1"
            max="5"
            className="form-control"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
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
    </div>
  );
}
