const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, unique: true, required: true },

  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["Admin", "Manager", "User"],
    default: "User",
  },

  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },

  lastActivity: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
