const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const inactivity = require("../middlewares/inactivity.middleware");
const task = require("../controllers/task.controller");

router.use(auth);
router.use(inactivity); 

router.post("/", role("Admin", "Manager"), task.createTask);
router.get("/", task.getTasks);
router.put("/:taskId/status", task.updateStatus);
router.delete("/:taskId", role("Admin"), task.deleteTask);

module.exports = router;
