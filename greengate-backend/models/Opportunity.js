const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  image: {
    type: String,
  },

  provider: {
    type: String,
  },

  deadline: {
    type: Date
  },

  externalLink: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Opportunity", opportunitySchema);
