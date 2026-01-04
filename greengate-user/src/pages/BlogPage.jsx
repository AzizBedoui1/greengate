import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import Divider from "@mui/material/Divider";
import LoadingSpinner from "../components/LoadingSpinner";

import axios from "../api/axios"; 
import "../styles/BlogPage.css";

const BlogPage = () => {
    const navigate = useNavigate();
    const [blogPosts, setBlogPosts] = useState([]);
    const [meta, setMeta] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const API_BASE_URL = axios.defaults.baseURL || "http://localhost:5000/api";



    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const response = await axios.get("/blogs", {
                    params: { page } 
                });

                const posts = response.data;
                setBlogPosts(posts);
                setMeta(response.data.meta || null);
            } catch (error) {
                console.error("Error fetching blogs:", error);
                setBlogPosts([]);
                setMeta(null);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [page]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleBlogClick = (id) => {
        navigate(`/blog/${id}`);
    };

    const getImageUrl = (path) => {
        if (!path) return "";
        const url= API_BASE_URL + path;
        return url;
    };

    const getFirstImage = (post) => {
        if (!post) return null;

        const images = Array.isArray(post.images)
        ? post.images
        : post.image
        ? [post.image]
        : [];

        if (Array.isArray(images) && images.length > 0) {
            return images[0];
        }

        // Fallback to single image field
        if (post.image) {
            return post.image;
        }

        return null;
    };

    const renderPagination = () => {
        if (!meta || meta.last_page <= 1) return null;

        const pages = [];

        if (meta.current_page > 1) {
            pages.push(
                <button
                    key="prev"
                    onClick={() => handlePageChange(meta.current_page - 1)}
                    className="pagination-button"
                >
                    <ChevronLeft size={16} /> Previous
                </button>
            );
        }

        for (let i = 1; i <= meta.last_page; i++) {
            if (
                i === 1 ||
                i === meta.last_page ||
                (i >= meta.current_page - 1 && i <= meta.current_page + 1)
            ) {
                pages.push(
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`pagination-number ${
                            meta.current_page === i ? "active" : ""
                        }`}
                    >
                        {i}
                    </button>
                );
            } else if (
                i === meta.current_page - 2 ||
                i === meta.current_page + 2
            ) {
                const lastItem = pages[pages.length - 1];
                if (lastItem?.key !== `ellipsis-${i}`) {
                    pages.push(
                        <span key={`ellipsis-${i}`} className="pagination-ellipsis">
                            ...
                        </span>
                    );
                }
            }
        }

        if (meta.current_page < meta.last_page) {
            pages.push(
                <button
                    key="next"
                    onClick={() => handlePageChange(meta.current_page + 1)}
                    className="pagination-button"
                >
                    Next <ChevronRight size={16} />
                </button>
            );
        }

        return pages;
    };

    

    if (loading && blogPosts.length === 0) {
        return <LoadingSpinner message="Loading blogs…" />;
    }

    return (
        <section className="blogpage">
            <header className="blogpage-hero">
                <Divider className="line" sx={{ mx: "5%" }} />
                <h1 className="blogpage-title">The Blog</h1>
                <Divider sx={{ mx: "5%" }} />
            </header>

            <div className="all-blog-posts">
                <h2 className="all-blog-posts-title">All blog posts</h2>

                <div className="blog-posts-grid">
                    {blogPosts.length === 0 ? (
                        <p style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "#666" }}>
                            No blog posts found.
                        </p>
                    ) : (
                        blogPosts.map((post) => {
                            const firstImage = getFirstImage(post);
                            const imageUrl = getImageUrl(firstImage);

                            return (
                                <article
                                    key={post.id || post._id}
                                    className="blog-post-card"
                                    onClick={() => handleBlogClick(post.id || post._id)}
                                >
                                    <div className="blog-post-image-wrapper">
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={post.title}
                                                className="blog-post-image"
                                                onError={(e) => {
                                                    e.target.style.display = "none";
                                                }}
                                            />
                                        ) : (
                                            <div className="blog-post-image-placeholder" />
                                        )}
                                    </div>
                                    <div className="card-text">
                                        <p className="blog-post-author">
                                            {post?.author || "GreenGate Team"} •{" "}
                                            {post.date || (post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Date unknown")}
                                        </p>

                                        <div className="blog-post-header">
                                            <h3 className="blog-post-title-main">
                                                {post.title}
                                            </h3>
                                            <ArrowUpRight size={20} className="blog-post-arrow" />
                                        </div>

                                        <p className="blog-post-description">
                                            {post.content ? post.content.slice(0, 150) + "..." : "No description available."}
                                        </p>

                                        <div className="blog-post-tags">
                                            {post.tags && post.tags.length > 0 ? (
                                                post.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className={`blog-post-tag ${
                                                            index === 0 ? "tag-primary" : "tag-secondary"
                                                        }`}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="blog-post-tag tag-secondary">
                                                    Uncategorized
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            );
                        })
                    )}
                </div>

                {meta && meta.last_page > 1 && (
                    <div className="pagination-wrapper">
                        <div className="pagination">{renderPagination()}</div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BlogPage;