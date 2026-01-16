const jwt = require("jsonwebtoken");
const redis = require("../config/redis");

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: "No access token" });
    }

    // 1️ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // 2️ Load session from Redis
    const sessionKey = `session:${decoded.id}`;
    const session = await redis.hGetAll(sessionKey);

    if (!session || !session.lastActivity) {
      return res.status(401).json({ message: "Session expired" });
    }

    // 3️ Inactivity check
    const INACTIVITY_LIMIT = 10 * 60 * 1000; // 10 min
    const now = Date.now();

    if (now - Number(session.lastActivity) > INACTIVITY_LIMIT) {
      await redis.del(sessionKey);
      return res.status(401).json({ message: "Logged out due to inactivity" });
    }

    // 4️Update last activity (HOT path)
    await redis.hSet(sessionKey, {
      lastActivity: now
    });

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
};
