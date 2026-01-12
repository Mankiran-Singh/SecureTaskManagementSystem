const router = require('express').Router();

const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const inactivity = require('../middlewares/inactivity.middleware');
const userController = require('../controllers/user.controller');


router.get(
  '/active',
  auth,
  inactivity,
  role('Admin', 'Manager'),
  userController.getActiveUsers
);

module.exports = router;
