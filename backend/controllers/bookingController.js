const Booking = require("../models/Booking");
const Event = require("../models/Event");

// =========================================================
// CREATE BOOKING
// POST /api/bookings
// =========================================================

const createBooking = async (req, res) => {
  try {
    const { eventId, seats } = req.body;

    if (
      !eventId ||
      !Array.isArray(seats) ||
      seats.length === 0
    ) {
      return res.status(400).json({
        message: "Event and seats are required",
      });
    }

    const uniqueSeats = [
      ...new Set(seats.map(Number)),
    ];

    if (
      uniqueSeats.some(
        (seat) => !Number.isInteger(seat)
      )
    ) {
      return res.status(400).json({
        message: "Invalid seat number",
      });
    }

    if (uniqueSeats.length !== seats.length) {
      return res.status(400).json({
        message: "Duplicate seats are not allowed",
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const invalidSeats = uniqueSeats.filter(
      (seat) =>
        seat < 1 ||
        seat > Number(event.totalSeats)
    );

    if (invalidSeats.length > 0) {
      return res.status(400).json({
        message:
          "Invalid seat number selected: " +
          invalidSeats.join(", "),
      });
    }

    // =====================================================
    // CHECK ONLY CONFIRMED BOOKINGS
    // CANCELLED BOOKINGS DO NOT BLOCK SEATS
    // =====================================================

    const existingBookings = await Booking.find({
      event: eventId,
      status: "Confirmed",
    });

    const bookedSeats = [];

    existingBookings.forEach((booking) => {
      if (Array.isArray(booking.seats)) {
        booking.seats.forEach((seat) => {
          bookedSeats.push(Number(seat));
        });
      }
    });

    const alreadyBooked = uniqueSeats.filter(
      (seat) => bookedSeats.includes(seat)
    );

    if (alreadyBooked.length > 0) {
      return res.status(400).json({
        message:
          "Some selected seats are already booked: " +
          alreadyBooked.join(", "),
      });
    }

    if (
      uniqueSeats.length >
      Number(event.availableSeats)
    ) {
      return res.status(400).json({
        message: "Not enough seats available",
      });
    }

    const ticketPrice = Number(
      event.ticketPrice || 0
    );

    const totalAmount =
      uniqueSeats.length * ticketPrice;

    const booking = await Booking.create({
      user: req.user.id,
      event: eventId,
      seats: uniqueSeats,
      quantity: uniqueSeats.length,
      totalAmount,
      status: "Confirmed",
    });

    event.availableSeats =
      Number(event.availableSeats) -
      uniqueSeats.length;

    await event.save();

    return res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error(
      "CREATE BOOKING ERROR:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Unable to create booking",
    });
  }
};

// =========================================================
// GET MY BOOKINGS
// GET /api/bookings/my
// =========================================================

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id,
    })
      .populate("event")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      bookings,
    });
  } catch (error) {
    console.error(
      "GET MY BOOKINGS ERROR:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Unable to fetch bookings",
    });
  }
};

// =========================================================
// GET BOOKINGS FOR ONE EVENT
// GET /api/bookings/event/:eventId
//
// ONLY CONFIRMED BOOKINGS ARE RETURNED
// CANCELLED BOOKINGS DO NOT BLOCK SEATS
// =========================================================

const getEventBookings = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "Event ID is required",
      });
    }

    const bookings = await Booking.find({
      event: eventId,
      status: "Confirmed",
    }).select("seats status");

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error(
      "GET EVENT BOOKINGS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to fetch event bookings",
    });
  }
};

// =========================================================
// CANCEL BOOKING
// PUT /api/bookings/:id/cancel
// =========================================================

const cancelBooking = async (req, res) => {
  console.log(
    "================================================="
  );

  console.log(
    "CANCEL BOOKING ROUTE HIT"
  );

  console.log(
    "BOOKING ID:",
    req.params.id
  );

  console.log(
    "USER ID:",
    req.user?.id
  );

  console.log(
    "================================================="
  );

  try {
    const bookingId = req.params.id;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
    }

    const booking =
      await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (
      booking.user.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to cancel this booking",
      });
    }

    if (booking.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    const event =
      await Event.findById(booking.event);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const seatsToRestore =
      Number(booking.quantity) ||
      (
        Array.isArray(booking.seats)
          ? booking.seats.length
          : 0
      );

    booking.status = "Cancelled";

    await booking.save();

    event.availableSeats =
      Number(event.availableSeats || 0) +
      seatsToRestore;

    if (
      event.availableSeats >
      Number(event.totalSeats)
    ) {
      event.availableSeats =
        Number(event.totalSeats);
    }

    await event.save();

    console.log(
      "BOOKING CANCELLED SUCCESSFULLY:",
      bookingId
    );

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error(
      "CANCEL BOOKING ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to cancel booking",
    });
  }
};

// =========================================================
// GET ALL BOOKINGS - ADMIN
// GET /api/bookings/all
// =========================================================

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate(
        "user",
        "name email"
      )
      .populate(
        "event",
        "title category date time venue location ticketPrice totalSeats availableSeats"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error(
      "GET ALL BOOKINGS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch all bookings",
    });
  }
};

// =========================================================
// GET SINGLE BOOKING
// GET /api/bookings/:id
// =========================================================

const getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.id;

    if (!bookingId) {
      return res.status(400).json({
        message: "Booking ID is required",
      });
    }

    const booking =
      await Booking.findById(bookingId)
        .populate("event")
        .populate(
          "user",
          "name email"
        );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (
      booking.user &&
      booking.user._id.toString() !==
        req.user.id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not allowed to view this booking",
      });
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error(
      "GET BOOKING ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to fetch booking",
    });
  }
};

// =========================================================
// EXPORT
// =========================================================

module.exports = {
  createBooking,
  getMyBookings,
  getEventBookings,
  cancelBooking,
  getAllBookings,
  getBookingById,
};