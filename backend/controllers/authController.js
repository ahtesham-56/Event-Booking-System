const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =========================================================
// REGISTER USER
// =========================================================

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const normalizedEmail = email
      ? email.toLowerCase().trim()
      : "";

    const userExists = await User.findOne({
      email: normalizedEmail,
    });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered",
      userId: user._id,
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================================================
// LOGIN USER
// =========================================================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email
      ? email.toLowerCase().trim()
      : "";

    const user = await User.findOne({
      email: normalizedEmail,
    });

    // TEMPORARY DEBUG LOGS
    console.log("LOGIN EMAIL:", normalizedEmail);
    console.log("USER FOUND:", !!user);
    console.log(
      "PASSWORD HASH:",
      user ? user.password.substring(0, 7) : "NO USER"
    );

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    // TEMPORARY DEBUG LOG
    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res.json({
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================================================
// EXPORTS
// =========================================================

module.exports = {
  registerUser,
  loginUser,
};
