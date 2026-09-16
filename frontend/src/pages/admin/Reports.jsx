import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

function Reports() {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================================================
     LOAD REPORT DATA
     ========================================================= */

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);

      /* =====================================================
         LOAD EVENTS
         ===================================================== */

      try {
        const eventsResponse = await api.get("/events");

        console.log(
          "REPORT EVENTS RESPONSE:",
          eventsResponse.data
        );

        const eventData =
          eventsResponse.data?.events ||
          eventsResponse.data?.data ||
          eventsResponse.data ||
          [];

        setEvents(
          Array.isArray(eventData)
            ? eventData
            : []
        );
      } catch (eventError) {
        console.error(
          "EVENT REPORT ERROR:",
          eventError.response?.data ||
            eventError.message
        );

        setEvents([]);
      }

      /* =====================================================
         LOAD ALL BOOKINGS
         ===================================================== */

      try {
        /*
          IMPORTANT:
          Admin reports use /bookings/all
          NOT /bookings
        */

        const bookingsResponse =
          await api.get("/bookings/all");

        console.log(
          "REPORT BOOKINGS RESPONSE:",
          bookingsResponse.data
        );

        const bookingData =
          bookingsResponse.data?.bookings ||
          bookingsResponse.data?.data ||
          bookingsResponse.data ||
          [];

        setBookings(
          Array.isArray(bookingData)
            ? bookingData
            : []
        );
      } catch (bookingError) {
        console.error(
          "BOOKING REPORT ERROR:",
          bookingError.response?.data ||
            bookingError.message
        );

        setBookings([]);
      }
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     REPORT CALCULATIONS
     ========================================================= */

  const report = useMemo(() => {
    /* -------------------------------------------------------
       CONFIRMED BOOKINGS
       ------------------------------------------------------- */

    const confirmedBookings = bookings.filter(
      (booking) =>
        String(
          booking?.status || "Confirmed"
        ).toLowerCase() === "confirmed"
    );

    /* -------------------------------------------------------
       TOTAL BOOKINGS
       ------------------------------------------------------- */

    const totalBookings =
      confirmedBookings.length;

    /* -------------------------------------------------------
       TOTAL TICKETS
       ------------------------------------------------------- */

    const totalTickets =
      confirmedBookings.reduce(
        (total, booking) => {
          const quantity = Number(
            booking?.quantity ??
              booking?.seats?.length ??
              0
          );

          return total + quantity;
        },
        0
      );

    /* -------------------------------------------------------
       TOTAL REVENUE
       ------------------------------------------------------- */

    const totalRevenue =
      confirmedBookings.reduce(
        (total, booking) => {
          const amount = Number(
            booking?.totalAmount ??
              booking?.amount ??
              0
          );

          return total + amount;
        },
        0
      );

    /* -------------------------------------------------------
       CATEGORY DATA
       ------------------------------------------------------- */

    const categoryMap = {};

    events.forEach((event) => {
      const category =
        event?.category || "Other";

      categoryMap[category] =
        (categoryMap[category] || 0) + 1;
    });

    const categories =
      Object.entries(categoryMap).sort(
        (a, b) => b[1] - a[1]
      );

    /* -------------------------------------------------------
       EVENT BOOKING PERFORMANCE
       ------------------------------------------------------- */

    const eventBookingMap = {};

    confirmedBookings.forEach((booking) => {
      const eventId =
        booking?.event?._id ||
        booking?.event?.id ||
        booking?.event;

      const eventTitle =
        booking?.event?.title ||
        "Unknown Event";

      const key =
        eventId || eventTitle;

      if (!eventBookingMap[key]) {
        eventBookingMap[key] = {
          title: eventTitle,
          tickets: 0,
          revenue: 0,
        };
      }

      const tickets = Number(
        booking?.quantity ??
          booking?.seats?.length ??
          0
      );

      const revenue = Number(
        booking?.totalAmount ??
          booking?.amount ??
          0
      );

      eventBookingMap[key].tickets +=
        tickets;

      eventBookingMap[key].revenue +=
        revenue;
    });

    const eventPerformance =
      Object.values(eventBookingMap)
        .sort(
          (a, b) =>
            b.revenue - a.revenue
        )
        .slice(0, 6);

    /* -------------------------------------------------------
       ACTIVE EVENTS
       ------------------------------------------------------- */

    const today = new Date();

    const activeEvents = events.filter(
      (event) => {
        if (!event?.date) {
          return true;
        }

        const eventDate = new Date(
          event.date
        );

        return !Number.isNaN(
          eventDate.getTime()
        ) && eventDate >= today;
      }
    ).length;

    return {
      totalBookings,
      totalTickets,
      totalRevenue,
      totalEvents: events.length,
      activeEvents,
      categories,
      eventPerformance,
    };
  }, [events, bookings]);

  /* =========================================================
     DONUT CHART DATA
     ========================================================= */

  const donutBackground = useMemo(() => {
    if (
      report.categories.length === 0 ||
      report.totalEvents === 0
    ) {
      return "#e2e8f0";
    }

    const chartColors = [
      "#2563eb",
      "#16a34a",
      "#f59e0b",
      "#dc2626",
      "#7c3aed",
      "#0891b2",
      "#db2777",
      "#64748b",
    ];

    let currentPercentage = 0;

    const segments =
      report.categories.map(
        ([category, count], index) => {
          const percentage =
            (count /
              report.totalEvents) *
            100;

          const start =
            currentPercentage;

          currentPercentage +=
            percentage;

          return `${chartColors[index % chartColors.length]} ${start}% ${currentPercentage}%`;
        }
      );

    return `conic-gradient(${segments.join(", ")})`;
  }, [
    report.categories,
    report.totalEvents,
  ]);

  /* =========================================================
     CATEGORY COLORS
     ========================================================= */

  const categoryColors = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#dc2626",
    "#7c3aed",
    "#0891b2",
    "#db2777",
    "#64748b",
  ];

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="reports-page container-fluid py-5">
        <div className="d-flex flex-column align-items-center justify-content-center">
          <div
            className="spinner-border text-primary"
            style={{
              width: "3rem",
              height: "3rem",
            }}
            role="status"
          />

          <h5 className="fw-semibold mt-4 mb-1">
            Preparing Analytics
          </h5>

          <p className="text-muted mb-0">
            Loading events and booking reports...
          </p>
        </div>

        <style>
          {`
            .reports-page {
              min-height: 100vh;
              background: #f8fafc;
            }
          `}
        </style>
      </div>
    );
  }

  /* =========================================================
     MAIN RETURN
     ========================================================= */

  return (
    <div className="reports-page container-fluid py-4 px-3 px-lg-4">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

        <div>
          <div className="d-flex align-items-center gap-3 mb-2">

            <div className="reports-header-icon">
              <i className="bi bi-bar-chart-line-fill"></i>
            </div>

            <div>
              <h2 className="fw-bold mb-0">
                Reports & Analytics
              </h2>

              <p className="text-muted mb-0 mt-1">
                Monitor bookings, ticket sales,
                events and revenue.
              </p>
            </div>

          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary rounded-3 px-4 py-2 shadow-sm"
          onClick={loadReports}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh Reports
        </button>

      </div>

      {/* =====================================================
          STAT CARDS
          ===================================================== */}

      <div className="row g-3 mb-4">

        {/* TOTAL BOOKINGS */}

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="report-stat-card card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-start">

                <div>
                  <span className="report-label">
                    TOTAL BOOKINGS
                  </span>

                  <h2 className="report-number mt-2 mb-1">
                    {report.totalBookings}
                  </h2>

                  <small className="text-success">
                    <i className="bi bi-check-circle-fill me-1"></i>
                    Confirmed bookings
                  </small>
                </div>

                <div className="report-icon report-icon-blue">
                  <i className="bi bi-calendar-check-fill"></i>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* TICKETS SOLD */}

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="report-stat-card card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-start">

                <div>
                  <span className="report-label">
                    TICKETS SOLD
                  </span>

                  <h2 className="report-number mt-2 mb-1">
                    {report.totalTickets}
                  </h2>

                  <small className="text-success">
                    <i className="bi bi-ticket-perforated-fill me-1"></i>
                    Seats booked
                  </small>
                </div>

                <div className="report-icon report-icon-green">
                  <i className="bi bi-ticket-perforated-fill"></i>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* REVENUE */}

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="report-stat-card card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-start">

                <div>
                  <span className="report-label">
                    TOTAL REVENUE
                  </span>

                  <h2 className="report-number mt-2 mb-1">
                    ₹
                    {report.totalRevenue.toLocaleString(
                      "en-IN"
                    )}
                  </h2>

                  <small className="text-success">
                    <i className="bi bi-graph-up-arrow me-1"></i>
                    Confirmed sales
                  </small>
                </div>

                <div className="report-icon report-icon-orange">
                  <i className="bi bi-currency-rupee"></i>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* ACTIVE EVENTS */}

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="report-stat-card card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-start">

                <div>
                  <span className="report-label">
                    ACTIVE EVENTS
                  </span>

                  <h2 className="report-number mt-2 mb-1">
                    {report.activeEvents}
                  </h2>

                  <small className="text-primary">
                    <i className="bi bi-stars me-1"></i>
                    Upcoming events
                  </small>
                </div>

                <div className="report-icon report-icon-purple">
                  <i className="bi bi-calendar-event-fill"></i>
                </div>

              </div>

            </div>
          </div>
        </div>

      </div>

      {/* =====================================================
          CHART SECTION
          ===================================================== */}

      <div className="row g-4 mb-4">

        {/* ===================================================
            EVENT PERFORMANCE
            =================================================== */}

        <div className="col-12 col-xl-8">

          <div className="card border-0 shadow-sm rounded-4 h-100">

            <div className="card-body p-4">

              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4">

                <div>
                  <h5 className="fw-bold mb-1">
                    Event Performance
                  </h5>

                  <p className="text-muted small mb-0">
                    Tickets sold across top events
                  </p>
                </div>

                <span className="report-badge">
                  <i className="bi bi-graph-up me-1"></i>
                  Top Events
                </span>

              </div>

              {report.eventPerformance.length === 0 ? (

                <div className="empty-chart">

                  <div className="empty-chart-icon">
                    <i className="bi bi-bar-chart"></i>
                  </div>

                  <h6 className="fw-semibold mt-3">
                    No booking data available
                  </h6>

                  <p className="text-muted small mb-0">
                    Event performance will appear
                    after bookings are made.
                  </p>

                </div>

              ) : (

                <div className="event-chart">

                  {report.eventPerformance.map(
                    (event, index) => {

                      const maxTickets =
                        Math.max(
                          ...report.eventPerformance.map(
                            (item) =>
                              item.tickets
                          ),
                          1
                        );

                      const width =
                        Math.max(
                          (event.tickets /
                            maxTickets) *
                            100,
                          event.tickets > 0
                            ? 5
                            : 0
                        );

                      return (
                        <div
                          className="event-chart-row"
                          key={`${event.title}-${index}`}
                        >

                          <div className="event-chart-label">

                            <div
                              className="event-rank"
                            >
                              {index + 1}
                            </div>

                            <div
                              className="event-name"
                              title={event.title}
                            >
                              {event.title}
                            </div>

                          </div>

                          <div className="event-bar-area">

                            <div className="event-bar-track">

                              <div
                                className="event-bar"
                                style={{
                                  width: `${width}%`,
                                }}
                              ></div>

                            </div>

                            <div className="event-stats">

                              <span className="ticket-count">
                                {event.tickets} tickets
                              </span>

                              <span className="event-revenue">
                                ₹
                                {Number(
                                  event.revenue || 0
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </span>

                            </div>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              )}

            </div>

          </div>

        </div>

        {/* ===================================================
            CATEGORY DONUT
            =================================================== */}

        <div className="col-12 col-xl-4">

          <div className="card border-0 shadow-sm rounded-4 h-100">

            <div className="card-body p-4">

              <h5 className="fw-bold mb-1">
                Event Distribution
              </h5>

              <p className="text-muted small mb-3">
                Events by category
              </p>

              {report.categories.length === 0 ? (

                <div className="empty-chart category-empty">

                  <div className="empty-chart-icon">
                    <i className="bi bi-pie-chart"></i>
                  </div>

                  <p className="text-muted mt-3 mb-0">
                    No category data
                  </p>

                </div>

              ) : (

                <>

                  <div className="donut-wrapper">

                    <div
                      className="donut-chart"
                      style={{
                        background:
                          donutBackground,
                      }}
                    >

                      <div className="donut-center">

                        <strong>
                          {report.totalEvents}
                        </strong>

                        <span>
                          Events
                        </span>

                      </div>

                    </div>

                  </div>

                  <div className="category-legend mt-4">

                    {report.categories.map(
                      (
                        [category, count],
                        index
                      ) => {

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
                            className="category-legend-item"
                            key={category}
                          >

                            <div className="d-flex align-items-center gap-2">

                              <span
                                className="legend-dot"
                                style={{
                                  background:
                                    categoryColors[
                                      index %
                                        categoryColors.length
                                    ],
                                }}
                              ></span>

                              <span className="category-name">
                                {category}
                              </span>

                            </div>

                            <div className="category-value">
                              {count}
                              <span>
                                {" "}
                                ({percentage}%)
                              </span>
                            </div>

                          </div>
                        );
                      }
                    )}

                  </div>

                </>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          SUMMARY + CATEGORY BREAKDOWN
          ===================================================== */}

      <div className="row g-4">

        {/* ===================================================
            BOOKING SUMMARY
            =================================================== */}

        <div className="col-12 col-lg-5">

          <div className="card border-0 shadow-sm rounded-4 h-100">

            <div className="card-body p-4">

              <div className="mb-4">

                <h5 className="fw-bold mb-1">
                  Booking Summary
                </h5>

                <p className="text-muted small mb-0">
                  Overall EventBook performance
                </p>

              </div>

              {/* CONFIRMED */}

              <div className="summary-item mb-3">

                <div className="d-flex justify-content-between align-items-center">

                  <div className="d-flex align-items-center gap-3">

                    <div className="summary-icon summary-blue">
                      <i className="bi bi-calendar-check"></i>
                    </div>

                    <span className="fw-semibold">
                      Confirmed Bookings
                    </span>

                  </div>

                  <strong>
                    {report.totalBookings}
                  </strong>

                </div>

              </div>

              {/* TICKETS */}

              <div className="summary-item mb-3">

                <div className="d-flex justify-content-between align-items-center">

                  <div className="d-flex align-items-center gap-3">

                    <div className="summary-icon summary-green">
                      <i className="bi bi-ticket"></i>
                    </div>

                    <span className="fw-semibold">
                      Tickets Sold
                    </span>

                  </div>

                  <strong>
                    {report.totalTickets}
                  </strong>

                </div>

              </div>

              {/* EVENTS */}

              <div className="summary-item mb-3">

                <div className="d-flex justify-content-between align-items-center">

                  <div className="d-flex align-items-center gap-3">

                    <div className="summary-icon summary-purple">
                      <i className="bi bi-calendar-event"></i>
                    </div>

                    <span className="fw-semibold">
                      Total Events
                    </span>

                  </div>

                  <strong>
                    {report.totalEvents}
                  </strong>

                </div>

              </div>

              {/* REVENUE */}

              <div className="revenue-box mt-4">

                <div className="d-flex justify-content-between align-items-center">

                  <div>

                    <small className="text-muted fw-semibold">
                      TOTAL REVENUE
                    </small>

                    <h2 className="fw-bold mb-0 mt-2">
                      ₹
                      {report.totalRevenue.toLocaleString(
                        "en-IN"
                      )}
                    </h2>

                    <small className="text-success">
                      <i className="bi bi-arrow-up-right me-1"></i>
                      Confirmed sales
                    </small>

                  </div>

                  <div className="revenue-icon">
                    <i className="bi bi-cash-stack"></i>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ===================================================
            CATEGORY BREAKDOWN
            =================================================== */}

        <div className="col-12 col-lg-7">

          <div className="card border-0 shadow-sm rounded-4 h-100">

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                  <h5 className="fw-bold mb-1">
                    Category Breakdown
                  </h5>

                  <p className="text-muted small mb-0">
                    Distribution of available events
                  </p>

                </div>

                <span className="report-total-badge">
                  {report.totalEvents} Total
                </span>

              </div>

              {report.categories.length === 0 ? (

                <div className="text-center py-5">

                  <div className="empty-chart-icon mx-auto">
                    <i className="bi bi-folder2-open"></i>
                  </div>

                  <p className="text-muted mt-3 mb-0">
                    No event categories available.
                  </p>

                </div>

              ) : (

                report.categories.map(
                  (
                    [category, count],
                    index
                  ) => {

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
                        className="category-row mb-4"
                      >

                        <div className="d-flex justify-content-between align-items-center mb-2">

                          <div className="d-flex align-items-center gap-2">

                            <span
                              className="category-dot"
                              style={{
                                background:
                                  categoryColors[
                                    index %
                                      categoryColors.length
                                  ],
                              }}
                            ></span>

                            <span className="fw-semibold">
                              {category}
                            </span>

                          </div>

                          <div>
                            <strong>
                              {count}
                            </strong>

                            <span className="text-muted ms-1 small">
                              events
                            </span>
                          </div>

                        </div>

                        <div
                          className="progress"
                          style={{
                            height: "8px",
                          }}
                        >

                          <div
                            className="progress-bar"
                            style={{
                              width: `${percentage}%`,
                              background:
                                categoryColors[
                                  index %
                                    categoryColors.length
                                ],
                              borderRadius:
                                "10px",
                            }}
                          ></div>

                        </div>

                        <div className="d-flex justify-content-between mt-1">

                          <small className="text-muted">
                            Event category
                          </small>

                          <small className="text-muted fw-semibold">
                            {percentage}%
                          </small>

                        </div>

                      </div>
                    );
                  }
                )

              )}

            </div>

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

          .reports-page {
            min-height: 100vh;
            background: #f8fafc;
          }

          /* =================================================
             HEADER
             ================================================= */

          .reports-header-icon {
            width: 48px;
            height: 48px;
            border-radius: 14px;
            background: #eff6ff;
            color: #2563eb;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 21px;
            flex-shrink: 0;
          }

          /* =================================================
             STAT CARDS
             ================================================= */

          .report-stat-card {
            background: #ffffff;
            transition:
              transform 0.25s ease,
              box-shadow 0.25s ease;
          }

          .report-stat-card:hover {
            transform: translateY(-4px);
            box-shadow:
              0 15px 35px
              rgba(15, 23, 42, 0.10) !important;
          }

          .report-label {
            color: #64748b;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.5px;
          }

          .report-number {
            color: #0f172a;
            font-size: 30px;
            line-height: 1.1;
          }

          .report-icon {
            width: 50px;
            height: 50px;
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            flex-shrink: 0;
          }

          .report-icon-blue {
            background: #eff6ff;
            color: #2563eb;
          }

          .report-icon-green {
            background: #f0fdf4;
            color: #16a34a;
          }

          .report-icon-orange {
            background: #fffbeb;
            color: #d97706;
          }

          .report-icon-purple {
            background: #f5f3ff;
            color: #7c3aed;
          }

          /* =================================================
             BADGES
             ================================================= */

          .report-badge {
            display: inline-flex;
            align-items: center;
            padding: 8px 14px;
            border-radius: 50px;
            background: #eff6ff;
            color: #2563eb;
            font-size: 12px;
            font-weight: 700;
          }

          .report-total-badge {
            background: #f1f5f9;
            color: #334155;
            border-radius: 50px;
            padding: 8px 14px;
            font-size: 12px;
            font-weight: 700;
            white-space: nowrap;
          }

          /* =================================================
             EVENT PERFORMANCE GRAPH
             ================================================= */

          .event-chart {
            width: 100%;
            padding-top: 5px;
          }

          .event-chart-row {
            display: grid;
            grid-template-columns: 210px 1fr;
            gap: 20px;
            align-items: center;
            margin-bottom: 22px;
          }

          .event-chart-row:last-child {
            margin-bottom: 0;
          }

          .event-chart-label {
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 0;
          }

          .event-rank {
            width: 30px;
            height: 30px;
            border-radius: 9px;
            background: #eff6ff;
            color: #2563eb;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 800;
            flex-shrink: 0;
          }

          .event-name {
            font-size: 14px;
            font-weight: 600;
            color: #334155;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .event-bar-area {
            min-width: 0;
          }

          .event-bar-track {
            height: 12px;
            width: 100%;
            background: #f1f5f9;
            border-radius: 50px;
            overflow: hidden;
          }

          .event-bar {
            height: 100%;
            min-width: 0;
            background: linear-gradient(
              90deg,
              #2563eb,
              #60a5fa
            );
            border-radius: 50px;
            transition: width 0.6s ease;
          }

          .event-stats {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 7px;
            gap: 10px;
          }

          .ticket-count {
            color: #64748b;
            font-size: 11px;
            font-weight: 600;
          }

          .event-revenue {
            color: #16a34a;
            font-size: 11px;
            font-weight: 700;
          }

          /* =================================================
             DONUT CHART
             ================================================= */

          .donut-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 8px 0;
          }

          .donut-chart {
            width: 190px;
            height: 190px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            box-shadow:
              0 8px 25px
              rgba(15, 23, 42, 0.08);
          }

          .donut-chart::before {
            content: "";
            position: absolute;
            width: 125px;
            height: 125px;
            border-radius: 50%;
            background: #ffffff;
          }

          .donut-center {
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          .donut-center strong {
            color: #0f172a;
            font-size: 28px;
            line-height: 1;
          }

          .donut-center span {
            color: #64748b;
            font-size: 12px;
            margin-top: 5px;
          }

          /* =================================================
             CATEGORY LEGEND
             ================================================= */

          .category-legend {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .category-legend-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            padding: 8px 10px;
            border-radius: 10px;
            transition: 0.2s ease;
          }

          .category-legend-item:hover {
            background: #f8fafc;
          }

          .legend-dot {
            width: 9px;
            height: 9px;
            border-radius: 50%;
            flex-shrink: 0;
          }

          .category-name {
            color: #334155;
            font-size: 13px;
            font-weight: 600;
          }

          .category-value {
            color: #0f172a;
            font-size: 13px;
            font-weight: 700;
          }

          .category-value span {
            color: #94a3b8;
            font-weight: 500;
          }

          /* =================================================
             EMPTY CHART
             ================================================= */

          .empty-chart {
            min-height: 300px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          }

          .category-empty {
            min-height: 260px;
          }

          .empty-chart-icon {
            width: 64px;
            height: 64px;
            border-radius: 18px;
            background: #f1f5f9;
            color: #94a3b8;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
          }

          /* =================================================
             SUMMARY
             ================================================= */

          .summary-item {
            background: #f8fafc;
            border-radius: 14px;
            padding: 15px;
            transition:
              background 0.2s ease,
              transform 0.2s ease;
          }

          .summary-item:hover {
            background: #f1f5f9;
            transform: translateX(3px);
          }

          .summary-icon {
            width: 42px;
            height: 42px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .summary-blue {
            background: #eff6ff;
            color: #2563eb;
          }

          .summary-green {
            background: #f0fdf4;
            color: #16a34a;
          }

          .summary-purple {
            background: #f5f3ff;
            color: #7c3aed;
          }

          /* =================================================
             REVENUE BOX
             ================================================= */

          .revenue-box {
            background: linear-gradient(
              135deg,
              #eff6ff,
              #f0fdf4
            );
            border-radius: 18px;
            padding: 22px;
            border: 1px solid #e2e8f0;
          }

          .revenue-icon {
            width: 54px;
            height: 54px;
            border-radius: 15px;
            background: #ffffff;
            color: #2563eb;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 23px;
            box-shadow:
              0 5px 15px
              rgba(15, 23, 42, 0.07);
          }

          /* =================================================
             CATEGORY BREAKDOWN
             ================================================= */

          .category-row {
            transition:
              transform 0.2s ease;
          }

          .category-row:hover {
            transform: translateX(3px);
          }

          .category-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            display: inline-block;
            flex-shrink: 0;
          }

          /* =================================================
             RESPONSIVE
             ================================================= */

          @media (max-width: 991.98px) {

            .event-chart-row {
              grid-template-columns:
                170px 1fr;
              gap: 15px;
            }

          }

          @media (max-width: 767.98px) {

            .reports-page {
              padding-top: 20px !important;
            }

            .reports-header-icon {
              width: 44px;
              height: 44px;
              font-size: 18px;
            }

            .report-number {
              font-size: 26px;
            }

            .event-chart-row {
              grid-template-columns: 1fr;
              gap: 8px;
              margin-bottom: 24px;
            }

            .event-chart-label {
              width: 100%;
            }

            .event-bar-track {
              height: 10px;
            }

            .donut-chart {
              width: 170px;
              height: 170px;
            }

            .donut-chart::before {
              width: 112px;
              height: 112px;
            }

          }

          @media (max-width: 575.98px) {

            .reports-page {
              padding-left: 12px !important;
              padding-right: 12px !important;
            }

            .report-stat-card .card-body {
              padding: 18px !important;
            }

            .report-icon {
              width: 44px;
              height: 44px;
              font-size: 18px;
            }

            .report-number {
              font-size: 24px;
            }

            .event-stats {
              flex-direction: column;
              align-items: flex-start;
              gap: 3px;
            }

            .donut-chart {
              width: 155px;
              height: 155px;
            }

            .donut-chart::before {
              width: 102px;
              height: 102px;
            }

            .revenue-box {
              padding: 18px;
            }

          }

        `}
      </style>

    </div>
  );
}

export default Reports;