import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyBookings } from "../services/bookingService";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await getMyBookings();

        setBookings(data.bookings || []);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Unable to load your bookings."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  /* =====================================================
     DATE FORMAT
     ===================================================== */
  const formatDate = (date) => {
    if (!date) return "Date not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date not available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* =====================================================
     TIME FORMAT
     ===================================================== */
  const formatTime = (time) => {
    if (!time) return "Time not available";

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

    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  /* =====================================================
     STATUS HELPERS
     ===================================================== */
  const isCancelled = (booking) => {
    return booking.status?.toLowerCase() === "cancelled";
  };

  const getStatusClass = (booking) => {
    return isCancelled(booking)
      ? "bg-danger-subtle text-danger"
      : "bg-success-subtle text-success";
  };

  /* =====================================================
     LOADING
     ===================================================== */
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
                Please wait while we fetch your tickets.
              </p>

            </div>
          </div>

        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR
     ===================================================== */
  if (error) {
    return (
      <div className="bg-light min-vh-100">

        <div className="container py-5">

          <div
            className="card border-0 shadow-sm rounded-4 mx-auto"
            style={{ maxWidth: "650px" }}
          >

            <div className="card-body text-center p-5">

              <div
                className="bg-danger-subtle text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                style={{
                  width: "80px",
                  height: "80px",
                  fontSize: "34px",
                }}
              >
                !
              </div>

              <h3 className="fw-bold mb-2">
                Unable to Load Bookings
              </h3>

              <p className="text-muted mb-4">
                {error}
              </p>

              <Link
                to="/events"
                className="btn btn-primary px-4"
              >
                Browse Events
              </Link>

            </div>

          </div>

        </div>

      </div>
    );
  }

  /* =====================================================
     BOOKING COUNTS
     ===================================================== */
  const totalBookings = bookings.length;

  const confirmedBookings = bookings.filter(
    (booking) => !isCancelled(booking)
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => isCancelled(booking)
  ).length;

  const totalTickets = bookings.reduce(
    (total, booking) =>
      total +
      (booking.quantity ||
        booking.seats?.length ||
        0),
    0
  );

  return (
    <div className="bg-light min-vh-100">

      {/* =====================================================
          PAGE HEADER
          ===================================================== */}
      <section className="bg-white border-bottom">

        <div className="container py-4 py-md-5">

          <div className="row align-items-center g-4">

            {/* Header Content */}
            <div className="col-lg-8">

              <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 mb-3">
                🎫 MY ACCOUNT
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
                Manage your event tickets, check booking
                details, and view your reservations in one place.
              </p>

            </div>

            {/* Header Button */}
            <div className="col-lg-4 text-lg-end">

              <Link
                to="/events"
                className="btn btn-primary px-4 py-2 rounded-3 fw-semibold"
              >
                Explore Events
                <span className="ms-2">→</span>
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}
      <div className="container py-4 py-md-5">

        {/* =====================================================
            STATISTICS
            ===================================================== */}
        {bookings.length > 0 && (
          <div className="row g-3 g-md-4 mb-5">

            {/* Total */}
            <div className="col-6 col-lg-3">

              <div className="card border-0 shadow-sm rounded-4 h-100">

                <div className="card-body p-3 p-md-4">

                  <div className="d-flex align-items-center gap-3">

                    <div
                      className="bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: "52px",
                        height: "52px",
                        fontSize: "23px",
                      }}
                    >
                      🎫
                    </div>

                    <div>
                      <small className="text-muted d-block">
                        Total
                      </small>

                      <h3 className="fw-bold mb-0">
                        {totalBookings}
                      </h3>
                    </div>

                  </div>

                </div>

              </div>

            </div>


            {/* Confirmed */}
            <div className="col-6 col-lg-3">

              <div className="card border-0 shadow-sm rounded-4 h-100">

                <div className="card-body p-3 p-md-4">

                  <div className="d-flex align-items-center gap-3">

                    <div
                      className="bg-success-subtle text-success rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: "52px",
                        height: "52px",
                        fontSize: "23px",
                      }}
                    >
                      ✓
                    </div>

                    <div>
                      <small className="text-muted d-block">
                        Confirmed
                      </small>

                      <h3 className="fw-bold mb-0">
                        {confirmedBookings}
                      </h3>
                    </div>

                  </div>

                </div>

              </div>

            </div>


            {/* Cancelled */}
            <div className="col-6 col-lg-3">

              <div className="card border-0 shadow-sm rounded-4 h-100">

                <div className="card-body p-3 p-md-4">

                  <div className="d-flex align-items-center gap-3">

                    <div
                      className="bg-danger-subtle text-danger rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: "52px",
                        height: "52px",
                        fontSize: "23px",
                      }}
                    >
                      ✕
                    </div>

                    <div>
                      <small className="text-muted d-block">
                        Cancelled
                      </small>

                      <h3 className="fw-bold mb-0">
                        {cancelledBookings}
                      </h3>
                    </div>

                  </div>

                </div>

              </div>

            </div>


            {/* Tickets */}
            <div className="col-6 col-lg-3">

              <div className="card border-0 shadow-sm rounded-4 h-100">

                <div className="card-body p-3 p-md-4">

                  <div className="d-flex align-items-center gap-3">

                    <div
                      className="bg-warning-subtle text-warning rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: "52px",
                        height: "52px",
                        fontSize: "23px",
                      }}
                    >
                      🎟️
                    </div>

                    <div>
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

            </div>

          </div>
        )}


        {/* =====================================================
            EMPTY STATE
            ===================================================== */}
        {bookings.length === 0 ? (

          <div
            className="card border-0 shadow-sm rounded-4"
          >

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
                You haven't booked any events yet.
                Explore our upcoming events and reserve
                your preferred seats.
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

              <div>
                <span className="badge bg-white text-dark border rounded-pill px-3 py-2">
                  {totalBookings}{" "}
                  {totalBookings === 1
                    ? "Booking"
                    : "Bookings"}
                </span>
              </div>

            </div>


            {/* =================================================
                BOOKINGS GRID
                ================================================= */}
            <div className="row g-4">

              {bookings.map((booking) => {

                const cancelled = isCancelled(booking);

                const eventTitle =
                  booking.event?.title || "Event";

                const venue =
                  booking.event?.venue || "Venue not available";

                const date =
                  formatDate(booking.event?.date);

                const time =
                  formatTime(booking.event?.time);

                const seats =
                  booking.seats || [];

                const quantity =
                  booking.quantity ||
                  seats.length ||
                  0;

                const amount =
                  booking.totalAmount || 0;

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

                      {/* =========================================
                          EVENT TOP
                          ========================================= */}
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
                              ? "✕ Cancelled"
                              : "✓ Confirmed"}
                          </span>

                          <small className="text-muted fw-semibold">
                            #{booking._id?.slice(-6)}
                          </small>

                        </div>

                      </div>


                      {/* =========================================
                          EVENT CONTENT
                          ========================================= */}
                      <div className="card-body p-4">

                        {/* Event Title */}
                        <div className="mb-4">

                          <small className="text-primary fw-semibold text-uppercase">
                            Event Ticket
                          </small>

                          <h5 className="fw-bold mt-1 mb-0">
                            {eventTitle}
                          </h5>

                        </div>


                        {/* =======================================
                            EVENT DETAILS
                            ======================================= */}
                        <div className="mb-4">

                          {/* Venue */}
                          <div className="d-flex align-items-start gap-3 mb-3">

                            <div
                              className="bg-light rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                              style={{
                                width: "38px",
                                height: "38px",
                              }}
                            >
                              📍
                            </div>

                            <div className="min-w-0">

                              <small className="text-muted d-block">
                                Venue
                              </small>

                              <span className="fw-semibold small">
                                {venue}
                              </span>

                            </div>

                          </div>


                          {/* Date */}
                          <div className="d-flex align-items-start gap-3 mb-3">

                            <div
                              className="bg-light rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                              style={{
                                width: "38px",
                                height: "38px",
                              }}
                            >
                              📅
                            </div>

                            <div>

                              <small className="text-muted d-block">
                                Date
                              </small>

                              <span className="fw-semibold small">
                                {date}
                              </span>

                            </div>

                          </div>


                          {/* Time */}
                          <div className="d-flex align-items-start gap-3">

                            <div
                              className="bg-light rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                              style={{
                                width: "38px",
                                height: "38px",
                              }}
                            >
                              🕐
                            </div>

                            <div>

                              <small className="text-muted d-block">
                                Time
                              </small>

                              <span className="fw-semibold small">
                                {time}
                              </span>

                            </div>

                          </div>

                        </div>


                        <hr className="my-4" />


                        {/* =======================================
                            BOOKING DETAILS
                            ======================================= */}
                        <div className="mb-4">

                          <div className="d-flex justify-content-between align-items-center mb-3">

                            <span className="text-muted small">
                              Selected Seats
                            </span>

                            <div className="text-end">

                              {seats.length > 0 ? (

                                <div className="d-flex flex-wrap justify-content-end gap-1">

                                  {seats.map((seat) => (
                                    <span
                                      key={seat}
                                      className="badge bg-light text-dark border"
                                    >
                                      {seat}
                                    </span>
                                  ))}

                                </div>

                              ) : (
                                <span className="fw-semibold">
                                  N/A
                                </span>
                              )}

                            </div>

                          </div>


                          <div className="d-flex justify-content-between align-items-center">

                            <span className="text-muted small">
                              Number of Tickets
                            </span>

                            <span className="fw-bold">
                              {quantity}
                            </span>

                          </div>

                        </div>


                        {/* =======================================
                            TOTAL + ACTION
                            ======================================= */}
                        <div className="border-top pt-3">

                          <div className="d-flex justify-content-between align-items-end gap-3">

                            <div>

                              <small className="text-muted d-block mb-1">
                                Total Amount
                              </small>

                              <h4 className="fw-bold text-success mb-0">
                                ₹{amount}
                              </h4>

                            </div>

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

                          </div>

                        </div>

                      </div>


                      {/* =========================================
                          TICKET FOOTER
                          ========================================= */}
                      <div className="border-top px-4 py-3 bg-light">

                        <div className="d-flex justify-content-between align-items-center">

                          <small className="text-muted">
                            Booking ID
                          </small>

                          <small className="fw-semibold text-dark">
                            {booking._id
                              ? booking._id.slice(-8).toUpperCase()
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

                    <div className="d-flex align-items-start gap-3">

                      <div
                        className="bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: "50px",
                          height: "50px",
                          fontSize: "22px",
                        }}
                      >
                        🎉
                      </div>

                      <div>

                        <h5 className="fw-bold mb-1">
                          Looking for another event?
                        </h5>

                        <p className="text-muted mb-0">
                          Discover more experiences and book
                          your next event with EventBook.
                        </p>

                      </div>

                    </div>

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

