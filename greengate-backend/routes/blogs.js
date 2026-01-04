const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middlewares/auth");
const optionalAuth = require("../middlewares/optionalAuth");
const upload = require("../middlewares/uploadMiddlware");

const {
  createBlog,
  getAllBlogsAdmin,
  getBlogById,
  updateBlog,
  deleteBlog,
  getPublishedBlogs,
  getFeaturedBlogs,
  getPublishedBlogBySlug,
} = require("../controllers/blogController");

/**
 * =========================
 * PUBLIC ROUTES
 * =========================
 */

router.get("/", getPublishedBlogs);

router.get("/featured", getFeaturedBlogs);

router.get("/:id",optionalAuth, getBlogById);

router.get("/slug/:slug", getPublishedBlogBySlug);



/**
 * =========================
 * ADMIN ROUTES
 * =========================
 */

router.get("/admin/all", protect, admin, getAllBlogsAdmin);

router.post("/admin", protect, admin, upload.array("images", 5), createBlog);

router.put("/admin/:id", protect, admin, upload.array("images", 5), updateBlog);

router.delete("/admin/:id", protect, admin, deleteBlog);

module.exports = router;
