const Task = require("../models/Task.model");
const User = require("../models/User.model");

exports.createTask = async (req, res) => {
  const { title, description, assignedTo } = req.body;

  const user = await User.findById(assignedTo);
  if (!user || user.status !== "Active")
    return res.status(400).json({ message: "Invalid assignee" });

  const task = await Task.create({
    title,
    description,
    createdBy: req.user.id,
    assignedTo,
  });

  res.status(201).json(task);
};

exports.getTasks = async (req, res) => {
  let filter = {};
  if (req.user.role === "Manager") filter.createdBy = req.user.id;
  if (req.user.role === "User") filter.assignedTo = req.user.id;

  const tasks = await Task.find(filter);
  res.json(tasks);
};

exports.updateStatus = async (req, res) => {
  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ message: "Task not found" });

  if (task.status === "Completed")
    return res.status(400).json({ message: "Completed task cannot be edited" });

  if (task.assignedTo.toString() !== req.user.id)
    return res.status(403).json({ message: "Not allowed" });

  task.status = req.body.status;
  await task.save();

  res.json(task);
};

exports.deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.taskId);
  res.json({ message: "Task deleted" });
};
