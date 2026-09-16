
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     LOAD BOOKINGS
     ===================================================== */
  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await api.get("/bookings/my");

        console.log(
          "DASHBOARD API RESPONSE:",
          response.data
        );

        const bookingData =
          response.data?.bookings ||
          (Array.isArray(response.data)
            ? response.data
            : []);

        setBookings(bookingData);
        setError("");
      } catch (error) {
        console.error(
          "DASHBOARD ERROR:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load your bookings."
        );

        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  /* =====================================================
     BOOKING STATISTICS
     ===================================================== */
  const confirmedBookings = bookings.filter(
    (booking) =>
      booking.status?.toLowerCase() !== "cancelled"
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) =>
      booking.status?.toLowerCase() === "cancelled"
  ).length;

  const totalTickets = bookings.reduce(
    (total, booking) =>
      total +
      (booking.quantity ||
        booking.seats?.length ||
        0),
    0
  );

  const totalSpent = bookings.reduce(
    (total, booking) =>
      total + Number(booking.totalAmount || 0),
    0
  );

  /* =====================================================
     DATE FORMAT
     ===================================================== */
  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
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
    if (!time) return "Time unavailable";

    const timeString = String(time).trim();

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
      Number.isNaN(minutes)
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
     STATUS
     ===================================================== */
  const isCancelled = (booking) => {
    return (
      booking.status?.toLowerCase() ===
      "cancelled"
    );
  };

  return (
    <div className="bg-light min-vh-100">

      {/* =================================================
          HEADER / HERO
          ================================================= */}
      <section className="bg-white border-bottom">

        <div className="container py-4 py-md-5">

          <div className="row align-items-center g-4">

            {/* Left */}
            <div className="col-lg-8">

              <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 mb-3">
                ✨ MY ACCOUNT
              </span>

              <h1 className="fw-bold display-6 mb-2">
                Welcome Back! 👋
              </h1>

              <p
                className="text-muted mb-0"
                style={{
                  maxWidth: "650px",
                  lineHeight: "1.7",
                }}
              >
                Manage your bookings, check your tickets,
                and discover your next unforgettable event.
              </p>

            </div>

            {/* Right */}
            <div className="col-lg-4 text-lg-end">

              <Link
                to="/events"
                className="btn btn-primary btn-lg px-4 rounded-3 fw-semibold shadow-sm"
              >
                🎟️ Explore Events
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          MAIN CONTENT
          ================================================= */}
      <div className="container py-4 py-md-5">

        {/* =================================================
            WELCOME CARD
            ================================================= */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">

          <div className="row g-0 align-items-center">

            <div className="col-lg-8">

              <div className="card-body p-4 p-md-5">

                <span className="text-primary fw-semibold small text-uppercase">
                  Your EventBook Dashboard
                </span>

                <h3 className="fw-bold mt-2 mb-3">
                  Everything in one place.
                </h3>

                <p
                  className="text-muted mb-4"
                  style={{
                    maxWidth: "600px",
                    lineHeight: "1.7",
                  }}
                >
                  Keep track of your event reservations,
                  tickets and booking history. Ready to
                  discover something new?
                </p>

                <Link
                  to="/events"
                  className="btn btn-outline-primary rounded-3 px-4"
                >
                  Find an Event →
                </Link>

              </div>

            </div>

            <div className="col-lg-4">

              <div
                className="bg-primary text-white h-100 d-flex align-items-center justify-content-center p-5"
                style={{
                  minHeight: "190px",
                }}
              >

                <div className="text-center">

                  <div
                    className="bg-white text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "80px",
                      height: "80px",
                      fontSize: "34px",
                    }}
                  >
                    🎫
                  </div>

                  <h5 className="fw-bold mb-1">
                    Your Tickets
                  </h5>

                  <small className="opacity-75">
                    Ready when you are
                  </small>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            STATISTICS
            ================================================= */}
        <div className="row g-3 g-md-4 mb-4">

          {/* Total Bookings */}
          <div className="col-6 col-lg-3">

            <div className="card border-0 shadow-sm rounded-4 h-100">

              <div className="card-body p-3 p-md-4">

                <div className="d-flex justify-content-between align-items-start gap-2">

                  <div>

                    <small className="text-muted d-block mb-1">
                      Bookings
                    </small>

                    <h2 className="fw-bold mb-1">
                      {bookings.length}
                    </h2>

                    <small className="text-muted">
                      Total reservations
                    </small>

                  </div>

                  <div
                    className="bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "48px",
                      height: "48px",
                      fontSize: "21px",
                    }}
                  >
                    🎫
                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* Confirmed */}
          <div className="col-6 col-lg-3">

            <div className="card border-0 shadow-sm rounded-4 h-100">

              <div className="card-body p-3 p-md-4">

                <div className="d-flex justify-content-between align-items-start gap-2">

                  <div>

                    <small className="text-muted d-block mb-1">
                      Confirmed
                    </small>

                    <h2 className="fw-bold text-success mb-1">
                      {confirmedBookings}
                    </h2>

                    <small className="text-muted">
                      Active bookings
                    </small>

                  </div>

                  <div
                    className="bg-success-subtle text-success rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "48px",
                      height: "48px",
                      fontSize: "21px",
                    }}
                  >
                    ✓
                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* Tickets */}
          <div className="col-6 col-lg-3">

            <div className="card border-0 shadow-sm rounded-4 h-100">

              <div className="card-body p-3 p-md-4">

                <div className="d-flex justify-content-between align-items-start gap-2">

                  <div>

                    <small className="text-muted d-block mb-1">
                      Tickets
                    </small>

                    <h2 className="fw-bold text-warning mb-1">
                      {totalTickets}
                    </h2>

                    <small className="text-muted">
                      Tickets booked
                    </small>

                  </div>

                  <div
                    className="bg-warning-subtle text-warning rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "48px",
                      height: "48px",
                      fontSize: "21px",
                    }}
                  >
                    🎟️
                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* Cancelled */}
          <div className="col-6 col-lg-3">

            <div className="card border-0 shadow-sm rounded-4 h-100">

              <div className="card-body p-3 p-md-4">

                <div className="d-flex justify-content-between align-items-start gap-2">

                  <div>

                    <small className="text-muted d-block mb-1">
                      Cancelled
                    </small>

                    <h2 className="fw-bold text-danger mb-1">
                      {cancelledBookings}
                    </h2>

                    <small className="text-muted">
                      Cancelled bookings
                    </small>

                  </div>

                  <div
                    className="bg-danger-subtle text-danger rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "48px",
                      height: "48px",
                      fontSize: "21px",
                    }}
                  >
                    ✕
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            BOOKING SUMMARY
            ================================================= */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">

          <div className="card-body p-4">

            <div className="row align-items-center g-4">

              <div className="col-md-7">

                <div className="d-flex align-items-center gap-3">

                  <div
                    className="bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "52px",
                      height: "52px",
                      fontSize: "23px",
                    }}
                  >
                    💳
                  </div>

                  <div>

                    <small className="text-muted d-block">
                      Booking Summary
                    </small>

                    <h5 className="fw-bold mb-0">
                      Your EventBook Activity
                    </h5>

                  </div>

                </div>

              </div>

              <div className="col-md-5">

                <div className="d-flex justify-content-md-end gap-4">

                  <div>
                    <small className="text-muted d-block">
                      Total Spent
                    </small>

                    <h5 className="fw-bold text-success mb-0">
                      ₹{totalSpent}
                    </h5>
                  </div>

                  <div>
                    <small className="text-muted d-block">
                      Tickets
                    </small>

                    <h5 className="fw-bold mb-0">
                      {totalTickets}
                    </h5>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            RECENT BOOKINGS
            ================================================= */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">

          {/* Header */}
          <div className="card-body p-4 border-bottom">

            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">

              <div>

                <span className="text-primary fw-semibold small text-uppercase">
                  Activity
                </span>

                <h4 className="fw-bold mt-1 mb-1">
                  Recent Bookings
                </h4>

                <p className="text-muted mb-0">
                  Your latest event reservations
                </p>

              </div>

              <Link
                to="/my-bookings"
                className="btn btn-outline-primary btn-sm rounded-3 px-3"
              >
                View All →
              </Link>

            </div>

          </div>


          {/* =================================================
              LOADING
              ================================================= */}
          {loading && (

            <div className="text-center py-5 px-3">

              <div
                className="spinner-border text-primary mb-3"
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                }}
                role="status"
              >
                <span className="visually-hidden">
                  Loading...
                </span>
              </div>

              <h6 className="fw-bold">
                Loading your bookings
              </h6>

              <p className="text-muted small mb-0">
                Please wait while we fetch your latest tickets.
              </p>

            </div>

          )}


          {/* =================================================
              ERROR
              ================================================= */}
          {!loading && error && (

            <div className="p-4">

              <div className="alert alert-danger rounded-3 mb-0">

                <div className="fw-bold mb-1">
                  Unable to load bookings
                </div>

                <small>
                  {error}
                </small>

              </div>

            </div>

          )}


          {/* =================================================
              EMPTY STATE
              ================================================= */}
          {!loading &&
            !error &&
            bookings.length === 0 && (

              <div className="text-center py-5 px-4">

                <div
                  className="bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "90px",
                    height: "90px",
                    fontSize: "38px",
                  }}
                >
                  🎫
                </div>

                <h4 className="fw-bold mb-2">
                  No Bookings Yet
                </h4>

                <p
                  className="text-muted mx-auto mb-4"
                  style={{
                    maxWidth: "500px",
                  }}
                >
                  You haven't booked any events yet.
                  Discover exciting experiences and reserve
                  your seats today.
                </p>

                <Link
                  to="/events"
                  className="btn btn-primary px-4 rounded-3"
                >
                  Explore Events →
                </Link>

              </div>

            )}


          {/* =================================================
              BOOKINGS
              ================================================= */}
          {!loading &&
            !error &&
            bookings.length > 0 && (

              <div>

                {bookings.slice(0, 5).map((booking) => {

                  const cancelled =
                    isCancelled(booking);

                  const eventTitle =
                    booking.event?.title ||
                    "Event";

                  const venue =
                    booking.event?.venue ||
                    "Venue unavailable";

                  const eventDate =
                    formatDate(
                      booking.event?.date
                    );

                  const eventTime =
                    formatTime(
                      booking.event?.time
                    );

                  const seats =
                    booking.seats || [];

                  const ticketCount =
                    booking.quantity ||
                    seats.length ||
                    0;

                  const amount =
                    booking.totalAmount || 0;

                  return (
                    <div
                      key={booking._id}
                      className="border-bottom"
                    >

                      <div className="p-4">

                        <div className="row align-items-center g-4">

                          {/* Event */}
                          <div className="col-lg-4">

                            <div className="d-flex align-items-start gap-3">

                              <div
                                className={`rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 ${
                                  cancelled
                                    ? "bg-danger-subtle text-danger"
                                    : "bg-primary-subtle text-primary"
                                }`}
                                style={{
                                  width: "48px",
                                  height: "48px",
                                  fontSize: "21px",
                                }}
                              >
                                🎫
                              </div>

                              <div className="min-w-0">

                                <small className="text-muted d-block">
                                  Event
                                </small>

                                <h6
                                  className="fw-bold mb-1 text-truncate"
                                  title={eventTitle}
                                >
                                  {eventTitle}
                                </h6>

                                <small className="text-muted">
                                  Booking #
                                  {booking._id
                                    ? booking._id.slice(-6)
                                    : "N/A"}
                                </small>

                              </div>

                            </div>

                          </div>


                          {/* Event Details */}
                          <div className="col-sm-6 col-lg-3">

                            <div className="mb-2">

                              <small className="text-muted d-block">
                                📅 Date
                              </small>

                              <span className="fw-semibold small">
                                {eventDate}
                              </span>

                            </div>

                            <div>

                              <small className="text-muted d-block">
                                🕐 Time
                              </small>

                              <span className="fw-semibold small">
                                {eventTime}
                              </span>

                            </div>

                          </div>


                          {/* Booking Info */}
                          <div className="col-sm-6 col-lg-2">

                            <div className="mb-2">

                              <small className="text-muted d-block">
                                💺 Seats
                              </small>

                              <span className="fw-semibold small">
                                {seats.length > 0
                                  ? seats.join(", ")
                                  : "N/A"}
                              </span>

                            </div>

                            <div>

                              <small className="text-muted d-block">
                                🎟️ Tickets
                              </small>

                              <span className="fw-bold">
                                {ticketCount}
                              </span>

                            </div>

                          </div>


                          {/* Amount + Status */}
                          <div className="col-lg-3">

                            <div className="d-flex flex-column flex-sm-row flex-lg-column justify-content-between align-items-sm-center align-items-lg-end gap-3">

                              <div className="text-lg-end">

                                <small className="text-muted d-block">
                                  Total
                                </small>

                                <h5 className="fw-bold text-success mb-1">
                                  ₹{amount}
                                </h5>

                                <span
                                  className={`badge rounded-pill px-3 py-2 ${
                                    cancelled
                                      ? "bg-danger-subtle text-danger"
                                      : "bg-success-subtle text-success"
                                  }`}
                                >
                                  {cancelled
                                    ? "✕ Cancelled"
                                    : "✓ Confirmed"}
                                </span>

                              </div>

                              <Link
                                to={`/booking-confirmation/${booking._id}`}
                                className={`btn btn-sm rounded-3 ${
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

                        {/* Venue */}
                        <div className="mt-3 pt-3 border-top">

                          <small className="text-muted">
                            📍 {venue}
                          </small>

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>

            )}

        </div>


        {/* =================================================
            QUICK ACTIONS
            ================================================= */}
        <div className="row g-4 mt-2">

          {/* My Bookings */}
          <div className="col-md-6">

            <div className="card border-0 shadow-sm rounded-4 h-100">

              <div className="card-body p-4">

                <div className="d-flex align-items-start gap-3">

                  <div
                    className="bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "50px",
                      height: "50px",
                      fontSize: "22px",
                    }}
                  >
                    🎫
                  </div>

                  <div>

                    <h5 className="fw-bold mb-2">
                      Manage My Bookings
                    </h5>

                    <p className="text-muted small mb-3">
                      View all your bookings, ticket details,
                      seats and reservation history.
                    </p>

                    <Link
                      to="/my-bookings"
                      className="btn btn-outline-primary btn-sm rounded-3"
                    >
                      View My Bookings →
                    </Link>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* Explore */}
          <div className="col-md-6">

            <div className="card border-0 shadow-sm rounded-4 h-100">

              <div className="card-body p-4">

                <div className="d-flex align-items-start gap-3">

                  <div
                    className="bg-success-subtle text-success rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "50px",
                      height: "50px",
                      fontSize: "22px",
                    }}
                  >
                    🔎
                  </div>

                  <div>

                    <h5 className="fw-bold mb-2">
                      Discover New Events
                    </h5>

                    <p className="text-muted small mb-3">
                      Explore upcoming events and choose
                      your preferred seats.
                    </p>

                    <Link
                      to="/events"
                      className="btn btn-primary btn-sm rounded-3"
                    >
                      Explore Events →
                    </Link>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            FINAL CTA
            ================================================= */}
        <div className="card border-0 shadow-sm rounded-4 bg-primary text-white mt-4 overflow-hidden">

          <div className="card-body p-4 p-md-5">

            <div className="row align-items-center g-4">

              <div className="col-md-8">

                <h4 className="fw-bold mb-2">
                  Ready for your next experience? 🎉
                </h4>

                <p className="opacity-75 mb-0">
                  Find an event, choose your seats,
                  and make your next memory with EventBook.
                </p>

              </div>

              <div className="col-md-4 text-md-end">

                <Link
                  to="/events"
                  className="btn btn-light px-4 py-2 rounded-3 fw-semibold"
                >
                  Browse Events →
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;
