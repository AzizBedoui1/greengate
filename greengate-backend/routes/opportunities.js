const express = require("express");
const router = express.Router();

const {
  createOpportunity,
  getAllOpportunitiesAdmin,
  updateOpportunity,
  deleteOpportunity,
  getActiveOpportunities,
  getOpportunityById,
  trackOpportunityClick,
} = require("../controllers/opportunityController");

const { protect, admin } = require("../middlewares/auth");
const optionalAuth = require("../middlewares/optionalAuth");
const upload = require("../middlewares/uploadImageOpportunity");

/**
 * PUBLIC
 */
router.get("/", getActiveOpportunities);
router.get("/:id", getOpportunityById);

router.post("/:id/click",optionalAuth, trackOpportunityClick);

/**
 * ADMIN
 */
router.get("/admin/all", protect, admin, getAllOpportunitiesAdmin);
router.post(
  "/admin",
  protect,
  admin,
  upload.single("image"),
  createOpportunity
);
router.put(
  "/admin/:id",
  protect,
  admin,
  upload.single("image"),
  updateOpportunity
);
router.delete("/admin/:id", protect, admin, deleteOpportunity);

module.exports = router;
