// src/pages/admin/FellowshipForm.jsx
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/FellowshipForm.css";

// Base URL for existing images
const API_BASE_URL = axios.defaults.baseURL || "http://localhost:5000";

const FellowshipForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("open");
  const [image, setImage] = useState(null); // New file
  const [existingImage, setExistingImage] = useState(""); // Current image path
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      setFetchLoading(true);
      axios
        .get(`/fellowships/${id}`)
        .then((res) => {
          const f = res.data;
          setTitle(f.title || "");
          setDescription(f.description || "");
          setType(f.type || "");
          setLocation(f.location || "");
          setDeadline(f.deadline ? f.deadline.split("T")[0] : "");
          setStatus(f.status || "open");
          setExistingImage(f.image || "");
        })
        .catch((err) => {
          console.error(err);
          alert("Failed to load fellowship");
        })
        .finally(() => setFetchLoading(false));
    }
  }, [id, isEdit]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const removeImage = () => {
    setImage(null);
    setExistingImage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("type", type);
    formData.append("location", location);
    formData.append("deadline", deadline);
    formData.append("status", status);

    if (image) {
      formData.append("image", image);
    }

    // Optional: tell backend to remove image if cleared in edit mode
    if (isEdit && !image && existingImage) {
      formData.append("removeImage", "true");
    }

    try {
      if (isEdit) {
        await axios.put(`/fellowships/admin/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("/fellowships/admin", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      navigate("/admin/fellowships");
    } catch (error) {
      console.error(error);
      alert("Failed to save fellowship");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/admin/fellowships");

  const getImageUrl = (path) => (path ? `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}` : "");

  const currentImageSrc = image ? URL.createObjectURL(image) : existingImage ? getImageUrl(existingImage) : null;

  if (fetchLoading) {
    return <div className="form-loading">Loading fellowship...</div>;
  }

  return (
    <div className="fellowship-form-container">
      <h2>{isEdit ? "Edit Fellowship" : "Create New Fellowship"}</h2>

      <form onSubmit={handleSubmit} className="fellowship-form">
        <div className="form-grid">
          {/* Title */}
          <div className="form-group full-width">
            <label>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Summer Research Fellowship 2026"
              required
            />
          </div>

          {/* Description */}
          <div className="form-group full-width">
            <label>Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the fellowship program..."
              rows={8}
              required
            />
          </div>

          {/* Type & Location */}
          <div className="form-group">
            <label>Type</label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="e.g., Paid, Remote, On-site"
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Remote, Nairobi, USA"
            />
          </div>

          {/* Deadline & Status */}
          <div className="form-group">
            <label>Deadline *</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Image */}
          <div className="form-group full-width">
            <label>Image {isEdit ? "(optional - replace current)" : ""}</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />

            {currentImageSrc && (
              <div className="image-preview-single">
                <div className="image-preview">
                  <img src={currentImageSrc} alt="Fellowship preview" />
                  <button
                    type="button"
                    className="remove-img"
                    onClick={removeImage}
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {isEdit && !currentImageSrc && (
              <p className="no-image-note">No image currently set</p>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? "Saving..." : "Save Fellowship"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FellowshipForm;