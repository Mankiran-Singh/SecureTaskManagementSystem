module.exports = async (req, res, next) => {
  const userId = req.user.id;
  const key = `activity:${userId}`;

  const exists = await redis.exists(key);
  if (!exists) {
    return res.status(401).json({ message: "Logged out due to inactivity" });
  }

  // Refresh TTL only
  await redis.expire(key, 10 * 60);

  next();
};
