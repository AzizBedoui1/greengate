import React from "react";
import "../styles/LoadingSpinner.css";

const LoadingSpinner = ({ message = "Loading…" }) => {
  return (
    <div className="loading-screen">
      <div>
        <div className="loading-spinner"></div>
        <div className="loading-text">{message}</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
