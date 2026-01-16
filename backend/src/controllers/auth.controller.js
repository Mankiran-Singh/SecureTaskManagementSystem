const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const captchaGen = require("../utils/captcha");
const redis = require("../config/redis");

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role,
  });

  res.status(201).json({ message: "User registered" });
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.status !== "Active") {
    return res.status(403).json({ message: "Invalid user" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "5m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "15m" }
  );

  // Redis
  await redis.set(`activity:${user._id}`, "1");
await redis.expire(`activity:${user._id}`, 10 * 60);
  await redis.set(`refresh:${user._id}`, refreshToken, { EX: 15 * 60 });

  // HttpOnly cookies
  res
    .cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,      
      sameSite: 'strict',
      maxAge: 5 * 60 * 1000
    })
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    })
    .json({ message: "Login successful" });
};


exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const storedToken = await redis.get(`refresh:${decoded.id}`);
    if (!storedToken || storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Reset inactivity
    await redis.expire(`activity:${decoded.id}`, 10 * 60);
    
    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: "5m" }
    );

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 5 * 60 * 1000
    });

    res.json({ message: "Access token refreshed" });
  } catch {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};




exports.logout = async (req, res) => {
  const userId = req.user.id;

  await redis.del(`refresh:${userId}`);
  await redis.del(`activity:${userId}`);

  res
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .json({ message: "Logged out successfully" });
};

exports.me = (req, res) => {
  res.json({
    id: req.user.id,
    role: req.user.role
  });
};
