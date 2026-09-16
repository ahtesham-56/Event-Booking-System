const express = require("express");

const {
  createBooking,
  getMyBookings,
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
// GET SINGLE BOOKING
// GET /api/bookings/:id
// =========================================================

router.get(
  "/:id",
  protect,
  getBookingById
);


module.exports = router;