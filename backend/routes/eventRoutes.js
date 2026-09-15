const express = require("express");

const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

const { protect } = require("../middleware/auth");

const admin = require("../middleware/admin");

const router = express.Router();

// Public routes
router.get("/", getEvents);
router.get("/:id", getEvent);

// Admin routes
router.post("/", protect, admin, createEvent);
router.put("/:id", protect, admin, updateEvent);
router.delete("/:id", protect, admin, deleteEvent);

module.exports = router;