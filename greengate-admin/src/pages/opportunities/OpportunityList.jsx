// src/pages/admin/OpportunityList.jsx
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { Link } from "react-router-dom";
import "../../styles/OpportunityList.css";

const ITEMS_PER_PAGE = 9;
const API_BASE_URL = (axios.defaults.baseURL || "http://localhost:5000/api");

const OpportunityList = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchOpportunities = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await axios.get("/opportunities/admin/all", {
        params: {
          page: pageNum,
          limit: ITEMS_PER_PAGE,
        },
      });
      console.log("API response:", res);
      const data = res.data;
      console.log("Fetched opportunities data:", data);

      if (data.data && data.meta) {
        setOpportunities(data.data);
        setMeta(data.meta);
      } else if (Array.isArray(data)) {
        setOpportunities(data);
        setMeta(null);
      } else {
        console.warn("Unexpected response format", data);
        setOpportunities([]);
        setMeta(null);
      }

      setCurrentPage(pageNum);
    } catch (error) {
      console.error("Failed to fetch opportunities:", error);
      alert("Failed to load opportunities");
      setOpportunities([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  };

  const deleteOpportunity = async (id) => {
    if (!window.confirm("Are you sure you want to delete this opportunity?")) return;

    try {
      await axios.delete(`/opportunities/admin/${id}`);
      fetchOpportunities(currentPage);
    } catch (error) {
      console.error("Failed to delete opportunity:", error);
      alert("Failed to delete opportunity");
    }
  };

  useEffect(() => {
    fetchOpportunities(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && (!meta || newPage <= meta.last_page)) {
      setCurrentPage(newPage);
    }
  };

  const renderPagination = () => {
    if (!meta || meta.last_page <= 1) return null;

    const pages = [];

    if (meta.current_page > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(meta.current_page - 1)}
          className="pagination-button"
        >
          ← Previous
        </button>
      );
    }

    for (let i = 1; i <= meta.last_page; i++) {
      if (
        i === 1 ||
        i === meta.last_page ||
        (i >= meta.current_page - 1 && i <= meta.current_page + 1)
      ) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`pagination-number ${meta.current_page === i ? "active" : ""}`}
          >
            {i}
          </button>
        );
      } else if (i === meta.current_page - 2 || i === meta.current_page + 2) {
        pages.push(<span key={`ellipsis-${i}`} className="pagination-ellipsis">...</span>);
      }
    }

    if (meta.current_page < meta.last_page) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(meta.current_page + 1)}
          className="pagination-button"
        >
          Next →
        </button>
      );
    }

    return <div className="pagination-controls">{pages}</div>;
  };

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  if (loading) {
    return <div className="opportunity-list-loading">Loading opportunities...</div>;
  }

  return (
    <div className="opportunity-list-container">
      <div className="opportunity-list-header">
        <h2>Opportunities Management</h2>
        <Link to="/admin/opportunities/create" className="btn-add">
          ➕ Add New Opportunity
        </Link>
      </div>

      {opportunities.length === 0 ? (
        <p className="empty-state">No opportunities found. Create your first one!</p>
      ) : (
        <>
          <div className="table-container">
            <table className="opportunity-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Image</th>
                  <th>Provider</th>
                  <th>Deadline</th>
                  <th>External Link</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map((opp) => (
                  <tr key={opp._id}>
                    <td className="title-cell">
                      <strong>{opp.title || "Untitled"}</strong>
                    </td>

                    <td className="description-preview">
                      {opp.description ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html:
                              opp.description.length > 120
                                ? opp.description.slice(0, 120) + "..."
                                : opp.description,
                          }}
                        />
                      ) : (
                        <em>No description</em>
                      )}
                    </td>

                    <td className="images-cell">
                      {opp.image ? (
                        <div className="thumbnail-container">
                          <img
                            src={getImageUrl(opp.image)}
                            alt="Opportunity"
                            className="opportunity-thumbnail single-thumbnail"
                            onError={(e) => (e.target.style.display = "none")}
                          />
                        </div>
                      ) : (
                        <span className="no-image">No image</span>
                      )}
                    </td>

                    <td className="provider-cell">{opp.provider || "-"}</td>

                    <td className="deadline-cell">
                      {opp.deadline
                        ? new Date(opp.deadline).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="link-cell">
                      {opp.externalLink ? (
                        <a
                          href={opp.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="external-link"
                        >
                          View
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          opp.status === "active"
                            ? "active"
                            : opp.status === "expired"
                            ? "expired"
                            : "draft"
                        }`}
                      >
                        {opp.status || "draft"}
                      </span>
                    </td>

                    <td>{new Date(opp.createdAt).toLocaleDateString()}</td>

                    <td className="actions-cell">
                      <Link
                        to={`/admin/opportunities/edit/${opp._id}`}
                        className="btn-edit"
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => deleteOpportunity(opp._id)}
                        className="btn-delete"
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {renderPagination()}
        </>
      )}
    </div>
  );
};

export default OpportunityList;