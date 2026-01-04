import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = ({ isCollapsed, onToggle }) => {
  const location = useLocation();

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: "🏠" },
    { to: "/admin/blogs", label: "Blogs", icon: "📝" },
    { to: "/admin/opportunities", label: "Opportunities", icon: "💼" },
    { to: "/admin/fellowships", label: "Fellowships", icon: "🎓" },
  ];

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h3 className={`sidebar-title ${isCollapsed ? "hidden" : ""}`}>
          GreenGate Admin
        </h3>

        <button
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label="Toggle sidebar"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isCollapsed ? (
              <path d="M17 8L23 12L17 16M1 12H23" />
            ) : (
              <path d="M7 8L1 12L7 16M1 12H23" />
            )}
          </svg>
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`sidebar-link ${
              location.pathname === item.to ? "active" : ""
            }`}
            title={isCollapsed ? item.label : null}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className={`sidebar-label ${isCollapsed ? "hidden" : ""}`}>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;