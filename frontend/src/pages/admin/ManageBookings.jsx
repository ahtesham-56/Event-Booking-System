
function ManageBookings() {
  const bookings = [
    {
      id: "BK001",
      user: "Ahtesham Rana",
      event: "Tech Fest 2026",
      seats: 2,
      amount: 598,
      status: "Confirmed",
    },
    {
      id: "BK002",
      user: "Rahul Sharma",
      event: "Music Night",
      seats: 1,
      amount: 499,
      status: "Confirmed",
    },
  ];

  // ================= STATS =================

  const totalBookings = bookings.length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "Confirmed"
  ).length;

  const totalSeats = bookings.reduce(
    (total, booking) => total + Number(booking.seats || 0),
    0
  );

  const totalRevenue = bookings.reduce(
    (total, booking) => total + Number(booking.amount || 0),
    0
  );

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
                Booking Management
              </span>

            </div>

            <h2 className="fw-bold mb-1">
              Manage Bookings
            </h2>

            <p className="text-muted mb-0">
              View and monitor customer bookings across your events.
            </p>

          </div>

        </div>

      </div>

      {/* ================= STAT CARDS ================= */}

      <div className="row g-4 mb-4">

        {/* Total Bookings */}

        <div className="col-md-6 col-xl-3">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-start">

                <div>

                  <p className="text-muted small mb-2">
                    TOTAL BOOKINGS
                  </p>

                  <h3 className="fw-bold mb-1">
                    {totalBookings}
                  </h3>

                  <small className="text-muted">
                    All customer bookings
                  </small>

                </div>

                <div
                  className="rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                  style={{
                    width: "50px",
                    height: "50px",
                    fontSize: "23px",
                  }}
                >
                  📋
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Confirmed */}

        <div className="col-md-6 col-xl-3">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-start">

                <div>

                  <p className="text-muted small mb-2">
                    CONFIRMED
                  </p>

                  <h3 className="fw-bold mb-1">
                    {confirmedBookings}
                  </h3>

                  <small className="text-success">
                    ● Active bookings
                  </small>

                </div>

                <div
                  className="rounded-3 bg-success bg-opacity-10 d-flex align-items-center justify-content-center"
                  style={{
                    width: "50px",
                    height: "50px",
                    fontSize: "23px",
                  }}
                >
                  ✓
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Seats */}

        <div className="col-md-6 col-xl-3">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-start">

                <div>

                  <p className="text-muted small mb-2">
                    BOOKED SEATS
                  </p>

                  <h3 className="fw-bold mb-1">
                    {totalSeats}
                  </h3>

                  <small className="text-muted">
                    Seats reserved
                  </small>

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

        {/* Revenue */}

        <div className="col-md-6 col-xl-3">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-start">

                <div>

                  <p className="text-muted small mb-2">
                    TOTAL REVENUE
                  </p>

                  <h3 className="fw-bold mb-1">
                    ₹
                    {totalRevenue.toLocaleString(
                      "en-IN"
                    )}
                  </h3>

                  <small className="text-muted">
                    Booking revenue
                  </small>

                </div>

                <div
                  className="rounded-3 bg-info bg-opacity-10 d-flex align-items-center justify-content-center"
                  style={{
                    width: "50px",
                    height: "50px",
                    fontSize: "23px",
                  }}
                >
                  ₹
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================= BOOKINGS TABLE ================= */}

      <div className="card border-0 shadow-sm">

        {/* Card Header */}

        <div className="card-header bg-white border-bottom p-4">

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">

            <div>

              <h5 className="fw-bold mb-1">
                Customer Bookings
              </h5>

              <p className="text-muted small mb-0">
                Review all booking information.
              </p>

            </div>

            <span className="badge bg-light text-dark border px-3 py-2">
              {totalBookings}{" "}
              {totalBookings === 1
                ? "Booking"
                : "Bookings"}
            </span>

          </div>

        </div>

        {/* Table */}

        <div className="card-body p-0">

          <div className="table-responsive">

            <table className="table table-hover align-middle mb-0">

              <thead className="table-light">

                <tr>

                  <th className="px-4 py-3">
                    Booking
                  </th>

                  <th className="py-3">
                    Customer
                  </th>

                  <th className="py-3">
                    Event
                  </th>

                  <th className="py-3">
                    Seats
                  </th>

                  <th className="py-3">
                    Amount
                  </th>

                  <th className="py-3">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {bookings.map((booking) => (

                  <tr key={booking.id}>

                    {/* Booking ID */}

                    <td className="px-4">

                      <div className="d-flex align-items-center gap-3">

                        <div
                          className="rounded-3 bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold"
                          style={{
                            width: "45px",
                            height: "45px",
                            flexShrink: 0,
                          }}
                        >
                          #
                        </div>

                        <div>

                          <div className="fw-semibold">
                            {booking.id}
                          </div>

                          <small className="text-muted">
                            Booking ID
                          </small>

                        </div>

                      </div>

                    </td>

                    {/* Customer */}

                    <td>

                      <div className="d-flex align-items-center gap-2">

                        <div
                          className="rounded-circle bg-light border d-flex align-items-center justify-content-center"
                          style={{
                            width: "40px",
                            height: "40px",
                            flexShrink: 0,
                          }}
                        >
                          👤
                        </div>

                        <div>

                          <div className="fw-semibold">
                            {booking.user}
                          </div>

                          <small className="text-muted">
                            Customer
                          </small>

                        </div>

                      </div>

                    </td>

                    {/* Event */}

                    <td>

                      <div className="fw-semibold">
                        {booking.event}
                      </div>

                      <small className="text-muted">
                        Event booking
                      </small>

                    </td>

                    {/* Seats */}

                    <td>

                      <span className="badge bg-light text-dark border px-3 py-2">
                        🎟️ {booking.seats}
                      </span>

                    </td>

                    {/* Amount */}

                    <td>

                      <span className="fw-bold">
                        ₹
                        {Number(
                          booking.amount
                        ).toLocaleString("en-IN")}
                      </span>

                    </td>

                    {/* Status */}

                    <td>

                      {booking.status ===
                      "Confirmed" ? (

                        <span className="badge bg-success bg-opacity-10 text-success px-3 py-2">
                          ● {booking.status}
                        </span>

                      ) : (

                        <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2">
                          {booking.status}
                        </span>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* ================= INFORMATION CARD ================= */}

      <div className="card border-0 shadow-sm mt-4">

        <div className="card-body p-4">

          <div className="d-flex align-items-start gap-3">

            <div
              className="rounded-3 bg-info bg-opacity-10 d-flex align-items-center justify-content-center"
              style={{
                width: "45px",
                height: "45px",
                flexShrink: 0,
                fontSize: "20px",
              }}
            >
              💡
            </div>

            <div>

              <h6 className="fw-bold mb-1">
                Booking Overview
              </h6>

              <p className="text-muted small mb-0">
                Use this section to monitor customer bookings,
                reserved seats and booking revenue. Once your
                backend booking API is connected, this page can
                display live booking information automatically.
              </p>

            </div>

          </div>

        </div>

      </div>

      <div style={{ height: "30px" }}></div>

    </div>
  );
}

export default ManageBookings;