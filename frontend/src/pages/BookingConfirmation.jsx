import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { getBookingById } from "../services/bookingService";

function BookingConfirmation() {
  const { id } = useParams();
  const location = useLocation();

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!location.state?.booking);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (booking) return;

    let isMounted = true;

    const loadBooking = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getBookingById(id);
        if (isMounted) {
          setBooking(data.booking);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Booking loading error:", err);
          setError(
            err.response?.data?.message ||
              "Unable to load booking details. Please try again."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadBooking();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const event = useMemo(
    () => ({
      ...(booking?.event || {}),
      ...(location.state?.event || {}),
    }),
    [booking, location.state]
  );

  const banner =
    event.banner ||
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1600&q=80";

  const formatDate = (date) => {
    if (!date) return "Not available";
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "Not available";

    return parsedDate.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "Not available";
    const value = String(time).trim();
    if (value.toLowerCase().includes("am") || value.toLowerCase().includes("pm")) {
      return value;
    }

    const parts = value.split(":");
    if (parts.length < 2) return value;

    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return value;
    }

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatAmount = (amount) => {
    if (amount === undefined || amount === null || amount === "") return "0";
    const numericAmount = Number(amount);
    return Number.isNaN(numericAmount) ? amount : numericAmount.toLocaleString("en-IN");
  };

  const isCancelled = String(booking?.status || "").toLowerCase() === "cancelled";
  const bookingCode = booking?._id ? booking._id.toUpperCase() : "TKT-VERIFIED";

  const qrUrl = useMemo(() => {
    const qrPayload = encodeURIComponent(
      JSON.stringify({
        id: booking?._id,
        event: event.title,
        seats: booking?.seats,
      })
    );
    return `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${qrPayload}&color=0f172a&bgcolor=ffffff&qzone=1`;
  }, [booking, event.title]);

  const downloadTicket = async () => {
    const element = document.getElementById("printable-ticket");
    if (!element || downloading) return;

    try {
      setDownloading(true);
      await html2pdf()
        .set({
          margin: [8, 8, 8, 8],
          filename: `Ticket-${bookingCode.slice(-8)}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2.2,
            useCORS: true,
            backgroundColor: "#f8fafc",
            logging: false,
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
          },
          pagebreak: { mode: ["avoid-all", "css"] },
        })
        .from(element)
        .save();
    } catch (err) {
      console.error("Ticket generation error:", err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="eb-page min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center p-5 bg-white rounded-4 shadow-sm border border-slate-200" style={{ maxWidth: "420px" }}>
          <div className="spinner-grow text-primary mb-3" style={{ width: "3rem", height: "3rem" }} role="status" />
          <h5 className="fw-bold text-dark mb-1">Generating Your Pass</h5>
          <p className="text-muted small mb-0">Verifying reservations and fetching seat assignments...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="eb-page min-vh-100 d-flex align-items-center justify-content-center p-3">
        <div className="bg-white text-center p-5 rounded-4 shadow-sm border border-slate-200" style={{ maxWidth: "480px", width: "100%" }}>
          <div className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center bg-danger-subtle text-danger" style={{ width: "64px", height: "64px", fontSize: "28px" }}>
            !
          </div>
          <h4 className="fw-bold text-dark mb-2">Ticket Not Available</h4>
          <p className="text-secondary small mb-4">{error || "Unable to locate details for this confirmation."}</p>
          <Link to="/my-bookings" className="btn btn-primary rounded-pill px-4 py-2 fw-semibold">
            Return to Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .eb-page {
          background: #f8fafc;
          background-image: 
            radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.05) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(14, 165, 233, 0.05) 0px, transparent 50%);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
          color: #0f172a;
        }

        .ticket-wrapper {
          max-width: 900px;
          margin: 0 auto;
        }

        .pass-card {
          background: #ffffff;
          border-radius: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 20px 45px -10px rgba(15, 23, 42, 0.08), 0 8px 16px -6px rgba(15, 23, 42, 0.03);
          overflow: hidden;
          position: relative;
        }

        .pass-hero {
          position: relative;
          height: 240px;
          background: #0f172a;
          overflow: hidden;
        }

        .pass-hero img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.55;
        }

        .pass-hero-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.1) 0%, rgba(15, 23, 42, 0.85) 100%);
        }

        .pass-hero-text {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 28px 36px;
          color: white;
        }

        .event-tag {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          color: #ffffff;
          display: inline-block;
        }

        .detail-card {
          background: #f8fafc;
          border: 1px solid #edf2f7;
          border-radius: 14px;
          padding: 16px;
          height: 100%;
        }

        .detail-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: #64748b;
          margin-bottom: 4px;
        }

        .detail-value {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
        }

        /* Perforated Rip Line */
        .stub-separator {
          position: relative;
          border-top: 2px dashed #cbd5e1;
          margin: 0;
        }

        .stub-separator::before,
        .stub-separator::after {
          content: "";
          position: absolute;
          top: -15px;
          width: 30px;
          height: 30px;
          background: #f8fafc;
          border-radius: 50%;
          z-index: 2;
        }

        .stub-separator::before {
          left: -15px;
          box-shadow: inset -1px 0 2px rgba(0, 0, 0, 0.06);
        }

        .stub-separator::after {
          right: -15px;
          box-shadow: inset 1px 0 2px rgba(0, 0, 0, 0.06);
        }

        .seat-badge {
          background: #eef2ff;
          color: #4f46e5;
          border: 1px solid #c7d2fe;
          font-weight: 700;
          font-size: 13px;
          padding: 6px 14px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .barcode-visual {
          height: 44px;
          width: 100%;
          max-width: 220px;
          display: flex;
          align-items: stretch;
          gap: 2px;
          margin-top: 8px;
        }

        .barcode-bar {
          background-color: #0f172a;
        }

        .qr-holder {
          background: #ffffff;
          padding: 10px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
          display: inline-block;
        }

        .btn-modern {
          padding: 10px 22px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        @media (max-width: 768px) {
          .pass-hero {
            height: 200px;
          }
          .pass-hero-text {
            padding: 20px;
          }
          .pass-body {
            padding: 24px !important;
          }
        }

        @media print {
          .no-print {
            display: none !important;
          }
          .eb-page {
            background: #ffffff !important;
            padding: 0 !important;
          }
          .pass-card {
            box-shadow: none !important;
            border: 1px solid #94a3b8 !important;
          }
        }
      `}</style>

      <div className="eb-page min-vh-100 py-4 py-lg-5">
        <div className="container">
          
          {/* Top Bar Navigation & Actions */}
          <div className="ticket-wrapper no-print mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
            <Link
              to="/my-bookings"
              className="btn btn-outline-secondary btn-modern d-inline-flex align-items-center gap-2 bg-white"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Bookings</span>
            </Link>

            <button
              type="button"
              className="btn btn-primary btn-modern d-inline-flex align-items-center gap-2 shadow-sm"
              onClick={downloadTicket}
              disabled={downloading}
            >
              {downloading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                  <span>Preparing PDF...</span>
                </>
              ) : (
                <>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download Pass (PDF)</span>
                </>
              )}
            </button>
          </div>

          {/* Printable Ticket Card */}
          <div id="printable-ticket" className="ticket-wrapper">
            <div className="pass-card">
              
              {/* Event Header Banner */}
              <div className="pass-hero">
                <img
                  src={banner}
                  alt={event.title || "Event Cover"}
                  crossOrigin="anonymous"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1600&q=80";
                  }}
                />
                <div className="pass-hero-gradient" />

                <div className="pass-hero-text">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    {event.category && <span className="event-tag">{event.category}</span>}
                    <span
                      className={`badge rounded-pill px-3 py-2 ${
                        isCancelled ? "bg-danger" : "bg-success"
                      }`}
                    >
                      {isCancelled ? "Cancelled" : "Confirmed Booking"}
                    </span>
                  </div>

                  <h2 className="fw-bold mb-1 text-white">{event.title || "Event Ticket"}</h2>
                  <p className="text-white-50 small mb-0">Official Digital Entry Pass</p>
                </div>
              </div>

              {/* Information Grid */}
              <div className="pass-body p-4 p-md-5">
                <div className="row g-3 mb-4">
                  <div className="col-6 col-md-3">
                    <div className="detail-card">
                      <div className="detail-label">Event Date</div>
                      <div className="detail-value">{formatDate(event.date)}</div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="detail-card">
                      <div className="detail-label">Start Time</div>
                      <div className="detail-value">{formatTime(event.time)}</div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="detail-card">
                      <div className="detail-label">Venue</div>
                      <div className="detail-value text-truncate">{event.venue || "TBA"}</div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="detail-card">
                      <div className="detail-label">City / Location</div>
                      <div className="detail-value text-truncate">{event.location || "TBA"}</div>
                    </div>
                  </div>
                </div>

                {/* Seat & Payment Summary */}
                <div className="p-3 bg-light rounded-4 border border-slate-200 d-flex flex-wrap align-items-center justify-content-between gap-3">
                  <div>
                    <div className="detail-label">Seat Allocation</div>
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {booking.seats?.length ? (
                        booking.seats.map((seat) => (
                          <span key={seat} className="seat-badge">
                            🪑 Seat {seat}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted small">Standard Entry (No reserved seat)</span>
                      )}
                    </div>
                  </div>

                  <div className="text-md-end">
                    <div className="detail-label">Amount Paid</div>
                    <div className="fs-4 fw-bold text-primary">₹{formatAmount(booking.totalAmount)}</div>
                  </div>
                </div>
              </div>

              {/* Cut Stub Divider */}
              <div className="stub-separator" />

              {/* Bottom Stub / Verification Section */}
              <div className="p-4 p-md-5 bg-white">
                <div className="row align-items-center justify-content-between g-4">
                  
                  {/* Authentication details */}
                  <div className="col-md-7 text-center text-md-start">
                    <h6 className="fw-bold text-dark mb-1">Gate Verification</h6>
                    <p className="text-muted small mb-3">
                      Present this scannable QR token or Booking Reference code at the security turnstile.
                    </p>

                    <div className="small text-muted fw-bold mb-1">
                      BOOKING REF: <span className="text-dark font-monospace">{bookingCode}</span>
                    </div>

                    {/* Decorative barcode */}
                    <div className="barcode-visual mx-auto mx-md-0">
                      {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 1, 2, 3, 2, 4, 1, 2, 3, 1].map(
                        (width, index) => (
                          <div
                            key={index}
                            className="barcode-bar"
                            style={{ width: `${width * 2}px` }}
                          />
                        )
                      )}
                    </div>
                  </div>

                  {/* QR Code Container */}
                  <div className="col-md-5 text-center text-md-end">
                    <div className="qr-holder">
                      <img
                        src={qrUrl}
                        alt="Booking QR Code"
                        width="135"
                        height="135"
                        crossOrigin="anonymous"
                        className="d-block"
                      />
                    </div>
                    <div className="small text-muted mt-2 font-monospace">
                      PASS-ID • {bookingCode.slice(-8)}
                    </div>
                  </div>

                </div>
              </div>

              {/* Security Footer */}
              <div className="px-4 py-3 bg-light border-top border-slate-200 d-flex flex-wrap justify-content-between align-items-center gap-2 text-muted small">
                <span>EventBook Verified Digital Pass</span>
                <span>Admit One Per Seat Assigned</span>
              </div>

            </div>
          </div>

          {/* Customer support sub-footer */}
          <div className="ticket-wrapper no-print text-center mt-4">
            <p className="text-muted small mb-0">
              Need assistance? Email support at <a href="mailto:support@eventbook.com" className="text-decoration-none fw-semibold">support@eventbook.com</a>
            </p>
          </div>

        </div>
      </div>
    </>
  );
}

export default BookingConfirmation;