const express = require("express");
const { adminOnly, protect } = require("../middlewares/authMiddleware");
const { getUsers , getUserById, deleteUser } = require("../controllers/userController");

const router = express.Router();

// User management Rutes
router.get("/", protect, adminOnly, getUsers); // get all users admin

router.get("/:id", protect, getUserById); // get a specific user


module.exports = router;