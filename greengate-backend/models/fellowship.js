const mongoose = require("mongoose");

const fellowshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },

  type: {
    type: String,
    required: true,
  },

  image: {
    type: String,
  },

  location: { type: String },
  deadline: { type: Date },

  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Fellowship", fellowshipSchema);
