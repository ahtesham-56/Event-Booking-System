
import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="container-fluid py-4 px-3 px-md-4">

      {/* ================= HEADER ================= */}
      <div className="mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span
                className="badge bg-primary bg-opacity-10 text-primary px-3 py-2"
                style={{ fontSize: "12px" }}
              >
                ADMIN PANEL
              </span>

              <span className="text-muted small">
                Event Booking System
              </span>
            </div>

            <h2 className="fw-bold mb-1">
              Admin Dashboard
            </h2>

            <p className="text-muted mb-0">
              Manage your events and keep your booking platform organized.
            </p>
          </div>

          <Link
            to="/admin/events/add"
            className="btn btn-primary px-4 py-2 shadow-sm"
          >
            + Create Event
          </Link>

        </div>
      </div>

      {/* ================= WELCOME CARD ================= */}
      <div
        className="card border-0 shadow-sm mb-4 overflow-hidden"
        style={{
          borderRadius: "16px",
        }}
      >
        <div className="card-body p-4 p-md-5">

          <div className="row align-items-center">

            <div className="col-lg-8">

              <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 mb-3">
                ● System Active
              </span>

              <h3 className="fw-bold mb-2">
                Welcome back, Admin! 👋
              </h3>

              <p className="text-muted mb-0">
                From here you can create new events, manage existing
                events and keep track of your event booking system.
              </p>

            </div>

            <div className="col-lg-4 mt-4 mt-lg-0">

              <div
                className="bg-light rounded-4 p-4 text-center"
              >
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white mb-3"
                  style={{
                    width: "65px",
                    height: "65px",
                    fontSize: "28px",
                  }}
                >
                  👤
                </div>

                <h6 className="fw-bold mb-1">
                  Administrator
                </h6>

                <small className="text-muted">
                  Full system access
                </small>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* ================= QUICK STATS ================= */}
      <div className="row g-4 mb-4">

        {/* Events */}
        <div className="col-md-4">

          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-start">

                <div>
                  <p className="text-muted small mb-2">
                    EVENT MANAGEMENT
                  </p>

                  <h5 className="fw-bold mb-2">
                    Manage Events
                  </h5>

                  <p className="text-muted small mb-0">
                    View, edit and manage all events.
                  </p>
                </div>

                <div
                  className="rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                  style={{
                    width: "50px",
                    height: "50px",
                    fontSize: "23px",
                  }}
                >
                  📅
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* Create */}
        <div className="col-md-4">

          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-start">

                <div>
                  <p className="text-muted small mb-2">
                    EVENT CREATION
                  </p>

                  <h5 className="fw-bold mb-2">
                    Add New Event
                  </h5>

                  <p className="text-muted small mb-0">
                    Create and publish a new event.
                  </p>
                </div>

                <div
                  className="rounded-3 bg-success bg-opacity-10 d-flex align-items-center justify-content-center"
                  style={{
                    width: "50px",
                    height: "50px",
                    fontSize: "23px",
                  }}
                >
                  ➕
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* Bookings */}
        <div className="col-md-4">

          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-start">

                <div>
                  <p className="text-muted small mb-2">
                    BOOKING SYSTEM
                  </p>

                  <h5 className="fw-bold mb-2">
                    Event Bookings
                  </h5>

                  <p className="text-muted small mb-0">
                    Monitor bookings from your events.
                  </p>
                </div>

                <div
                  className="rounded-3 bg-warning bg-opacity-10 d-flex align-items-center justify-content-center"
                  style={{
                    width: "50px",
                    height: "50px",
                    fontSize: "23px",
                  }}
                >
                  🎟️
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div className="card border-0 shadow-sm mb-4">

        <div className="card-body p-4 p-md-5">

          <div className="mb-4">

            <h5 className="fw-bold mb-1">
              Quick Actions
            </h5>

            <p className="text-muted small mb-0">
              Frequently used administrator actions.
            </p>

          </div>

          <div className="row g-3">

            {/* Manage Events */}
            <div className="col-md-6">

              <Link
                to="/admin/events"
                className="text-decoration-none"
              >
                <div
                  className="border rounded-4 p-4 h-100"
                  style={{
                    transition: "all 0.2s ease",
                  }}
                >

                  <div className="d-flex align-items-center gap-3">

                    <div
                      className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: "52px",
                        height: "52px",
                        fontSize: "22px",
                        flexShrink: 0,
                      }}
                    >
                      📋
                    </div>

                    <div>

                      <h6 className="fw-bold text-dark mb-1">
                        Manage Events
                      </h6>

                      <p className="text-muted small mb-0">
                        View and manage all your events
                      </p>

                    </div>

                    <div className="ms-auto text-muted fs-5">
                      →
                    </div>

                  </div>

                </div>
              </Link>

            </div>

            {/* Add Event */}
            <div className="col-md-6">

              <Link
                to="/admin/events/add"
                className="text-decoration-none"
              >
                <div
                  className="border rounded-4 p-4 h-100"
                  style={{
                    transition: "all 0.2s ease",
                  }}
                >

                  <div className="d-flex align-items-center gap-3">

                    <div
                      className="bg-success text-white rounded-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: "52px",
                        height: "52px",
                        fontSize: "22px",
                        flexShrink: 0,
                      }}
                    >
                      +
                    </div>

                    <div>

                      <h6 className="fw-bold text-dark mb-1">
                        Create New Event
                      </h6>

                      <p className="text-muted small mb-0">
                        Add a new event to the platform
                      </p>

                    </div>

                    <div className="ms-auto text-muted fs-5">
                      →
                    </div>

                  </div>

                </div>
              </Link>

            </div>

          </div>

        </div>

      </div>

      {/* ================= ADMIN TIPS ================= */}
      <div className="card border-0 shadow-sm">

        <div className="card-body p-4">

          <div className="d-flex align-items-start gap-3">

            <div
              className="rounded-3 bg-info bg-opacity-10 d-flex align-items-center justify-content-center"
              style={{
                width: "45px",
                height: "45px",
                flexShrink: 0,
                fontSize: "20px",
              }}
            >
              💡
            </div>

            <div>

              <h6 className="fw-bold mb-1">
                Admin Tip
              </h6>

              <p className="text-muted small mb-0">
                Keep your event information accurate and up to date.
                Make sure event dates, ticket prices and available
                seats are correct before publishing.
              </p>

            </div>

          </div>

        </div>

      </div>

      <div style={{ height: "30px" }}></div>

    </div>
  );
}

export default AdminDashboard;
