const User = require("../models/User.model");

module.exports = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  const now = Date.now();
  const last = new Date(user.lastActivity).getTime();

  // 10 minutes inactivity
  if (now - last > 10 * 60 * 1000) {
    return res.status(401).json({ message: "Logged out due to inactivity" });
  }

  // Update activity timestamp
  user.lastActivity = new Date();
  await user.save();

  next();
};
