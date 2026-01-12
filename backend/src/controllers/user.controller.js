const User = require('../models/User.model');

exports.getActiveUsers = async (req, res) => {
  try {
    const users = await User.find(
      { status: 'Active' },
      { password: 0 } // never send password
    );

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};
