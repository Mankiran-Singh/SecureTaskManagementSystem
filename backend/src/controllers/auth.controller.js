const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const captchaGen = require("../utils/captcha");

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
  const { email, password, captcha, serverCaptcha } = req.body;

  if (captcha !== serverCaptcha)
    return res.status(400).json({ message: "Captcha invalid", captcha: captchaGen() });

  const user = await User.findOne({ email });
  if (!user || user.status !== "Active")
    return res.status(403).json({ message: "Invalid user", captcha: captchaGen() });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(400).json({ message: "Invalid credentials", captcha: captchaGen() });

  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "5m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "15m" }
  );

  res.json({ accessToken, refreshToken });
};
