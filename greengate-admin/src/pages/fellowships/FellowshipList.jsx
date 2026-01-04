// src/pages/admin/FellowshipList.jsx
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { Link } from "react-router-dom";
import "../../styles/FellowshipList.css";

// Reuse base URL for images
const API_BASE_URL = axios.defaults.baseURL || "http://localhost:5000/api";

const FellowshipList = () => {
  const [fellowships, setFellowships] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFellowships = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/fellowships/admin/all"); 
      setFellowships(res.data);
    } catch (error) {
      console.error("Failed to fetch fellowships:", error);
      alert("Failed to load fellowships");
    } finally {
      setLoading(false);
    }
  };

  const deleteFellowship = async (id) => {
    if (!window.confirm("Are you sure you want to delete this fellowship?")) return;

    try {
      await axios.delete(`/fellowships/admin/${id}`);
      fetchFellowships();
    } catch (error) {
      console.error("Failed to delete fellowship:", error);
      alert("Failed to delete fellowship");
    }
  };

  useEffect(() => {
    fetchFellowships();
  }, []);

  // Helper for full image URL
  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  if (loading) {
    return <div className="fellowship-list-loading">Loading fellowships...</div>;
  }

  return (
    <div className="fellowship-list-container">
      <div className="fellowship-list-header">
        <h2>Fellowships Management</h2>
        <Link to="/admin/fellowships/create" className="btn-add">
          Add New Fellowship
        </Link>
      </div>

      {fellowships.length === 0 ? (
        <p className="empty-state">No fellowships found. Create your first one!</p>
      ) : (
        <div className="table-container">
          <table className="fellowship-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Image</th>
                <th>Type</th>
                <th>Location</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Applications</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fellowships.map((f) => (
                <tr key={f._id}>
                  <td className="title-cell">
                    <strong>{f.title || "Untitled"}</strong>
                  </td>

                  <td className="description-preview">
                    {f.description ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            f.description.length > 120
                              ? f.description.slice(0, 120) + "..."
                              : f.description,
                        }}
                      />
                    ) : (
                      <em>No description</em>
                    )}
                  </td>

                  {/* Image thumbnail(s) */}
                  <td className="images-cell">
                    {f.image ? (
                      <div className="thumbnail-container">
                        {Array.isArray(f.image)
                          ? f.image.slice(0, 3).map((imgPath, i) => (
                              <img
                                key={i}
                                src={getImageUrl(imgPath)}
                                alt={`Thumbnail ${i + 1}`}
                                className="fellowship-thumbnail multi-thumbnail"
                              />
                            ))
                          : (
                            <img
                              src={getImageUrl(f.image)}
                              alt="Fellowship"
                              className="fellowship-thumbnail single-thumbnail"
                            />
                          )}
                        {Array.isArray(f.image) && f.image.length > 3 && (
                          <span className="more-images">
                            +{f.image.length - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="no-image">No image</span>
                    )}
                  </td>

                  <td>{f.type || "-"}</td>

                  <td>{f.location || "-"}</td>

                  <td className="deadline-cell">
                    {f.deadline
                      ? new Date(f.deadline).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>
                    <span
                      className={`status-badge ${
                        f.status === "open"
                          ? "open"
                          : f.status === "closed"
                          ? "closed"
                          : "draft"
                      }`}
                    >
                      {f.status || "draft"}
                    </span>
                  </td>

                  <td>
                    {new Date(f.createdAt).toLocaleDateString()}
                  </td>

                  <td className="applications-cell">
                    <Link
                      to={`/admin/fellowships/${f._id}/applications`}
                      className="btn-applications"
                    >
                      View Applications
                    </Link>
                  </td>

                  <td className="actions-cell">
                    <Link
                      to={`/admin/fellowships/edit/${f._id}`}
                      className="btn-edit"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteFellowship(f._id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
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

export default FellowshipList;