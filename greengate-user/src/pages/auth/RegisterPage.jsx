import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import "../../styles/AuthPages.css";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!name || !age || !phone || !email || !password) {
      setError("All fields are required");
      return;
    }
    if (isNaN(age) || age < 13 || age > 120) {
      setError("Please enter a valid age (13–120)");
      return;
    }

    setLoading(true);

    try {
      const registerResponse = await axios.post("/auth/register", {
        email,
        password,
      });

      // eslint-disable-next-line no-unused-vars
      const { token, user } = registerResponse.data; 

      await axios.post(
        "/profile",
        {
          name,
          age: Number(age),
          phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Registration failed. Email might already be in use.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Creating your account..." />;

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h1 className="auth-title">Join GreenGate</h1>
        <p className="auth-subtitle">Create your account to get started</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Age *</label>
              <input
                type="number"
                min="13"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="25"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+201234567890"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength="6"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="auth-btn-primary" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;