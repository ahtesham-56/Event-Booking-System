import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getMyBookings,
  cancelBooking,
} from "../services/bookingService";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  // =========================================================
  // LOAD BOOKINGS
  // =========================================================

  const loadBookings = async () => {
    try {
      setError("");

      const data = await getMyBookings();

      setBookings(data?.bookings || []);
    } catch (error) {
      console.error("LOAD BOOKINGS ERROR:", error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load your bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // =========================================================
  // CANCEL BOOKING
  // =========================================================

  const handleCancelBooking = async (bookingId) => {
    if (!bookingId) {
      setError("Booking ID is missing.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(bookingId);
      setError("");
      setSuccess("");

      console.log(
        "Cancelling booking:",
        bookingId
      );

      const data = await cancelBooking(bookingId);

      console.log(
        "CANCEL BOOKING RESPONSE:",
        data
      );

      setSuccess(
        data?.message ||
          "Booking cancelled successfully."
      );

      // Update booking directly in the UI
      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                status: "Cancelled",
              }
            : booking
        )
      );

      // Reload from backend to make sure
      // the latest database data is displayed
      await loadBookings();

      setTimeout(() => {
        setSuccess("");
      }, 4000);
    } catch (error) {
      console.error(
        "CANCEL BOOKING ERROR:",
        error
      );

      console.error(
        "STATUS:",
        error?.response?.status
      );

      console.error(
        "RESPONSE:",
        error?.response?.data
      );

      const backendMessage =
        error?.response?.data?.message;

      const backendError =
        error?.response?.data?.error;

      setError(
        backendMessage ||
          backendError ||
          error?.message ||
          "Unable to cancel this booking."
      );
    } finally {
      setCancellingId(null);
    }
  };

  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "Date not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date not available";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================================
  // TIME FORMAT
  // =========================================================

  const formatTime = (time) => {
    if (!time) {
      return "Time not available";
    }

    const timeString = String(time).trim();

    // Already formatted
    if (
      timeString.toLowerCase().includes("am") ||
      timeString.toLowerCase().includes("pm")
    ) {
      return timeString;
    }

    const parts = timeString.split(":");

    if (parts.length < 2) {
      return timeString;
    }

    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return timeString;
    }

    const date = new Date();

    date.setHours(
      hours,
      minutes,
      0,
      0
    );

    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    );
  };

  // =========================================================
  // STATUS HELPERS
  // =========================================================

  const isCancelled = (booking) => {
    return (
      String(booking?.status || "")
        .toLowerCase() ===
      "cancelled"
    );
  };

  const getStatusClass = (booking) => {
    return isCancelled(booking)
      ? "bg-danger-subtle text-danger"
      : "bg-success-subtle text-success";
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="bg-light min-vh-100">
        <div className="container py-5">
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "60vh" }}
          >
            <div className="text-center">
              <div
                className="spinner-border text-primary mb-4"
                style={{
                  width: "3rem",
                  height: "3rem",
                }}
                role="status"
              >
                <span className="visually-hidden">
                  Loading...
                </span>
              </div>

              <h4 className="fw-bold mb-2">
                Loading Your Bookings
              </h4>

              <p className="text-muted mb-0">
                Please wait while we fetch your
                tickets.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // BOOKING COUNTS
  // =========================================================

  const totalBookings = bookings.length;

  const confirmedBookings =
    bookings.filter(
      (booking) =>
        !isCancelled(booking)
    ).length;

  const cancelledBookings =
    bookings.filter(
      (booking) =>
        isCancelled(booking)
    ).length;

  const totalTickets =
    bookings.reduce(
      (total, booking) =>
        total +
        Number(
          booking.quantity ||
            booking.seats?.length ||
            0
        ),
      0
    );

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="bg-light min-vh-100">

      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <section className="bg-white border-bottom">
        <div className="container py-4 py-md-5">

          <div className="row align-items-center g-4">

            <div className="col-lg-8">

              <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 mb-3">
                MY ACCOUNT
              </span>

              <h1 className="fw-bold display-6 mb-2">
                My Bookings
              </h1>

              <p
                className="text-muted mb-0"
                style={{
                  maxWidth: "650px",
                  lineHeight: "1.7",
                }}
              >
                Manage your event tickets, check
                booking details, and view your
                reservations in one place.
              </p>

            </div>

            <div className="col-lg-4 text-lg-end">

              <Link
                to="/events"
                className="btn btn-primary px-4 py-2 rounded-3 fw-semibold"
              >
                Explore Events
                <span className="ms-2">
                  →
                </span>
              </Link>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}

      <div className="container py-4 py-md-5">

        {/* SUCCESS */}

        {success && (
          <div
            className="alert alert-success border-0 shadow-sm rounded-3 mb-4"
            role="alert"
          >
            <div className="d-flex align-items-center gap-2">
              <span className="fw-bold">
                ✓
              </span>

              <span>
                {success}
              </span>
            </div>
          </div>
        )}


        {/* ERROR */}

        {error && (
          <div
            className="alert alert-danger border-0 shadow-sm rounded-3 mb-4"
            role="alert"
          >
            <div className="d-flex align-items-start gap-2">

              <span className="fw-bold">
                !
              </span>

              <div>
                <div className="fw-semibold">
                  Unable to cancel booking
                </div>

                <div>
                  {error}
                </div>
              </div>

            </div>
          </div>
        )}


        {/* =====================================================
            EMPTY STATE
            ===================================================== */}

        {bookings.length === 0 ? (

          <div className="card border-0 shadow-sm rounded-4">

            <div className="card-body text-center p-5">

              <div
                className="bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                style={{
                  width: "100px",
                  height: "100px",
                  fontSize: "42px",
                }}
              >
                🎫
              </div>

              <h3 className="fw-bold mb-2">
                No Bookings Yet
              </h3>

              <p
                className="text-muted mx-auto mb-4"
                style={{
                  maxWidth: "500px",
                  lineHeight: "1.7",
                }}
              >
                You haven't booked any events
                yet. Explore our upcoming events
                and reserve your preferred seats.
              </p>

              <Link
                to="/events"
                className="btn btn-primary px-4 py-2 rounded-3 fw-semibold"
              >
                Explore Events →
              </Link>

            </div>

          </div>

        ) : (

          <>

            {/* =================================================
                STATISTICS
                ================================================= */}

            <div className="row g-3 g-md-4 mb-5">

              {/* TOTAL */}

              <div className="col-6 col-lg-3">

                <div className="card border-0 shadow-sm rounded-4 h-100">

                  <div className="card-body p-3 p-md-4">

                    <small className="text-muted d-block">
                      Total
                    </small>

                    <h3 className="fw-bold mb-0">
                      {totalBookings}
                    </h3>

                  </div>

                </div>

              </div>


              {/* CONFIRMED */}

              <div className="col-6 col-lg-3">

                <div className="card border-0 shadow-sm rounded-4 h-100">

                  <div className="card-body p-3 p-md-4">

                    <small className="text-muted d-block">
                      Confirmed
                    </small>

                    <h3 className="fw-bold text-success mb-0">
                      {confirmedBookings}
                    </h3>

                  </div>

                </div>

              </div>


              {/* CANCELLED */}

              <div className="col-6 col-lg-3">

                <div className="card border-0 shadow-sm rounded-4 h-100">

                  <div className="card-body p-3 p-md-4">

                    <small className="text-muted d-block">
                      Cancelled
                    </small>

                    <h3 className="fw-bold text-danger mb-0">
                      {cancelledBookings}
                    </h3>

                  </div>

                </div>

              </div>


              {/* TICKETS */}

              <div className="col-6 col-lg-3">

                <div className="card border-0 shadow-sm rounded-4 h-100">

                  <div className="card-body p-3 p-md-4">

                    <small className="text-muted d-block">
                      Tickets
                    </small>

                    <h3 className="fw-bold mb-0">
                      {totalTickets}
                    </h3>

                  </div>

                </div>

              </div>

            </div>


            {/* =================================================
                SECTION HEADER
                ================================================= */}

            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">

              <div>

                <h3 className="fw-bold mb-1">
                  Your Tickets
                </h3>

                <p className="text-muted mb-0">
                  All your event reservations
                </p>

              </div>

              <span className="badge bg-white text-dark border rounded-pill px-3 py-2">
                {totalBookings}{" "}
                {totalBookings === 1
                  ? "Booking"
                  : "Bookings"}
              </span>

            </div>


            {/* =================================================
                BOOKINGS
                ================================================= */}

            <div className="row g-4">

              {bookings.map((booking) => {

                const cancelled =
                  isCancelled(booking);

                const eventTitle =
                  booking.event?.title ||
                  "Event";

                const venue =
                  booking.event?.venue ||
                  "Venue not available";

                const date =
                  formatDate(
                    booking.event?.date
                  );

                const time =
                  formatTime(
                    booking.event?.time
                  );

                const seats =
                  Array.isArray(
                    booking.seats
                  )
                    ? booking.seats
                    : [];

                const quantity =
                  booking.quantity ||
                  seats.length ||
                  0;

                const amount =
                  booking.totalAmount ||
                  0;

                const isCancelling =
                  cancellingId ===
                  booking._id;

                return (
                  <div
                    className="col-md-6 col-xl-4"
                    key={booking._id}
                  >

                    <div
                      className={`card border-0 shadow-sm rounded-4 h-100 overflow-hidden ${
                        cancelled
                          ? "opacity-75"
                          : ""
                      }`}
                    >

                      {/* STATUS */}

                      <div
                        className={`p-3 px-4 ${
                          cancelled
                            ? "bg-danger-subtle"
                            : "bg-primary-subtle"
                        }`}
                      >

                        <div className="d-flex justify-content-between align-items-center">

                          <span
                            className={`badge rounded-pill px-3 py-2 ${getStatusClass(
                              booking
                            )}`}
                          >
                            {cancelled
                              ? "Cancelled"
                              : "Confirmed"}
                          </span>

                          <small className="text-muted fw-semibold">
                            #
                            {booking._id?.slice(
                              -6
                            )}
                          </small>

                        </div>

                      </div>


                      {/* CONTENT */}

                      <div className="card-body p-4">

                        <small className="text-primary fw-semibold text-uppercase">
                          Event Ticket
                        </small>

                        <h5 className="fw-bold mt-1 mb-4">
                          {eventTitle}
                        </h5>


                        {/* VENUE */}

                        <div className="mb-3">

                          <small className="text-muted d-block">
                            Venue
                          </small>

                          <span className="fw-semibold small">
                            {venue}
                          </span>

                        </div>


                        {/* DATE */}

                        <div className="mb-3">

                          <small className="text-muted d-block">
                            Date
                          </small>

                          <span className="fw-semibold small">
                            {date}
                          </span>

                        </div>


                        {/* TIME */}

                        <div className="mb-3">

                          <small className="text-muted d-block">
                            Time
                          </small>

                          <span className="fw-semibold small">
                            {time}
                          </span>

                        </div>


                        <hr />


                        {/* SEATS */}

                        <div className="mb-3">

                          <small className="text-muted d-block mb-2">
                            Selected Seats
                          </small>

                          {seats.length > 0 ? (

                            <div className="d-flex flex-wrap gap-1">

                              {seats.map(
                                (seat) => (
                                  <span
                                    key={seat}
                                    className="badge bg-light text-dark border"
                                  >
                                    {seat}
                                  </span>
                                )
                              )}

                            </div>

                          ) : (
                            <span>
                              N/A
                            </span>
                          )}

                        </div>


                        {/* QUANTITY */}

                        <div className="d-flex justify-content-between mb-3">

                          <span className="text-muted small">
                            Number of Tickets
                          </span>

                          <span className="fw-bold">
                            {quantity}
                          </span>

                        </div>


                        {/* AMOUNT */}

                        <div className="d-flex justify-content-between align-items-end mb-4">

                          <span className="text-muted small">
                            Total Amount
                          </span>

                          <h4 className="fw-bold text-success mb-0">
                            ₹{amount}
                          </h4>

                        </div>


                        {/* ACTIONS */}

                        <div className="d-flex flex-column gap-2">

                          {/* VIEW TICKET */}

                          <Link
                            to={`/booking-confirmation/${booking._id}`}
                            className={`btn btn-sm rounded-3 fw-semibold ${
                              cancelled
                                ? "btn-outline-secondary"
                                : "btn-outline-primary"
                            }`}
                          >
                            View Ticket
                          </Link>


                          {/* CANCEL */}

                          {!cancelled && (

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger rounded-3 fw-semibold"
                              onClick={() =>
                                handleCancelBooking(
                                  booking._id
                                )
                              }
                              disabled={
                                isCancelling
                              }
                            >

                              {isCancelling ? (
                                <>
                                  <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                    aria-hidden="true"
                                  />

                                  Cancelling...
                                </>
                              ) : (
                                "Cancel Booking"
                              )}

                            </button>

                          )}

                        </div>

                      </div>


                      {/* FOOTER */}

                      <div className="border-top px-4 py-3 bg-light">

                        <div className="d-flex justify-content-between">

                          <small className="text-muted">
                            Booking ID
                          </small>

                          <small className="fw-semibold">
                            {booking._id
                              ? booking._id
                                  .slice(-8)
                                  .toUpperCase()
                              : "N/A"}
                          </small>

                        </div>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>


            {/* =================================================
                BOTTOM CTA
                ================================================= */}

            <div className="card border-0 shadow-sm rounded-4 mt-5">

              <div className="card-body p-4 p-md-5">

                <div className="row align-items-center g-4">

                  <div className="col-md-8">

                    <h5 className="fw-bold mb-1">
                      Looking for another event?
                    </h5>

                    <p className="text-muted mb-0">
                      Discover more experiences and
                      book your next event with
                      EventBook.
                    </p>

                  </div>

                  <div className="col-md-4 text-md-end">

                    <Link
                      to="/events"
                      className="btn btn-primary px-4 rounded-3 fw-semibold"
                    >
                      Browse Events →
                    </Link>

                  </div>

                </div>

              </div>

            </div>

          </>
        )}

      </div>

    </div>
  );
}

export default MyBookings;