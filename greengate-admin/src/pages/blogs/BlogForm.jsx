import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/BlogForm.css";

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const API_BASE_URL = axios.defaults.baseURL || "http://localhost:5000/api"; 


  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("draft");
  const [featured, setFeatured] = useState(false);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]); 
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  // Fetch blog on edit
  useEffect(() => {
    if (isEdit) {
      setFetchLoading(true);
      axios
        .get(`/blogs/${id}`)
        .then((res) => {
          const blog = res.data;
          setTitle(blog.title || "");
          setContent(blog.content || "");
          setCategory(blog.category || "");
          setTags(blog.tags || []);
          setAuthor(blog.author?.name || blog.author || "");
          setStatus(blog.status || "draft");
          setFeatured(blog.featured || false);
          setExistingImages(blog.images || []);
        })
        .catch((err) => {
          console.error(err);
          alert("Failed to load blog");
        })
        .finally(() => setFetchLoading(false));
    }
  }, [id, isEdit]);

  const handleAddTag = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const MAX_IMAGES = 5;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = MAX_IMAGES - images.length;

    if (files.length > remainingSlots) {
      alert(`You can only upload up to ${MAX_IMAGES} images total.`);
      setImages((prev) => [...prev, ...files.slice(0, remainingSlots)]);
    } else {
      setImages((prev) => [...prev, ...files]);
    }
  };

    const getImageUrl = (path) => {
    if (!path) return "";
    const url= API_BASE_URL + path;
    return url;
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("author", author);
    formData.append("status", status);
    formData.append("featured", featured);

    tags.forEach((tag) => formData.append("tags", tag));

    // Append new images
    images.forEach((img) => formData.append("images", img));

    // For edit: send existing images to keep (if your backend supports it)
    if (isEdit) {
      existingImages.forEach((url) => formData.append("existingImages", url));
    }

    try {
      if (isEdit) {
        await axios.put(`/blogs/admin/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("/blogs/admin", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      navigate("/admin/blogs");
    } catch (error) {
      console.error(error);
      alert("Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/blogs");
  };

  if (fetchLoading) {
    return <div className="form-loading">Loading blog...</div>;
  }

  return (
    <div className="blog-form-container">
      <h2>{isEdit ? "Edit Blog" : "Create New Blog"}</h2>

      <form onSubmit={handleSubmit} className="blog-form">
        <div className="form-grid">
          {/* Title */}
          <div className="form-group full-width">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              required
            />
          </div>

          {/* Content */}
          <div className="form-group full-width">
            <label>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog content..."
              rows={10}
              required
            />
          </div>

          {/* Category & Author */}
          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Technology"
            />
          </div>

          <div className="form-group">
            <label>Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author name"
            />
          </div>

          {/* Tags */}
          <div className="form-group full-width">
            <label>Tags (press Enter or comma to add)</label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tags..."
            />
            <div className="tags-preview">
              {tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Status & Featured */}
          <div className="form-group">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
              />
              <span>Mark as Featured</span>
            </label>
          </div>

          {/* Images */}
          <div className="form-group full-width">
            <label>New Images (max 5)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              disabled={images.length >= MAX_IMAGES}
            />

            {/* Image counter */}
            <p className="image-counter">
              {images.length} / {MAX_IMAGES} images selected
            </p>

            {/* Preview new images */}
            {images.length > 0 && (
              <div className="image-preview-grid">
                {images.map((file, i) => (
                  <div key={i} className="image-preview">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${i + 1}`}
                    />
                    <button
                      type="button"
                      className="remove-img"
                      onClick={() => removeNewImage(i)}
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Show existing images (edit mode) */}
            {isEdit && existingImages.length > 0 && (
              <>
                <label className="existing-images-label">
                  Current Images (will be kept)
                </label>
                <div className="image-preview-grid">
                  {existingImages.map((url, i) => (
                    <div key={`existing-${i}`} className="image-preview">
                      <img src={getImageUrl(url)} alt={`Current ${i + 1}`} />
                      <button
                        type="button"
                        className="remove-img"
                        onClick={() => removeExistingImage(i)}
                        aria-label="Remove existing image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Info note */}
            <small className="image-note">
              You can upload up to 5 new images. Existing images will be
              preserved unless removed.
            </small>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? "Saving..." : "Save Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
