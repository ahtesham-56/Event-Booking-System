const express = require("express");

const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getMyProfile,
  updateMyProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");

const { protect } = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

// =========================================================
// ADMIN ROUTES
// =========================================================

// Admin: Get all users
router.get("/", protect, admin, getUsers);

// Admin: Get single user
router.get("/:id", protect, admin, getUserById);

// Admin: Update user
router.put("/:id", protect, admin, updateUser);

// Admin: Delete user
router.delete("/:id", protect, admin, deleteUser);

// =========================================================
// PUBLIC PASSWORD RECOVERY ROUTES
// =========================================================

// Forgot password
router.post("/forgot-password", forgotPassword);

// Reset password
router.put("/reset-password/:token", resetPassword);

// =========================================================
// USER PROFILE ROUTES
// =========================================================

// Logged-in user: Get own profile
router.get("/profile/me", protect, getMyProfile);

// Logged-in user: Update own profile
router.put("/profile/me", protect, updateMyProfile);

// Logged-in user: Change password
router.put("/change-password", protect, changePassword);

module.exports = router;
