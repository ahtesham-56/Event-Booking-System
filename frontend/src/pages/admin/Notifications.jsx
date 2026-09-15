import { useEffect, useState } from "react";
import api from "../../services/api";

function Notifications() {
  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);

      const [eventsResponse, bookingsResponse] =
        await Promise.all([
          api.get("/events"),
          api.get("/bookings"),
        ]);

      const events =
        eventsResponse.data?.events ||
        eventsResponse.data ||
        [];

      const bookings =
        bookingsResponse.data?.bookings ||
        bookingsResponse.data ||
        [];

      const generated = [];

      /*
        Recent events
      */

      events
        .slice(-5)
        .reverse()
        .forEach((event) => {
          generated.push({
            id:
              `event-${event._id}`,
            type: "event",
            icon: "🎫",
            title: "Event available",
            message:
              `${event.title || "New event"} is available on EventBook.`,
            time:
              event.createdAt ||
              event.date,
          });
        });

      /*
        Recent bookings
      */

      bookings
        .slice(-5)
        .reverse()
        .forEach((booking) => {
          const eventTitle =
            booking.event?.title ||
            booking.eventTitle ||
            "an event";

          generated.push({
            id:
              `booking-${booking._id}`,
            type: "booking",
            icon: "📋",
            title: "New booking",
            message:
              `A booking was created for ${eventTitle}.`,
            time:
              booking.createdAt,
          });
        });

      generated.sort(
        (a, b) =>
          new Date(b.time || 0) -
          new Date(a.time || 0)
      );

      setNotifications(
        generated.slice(0, 10)
      );
    } catch (error) {
      console.error(
        "NOTIFICATIONS ERROR:",
        error
      );

      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    if (!time) return "Recently";

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

  return (
    <div className="container-fluid py-4 px-3 px-lg-4">

      {/* HEADER */}

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

        <div>

          <h2 className="fw-bold mb-1">
            Notifications
          </h2>

          <p className="text-muted mb-0">
            Monitor important EventBook activity.
          </p>

        </div>

        <button
          className="btn btn-outline-primary"
          onClick={loadNotifications}
        >
          ↻ Refresh
        </button>

      </div>

      {/* INFO */}

      <div className="alert alert-primary border-0 rounded-4 mb-4">

        <div className="d-flex gap-3">

          <span style={{ fontSize: "22px" }}>
            🔔
          </span>

          <div>

            <strong>
              EventBook Activity Notifications
            </strong>

            <p className="mb-0 small mt-1">
              These notifications are generated from
              events and bookings in your system.
            </p>

          </div>

        </div>

      </div>

      {/* NOTIFICATION LIST */}

      <div className="card border-0 shadow-sm rounded-4">

        <div className="card-body p-3 p-md-4">

          {loading ? (

            <div className="text-center py-5">

              <div
                className="spinner-border text-primary"
                role="status"
              />

              <p className="text-muted mt-3">
                Loading notifications...
              </p>

            </div>

          ) : notifications.length ===
            0 ? (

            <div className="text-center py-5">

              <div
                className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{
                  width: "70px",
                  height: "70px",
                  fontSize: "28px",
                }}
              >
                🔔
              </div>

              <h5 className="fw-bold">
                No notifications
              </h5>

              <p className="text-muted mb-0">
                New event and booking activity will appear here.
              </p>

            </div>

          ) : (

            <div className="d-flex flex-column gap-2">

              {notifications.map(
                (notification) => (

                  <div
                    key={notification.id}
                    className="border rounded-4 p-3"
                  >

                    <div className="d-flex gap-3">

                      <div
                        className="rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: "48px",
                          height: "48px",
                          fontSize: "20px",
                        }}
                      >
                        {notification.icon}
                      </div>

                      <div className="flex-grow-1">

                        <div className="d-flex flex-column flex-sm-row justify-content-between gap-1">

                          <h6 className="fw-bold mb-1">
                            {notification.title}
                          </h6>

                          <small className="text-muted">
                            {formatTime(
                              notification.time
                            )}
                          </small>

                        </div>

                        <p className="text-muted mb-0 small">
                          {notification.message}
                        </p>

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Notifications;