const Booking = require("../models/Booking");
const Event = require("../models/Event");


// =========================================================
// CREATE BOOKING
// =========================================================

const createBooking = async (req, res) => {
  try {
    const { eventId, seats } = req.body;

    // Check event and seats
    if (
      !eventId ||
      !Array.isArray(seats) ||
      seats.length === 0
    ) {
      return res.status(400).json({
        message: "Event and seats are required",
      });
    }

    // Remove duplicate seats
    const uniqueSeats = [
      ...new Set(seats.map(Number)),
    ];

    if (uniqueSeats.length !== seats.length) {
      return res.status(400).json({
        message: "Duplicate seats are not allowed",
      });
    }

    // Find event
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // Check seat numbers
    const invalidSeats = uniqueSeats.filter(
      (seat) =>
        seat < 1 ||
        seat > event.totalSeats
    );

    if (invalidSeats.length > 0) {
      return res.status(400).json({
        message: "Invalid seat number selected",
      });
    }

    // Find existing confirmed bookings
    const existingBookings = await Booking.find({
      event: eventId,
      status: "Confirmed",
    });

    // Get already booked seats
    const bookedSeats = [];

    existingBookings.forEach((booking) => {
      if (Array.isArray(booking.seats)) {
        booking.seats.forEach((seat) => {
          bookedSeats.push(Number(seat));
        });
      }
    });

    // Check already booked seats
    const alreadyBooked = uniqueSeats.filter(
      (seat) =>
        bookedSeats.includes(seat)
    );

    if (alreadyBooked.length > 0) {
      return res.status(400).json({
        message:
          "Some selected seats are already booked: " +
          alreadyBooked.join(", "),
      });
    }

    // Check available seats
    if (
      uniqueSeats.length >
      event.availableSeats
    ) {
      return res.status(400).json({
        message: "Not enough seats available",
      });
    }

    // Calculate price
    const ticketPrice = Number(
      event.ticketPrice || 0
    );

    const totalAmount =
      uniqueSeats.length * ticketPrice;

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      event: eventId,
      seats: uniqueSeats,
      quantity: uniqueSeats.length,
      totalAmount,
      status: "Confirmed",
    });

    // Decrease available seats
    event.availableSeats =
      event.availableSeats -
      uniqueSeats.length;

    await event.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error(
      "CREATE BOOKING ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// =========================================================
// GET LOGGED-IN USER'S BOOKINGS
// =========================================================

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id,
    })
      .populate("event")
      .sort({ createdAt: -1 });

    res.json({
      bookings,
    });
  } catch (error) {
    console.error(
      "GET MY BOOKINGS ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// =========================================================
// GET ALL BOOKINGS - ADMIN
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

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error(
      "GET ALL BOOKINGS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch all bookings",
    });
  }
};


// =========================================================
// GET SINGLE BOOKING
// =========================================================

const getBookingById = async (req, res) => {
  try {
    const booking =
      await Booking.findById(
        req.params.id
      )
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

    res.json({
      booking,
    });
  } catch (error) {
    console.error(
      "GET BOOKING ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// =========================================================
// EXPORT
// =========================================================

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
};