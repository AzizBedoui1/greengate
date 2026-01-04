import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import "../styles/AdminLayout.css";

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="admin-layout">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

      <div className={`admin-layout-main ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Navbar />
        <main className="admin-layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;