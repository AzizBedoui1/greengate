import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import imgBlog from "../assets/img/img_blog.png";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/BlogPost.css";

const BlogPostPage = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_BASE_URL = axios.defaults.baseURL || "http://localhost:5000/api";

    useEffect(() => {
        const fetchBlog = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/blogs/${id}`);
                setBlog(response.data.data || response.data);
            } catch (error) {
                console.error("Error fetching blog post:", error);
                setBlog(null);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    const getImageUrl = (path) => {
        if (!path) return "";
        const url= API_BASE_URL + path;
        return url;
    };

    if (loading) return <LoadingSpinner message="Loading blog…" />;
    if (!blog) return <div className="blogpost-not-found">Blog not found.</div>;

    const images = Array.isArray(blog.images)
        ? blog.images
        : blog.image
        ? [blog.image]
        : [];

    return (
        <section className="blogpost">
            <header className="blogpost-hero">
                <h1 className="blogpost-title">{blog.title || "Blog Title"}</h1>
            </header>

            <div className="blogpost-section">
                <div className="blogpost-top">
                    <div className="blogpost-left">
                        <div>
                            <div className="blogpost-details">
                                <p className="blogpost_details1">
                                    {blog.publishedAt
                                        ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                          })
                                        : "Date not available"}
                                </p>
                                <p className="blogpost_details2">
                                    By {blog?.author|| "Unknown Author"}
                                </p>
                            </div>

                            <div className="blogpost-section-flex1">
                                <div>
                                    <p className="blogpost-paragraphs">
                                        {blog.content || "No content available."}
                                    </p>

                                    {/* Render ALL images */}
                                    {images.length > 0 && (
                                        <div className="blogpost-images-container">
                                            {images.map((imgPath, index) => (
                                                <img
                                                    key={index}
                                                    className="blogpost-image"
                                                    src={getImageUrl(imgPath)}
                                                    alt={`${blog.title} - Image ${index + 1}`}
                                                    onError={(e) => {
                                                        e.target.style.display = "none";
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="contact-form-wrap">
                                    <h3>Sign up for The GreenGate News Newsletter</h3>
                                    <p className="blogpost_details2">
                                        By {blog.author?.name || "Unknown Author"}
                                    </p>
                                    <p className="blogpost_details1">
                                        A weekly, ad-free newsletter that helps readers stay in the know, be productive, and think more critically about the world. Take a look.
                                    </p>
                                    <button>GET THIS NEWSLETTER</button>
                                </div>

                                <div className="blog-post-types">
                                    {blog.tags && blog.tags.length > 0 ? (
                                        blog.tags.map((tag, idx) => (
                                            <p key={idx} className="blog-post-type">
                                                {tag}
                                            </p>
                                        ))
                                    ) : (
                                        <p className="blog-post-type">No tags</p>
                                    )}
                                </div>

                                <hr />

                                <div className="blogpost-author">
                                    <div className="blogpost-author-image">
                                        {blog.author?.image ? (
                                            <img
                                                src={getImageUrl(blog.author.image)}
                                                alt={blog.author.name}
                                                onError={(e) => {
                                                    e.target.style.display = "none";
                                                }}
                                            />
                                        ) : (
                                            <div className="placeholder-avatar" />
                                        )}
                                    </div>
                                    <div className="blogpost-author-info">
                                        <p className="blogpost_author_type">Author</p>
                                        <h4 className="blogpost_author_name">
                                            {blog?.author|| "Unknown Author"}
                                        </h4>
                                        <p className="blogpost_author_bio">
                                            {blog.author?.bio || "No author bio available."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related / Suggested Posts */}
                <div className="blogpost-section-flex2">
                    <div>
                        <img
                            className="blogpost-section-flex2-image"
                            src={imgBlog}
                            alt="Related Blog"
                        />
                        <h5 className="blogpost-section-flex2-title">
                            The ADA is turning 30. It's time that it included digital accessibility.
                        </h5>
                    </div>
                    <div>
                        <img
                            className="blogpost-section-flex2-image"
                            src={imgBlog}
                            alt="Related Blog"
                        />
                        <h5 className="blogpost-section-flex2-title">
                            The ADA is turning 30. It's time that it included digital accessibility.
                        </h5>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlogPostPage;