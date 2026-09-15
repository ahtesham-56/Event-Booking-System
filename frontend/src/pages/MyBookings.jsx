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
            "Unable to load bookings."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  /* ================= DATE FORMAT ================= */
  const formatDate = (date) => {
    if (!date) return "Date not available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* ================= TIME FORMAT ================= */
  const formatTime = (time) => {
    if (!time) return "Time not available";

    // If time is already like "6:30 PM"
    if (
      time.toLowerCase().includes("am") ||
      time.toLowerCase().includes("pm")
    ) {
      return time;
    }

    // If time is like "18:30"
    const [hours, minutes] = time.split(":");

    if (hours === undefined || minutes === undefined) {
      return time;
    }

    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="bg-light min-vh-100">
        <div className="container py-5">
          <div className="text-center py-5">

            <div
              className="spinner-border text-primary mb-3"
              role="status"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <h5 className="fw-bold">
              Loading Your Bookings
            </h5>

            <p className="text-muted mb-0">
              Please wait while we fetch your bookings.
            </p>

          </div>
        </div>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="bg-light min-vh-100">
        <div className="container py-5">

          <div className="card border-0 shadow-sm rounded-4">

            <div className="card-body text-center py-5">

              <div className="fs-1 mb-3">
                ⚠️
              </div>

              <h4 className="fw-bold text-danger">
                Unable to Load Bookings
              </h4>

              <p className="text-muted mb-0">
                {error}
              </p>

            </div>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">

      {/* ================= HEADER ================= */}
      <section className="bg-white border-bottom">

        <div className="container py-5">

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

            <div>

              <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill mb-3">
                🎫 MY ACCOUNT
              </span>

              <h1 className="fw-bold mb-2">
                My Bookings
              </h1>

              <p className="text-muted mb-0">
                View and manage your upcoming and previous event bookings.
              </p>

            </div>

            <Link
              to="/events"
              className="btn btn-primary px-4"
            >
              Browse Events →
            </Link>

          </div>

        </div>

      </section>

      {/* ================= CONTENT ================= */}
      <div className="container py-5">

        {/* Summary */}
        {bookings.length > 0 && (
          <div className="row g-4 mb-5">

            <div className="col-md-4">

              <div className="card border-0 shadow-sm rounded-4 h-100">

                <div className="card-body p-4">

                  <div className="d-flex align-items-center gap-3">

                    <div
                      className="bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: "55px",
                        height: "55px",
                        fontSize: "25px"
                      }}
                    >
                      🎫
                    </div>

                    <div>
                      <small className="text-muted">
                        Total Bookings
                      </small>

                      <h3 className="fw-bold mb-0">
                        {bookings.length}
                      </h3>
                    </div>

                  </div>

                </div>

              </div>

            </div>

            <div className="col-md-4">

              <div className="card border-0 shadow-sm rounded-4 h-100">

                <div className="card-body p-4">

                  <div className="d-flex align-items-center gap-3">

                    <div
                      className="bg-success-subtle text-success rounded-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: "55px",
                        height: "55px",
                        fontSize: "25px"
                      }}
                    >
                      ✓
                    </div>

                    <div>

                      <small className="text-muted">
                        Confirmed
                      </small>

                      <h3 className="fw-bold mb-0">
                        {
                          bookings.filter(
                            (booking) =>
                              booking.status !== "Cancelled"
                          ).length
                        }
                      </h3>

                    </div>

                  </div>

                </div>

              </div>

            </div>

            <div className="col-md-4">

              <div className="card border-0 shadow-sm rounded-4 h-100">

                <div className="card-body p-4">

                  <div className="d-flex align-items-center gap-3">

                    <div
                      className="bg-danger-subtle text-danger rounded-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: "55px",
                        height: "55px",
                        fontSize: "25px"
                      }}
                    >
                      ✕
                    </div>

                    <div>

                      <small className="text-muted">
                        Cancelled
                      </small>

                      <h3 className="fw-bold mb-0">
                        {
                          bookings.filter(
                            (booking) =>
                              booking.status === "Cancelled"
                          ).length
                        }
                      </h3>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* ================= EMPTY STATE ================= */}
        {bookings.length === 0 ? (

          <div className="card border-0 shadow-sm rounded-4">

            <div className="card-body text-center py-5">

              <div
                className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                style={{
                  width: "90px",
                  height: "90px",
                  fontSize: "40px"
                }}
              >
                🎫
              </div>

              <h4 className="fw-bold mb-2">
                No Bookings Yet
              </h4>

              <p className="text-muted mb-4">
                You haven't booked any events yet.
                Discover an event and reserve your seats today.
              </p>

              <Link
                to="/events"
                className="btn btn-primary px-4"
              >
                Explore Events
              </Link>

            </div>

          </div>

        ) : (

          /* ================= BOOKINGS ================= */
          <>

            <div className="d-flex justify-content-between align-items-center mb-4">

              <div>

                <h4 className="fw-bold mb-1">
                  Your Bookings
                </h4>

                <p className="text-muted mb-0">
                  All your event reservations
                </p>

              </div>

              <span className="badge bg-white text-dark border px-3 py-2">
                {bookings.length}{" "}
                {bookings.length === 1
                  ? "Booking"
                  : "Bookings"}
              </span>

            </div>

            <div className="row g-4">

              {bookings.map((booking) => (

                <div
                  className="col-md-6 col-xl-4"
                  key={booking._id}
                >

                  <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">

                    {/* Top Section */}
                    <div className="card-body p-4">

                      <div className="d-flex justify-content-between align-items-center mb-4">

                        <span
                          className={`badge rounded-pill px-3 py-2 ${
                            booking.status === "Cancelled"
                              ? "bg-danger-subtle text-danger"
                              : "bg-success-subtle text-success"
                          }`}
                        >
                          {booking.status === "Cancelled"
                            ? "✕ Cancelled"
                            : "✓ Confirmed"}
                        </span>

                        <small className="text-muted">
                          #{booking._id?.slice(-6)}
                        </small>

                      </div>

                      {/* Event */}
                      <h5 className="fw-bold mb-3">
                        {booking.event?.title || "Event"}
                      </h5>

                      {/* Event Details */}
                      <div className="mb-3">

                        {/* Venue */}
                        <div className="d-flex gap-2 mb-2">

                          <span>📍</span>

                          <span className="text-muted">
                            {booking.event?.venue || "Venue"}
                          </span>

                        </div>

                        {/* Date */}
                        <div className="d-flex gap-2 mb-2">

                          <span>📅</span>

                          <span className="text-muted">
                            {formatDate(booking.event?.date)}
                          </span>

                        </div>

                        {/* Time */}
                        <div className="d-flex gap-2">

                          <span>🕐</span>

                          <span className="text-muted">
                            {formatTime(booking.event?.time)}
                          </span>

                        </div>

                      </div>

                      <hr />

                      {/* Booking Information */}
                      <div className="mb-4">

                        <div className="d-flex justify-content-between mb-2">

                          <span className="text-muted">
                            Seats
                          </span>

                          <strong className="text-end">
                            {booking.seats?.join(", ") || "N/A"}
                          </strong>

                        </div>

                        <div className="d-flex justify-content-between">

                          <span className="text-muted">
                            Tickets
                          </span>

                          <strong>
                            {booking.quantity ||
                              booking.seats?.length ||
                              0}
                          </strong>

                        </div>

                      </div>

                      {/* Bottom */}
                      <div className="d-flex justify-content-between align-items-center">

                        <div>

                          <small className="text-muted d-block">
                            Total Amount
                          </small>

                          <h5 className="fw-bold text-success mb-0">
                            ₹{booking.totalAmount || 0}
                          </h5>

                        </div>

                        <Link
                          to={`/booking-confirmation/${booking._id}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          View Booking
                        </Link>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </>
        )}

      </div>

    </div>
  );
}

export default MyBookings;

