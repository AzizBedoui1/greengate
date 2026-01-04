const Profile = require("../models/Profile");

// Get logged-in user's profile
exports.getProfile = async (req, res) => {
  const profile = await Profile.findOne({ user: req.userId });

  if (!profile) {
    return res.status(404).json({ message: "Profile not found" });
  }

  res.json(profile);
};

// Create or update profile
exports.upsertProfile = async (req, res) => {
  const { name, age, phone, avatar } = req.body;

  let profile = await Profile.findOne({ user: req.userId });

  if (profile) {
    // update
    profile.name = name || profile.name;
    profile.age = age || profile.age;
    profile.phone = phone || profile.phone;
    profile.avatar = avatar || profile.avatar;
    await profile.save();

    return res.json({ message: "Profile updated", profile });
  }

  // create
  profile = await Profile.create({
    user: req.userId,
    name,
    age,
    phone,
    avatar
  });

  res.status(201).json({ message: "Profile created", profile });
};
