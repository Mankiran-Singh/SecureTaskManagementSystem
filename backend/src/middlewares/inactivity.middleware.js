const User = require("../models/User.model");

module.exports = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const diff = Date.now() - new Date(user.lastActivity).getTime();
  if (diff > 10 * 60 * 1000) {
    return res.status(401).json({ message: "Logged out due to inactivity" });
  }

  user.lastActivity = new Date();
  await user.save();
  next();
};
