// src/pages/auth/Login.jsx
import { useState } from "react";
import axios from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/auth/login", { email, password });
      login(res.data.token);
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Login failed. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">GreenGate Admin</h1>
          <p className="login-subtitle">Sign in to manage your content</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <footer className="login-footer">
            <small>© 2025 GreenGate. All rights reserved.</small>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;