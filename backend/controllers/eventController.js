const Event = require("../models/Event");
const Booking = require("../models/Booking");

// CREATE EVENT - ADMIN
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      banner,
      date,
      time,
      venue,
      location,
      ticketPrice,
      totalSeats,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !date ||
      !time ||
      !venue ||
      !location ||
      ticketPrice === undefined ||
      totalSeats === undefined
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const event = await Event.create({
      title,
      description,
      category,
      banner,
      date,
      time,
      venue,
      location,
      ticketPrice,
      totalSeats,
      availableSeats: totalSeats,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create event",
      error: error.message,
    });
  }
};

// GET ALL EVENTS - PUBLIC
const getEvents = async (req, res) => {
  try {
    // Get all events first
    const allEvents = await Event.find();

    const now = new Date();

    // Check each event's date + time
    const expiredEventIds = allEvents
      .filter((event) => {
        const eventDateTime = new Date(event.date);

        const [hours, minutes] = event.time.split(":");

        eventDateTime.setHours(
          Number(hours),
          Number(minutes),
          0,
          0
        );

        return eventDateTime < now;
      })
      .map((event) => event._id);

    // Automatically remove expired events
    if (expiredEventIds.length > 0) {
      await Event.deleteMany({
        _id: { $in: expiredEventIds },
      });
    }

    // Get only active events
    const events = await Event.find()
      .populate("createdBy", "name email")
      .sort({ date: 1 });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch events",
      error: error.message,
    });
  }
};





// GET SINGLE EVENT - PUBLIC
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const bookings = await Booking.find({
      event: req.params.id,
    });

    const bookedSeats = [];

    bookings.forEach((booking) => {
      if (Array.isArray(booking.seats)) {
        booking.seats.forEach((seat) => {
          bookedSeats.push(Number(seat));
        });
      }
    });

    res.status(200).json({
      ...event.toObject(),
      bookedSeats,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch event",
      error: error.message,
    });
  }
};

// UPDATE EVENT - ADMIN
const updateEvent = async (req, res) => {
  try {
    // Only these fields are allowed to be updated
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      ticketPrice: req.body.ticketPrice,
      totalSeats: req.body.totalSeats,
    };

    // Remove undefined fields
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.status(200).json({
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    console.error("UPDATE EVENT ERROR:", error);

    res.status(500).json({
      message: "Failed to update event",
      error: error.message,
    });
  }
};

// DELETE EVENT - ADMIN
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.status(200).json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete event",
      error: error.message,
    });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
};