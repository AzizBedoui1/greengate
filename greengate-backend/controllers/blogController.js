const Blog = require("../models/Blog");
const BlogEvent = require("../models/Analytics/BlogEvent");
const slugify = require("slugify");
const fs = require('fs').promises;
const path = require('path');

/**
 * =========================
 * ADMIN methods
 * =========================
 */

/**
 * CREATE BLOG (Admin)
 * Default status: draft
 * Supports 0–5 images
 */
exports.createBlog = async (req, res) => {
  try {
    const images = req.files
      ? req.files.map(file => `/uploads/blogs/${file.filename}`)
      : []; 

    const blog = await Blog.create({
      title: req.body.title,
      slug: slugify(req.body.title, { lower: true }),
      content: req.body.content,
      category: req.body.category,
      tags: req.body.tags || [],
      author: req.body.author,
      images,
      status: req.body.status || "draft",
      featured: req.body.featured || false,
      publishedAt: req.body.status === "published" ? new Date() : null
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * GET ALL BLOGS (Admin)
 * Includes drafts + published
 */
exports.getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE BLOG (Admin)
 * Handles publish transition
 */
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const images =
      req.files && req.files.length > 0
        ? req.files.map(file => `/uploads/blogs/${file.filename}`)
        : blog.images;

    // Handle publish logic
    if (req.body.status === "published" && blog.status !== "published") {
      blog.publishedAt = new Date();
    }

    blog.title = req.body.title || blog.title;
    blog.slug = req.body.title
      ? slugify(req.body.title, { lower: true })
      : blog.slug;
    blog.content = req.body.content || blog.content;
    blog.category = req.body.category || blog.category;
    blog.tags = req.body.tags || blog.tags;
    blog.author = req.body.author || blog.author;
    blog.status = req.body.status || blog.status;
    blog.featured =
      req.body.featured !== undefined ? req.body.featured : blog.featured;
    blog.images = images;

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * DELETE BLOG (Admin)
 */
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }


    if (blog.images && blog.images.length > 0) {
      for (const imagePath of blog.images) {
        const fullPath = path.join(__dirname, '..', imagePath);
        try {
          await fs.unlink(fullPath);
          console.log(`Deleted image: ${fullPath}`);
        } catch (fileError) {
          console.warn(`Image file not found or already deleted: ${fullPath}`);
        }
      }
    }

    await blog.deleteOne();
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * =========================
 * PUBLIC methods
 * =========================
 */

/**
 * GET ALL PUBLISHED BLOGS (Public)
 * Supports category filter
 */
exports.getPublishedBlogs = async (req, res) => {
  try {
    const filter = { status: "published" };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const blogs = await Blog.find(filter)
      .sort({ publishedAt: -1 }); 

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET FEATURED BLOGS (Public)
 */
exports.getFeaturedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({
      status: "published",
      featured: true
    })
      .sort({ publishedAt: -1 })
      .limit(5);

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** 
 * GET SINGLE BLOG BY ID (Public)
*/
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    //this is made to track views on blogs
    await BlogEvent.create({
      blogId: blog._id,
      userId: req.userId ? req.userId : null,
      eventType: "VIEW",
      userType: req.userId ? "AUTHENTICATED" : "ANONYMOUS",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });


    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET SINGLE PUBLISHED BLOG BY SLUG (Public)
 */
exports.getPublishedBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
      status: "published"
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
