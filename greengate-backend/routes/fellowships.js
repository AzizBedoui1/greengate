const express = require("express");
const router = express.Router();

const {
  createFellowship,
  getAllFellowshipsAdmin,
  updateFellowship,
  deleteFellowship,
  getOpenFellowships,
  getFellowshipById,
} = require("../controllers/fellowshipController");

const { protect, admin } = require("../middlewares/auth");
const optionalAuth = require("../middlewares/optionalAuth");
const upload = require("../middlewares/uploadImageFellowship");

/**
 * =========================
 * PUBLIC ROUTES
 * =========================
 */

router.get("/", getOpenFellowships);

router.get("/:id",optionalAuth, getFellowshipById);

/**
 * =========================
 * ADMIN ROUTES
 * =========================
 */

router.get("/admin/all", protect, admin, getAllFellowshipsAdmin);

router.post("/admin", protect, admin, upload.single('image'), createFellowship);

router.put("/admin/:id", protect, admin, upload.single('image'), updateFellowship);

router.delete("/admin/:id", protect, admin, deleteFellowship);

module.exports = router;
