import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Sidebar() {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      label: "Dashboard",
      icon: "📊",
      path: "/admin",
      end: true,
    },
    {
      label: "Events",
      icon: "🎫",
      path: "/admin/events",
    },
    {
      label: "Bookings",
      icon: "📋",
      path: "/admin/bookings",
    },
    {
      label: "Users",
      icon: "👥",
      path: "/admin/users",
    },
    {
      label: "Venues",
      icon: "🏛️",
      path: "/admin/venues",
    },
    {
      label: "Reports",
      icon: "📈",
      path: "/admin/reports",
    },
    {
      label: "Notifications",
      icon: "🔔",
      path: "/admin/notifications",
    },
    {
      label: "Settings",
      icon: "⚙️",
      path: "/admin/settings",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  /* -------------------------------------------------------
     Keep navbar / page content aligned with sidebar
  ------------------------------------------------------- */

  useEffect(() => {
    const width = collapsed ? "76px" : "260px";

    document.documentElement.style.setProperty(
      "--admin-sidebar-width",
      width
    );

    return () => {
      document.documentElement.style.removeProperty(
        "--admin-sidebar-width"
      );
    };
  }, [collapsed]);

  return (
    <>
      {/* =====================================================
          SIDEBAR CSS
      ====================================================== */}

      <style>{`

        :root {
          --admin-sidebar-width: 260px;
        }

        /* =================================================
           DESKTOP SIDEBAR
        ================================================= */

        .eventbook-sidebar {
          position: fixed;
          top: 0;
          left: 0;

          width: var(--admin-sidebar-width);
          height: 100vh;

          z-index: 1050;

          background: #ffffff;

          border-right: 1px solid #e5e7eb;

          display: flex;
          flex-direction: column;

          box-shadow:
            2px 0 12px rgba(15, 23, 42, 0.04);

          transition:
            width 0.25s ease,
            box-shadow 0.25s ease;

          overflow: hidden;
        }

        /* =================================================
           SIDEBAR HEADER
        ================================================= */

        .eventbook-sidebar-header {
          height: 84px;

          padding: 0 15px;

          display: flex;
          align-items: center;

          border-bottom: 1px solid #edf0f4;

          flex-shrink: 0;

          position: relative;
        }

        .eventbook-brand {
          display: flex;
          align-items: center;

          gap: 11px;

          min-width: 0;
        }

        .eventbook-logo {
          width: 43px;
          height: 43px;

          flex-shrink: 0;

          border-radius: 12px;

          background: linear-gradient(
            135deg,
            #2563eb,
            #4f46e5
          );

          display: flex;
          align-items: center;
          justify-content: center;

          color: #ffffff;

          font-size: 20px;

          box-shadow:
            0 5px 12px rgba(37, 99, 235, 0.22);
        }

        .eventbook-brand-content {
          overflow: hidden;

          white-space: nowrap;

          transition:
            opacity 0.15s ease,
            width 0.25s ease;
        }

        .eventbook-brand-title {
          margin: 0;

          color: #172033;

          font-size: 18px;

          line-height: 1.1;

          font-weight: 700;
        }

        .eventbook-brand-title span {
          color: #2563eb;
        }

        .eventbook-brand-subtitle {
          display: block;

          margin-top: 4px;

          color: #8a94a6;

          font-size: 10px;
        }

        /* =================================================
           HAMBURGER / COLLAPSE BUTTON
        ================================================= */

        .eventbook-collapse-btn {
          position: absolute;

          right: -12px;

          top: 50%;

          transform: translateY(-50%);

          width: 27px;
          height: 27px;

          border-radius: 50%;

          border: 1px solid #dce2ea;

          background: #ffffff;

          color: #475569;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 14px;

          cursor: pointer;

          z-index: 10;

          box-shadow:
            0 2px 7px rgba(15, 23, 42, 0.12);

          transition:
            background 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease;
        }

        .eventbook-collapse-btn:hover {
          background: #2563eb;

          border-color: #2563eb;

          color: #ffffff;
        }

        /* =================================================
           MENU AREA
        ================================================= */

        .eventbook-sidebar-body {
          flex: 1;

          padding: 24px 12px;

          overflow-y: auto;
          overflow-x: hidden;
        }

        .eventbook-sidebar-body::-webkit-scrollbar {
          width: 4px;
        }

        .eventbook-sidebar-body::-webkit-scrollbar-track {
          background: transparent;
        }

        .eventbook-sidebar-body::-webkit-scrollbar-thumb {
          background: #d9dee7;

          border-radius: 10px;
        }

        .eventbook-menu-label {
          padding: 0 11px;

          margin-bottom: 10px;

          color: #98a2b3;

          font-size: 10px;

          font-weight: 700;

          letter-spacing: 1.1px;

          text-transform: uppercase;

          white-space: nowrap;
        }

        .eventbook-navigation {
          display: flex;

          flex-direction: column;

          gap: 4px;
        }

        /* =================================================
           NAV LINKS
        ================================================= */

        .eventbook-nav-item {
          width: 100%;

          min-height: 46px;

          padding: 0 11px;

          border-radius: 10px;

          display: flex;

          align-items: center;

          gap: 12px;

          text-decoration: none;

          color: #667085;

          font-size: 14px;

          font-weight: 500;

          white-space: nowrap;

          transition:
            background 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease;
        }

        .eventbook-nav-item:hover {
          background: #f3f6fb;

          color: #2563eb;

          transform: translateX(1px);
        }

        .eventbook-nav-item.active {
          background: #eaf1ff;

          color: #2563eb;

          font-weight: 600;
        }

        .eventbook-nav-icon {
          width: 34px;
          height: 34px;

          flex-shrink: 0;

          border-radius: 9px;

          display: flex;

          align-items: center;

          justify-content: center;

          font-size: 16px;

          background: #f7f8fa;

          transition: 0.2s ease;
        }

        .eventbook-nav-item:hover
        .eventbook-nav-icon {
          background: #e8efff;
        }

        .eventbook-nav-item.active
        .eventbook-nav-icon {
          background: #d8e6ff;
        }

        .eventbook-nav-text {
          overflow: hidden;

          transition:
            opacity 0.15s ease;
        }

        /* =================================================
           SIDEBAR FOOTER
        ================================================= */

        .eventbook-sidebar-footer {
          padding: 13px;

          border-top: 1px solid #edf0f4;

          flex-shrink: 0;
        }

        .eventbook-admin-card {
          display: flex;

          align-items: center;

          gap: 10px;

          padding: 10px;

          margin-bottom: 9px;

          border-radius: 10px;

          background: #f6f8fc;

          overflow: hidden;
        }

        .eventbook-admin-avatar {
          width: 35px;
          height: 35px;

          flex-shrink: 0;

          border-radius: 50%;

          background: #2563eb;

          color: #ffffff;

          display: flex;

          align-items: center;

          justify-content: center;

          font-size: 13px;

          font-weight: 700;
        }

        .eventbook-admin-info {
          overflow: hidden;

          white-space: nowrap;
        }

        .eventbook-admin-name {
          color: #172033;

          font-size: 12px;

          font-weight: 600;
        }

        .eventbook-admin-role {
          margin-top: 2px;

          color: #98a2b3;

          font-size: 10px;
        }

        /* =================================================
           LOGOUT
        ================================================= */

        .eventbook-logout {
          width: 100%;

          height: 42px;

          border: 1px solid #e0e4ea;

          border-radius: 9px;

          background: #ffffff;

          color: #667085;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 8px;

          font-size: 13px;

          font-weight: 500;

          cursor: pointer;

          transition: 0.2s ease;
        }

        .eventbook-logout:hover {
          background: #fff5f5;

          border-color: #fecaca;

          color: #dc2626;
        }

        /* =================================================
           COLLAPSED STATE
        ================================================= */

        .eventbook-sidebar.collapsed
        .eventbook-brand-content {
          opacity: 0;

          width: 0;
        }

        .eventbook-sidebar.collapsed
        .eventbook-menu-label {
          opacity: 0;

          height: 0;

          margin: 0;

          padding: 0;
        }

        .eventbook-sidebar.collapsed
        .eventbook-nav-item {
          justify-content: center;

          padding: 0;
        }

        .eventbook-sidebar.collapsed
        .eventbook-nav-text {
          opacity: 0;

          width: 0;

          display: none;
        }

        .eventbook-sidebar.collapsed
        .eventbook-admin-card {
          justify-content: center;

          padding: 8px 0;
        }

        .eventbook-sidebar.collapsed
        .eventbook-admin-info {
          display: none;
        }

        .eventbook-sidebar.collapsed
        .eventbook-logout {
          font-size: 0;

          gap: 0;
        }

        .eventbook-sidebar.collapsed
        .eventbook-logout::before {
          content: "🚪";

          font-size: 15px;
        }

        .eventbook-sidebar.collapsed
        .eventbook-collapse-btn {
          transform:
            translateY(-50%)
            rotate(180deg);
        }

        /* =================================================
           PAGE / NAVBAR POSITIONING
        ================================================= */

        /*
          These rules keep the existing EventBook
          Navbar and page content aligned with the
          sidebar.
        */

        body.admin-sidebar-page {
          --current-admin-sidebar:
            var(--admin-sidebar-width);
        }

        body.admin-sidebar-page
        .navbar {
          margin-left:
            var(--admin-sidebar-width);

          width:
            calc(
              100% -
              var(--admin-sidebar-width)
            );

          transition:
            margin-left 0.25s ease,
            width 0.25s ease;
        }

        body.admin-sidebar-page
        main {
          margin-left:
            var(--admin-sidebar-width);

          transition:
            margin-left 0.25s ease;
        }

        /* =================================================
           MOBILE
        ================================================= */

        .eventbook-mobile-header {
          display: none;
        }

        @media (max-width: 991.98px) {

          .eventbook-sidebar {
            width: 280px;

            transform: translateX(-100%);

            transition:
              transform 0.25s ease;

            box-shadow:
              5px 0 25px rgba(0, 0, 0, 0.12);
          }

          .eventbook-sidebar.mobile-open {
            transform: translateX(0);
          }

          body.admin-sidebar-page
          .navbar,
          body.admin-sidebar-page
          main {
            margin-left: 0;

            width: 100%;
          }

          .eventbook-mobile-header {
            height: 60px;

            display: flex;

            align-items: center;

            justify-content: space-between;

            padding: 0 15px;

            background: #ffffff;

            border-bottom: 1px solid #e5e7eb;

            position: sticky;

            top: 0;

            z-index: 1030;
          }

          .eventbook-mobile-brand {
            display: flex;

            align-items: center;

            gap: 9px;
          }

          .eventbook-mobile-logo {
            width: 36px;
            height: 36px;

            border-radius: 10px;

            background: linear-gradient(
              135deg,
              #2563eb,
              #4f46e5
            );

            display: flex;

            align-items: center;

            justify-content: center;

            color: white;

            font-size: 17px;
          }

          .eventbook-mobile-name {
            color: #172033;

            font-size: 15px;

            font-weight: 700;
          }

          .eventbook-mobile-subtitle {
            color: #98a2b3;

            font-size: 9px;
          }

          .eventbook-mobile-menu {
            width: 40px;
            height: 40px;

            border: 1px solid #dfe3e8;

            border-radius: 9px;

            background: #ffffff;

            color: #344054;

            display: flex;

            align-items: center;

            justify-content: center;

            font-size: 20px;

            cursor: pointer;
          }

          .eventbook-mobile-menu:hover {
            background: #f3f6fb;

            color: #2563eb;
          }

          .eventbook-mobile-overlay {
            position: fixed;

            inset: 0;

            background: rgba(15, 23, 42, 0.35);

            z-index: 1040;

            display: none;
          }

          .eventbook-mobile-overlay.show {
            display: block;
          }

          .eventbook-collapse-btn {
            display: none;
          }
        }

      `}</style>

      {/* =====================================================
          MOBILE TOP BAR
      ====================================================== */}

      <div className="eventbook-mobile-header">

        <div className="eventbook-mobile-brand">

          <div className="eventbook-mobile-logo">
            🎟️
          </div>

          <div>
            <div className="eventbook-mobile-name">
              EventBook
            </div>

            <small className="eventbook-mobile-subtitle">
              Admin Panel
            </small>
          </div>

        </div>

        <button
          type="button"
          className="eventbook-mobile-menu"
          onClick={() => {
            const sidebar =
              document.getElementById("eventbookSidebar");

            if (sidebar) {
              sidebar.classList.toggle("mobile-open");
            }

            const overlay =
              document.getElementById(
                "eventbookMobileOverlay"
              );

            if (overlay) {
              overlay.classList.toggle("show");
            }
          }}
          aria-label="Open menu"
        >
          ☰
        </button>

      </div>

      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}

      <div
        id="eventbookMobileOverlay"
        className="eventbook-mobile-overlay"
        onClick={() => {

          const sidebar =
            document.getElementById("eventbookSidebar");

          const overlay =
            document.getElementById(
              "eventbookMobileOverlay"
            );

          if (sidebar) {
            sidebar.classList.remove("mobile-open");
          }

          if (overlay) {
            overlay.classList.remove("show");
          }

        }}
      />

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        id="eventbookSidebar"
        className={`eventbook-sidebar ${
          collapsed ? "collapsed" : ""
        }`}
      >

        <div className="eventbook-sidebar-header">

          {/* BRAND */}

          <div className="eventbook-brand">

            <div className="eventbook-logo">
              🎟️
            </div>

            <div className="eventbook-brand-content">

              <h5 className="eventbook-brand-title">
                Event<span>Book</span>
              </h5>

              <small className="eventbook-brand-subtitle">
                Event Management System
              </small>

            </div>

          </div>

          {/* DESKTOP HAMBURGER */}

          <button
            type="button"
            className="eventbook-collapse-btn"
            onClick={() =>
              setCollapsed((prev) => !prev)
            }
            aria-label={
              collapsed
                ? "Open sidebar"
                : "Close sidebar"
            }
            title={
              collapsed
                ? "Open sidebar"
                : "Close sidebar"
            }
          >
            {collapsed ? "›" : "‹"}
          </button>

        </div>

        {/* =================================================
            MENU
        ================================================== */}

        <div className="eventbook-sidebar-body">

          <div className="eventbook-menu-label">
            Main Menu
          </div>

          <nav className="eventbook-navigation">

            {menuItems.map((item) => (

              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                title={
                  collapsed
                    ? item.label
                    : undefined
                }
                className={({ isActive }) =>
                  `eventbook-nav-item ${
                    isActive ? "active" : ""
                  }`
                }
                onClick={() => {

                  if (window.innerWidth < 992) {

                    const sidebar =
                      document.getElementById(
                        "eventbookSidebar"
                      );

                    const overlay =
                      document.getElementById(
                        "eventbookMobileOverlay"
                      );

                    if (sidebar) {
                      sidebar.classList.remove(
                        "mobile-open"
                      );
                    }

                    if (overlay) {
                      overlay.classList.remove(
                        "show"
                      );
                    }

                  }

                }}
              >

                <span className="eventbook-nav-icon">
                  {item.icon}
                </span>

                <span className="eventbook-nav-text">
                  {item.label}
                </span>

              </NavLink>

            ))}

          </nav>

        </div>

        {/* =================================================
            FOOTER
        ================================================== */}

        <div className="eventbook-sidebar-footer">

          <div className="eventbook-admin-card">

            <div className="eventbook-admin-avatar">
              A
            </div>

            <div className="eventbook-admin-info">

              <div className="eventbook-admin-name">
                Administrator
              </div>

              <div className="eventbook-admin-role">
                Full system access
              </div>

            </div>

          </div>

          <button
            type="button"
            className="eventbook-logout"
            onClick={handleLogout}
          >

            <span>
              🚪
            </span>

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;