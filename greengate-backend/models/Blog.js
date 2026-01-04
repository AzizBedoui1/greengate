const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  content: { type: String, required: true },

  images: {
    type: [String],
    validate: [arr => arr.length <= 5, "Max 5 images"]
  },

  category: { type: String, required: true },
  tags: [{ type: String }],

  author: { type: String },

  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft"
  },

  featured: {
    type: Boolean,
    default: false
  },

  publishedAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);
