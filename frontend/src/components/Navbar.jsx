
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../services/authService";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = getCurrentUser();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav
      className="navbar navbar-expand-lg bg-white border-bottom shadow-sm sticky-top"
      style={{
        minHeight: "70px",
      }}
    >
      <div className="container">

        {/* ================= BRAND ================= */}

        <Link
          className="navbar-brand d-flex align-items-center gap-2"
          to="/"
        >

          <div
            className="d-flex align-items-center justify-content-center bg-primary text-white rounded-3"
            style={{
              width: "40px",
              height: "40px",
              fontSize: "20px",
            }}
          >
            E
          </div>

          <div className="d-flex flex-column">

            <span
              className="fw-bold text-dark"
              style={{
                fontSize: "19px",
                lineHeight: "20px",
              }}
            >
              Event<span className="text-primary">Book</span>
            </span>

            <small
              className="text-muted d-none d-sm-block"
              style={{
                fontSize: "10px",
                lineHeight: "12px",
              }}
            >
              Discover • Book • Enjoy
            </small>

          </div>

        </Link>

        {/* ================= MOBILE TOGGLE ================= */}

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* ================= NAVIGATION ================= */}

        <div
          className="collapse navbar-collapse"
          id="navbarContent"
        >

          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-1">

            {/* HOME */}

            <li className="nav-item">

              <Link
                className={`nav-link px-3 py-2 rounded-3 ${
                  isActive("/")
                    ? "active bg-primary bg-opacity-10 text-primary fw-semibold"
                    : "text-dark"
                }`}
                to="/"
              >
                <span className="me-1">⌂</span>
                Home
              </Link>

            </li>

            {/* EVENTS */}

            <li className="nav-item">

              <Link
                className={`nav-link px-3 py-2 rounded-3 ${
                  isActive("/events")
                    ? "active bg-primary bg-opacity-10 text-primary fw-semibold"
                    : "text-dark"
                }`}
                to="/events"
              >
                <span className="me-1">📅</span>
                Events
              </Link>

            </li>

            {/* LOGGED-IN USER */}

            {user && (
              <>

                {/* MY BOOKINGS */}

                <li className="nav-item">

                  <Link
                    className={`nav-link px-3 py-2 rounded-3 ${
                      isActive("/my-bookings")
                        ? "active bg-primary bg-opacity-10 text-primary fw-semibold"
                        : "text-dark"
                    }`}
                    to="/my-bookings"
                  >
                    <span className="me-1">🎟️</span>
                    My Bookings
                  </Link>

                </li>

                {/* DASHBOARD */}

                <li className="nav-item">

                  <Link
                    className={`nav-link px-3 py-2 rounded-3 ${
                      isActive("/dashboard")
                        ? "active bg-primary bg-opacity-10 text-primary fw-semibold"
                        : "text-dark"
                    }`}
                    to="/dashboard"
                  >
                    <span className="me-1">▦</span>
                    Dashboard
                  </Link>

                </li>

                {/* ADMIN */}

                {user.role === "admin" && (
                  <li className="nav-item">

                    <Link
                      className={`nav-link px-3 py-2 rounded-3 ${
                        location.pathname.startsWith("/admin")
                          ? "active bg-primary bg-opacity-10 text-primary fw-semibold"
                          : "text-dark"
                      }`}
                      to="/admin"
                    >
                      <span className="me-1">⚙</span>
                      Admin

                      <span className="badge bg-primary ms-2">
                        Admin
                      </span>

                    </Link>

                  </li>
                )}

              </>
            )}

          </ul>

          {/* ================= RIGHT SIDE ================= */}

          <div className="d-flex align-items-center gap-2">

            {user ? (

              <>

                {/* USER PROFILE */}

                <div className="d-flex align-items-center gap-2 me-2">

                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                    style={{
                      width: "38px",
                      height: "38px",
                      fontSize: "15px",
                    }}
                  >
                    {user.name
                      ? user.name
                          .charAt(0)
                          .toUpperCase()
                      : "U"}
                  </div>

                  <div className="d-none d-xl-block">

                    <div
                      className="fw-semibold"
                      style={{
                        fontSize: "14px",
                        lineHeight: "17px",
                      }}
                    >
                      {user.name}
                    </div>

                    <small
                      className="text-muted"
                      style={{
                        fontSize: "11px",
                      }}
                    >
                      {user.role === "admin"
                        ? "Administrator"
                        : "Event User"}
                    </small>

                  </div>

                </div>

                {/* LOGOUT */}

                <button
                  className="btn btn-outline-danger btn-sm px-3"
                  onClick={handleLogout}
                >
                  Logout
                </button>

              </>

            ) : (

              <>

                {/* LOGIN */}

                <Link
                  to="/login"
                  className="btn btn-outline-primary px-3"
                >
                  Login
                </Link>

                {/* REGISTER */}

                <Link
                  to="/register"
                  className="btn btn-primary px-3 shadow-sm"
                >
                  Get Started
                </Link>

              </>

            )}

          </div>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;