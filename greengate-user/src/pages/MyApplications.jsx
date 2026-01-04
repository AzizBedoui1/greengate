import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/MyApplications.css";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get("/applications/myFellowships", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        console.log("Fetched applications:", res.data);
        setApplications(res.data);
      } catch (error) {
        console.error("Failed to load applications:", error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="my-applications">
      <h1>My Applications</h1>

      {applications.length === 0 ? (
        <div className="empty-state">
          <p>You haven't applied to any opportunities yet.</p>
          <Link to="/opportunities" className="btn-primary">
            Explore Opportunities
          </Link>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map((app) => (
            <div key={app._id} className="application-card">
              <h3>{app.fellowship?.title || "Unknown Fellowship"}</h3>
              <p>Applied on: {new Date(app.appliedAt).toLocaleDateString()}</p>
              <span className={`status ${app.status}`}>
                {app.status || "Pending"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;