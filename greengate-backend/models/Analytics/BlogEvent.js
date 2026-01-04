const mongoose = require("mongoose");

const blogEventSchema = new mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  eventType: {
    type: String,
    enum: ["VIEW"],
    required: true,
  },
  userType: {
    type: String,
    enum: ["ANONYMOUS", "AUTHENTICATED"],
    required: true,
  },
  ipAddress: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BlogEvent", blogEventSchema);
