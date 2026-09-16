import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getEventById } from "../services/eventService";
import { createBooking } from "../services/bookingService";
import SeatSelector from "../components/SeatSelector";

function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD EVENT
     ========================================================= */
  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getEventById(id);

        const eventData = data?.event || data;

        console.log("BOOKING PAGE EVENT:", eventData);

        setEvent(eventData);
      } catch (err) {
        console.error(err);
        setError("Unable to load event.");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  /* =========================================================
     CREATE BOOKING
     ========================================================= */
  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select seats.");
      return;
    }

    setBooking(true);

    try {
      const data = await createBooking({
        eventId: id,
        seats: selectedSeats,
        quantity: selectedSeats.length,
      });

      console.log("BOOKING RESPONSE:", data);
      console.log("EVENT BEING SENT:", event);

      const bookingData = data?.booking || data;

      const bookingId =
        bookingData?._id ||
        data?._id;

      if (bookingId) {
        navigate(`/booking-confirmation/${bookingId}`, {
          state: {
            booking: bookingData,
            event: {
              _id: event?._id,
              title: event?.title,
              date: event?.date,
              time: event?.time,
              venue: event?.venue,
              location: event?.location,
              banner: event?.banner,
              category: event?.category,
              ticketPrice: event?.ticketPrice,
            },
          },
        });
      } else {
        alert("Booking created successfully!");
      }
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Booking failed."
      );
    } finally {
      setBooking(false);
    }
  };

  /* =========================================================
     LOADING
     ========================================================= */
  if (loading) {
    return (
      <div className="booking-page">

        <style>
          {`
            .booking-page {
              min-height: 100vh;
              background: #f8fafc;
            }

            .booking-loading {
              min-height: 70vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 40px 20px;
            }

            .booking-loading-card {
              width: 100%;
              max-width: 480px;
              background: #fff;
              border: 1px solid #e5e7eb;
              border-radius: 20px;
              padding: 45px 25px;
              text-align: center;
              box-shadow: 0 10px 30px rgba(15,23,42,.06);
            }
          `}
        </style>

        <div className="booking-loading">

          <div className="booking-loading-card">

            <div
              className="spinner-border text-primary mb-3"
              style={{
                width: "42px",
                height: "42px",
              }}
              role="status"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <h5 className="fw-bold mb-2">
              Loading Event
            </h5>

            <p className="text-muted small mb-0">
              Please wait while we load the event details.
            </p>

          </div>

        </div>

      </div>
    );
  }

  /* =========================================================
     ERROR
     ========================================================= */
  if (error || !event) {
    return (
      <div className="booking-page">

        <style>
          {`
            .booking-page {
              min-height: 100vh;
              background: #f8fafc;
            }

            .booking-error {
              min-height: 70vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 30px 20px;
            }

            .booking-error-card {
              width: 100%;
              max-width: 500px;
              background: #fff;
              border: 1px solid #fee2e2;
              border-radius: 20px;
              padding: 45px 25px;
              text-align: center;
              box-shadow: 0 10px 30px rgba(15,23,42,.05);
            }
          `}
        </style>

        <div className="booking-error">

          <div className="booking-error-card">

            <div
              className="mx-auto mb-3 d-flex align-items-center justify-content-center"
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "18px",
                background: "#fef2f2",
                fontSize: "30px",
              }}
            >
              ⚠️
            </div>

            <h4 className="fw-bold text-danger mb-2">
              Event Not Available
            </h4>

            <p className="text-muted mb-0">
              {error || "Event not found."}
            </p>

          </div>

        </div>

      </div>
    );
  }

  /* =========================================================
     FORMAT DATE
     ========================================================= */
  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      )
    : "Not available";

  /* =========================================================
     FORMAT TIME
     ========================================================= */
  let formattedTime = "Not available";

  if (event.time) {
    if (
      typeof event.time === "string" &&
      (
        event.time.toLowerCase().includes("am") ||
        event.time.toLowerCase().includes("pm")
      )
    ) {
      formattedTime = event.time;
    } else {
      const [hours, minutes] =
        String(event.time).split(":");

      if (
        hours !== undefined &&
        minutes !== undefined
      ) {
        const timeDate = new Date();

        timeDate.setHours(
          Number(hours),
          Number(minutes),
          0,
          0
        );

        formattedTime =
          timeDate.toLocaleTimeString(
            "en-IN",
            {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }
          );
      }
    }
  }

  /* =========================================================
     TOTAL
     ========================================================= */
  const ticketPrice =
    Number(event.ticketPrice || 0);

  const totalAmount =
    selectedSeats.length * ticketPrice;

  /* =========================================================
     EVENT IMAGE
     ========================================================= */
  const eventImage =
    event.banner ||
    "https://placehold.co/1200x650?text=EventBook";

  return (
    <div className="booking-page">

      {/* =====================================================
          PAGE STYLES
          ===================================================== */}
      <style>
        {`
          .booking-page {
            min-height: 100vh;
            background: #f8fafc;
            color: #0f172a;
          }

          /* ================================================
             HEADER
             ================================================ */

          .booking-header {
            background: #ffffff;
            border-bottom: 1px solid #e5e7eb;
          }

          .booking-breadcrumb {
            font-size: 13px;
            color: #64748b;
          }

          .booking-breadcrumb span {
            color: #2563eb;
            font-weight: 600;
          }

          .booking-title {
            font-size: clamp(28px, 4vw, 40px);
            font-weight: 800;
            letter-spacing: -0.8px;
            color: #0f172a;
          }

          .booking-subtitle {
            color: #64748b;
            font-size: 15px;
          }


          /* ================================================
             EVENT HERO IMAGE
             ================================================ */

          .booking-event-image-card {
            position: relative;
            overflow: hidden;

            width: 100%;

            border-radius: 20px;

            background: #e2e8f0;

            box-shadow:
              0 12px 35px rgba(15, 23, 42, 0.10);
          }

          .booking-event-image {
            width: 100%;

            height: 330px;

            display: block;

            object-fit: cover;

            object-position: center;

            background: #e2e8f0;

            transition: transform .35s ease;
          }

          .booking-event-image-card:hover
          .booking-event-image {
            transform: scale(1.02);
          }

          .booking-image-overlay {
            position: absolute;

            left: 0;
            right: 0;
            bottom: 0;

            padding: 50px 25px 25px;

            background:
              linear-gradient(
                to top,
                rgba(15, 23, 42, .82),
                rgba(15, 23, 42, 0)
              );
          }

          .booking-category {
            display: inline-flex;

            padding: 6px 11px;

            border-radius: 999px;

            background: rgba(255,255,255,.94);

            color: #2563eb;

            font-size: 11px;

            font-weight: 700;

            text-transform: uppercase;

            letter-spacing: .5px;
          }

          .booking-image-title {
            color: #fff;

            font-size: clamp(22px, 3vw, 30px);

            font-weight: 800;

            margin: 10px 0 0;

            text-shadow:
              0 2px 10px rgba(0,0,0,.25);
          }


          /* ================================================
             MAIN CARDS
             ================================================ */

          .booking-card {
            background: #ffffff;

            border: 1px solid #e5e7eb;

            border-radius: 18px;

            box-shadow:
              0 8px 25px rgba(15,23,42,.05);
          }

          .booking-card-header {
            padding: 24px 25px;

            border-bottom: 1px solid #f1f5f9;
          }

          .booking-card-body {
            padding: 25px;
          }


          /* ================================================
             EVENT INFORMATION
             ================================================ */

          .booking-info-grid {
            display: grid;

            grid-template-columns:
              repeat(2, minmax(0, 1fr));

            gap: 14px;
          }

          .booking-info-item {
            display: flex;

            align-items: center;

            gap: 13px;

            padding: 15px;

            background: #f8fafc;

            border: 1px solid #eef2f7;

            border-radius: 13px;

            min-width: 0;
          }

          .booking-info-icon {
            width: 40px;
            height: 40px;

            flex-shrink: 0;

            display: flex;

            align-items: center;

            justify-content: center;

            border-radius: 10px;

            background: #eff6ff;

            font-size: 17px;
          }

          .booking-info-label {
            color: #94a3b8;

            font-size: 10px;

            font-weight: 700;

            text-transform: uppercase;

            letter-spacing: .6px;

            margin-bottom: 3px;
          }

          .booking-info-value {
            color: #0f172a;

            font-size: 13px;

            font-weight: 600;

            word-break: break-word;
          }


          /* ================================================
             SEAT SECTION
             ================================================ */

          .seat-section {
            margin-top: 25px;

            padding-top: 25px;

            border-top: 1px solid #e5e7eb;
          }

          .seat-section-title {
            font-size: 20px;

            font-weight: 750;

            letter-spacing: -.3px;
          }

          .seat-section-subtitle {
            color: #64748b;

            font-size: 13px;
          }


          /* ================================================
             SUMMARY
             ================================================ */

          .booking-summary {
            position: sticky;

            top: 90px;
          }

          .summary-title {
            font-size: 21px;

            font-weight: 800;

            letter-spacing: -.3px;
          }

          .summary-event {
            padding: 14px;

            background: #f8fafc;

            border-radius: 13px;

            border: 1px solid #eef2f7;
          }

          .summary-label {
            color: #94a3b8;

            font-size: 10px;

            font-weight: 700;

            text-transform: uppercase;

            letter-spacing: .6px;
          }

          .summary-value {
            color: #0f172a;

            font-size: 13px;

            font-weight: 600;
          }

          .selected-seat-container {
            display: flex;

            flex-wrap: wrap;

            gap: 6px;
          }

          .selected-seat {
            padding: 5px 9px;

            border-radius: 7px;

            background: #eff6ff;

            color: #2563eb;

            border: 1px solid #dbeafe;

            font-size: 11px;

            font-weight: 700;
          }

          .summary-total {
            padding: 17px;

            background: #f8fafc;

            border-radius: 13px;

            border: 1px solid #e5e7eb;
          }

          .summary-total-label {
            color: #64748b;

            font-size: 13px;

            font-weight: 600;
          }

          .summary-total-price {
            color: #15803d;

            font-size: 25px;

            font-weight: 800;
          }

          .booking-confirm-btn {
            min-height: 50px;

            border-radius: 11px;

            font-weight: 700;

            border: none;

            background: #2563eb;

            box-shadow:
              0 8px 18px rgba(37,99,235,.18);

            transition:
              transform .2s ease,
              box-shadow .2s ease,
              background .2s ease;
          }

          .booking-confirm-btn:hover:not(:disabled) {
            background: #1d4ed8;

            transform: translateY(-1px);

            box-shadow:
              0 10px 22px rgba(37,99,235,.25);
          }

          .booking-confirm-btn:disabled {
            opacity: .55;

            box-shadow: none;
          }

          .secure-note {
            display: flex;

            align-items: center;

            justify-content: center;

            gap: 6px;

            color: #64748b;

            font-size: 11px;

            margin-top: 12px;
          }


          /* ================================================
             RESPONSIVE
             ================================================ */

          @media (max-width: 991px) {

            .booking-summary {
              position: static;
            }

            .booking-event-image {
              height: 300px;
            }
          }


          @media (max-width: 767px) {

            .booking-header {
              padding-top: 10px;
            }

            .booking-title {
              font-size: 28px;
            }

            .booking-subtitle {
              font-size: 13px;
            }

            .booking-event-image {
              height: 230px;
            }

            .booking-image-overlay {
              padding: 40px 18px 18px;
            }

            .booking-image-title {
              font-size: 21px;
            }

            .booking-info-grid {
              grid-template-columns: 1fr;
            }

            .booking-card-header {
              padding: 20px;
            }

            .booking-card-body {
              padding: 20px;
            }
          }


          @media (max-width: 480px) {

            .booking-event-image-card {
              border-radius: 15px;
            }

            .booking-event-image {
              height: 200px;
            }

            .booking-info-item {
              padding: 12px;
            }

            .booking-info-icon {
              width: 36px;
              height: 36px;
            }

            .booking-confirm-btn {
              min-height: 48px;
            }
          }
        `}
      </style>


      {/* =====================================================
          PAGE HEADER
          ===================================================== */}
      <section className="booking-header">

        <div className="container-fluid px-3 px-md-4 px-xl-5">

          <div className="py-4">

            <div className="booking-breadcrumb mb-3">
              EventBook
              <span className="mx-2">/</span>
              Events
              <span className="mx-2">/</span>
              Booking
            </div>

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-2">

              <div>

                <h1 className="booking-title mb-2">
                  Book Your Ticket
                </h1>

                <p className="booking-subtitle mb-0">
                  Select your seats and confirm your event booking.
                </p>

              </div>

              <div
                className="d-flex align-items-center gap-2"
                style={{
                  color: "#16a34a",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#22c55e",
                  }}
                />

                Secure Booking
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          MAIN
          ===================================================== */}
      <main className="container-fluid px-3 px-md-4 px-xl-5 py-4 py-md-5">

        <div className="row g-4">


          {/* =================================================
              LEFT COLUMN
              ================================================= */}
          <div className="col-lg-8">

            {/* EVENT IMAGE */}
            <div className="booking-event-image-card mb-4">

              <img
                src={eventImage}
                alt={event.title || "Event"}
                className="booking-event-image"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/1200x650?text=EventBook";
                }}
              />

              <div className="booking-image-overlay">

                {event.category && (
                  <span className="booking-category">
                    {event.category}
                  </span>
                )}

                <h2 className="booking-image-title">
                  {event.title}
                </h2>

              </div>

            </div>


            {/* EVENT DETAILS */}
            <div className="booking-card mb-4">

              <div className="booking-card-header">

                <h4 className="fw-bold mb-1">
                  Event Details
                </h4>

                <p className="text-muted small mb-0">
                  Check the event information before selecting
                  your seats.
                </p>

              </div>


              <div className="booking-card-body">

                <div className="booking-info-grid">

                  {/* DATE */}
                  <div className="booking-info-item">

                    <div className="booking-info-icon">
                      📅
                    </div>

                    <div className="min-w-0">

                      <div className="booking-info-label">
                        Date
                      </div>

                      <div className="booking-info-value">
                        {formattedDate}
                      </div>

                    </div>

                  </div>


                  {/* TIME */}
                  <div className="booking-info-item">

                    <div className="booking-info-icon">
                      🕐
                    </div>

                    <div className="min-w-0">

                      <div className="booking-info-label">
                        Time
                      </div>

                      <div className="booking-info-value">
                        {formattedTime}
                      </div>

                    </div>

                  </div>


                  {/* VENUE */}
                  <div className="booking-info-item">

                    <div className="booking-info-icon">
                      📍
                    </div>

                    <div className="min-w-0">

                      <div className="booking-info-label">
                        Venue
                      </div>

                      <div className="booking-info-value">
                        {event.venue ||
                          "Venue not available"}
                      </div>

                    </div>

                  </div>


                  {/* LOCATION */}
                  <div className="booking-info-item">

                    <div className="booking-info-icon">
                      🗺️
                    </div>

                    <div className="min-w-0">

                      <div className="booking-info-label">
                        Location
                      </div>

                      <div className="booking-info-value">
                        {event.location ||
                          "Location not available"}
                      </div>

                    </div>

                  </div>

                </div>


                {/* SEAT SELECTOR */}
                <div className="seat-section">

                  <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-end gap-2 mb-4">

                    <div>

                      <h4 className="seat-section-title mb-1">
                        Select Your Seats
                      </h4>

                      <p className="seat-section-subtitle mb-0">
                        Choose the seats you want to reserve.
                      </p>

                    </div>

                    <div
                      className="badge rounded-pill px-3 py-2"
                      style={{
                        background: "#eff6ff",
                        color: "#2563eb",
                        fontSize: "11px",
                      }}
                    >
                      ₹{ticketPrice} / ticket
                    </div>

                  </div>


                  <SeatSelector
                    totalSeats={
                      event.totalSeats || 30
                    }
                    bookedSeats={
                      event.bookedSeats || []
                    }
                    ticketPrice={
                      event.ticketPrice || 0
                    }
                    onSelect={setSelectedSeats}
                  />

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              RIGHT COLUMN
              ================================================= */}
          <div className="col-lg-4">

            <div className="booking-summary">

              <div className="booking-card">

                <div className="booking-card-header">

                  <div className="d-flex align-items-center justify-content-between">

                    <div>

                      <h4 className="summary-title mb-1">
                        Booking Summary
                      </h4>

                      <p className="text-muted small mb-0">
                        Review your ticket details
                      </p>

                    </div>

                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "11px",
                        background: "#eff6ff",
                        color: "#2563eb",
                        fontSize: "19px",
                      }}
                    >
                      🎟
                    </div>

                  </div>

                </div>


                <div className="booking-card-body">

                  {/* EVENT */}
                  <div className="summary-event mb-3">

                    <div className="summary-label mb-1">
                      Event
                    </div>

                    <div className="summary-value">
                      {event.title}
                    </div>

                  </div>


                  {/* DATE */}
                  <div className="d-flex justify-content-between gap-3 py-3 border-bottom">

                    <div className="summary-label">
                      Date
                    </div>

                    <div className="summary-value text-end">
                      {formattedDate}
                    </div>

                  </div>


                  {/* TIME */}
                  <div className="d-flex justify-content-between gap-3 py-3 border-bottom">

                    <div className="summary-label">
                      Time
                    </div>

                    <div className="summary-value text-end">
                      {formattedTime}
                    </div>

                  </div>


                  {/* VENUE */}
                  <div className="py-3 border-bottom">

                    <div className="summary-label mb-1">
                      Venue
                    </div>

                    <div className="summary-value">
                      {event.venue ||
                        "Venue not available"}
                    </div>

                    {event.location && (
                      <div
                        className="text-muted mt-1"
                        style={{
                          fontSize: "11px",
                        }}
                      >
                        {event.location}
                      </div>
                    )}

                  </div>


                  {/* SELECTED SEATS */}
                  <div className="py-3 border-bottom">

                    <div className="summary-label mb-2">
                      Selected Seats
                    </div>

                    {selectedSeats.length > 0 ? (

                      <div className="selected-seat-container">

                        {selectedSeats.map((seat) => (
                          <span
                            className="selected-seat"
                            key={seat}
                          >
                            Seat {seat}
                          </span>
                        ))}

                      </div>

                    ) : (

                      <span
                        className="text-muted"
                        style={{
                          fontSize: "12px",
                        }}
                      >
                        No seats selected
                      </span>

                    )}

                  </div>


                  {/* TICKETS */}
                  <div className="d-flex justify-content-between py-3 border-bottom">

                    <span className="summary-label">
                      Tickets
                    </span>

                    <span className="summary-value">
                      {selectedSeats.length}
                    </span>

                  </div>


                  {/* PRICE */}
                  <div className="d-flex justify-content-between py-3 border-bottom">

                    <span className="summary-label">
                      Price per ticket
                    </span>

                    <span className="summary-value">
                      ₹{ticketPrice}
                    </span>

                  </div>


                  {/* TOTAL */}
                  <div className="summary-total mt-4">

                    <div className="d-flex justify-content-between align-items-center">

                      <span className="summary-total-label">
                        Total Amount
                      </span>

                      <span className="summary-total-price">
                        ₹{totalAmount}
                      </span>

                    </div>

                  </div>


                  {/* BUTTON */}
                  <button
                    type="button"
                    className="btn btn-primary booking-confirm-btn w-100 mt-4"
                    onClick={handleBooking}
                    disabled={
                      booking ||
                      selectedSeats.length === 0
                    }
                  >

                    {booking ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        />

                        Processing Booking...
                      </>
                    ) : (
                      <>
                        Confirm Booking
                        <span className="ms-2">
                          →
                        </span>
                      </>
                    )}

                  </button>


                  {selectedSeats.length === 0 && (

                    <div className="text-center text-muted mt-2">
                      <small>
                        Select at least one seat to continue.
                      </small>
                    </div>

                  )}


                  <div className="secure-note">
                    <span>🔒</span>
                    Your booking information is secure
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default BookingPage;