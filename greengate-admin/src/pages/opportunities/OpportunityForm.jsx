// src/pages/admin/OpportunityForm.jsx
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/OpportunityForm.css";

// Reuse base URL for image display
const API_BASE_URL = axios.defaults.baseURL || "http://localhost:5000";

const OpportunityForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [status, setStatus] = useState("active");
  const [provider, setProvider] = useState("");
  const [image, setImage] = useState(null); 
  const [existingImage, setExistingImage] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  // Fetch existing opportunity on edit
  useEffect(() => {
    if (isEdit) {
      setFetchLoading(true);
      axios
        .get(`/opportunities/${id}`)
        .then((res) => {
          const opp = res.data;
          setTitle(opp.title || "");
          setDescription(opp.description || "");
          setDeadline(opp.deadline ? opp.deadline.split("T")[0] : "");
          setExternalLink(opp.externalLink || "");
          setStatus(opp.status || "active");
          setExistingImage(opp.image || "");
          setProvider(opp.provider || "");
        })
        .catch((err) => {
          console.error(err);
          alert("Failed to load opportunity");
        })
        .finally(() => setFetchLoading(false));
    }
  }, [id, isEdit]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setExistingImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("provider", provider);
    formData.append("deadline", deadline);
    formData.append("externalLink", externalLink);
    formData.append("status", status);

  if (image) {
    // New image uploaded
    formData.append("image", image);
  } else if (existingImage && isEdit) {
    // Keep existing image path (no new upload)
    formData.append("image", existingImage);
  }

    try {
      if (isEdit) {
        await axios.put(`/opportunities/admin/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("/opportunities/admin", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      navigate("/admin/opportunities");
    } catch (error) {
      console.error(error);
      alert("Failed to save opportunity");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/opportunities");
  };

    const getImageUrl = (path) => {
    if (!path) return "";
    const url= API_BASE_URL + path;
    return url;
  };

  if (fetchLoading) {
    return <div className="form-loading">Loading opportunity...</div>;
  }

  const currentImageSrc = image ? URL.createObjectURL(image) : existingImage ? getImageUrl(existingImage) : null;

  return (
    <div className="opportunity-form-container">
      <h2>{isEdit ? "Edit Opportunity" : "Create New Opportunity"}</h2>

      <form onSubmit={handleSubmit} className="opportunity-form">
        <div className="form-grid">
          <div className="form-group full-width">
            <label>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Summer Internship 2026"
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about the opportunity..."
              rows={6}
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Provider</label>
            <input
              type="text"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="e.g., Company or Organization Name"
            />
          </div>

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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* External Link */}
          <div className="form-group full-width">
            <label>External Link *</label>
            <input
              type="url"
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              placeholder="https://example.com/apply"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="form-group full-width">
            <label>Image {isEdit ? "(optional - replace current)" : ""}</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            {/* Image Preview */}
            {currentImageSrc && (
              <div className="image-preview-single">
                <div className="image-preview">
                  <img src={currentImageSrc} alt="Opportunity preview" />
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
            {loading ? "Saving..." : "Save Opportunity"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OpportunityForm;