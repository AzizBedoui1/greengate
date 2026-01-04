import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import ProfileSidebar from "../components/ProfileSidebar";
import "../styles/ProfilePage.css";

const ProfilePage = () => {

  return (
    <div className="profile-layout-container">
      <div className="profile-layout">
        <ProfileSidebar />
        <main className="profile-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;