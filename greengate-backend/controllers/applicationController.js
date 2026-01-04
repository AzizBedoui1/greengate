const Application = require("../models/Application");
const Fellowship = require("../models/fellowship");
const FellowshipEvent = require("../models/Analytics/FellowshipEvent");

/**
 * =========================
 * USER CONTROLLERS
 * =========================
 */

/**
 * APPLY TO OPPORTUNITY
 */
exports.applyToFellowship = async (req, res) => {
  try {
    const fellowship = await Fellowship.findById(req.params.fellowshipId);

    if (!fellowship || fellowship.status !== "open") {
      return res.status(404).json({ message: "Fellowship not available" });
    }

    // Prevent duplicate application
    const alreadyApplied = await Application.findOne({
      user: req.userId,
      fellowship: fellowship._id
    });

    if (alreadyApplied) {
      return res
        .status(400)
        .json({ message: "You already applied to this fellowship" });
    }

    const application = await Application.create({
      user: req.userId,
      fellowship: fellowship._id,
      motivation: req.body.motivation
    });

    const fellowshipEvent = await FellowshipEvent.create({
      fellowshipId: fellowship._id,
      userId: req.userId,
      userType: "AUTHENTICATED",
      eventType: "APPLY",
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY APPLICATIONS (User)
 */
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.userId })
      .populate("fellowship", "title type status")
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * =========================
 * ADMIN CONTROLLERS
 * =========================
 */

/**
 * GET ALL APPLICATIONS (Admin)
 */
exports.getAllApplicationsAdmin = async (req, res) => {
  try {
    const filter = {};

    if (req.query.fellowshipId) {
      filter.fellowship = req.query.fellowshipId;
    }

    const applications = await Application.find(filter)
      .populate("user", "email")
      .populate("fellowship", "title type")
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getApplicationsByFellowshipIdAdmin = async (req, res) => {
  try {
    const fellowshipId = req.params.fellowshipId;

    const applications = await Application.find({ fellowship: fellowshipId })
      .populate({
        path: "user",
        select: "email",                    
        populate: {
          path: "profile",                  
          select: "name phone"            
        }
      })
      .populate("fellowship", "title type")
      .sort({ appliedAt: -1 });            

    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * UPDATE APPLICATION STATUS (Admin)
 */
exports.updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = req.body.status;
    const updatedApplication = await application.save();

    res.json(updatedApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
