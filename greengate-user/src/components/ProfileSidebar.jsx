// src/components/ProfileSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/ProfileSidebar.css";

const ProfileSidebar = () => {
  return (
    <aside className="profile-sidebar">
      <div className="sidebar-header">
        <h2>My Account</h2>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/profile"
          end
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">👤</span>
          <span className="sidebar-text">Profile</span>
        </NavLink>

        <NavLink
          to="/profile/applications"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">📄</span>
          <span className="sidebar-text">My Applications</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default ProfileSidebar;