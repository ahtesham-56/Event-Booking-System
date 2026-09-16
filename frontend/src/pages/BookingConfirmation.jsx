import { useState } from "react";
import html2pdf from "html2pdf.js";
import { Link, useLocation } from "react-router-dom";

function BookingConfirmation() {
  const location = useLocation();

  const [downloading, setDownloading] = useState(false);

  const booking = location.state?.booking;
  const eventFromState = location.state?.event;

  /* =========================================================
     BOOKING DATA
     ========================================================= */

  const bookingId =
    booking?._id ||
    booking?.id ||
    "N/A";

  const eventTitle =
    booking?.event?.title ||
    booking?.eventTitle ||
    eventFromState?.title ||
    "Event Booking";

  const seats =
    Array.isArray(booking?.seats) &&
    booking.seats.length > 0
      ? booking.seats.join(", ")
      : "Selected";

  const ticketCount =
    booking?.quantity ||
    (Array.isArray(booking?.seats)
      ? booking.seats.length
      : 0);

  const totalAmount =
    booking?.totalAmount ??
    booking?.amount ??
    0;

  const status =
    booking?.status ||
    "Confirmed";

  const statusLower =
    String(status).toLowerCase();

  /* =========================================================
     EVENT INFORMATION
     ========================================================= */

  const eventDate =
    booking?.event?.date ||
    booking?.date ||
    eventFromState?.date ||
    "";

  const eventTime =
    booking?.event?.time ||
    booking?.time ||
    eventFromState?.time ||
    "";

  const eventVenue =
    booking?.event?.venue ||
    booking?.venue ||
    eventFromState?.venue ||
    "Venue not available";

  const eventLocation =
    booking?.event?.location ||
    booking?.location ||
    eventFromState?.location ||
    "";

  /* =========================================================
     BOOKING ID
     ========================================================= */

  const displayBookingId =
    bookingId !== "N/A"
      ? `EB-${String(bookingId)
          .slice(-8)
          .toUpperCase()}`
      : "N/A";

  /* =========================================================
     FORMAT DATE
     ========================================================= */

  const formatDate = (date) => {
    if (!date) {
      return "Date not available";
    }

    /*
      Handle YYYY-MM-DD manually so browser timezone
      conversion does not move the date backward/forward.
    */
    if (
      typeof date === "string" &&
      /^\d{4}-\d{2}-\d{2}/.test(date)
    ) {
      const datePart = date.substring(0, 10);

      const [year, month, day] =
        datePart.split("-").map(Number);

      if (
        year &&
        month &&
        day
      ) {
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

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =========================================================
     FORMAT TIME
     ========================================================= */

  const formatTime = (time) => {
    if (!time) {
      return "Time not available";
    }

    const timeString = String(time).trim();

    /*
      Already formatted:
      06:30 PM
      6:30 PM
    */
    if (
      timeString.toLowerCase().includes("am") ||
      timeString.toLowerCase().includes("pm")
    ) {
      return timeString;
    }

    /*
      Handle:
      18:30
      18:30:00
    */
    const parts = timeString.split(":");

    if (
      parts.length < 2
    ) {
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

    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    );
  };

  /* =========================================================
     FORMAT CURRENCY
     ========================================================= */

  const formatCurrency = (amount) => {
    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount)) {
      return String(amount || 0);
    }

    return numericAmount.toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2,
      }
    );
  };

  /* =========================================================
     STATUS STYLING
     ========================================================= */

  const isCancelled =
    statusLower === "cancelled" ||
    statusLower === "canceled";

  const statusConfig = isCancelled
    ? {
        background: "#fef2f2",
        color: "#dc2626",
        border: "#fecaca",
        icon: "×",
        label: "Cancelled",
      }
    : {
        background: "#ecfdf5",
        color: "#059669",
        border: "#a7f3d0",
        icon: "✓",
        label: status,
      };

  /* =========================================================
     DOWNLOAD RECEIPT
     ========================================================= */

  const downloadReceipt = async () => {
    const element =
      document.getElementById(
        "ticket-receipt"
      );

    if (!element) {
      alert(
        "Unable to generate ticket receipt."
      );
      return;
    }

    try {
      setDownloading(true);

      const options = {
        margin: [8, 8, 8, 8],

        filename:
          `EventBook-Ticket-${displayBookingId}.pdf`,

        image: {
          type: "jpeg",
          quality: 0.98,
        },

        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        },

        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },

        pagebreak: {
          mode: [
            "avoid-all",
            "css",
            "legacy",
          ],
        },
      };

      await html2pdf()
        .set(options)
        .from(element)
        .save();
    } catch (error) {
      console.error(
        "PDF DOWNLOAD ERROR:",
        error
      );

      alert(
        "Unable to download the ticket. Please try again."
      );
    } finally {
      setDownloading(false);
    }
  };

  /* =========================================================
     NO BOOKING STATE
     ========================================================= */

  if (!booking) {
    return (
      <>
        <style>{`
          .booking-empty-page {
            min-height: 100vh;
            background:
              radial-gradient(
                circle at top right,
                rgba(37, 99, 235, 0.08),
                transparent 35%
              ),
              #f8fafc;
            display: flex;
            align-items: center;
          }

          .booking-empty-card {
            border: 1px solid #e5e7eb;
            border-radius: 24px;
            background: #ffffff;
            box-shadow:
              0 20px 50px rgba(15, 23, 42, 0.08);
          }

          .empty-icon {
            width: 82px;
            height: 82px;
            border-radius: 50%;
            background: #fff7ed;
            color: #f97316;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 34px;
            margin: 0 auto 24px;
          }
        `}</style>

        <div className="booking-empty-page">
          <div className="container py-5">
            <div className="row justify-content-center">
              <div className="col-12 col-sm-10 col-md-8 col-lg-6">
                <div className="booking-empty-card">
                  <div className="p-4 p-md-5 text-center">

                    <div className="empty-icon">
                      !
                    </div>

                    <h2 className="fw-bold mb-2">
                      Booking Details Not Found
                    </h2>

                    <p className="text-muted mb-4">
                      We couldn't find the booking
                      information for this page.
                      Please open your booking from
                      the My Bookings section.
                    </p>

                    <Link
                      to="/my-bookings"
                      className="btn btn-primary px-4 py-2 rounded-3 fw-semibold"
                    >
                      View My Bookings
                    </Link>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* =========================================================
     MAIN PAGE
     ========================================================= */

  return (
    <>
      <style>{`
        .confirmation-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at top right,
              rgba(37, 99, 235, 0.08),
              transparent 30%
            ),
            radial-gradient(
              circle at bottom left,
              rgba(16, 185, 129, 0.06),
              transparent 30%
            ),
            #f8fafc;
        }

        .confirmation-wrapper {
          max-width: 900px;
          margin: 0 auto;
        }

        .confirmation-header {
          text-align: center;
          margin-bottom: 28px;
        }

        .success-icon {
          width: 78px;
          height: 78px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 34px;
          font-weight: 800;
          margin-bottom: 18px;
          box-shadow:
            0 12px 30px rgba(16, 185, 129, 0.22);
        }

        .confirmation-title {
          color: #0f172a;
          font-size: clamp(28px, 5vw, 40px);
          line-height: 1.15;
          letter-spacing: -0.8px;
        }

        .confirmation-subtitle {
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
          font-size: 15px;
        }

        .ticket-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          overflow: hidden;
          box-shadow:
            0 24px 60px rgba(15, 23, 42, 0.10);
        }

        .ticket-header {
          position: relative;
          background:
            linear-gradient(
              135deg,
              #2563eb 0%,
              #1d4ed8 55%,
              #1e40af 100%
            );
          color: #ffffff;
          padding: 30px;
          overflow: hidden;
        }

        .ticket-header::after {
          content: "";
          position: absolute;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          right: -60px;
          top: -80px;
        }

        .ticket-header::before {
          content: "";
          position: absolute;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          left: -45px;
          bottom: -45px;
        }

        .brand-label {
          font-size: 12px;
          letter-spacing: 2px;
          font-weight: 700;
          opacity: 0.75;
        }

        .ticket-event-title {
          position: relative;
          z-index: 1;
          font-size: clamp(22px, 4vw, 30px);
          line-height: 1.2;
          font-weight: 800;
          word-break: break-word;
        }

        .ticket-header-content {
          position: relative;
          z-index: 2;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 1px solid;
          border-radius: 999px;
          padding: 8px 14px;
          font-size: 13px;
          font-weight: 700;
          white-space: nowrap;
        }

        .ticket-body {
          padding: 32px;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #0f172a;
          font-size: 17px;
          font-weight: 750;
          margin-bottom: 16px;
        }

        .section-title-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: #eff6ff;
          color: #2563eb;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        .info-box {
          height: 100%;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 16px;
          transition: 0.2s ease;
        }

        .info-box:hover {
          border-color: #bfdbfe;
          background: #f8fbff;
        }

        .info-label {
          display: block;
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .info-value {
          display: block;
          color: #0f172a;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.45;
          word-break: break-word;
        }

        .location-box {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 16px;
        }

        .seat-box {
          background:
            linear-gradient(
              135deg,
              #f8fafc,
              #ffffff
            );
          border: 1px dashed #cbd5e1;
          border-radius: 14px;
          padding: 18px;
        }

        .seat-list {
          color: #0f172a;
          font-weight: 750;
          font-size: 15px;
          word-break: break-word;
        }

        .amount-box {
          background:
            linear-gradient(
              135deg,
              #ecfdf5,
              #f0fdf4
            );
          border: 1px solid #bbf7d0;
          border-radius: 16px;
          padding: 20px;
        }

        .amount-label {
          color: #047857;
          font-size: 13px;
          font-weight: 700;
        }

        .amount-value {
          color: #047857;
          font-size: clamp(24px, 5vw, 32px);
          font-weight: 800;
          white-space: nowrap;
        }

        .ticket-footer {
          border-top: 2px dashed #e2e8f0;
          background: #f8fafc;
          padding: 20px 28px;
          text-align: center;
        }

        .action-button {
          min-height: 48px;
          border-radius: 12px;
          font-weight: 700;
          transition: all 0.2s ease;
        }

        .action-button:hover {
          transform: translateY(-1px);
        }

        .download-button {
          box-shadow:
            0 8px 20px rgba(16, 185, 129, 0.18);
        }

        .bottom-note {
          color: #94a3b8;
          font-size: 12px;
        }

        .receipt-only {
          width: 100%;
        }

        @media (max-width: 767.98px) {
          .confirmation-page {
            background: #f8fafc;
          }

          .ticket-card {
            border-radius: 18px;
          }

          .ticket-header {
            padding: 24px 20px;
          }

          .ticket-body {
            padding: 22px 18px;
          }

          .ticket-footer {
            padding: 18px;
          }

          .confirmation-header {
            margin-bottom: 22px;
          }

          .success-icon {
            width: 68px;
            height: 68px;
            font-size: 29px;
          }

          .confirmation-title {
            font-size: 29px;
          }

          .status-badge {
            padding: 7px 12px;
          }

          .action-button {
            width: 100%;
          }
        }

        @media print {
          body {
            background: #ffffff !important;
          }

          .confirmation-page {
            background: #ffffff !important;
          }
        }
      `}</style>

      <div className="confirmation-page">
        <div className="container py-4 py-md-5">

          <div className="confirmation-wrapper">

            {/* =================================================
                SUCCESS HEADER
                ================================================= */}

            <div className="confirmation-header">

              <div
                className="success-icon"
                style={{
                  background:
                    isCancelled
                      ? "#fef2f2"
                      : "#ecfdf5",
                  color:
                    isCancelled
                      ? "#dc2626"
                      : "#059669",
                }}
              >
                {isCancelled
                  ? "×"
                  : "✓"}
              </div>

              <h1 className="confirmation-title fw-bold mb-2">
                {isCancelled
                  ? "Booking Cancelled"
                  : "Booking Confirmed!"}
              </h1>

              <p className="confirmation-subtitle mb-0">
                {isCancelled
                  ? "This booking has been cancelled."
                  : "Your event booking has been successfully created. Keep your booking ID for future reference."}
              </p>

            </div>

            {/* =================================================
                TICKET RECEIPT
                ================================================= */}

            <div
              id="ticket-receipt"
              className="ticket-card receipt-only"
            >

              {/* =================================================
                  TICKET HEADER
                  ================================================= */}

              <div className="ticket-header">

                <div className="ticket-header-content">

                  <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-start gap-3">

                    <div className="flex-grow-1">

                      <div className="brand-label mb-2">
                        EVENTBOOK
                      </div>

                      <div className="ticket-event-title">
                        {eventTitle}
                      </div>

                      <div className="small mt-2 text-white-50">
                        Digital Event Ticket
                      </div>

                    </div>

                    <div
                      className="status-badge align-self-start"
                      style={{
                        background:
                          statusConfig.background,
                        color:
                          statusConfig.color,
                        borderColor:
                          statusConfig.border,
                      }}
                    >
                      <span>
                        {statusConfig.icon}
                      </span>

                      <span>
                        {statusConfig.label}
                      </span>
                    </div>

                  </div>

                </div>

              </div>

              {/* =================================================
                  TICKET BODY
                  ================================================= */}

              <div className="ticket-body">

                {/* EVENT INFORMATION */}

                <section className="mb-4">

                  <div className="section-title">
                    <span className="section-title-icon">
                      📅
                    </span>

                    <span>
                      Event Information
                    </span>
                  </div>

                  <div className="row g-3">

                    {/* DATE */}

                    <div className="col-12 col-sm-6 col-lg-4">

                      <div className="info-box">

                        <span className="info-label">
                          Event Date
                        </span>

                        <span className="info-value">
                          {formatDate(eventDate)}
                        </span>

                      </div>

                    </div>

                    {/* TIME */}

                    <div className="col-12 col-sm-6 col-lg-4">

                      <div className="info-box">

                        <span className="info-label">
                          Event Time
                        </span>

                        <span className="info-value">
                          {formatTime(eventTime)}
                        </span>

                      </div>

                    </div>

                    {/* VENUE */}

                    <div className="col-12 col-lg-4">

                      <div className="info-box">

                        <span className="info-label">
                          Venue
                        </span>

                        <span className="info-value">
                          {eventVenue}
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* LOCATION */}

                  {eventLocation && (
                    <div className="location-box mt-3">

                      <span className="info-label">
                        Event Location
                      </span>

                      <span className="info-value">
                        📍 {eventLocation}
                      </span>

                    </div>
                  )}

                </section>

                {/* DIVIDER */}

                <hr className="my-4 border-secondary-subtle" />

                {/* BOOKING INFORMATION */}

                <section className="mb-4">

                  <div className="section-title">
                    <span className="section-title-icon">
                      🎫
                    </span>

                    <span>
                      Booking Details
                    </span>
                  </div>

                  <div className="row g-3">

                    {/* BOOKING ID */}

                    <div className="col-12 col-sm-6">

                      <div className="info-box">

                        <span className="info-label">
                          Booking ID
                        </span>

                        <span className="info-value">
                          {displayBookingId}
                        </span>

                      </div>

                    </div>

                    {/* TICKET COUNT */}

                    <div className="col-12 col-sm-6">

                      <div className="info-box">

                        <span className="info-label">
                          Number of Tickets
                        </span>

                        <span className="info-value">
                          {ticketCount}
                          {" "}
                          {ticketCount === 1
                            ? "Ticket"
                            : "Tickets"}
                        </span>

                      </div>

                    </div>

                  </div>

                </section>

                {/* SELECTED SEATS */}

                <section className="mb-4">

                  <div className="seat-box">

                    <div className="d-flex flex-column flex-sm-row justify-content-between gap-3">

                      <div className="flex-grow-1">

                        <span className="info-label">
                          Selected Seats
                        </span>

                        <div className="seat-list">
                          💺 {seats}
                        </div>

                      </div>

                      <div className="flex-shrink-0">

                        <span className="info-label">
                          Tickets
                        </span>

                        <div className="seat-list">
                          {ticketCount}
                        </div>

                      </div>

                    </div>

                  </div>

                </section>

                {/* PAYMENT SUMMARY */}

                <section>

                  <div className="amount-box">

                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">

                      <div>

                        <div className="amount-label">
                          TOTAL AMOUNT
                        </div>

                        <div className="small text-muted mt-1">
                          Final booking amount
                        </div>

                      </div>

                      <div className="amount-value">
                        ₹{formatCurrency(totalAmount)}
                      </div>

                    </div>

                  </div>

                </section>

              </div>

              {/* =================================================
                  TICKET FOOTER
                  ================================================= */}

              <div className="ticket-footer">

                <div className="small text-muted">
                  Thank you for choosing
                  {" "}
                  <strong className="text-dark">
                    EventBook
                  </strong>
                  .
                </div>

                <div className="small text-muted mt-1">
                  Please keep your booking ID
                  for future reference.
                </div>

              </div>

            </div>

            {/* =================================================
                ACTION BUTTONS
                ================================================= */}

            <div className="row g-2 g-md-3 mt-4">

              {/* DOWNLOAD */}

              <div className="col-12 col-md-4">

                <button
                  type="button"
                  className="btn btn-success action-button download-button w-100"
                  onClick={downloadReceipt}
                  disabled={downloading}
                >
                  {downloading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />

                      Generating PDF...
                    </>
                  ) : (
                    <>
                      📥 Download Ticket
                    </>
                  )}
                </button>

              </div>

              {/* MY BOOKINGS */}

              <div className="col-12 col-md-4">

                <Link
                  to="/my-bookings"
                  className="btn btn-primary action-button w-100 d-flex align-items-center justify-content-center"
                >
                  🎫 My Bookings
                </Link>

              </div>

              {/* EVENTS */}

              <div className="col-12 col-md-4">

                <Link
                  to="/events"
                  className="btn btn-outline-secondary action-button w-100 d-flex align-items-center justify-content-center"
                >
                  Browse Events
                </Link>

              </div>

            </div>

            {/* =================================================
                FOOTER
                ================================================= */}

            <div className="text-center mt-4">

              <div className="bottom-note">
                EventBook • Discover events.
                Book tickets. Enjoy experiences.
              </div>

            </div>

          </div>

        </div>
      </div>
    </>
  );
}

export default BookingConfirmation;