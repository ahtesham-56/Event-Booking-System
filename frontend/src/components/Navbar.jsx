import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getCurrentUser, logoutUser } from "../services/authService";

/* =========================================================
   ICON COMPONENT
   ========================================================= */

function Icon({ name, size = 17 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const icons = {
    home: (
      <svg {...common}>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M9 21v-6h6v6" />
      </svg>
    ),

    events: (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M16 2v4M8 2v4M3 9h18" />
        <path d="M8 13h2M14 13h2M8 17h2" />
      </svg>
    ),

    bookings: (
      <svg {...common}>
        <path d="M5 5h14a2 2 0 0 1 2 2v3a3 3 0 0 0 0 6v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a3 3 0 0 0 0-6V7a2 2 0 0 1 2-2Z" />
        <path d="M12 8v2M12 14v2" />
      </svg>
    ),

    dashboard: (
      <svg {...common}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),

    settings: (
      <svg {...common}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.5 1.5-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2.12v-.4a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.5-1.5.06-.06A1.7 1.7 0 0 0 9.2 15a1.7 1.7 0 0 0-1.56-1.03H7.2v-2.12h.44A1.7 1.7 0 0 0 9.2 10.8a1.7 1.7 0 0 0-.34-1.88L8.8 8.86l1.5-1.5.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.03-1.56V5.8h2.12v.4a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.5 1.5-.06.06A1.7 1.7 0 0 0 19.4 10c.14.6.69 1.03 1.31 1.03h.49v2.12h-.49A1.7 1.7 0 0 0 19.4 15Z" />
      </svg>
    ),

    user: (
      <svg {...common}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c.8-4 3.4-6 8-6s7.2 2 8 6" />
      </svg>
    ),

    logout: (
      <svg {...common}>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M14 4h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5" />
      </svg>
    ),
  };

  return icons[name] || null;
}

/* =========================================================
   NAVBAR
   ========================================================= */

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [navOpen, setNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const user = getCurrentUser();

  /* =======================================================
     LOGOUT
     ======================================================= */

  const handleLogout = () => {
    logoutUser();

    setNavOpen(false);
    setProfileOpen(false);

    navigate("/login");
  };

  /* =======================================================
     ACTIVE ROUTE
     ======================================================= */

  const isActive = (path) => {
    return location.pathname === path;
  };

  /* =======================================================
     CLOSE NAVIGATION
     ======================================================= */

  const closeNavigation = () => {
    setNavOpen(false);
    setProfileOpen(false);
  };

  /* =======================================================
     PROFILE
     ======================================================= */

  const openProfile = () => {
    setProfileOpen(false);
    setNavOpen(false);
    navigate("/profile");
  };

  /* =======================================================
     SETTINGS
     ======================================================= */

  const openSettings = () => {
    setProfileOpen(false);
    setNavOpen(false);
    navigate("/settings");
  };

  /* =======================================================
     USER INITIAL
     ======================================================= */

  const userInitial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : "U";

  return (
    <nav className="eventbook-navbar">
      <div className="eventbook-navbar-inner">

        {/* =================================================
            BRAND
            ================================================= */}

        <Link
          className="eventbook-navbar-brand"
          to="/"
          onClick={closeNavigation}
        >
          <div className="eventbook-navbar-logo">
            <span>E</span>
          </div>

          <div className="eventbook-navbar-brand-text">
            <span className="eventbook-navbar-title">
              Event<span>Book</span>
            </span>

            <small className="eventbook-navbar-subtitle">
              Discover • Book • Enjoy
            </small>
          </div>
        </Link>

        {/* =================================================
            NAVIGATION
            ================================================= */}

        <div
          className={`eventbook-navbar-navigation ${
            navOpen ? "open" : ""
          }`}
        >
          <div className="eventbook-navbar-nav-inner">

            {/* HOME */}

            <Link
              className={`eventbook-nav-link ${
                isActive("/") ? "active" : ""
              }`}
              to="/"
              onClick={closeNavigation}
            >
              <span className="eventbook-nav-icon">
                <Icon name="home" />
              </span>

              <span>Home</span>
            </Link>

            {/* EVENTS */}

            <Link
              className={`eventbook-nav-link ${
                isActive("/events") ? "active" : ""
              }`}
              to="/events"
              onClick={closeNavigation}
            >
              <span className="eventbook-nav-icon">
                <Icon name="events" />
              </span>

              <span>Events</span>
            </Link>

            {/* USER LINKS */}

            {user && (
              <>
                <Link
                  className={`eventbook-nav-link ${
                    isActive("/my-bookings") ? "active" : ""
                  }`}
                  to="/my-bookings"
                  onClick={closeNavigation}
                >
                  <span className="eventbook-nav-icon">
                    <Icon name="bookings" />
                  </span>

                  <span>My Bookings</span>
                </Link>

                <Link
                  className={`eventbook-nav-link ${
                    isActive("/dashboard") ? "active" : ""
                  }`}
                  to="/dashboard"
                  onClick={closeNavigation}
                >
                  <span className="eventbook-nav-icon">
                    <Icon name="dashboard" />
                  </span>

                  <span>Dashboard</span>
                </Link>

                {/* ADMIN */}

                {user.role === "admin" && (
                  <Link
                    className={`eventbook-nav-link ${
                      location.pathname.startsWith("/admin")
                        ? "active"
                        : ""
                    }`}
                    to="/admin"
                    onClick={closeNavigation}
                  >
                    <span className="eventbook-nav-icon">
                      <Icon name="settings" />
                    </span>

                    <span>Admin</span>

                    <span className="eventbook-admin-badge">
                      ADMIN
                    </span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* =================================================
              MOBILE USER AREA
              ================================================= */}

          {user && (
            <div className="eventbook-mobile-user">

              <button
                type="button"
                className="eventbook-mobile-user-info"
                onClick={openProfile}
              >
                <div className="eventbook-profile-avatar">
                  {userInitial}
                </div>

                <div>
                  <div className="eventbook-profile-name">
                    {user.name || "User"}
                  </div>

                  <div className="eventbook-profile-role">
                    {user.role === "admin"
                      ? "Administrator"
                      : "Event User"}
                  </div>
                </div>
              </button>

              <div className="eventbook-mobile-user-actions">

                <button
                  type="button"
                  onClick={openProfile}
                >
                  <Icon name="user" size={16} />
                  Profile
                </button>

                <button
                  type="button"
                  onClick={openSettings}
                >
                  <Icon name="settings" size={16} />
                  Settings
                </button>

                <button
                  type="button"
                  className="eventbook-mobile-logout"
                  onClick={handleLogout}
                >
                  <Icon name="logout" size={16} />
                  Logout
                </button>

              </div>
            </div>
          )}
        </div>

        {/* =================================================
            RIGHT SIDE
            ================================================= */}

        <div className="eventbook-navbar-actions">

          {user ? (
            <>
              {/* PROFILE BUTTON */}

              <div className="eventbook-profile-wrapper">

                <button
                  type="button"
                  className={`eventbook-profile-button ${
                    profileOpen ? "active" : ""
                  }`}
                  onClick={() =>
                    setProfileOpen((previous) => !previous)
                  }
                  aria-label="Open account menu"
                  aria-expanded={profileOpen}
                >
                  <div className="eventbook-profile-avatar">
                    {userInitial}
                  </div>

                  <div className="eventbook-profile-info">
                    <div className="eventbook-profile-name">
                      {user.name || "User"}
                    </div>

                    <small className="eventbook-profile-role">
                      {user.role === "admin"
                        ? "Administrator"
                        : "Event User"}
                    </small>
                  </div>

                  <span className="eventbook-profile-chevron">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </button>

                {/* PROFILE DROPDOWN */}

                {profileOpen && (
                  <div className="eventbook-profile-dropdown">

                    <div className="eventbook-profile-dropdown-header">

                      <div className="eventbook-profile-avatar large">
                        {userInitial}
                      </div>

                      <div className="eventbook-profile-dropdown-user">
                        <strong>
                          {user.name || "User"}
                        </strong>

                        <span>
                          {user.email || "No email available"}
                        </span>
                      </div>

                    </div>

                    <div className="eventbook-profile-dropdown-divider" />

                    <button
                      type="button"
                      className="eventbook-profile-dropdown-item"
                      onClick={openProfile}
                    >
                      <span className="dropdown-item-icon">
                        <Icon name="user" size={17} />
                      </span>

                      <span className="dropdown-item-content">
                        <strong>My Profile</strong>
                        <small>
                          View and edit your profile
                        </small>
                      </span>
                    </button>

                    <button
                      type="button"
                      className="eventbook-profile-dropdown-item"
                      onClick={openSettings}
                    >
                      <span className="dropdown-item-icon">
                        <Icon name="settings" size={17} />
                      </span>

                      <span className="dropdown-item-content">
                        <strong>Settings</strong>
                        <small>
                          Manage account preferences
                        </small>
                      </span>
                    </button>

                    <div className="eventbook-profile-dropdown-divider" />

                    <button
                      type="button"
                      className="eventbook-profile-dropdown-item logout"
                      onClick={handleLogout}
                    >
                      <span className="dropdown-item-icon">
                        <Icon name="logout" size={17} />
                      </span>

                      <span className="dropdown-item-content">
                        <strong>Logout</strong>
                        <small>
                          Sign out of EventBook
                        </small>
                      </span>
                    </button>

                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="eventbook-login-btn"
                onClick={closeNavigation}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="eventbook-start-btn"
                onClick={closeNavigation}
              >
                Get Started
              </Link>
            </>
          )}

          {/* MOBILE MENU */}

          <button
            type="button"
            className={`eventbook-navbar-mobile-toggle ${
              navOpen ? "active" : ""
            }`}
            onClick={() => {
              setNavOpen((previous) => !previous);
              setProfileOpen(false);
            }}
            aria-label="Toggle navigation"
            aria-expanded={navOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;

