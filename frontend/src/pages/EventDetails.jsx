import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getEventById } from "../services/eventService";

function EventDetails() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getEventById(id);

        setEvent(data?.event || data);
      } catch (error) {
        console.error("EVENT DETAILS ERROR:", error);

        setError(
          "Unable to load event details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  /* =========================================================
     FORMAT DATE
     ========================================================= */

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    /*
      Prevent timezone problems for values such as:
      2026-09-13T00:00:00.000Z
    */

    if (
      typeof date === "string" &&
      /^\d{4}-\d{2}-\d{2}/.test(date)
    ) {
      const datePart = date.substring(0, 10);

      const [year, month, day] =
        datePart.split("-").map(Number);

      if (year && month && day) {
        return new Date(
          year,
          month - 1,
          day
        ).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return String(date);
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* =========================================================
     FORMAT TIME
     ========================================================= */

  const formatTime = (time) => {
    if (!time) {
      return "Not available";
    }

    const timeString = String(time).trim();

    /*
      If already formatted as AM/PM,
      return it directly.
    */

    if (
      timeString.toLowerCase().includes("am") ||
      timeString.toLowerCase().includes("pm")
    ) {
      return timeString;
    }

    const parts = timeString.split(":");

    if (parts.length < 2) {
      return timeString;
    }

    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes)
    ) {
      return timeString;
    }

    const date = new Date();

    date.setHours(
      hours,
      minutes,
      0,
      0
    );

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  /* =========================================================
     FORMAT CURRENCY
     ========================================================= */

  const formatCurrency = (amount) => {
    const value = Number(amount);

    if (Number.isNaN(value)) {
      return "0";
    }

    return value.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });
  };

  /* =========================================================
     LOADING STATE
     ========================================================= */

  if (loading) {
    return (
      <>
        <style>{`
          .event-loading-page {
            min-height: 100vh;
            background: #f8fafc;
          }

          .event-skeleton {
            background: linear-gradient(
              90deg,
              #f1f5f9 25%,
              #e2e8f0 50%,
              #f1f5f9 75%
            );
            background-size: 200% 100%;
            animation: eventSkeleton 1.5s infinite;
            border-radius: 12px;
          }

          @keyframes eventSkeleton {
            0% {
              background-position: 200% 0;
            }

            100% {
              background-position: -200% 0;
            }
          }
        `}</style>

        <div className="event-loading-page">
          <div className="container py-4 py-md-5">

            <div
              className="event-skeleton mb-4"
              style={{
                width: "150px",
                height: "42px",
              }}
            />

            <div
              className="event-skeleton mb-4"
              style={{
                width: "100%",
                height: "420px",
              }}
            />

            <div className="row g-4">

              <div className="col-lg-8">

                <div
                  className="event-skeleton mb-3"
                  style={{
                    width: "180px",
                    height: "30px",
                  }}
                />

                <div
                  className="event-skeleton mb-3"
                  style={{
                    width: "75%",
                    height: "45px",
                  }}
                />

                <div
                  className="event-skeleton"
                  style={{
                    width: "100%",
                    height: "100px",
                  }}
                />

              </div>

              <div className="col-lg-4">

                <div
                  className="event-skeleton"
                  style={{
                    width: "100%",
                    height: "220px",
                  }}
                />

              </div>

            </div>

          </div>
        </div>
      </>
    );
  }

  /* =========================================================
     ERROR STATE
     ========================================================= */

  if (error) {
    return (
      <>
        <style>{`
          .event-error-page {
            min-height: 100vh;
            background:
              radial-gradient(
                circle at top right,
                rgba(239, 68, 68, 0.08),
                transparent 35%
              ),
              #f8fafc;
            display: flex;
            align-items: center;
          }

          .event-error-card {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 24px;
            box-shadow:
              0 20px 50px rgba(15, 23, 42, 0.08);
          }

          .event-error-icon {
            width: 76px;
            height: 76px;
            border-radius: 50%;
            background: #fef2f2;
            color: #dc2626;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
            font-weight: 800;
            margin: 0 auto 20px;
          }
        `}</style>

        <div className="event-error-page">
          <div className="container py-5">

            <div className="row justify-content-center">

              <div className="col-12 col-sm-10 col-md-7 col-lg-5">

                <div className="event-error-card p-4 p-md-5 text-center">

                  <div className="event-error-icon">
                    !
                  </div>

                  <h2 className="fw-bold text-dark mb-2">
                    Something Went Wrong
                  </h2>

                  <p className="text-muted mb-4">
                    {error}
                  </p>

                  <Link
                    to="/events"
                    className="btn btn-primary px-4 py-2 rounded-3 fw-semibold"
                  >
                    ← Back to Events
                  </Link>

                </div>

              </div>

            </div>

          </div>
        </div>
      </>
    );
  }

  /* =========================================================
     EVENT NOT FOUND
     ========================================================= */

  if (!event) {
    return (
      <>
        <style>{`
          .event-not-found-page {
            min-height: 100vh;
            background: #f8fafc;
          }

          .event-not-found-card {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 24px;
            box-shadow:
              0 20px 50px rgba(15, 23, 42, 0.08);
          }

          .event-not-found-icon {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: #fff7ed;
            color: #f97316;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            font-weight: 800;
            margin: 0 auto 20px;
          }
        `}</style>

        <div className="event-not-found-page">
          <div className="container py-5">

            <div className="row justify-content-center">

              <div className="col-12 col-sm-10 col-md-7 col-lg-5">

                <div className="event-not-found-card p-4 p-md-5 text-center">

                  <div className="event-not-found-icon">
                    ?
                  </div>

                  <h2 className="fw-bold mb-2">
                    Event Not Found
                  </h2>

                  <p className="text-muted mb-4">
                    The event you're looking for
                    may have been removed or is no
                    longer available.
                  </p>

                  <Link
                    to="/events"
                    className="btn btn-primary px-4 py-2 rounded-3 fw-semibold"
                  >
                    Browse Events
                  </Link>

                </div>

              </div>

            </div>

          </div>
        </div>
      </>
    );
  }

  /* =========================================================
     EVENT DATA
     ========================================================= */

  const formattedDate = formatDate(event.date);
  const formattedTime = formatTime(event.time);

  const ticketPrice =
    Number(event.ticketPrice) || 0;

  const totalSeats =
    Number(event.totalSeats) || 0;

  const availableSeats =
    Number(event.availableSeats ?? totalSeats);

  const seatsPercentage =
    totalSeats > 0
      ? Math.max(
          0,
          Math.min(
            100,
            (availableSeats / totalSeats) * 100
          )
        )
      : 0;

  const soldSeats =
    Math.max(
      0,
      totalSeats - availableSeats
    );

  const noSeatsAvailable =
    availableSeats <= 0;

  const lowAvailability =
    availableSeats > 0 &&
    availableSeats <=
      Math.max(5, Math.ceil(totalSeats * 0.15));

  const eventImage =
    event.banner ||
    "https://placehold.co/1200x650?text=Event";

  return (
    <>
      <style>{`
        .event-details-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at top right,
              rgba(37, 99, 235, 0.07),
              transparent 32%
            ),
            radial-gradient(
              circle at bottom left,
              rgba(16, 185, 129, 0.05),
              transparent 30%
            ),
            #f8fafc;
        }

        .event-details-wrapper {
          max-width: 1180px;
          margin: 0 auto;
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 10px;
          font-weight: 600;
          padding: 9px 15px;
          transition: all 0.2s ease;
        }

        .back-button:hover {
          transform: translateX(-2px);
        }

        .event-hero {
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow:
            0 20px 55px rgba(15, 23, 42, 0.10);
        }

        .event-hero-image-wrapper {
          position: relative;
          width: 100%;
          height: 460px;
          overflow: hidden;
          background: #e2e8f0;
        }

        .event-hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }

        .event-hero:hover .event-hero-image {
          transform: scale(1.015);
        }

        .event-image-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              to bottom,
              rgba(15, 23, 42, 0.05),
              rgba(15, 23, 42, 0.55)
            );
          pointer-events: none;
        }

        .event-category-badge {
          position: absolute;
          top: 22px;
          left: 22px;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255, 255, 255, 0.94);
          color: #1d4ed8;
          border: 1px solid rgba(255, 255, 255, 0.75);
          border-radius: 999px;
          padding: 8px 14px;
          font-size: 13px;
          font-weight: 750;
          box-shadow:
            0 8px 25px rgba(15, 23, 42, 0.15);
          backdrop-filter: blur(8px);
        }

        .event-image-title {
          position: absolute;
          left: 28px;
          right: 28px;
          bottom: 28px;
          z-index: 2;
          color: #ffffff;
        }

        .event-image-title h1 {
          font-size: clamp(28px, 5vw, 48px);
          line-height: 1.08;
          letter-spacing: -1px;
          margin: 0;
          font-weight: 800;
          text-shadow:
            0 3px 15px rgba(0, 0, 0, 0.22);
        }

        .event-content-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          box-shadow:
            0 14px 40px rgba(15, 23, 42, 0.06);
        }

        .event-content-card h2 {
          color: #0f172a;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.3px;
        }

        .event-description {
          color: #64748b;
          line-height: 1.8;
          font-size: 15px;
          white-space: pre-line;
        }

        .event-info-item {
          height: 100%;
          padding: 18px;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 15px;
          transition: all 0.2s ease;
        }

        .event-info-item:hover {
          background: #f8fbff;
          border-color: #bfdbfe;
          transform: translateY(-2px);
        }

        .event-info-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eff6ff;
          color: #2563eb;
          font-size: 19px;
          flex-shrink: 0;
        }

        .event-info-label {
          display: block;
          color: #64748b;
          font-size: 12px;
          font-weight: 650;
          margin-bottom: 5px;
        }

        .event-info-value {
          display: block;
          color: #0f172a;
          font-size: 14px;
          font-weight: 750;
          line-height: 1.45;
          word-break: break-word;
        }

        .booking-card {
          position: sticky;
          top: 90px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          box-shadow:
            0 18px 45px rgba(15, 23, 42, 0.08);
          overflow: hidden;
        }

        .booking-card-header {
          padding: 20px 22px;
          background:
            linear-gradient(
              135deg,
              #eff6ff,
              #f8fafc
            );
          border-bottom: 1px solid #e5e7eb;
        }

        .booking-card-body {
          padding: 22px;
        }

        .price-label {
          color: #64748b;
          font-size: 12px;
          font-weight: 650;
          margin-bottom: 3px;
        }

        .price-value {
          color: #1d4ed8;
          font-size: 30px;
          line-height: 1;
          font-weight: 850;
        }

        .price-per-ticket {
          color: #94a3b8;
          font-size: 12px;
          margin-top: 6px;
        }

        .availability-card {
          padding: 15px;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
        }

        .availability-label {
          color: #475569;
          font-size: 12px;
          font-weight: 650;
        }

        .availability-value {
          color: #0f172a;
          font-size: 15px;
          font-weight: 800;
        }

        .availability-bar {
          height: 7px;
          background: #e2e8f0;
          border-radius: 999px;
          overflow: hidden;
        }

        .availability-progress {
          height: 100%;
          border-radius: 999px;
          background:
            linear-gradient(
              90deg,
              #2563eb,
              #60a5fa
            );
        }

        .low-stock {
          color: #d97706;
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 10px;
          padding: 9px 11px;
          font-size: 12px;
          font-weight: 700;
        }

        .sold-out {
          color: #dc2626;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 13px;
          font-weight: 750;
        }

        .book-now-button {
          min-height: 52px;
          border-radius: 13px;
          font-weight: 800;
          font-size: 15px;
          box-shadow:
            0 10px 25px rgba(37, 99, 235, 0.20);
          transition: all 0.2s ease;
        }

        .book-now-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow:
            0 14px 30px rgba(37, 99, 235, 0.25);
        }

        .book-now-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          box-shadow: none;
        }

        .secure-note {
          color: #94a3b8;
          font-size: 11px;
          text-align: center;
          line-height: 1.5;
        }

        .event-meta-strip {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .meta-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 11px;
          border-radius: 10px;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          color: #475569;
          font-size: 12px;
          font-weight: 650;
        }

        @media (max-width: 991.98px) {
          .booking-card {
            position: static;
          }

          .event-hero-image-wrapper {
            height: 400px;
          }
        }

        @media (max-width: 767.98px) {
          .event-details-page {
            background: #f8fafc;
          }

          .event-hero {
            border-radius: 18px;
          }

          .event-hero-image-wrapper {
            height: 310px;
          }

          .event-category-badge {
            top: 16px;
            left: 16px;
            padding: 7px 11px;
          }

          .event-image-title {
            left: 18px;
            right: 18px;
            bottom: 20px;
          }

          .event-image-title h1 {
            font-size: 30px;
          }

          .event-content-card,
          .booking-card {
            border-radius: 17px;
          }

          .event-content-card {
            padding: 20px !important;
          }

          .booking-card-body {
            padding: 20px;
          }
        }

        @media (max-width: 575.98px) {
          .event-hero-image-wrapper {
            height: 260px;
          }

          .event-image-title h1 {
            font-size: 26px;
          }

          .event-image-title {
            bottom: 17px;
          }

          .back-button {
            width: 100%;
            justify-content: center;
          }

          .event-info-item {
            padding: 15px;
          }

          .price-value {
            font-size: 28px;
          }
        }
      `}</style>

      <div className="event-details-page">

        <div className="container py-4 py-md-5">

          <div className="event-details-wrapper">

            {/* =================================================
                BACK BUTTON
                ================================================= */}

            <div className="mb-4">

              <Link
                to="/events"
                className="btn btn-outline-secondary back-button"
              >
                <span>←</span>
                <span>Back to Events</span>
              </Link>

            </div>

            {/* =================================================
                EVENT HERO
                ================================================= */}

            <div className="event-hero mb-4 mb-lg-5">

              <div className="event-hero-image-wrapper">

                <img
                  src={eventImage}
                  alt={event.title || "Event"}
                  className="event-hero-image"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "https://placehold.co/1200x650?text=No+Event+Image";
                  }}
                />

                <div className="event-image-overlay" />

                <div className="event-category-badge">
                  <span>●</span>
                  <span>
                    {event.category || "Event"}
                  </span>
                </div>

                <div className="event-image-title">

                  <div className="event-meta-strip mb-3">

                    <span className="meta-chip">
                      📅 {formattedDate}
                    </span>

                    <span className="meta-chip">
                      ⏰ {formattedTime}
                    </span>

                  </div>

                  <h1>
                    {event.title || "Event Details"}
                  </h1>

                </div>

              </div>

            </div>

            {/* =================================================
                MAIN CONTENT
                ================================================= */}

            <div className="row g-4 g-lg-5 align-items-start">

              {/* =================================================
                  LEFT CONTENT
                  ================================================= */}

              <div className="col-12 col-lg-8">

                <div className="event-content-card p-4 p-md-4 p-lg-5">

                  {/* ABOUT EVENT */}

                  <div className="mb-4">

                    <h2 className="mb-3">
                      About This Event
                    </h2>

                    <p className="event-description mb-0">
                      {event.description ||
                        "No description is available for this event."}
                    </p>

                  </div>

                  <hr className="my-4 border-secondary-subtle" />

                  {/* EVENT INFORMATION */}

                  <div>

                    <h2 className="mb-3">
                      Event Information
                    </h2>

                    <div className="row g-3">

                      {/* DATE */}

                      <div className="col-12 col-sm-6">

                        <div className="event-info-item">

                          <div className="d-flex gap-3 align-items-start">

                            <div className="event-info-icon">
                              📅
                            </div>

                            <div>

                              <span className="event-info-label">
                                Date
                              </span>

                              <span className="event-info-value">
                                {formattedDate}
                              </span>

                            </div>

                          </div>

                        </div>

                      </div>

                      {/* TIME */}

                      <div className="col-12 col-sm-6">

                        <div className="event-info-item">

                          <div className="d-flex gap-3 align-items-start">

                            <div className="event-info-icon">
                              ⏰
                            </div>

                            <div>

                              <span className="event-info-label">
                                Time
                              </span>

                              <span className="event-info-value">
                                {formattedTime}
                              </span>

                            </div>

                          </div>

                        </div>

                      </div>

                      {/* VENUE */}

                      <div className="col-12 col-sm-6">

                        <div className="event-info-item">

                          <div className="d-flex gap-3 align-items-start">

                            <div className="event-info-icon">
                              📍
                            </div>

                            <div>

                              <span className="event-info-label">
                                Venue
                              </span>

                              <span className="event-info-value">
                                {event.venue ||
                                  "Not available"}
                              </span>

                            </div>

                          </div>

                        </div>

                      </div>

                      {/* LOCATION */}

                      <div className="col-12 col-sm-6">

                        <div className="event-info-item">

                          <div className="d-flex gap-3 align-items-start">

                            <div className="event-info-icon">
                              🌍
                            </div>

                            <div>

                              <span className="event-info-label">
                                Location
                              </span>

                              <span className="event-info-value">
                                {event.location ||
                                  "Not available"}
                              </span>

                            </div>

                          </div>

                        </div>

                      </div>

                      {/* TOTAL SEATS */}

                      <div className="col-12 col-sm-6">

                        <div className="event-info-item">

                          <div className="d-flex gap-3 align-items-start">

                            <div className="event-info-icon">
                              💺
                            </div>

                            <div>

                              <span className="event-info-label">
                                Total Seats
                              </span>

                              <span className="event-info-value">
                                {totalSeats}
                              </span>

                            </div>

                          </div>

                        </div>

                      </div>

                      {/* AVAILABLE SEATS */}

                      <div className="col-12 col-sm-6">

                        <div className="event-info-item">

                          <div className="d-flex gap-3 align-items-start">

                            <div className="event-info-icon">
                              🎟️
                            </div>

                            <div>

                              <span className="event-info-label">
                                Available Seats
                              </span>

                              <span
                                className="event-info-value"
                                style={{
                                  color:
                                    noSeatsAvailable
                                      ? "#dc2626"
                                      : lowAvailability
                                      ? "#d97706"
                                      : "#059669",
                                }}
                              >
                                {availableSeats}
                              </span>

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

              {/* =================================================
                  RIGHT BOOKING CARD
                  ================================================= */}

              <div className="col-12 col-lg-4">

                <div className="booking-card">

                  <div className="booking-card-header">

                    <div className="d-flex justify-content-between align-items-start gap-3">

                      <div>

                        <div className="small text-muted fw-semibold mb-1">
                          BOOK YOUR TICKET
                        </div>

                        <h3 className="h5 fw-bold mb-0 text-dark">
                          Secure Your Seat
                        </h3>

                      </div>

                      <div
                        style={{
                          fontSize: "24px",
                        }}
                      >
                        🎫
                      </div>

                    </div>

                  </div>

                  <div className="booking-card-body">

                    {/* PRICE */}

                    <div className="mb-4">

                      <div className="price-label">
                        Ticket Price
                      </div>

                      <div className="price-value">
                        ₹{formatCurrency(ticketPrice)}
                      </div>

                      <div className="price-per-ticket">
                        Price per ticket
                      </div>

                    </div>

                    {/* AVAILABILITY */}

                    <div className="availability-card mb-3">

                      <div className="d-flex justify-content-between align-items-center mb-2">

                        <span className="availability-label">
                          Seat Availability
                        </span>

                        <span className="availability-value">
                          {availableSeats}/{totalSeats}
                        </span>

                      </div>

                      <div className="availability-bar mb-2">

                        <div
                          className="availability-progress"
                          style={{
                            width: `${seatsPercentage}%`,
                          }}
                        />

                      </div>

                      <div className="d-flex justify-content-between">

                        <span className="small text-muted">
                          {soldSeats} booked
                        </span>

                        <span className="small text-muted">
                          {availableSeats} available
                        </span>

                      </div>

                    </div>

                    {/* LOW AVAILABILITY */}

                    {lowAvailability && (
                      <div className="low-stock mb-3">
                        ⚡ Only {availableSeats} seats
                        remaining. Book soon!
                      </div>
                    )}

                    {/* SOLD OUT */}

                    {noSeatsAvailable && (
                      <div className="sold-out mb-3">
                        ⚠️ This event is currently
                        sold out.
                      </div>
                    )}

                    {/* BOOK BUTTON */}

                    <Link
                      to={
                        noSeatsAvailable
                          ? "#"
                          : `/booking/${event._id}`
                      }
                      className={`btn btn-primary book-now-button w-100 d-flex align-items-center justify-content-center ${
                        noSeatsAvailable
                          ? "disabled"
                          : ""
                      }`}
                      onClick={(e) => {
                        if (noSeatsAvailable) {
                          e.preventDefault();
                        }
                      }}
                      aria-disabled={noSeatsAvailable}
                    >
                      {noSeatsAvailable
                        ? "Sold Out"
                        : "Book Now →"}
                    </Link>

                    <div className="secure-note mt-3">
                      🔒 Secure booking • Instant
                      confirmation • Digital ticket
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}

export default EventDetails;

