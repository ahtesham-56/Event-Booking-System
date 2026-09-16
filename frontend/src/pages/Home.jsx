import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="bg-light">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section className="position-relative overflow-hidden bg-white">
        <div
          className="position-absolute top-0 end-0 bg-primary rounded-circle opacity-10"
          style={{
            width: "420px",
            height: "420px",
            transform: "translate(35%, -35%)",
          }}
        />

        <div
          className="position-absolute bottom-0 start-0 bg-primary rounded-circle opacity-10"
          style={{
            width: "280px",
            height: "280px",
            transform: "translate(-45%, 45%)",
          }}
        />

        <div className="container position-relative py-5">
          <div className="row align-items-center g-5 py-lg-5">

            {/* ================= HERO CONTENT ================= */}
            <div className="col-lg-6">

              <div className="mb-3">
                <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-semibold">
                  ✨ YOUR NEXT EXPERIENCE STARTS HERE
                </span>
              </div>

              <h1
                className="fw-bold text-dark mb-4"
                style={{
                  fontSize: "clamp(2.6rem, 6vw, 4.7rem)",
                  lineHeight: "1.05",
                }}
              >
                Discover.
                <span className="d-block text-primary">
                  Book.
                </span>
                Experience.
              </h1>

              <p
                className="text-secondary mb-4"
                style={{
                  fontSize: "1.15rem",
                  lineHeight: "1.8",
                  maxWidth: "580px",
                }}
              >
                Find exciting events, choose your preferred seats,
                and book your tickets in just a few simple steps.
              </p>

              {/* Buttons */}
              <div className="d-flex flex-wrap gap-3 mb-5">

                <Link
                  to="/events"
                  className="btn btn-primary btn-lg px-4 py-3 rounded-3 fw-semibold shadow-sm"
                >
                  Explore Events
                  <span className="ms-2">→</span>
                </Link>

                <Link
                  to="/register"
                  className="btn btn-outline-dark btn-lg px-4 py-3 rounded-3 fw-semibold"
                >
                  Create Account
                </Link>

              </div>

              {/* Trust / Highlights */}
              <div className="row g-3">

                <div className="col-6 col-sm-4">
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: "42px",
                        height: "42px",
                      }}
                    >
                      🔎
                    </div>

                    <div>
                      <div className="fw-bold">Easy</div>
                      <small className="text-muted">
                        Event discovery
                      </small>
                    </div>
                  </div>
                </div>

                <div className="col-6 col-sm-4">
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="bg-success-subtle text-success rounded-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: "42px",
                        height: "42px",
                      }}
                    >
                      💺
                    </div>

                    <div>
                      <div className="fw-bold">Flexible</div>
                      <small className="text-muted">
                        Seat selection
                      </small>
                    </div>
                  </div>
                </div>

                <div className="col-6 col-sm-4">
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="bg-warning-subtle text-warning rounded-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: "42px",
                        height: "42px",
                      }}
                    >
                      ✓
                    </div>

                    <div>
                      <div className="fw-bold">Instant</div>
                      <small className="text-muted">
                        Confirmation
                      </small>
                    </div>
                  </div>
                </div>

              </div>
            </div>


            {/* ================= HERO VISUAL ================= */}
            <div className="col-lg-6">

              <div className="position-relative">

                {/* Main Card */}
                <div
                  className="card border-0 shadow-lg rounded-4 overflow-hidden"
                  style={{
                    maxWidth: "560px",
                    margin: "0 auto",
                  }}
                >

                  {/* Top */}
                  <div className="bg-primary text-white p-4 p-md-5">

                    <div className="d-flex justify-content-between align-items-center mb-5">

                      <div>
                        <div className="fw-bold fs-4">
                          EventBook
                        </div>

                        <small className="opacity-75">
                          Your event companion
                        </small>
                      </div>

                      <span className="badge bg-white text-primary rounded-pill px-3 py-2">
                        LIVE
                      </span>

                    </div>

                    <div className="text-center py-3">

                      <div
                        className="bg-white text-primary rounded-circle shadow-sm d-inline-flex align-items-center justify-content-center mb-4"
                        style={{
                          width: "120px",
                          height: "120px",
                          fontSize: "55px",
                        }}
                      >
                        🎫
                      </div>

                      <h2 className="fw-bold mb-2">
                        Your Event Journey
                      </h2>

                      <p className="mb-0 opacity-75">
                        Discover • Select • Confirm
                      </p>

                    </div>

                  </div>

                  {/* Bottom */}
                  <div className="bg-white p-4">

                    <div className="row text-center g-0">

                      <div className="col-4">
                        <div className="text-primary fs-4 mb-1">
                          🔎
                        </div>

                        <div className="fw-semibold">
                          Discover
                        </div>

                        <small className="text-muted">
                          Find events
                        </small>
                      </div>

                      <div className="col-4 border-start border-end">
                        <div className="text-primary fs-4 mb-1">
                          💺
                        </div>

                        <div className="fw-semibold">
                          Select
                        </div>

                        <small className="text-muted">
                          Pick seats
                        </small>
                      </div>

                      <div className="col-4">
                        <div className="text-primary fs-4 mb-1">
                          ✓
                        </div>

                        <div className="fw-semibold">
                          Confirm
                        </div>

                        <small className="text-muted">
                          Get ticket
                        </small>
                      </div>

                    </div>

                  </div>
                </div>


                {/* Floating Notification */}
                <div
                  className="card border-0 shadow rounded-4 position-absolute bg-white"
                  style={{
                    left: "-25px",
                    bottom: "25px",
                    width: "210px",
                  }}
                >
                  <div className="card-body p-3">

                    <div className="d-flex align-items-center gap-3">

                      <div
                        className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "42px",
                          height: "42px",
                        }}
                      >
                        ✓
                      </div>

                      <div>
                        <small className="text-muted d-block">
                          Booking
                        </small>

                        <span className="fw-bold">
                          Confirmed!
                        </span>
                      </div>

                    </div>

                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* =====================================================
          STATS SECTION
      ===================================================== */}
      <section className="bg-white border-top border-bottom">
        <div className="container py-4">

          <div className="row g-4 text-center">

            <div className="col-6 col-md-3">
              <div className="fw-bold fs-3 text-primary">
                100+
              </div>
              <small className="text-muted">
                Events
              </small>
            </div>

            <div className="col-6 col-md-3">
              <div className="fw-bold fs-3 text-primary">
                1K+
              </div>
              <small className="text-muted">
                Tickets Booked
              </small>
            </div>

            <div className="col-6 col-md-3">
              <div className="fw-bold fs-3 text-primary">
                50+
              </div>
              <small className="text-muted">
                Venues
              </small>
            </div>

            <div className="col-6 col-md-3">
              <div className="fw-bold fs-3 text-primary">
                24/7
              </div>
              <small className="text-muted">
                Easy Access
              </small>
            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          FEATURES
      ===================================================== */}
      <section className="container py-5">

        <div className="text-center mb-5">

          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2">
            SIMPLE & CONVENIENT
          </span>

          <h2 className="fw-bold mt-3 mb-2">
            Everything You Need
          </h2>

          <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
            EventBook makes discovering and booking your next
            experience simple, fast and convenient.
          </p>

        </div>


        <div className="row g-4">

          {/* Feature 1 */}
          <div className="col-md-4">

            <div
              className="card border-0 shadow-sm rounded-4 h-100"
            >
              <div className="card-body p-4 p-lg-5">

                <div
                  className="bg-primary-subtle text-primary rounded-4 d-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "64px",
                    height: "64px",
                    fontSize: "28px",
                  }}
                >
                  🔎
                </div>

                <h5 className="fw-bold mb-3">
                  Discover Events
                </h5>

                <p className="text-muted mb-0 lh-lg">
                  Browse upcoming events and discover
                  experiences that match your interests.
                </p>

              </div>
            </div>

          </div>


          {/* Feature 2 */}
          <div className="col-md-4">

            <div
              className="card border-0 shadow-sm rounded-4 h-100"
            >
              <div className="card-body p-4 p-lg-5">

                <div
                  className="bg-success-subtle text-success rounded-4 d-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "64px",
                    height: "64px",
                    fontSize: "28px",
                  }}
                >
                  💺
                </div>

                <h5 className="fw-bold mb-3">
                  Choose Your Seats
                </h5>

                <p className="text-muted mb-0 lh-lg">
                  Select the seats you prefer and review
                  your booking before confirming.
                </p>

              </div>
            </div>

          </div>


          {/* Feature 3 */}
          <div className="col-md-4">

            <div
              className="card border-0 shadow-sm rounded-4 h-100"
            >
              <div className="card-body p-4 p-lg-5">

                <div
                  className="bg-warning-subtle text-warning rounded-4 d-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "64px",
                    height: "64px",
                    fontSize: "28px",
                  }}
                >
                  ✓
                </div>

                <h5 className="fw-bold mb-3">
                  Instant Confirmation
                </h5>

                <p className="text-muted mb-0 lh-lg">
                  Complete your booking and receive your
                  confirmation details immediately.
                </p>

              </div>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}
      <section className="bg-white py-5">

        <div className="container py-4">

          <div className="text-center mb-5">

            <span className="badge bg-dark rounded-pill px-3 py-2">
              HOW IT WORKS
            </span>

            <h2 className="fw-bold mt-3 mb-2">
              Book Your Event in 3 Simple Steps
            </h2>

            <p className="text-muted">
              From discovery to confirmation, everything is simple.
            </p>

          </div>


          <div className="row g-4 position-relative">

            {/* Step 1 */}
            <div className="col-md-4">

              <div className="text-center px-3">

                <div
                  className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center fw-bold shadow-sm mb-4"
                  style={{
                    width: "72px",
                    height: "72px",
                    fontSize: "25px",
                  }}
                >
                  1
                </div>

                <h5 className="fw-bold">
                  Find an Event
                </h5>

                <p className="text-muted lh-lg">
                  Browse upcoming events and discover
                  something you would love to experience.
                </p>

              </div>

            </div>


            {/* Step 2 */}
            <div className="col-md-4">

              <div className="text-center px-3">

                <div
                  className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center fw-bold shadow-sm mb-4"
                  style={{
                    width: "72px",
                    height: "72px",
                    fontSize: "25px",
                  }}
                >
                  2
                </div>

                <h5 className="fw-bold">
                  Select Your Seats
                </h5>

                <p className="text-muted lh-lg">
                  Choose your preferred seats and review
                  the total booking amount.
                </p>

              </div>

            </div>


            {/* Step 3 */}
            <div className="col-md-4">

              <div className="text-center px-3">

                <div
                  className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center fw-bold shadow-sm mb-4"
                  style={{
                    width: "72px",
                    height: "72px",
                    fontSize: "25px",
                  }}
                >
                  3
                </div>

                <h5 className="fw-bold">
                  Confirm Booking
                </h5>

                <p className="text-muted lh-lg">
                  Confirm your booking and get your event
                  ticket information instantly.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          WHY EVENTBOOK
      ===================================================== */}
      <section className="container py-5">

        <div className="row align-items-center g-5">

          <div className="col-lg-6">

            <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2">
              WHY EVENTBOOK?
            </span>

            <h2 className="fw-bold mt-3 mb-4">
              Your Events,
              <span className="text-primary"> Your Way.</span>
            </h2>

            <p className="text-muted lh-lg mb-4">
              EventBook brings event discovery, seat selection
              and ticket booking together in one simple platform.
            </p>

            <div className="d-flex gap-3 mb-3">

              <div
                className="bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: "45px",
                  height: "45px",
                }}
              >
                ✓
              </div>

              <div>
                <h6 className="fw-bold mb-1">
                  Simple Booking
                </h6>

                <p className="text-muted small mb-0">
                  Book your event without unnecessary steps.
                </p>
              </div>

            </div>


            <div className="d-flex gap-3 mb-3">

              <div
                className="bg-success-subtle text-success rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: "45px",
                  height: "45px",
                }}
              >
                ✓
              </div>

              <div>
                <h6 className="fw-bold mb-1">
                  Seat Selection
                </h6>

                <p className="text-muted small mb-0">
                  Select the seats that work best for you.
                </p>
              </div>

            </div>


            <div className="d-flex gap-3">

              <div
                className="bg-warning-subtle text-warning rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: "45px",
                  height: "45px",
                }}
              >
                ✓
              </div>

              <div>
                <h6 className="fw-bold mb-1">
                  Quick Confirmation
                </h6>

                <p className="text-muted small mb-0">
                  Get your booking details immediately.
                </p>
              </div>

            </div>

          </div>


          {/* Right Card */}
          <div className="col-lg-6">

            <div
              className="card border-0 shadow-sm rounded-4 overflow-hidden"
            >

              <div className="bg-primary text-white p-4 p-md-5">

                <div className="d-flex justify-content-between align-items-center mb-4">

                  <span className="fw-bold fs-5">
                    EventBook
                  </span>

                  <span className="badge bg-white text-primary rounded-pill">
                    EASY
                  </span>

                </div>

                <h3 className="fw-bold mb-3">
                  One Platform.
                  <br />
                  Endless Experiences.
                </h3>

                <p className="opacity-75 mb-0">
                  Find your next event and make it memorable.
                </p>

              </div>

              <div className="p-4 bg-white">

                <div className="row g-3">

                  <div className="col-4">
                    <div className="bg-light rounded-3 p-3 text-center">
                      <div className="fs-4 mb-1">🎵</div>
                      <small className="fw-semibold">
                        Music
                      </small>
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="bg-light rounded-3 p-3 text-center">
                      <div className="fs-4 mb-1">💻</div>
                      <small className="fw-semibold">
                        Tech
                      </small>
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="bg-light rounded-3 p-3 text-center">
                      <div className="fs-4 mb-1">🎨</div>
                      <small className="fw-semibold">
                        Arts
                      </small>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}
      <section className="container pb-5">

        <div
          className="card border-0 rounded-4 overflow-hidden shadow-lg bg-primary text-white"
        >

          <div className="card-body text-center p-5">

            <div
              className="bg-white text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
              style={{
                width: "70px",
                height: "70px",
                fontSize: "30px",
              }}
            >
              🎉
            </div>

            <h2 className="fw-bold mb-3">
              Ready for Your Next Experience?
            </h2>

            <p
              className="mb-4 mx-auto opacity-75"
              style={{ maxWidth: "600px" }}
            >
              Explore upcoming events, choose your seats,
              and book your next experience today.
            </p>

            <div className="d-flex justify-content-center flex-wrap gap-3">

              <Link
                to="/events"
                className="btn btn-light btn-lg px-4 rounded-3 fw-semibold"
              >
                Explore Events →
              </Link>

              <Link
                to="/register"
                className="btn btn-outline-light btn-lg px-4 rounded-3 fw-semibold"
              >
                Join EventBook
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER SPACE
      ===================================================== */}
      <div className="pb-3" />

    </div>
  );
}

export default Home;

