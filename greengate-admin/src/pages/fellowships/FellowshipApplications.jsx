// src/pages/admin/FellowshipApplications.jsx
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "../../styles/FellowshipApplications.css";

const FellowshipApplications = () => {
  const { id } = useParams(); // fellowship ID
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null); // track which app is being updated

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/applications/admin/${id}`);
        setApplications(res.data);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
        alert("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [id]);

  const updateApplicationStatus = async (appId, newStatus) => {
    const confirmMessage =
      newStatus === "accepted"
        ? "Accept this application?"
        : "Reject this application?";

    if (!window.confirm(confirmMessage)) return;

    try {
      setUpdating(appId);
      await axios.put(`/applications/admin/${appId}`, { status: newStatus });

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app._id === appId ? { ...app, status: newStatus } : app
        )
      );

      alert(`Application ${newStatus === "accepted" ? "accepted" : "rejected"} successfully!`);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update application status");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return <div className="applications-loading">Loading applications...</div>;
  }

  return (
    <div className="applications-container">
      <div className="applications-header">
        <h2>Fellowship Applications</h2>
        <Link to="/admin/fellowships" className="btn-back">
          ← Back to Fellowships
        </Link>
      </div>

      {applications.length === 0 ? (
        <p className="empty-state">No applications yet.</p>
      ) : (
        <div className="table-container">
          <table className="applications-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Motivation</th>
                <th>Applied At</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td className="name-cell">
                    <strong>{app.user.profile?.name || "Unknown User"}</strong>
                  </td>

                  <td>{app.user?.email || "-"}</td>

                  <td>{app.user.profile?.phone || "no phone number provided"}</td>

                  <td className="motivation-preview">
                    {app.motivation ? (
                      <div>
                        {app.motivation.length > 150
                          ? app.motivation.slice(0, 150) + "..."
                          : app.motivation}
                      </div>
                    ) : (
                      <em>No motivation provided</em>
                    )}
                  </td>

                  <td>
                    {new Date(app.appliedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  <td>
                    <span
                      className={`status-badge ${app.status || "pending"}`}
                    >
                      {app.status
                        ? app.status.charAt(0).toUpperCase() + app.status.slice(1)
                        : "Pending"}
                    </span>
                  </td>

                  <td className="actions-cell">
                    {app.status === "pending" ? (
                      <>
                        <button
                          onClick={() => updateApplicationStatus(app._id, "accepted")}
                          className="btn-accept"
                          disabled={updating === app._id}
                        >
                          {updating === app._id ? "..." : "Accept"}
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(app._id, "rejected")}
                          className="btn-reject"
                          disabled={updating === app._id}
                        >
                          {updating === app._id ? "..." : "Reject"}
                        </button>
                      </>
                    ) : (
                      <span className="status-final">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FellowshipApplications;