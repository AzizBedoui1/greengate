// src/pages/auth/LoginPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import "../../styles/AuthPages.css"; // Shared styles

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const response = await axios.post("/auth/login", { email, password });

    const { token } = response.data;

    login(token); 

    navigate("/"); 
  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  if (loading) return <LoadingSpinner message="Signing in..." />;

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to access your account</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@greengate.org"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="auth-btn-primary" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="auth-footer-text">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;