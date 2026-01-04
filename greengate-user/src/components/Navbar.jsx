import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import logo from "../assets/img/Asset 11.png";
import "../styles/Navbar.css";

import { useAuth } from "../auth/AuthContext";

const Navbar = () => {
  const { t } = useTranslation("navbar");
  const { user,profile,isAuthenticated, logout } = useAuth(); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-menu")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/" className="logo-link">
            <img
              src={logo}
              alt="Green Gate 4 MENA Youth"
              className="navbar-logo-img"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="navbar-menu">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `navbar-link ${isActive ? "active" : ""}`
            }
          >
            {t("home")}
          </NavLink>

          <NavLink
            to="/opportunities"
            className={({ isActive }) =>
              `navbar-link ${isActive ? "active" : ""}`
            }
          >
            {t("opportunities")}
          </NavLink>

          <NavLink
            to="/fellowships"
            className={({ isActive }) =>
              `navbar-link ${isActive ? "active" : ""}`
            }
          >
            {t("Fellowships")}
          </NavLink>

          <NavLink
            to="/blog"
            className={({ isActive }) =>
              `navbar-link ${isActive ? "active" : ""}`
            }
          >
            {t("blog")}
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `navbar-link ${isActive ? "active" : ""}`
            }
          >
            {t("about")}
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `navbar-button ${isActive ? "active" : ""}`
            }
          >
            {t("contact")}
          </NavLink>

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Always Visible Profile Icon */}
          <div className="user-menu">
            <button
              className="profile-button"
              onClick={toggleDropdown}
              aria-label="User menu"
              aria-expanded={isDropdownOpen}
            >
              <svg
                width="24"
                height="24"
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

            {/* Profile Dropdown Menu */}
            {isDropdownOpen && (
              <>
                <div
                  className="dropdown-overlay"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="user-dropdown">
                  {isAuthenticated ? (
                    <>
                      <div className="dropdown-header">
                        <span className="user-name">
                          {profile.name}
                        </span>
                      </div>
                      <hr className="dropdown-divider" />
                      <Link
                        to="/profile"
                        className="dropdown-item"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {t("myProfile")}
                      </Link>
                      <button
                        className="dropdown-item logout"
                        onClick={handleLogout}
                      >
                        {t("logout")}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="dropdown-header guest">
                        <span className="user-name">{t("guest")}</span>
                      </div>
                      <hr className="dropdown-divider" />
                      <Link
                        to="/login"
                        className="dropdown-item"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {t("login")}
                      </Link>
                      <Link
                        to="/register"
                        className="dropdown-item"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {t("register")}
                      </Link>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;