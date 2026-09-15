
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getEvents,
  deleteEvent,
} from "../../services/eventService";

function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getEvents();

        console.log("EVENT DATA:", data);

        setEvents(
          Array.isArray(data)
            ? data
            : data.events || []
        );
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this event?"
      )
    ) {
      return;
    }

    try {
      await deleteEvent(id);

      setEvents((prevEvents) =>
        prevEvents.filter(
          (event) => event._id !== id
        )
      );
    } catch (err) {
      console.log("Delete error:", err);

      alert("Failed to delete event.");
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="container-fluid py-5 px-3 px-md-4">

        <div className="text-center py-5">

          <div
            className="spinner-border text-primary mb-3"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <h6 className="fw-semibold">
            Loading Events...
          </h6>

          <p className="text-muted small mb-0">
            Please wait while we fetch your events.
          </p>

        </div>

      </div>
    );
  }

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
                Event Management
              </span>

            </div>

            <h2 className="fw-bold mb-1">
              Manage Events
            </h2>

            <p className="text-muted mb-0">
              View, edit and manage all events on your platform.
            </p>

          </div>

          <Link
            to="/admin/events/add"
            className="btn btn-primary px-4 py-2 shadow-sm"
          >
            + Add Event
          </Link>

        </div>

      </div>

      {/* ================= SUMMARY ================= */}

      <div className="row g-3 mb-4">

        <div className="col-md-4">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center">

                <div>
                  <p className="text-muted small mb-1">
                    TOTAL EVENTS
                  </p>

                  <h3 className="fw-bold mb-0">
                    {events.length}
                  </h3>
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

        <div className="col-md-4">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center">

                <div>
                  <p className="text-muted small mb-1">
                    EVENT CATEGORIES
                  </p>

                  <h3 className="fw-bold mb-0">
                    {
                      new Set(
                        events.map(
                          (event) => event.category
                        )
                      ).size
                    }
                  </h3>
                </div>

                <div
                  className="rounded-3 bg-success bg-opacity-10 d-flex align-items-center justify-content-center"
                  style={{
                    width: "50px",
                    height: "50px",
                    fontSize: "23px",
                  }}
                >
                  🏷️
                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="col-md-4">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center">

                <div>
                  <p className="text-muted small mb-1">
                    TOTAL SEATS
                  </p>

                  <h3 className="fw-bold mb-0">
                    {events.reduce(
                      (total, event) =>
                        total +
                        Number(
                          event.totalSeats ||
                            event.seats ||
                            0
                        ),
                      0
                    )}
                  </h3>
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

      {/* ================= EVENTS CARD ================= */}

      <div className="card border-0 shadow-sm">

        {/* Card Header */}

        <div className="card-header bg-white border-bottom p-4">

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">

            <div>

              <h5 className="fw-bold mb-1">
                All Events
              </h5>

              <p className="text-muted small mb-0">
                Manage your currently listed events.
              </p>

            </div>

            <span className="badge bg-light text-dark border px-3 py-2">
              {events.length}{" "}
              {events.length === 1
                ? "Event"
                : "Events"}
            </span>

          </div>

        </div>

        {/* ================= EMPTY STATE ================= */}

        {events.length === 0 ? (

          <div className="card-body text-center py-5">

            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light mb-3"
              style={{
                width: "75px",
                height: "75px",
                fontSize: "32px",
              }}
            >
              📅
            </div>

            <h5 className="fw-bold">
              No Events Found
            </h5>

            <p className="text-muted mb-4">
              You haven't created any events yet.
              Create your first event to get started.
            </p>

            <Link
              to="/admin/events/add"
              className="btn btn-primary px-4"
            >
              + Create First Event
            </Link>

          </div>

        ) : (

          /* ================= TABLE ================= */

          <div className="card-body p-0">

            <div className="table-responsive">

              <table className="table table-hover align-middle mb-0">

                <thead className="table-light">

                  <tr>

                    <th className="px-4 py-3">
                      Event
                    </th>

                    <th className="py-3">
                      Category
                    </th>

                    <th className="py-3">
                      Date & Time
                    </th>

                    <th className="py-3">
                      Venue
                    </th>

                    <th className="py-3">
                      Price
                    </th>

                    <th className="py-3">
                      Seats
                    </th>

                    <th className="py-3 text-end pe-4">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {events.map((event) => {

                    const formattedDate =
                      event.date
                        ? new Date(
                            event.date
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "N/A";

                    return (

                      <tr key={event._id}>

                        {/* EVENT */}

                        <td className="px-4">

                          <div className="d-flex align-items-center gap-3">

                            <img
                              src={
                                event.banner ||
                                "https://placehold.co/100x70?text=Event"
                              }
                              alt={
                                event.title ||
                                "Event"
                              }
                              style={{
                                width: "75px",
                                height: "55px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://placehold.co/100x70?text=Event";
                              }}
                            />

                            <div>

                              <div className="fw-semibold">
                                {event.title}
                              </div>

                              <small className="text-muted">
                                ID:{" "}
                                {event._id
                                  ? event._id.slice(
                                      -6
                                    )
                                  : "N/A"}
                              </small>

                            </div>

                          </div>

                        </td>

                        {/* CATEGORY */}

                        <td>

                          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                            {event.category}
                          </span>

                        </td>

                        {/* DATE + TIME */}

                        <td>

                          <div className="fw-semibold">
                            {formattedDate}
                          </div>

                          <small className="text-muted">
                            {event.time ||
                              "Time not set"}
                          </small>

                        </td>

                        {/* VENUE */}

                        <td>

                          <div className="fw-semibold">
                            {event.venue ||
                              event.location ||
                              "N/A"}
                          </div>

                          {event.location &&
                            event.venue && (
                              <small className="text-muted">
                                {event.location}
                              </small>
                            )}

                        </td>

                        {/* PRICE */}

                        <td>

                          <span className="fw-semibold">
                            ₹
                            {Number(
                              event.ticketPrice ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </span>

                        </td>

                        {/* SEATS */}

                        <td>

                          <span className="badge bg-light text-dark border px-3 py-2">
                            {event.totalSeats ||
                              event.seats ||
                              0}
                          </span>

                        </td>

                        {/* ACTIONS */}

                        <td className="text-end pe-4">

                          <div className="d-flex justify-content-end gap-2">

                            <Link
                              to={`/admin/events/edit/${event._id}`}
                              className="btn btn-sm btn-outline-primary"
                            >
                              Edit
                            </Link>

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                handleDelete(
                                  event._id
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    );
                  })}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </div>

      {/* Bottom spacing */}

      <div style={{ height: "30px" }}></div>

    </div>
  );
}

export default ManageEvents;

