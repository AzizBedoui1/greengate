// src/pages/OpportunitiesPage.jsx
import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import Divider from "@mui/material/Divider";
import "../styles/OpportunitiesPage.css";

import oppImg from "../assets/img/opportunity.png";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 9;

// Remove /api from base URL if your backend serves images from root
const API_BASE_URL = (axios.defaults.baseURL || "http://localhost:5000").replace("/api", "");

const OpportunitiesPage = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);


  const handleClick = (id) => async () => {
    try {
      await axios.post(`/opportunities/${id}/click`);
    } catch (error) {
      console.error("Error tracking opportunity click:", error);
    }
  };

  const fetchOpportunities = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await axios.get("/opportunities", {
        params: {
          page: pageNum,
          limit: ITEMS_PER_PAGE,
        },
      });

      const data = response.data;

      if (data.data && data.meta) {
        setOpportunities(data.data);
        setMeta(data.meta);
      } else if (Array.isArray(data)) {
        setOpportunities(data);
        setMeta(null);
      } else {
        console.warn("Unexpected API response format", data);
        setOpportunities([]);
        setMeta(null);
      }

      setCurrentPage(pageNum);
    } catch (error) {
      console.error("Failed to fetch opportunities:", error);
      setOpportunities([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities(currentPage);
  }, [currentPage]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && (!meta || newPage <= meta.last_page)) {
      setCurrentPage(newPage);
    }
  };

  const renderPagination = () => {
    if (!meta || meta.last_page <= 1) return null;

    const pages = [];

    // Previous
    if (meta.current_page > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(meta.current_page - 1)}
          className="pagination-button"
        >
          <ChevronLeft size={16} /> Previous
        </button>
      );
    }

    // Page numbers
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
        pages.push(
          <span key={`ellipsis-${i}`} className="pagination-ellipsis">
            ...
          </span>
        );
      }
    }

    // Next
    if (meta.current_page < meta.last_page) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(meta.current_page + 1)}
          className="pagination-button"
        >
          Next <ChevronRight size={16} />
        </button>
      );
    }

    return pages;
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return oppImg;
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_BASE_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  };

  if (loading) {
    return <LoadingSpinner message="Loading opportunities..." />;
  }

  return (
    <section className="opp-container">
      <div className="opp-hero">
        <Divider sx={{ mx: "5%" }} />
        <h1 className="opp-title">OPPORTUNITIES</h1>
        <Divider sx={{ mx: "5%" }} />
      </div>

      {opportunities.length === 0 ? (
        <div className="empty-state">
          <p>No opportunities available at the moment.</p>
          <p>Check back later!</p>
        </div>
      ) : (
        <>
          <div className="opp-grid">
            {opportunities.map((op) => (
              <div className="opp-card" key={op._id || op.id}>
                <div className="opp-card-header">
                  <span className="org-logo">
                    <b>U</b>
                  </span>
                  <span className="org-name">{op.provider || "GreenGate"}</span>
                  <span className="opp-time">
                    {op.createdAt
                      ? new Date(op.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Recently"}
                  </span>
                </div>

                <h3 className="opp-card-title">{op.title}</h3>

                <div className="opp-card-image-wrapper">
                  <img
                    className="opp-card-image"
                    src={getImageUrl(op.image)}
                    alt={op.title}
                    onError={(e) => (e.target.src = oppImg)}
                  />
                </div>

                <div className="opp-card-deadline">
                  <span>Deadline:</span>{" "}
                  <strong>
                    {op.deadline
                      ? new Date(op.deadline).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Open"}
                  </strong>
                </div>

                <div className="opp-card-desc">
                  {op.description
                    ? op.description.length > 75
                      ? `${op.description.slice(0, 75)}...`
                      : op.description
                    : "No description available."}
                </div>

                <a
                  href={op.externalLink || op.external_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opp-apply-btn"
                  onClick={handleClick(op._id)}
                >
                  Apply Now
                </a>
              </div>
            ))}
          </div>

          {meta && meta.last_page > 1 && (
            <div className="pagination-wrapper">{renderPagination()}</div>
          )}
        </>
      )}
    </section>
  );
};

export default OpportunitiesPage;