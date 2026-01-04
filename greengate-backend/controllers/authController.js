const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Register
exports.register = async (req, res) => {
  const { email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User already exists" });

  const user = await User.create({ email, password, role });
  res.status(201).json({
    _id: user._id,
    email: user.email,
    role: user.role,
    token: generateToken(user)
  });
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  res.json({
    _id: user._id,
    email: user.email,
    role: user.role,
    token: generateToken(user)
  });
};
