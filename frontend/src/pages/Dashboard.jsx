import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await api.get("/bookings/my");

        console.log("DASHBOARD API RESPONSE:", response.data);

        const bookingData =
          response.data?.bookings ||
          (Array.isArray(response.data)
            ? response.data
            : []);

        setBookings(bookingData);
      } catch (error) {
        console.error("DASHBOARD ERROR:", error);

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

  const confirmedBookings = bookings.filter(
    (booking) => booking.status !== "Cancelled"
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "Cancelled"
  ).length;

  return (
    <div className="bg-light min-vh-100">

      {/* ================= HEADER ================= */}
      <div className="bg-white border-bottom">

        <div className="container py-4">

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

            <div>

              <span className="badge bg-primary mb-2 px-3 py-2">
                MY ACCOUNT
              </span>

              <h2 className="fw-bold mb-1">
                Dashboard
              </h2>

              <p className="text-muted mb-0">
                Welcome back! Here's your booking overview.
              </p>

            </div>

            <Link
              to="/events"
              className="btn btn-primary px-4"
            >
              🎟️ Browse Events
            </Link>

          </div>

        </div>

      </div>


      {/* ================= MAIN CONTENT ================= */}
      <div className="container py-5">

        {/* Welcome Card */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">

          <div className="card-body p-4">

            <div className="row align-items-center">

              <div className="col-md-8">

                <h4 className="fw-bold mb-2">
                  Welcome to EventBook 👋
                </h4>

                <p className="text-muted mb-0">
                  Manage your bookings and discover exciting
                  upcoming events from your dashboard.
                </p>

              </div>

              <div className="col-md-4 text-md-end mt-3 mt-md-0">

                <div
                  className="d-inline-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-circle"
                  style={{
                    width: "75px",
                    height: "75px",
                    fontSize: "32px"
                  }}
                >
                  🎫
                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ================= STATISTICS ================= */}
        <div className="row g-4 mb-4">

          {/* Total */}
          <div className="col-md-4">

            <div className="card border-0 shadow-sm rounded-4 h-100">

              <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-center">

                  <div>

                    <p className="text-muted mb-1">
                      My Bookings
                    </p>

                    <h2 className="fw-bold mb-0">
                      {bookings.length}
                    </h2>

                    <small className="text-muted">
                      Total bookings
                    </small>

                  </div>

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

                </div>

              </div>

            </div>

          </div>


          {/* Confirmed */}
          <div className="col-md-4">

            <div className="card border-0 shadow-sm rounded-4 h-100">

              <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-center">

                  <div>

                    <p className="text-muted mb-1">
                      Confirmed
                    </p>

                    <h2 className="fw-bold text-success mb-0">
                      {confirmedBookings}
                    </h2>

                    <small className="text-muted">
                      Confirmed bookings
                    </small>

                  </div>

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

                </div>

              </div>

            </div>

          </div>


          {/* Cancelled */}
          <div className="col-md-4">

            <div className="card border-0 shadow-sm rounded-4 h-100">

              <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-center">

                  <div>

                    <p className="text-muted mb-1">
                      Cancelled
                    </p>

                    <h2 className="fw-bold text-danger mb-0">
                      {cancelledBookings}
                    </h2>

                    <small className="text-muted">
                      Cancelled bookings
                    </small>

                  </div>

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

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ================= BOOKINGS ================= */}
        <div className="card border-0 shadow-sm rounded-4">

          <div className="card-body p-0">

            {/* Header */}
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 p-4 border-bottom">

              <div>

                <h4 className="fw-bold mb-1">
                  Recent Bookings
                </h4>

                <p className="text-muted mb-0">
                  Your latest event bookings
                </p>

              </div>

              <Link
                to="/my-bookings"
                className="btn btn-outline-primary btn-sm"
              >
                View All
              </Link>

            </div>


            {/* Loading */}
            {loading && (

              <div className="text-center py-5">

                <div
                  className="spinner-border text-primary"
                  role="status"
                >
                  <span className="visually-hidden">
                    Loading...
                  </span>
                </div>

                <p className="text-muted mt-3 mb-0">
                  Loading your bookings...
                </p>

              </div>

            )}


            {/* Error */}
            {!loading && error && (

              <div className="p-4">

                <div className="alert alert-danger mb-0">
                  <strong>Unable to load bookings.</strong>
                  <br />
                  {error}
                </div>

              </div>

            )}


            {/* Empty */}
            {!loading &&
              !error &&
              bookings.length === 0 && (

                <div className="text-center py-5 px-3">

                  <div
                    className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "80px",
                      height: "80px",
                      fontSize: "35px"
                    }}
                  >
                    🎫
                  </div>

                  <h5 className="fw-bold">
                    No bookings yet
                  </h5>

                  <p className="text-muted">
                    You haven't booked any events yet.
                  </p>

                  <Link
                    to="/events"
                    className="btn btn-primary"
                  >
                    Explore Events
                  </Link>

                </div>

              )}


            {/* Booking Table */}
            {!loading &&
              !error &&
              bookings.length > 0 && (

                <div className="table-responsive">

                  <table className="table table-hover align-middle mb-0">

                    <thead className="table-light">

                      <tr>

                        <th className="px-4 py-3">
                          Event
                        </th>

                        <th>
                          Seats
                        </th>

                        <th>
                          Tickets
                        </th>

                        <th>
                          Amount
                        </th>

                        <th className="pe-4">
                          Status
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {bookings
                        .slice(0, 5)
                        .map((booking) => (

                          <tr key={booking._id}>

                            <td className="px-4">

                              <div className="fw-semibold">
                                {booking.event?.title ||
                                  "Event"}
                              </div>

                              <small className="text-muted">
                                Booking #
                                {booking._id
                                  ? booking._id.slice(-6)
                                  : "N/A"}
                              </small>

                            </td>

                            <td>
                              {booking.seats?.join(", ") ||
                                "N/A"}
                            </td>

                            <td>
                              {booking.quantity ||
                                booking.seats?.length ||
                                0}
                            </td>

                            <td className="fw-bold">
                              ₹{booking.totalAmount || 0}
                            </td>

                            <td className="pe-4">

                              <span
                                className={`badge rounded-pill px-3 py-2 ${
                                  booking.status ===
                                  "Cancelled"
                                    ? "bg-danger"
                                    : "bg-success"
                                }`}
                              >
                                {booking.status ||
                                  "Confirmed"}
                              </span>

                            </td>

                          </tr>

                        ))}

                    </tbody>

                  </table>

                </div>

              )}

          </div>

        </div>


        {/* ================= QUICK ACTIONS ================= */}
        <div className="row g-4 mt-2">

          <div className="col-md-6">

            <div className="card border-0 shadow-sm rounded-4 h-100">

              <div className="card-body p-4">

                <h5 className="fw-bold mb-2">
                  🎫 My Bookings
                </h5>

                <p className="text-muted">
                  View and manage all your event bookings.
                </p>

                <Link
                  to="/my-bookings"
                  className="btn btn-outline-primary btn-sm"
                >
                  View Bookings
                </Link>

              </div>

            </div>

          </div>


          <div className="col-md-6">

            <div className="card border-0 shadow-sm rounded-4 h-100">

              <div className="card-body p-4">

                <h5 className="fw-bold mb-2">
                  🔍 Discover Events
                </h5>

                <p className="text-muted">
                  Find exciting events and book your seats.
                </p>

                <Link
                  to="/events"
                  className="btn btn-primary btn-sm"
                >
                  Explore Events
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

