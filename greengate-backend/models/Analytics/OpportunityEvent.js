const mongoose = require("mongoose");

const opportunityEventSchema = new mongoose.Schema({
  opportunityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Opportunity",
    required: true,
  },
  eventType: {
    type: String,
    enum: ["CLICK"],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
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

module.exports = mongoose.model("OpportunityEvent", opportunityEventSchema);
