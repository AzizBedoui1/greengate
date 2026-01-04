import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="navbar">
      <div className="navbar-content">
        {/* Profile Icon Button */}
        <button
          className="profile-button"
          onClick={toggleDropdown}
          aria-label="User menu"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <>
            {/* Overlay */}
            <div className="dropdown-overlay" onClick={closeDropdown} />

            {/* Dropdown Panel */}
            <div className="dropdown-menu">
              <button
                className="dropdown-item"
                onClick={() => {
                  closeDropdown();
                  // Replace with your navigation logic
                  console.log("Navigate to Profile");
                }}
              >
                My Profile
              </button>

              <button
                className="dropdown-item"
                onClick={() => {
                  closeDropdown();
                  console.log("Navigate to My Applications");
                }}
              >
                My Applications
              </button>

              <hr className="dropdown-divider" />

              <button className="dropdown-item logout-item" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;