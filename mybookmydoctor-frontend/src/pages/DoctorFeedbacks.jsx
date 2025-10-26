import React, { useEffect, useState } from "react";
import api from "../api/api";
import "../css/DoctorFeedbacks.css";

export default function DoctorFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    api
      .get("/feedbacks/forMe")
      .then((res) => setFeedbacks(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="feedbacks-container">
      <div className="feedbacks-card">
        <h3>My Feedbacks</h3>
        <table className="feedback-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.length > 0 ? (
              feedbacks.map((f) => (
                <tr key={f.id}>
                  <td>{f.patient?.user?.fullName || "Anonymous"}</td>
                  <td className="rating">⭐ {f.rating}</td>
                  <td>{f.comment}</td>
                  <td>
                    {f.createdAt
                      ? new Date(f.createdAt).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-feedback">
                  No feedbacks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
