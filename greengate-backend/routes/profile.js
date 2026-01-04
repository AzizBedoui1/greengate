const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const { getProfile, upsertProfile } = require("../controllers/profileController");

router.get("/", protect, getProfile);
router.post("/", protect, upsertProfile);
router.put("/", protect, upsertProfile);

module.exports = router;
