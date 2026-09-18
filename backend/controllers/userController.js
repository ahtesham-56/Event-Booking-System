const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");

// =========================================================
// GET ALL USERS
// Admin only
// =========================================================

const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// =========================================================
// GET SINGLE USER
// Admin only
// =========================================================

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

// =========================================================
// UPDATE USER
// Admin only
// =========================================================

const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (email !== undefined) {
      user.email = email
        .toLowerCase()
        .trim();
    }

    if (role !== undefined) {
      user.role = role;
    }

    const updatedUser = await user.save();

    const userResponse = updatedUser.toObject();

    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Update user error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
};

// =========================================================
// DELETE USER
// Admin only
// =========================================================

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

// =========================================================
// GET MY PROFILE
// Logged-in user
// =========================================================

const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

// =========================================================
// UPDATE MY PROFILE
// Logged-in user
// =========================================================

const updateMyProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      profileImage,
    } = req.body;

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    const updatedUser = await user.save();

    const userResponse = updatedUser.toObject();

    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error(
      "Update profile error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

// =========================================================
// CHANGE PASSWORD
// Logged-in user
// =========================================================

const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordCorrect =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(
      newPassword,
      10
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(
      "Change password error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};

// =========================================================
// FORGOT PASSWORD
// Public
// =========================================================

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter your email address",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a password reset link has been generated.",
      });
    }

    const resetToken =
      crypto.randomBytes(32).toString("hex");

    const hashedToken =
      crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    user.resetPasswordToken =
      hashedToken;

    user.resetPasswordExpire =
      Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetUrl =
      `http://localhost:5173/reset-password/${resetToken}`;

    res.status(200).json({
      success: true,
      message:
        "Password reset link generated successfully",
      resetUrl,
    });
  } catch (error) {
    console.error(
      "Forgot password error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to process forgot password request",
    });
  }
};

// =========================================================
// RESET PASSWORD
// Public
// =========================================================

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    const {
      password,
      confirmPassword,
    } = req.body;

    // -----------------------------------------------------
    // Validate token
    // -----------------------------------------------------

    if (!token) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or missing reset token",
      });
    }

    // -----------------------------------------------------
    // Validate passwords
    // -----------------------------------------------------

    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "New passwords do not match",
      });
    }

    // -----------------------------------------------------
    // Hash reset token
    // -----------------------------------------------------

    const hashedToken =
      crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    // -----------------------------------------------------
    // Find valid user
    // -----------------------------------------------------

    const user = await User.findOne({
      resetPasswordToken: hashedToken,

      resetPasswordExpire: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Reset token is invalid or has expired",
      });
    }

    // -----------------------------------------------------
    // IMPORTANT:
    // Hash the new password exactly like registration
    // -----------------------------------------------------

    const hashedPassword =
      await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    // -----------------------------------------------------
    // Clear reset token
    // -----------------------------------------------------

    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    console.error(
      "Reset password error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to reset password",
    });
  }
};

// =========================================================
// EXPORTS
// =========================================================

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getMyProfile,
  updateMyProfile,
  changePassword,
  forgotPassword,
  resetPassword,
};

