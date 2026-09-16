const jwt = require("jsonwebtoken");
const User = require("../models/User");

// =========================================================
// PROTECT ROUTE
// =========================================================

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id).select(
      "-password"
    );

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};


// =========================================================
// ADMIN PROTECT
// =========================================================

const admin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
};


module.exports = {
  protect,
  admin,
};