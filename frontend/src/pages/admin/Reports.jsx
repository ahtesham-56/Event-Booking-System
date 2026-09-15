import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

function Reports() {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);

      const [eventsResponse, bookingsResponse] =
        await Promise.all([
          api.get("/events"),
          api.get("/bookings"),
        ]);

      const eventData =
        eventsResponse.data?.events ||
        eventsResponse.data ||
        [];

      const bookingData =
        bookingsResponse.data?.bookings ||
        bookingsResponse.data ||
        [];

      setEvents(
        Array.isArray(eventData)
          ? eventData
          : []
      );

      setBookings(
        Array.isArray(bookingData)
          ? bookingData
          : []
      );
    } catch (error) {
      console.error(
        "REPORTS ERROR:",
        error
      );

      setEvents([]);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const report = useMemo(() => {
    const confirmedBookings =
      bookings.filter(
        (booking) =>
          (
            booking.status ||
            "Confirmed"
          ).toLowerCase() ===
          "confirmed"
      );

    const totalBookings =
      confirmedBookings.length;

    const totalTickets =
      confirmedBookings.reduce(
        (total, booking) => {
          return (
            total +
            Number(
              booking.quantity ||
                booking.seats?.length ||
                0
            )
          );
        },
        0
      );

    const totalRevenue =
      confirmedBookings.reduce(
        (total, booking) => {
          return (
            total +
            Number(
              booking.totalAmount ||
                booking.amount ||
                0
            )
          );
        },
        0
      );

    const categoryMap = {};

    events.forEach((event) => {
      const category =
        event.category ||
        "Other";

      categoryMap[category] =
        (categoryMap[category] || 0) +
        1;
    });

    const categories =
      Object.entries(categoryMap)
        .sort(
          (a, b) => b[1] - a[1]
        );

    return {
      totalBookings,
      totalTickets,
      totalRevenue,
      totalEvents: events.length,
      categories,
    };
  }, [events, bookings]);

  return (
    <div className="container-fluid py-4 px-3 px-lg-4">

      {/* HEADER */}

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

        <div>

          <h2 className="fw-bold mb-1">
            Reports & Analytics
          </h2>

          <p className="text-muted mb-0">
            Understand EventBook bookings, tickets and revenue.
          </p>

        </div>

        <button
          className="btn btn-outline-primary"
          onClick={loadReports}
        >
          ↻ Refresh Reports
        </button>

      </div>

      {loading ? (

        <div className="text-center py-5">

          <div
            className="spinner-border text-primary"
            role="status"
          />

          <p className="text-muted mt-3">
            Preparing reports...
          </p>

        </div>

      ) : (

        <>

          {/* STAT CARDS */}

          <div className="row g-3 mb-4">

            <div className="col-12 col-sm-6 col-xl-3">

              <div className="card border-0 shadow-sm rounded-4 h-100">

                <div className="card-body p-4">

                  <small className="text-muted">
                    Total Bookings
                  </small>

                  <h3 className="fw-bold mt-2 mb-0">
                    {report.totalBookings}
                  </h3>

                  <small className="text-success">
                    Confirmed bookings
                  </small>

                </div>

              </div>

            </div>

            <div className="col-12 col-sm-6 col-xl-3">

              <div className="card border-0 shadow-sm rounded-4 h-100">

                <div className="card-body p-4">

                  <small className="text-muted">
                    Tickets Sold
                  </small>

                  <h3 className="fw-bold mt-2 mb-0">
                    {report.totalTickets}
                  </h3>

                  <small className="text-success">
                    Seats booked
                  </small>

                </div>

              </div>

            </div>

            <div className="col-12 col-sm-6 col-xl-3">

              <div className="card border-0 shadow-sm rounded-4 h-100">

                <div className="card-body p-4">

                  <small className="text-muted">
                    Revenue
                  </small>

                  <h3 className="fw-bold mt-2 mb-0">
                    ₹
                    {report.totalRevenue.toLocaleString(
                      "en-IN"
                    )}
                  </h3>

                  <small className="text-success">
                    Confirmed bookings
                  </small>

                </div>

              </div>

            </div>

            <div className="col-12 col-sm-6 col-xl-3">

              <div className="card border-0 shadow-sm rounded-4 h-100">

                <div className="card-body p-4">

                  <small className="text-muted">
                    Active Events
                  </small>

                  <h3 className="fw-bold mt-2 mb-0">
                    {report.totalEvents}
                  </h3>

                  <small className="text-success">
                    EventBook events
                  </small>

                </div>

              </div>

            </div>

          </div>

          {/* REPORT CONTENT */}

          <div className="row g-4">

            {/* CATEGORY */}

            <div className="col-12 col-lg-6">

              <div className="card border-0 shadow-sm rounded-4 h-100">

                <div className="card-body p-4">

                  <h5 className="fw-bold mb-1">
                    Event Distribution
                  </h5>

                  <p className="text-muted small mb-4">
                    Events grouped by category.
                  </p>

                  {report.categories.length ===
                  0 ? (

                    <p className="text-muted">
                      No event data available.
                    </p>

                  ) : (

                    report.categories.map(
                      ([category, count]) => {

                        const percentage =
                          report.totalEvents
                            ? Math.round(
                                (count /
                                  report.totalEvents) *
                                  100
                              )
                            : 0;

                        return (
                          <div
                            key={category}
                            className="mb-4"
                          >

                            <div className="d-flex justify-content-between mb-2">

                              <span className="fw-semibold">
                                {category}
                              </span>

                              <span className="text-muted">
                                {count} events
                              </span>

                            </div>

                            <div
                              className="progress"
                              style={{
                                height: "8px",
                              }}
                            >

                              <div
                                className="progress-bar bg-primary"
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />

                            </div>

                            <small className="text-muted">
                              {percentage}%
                            </small>

                          </div>
                        );
                      }
                    )

                  )}

                </div>

              </div>

            </div>

            {/* BOOKING SUMMARY */}

            <div className="col-12 col-lg-6">

              <div className="card border-0 shadow-sm rounded-4 h-100">

                <div className="card-body p-4">

                  <h5 className="fw-bold mb-1">
                    Booking Summary
                  </h5>

                  <p className="text-muted small mb-4">
                    Current EventBook booking performance.
                  </p>

                  <div className="row g-3">

                    <div className="col-6">

                      <div className="bg-light rounded-4 p-3">

                        <small className="text-muted">
                          Bookings
                        </small>

                        <h4 className="fw-bold mb-0 mt-2">
                          {report.totalBookings}
                        </h4>

                      </div>

                    </div>

                    <div className="col-6">

                      <div className="bg-light rounded-4 p-3">

                        <small className="text-muted">
                          Tickets
                        </small>

                        <h4 className="fw-bold mb-0 mt-2">
                          {report.totalTickets}
                        </h4>

                      </div>

                    </div>

                    <div className="col-12">

                      <div className="bg-success-subtle rounded-4 p-4">

                        <small className="text-success">
                          Total Revenue
                        </small>

                        <h2 className="fw-bold text-success mb-0 mt-2">
                          ₹
                          {report.totalRevenue.toLocaleString(
                            "en-IN"
                          )}
                        </h2>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </>

      )}

    </div>
  );
}

export default Reports;