import React from "react";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";
import "../styles/ProfileInfo.css";

const ProfileInfo = () => {
  const { user, profile } = useAuth();

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="profile-info">
      <div className="profile-header">
        <div className="profile-avatar-large">
          <div className="avatar-initials-large">
            {getInitials(profile?.name || user.email)}
          </div>
        </div>
        <h1>{profile?.name || "User"}</h1>
        <p className="profile-email">{user.email}</p>
      </div>

      <div className="profile-details-grid">
        <div className="detail-card">
          <span className="label">Full Name</span>
          <span className="value">{profile?.name || "Not set"}</span>
        </div>

        <div className="detail-card">
          <span className="label">Age</span>
          <span className="value">{profile?.age ? `${profile.age} years` : "Not set"}</span>
        </div>

        <div className="detail-card">
          <span className="label">Phone</span>
          <span className="value">{profile?.phone || "Not set"}</span>
        </div>

        <div className="detail-card">
          <span className="label">Member Since</span>
          <span className="value">
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })
              : "Recently"}
          </span>
        </div>
      </div>

      <div className="profile-actions">
        <Link to="/profile/edit" className="btn-primary">
          Edit Profile
        </Link>
      </div>

      {!profile && (
        <div className="alert-info">
          <p>Complete your profile to unlock more features!</p>
          <Link to="/profile/edit" className="btn-secondary">
            Complete Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;