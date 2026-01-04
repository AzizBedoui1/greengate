// src/pages/FellowshipDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/FellowshipDetailPage.css";

import fellowshipImg from "../assets/img/opportunity.png";

const API_BASE_URL = (axios.defaults.baseURL || "http://localhost:5000");

const FellowshipDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fellowship, setFellowship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applyStatus, setApplyStatus] = useState(null); 

  useEffect(() => {
    const fetchFellowship = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/fellowships/${id}`);
        setFellowship(response.data);
      } catch (error) {
        console.error("Failed to fetch fellowship:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFellowship();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const handleApply = async () => {
    if (applying) return; 

    setApplying(true);
    setApplyStatus(null);

    try {
      await axios.post(`/applications/apply/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setApplyStatus("success");
      setTimeout(() => {
        navigate("/profile/applications");
      }, 2000);
    } catch (error) {
      console.error("Application failed:", error);
      setApplyStatus("error");
    } finally {
      setApplying(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return fellowshipImg;
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_BASE_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  };

  if (loading) {
    return <LoadingSpinner message="Loading fellowship details..." />;
  }

  if (!fellowship) {
    return (
      <div className="detail-not-found">
        <h2>Fellowship not found</h2>
        <Link to="/fellowships" className="back-link">
          ← Back to Fellowships
        </Link>
      </div>
    );
  }

  return (
    <section className="fellowship-detail-container">
      <div className="fellowship-detail-hero">
        <Link to="/fellowships" className="back-link">
          ← Back to Fellowships
        </Link>
      </div>

      <div className="fellowship-detail-content">
        {/* Main Image */}
        <div className="fellowship-detail-image-wrapper">
          <img
            src={getImageUrl(fellowship.image)}
            alt={fellowship.title}
            className="fellowship-detail-image"
            onError={(e) => (e.target.src = fellowshipImg)}
          />
        </div>

        {/* Details */}
        <div className="fellowship-detail-info">
          <div className="row-item">
            <h1 className="fellowship-detail-title">{fellowship.title}</h1>
          </div>

          <div className="row-item">
            <div className="info-item">
              <div className="sub-item">
                <span className="info-label">Provider</span>
                <span className="info-value">
                  {fellowship.provider || "GreenGate"}
                </span>
              </div>

              <div className="sub-item">
                <span className="info-label">Deadline</span>
                <span className="info-value deadline">
                  {fellowship.deadline
                    ? new Date(fellowship.deadline).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "No deadline specified"}
                </span>
              </div>
            </div>
          </div>

          <div className="row-item">
            <div className="sub-item">
              <span className="info-label">Posted</span>
              <span className="info-value">
                {new Date(fellowship.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="row-item">
            <div className="sub-item">
              <span className="info-label">Description</span>
              <p className="description-text">
                {fellowship.description || "No description available."}
              </p>
            </div>
          </div>

          {/* Apply Section */}
          <div className="row-item apply-section">
            <button
              onClick={handleApply}
              disabled={applying}
              className={`apply-btn-large ${applying ? "applying" : ""} ${applyStatus ? applyStatus : ""}`}
            >
              {applying
                ? "Submitting Application..."
                : applyStatus === "success"
                ? "Applied Successfully! ✓"
                : applyStatus === "error"
                ? "Apply Failed"
                : "Apply Now"}
            </button>

            {applyStatus === "success" && (
              <p className="apply-success-note">
                Redirecting to your applications...
              </p>
            )}
            {applyStatus === "error" && (
              <p className="apply-error-note">
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FellowshipDetailPage;