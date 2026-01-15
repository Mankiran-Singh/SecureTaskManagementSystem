const router = require("express").Router();
const auth = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/register", auth.register);
router.post("/login", auth.login);
router.post("/refresh", auth.refreshToken);
router.post("/logout", authMiddleware, auth.logout);


module.exports = router;
