import html2pdf from "html2pdf.js";
import { Link, useLocation } from "react-router-dom";

function BookingConfirmation() {
  const location = useLocation();

  const booking = location.state?.booking;
  const eventFromState = location.state?.event;

  /* booking data */

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
    booking?.seats?.length
      ? booking.seats.join(", ")
      : "Selected";

  const ticketCount =
    booking?.quantity ||
    booking?.seats?.length ||
    0;

  const totalAmount =
    booking?.totalAmount ??
    booking?.amount ??
    0;

  const status =
    booking?.status ||
    "Confirmed";

  /* event information */

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

  /* format date */

  const formatDate = (date) => {
    if (!date) {
      return "Date not available";
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* ================= FORMAT TIME ================= */

  const formatTime = (time) => {
    if (!time) {
      return "Time not available";
    }

    // Already formatted like 06:30 PM
    if (
      time.toLowerCase().includes("am") ||
      time.toLowerCase().includes("pm")
    ) {
      return time;
    }

    // Format 24-hour time like 18:30
    const [hours, minutes] = time.split(":");

    if (
      hours === undefined ||
      minutes === undefined
    ) {
      return time;
    }

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes),
      0,
      0
    );

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  /* ================= DISPLAY BOOKING ID ================= */

  const displayBookingId =
    bookingId !== "N/A"
      ? `EB-${String(bookingId)
          .slice(-8)
          .toUpperCase()}`
      : "N/A";

  /* ================= DOWNLOAD RECEIPT ================= */

  const downloadReceipt = () => {
    const element =
      document.getElementById("ticket-receipt");

    if (!element) {
      alert("Unable to generate ticket receipt.");
      return;
    }

    const options = {
      margin: 10,
      filename: `EventBook-Ticket-${displayBookingId}.pdf`,
      image: {
        type: "jpeg",
        quality: 0.98,
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
    };

    html2pdf()
      .set(options)
      .from(element)
      .save();
  };

  /* ================= NO BOOKING ================= */

  if (!booking) {
    return (
      <div className="bg-light min-vh-100">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-7 col-lg-6">

              <div className="card border-0 shadow-sm rounded-4">

                <div className="card-body text-center p-4 p-md-5">

                  <div
                    className="bg-warning-subtle text-warning rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
                    style={{
                      width: "80px",
                      height: "80px",
                      fontSize: "35px",
                    }}
                  >
                    ⚠️
                  </div>

                  <h3 className="fw-bold mb-2">
                    Booking Details Not Found
                  </h3>

                  <p className="text-muted mb-4">
                    We couldn't find the booking information.
                    Please check your bookings again.
                  </p>

                  <Link
                    to="/my-bookings"
                    className="btn btn-primary px-4"
                  >
                    Go to My Bookings
                  </Link>

                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">

      <div className="container py-4 py-md-5">

        <div className="row justify-content-center">

          <div className="col-12 col-md-10 col-lg-8">

            {/* ================= SUCCESS HEADER ================= */}

            <div className="text-center mb-4">

              <div
                className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm mb-3"
                style={{
                  width: "78px",
                  height: "78px",
                  fontSize: "36px",
                }}
              >
                ✓
              </div>

              <h1 className="fw-bold mb-2">
                Booking Confirmed!
              </h1>

              <p className="text-muted mb-0">
                Your event booking has been successfully created.
              </p>

            </div>

            {/* ================= TICKET RECEIPT ================= */}

            <div
              id="ticket-receipt"
              className="card border-0 shadow rounded-4 overflow-hidden"
            >

              {/* ================= TICKET HEADER ================= */}

              <div className="bg-primary text-white p-4 p-md-5">

                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">

                  <div>

                    <small className="text-white-50 d-block mb-1">
                      EVENTBOOK
                    </small>

                    <h3 className="fw-bold mb-1">
                      {eventTitle}
                    </h3>

                    <p className="mb-0 text-white-50">
                      Your event ticket
                    </p>

                  </div>

                  <div>

                    <span className="badge bg-white text-success rounded-pill px-3 py-2">
                      ✓ {status}
                    </span>

                  </div>

                </div>

              </div>

              {/* ================= TICKET BODY ================= */}

              <div className="card-body p-4 p-md-5 bg-white">

                {/* ================= EVENT INFORMATION ================= */}

                <div className="mb-4">

                  <h5 className="fw-bold mb-3">
                    📅 Event Information
                  </h5>

                  <div className="row g-3">

                    {/* DATE */}

                    <div className="col-12 col-sm-4">

                      <div className="bg-light rounded-3 p-3 h-100">

                        <small className="text-muted d-block mb-1">
                          📅 Date
                        </small>

                        <strong>
                          {formatDate(eventDate)}
                        </strong>

                      </div>

                    </div>

                    {/* TIME */}

                    <div className="col-12 col-sm-4">

                      <div className="bg-light rounded-3 p-3 h-100">

                        <small className="text-muted d-block mb-1">
                          🕐 Time
                        </small>

                        <strong>
                          {formatTime(eventTime)}
                        </strong>

                      </div>

                    </div>

                    {/* VENUE */}

                    <div className="col-12 col-sm-4">

                      <div className="bg-light rounded-3 p-3 h-100">

                        <small className="text-muted d-block mb-1">
                          📍 Venue
                        </small>

                        <strong className="text-break">
                          {eventVenue}
                        </strong>

                      </div>

                    </div>

                  </div>

                  {/* LOCATION */}

                  {eventLocation && (
                    <div className="border rounded-3 p-3 mt-3">

                      <small className="text-muted d-block mb-1">
                        📍 Location
                      </small>

                      <strong className="text-break">
                        {eventLocation}
                      </strong>

                    </div>
                  )}

                </div>

                {/* ================= BOOKING DETAILS ================= */}

                <div className="mb-4">

                  <h5 className="fw-bold mb-3">
                    🎫 Booking Details
                  </h5>

                  <div className="row g-3">

                    {/* BOOKING ID */}

                    <div className="col-12 col-sm-6">

                      <div className="bg-light rounded-3 p-3 h-100">

                        <small className="text-muted d-block mb-1">
                          Booking ID
                        </small>

                        <strong className="text-break">
                          {displayBookingId}
                        </strong>

                      </div>

                    </div>

                    {/* TICKETS */}

                    <div className="col-12 col-sm-6">

                      <div className="bg-light rounded-3 p-3 h-100">

                        <small className="text-muted d-block mb-1">
                          🎟️ Tickets
                        </small>

                        <strong>
                          {ticketCount}
                        </strong>

                      </div>

                    </div>

                  </div>

                </div>

                {/* ================= SELECTED SEATS ================= */}

                <div className="border rounded-3 p-3 mb-4">

                  <div className="d-flex flex-column flex-sm-row justify-content-between gap-3">

                    <div>

                      <small className="text-muted d-block mb-1">
                        💺 Selected Seats
                      </small>

                      <strong className="text-break">
                        {seats}
                      </strong>

                    </div>

                    <div className="text-sm-end">

                      <small className="text-muted d-block mb-1">
                        Number of Tickets
                      </small>

                      <strong>
                        {ticketCount}
                      </strong>

                    </div>

                  </div>

                </div>

                {/* ================= PAYMENT SUMMARY ================= */}

                <div className="bg-success-subtle rounded-3 p-3 p-md-4">

                  <div className="d-flex justify-content-between align-items-center">

                    <div>

                      <small className="text-success d-block">
                        Total Amount
                      </small>

                      <span className="text-muted small">
                        Booking total
                      </span>

                    </div>

                    <h3 className="fw-bold text-success mb-0">
                      ₹{totalAmount}
                    </h3>

                  </div>

                </div>

              </div>

              {/* ================= TICKET FOOTER ================= */}

              <div className="border-top border-2 border-dashed p-4 bg-light text-center">

                <p className="text-muted small mb-0">
                  🎉 Thank you for choosing EventBook.
                  Please keep your booking ID for future reference.
                </p>

              </div>

            </div>

            {/* ================= ACTION BUTTONS ================= */}

            <div className="row g-2 g-md-3 mt-4">

              <div className="col-12 col-md-4">

                <button
                  type="button"
                  className="btn btn-success w-100 py-2"
                  onClick={downloadReceipt}
                >
                  📥 Download Ticket
                </button>

              </div>

              <div className="col-12 col-md-4">

                <Link
                  to="/my-bookings"
                  className="btn btn-primary w-100 py-2"
                >
                  🎫 My Bookings
                </Link>

              </div>

              <div className="col-12 col-md-4">

                <Link
                  to="/events"
                  className="btn btn-outline-secondary w-100 py-2"
                >
                  Browse Events
                </Link>

              </div>

            </div>

            {/* ================= FOOTER NOTE ================= */}

            <div className="text-center mt-4">

              <small className="text-muted">
                EventBook • Discover events. Book tickets. Enjoy experiences.
              </small>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default BookingConfirmation;
