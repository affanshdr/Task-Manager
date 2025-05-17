
const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { getDashboardData, getUserDashboardData, getTasks, getTaskById, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskChecklist } = require("../controllers/taskController");

const router = express.Router();

// Task management Rutes
router.get("/dashboard-data", protect, getDashboardData); 
router.get("/user-dashboard-data", protect, getUserDashboardData); 
router.get("/", protect, getTasks); // get all tasks (admin:all users:assigned)
router.get("/:id", protect, getTaskById); // get a specific task
router.post("/", protect, createTask); // create a task admin only
router.put("/:id", protect, updateTask); // update a task
router.delete("/:id", protect, adminOnly, deleteTask); // delete a task
router.put("/:id/status", protect, updateTaskStatus); // update task status
router.put("/:id/todo", protect, updateTaskChecklist); // update task checklist

module.exports = router;
