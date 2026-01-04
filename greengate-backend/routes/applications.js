const express = require("express");
const router = express.Router();

const {
  applyToFellowship,
  getMyApplications,
  getAllApplicationsAdmin,
  getApplicationsByFellowshipIdAdmin,
  updateApplicationStatus
} = require("../controllers/applicationController");

const { protect, admin } = require("../middlewares/auth");

/**
 * =========================
 * USER ROUTES
 * =========================
 */

router.post(
  "/apply/:fellowshipId",
  protect,
  applyToFellowship
);

router.get("/myFellowships", protect, getMyApplications);

/**
 * =========================
 * ADMIN ROUTES
 * =========================
 */

router.get("/admin/all", protect, admin, getAllApplicationsAdmin);

router.get("/admin/:fellowshipId", protect, admin, getApplicationsByFellowshipIdAdmin);

router.put("/admin/:id", protect, admin, updateApplicationStatus);

module.exports = router;
