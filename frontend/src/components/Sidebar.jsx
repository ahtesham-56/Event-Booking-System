import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "../services/authService";

/* =========================================================
   ICON COMPONENT
   ========================================================= */

function Icon({ name, size = 19 }) {
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
    dashboard: (
      <svg {...common}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
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

    users: (
      <svg {...common}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),

    venues: (
      <svg {...common}>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),

    reports: (
      <svg {...common}>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      </svg>
    ),

    notifications: (
      <svg {...common}>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </svg>
    ),

    settings: (
      <svg {...common}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.5 1.5-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2.12v-.4a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.5-1.5.06-.06A1.7 1.7 0 0 0 9.2 15a1.7 1.7 0 0 0-1.56-1.03H7.2v-2.12h.44A1.7 1.7 0 0 0 9.2 10.8a1.7 1.7 0 0 0-.34-1.88L8.8 8.86l1.5-1.5.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.03-1.56V5.8h2.12v.4a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.5 1.5-.06.06A1.7 1.7 0 0 0 19.4 10c.14.6.69 1.03 1.31 1.03h.49v2.12h-.49A1.7 1.7 0 0 0 19.4 15Z" />
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
   SIDEBAR
   ========================================================= */

function Sidebar({ role = "admin" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = getCurrentUser();

  const isAdmin = role === "admin";

  /* =======================================================
     MENU ITEMS
     ======================================================= */

  const adminMenuItems = [
    {
      label: "Dashboard",
      icon: "dashboard",
      path: "/admin",
      end: true,
    },
    {
      label: "Events",
      icon: "events",
      path: "/admin/events",
    },
    {
      label: "Bookings",
      icon: "bookings",
      path: "/admin/bookings",
    },
    {
      label: "Users",
      icon: "users",
      path: "/admin/users",
    },
    {
      label: "Venues",
      icon: "venues",
      path: "/admin/venues",
    },
    {
      label: "Reports",
      icon: "reports",
      path: "/admin/reports",
    },
    {
      label: "Notifications",
      icon: "notifications",
      path: "/admin/notifications",
    },
    {
      label: "Settings",
      icon: "settings",
      path: "/admin/settings",
    },
  ];

  const userMenuItems = [
    {
      label: "Dashboard",
      icon: "dashboard",
      path: "/dashboard",
      end: true,
    },
    {
      label: "Events",
      icon: "events",
      path: "/events",
    },
    {
      label: "My Bookings",
      icon: "bookings",
      path: "/my-bookings",
    },
    {
      label: "Settings",
      icon: "settings",
      path: "/settings",
    },
  ];

  const menuItems = isAdmin
    ? adminMenuItems
    : userMenuItems;


  /* =======================================================
     MOBILE SIDEBAR
     ======================================================= */

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  const openMobileSidebar = () => {
    setMobileOpen(true);
  };


  /* =======================================================
     LOGOUT
     ======================================================= */

  const handleLogout = () => {
    logoutUser();
    closeMobileSidebar();
    navigate("/login");
  };


  /* =======================================================
     SIDEBAR WIDTH
     ======================================================= */

  useEffect(() => {
    const width = collapsed ? "78px" : "260px";

    document.documentElement.style.setProperty(
      "--eventbook-sidebar-width",
      width
    );

    return () => {
      document.documentElement.style.removeProperty(
        "--eventbook-sidebar-width"
      );
    };
  }, [collapsed]);


  /* =======================================================
     LOCK BODY WHEN MOBILE SIDEBAR IS OPEN
     ======================================================= */

  useEffect(() => {
    if (mobileOpen && window.innerWidth < 992) {
      document.body.classList.add("sidebar-mobile-open");
    } else {
      document.body.classList.remove("sidebar-mobile-open");
    }

    return () => {
      document.body.classList.remove("sidebar-mobile-open");
    };
  }, [mobileOpen]);


  /* =======================================================
     CLOSE SIDEBAR AFTER ROUTE CHANGE
     ======================================================= */

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);


  return (
    <>
      {/* ===================================================
          MOBILE SIDEBAR BUTTON
          LEFT CORNER
          =================================================== */}

      <button
        type="button"
        className="eventbook-sidebar-mobile-toggle"
        onClick={openMobileSidebar}
        aria-label="Open sidebar"
        aria-expanded={mobileOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>


      {/* ===================================================
          MOBILE OVERLAY
          =================================================== */}

      {mobileOpen && (
        <button
          type="button"
          className="eventbook-sidebar-overlay"
          onClick={closeMobileSidebar}
          aria-label="Close sidebar"
        />
      )}


      {/* ===================================================
          SIDEBAR
          =================================================== */}

      <aside
        className={`eventbook-sidebar ${
          collapsed ? "collapsed" : ""
        } ${
          mobileOpen ? "mobile-open" : ""
        }`}
      >

        {/* =================================================
            SIDEBAR TOP
            NO LOGO
            NO APP NAME
            ONLY COLLAPSE ARROW
            ================================================= */}

        <div className="eventbook-sidebar-top">

          <button
            type="button"
            className="eventbook-sidebar-arrow"
            onClick={() => {
              if (window.innerWidth < 992) {
                closeMobileSidebar();
              } else {
                setCollapsed((previous) => !previous);
              }
            }}
            aria-label={
              collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            title={
              collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
          >
            <span
              className={
                collapsed
                  ? "arrow-right"
                  : "arrow-left"
              }
            ></span>
          </button>

        </div>


        {/* =================================================
            NAVIGATION
            ================================================= */}

        <div className="eventbook-sidebar-body">

          <div className="eventbook-menu-label">
            {isAdmin ? "Administration" : "Navigation"}
          </div>

          <nav className="eventbook-navigation">

            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `eventbook-nav-item ${
                    isActive ? "active" : ""
                  }`
                }
                onClick={closeMobileSidebar}
              >

                <span className="eventbook-nav-icon">
                  <Icon name={item.icon} />
                </span>

                <span className="eventbook-nav-text">
                  {item.label}
                </span>

              </NavLink>
            ))}

          </nav>

        </div>


        {/* =================================================
            USER / LOGOUT
            ================================================= */}

        <div className="eventbook-sidebar-footer">

          <div className="eventbook-user-card">

            <div className="eventbook-user-avatar">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : isAdmin
                ? "A"
                : "U"}
            </div>

            <div className="eventbook-user-info">

              <div className="eventbook-user-name">
                {user?.name ||
                  (isAdmin
                    ? "Administrator"
                    : "User")}
              </div>

              <div className="eventbook-user-role">
                {isAdmin
                  ? "Administrator"
                  : "Event User"}
              </div>

            </div>

          </div>


          <button
            type="button"
            className="eventbook-logout"
            onClick={handleLogout}
          >
            <span className="eventbook-logout-icon">
              <Icon name="logout" size={17} />
            </span>

            <span className="eventbook-logout-text">
              Logout
            </span>
          </button>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;