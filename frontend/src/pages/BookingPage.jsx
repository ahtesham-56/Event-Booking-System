import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getEventById } from "../services/eventService";
import { createBooking } from "../services/bookingService";
import SeatSelector from "../components/SeatSelector";

function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");

  /* ================= LOAD EVENT ================= */

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const data = await getEventById(id);

        const eventData = data.event || data;

        console.log("BOOKING PAGE EVENT:", eventData);

        setEvent(eventData);
      } catch (error) {
        console.error(error);
        setError("Unable to load event.");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  /* ================= CREATE BOOKING ================= */

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select seats.");
      return;
    }

    setBooking(true);

    try {
      const data = await createBooking({
        eventId: id,
        seats: selectedSeats,
        quantity: selectedSeats.length,
      });

      console.log("BOOKING RESPONSE:", data);
      console.log("EVENT BEING SENT:", event);

      const bookingData = data.booking || data;

      const bookingId =
        bookingData?._id ||
        data?._id;

      if (bookingId) {
        /*
         * IMPORTANT:
         * Send both booking and event to the confirmation page.
         *
         * Booking contains:
         * - booking ID
         * - seats
         * - quantity
         * - total amount
         * - status
         *
         * Event contains:
         * - title
         * - date
         * - time
         * - venue
         * - location
         */

        navigate(`/booking-confirmation/${bookingId}`, {
          state: {
            booking: bookingData,
            event: {
              _id: event?._id,
              title: event?.title,
              date: event?.date,
              time: event?.time,
              venue: event?.venue,
              location: event?.location,
            },
          },
        });
      } else {
        alert("Booking created successfully!");
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Booking failed."
      );
    } finally {
      setBooking(false);
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div
          className="spinner-border text-primary mb-3"
          role="status"
        />

        <h5 className="fw-semibold">
          Loading event...
        </h5>

        <p className="text-muted mb-0">
          Please wait while we load the event details.
        </p>
      </div>
    );
  }

  /* ================= ERROR ================= */

  if (error || !event) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-7">

            <div className="alert alert-danger shadow-sm">
              {error || "Event not found."}
            </div>

          </div>
        </div>
      </div>
    );
  }

  /* ================= FORMAT DATE ================= */

  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Not available";

  /* ================= FORMAT TIME ================= */

  let formattedTime = "Not available";

  if (event.time) {
    if (
      typeof event.time === "string" &&
      (event.time.toLowerCase().includes("am") ||
        event.time.toLowerCase().includes("pm"))
    ) {
      formattedTime = event.time;
    } else {
      const [hours, minutes] = String(event.time).split(":");

      if (
        hours !== undefined &&
        minutes !== undefined
      ) {
        const timeDate = new Date();

        timeDate.setHours(
          Number(hours),
          Number(minutes),
          0,
          0
        );

        formattedTime =
          timeDate.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
      }
    }
  }

  /* ================= TOTAL AMOUNT ================= */

  const totalAmount =
    selectedSeats.length *
    Number(event.ticketPrice || 0);

  return (
    <div className="bg-light min-vh-100">

      <div className="container py-4 py-md-5">

        {/* ================= PAGE HEADER ================= */}

        <div className="mb-4">

          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 mb-2">
            🎫 Event Booking
          </span>

          <h2 className="fw-bold mb-2">
            Book Your Ticket
          </h2>

          <p className="text-muted mb-0">
            Select your seats and confirm your booking.
          </p>

        </div>

        <div className="row g-4">

          {/* ================= LEFT SIDE ================= */}

          <div className="col-lg-8">

            <div className="card border-0 shadow-sm rounded-4">

              <div className="card-body p-4 p-md-5">

                {/* EVENT TITLE */}

                <div className="mb-4">

                  <h3 className="fw-bold mb-3">
                    {event.title}
                  </h3>

                  <div className="d-flex flex-column gap-2 text-muted">

                    <div>
                      📅{" "}
                      <strong className="text-dark">
                        {formattedDate}
                      </strong>
                    </div>

                    <div>
                      🕐{" "}
                      <strong className="text-dark">
                        {formattedTime}
                      </strong>
                    </div>

                    <div>
                      📍{" "}
                      <strong className="text-dark">
                        {event.venue || "Venue not available"}
                      </strong>
                    </div>

                    {event.location && (
                      <div className="small">
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        {event.location}
                      </div>
                    )}

                  </div>

                </div>

                <hr />

                {/* SEAT SELECTOR */}

                <div className="mt-4">

                  <h5 className="fw-bold mb-2">
                    Select Your Seats
                  </h5>

                  <p className="text-muted small mb-4">
                    Choose the seats you want to book.
                  </p>

                  <SeatSelector
                    totalSeats={
                      event.totalSeats || 30
                    }
                    bookedSeats={
                      event.bookedSeats || []
                    }
                    ticketPrice={
                      event.ticketPrice || 0
                    }
                    onSelect={setSelectedSeats}
                  />

                </div>

              </div>

            </div>

          </div>

          {/* ================= RIGHT SIDE ================= */}

          <div className="col-lg-4">

            <div
              className="card border-0 shadow-sm rounded-4 sticky-lg-top"
              style={{
                top: "90px",
              }}
            >

              <div className="card-body p-4">

                <h4 className="fw-bold mb-4">
                  Booking Summary
                </h4>

                {/* EVENT */}

                <div className="mb-3">

                  <small className="text-muted">
                    Event
                  </small>

                  <div className="fw-semibold mt-1">
                    {event.title}
                  </div>

                </div>

                {/* DATE */}

                <div className="mb-3">

                  <small className="text-muted">
                    Date
                  </small>

                  <div className="fw-semibold mt-1">
                    📅 {formattedDate}
                  </div>

                </div>

                {/* TIME */}

                <div className="mb-3">

                  <small className="text-muted">
                    Time
                  </small>

                  <div className="fw-semibold mt-1">
                    🕐 {formattedTime}
                  </div>

                </div>

                {/* VENUE */}

                <div className="mb-3">

                  <small className="text-muted">
                    Venue
                  </small>

                  <div className="fw-semibold mt-1">
                    📍{" "}
                    {event.venue ||
                      "Venue not available"}
                  </div>

                  {event.location && (
                    <small className="text-muted">
                      {event.location}
                    </small>
                  )}

                </div>

                {/* SEATS */}

                <div className="mb-3">

                  <small className="text-muted">
                    Selected Seats
                  </small>

                  <div className="mt-1">

                    {selectedSeats.length > 0 ? (
                      <span className="fw-semibold">
                        {selectedSeats.join(", ")}
                      </span>
                    ) : (
                      <span className="text-muted">
                        No seats selected
                      </span>
                    )}

                  </div>

                </div>

                {/* TICKETS */}

                <div className="mb-3">

                  <small className="text-muted">
                    Tickets
                  </small>

                  <div className="fw-semibold mt-1">
                    {selectedSeats.length}
                  </div>

                </div>

                {/* PRICE */}

                <div className="mb-3">

                  <small className="text-muted">
                    Price per ticket
                  </small>

                  <div className="fw-semibold mt-1">
                    ₹{event.ticketPrice || 0}
                  </div>

                </div>

                <hr />

                {/* TOTAL */}

                <div className="d-flex justify-content-between align-items-center">

                  <strong>
                    Total
                  </strong>

                  <strong className="text-success fs-5">
                    ₹{totalAmount}
                  </strong>

                </div>

                {/* CONFIRM BUTTON */}

                <button
                  type="button"
                  className="btn btn-primary w-100 mt-4 py-2"
                  onClick={handleBooking}
                  disabled={
                    booking ||
                    selectedSeats.length === 0
                  }
                >
                  {booking ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      />
                      Booking...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>

                {selectedSeats.length === 0 && (
                  <small className="text-muted d-block text-center mt-2">
                    Please select at least one seat.
                  </small>
                )}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default BookingPage;

