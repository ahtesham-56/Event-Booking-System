const express = require("express");

const {
  createBooking,
  getMyBookings,
  getBookingById,
} = require("../controllers/bookingController");

const { protect } = require("../middleware/auth");

const router = express.Router();

// Create booking
router.post("/", protect, createBooking);

// Get logged-in user's bookings
router.get("/my", protect, getMyBookings);

// Get single booking
router.get("/:id", protect, getBookingById);

module.exports = router;