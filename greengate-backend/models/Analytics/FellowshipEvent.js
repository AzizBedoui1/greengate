const mongoose = require("mongoose");

const fellowshipEventSchema = new mongoose.Schema({
  fellowshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Fellowship",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  eventType: {
    type: String,
    enum: ["VIEW", "APPLY"],
    required: true,
  },
  userType: {
    type: String,
    enum: ["ANONYMOUS", "AUTHENTICATED"],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("FellowshipEvent", fellowshipEventSchema);
