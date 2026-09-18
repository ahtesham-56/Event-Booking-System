import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="container-fluid px-3 px-md-4 py-4">

      /*PAGE HEADER*/
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">

        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span
              className="badge rounded-pill px-3 py-2"
              style={{
                background: "#eff6ff",
                color: "#2563eb",
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.6px",
              }}
            >
              ADMIN PANEL
            </span>

            <span className="text-muted small">
              EventBook
            </span>
          </div>

          <h2
            className="fw-bold mb-1"
            style={{
              color: "#0f172a",
              letterSpacing: "-0.5px",
            }}
          >
            Dashboard
          </h2>

          <p className="text-muted mb-0">
            Manage your events, bookings and platform activity.
          </p>
        </div>

        <Link
          to="/admin/events/add"
          className="btn px-4 py-2 d-inline-flex align-items-center justify-content-center gap-2 shadow-sm"
          style={{
            background: "#2563eb",
            color: "#fff",
            borderRadius: "10px",
            border: "none",
            fontWeight: "600",
          }}
        >
          <span style={{ fontSize: "18px" }}>+</span>
          Create Event
        </Link>

      </div>


      /* Welcome / Hero Card*/
      <div
        className="position-relative overflow-hidden mb-4"
        style={{
          borderRadius: "20px",
          background:
            "linear-gradient(135deg, #1d4ed8 0%, #2563eb 55%, #3b82f6 100%)",
          minHeight: "220px",
          boxShadow: "0 12px 30px rgba(37, 99, 235, 0.18)",
        }}
      >

        {/* Decorative circles */}
        <div
          className="position-absolute rounded-circle"
          style={{
            width: "220px",
            height: "220px",
            background: "rgba(255,255,255,0.08)",
            right: "-70px",
            top: "-90px",
          }}
        />

        <div
          className="position-absolute rounded-circle"
          style={{
            width: "140px",
            height: "140px",
            background: "rgba(255,255,255,0.06)",
            right: "180px",
            bottom: "-80px",
          }}
        />

        <div className="position-relative p-4 p-md-5">

          <div className="row align-items-center">

            <div className="col-lg-8">

              <div
                className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-3"
                style={{
                  background: "rgba(255,255,255,0.14)",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#4ade80",
                    display: "inline-block",
                  }}
                />

                System Active
              </div>

              <h3
                className="fw-bold text-white mb-2"
                style={{
                  fontSize: "clamp(24px, 4vw, 32px)",
                  letterSpacing: "-0.6px",
                }}
              >
                Welcome back, Admin 👋
              </h3>

              <p
                className="mb-0"
                style={{
                  color: "rgba(255,255,255,0.78)",
                  maxWidth: "650px",
                  lineHeight: "1.7",
                }}
              >
                Everything you need to manage your EventBook platform
                is available from your dashboard.
              </p>

            </div>


            <div className="col-lg-4 mt-4 mt-lg-0">

              <div
                className="p-4 text-center"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: "16px",
                  backdropFilter: "blur(8px)",
                }}
              >

                <div
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "16px",
                    background: "#fff",
                    color: "#2563eb",
                    fontSize: "26px",
                    fontWeight: "700",
                  }}
                >
                  A
                </div>

                <h6 className="text-white fw-bold mb-1">
                  Administrator
                </h6>

                <small
                  style={{
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  Full system access
                </small>

              </div>

            </div>

          </div>

        </div>
      </div>


      /*  DASHBOARD CARDS*/
      <div className="row g-3 g-lg-4 mb-4">

        {/* Manage Events */}
        <div className="col-12 col-sm-6 col-xl-3">
          <Link
            to="/admin/events"
            className="text-decoration-none"
          >
            <div
              className="h-100 p-4 bg-white"
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                transition: "all 0.2s ease",
              }}
            >

              <div className="d-flex justify-content-between align-items-start mb-4">

                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "#eff6ff",
                    color: "#2563eb",
                    fontSize: "22px",
                  }}
                >
                  📅
                </div>

                <span
                  style={{
                    color: "#94a3b8",
                    fontSize: "20px",
                  }}
                >
                  →
                </span>

              </div>

              <div
                className="text-uppercase mb-1"
                style={{
                  color: "#94a3b8",
                  fontSize: "10px",
                  fontWeight: "700",
                  letterSpacing: "0.8px",
                }}
              >
                Event Management
              </div>

              <h5
                className="fw-bold mb-2"
                style={{ color: "#0f172a" }}
              >
                Manage Events
              </h5>

              <p className="text-muted small mb-0">
                View, edit and manage your events.
              </p>

            </div>
          </Link>
        </div>


        {/* Create Event */}
        <div className="col-12 col-sm-6 col-xl-3">
          <Link
            to="/admin/events/add"
            className="text-decoration-none"
          >
            <div
              className="h-100 p-4 bg-white"
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                transition: "all 0.2s ease",
              }}
            >

              <div className="d-flex justify-content-between align-items-start mb-4">

                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "#ecfdf5",
                    color: "#16a34a",
                    fontSize: "22px",
                  }}
                >
                  +
                </div>

                <span
                  style={{
                    color: "#94a3b8",
                    fontSize: "20px",
                  }}
                >
                  →
                </span>

              </div>

              <div
                className="text-uppercase mb-1"
                style={{
                  color: "#94a3b8",
                  fontSize: "10px",
                  fontWeight: "700",
                  letterSpacing: "0.8px",
                }}
              >
                Event Creation
              </div>

              <h5
                className="fw-bold mb-2"
                style={{ color: "#0f172a" }}
              >
                Add New Event
              </h5>

              <p className="text-muted small mb-0">
                Create and publish a new event.
              </p>

            </div>
          </Link>
        </div>


        {/* Bookings */}
        <div className="col-12 col-sm-6 col-xl-3">
          <Link
            to="/admin/bookings"
            className="text-decoration-none"
          >
            <div
              className="h-100 p-4 bg-white"
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                transition: "all 0.2s ease",
              }}
            >

              <div className="d-flex justify-content-between align-items-start mb-4">

                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "#fff7ed",
                    color: "#ea580c",
                    fontSize: "21px",
                  }}
                >
                  🎟
                </div>

                <span
                  style={{
                    color: "#94a3b8",
                    fontSize: "20px",
                  }}
                >
                  →
                </span>

              </div>

              <div
                className="text-uppercase mb-1"
                style={{
                  color: "#94a3b8",
                  fontSize: "10px",
                  fontWeight: "700",
                  letterSpacing: "0.8px",
                }}
              >
                Booking System
              </div>

              <h5
                className="fw-bold mb-2"
                style={{ color: "#0f172a" }}
              >
                Event Bookings
              </h5>

              <p className="text-muted small mb-0">
                Monitor bookings from your events.
              </p>

            </div>
          </Link>
        </div>


        {/* Reports */}
        <div className="col-12 col-sm-6 col-xl-3">
          <Link
            to="/admin/reports"
            className="text-decoration-none"
          >
            <div
              className="h-100 p-4 bg-white"
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                transition: "all 0.2s ease",
              }}
            >

              <div className="d-flex justify-content-between align-items-start mb-4">

                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "#f5f3ff",
                    color: "#7c3aed",
                    fontSize: "21px",
                  }}
                >
                  📊
                </div>

                <span
                  style={{
                    color: "#94a3b8",
                    fontSize: "20px",
                  }}
                >
                  →
                </span>

              </div>

              <div
                className="text-uppercase mb-1"
                style={{
                  color: "#94a3b8",
                  fontSize: "10px",
                  fontWeight: "700",
                  letterSpacing: "0.8px",
                }}
              >
                Analytics
              </div>

              <h5
                className="fw-bold mb-2"
                style={{ color: "#0f172a" }}
              >
                Reports
              </h5>

              <p className="text-muted small mb-0">
                Review platform activity and reports.
              </p>

            </div>
          </Link>
        </div>

      </div>


      /*  QUICK ACTIONS + PLATFORM STATUS */
      <div className="row g-4 mb-4">

        {/* Quick Actions */}
        <div className="col-lg-8">

          <div
            className="bg-white h-100 p-4 p-md-5"
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "18px",
            }}
          >

            <div className="mb-4">
              <h5
                className="fw-bold mb-1"
                style={{ color: "#0f172a" }}
              >
                Quick Actions
              </h5>

              <p className="text-muted small mb-0">
                Access your frequently used administrator tools.
              </p>
            </div>


            <div className="row g-3">

              <div className="col-md-6">

                <Link
                  to="/admin/events"
                  className="text-decoration-none"
                >

                  <div
                    className="p-3 p-md-4 d-flex align-items-center gap-3"
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "14px",
                      background: "#fff",
                    }}
                  >

                    <div
                      className="d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: "#eff6ff",
                        color: "#2563eb",
                        fontSize: "20px",
                      }}
                    >
                      📋
                    </div>

                    <div className="flex-grow-1">

                      <h6
                        className="fw-bold mb-1"
                        style={{ color: "#0f172a" }}
                      >
                        Manage Events
                      </h6>

                      <p className="text-muted small mb-0">
                        View and update events
                      </p>

                    </div>

                    <span className="text-muted">
                      →
                    </span>

                  </div>

                </Link>

              </div>


              <div className="col-md-6">

                <Link
                  to="/admin/events/add"
                  className="text-decoration-none"
                >

                  <div
                    className="p-3 p-md-4 d-flex align-items-center gap-3"
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "14px",
                      background: "#fff",
                    }}
                  >

                    <div
                      className="d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: "#ecfdf5",
                        color: "#16a34a",
                        fontSize: "22px",
                      }}
                    >
                      +
                    </div>

                    <div className="flex-grow-1">

                      <h6
                        className="fw-bold mb-1"
                        style={{ color: "#0f172a" }}
                      >
                        Create Event
                      </h6>

                      <p className="text-muted small mb-0">
                        Publish a new event
                      </p>

                    </div>

                    <span className="text-muted">
                      →
                    </span>

                  </div>

                </Link>

              </div>


              <div className="col-md-6">

                <Link
                  to="/admin/bookings"
                  className="text-decoration-none"
                >

                  <div
                    className="p-3 p-md-4 d-flex align-items-center gap-3"
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "14px",
                      background: "#fff",
                    }}
                  >

                    <div
                      className="d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: "#fff7ed",
                        color: "#ea580c",
                        fontSize: "20px",
                      }}
                    >
                      🎟
                    </div>

                    <div className="flex-grow-1">

                      <h6
                        className="fw-bold mb-1"
                        style={{ color: "#0f172a" }}
                      >
                        Manage Bookings
                      </h6>

                      <p className="text-muted small mb-0">
                        Review customer bookings
                      </p>

                    </div>

                    <span className="text-muted">
                      →
                    </span>

                  </div>

                </Link>

              </div>


              <div className="col-md-6">

                <Link
                  to="/admin/reports"
                  className="text-decoration-none"
                >

                  <div
                    className="p-3 p-md-4 d-flex align-items-center gap-3"
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "14px",
                      background: "#fff",
                    }}
                  >

                    <div
                      className="d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: "#f5f3ff",
                        color: "#7c3aed",
                        fontSize: "20px",
                      }}
                    >
                      📈
                    </div>

                    <div className="flex-grow-1">

                      <h6
                        className="fw-bold mb-1"
                        style={{ color: "#0f172a" }}
                      >
                        View Reports
                      </h6>

                      <p className="text-muted small mb-0">
                        Check platform analytics
                      </p>

                    </div>

                    <span className="text-muted">
                      →
                    </span>

                  </div>

                </Link>

              </div>

            </div>

          </div>

        </div>


        {/* Platform Status */}
        <div className="col-lg-4">

          <div
            className="bg-white h-100 p-4 p-md-5"
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "18px",
            }}
          >

            <div className="d-flex align-items-center justify-content-between mb-4">

              <div>
                <h5
                  className="fw-bold mb-1"
                  style={{ color: "#0f172a" }}
                >
                  Platform Status
                </h5>

                <p className="text-muted small mb-0">
                  Current system overview
                </p>
              </div>

              <span
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: "#ecfdf5",
                  color: "#16a34a",
                  fontSize: "18px",
                }}
              >
                ✓
              </span>

            </div>


            <div
              className="d-flex align-items-center justify-content-between py-3"
              style={{
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <span className="text-muted small">
                Event system
              </span>

              <span
                className="badge rounded-pill"
                style={{
                  background: "#ecfdf5",
                  color: "#15803d",
                }}
              >
                Active
              </span>
            </div>


            <div
              className="d-flex align-items-center justify-content-between py-3"
              style={{
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <span className="text-muted small">
                Booking system
              </span>

              <span
                className="badge rounded-pill"
                style={{
                  background: "#ecfdf5",
                  color: "#15803d",
                }}
              >
                Active
              </span>
            </div>


            <div
              className="d-flex align-items-center justify-content-between py-3"
              style={{
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <span className="text-muted small">
                Database
              </span>

              <span
                className="badge rounded-pill"
                style={{
                  background: "#ecfdf5",
                  color: "#15803d",
                }}
              >
                Connected
              </span>
            </div>


            <div className="d-flex align-items-center justify-content-between py-3">

              <span className="text-muted small">
                Admin access
              </span>

              <span
                className="badge rounded-pill"
                style={{
                  background: "#eff6ff",
                  color: "#2563eb",
                }}
              >
                Full Access
              </span>

            </div>

          </div>

        </div>

      </div>


      /*  ADMIN GUIDANCE */
      <div
        className="p-4 p-md-5 mb-4"
        style={{
          borderRadius: "18px",
          background: "#f8fafc",
          border: "1px solid #e5e7eb",
        }}
      >

        <div className="d-flex flex-column flex-md-row align-items-md-center gap-3">

          <div
            className="d-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "14px",
              background: "#fff",
              border: "1px solid #e2e8f0",
              fontSize: "21px",
            }}
          >
            💡
          </div>

          <div className="flex-grow-1">

            <h6
              className="fw-bold mb-1"
              style={{ color: "#0f172a" }}
            >
              Admin Tip
            </h6>

            <p className="text-muted small mb-0">
              Keep event dates, ticket prices, descriptions and
              seat availability accurate so users always receive
              reliable booking information.
            </p>

          </div>

          <Link
            to="/admin/events"
            className="btn btn-sm px-3"
            style={{
              border: "1px solid #dbeafe",
              background: "#eff6ff",
              color: "#2563eb",
              borderRadius: "9px",
              fontWeight: "600",
            }}
          >
            Review Events
          </Link>

        </div>

      </div>


      {/* Bottom spacing */}
      <div style={{ height: "20px" }} />

    </div>
  );
}

export default AdminDashboard;

