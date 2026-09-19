const express = require("express");

const {
  createBooking,
  getMyBookings,
  getEventBookings,
  cancelBooking,
  getAllBookings,
  getBookingById,
} = require("../controllers/bookingController");

const {
  protect,
  admin,
} = require("../middleware/auth");

const router = express.Router();

// =========================================================
// CREATE BOOKING
// POST /api/bookings
// =========================================================

router.post(
  "/",
  protect,
  createBooking
);

// =========================================================
// GET ALL BOOKINGS - ADMIN
// GET /api/bookings/all
// =========================================================

router.get(
  "/all",
  protect,
  admin,
  getAllBookings
);

// =========================================================
// GET LOGGED-IN USER'S BOOKINGS
// GET /api/bookings/my
// =========================================================

router.get(
  "/my",
  protect,
  getMyBookings
);

// =========================================================
// GET CONFIRMED BOOKINGS FOR ONE EVENT
// GET /api/bookings/event/:eventId
// =========================================================

router.get(
  "/event/:eventId",
  protect,
  getEventBookings
);

// =========================================================
// CANCEL BOOKING
// PUT /api/bookings/:id/cancel
// =========================================================

router.put(
  "/:id/cancel",
  protect,
  cancelBooking
);

// =========================================================
// GET SINGLE BOOKING
// GET /api/bookings/:id
// =========================================================

router.get(
  "/:id",
  protect,
  getBookingById
);

module.exports = router;