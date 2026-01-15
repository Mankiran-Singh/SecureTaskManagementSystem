const User = require("../models/User.model");

const redis = require("../config/redis");

module.exports = async (req, res, next) => {
  const userId = req.user.id;
  const key = `activity:${userId}`;

  const exists = await redis.exists(key);
  if (!exists) {
    return res.status(401).json({ message: "Logged out due to inactivity" });
  }

  // Reset inactivity TTL to 10 minutes
  await redis.set(key, "1", { EX: 10 * 60 });

  next();
};

