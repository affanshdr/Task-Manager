

const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const router = express.Router();
const { exportTasksReport, exportUsersReport } = require("../controllers/reportController");


router.get("/export/tasks", protect, adminOnly, exportTasksReport); // export all tasks as excel/pdf

router.get ("/export/users", protect, adminOnly, exportUsersReport); // export all users as excel/pdf

module.exports = router;

