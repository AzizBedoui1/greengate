// src/pages/admin/BlogsList.jsx
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { Link } from "react-router-dom";
import "../../styles/BlogList.css";

const API_BASE_URL = axios.defaults.baseURL || "http://localhost:5000/api"; 

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/blogs/admin/all");
      setBlogs(res.data);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      alert("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await axios.delete(`/blogs/admin/${id}`);
      fetchBlogs();
    } catch (error) {
      console.error("Failed to delete blog:", error);
      alert("Failed to delete blog");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const getImageUrl = (path) => {
    if (!path) return "";
    const url= API_BASE_URL + path;
    return url;
  };

  if (loading) {
    return <div className="blog-list-loading">Loading blogs...</div>;
  }

  return (
    <div className="blog-list-container">
      <div className="blog-list-header">
        <h2>Blogs Management</h2>
        <Link to="/admin/blogs/create" className="btn-add">
          ➕ Add New Blog
        </Link>
      </div>

      {blogs.length === 0 ? (
        <p className="empty-state">No blogs found. Create your first one!</p>
      ) : (
        <div className="table-container">
          <table className="blog-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Preview</th>
                <th>Images</th>
                <th>Category</th>
                <th>Tags</th>
                <th>Author</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id}>
                  <td className="title-cell">
                    <strong>{blog.title || "Untitled"}</strong>
                    <small>{new Date(blog.createdAt).toLocaleDateString()}</small>
                  </td>

                  <td className="content-preview">
                    {blog.content ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            blog.content.length > 100
                              ? blog.content.slice(0, 100) + "..."
                              : blog.content,
                        }}
                      />
                    ) : (
                      <em>No content</em>
                    )}
                  </td>

                  {/* Multiple images with correct URLs */}
                  <td className="images-cell">
                    {blog.images && blog.images.length > 0 ? (
                      <div className="thumbnail-container">
                        {blog.images.slice(0, 4).map((imgPath, index) => (
                          <img
                            key={index}
                            src={getImageUrl(imgPath)}
                            alt={`Thumbnail ${index + 1}`}
                            className="blog-thumbnail multi-thumbnail"
                            onError={(e) => {
                              e.target.src = "/placeholder-image.jpg"; // optional fallback
                              e.target.style.opacity = "0.5";
                            }}
                          />
                        ))}
                        {blog.images.length > 4 && (
                          <span className="more-images">
                            +{blog.images.length - 4}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="no-image">No images</span>
                    )}
                  </td>

                  <td>{blog.category || "-"}</td>

                  <td className="tags-cell">
                    {blog.tags && blog.tags.length > 0 ? (
                      <div className="tags">
                        {blog.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="tag">
                            {tag}
                          </span>
                        ))}
                        {blog.tags.length > 3 && (
                          <span className="more-tags">+{blog.tags.length - 3}</span>
                        )}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td>{blog.author?.name || blog.author || "Unknown"}</td>

                  <td>
                    <span
                      className={`status-badge ${
                        blog.status === "published" ? "published" : "draft"
                      }`}
                    >
                      {blog.status || "draft"}
                    </span>
                  </td>

                  <td>
                    <span className={`featured-badge ${blog.featured ? "yes" : "no"}`}>
                      {blog.featured ? "Yes" : "No"}
                    </span>
                  </td>

                  <td className="actions-cell">
                    <Link to={`/admin/blogs/edit/${blog._id}`} className="btn-edit">
                      ✏️ Edit
                    </Link>
                    <button onClick={() => deleteBlog(blog._id)} className="btn-delete">
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BlogList;