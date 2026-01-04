const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  name: { type: String, required: true },
  age: { type: Number },
  phone: { type: String },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Profile", profileSchema);
