// seedAdmin.js
require("dotenv").config();
const authController = require("./controllers/authController");
const User = require("./models/User");

async function seedAdmin() {
  try {
    const adminEmail = "admin@greengate.com";
    const adminPassword = "123456";

    // Check if admin exists
    const adminExists = await User.findOne({ email: adminEmail });
    if (adminExists) {
      console.log("Admin already exists, skipping seeding.");
      return;
    }

    // Mock req and res for calling register
    const req = { body: { email: adminEmail, password: adminPassword, role: "admin" } };
    const res = {
      status: (code) => ({ json: (data) => console.log("Admin seeded:", data) }),
      json: (data) => console.log("Admin seeded:", data),
    };

    await authController.register(req, res);
    console.log("Admin account seeded successfully!");
  } catch (err) {
    console.error("Error seeding admin:", err);
  }
}



module.exports = { seedAdmin };
