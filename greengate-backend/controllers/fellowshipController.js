const Fellowship = require("../models/fellowship");
const FellowshipEvent = require("../models/Analytics/FellowshipEvent");
const fs = require("fs").promises;
const path = require("path");

/**
 * =========================
 * ADMIN CONTROLLERS
 * =========================
 */

/**
 * CREATE FELLOWSHIP (Admin)
 */
exports.createFellowship = async (req, res) => {
  try {
    const image = req.file ? `/uploads/fellowships/${req.file.filename}` : null;

    const fellowship = await Fellowship.create({
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      image,
      location: req.body.location,
      deadline: req.body.deadline,
      status: req.body.status || "open",
    });

    res.status(201).json(fellowship);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * GET ALL FELLOWSHIPS (Admin)
 */
exports.getAllFellowshipsAdmin = async (req, res) => {
  try {
    const fellowships = await Fellowship.find().sort({ createdAt: -1 });
    res.json(fellowships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE Fellowship (Admin)
 */
exports.updateFellowship = async (req, res) => {
  try {
    const fellowship = await Fellowship.findById(req.params.id);
    if (!fellowship) {
      return res.status(404).json({ message: "Fellowship not found" });
    }

    const image = req.file ? `/uploads/fellowships/${req.file.filename}` : null;

    fellowship.title = req.body.title || fellowship.title;
    fellowship.description = req.body.description || fellowship.description;
    fellowship.type = req.body.type || fellowship.type;
    fellowship.image = image;
    fellowship.location = req.body.location || fellowship.location;
    fellowship.deadline = req.body.deadline || fellowship.deadline;
    fellowship.status = req.body.status || fellowship.status;

    const updatedFellowship = await fellowship.save();
    res.json(updatedFellowship);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * DELETE Fellowship (Admin)
 */
exports.deleteFellowship = async (req, res) => {
  try {
    const fellowship = await Fellowship.findById(req.params.id);
    if (!fellowship) {
      return res.status(404).json({ message: "Fellowship not found" });
    }

    await fellowship.deleteOne();

    if (fellowship.image) {
      const fullPath = path.join(__dirname, "..", fellowship.image);

      try {
        await fs.unlink(fullPath);
        console.log(`Deleted image: ${fullPath}`);
      } catch (fileError) {
        console.warn(`Image file not found or already deleted: ${fullPath}`);
      }
    }
    res.json({ message: "Fellowship deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * =========================
 * PUBLIC CONTROLLERS
 * =========================
 */

/**
 * GET ALL OPEN Fellowship (Public)
 * Optional filter: ?type=internship
 */
exports.getOpenFellowships = async (req, res) => {
  try {
    const filter = { status: "open" };

    if (req.query.type) {
      filter.type = req.query.type;
    }

    const fellowships = await Fellowship.find(filter).sort({
      createdAt: -1,
    });

    res.json(fellowships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET SINGLE Fellowship (Public)
 */
exports.getFellowshipById = async (req, res) => {
  try {
    const fellowship = await Fellowship.findById(req.params.id);

    if (!fellowship || fellowship.status !== "open") {
      return res.status(404).json({ message: "Fellowship not found" });
    }

    await FellowshipEvent.create({
      fellowshipId: fellowship._id,
      userId: req.userId ? req.userId : null,
      userType: req.userId ? "AUTHENTICATED" : "ANONYMOUS",
      eventType: "VIEW",
    });

    res.json(fellowship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
