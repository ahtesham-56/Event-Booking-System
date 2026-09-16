import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  /* =========================================================
     LOAD NOTIFICATIONS
     ========================================================= */

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);

      /* =====================================================
         LOAD EVENTS + ALL BOOKINGS
         ===================================================== */

      const [eventsResponse, bookingsResponse] =
        await Promise.all([
          api.get("/events"),
          api.get("/bookings/all"),
        ]);

      /* =====================================================
         EVENTS
         ===================================================== */

      const events =
        eventsResponse.data?.events ||
        eventsResponse.data?.data ||
        eventsResponse.data ||
        [];

      /* =====================================================
         BOOKINGS
         ===================================================== */

      const bookings =
        bookingsResponse.data?.bookings ||
        bookingsResponse.data?.data ||
        bookingsResponse.data ||
        [];

      const eventList = Array.isArray(events)
        ? events
        : [];

      const bookingList = Array.isArray(bookings)
        ? bookings
        : [];

      const generated = [];

      /* =====================================================
         EVENT NOTIFICATIONS
         ===================================================== */

      eventList.forEach((event) => {
        generated.push({
          id: `event-${event._id}`,
          type: "event",
          icon: "bi-calendar-event-fill",
          title: "New event available",
          message: `${
            event.title || "A new event"
          } is available on EventBook.`,
          time:
            event.createdAt ||
            event.date ||
            null,
          eventTitle:
            event.title || "New Event",
          category:
            event.category || "Event",
        });
      });

      /* =====================================================
         BOOKING NOTIFICATIONS
         ===================================================== */

      bookingList.forEach((booking) => {
        const eventTitle =
          booking.event?.title ||
          booking.eventTitle ||
          "an event";

        const userName =
          booking.user?.name ||
          booking.user?.fullName ||
          "A customer";

        const quantity = Number(
          booking.quantity ||
            booking.seats?.length ||
            0
        );

        generated.push({
          id: `booking-${booking._id}`,
          type: "booking",
          icon: "bi-ticket-perforated-fill",
          title: "New booking received",
          message: `${userName} booked ${quantity || 1} ${
            quantity === 1 ? "ticket" : "tickets"
          } for ${eventTitle}.`,
          time:
            booking.createdAt ||
            booking.updatedAt ||
            null,
          eventTitle,
          category: "Booking",
          amount:
            booking.totalAmount ||
            booking.amount ||
            0,
          status:
            booking.status || "Confirmed",
        });
      });

      /* =====================================================
         SORT BY LATEST
         ===================================================== */

      generated.sort(
        (a, b) =>
          new Date(b.time || 0) -
          new Date(a.time || 0)
      );

      /* =====================================================
         KEEP LATEST 30 ACTIVITIES
         ===================================================== */

      setNotifications(
        generated.slice(0, 30)
      );
    } catch (error) {
      console.error(
        "NOTIFICATIONS ERROR:",
        error.response?.data ||
          error.message ||
          error
      );

      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     FILTERED NOTIFICATIONS
     ========================================================= */

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") {
      return notifications;
    }

    return notifications.filter(
      (notification) =>
        notification.type === activeFilter
    );
  }, [notifications, activeFilter]);

  /* =========================================================
     STATISTICS
     ========================================================= */

  const statistics = useMemo(() => {
    const eventNotifications =
      notifications.filter(
        (item) => item.type === "event"
      );

    const bookingNotifications =
      notifications.filter(
        (item) => item.type === "booking"
      );

    return {
      total: notifications.length,
      events: eventNotifications.length,
      bookings: bookingNotifications.length,
    };
  }, [notifications]);

  /* =========================================================
     FORMAT RELATIVE TIME
     ========================================================= */

  const formatRelativeTime = (time) => {
    if (!time) {
      return "Recently";
    }

    const date = new Date(time);

    if (Number.isNaN(date.getTime())) {
      return "Recently";
    }

    const now = new Date();

    const difference =
      now.getTime() - date.getTime();

    const seconds = Math.floor(
      difference / 1000
    );

    if (seconds < 10) {
      return "Just now";
    }

    if (seconds < 60) {
      return `${seconds} sec ago`;
    }

    const minutes = Math.floor(
      seconds / 60
    );

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours = Math.floor(
      minutes / 60
    );

    if (hours < 24) {
      return `${hours} hr ago`;
    }

    const days = Math.floor(
      hours / 24
    );

    if (days < 7) {
      return `${days} ${
        days === 1 ? "day" : "days"
      } ago`;
    }

    return date.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  /* =========================================================
     FULL DATE
     ========================================================= */

  const formatFullDate = (time) => {
    if (!time) {
      return "Recently";
    }

    const date = new Date(time);

    if (Number.isNaN(date.getTime())) {
      return "Recently";
    }

    return date.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  /* =========================================================
     GET NOTIFICATION STYLES
     ========================================================= */

  const getNotificationStyle = (type) => {
    if (type === "booking") {
      return {
        iconClass:
          "notification-icon notification-icon-green",
        badgeClass:
          "notification-type booking-type",
      };
    }

    return {
      iconClass:
        "notification-icon notification-icon-blue",
      badgeClass:
        "notification-type event-type",
    };
  };

  /* =========================================================
     MAIN RETURN
     ========================================================= */

  return (
    <div className="notifications-page container-fluid py-4 px-3 px-lg-4">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="notification-header mb-4">

        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">

          <div className="d-flex align-items-center gap-3">

            <div className="notification-header-icon">
              <i className="bi bi-bell-fill"></i>
            </div>

            <div>
              <h2 className="fw-bold mb-1">
                Notifications
              </h2>

              <p className="text-muted mb-0">
                Monitor important EventBook activity
                and recent system updates.
              </p>
            </div>

          </div>

          <button
            type="button"
            className="btn btn-primary refresh-btn"
            onClick={loadNotifications}
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Refreshing...
              </>
            ) : (
              <>
                <i className="bi bi-arrow-clockwise me-2"></i>
                Refresh Activity
              </>
            )}
          </button>

        </div>

      </div>

      {/* =====================================================
          STAT CARDS
          ===================================================== */}

      <div className="row g-3 mb-4">

        {/* TOTAL */}

        <div className="col-12 col-sm-6 col-xl-4">

          <div className="notification-stat-card">

            <div className="stat-content">

              <div>
                <span className="stat-label">
                  TOTAL ACTIVITY
                </span>

                <h3 className="stat-number">
                  {statistics.total}
                </h3>

                <small className="text-muted">
                  Recent system activity
                </small>
              </div>

              <div className="stat-icon stat-icon-blue">
                <i className="bi bi-activity"></i>
              </div>

            </div>

          </div>

        </div>

        {/* EVENTS */}

        <div className="col-12 col-sm-6 col-xl-4">

          <div className="notification-stat-card">

            <div className="stat-content">

              <div>
                <span className="stat-label">
                  EVENT ACTIVITY
                </span>

                <h3 className="stat-number">
                  {statistics.events}
                </h3>

                <small className="text-muted">
                  Event updates
                </small>
              </div>

              <div className="stat-icon stat-icon-purple">
                <i className="bi bi-calendar-event-fill"></i>
              </div>

            </div>

          </div>

        </div>

        {/* BOOKINGS */}

        <div className="col-12 col-sm-6 col-xl-4">

          <div className="notification-stat-card">

            <div className="stat-content">

              <div>
                <span className="stat-label">
                  BOOKING ACTIVITY
                </span>

                <h3 className="stat-number">
                  {statistics.bookings}
                </h3>

                <small className="text-muted">
                  Booking updates
                </small>
              </div>

              <div className="stat-icon stat-icon-green">
                <i className="bi bi-ticket-perforated-fill"></i>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          MAIN NOTIFICATION CARD
          ===================================================== */}

      <div className="card notification-main-card border-0 shadow-sm rounded-4">

        {/* ===================================================
            CARD HEADER
            =================================================== */}

        <div className="card-body p-0">

          <div className="notification-card-header">

            <div>
              <h5 className="fw-bold mb-1">
                Recent Activity
              </h5>

              <p className="text-muted small mb-0">
                Latest events and bookings from
                your EventBook system.
              </p>
            </div>

            <div className="activity-count">
              {filteredNotifications.length}{" "}
              {filteredNotifications.length === 1
                ? "Activity"
                : "Activities"}
            </div>

          </div>

          {/* =================================================
              FILTERS
              ================================================= */}

          <div className="notification-filters">

            <button
              type="button"
              className={`filter-btn ${
                activeFilter === "all"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveFilter("all")
              }
            >
              <i className="bi bi-grid-fill me-2"></i>
              All Activity
            </button>

            <button
              type="button"
              className={`filter-btn ${
                activeFilter === "event"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveFilter("event")
              }
            >
              <i className="bi bi-calendar-event-fill me-2"></i>
              Events
            </button>

            <button
              type="button"
              className={`filter-btn ${
                activeFilter === "booking"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveFilter("booking")
              }
            >
              <i className="bi bi-ticket-perforated-fill me-2"></i>
              Bookings
            </button>

          </div>

          {/* =================================================
              NOTIFICATION CONTENT
              ================================================= */}

          <div className="notification-list-wrapper">

            {loading ? (

              <div className="notification-empty-state">

                <div className="loading-circle">

                  <span
                    className="spinner-border text-primary"
                    role="status"
                  ></span>

                </div>

                <h6 className="fw-bold mt-4 mb-2">
                  Loading activity
                </h6>

                <p className="text-muted small mb-0">
                  Fetching the latest EventBook
                  notifications...
                </p>

              </div>

            ) : filteredNotifications.length ===
              0 ? (

              <div className="notification-empty-state">

                <div className="empty-notification-icon">
                  <i className="bi bi-bell-slash-fill"></i>
                </div>

                <h5 className="fw-bold mt-4 mb-2">
                  No notifications found
                </h5>

                <p className="text-muted mb-0">
                  {activeFilter === "all"
                    ? "New event and booking activity will appear here."
                    : activeFilter === "event"
                    ? "No event activity is available yet."
                    : "No booking activity is available yet."}
                </p>

              </div>

            ) : (

              <div className="notification-list">

                {filteredNotifications.map(
                  (notification) => {

                    const styles =
                      getNotificationStyle(
                        notification.type
                      );

                    return (
                      <div
                        key={notification.id}
                        className="notification-item"
                      >

                        {/* ICON */}

                        <div
                          className={
                            styles.iconClass
                          }
                        >
                          <i
                            className={`bi ${notification.icon}`}
                          ></i>
                        </div>

                        {/* CONTENT */}

                        <div className="notification-content">

                          <div className="notification-top">

                            <div className="notification-title-wrapper">

                              <h6 className="notification-title">
                                {
                                  notification.title
                                }
                              </h6>

                              <span
                                className={
                                  styles.badgeClass
                                }
                              >
                                {notification.type ===
                                "booking"
                                  ? "BOOKING"
                                  : "EVENT"}
                              </span>

                            </div>

                            <div
                              className="notification-time"
                              title={formatFullDate(
                                notification.time
                              )}
                            >
                              <i className="bi bi-clock me-1"></i>
                              {formatRelativeTime(
                                notification.time
                              )}
                            </div>

                          </div>

                          <p className="notification-message">
                            {
                              notification.message
                            }
                          </p>

                          {/* EXTRA DETAILS */}

                          <div className="notification-meta">

                            {notification.type ===
                            "event" ? (

                              <>
                                <span>
                                  <i className="bi bi-tag me-1"></i>
                                  {
                                    notification.category
                                  }
                                </span>

                                <span>
                                  <i className="bi bi-calendar3 me-1"></i>
                                  Event
                                </span>
                              </>

                            ) : (

                              <>
                                <span>
                                  <i className="bi bi-ticket-perforated me-1"></i>
                                  Booking
                                </span>

                                {Number(
                                  notification.amount
                                ) > 0 && (
                                  <span className="text-success fw-semibold">
                                    <i className="bi bi-currency-rupee me-1"></i>
                                    {Number(
                                      notification.amount
                                    ).toLocaleString(
                                      "en-IN"
                                    )}
                                  </span>
                                )}

                                <span
                                  className={
                                    notification.status
                                      ?.toLowerCase() ===
                                    "confirmed"
                                      ? "status-confirmed"
                                      : "status-other"
                                  }
                                >
                                  <i className="bi bi-check-circle me-1"></i>
                                  {
                                    notification.status
                                  }
                                </span>
                              </>

                            )}

                          </div>

                        </div>

                        {/* SIDE DOT */}

                        <div className="notification-status-dot"></div>

                      </div>
                    );
                  }
                )}

              </div>

            )}

          </div>

        </div>

      </div>

      {/* =====================================================
          PAGE STYLES
          ===================================================== */}

      <style>
        {`

          /* =================================================
             PAGE
             ================================================= */

          .notifications-page {
            min-height: 100vh;
            background: #f8fafc;
          }

          /* =================================================
             HEADER
             ================================================= */

          .notification-header {
            padding-top: 2px;
          }

          .notification-header-icon {
            width: 52px;
            height: 52px;
            border-radius: 16px;
            background: #eff6ff;
            color: #2563eb;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            flex-shrink: 0;
            box-shadow:
              0 5px 15px
              rgba(37, 99, 235, 0.08);
          }

          .refresh-btn {
            border-radius: 12px;
            padding: 10px 18px;
            font-weight: 600;
            box-shadow:
              0 5px 15px
              rgba(37, 99, 235, 0.12);
          }

          /* =================================================
             STAT CARDS
             ================================================= */

          .notification-stat-card {
            background: #ffffff;
            border-radius: 18px;
            padding: 22px;
            border: 1px solid #eef2f7;
            box-shadow:
              0 5px 18px
              rgba(15, 23, 42, 0.05);
            transition:
              transform 0.25s ease,
              box-shadow 0.25s ease;
          }

          .notification-stat-card:hover {
            transform: translateY(-4px);
            box-shadow:
              0 14px 30px
              rgba(15, 23, 42, 0.09);
          }

          .stat-content {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 15px;
          }

          .stat-label {
            display: block;
            color: #64748b;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.6px;
          }

          .stat-number {
            color: #0f172a;
            font-size: 30px;
            line-height: 1.1;
            margin-top: 8px;
            margin-bottom: 5px;
            font-weight: 800;
          }

          .stat-icon {
            width: 50px;
            height: 50px;
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            flex-shrink: 0;
          }

          .stat-icon-blue {
            background: #eff6ff;
            color: #2563eb;
          }

          .stat-icon-purple {
            background: #f5f3ff;
            color: #7c3aed;
          }

          .stat-icon-green {
            background: #f0fdf4;
            color: #16a34a;
          }

          /* =================================================
             MAIN CARD
             ================================================= */

          .notification-main-card {
            overflow: hidden;
            background: #ffffff;
          }

          .notification-card-header {
            padding: 24px 26px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
            border-bottom: 1px solid #eef2f7;
          }

          .activity-count {
            background: #f1f5f9;
            color: #475569;
            border-radius: 50px;
            padding: 8px 14px;
            font-size: 12px;
            font-weight: 700;
            white-space: nowrap;
          }

          /* =================================================
             FILTERS
             ================================================= */

          .notification-filters {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 15px 26px;
            border-bottom: 1px solid #eef2f7;
            background: #ffffff;
            overflow-x: auto;
          }

          .filter-btn {
            border: 1px solid #e2e8f0;
            background: #ffffff;
            color: #64748b;
            border-radius: 10px;
            padding: 8px 14px;
            font-size: 13px;
            font-weight: 600;
            white-space: nowrap;
            transition: all 0.2s ease;
          }

          .filter-btn:hover {
            background: #f8fafc;
            color: #2563eb;
            border-color: #bfdbfe;
          }

          .filter-btn.active {
            background: #2563eb;
            color: #ffffff;
            border-color: #2563eb;
            box-shadow:
              0 4px 10px
              rgba(37, 99, 235, 0.18);
          }

          /* =================================================
             NOTIFICATION LIST
             ================================================= */

          .notification-list-wrapper {
            padding: 8px 12px 12px;
          }

          .notification-list {
            display: flex;
            flex-direction: column;
          }

          .notification-item {
            position: relative;
            display: flex;
            align-items: flex-start;
            gap: 16px;
            padding: 20px 16px;
            border-bottom: 1px solid #f1f5f9;
            transition:
              background 0.2s ease,
              transform 0.2s ease;
          }

          .notification-item:last-child {
            border-bottom: none;
          }

          .notification-item:hover {
            background: #f8fafc;
            border-radius: 14px;
          }

          /* =================================================
             NOTIFICATION ICON
             ================================================= */

          .notification-icon {
            width: 48px;
            height: 48px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 19px;
            flex-shrink: 0;
          }

          .notification-icon-blue {
            background: #eff6ff;
            color: #2563eb;
          }

          .notification-icon-green {
            background: #f0fdf4;
            color: #16a34a;
          }

          /* =================================================
             CONTENT
             ================================================= */

          .notification-content {
            flex: 1;
            min-width: 0;
          }

          .notification-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 15px;
          }

          .notification-title-wrapper {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px;
          }

          .notification-title {
            color: #0f172a;
            font-weight: 700;
            margin: 0;
            font-size: 15px;
          }

          .notification-type {
            padding: 4px 8px;
            border-radius: 50px;
            font-size: 9px;
            font-weight: 800;
            letter-spacing: 0.5px;
          }

          .event-type {
            background: #eff6ff;
            color: #2563eb;
          }

          .booking-type {
            background: #f0fdf4;
            color: #16a34a;
          }

          .notification-time {
            color: #94a3b8;
            font-size: 11px;
            font-weight: 500;
            white-space: nowrap;
            flex-shrink: 0;
          }

          .notification-message {
            color: #64748b;
            font-size: 13px;
            line-height: 1.6;
            margin: 7px 0 10px;
          }

          /* =================================================
             META
             ================================================= */

          .notification-meta {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 14px;
            color: #94a3b8;
            font-size: 11px;
          }

          .notification-meta span {
            display: inline-flex;
            align-items: center;
          }

          .status-confirmed {
            color: #16a34a !important;
            font-weight: 700;
          }

          .status-other {
            color: #64748b !important;
            font-weight: 600;
          }

          /* =================================================
             SIDE DOT
             ================================================= */

          .notification-status-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #2563eb;
            flex-shrink: 0;
            margin-top: 7px;
            box-shadow:
              0 0 0 4px #eff6ff;
          }

          /* =================================================
             EMPTY / LOADING
             ================================================= */

          .notification-empty-state {
            min-height: 360px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 50px 20px;
          }

          .empty-notification-icon {
            width: 76px;
            height: 76px;
            border-radius: 22px;
            background: #f1f5f9;
            color: #94a3b8;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
          }

          .loading-circle {
            width: 68px;
            height: 68px;
            border-radius: 50%;
            background: #eff6ff;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          /* =================================================
             TABLET
             ================================================= */

          @media (max-width: 767.98px) {

            .notifications-page {
              padding-top: 20px !important;
            }

            .notification-card-header {
              padding: 20px;
            }

            .notification-filters {
              padding-left: 20px;
              padding-right: 20px;
            }

            .notification-list-wrapper {
              padding-left: 8px;
              padding-right: 8px;
            }

            .notification-item {
              padding: 17px 12px;
              gap: 12px;
            }

            .notification-icon {
              width: 44px;
              height: 44px;
              border-radius: 12px;
              font-size: 17px;
            }

            .notification-top {
              flex-direction: column;
              gap: 5px;
            }

            .notification-time {
              font-size: 10px;
            }

          }

          /* =================================================
             MOBILE
             ================================================= */

          @media (max-width: 575.98px) {

            .notifications-page {
              padding-left: 12px !important;
              padding-right: 12px !important;
            }

            .notification-header-icon {
              width: 44px;
              height: 44px;
              border-radius: 13px;
              font-size: 18px;
            }

            .notification-header h2 {
              font-size: 23px;
            }

            .notification-header p {
              font-size: 13px;
            }

            .refresh-btn {
              width: 100%;
              padding: 10px 15px;
            }

            .notification-stat-card {
              padding: 18px;
            }

            .stat-number {
              font-size: 26px;
            }

            .stat-icon {
              width: 44px;
              height: 44px;
              border-radius: 13px;
            }

            .notification-card-header {
              flex-direction: column;
              align-items: flex-start;
              padding: 18px;
            }

            .activity-count {
              font-size: 11px;
            }

            .notification-filters {
              padding: 12px 15px;
            }

            .filter-btn {
              padding: 8px 11px;
              font-size: 12px;
            }

            .notification-item {
              gap: 10px;
              padding: 16px 8px;
            }

            .notification-icon {
              width: 40px;
              height: 40px;
              font-size: 16px;
            }

            .notification-title {
              font-size: 14px;
            }

            .notification-message {
              font-size: 12px;
            }

            .notification-meta {
              gap: 8px;
            }

            .notification-status-dot {
              display: none;
            }

          }

        `}
      </style>

    </div>
  );
}

export default Notifications;