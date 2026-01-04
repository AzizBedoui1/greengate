const Opportunity = require("../models/Opportunity");
const OpportunityEvent = require("../models/Analytics/OpportunityEvent");
const fs = require("fs").promises;
const path = require("path");

/**
 * =========================
 * ADMIN CONTROLLERS
 * =========================
 */

// CREATE
exports.createOpportunity = async (req, res) => {
  try {
    const image = req.file
      ? `/uploads/opportunities/${req.file.filename}`
      : null;

    const opportunity = await Opportunity.create({
      title: req.body.title,
      description: req.body.description,
      image: image,
      provider: req.body.provider,
      deadline: req.body.deadline,
      externalLink: req.body.externalLink,
      status: req.body.status || "active",
    });

    res.status(201).json(opportunity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET ALL OPPORTUNITIES (ADMIN) 
exports.getAllOpportunitiesAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9; 
    const skip = (page - 1) * limit;

    const opportunities = await Opportunity.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Opportunity.countDocuments();

    const lastPage = Math.ceil(total / limit);

    res.json({
      data: opportunities,
      meta: {
        current_page: page,
        last_page: lastPage,
        per_page: limit,
        total: total,
        from: skip + 1,
        to: skip + opportunities.length,
      },
      message: "All opportunities fetched successfully (admin)",
    });
  } catch (error) {
    console.error("Error fetching all opportunities (admin):", error);
    res.status(500).json({
      message: "Failed to fetch opportunities",
      error: error.message,
    });
  }
};

// UPDATE
exports.updateOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    const image = req.file ? `/uploads/opportunities/${req.file.filename}` : opportunity.image;

    opportunity.title = req.body.title || opportunity.title;
    opportunity.description = req.body.description || opportunity.description;
    opportunity.image = image;
    opportunity.provider = req.body.provider || opportunity.provider;
    opportunity.deadline = req.body.deadline || opportunity.deadline;
    opportunity.externalLink =
      req.body.externalLink || opportunity.externalLink;
    opportunity.status = req.body.status || opportunity.status;

    const updatedOpportunity = await opportunity.save();
    res.json(updatedOpportunity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE
exports.deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }


    await opportunity.deleteOne();

    
    if (opportunity.image) {
      const fullPath = path.join(__dirname, "..", opportunity.image);

      try {
        await fs.unlink(fullPath);
        console.log(`Deleted image: ${fullPath}`);
      } catch (fileError) {
        console.warn(`Image file not found or already deleted: ${fullPath}`);
      }
    }


    res.json({ message: "Opportunity deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * =========================
 * PUBLIC CONTROLLERS
 * =========================
 */

// GET ALL ACTIVE OPPORTUNITIES WITH PAGINATION
exports.getActiveOpportunities = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9; 
    const skip = (page - 1) * limit;

    const opportunities = await Opportunity.find({ status: "active" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Opportunity.countDocuments({ status: "active" });

    const lastPage = Math.ceil(total / limit);

    res.json({
      data: opportunities,
      meta: {
        current_page: page,
        last_page: lastPage,
        per_page: limit,
        total: total,
        from: skip + 1,
        to: skip + opportunities.length,
      },
      message: "Active opportunities fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching active opportunities:", error);
    res.status(500).json({ 
      message: "Failed to fetch opportunities",
      error: error.message 
    });
  }
};

// GET SINGLE OPPORTUNITY
exports.getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TRACK OPPORTUNITY CLICK AND REDIRECT

exports.trackOpportunityClick = async (req, res) => {
  const opportunity = await Opportunity.findById(req.params.id);

  if (!opportunity) {
    return res.status(404).json({ message: "Opportunity not found" });
  }

  await OpportunityEvent.create({
    opportunityId: opportunity._id,
    userId: req.userId ? req.userId : null,
    userType: req.userId ? "AUTHENTICATED" : "ANONYMOUS",
    eventType: "CLICK",
  });

  res.json({ redirectUrl: opportunity.externalLink });
};