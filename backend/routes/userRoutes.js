const express = require("express");

const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const { protect } = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

// Admin: Get all users
router.get("/", protect, admin, getUsers);

// Admin: Get single user
router.get("/:id", protect, admin, getUserById);

// Admin: Update user
router.put("/:id", protect, admin, updateUser);

// Admin: Delete user
router.delete("/:id", protect, admin, deleteUser);

module.exports = router;