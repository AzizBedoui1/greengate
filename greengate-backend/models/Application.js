const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  fellowship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Fellowship",
    required: true
  },

  motivation: { type: String },

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  },

  appliedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Application", applicationSchema);
