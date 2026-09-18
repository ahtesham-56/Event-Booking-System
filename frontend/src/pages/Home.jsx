import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="bg-light text-dark">

      {/* =========================================================
          HERO SECTION
      ========================================================= */}
      <section className="position-relative overflow-hidden bg-white">

        {/* Background Shapes */}
        <div
          className="position-absolute bg-primary rounded-circle opacity-10"
          style={{
            width: "520px",
            height: "520px",
            top: "-280px",
            right: "-180px",
          }}
        />

        <div
          className="position-absolute bg-primary rounded-circle opacity-10"
          style={{
            width: "350px",
            height: "350px",
            bottom: "-220px",
            left: "-180px",
          }}
        />

        <div className="container position-relative py-5">

          <div className="row align-items-center g-5 py-lg-5">

            {/* =====================================================
                HERO CONTENT
            ===================================================== */}
            <div className="col-lg-6">

              <div className="mb-4">
                <span
                  className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-semibold"
                  style={{ letterSpacing: "0.5px" }}
                >
                  YOUR NEXT EXPERIENCE STARTS HERE
                </span>
              </div>

              <h1
                className="fw-bold text-dark mb-4"
                style={{
                  fontSize: "clamp(2.7rem, 6vw, 5rem)",
                  lineHeight: "1.02",
                  letterSpacing: "-2px",
                }}
              >
                Discover.
                <br />

                <span className="text-primary">
                  Book.
                </span>

                <br />

                Experience.
              </h1>

              <p
                className="text-secondary mb-4"
                style={{
                  fontSize: "1.12rem",
                  lineHeight: "1.8",
                  maxWidth: "560px",
                }}
              >
                Discover exciting events, choose your preferred seats,
                and secure your tickets through a simple and seamless
                booking experience.
              </p>

              {/* CTA Buttons */}
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

              {/* Trust Points */}
              <div className="row g-4">

                <div className="col-12 col-sm-4">
                  <div className="d-flex align-items-center gap-3">

                    <div
                      className="bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: "44px",
                        height: "44px",
                      }}
                    >
                      <span className="fw-bold">01</span>
                    </div>

                    <div>
                      <div className="fw-bold">
                        Easy
                      </div>

                      <small className="text-muted">
                        Event discovery
                      </small>
                    </div>

                  </div>
                </div>

                <div className="col-12 col-sm-4">
                  <div className="d-flex align-items-center gap-3">

                    <div
                      className="bg-success-subtle text-success rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: "44px",
                        height: "44px",
                      }}
                    >
                      <span className="fw-bold">02</span>
                    </div>

                    <div>
                      <div className="fw-bold">
                        Flexible
                      </div>

                      <small className="text-muted">
                        Seat selection
                      </small>
                    </div>

                  </div>
                </div>

                <div className="col-12 col-sm-4">
                  <div className="d-flex align-items-center gap-3">

                    <div
                      className="bg-warning-subtle text-warning rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: "44px",
                        height: "44px",
                      }}
                    >
                      <span className="fw-bold">03</span>
                    </div>

                    <div>
                      <div className="fw-bold">
                        Instant
                      </div>

                      <small className="text-muted">
                        Confirmation
                      </small>
                    </div>

                  </div>
                </div>

              </div>

            </div>


            {/* =====================================================
                HERO VISUAL
            ===================================================== */}
            <div className="col-lg-6">

              <div
                className="position-relative mx-auto"
                style={{ maxWidth: "560px" }}
              >

                {/* Main Event Card */}
                <div
                  className="card border-0 shadow-lg rounded-4 overflow-hidden"
                >

                  {/* Card Header */}
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

                    {/* Ticket Visual */}
                    <div className="text-center py-3">

                      <div
                        className="bg-white text-primary rounded-4 d-inline-flex align-items-center justify-content-center shadow-sm mb-4"
                        style={{
                          width: "115px",
                          height: "115px",
                        }}
                      >
                        <div className="text-center">
                          <div
                            className="fw-bold"
                            style={{ fontSize: "2rem" }}
                          >
                            EB
                          </div>

                          <small className="fw-semibold">
                            TICKET
                          </small>
                        </div>
                      </div>

                      <h2 className="fw-bold mb-2">
                        Your Event Journey
                      </h2>

                      <p className="mb-0 opacity-75">
                        Discover • Select • Confirm
                      </p>

                    </div>

                  </div>


                  {/* Card Bottom */}
                  <div className="bg-white p-4">

                    <div className="row text-center g-0">

                      <div className="col-4">

                        <div className="text-primary fw-bold fs-5 mb-2">
                          01
                        </div>

                        <div className="fw-semibold">
                          Discover
                        </div>

                        <small className="text-muted">
                          Find events
                        </small>

                      </div>

                      <div className="col-4 border-start border-end">

                        <div className="text-primary fw-bold fs-5 mb-2">
                          02
                        </div>

                        <div className="fw-semibold">
                          Select
                        </div>

                        <small className="text-muted">
                          Pick seats
                        </small>

                      </div>

                      <div className="col-4">

                        <div className="text-primary fw-bold fs-5 mb-2">
                          03
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


              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          STATS SECTION
      ========================================================= */}
      <section className="bg-white border-top border-bottom">

        <div className="container py-4">

          <div className="row g-4 text-center">

            <div className="col-6 col-md-3">

              <div className="fw-bold fs-2 text-primary">
                100+
              </div>

              <small className="text-muted">
                Events
              </small>

            </div>

            <div className="col-6 col-md-3">

              <div className="fw-bold fs-2 text-primary">
                1K+
              </div>

              <small className="text-muted">
                Tickets Booked
              </small>

            </div>

            <div className="col-6 col-md-3">

              <div className="fw-bold fs-2 text-primary">
                50+
              </div>

              <small className="text-muted">
                Venues
              </small>

            </div>

            <div className="col-6 col-md-3">

              <div className="fw-bold fs-2 text-primary">
                24/7
              </div>

              <small className="text-muted">
                Easy Access
              </small>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          FEATURES SECTION
      ========================================================= */}
      <section className="container py-5">

        <div className="text-center mb-5">

          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-semibold">
            SIMPLE & CONVENIENT
          </span>

          <h2 className="fw-bold mt-3 mb-3">
            Everything You Need
          </h2>

          <p
            className="text-muted mx-auto"
            style={{ maxWidth: "620px" }}
          >
            EventBook brings event discovery, seat selection,
            and ticket booking together in one easy-to-use platform.
          </p>

        </div>


        <div className="row g-4">

          {/* Feature 1 */}
          <div className="col-md-4">

            <div className="card border-0 shadow-sm rounded-4 h-100">

              <div className="card-body p-4 p-lg-5">

                <div
                  className="bg-primary-subtle text-primary rounded-4 d-flex align-items-center justify-content-center mb-4 fw-bold"
                  style={{
                    width: "64px",
                    height: "64px",
                    fontSize: "20px",
                  }}
                >
                  01
                </div>

                <h5 className="fw-bold mb-3">
                  Discover Events
                </h5>

                <p className="text-muted lh-lg mb-0">
                  Browse upcoming events, explore different
                  categories, and find experiences that match
                  your interests.
                </p>

              </div>

            </div>

          </div>


          {/* Feature 2 */}
          <div className="col-md-4">

            <div className="card border-0 shadow-sm rounded-4 h-100">

              <div className="card-body p-4 p-lg-5">

                <div
                  className="bg-success-subtle text-success rounded-4 d-flex align-items-center justify-content-center mb-4 fw-bold"
                  style={{
                    width: "64px",
                    height: "64px",
                    fontSize: "20px",
                  }}
                >
                  02
                </div>

                <h5 className="fw-bold mb-3">
                  Choose Your Seats
                </h5>

                <p className="text-muted lh-lg mb-0">
                  Select your preferred seats, review the
                  booking details, and see the total amount
                  before confirming.
                </p>

              </div>

            </div>

          </div>


          {/* Feature 3 */}
          <div className="col-md-4">

            <div className="card border-0 shadow-sm rounded-4 h-100">

              <div className="card-body p-4 p-lg-5">

                <div
                  className="bg-warning-subtle text-warning rounded-4 d-flex align-items-center justify-content-center mb-4 fw-bold"
                  style={{
                    width: "64px",
                    height: "64px",
                    fontSize: "20px",
                  }}
                >
                  03
                </div>

                <h5 className="fw-bold mb-3">
                  Instant Confirmation
                </h5>

                <p className="text-muted lh-lg mb-0">
                  Complete your booking and instantly receive
                  your confirmation details for a smooth event
                  experience.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}
      <section className="bg-white py-5">

        <div className="container py-4">

          <div className="text-center mb-5">

            <span className="badge bg-dark rounded-pill px-3 py-2">
              HOW IT WORKS
            </span>

            <h2 className="fw-bold mt-3 mb-3">
              Book Your Event in 3 Simple Steps
            </h2>

            <p className="text-muted mb-0">
              From discovering an event to receiving your ticket,
              everything stays simple.
            </p>

          </div>


          <div className="row g-5">

            {/* Step 1 */}
            <div className="col-md-4">

              <div className="text-center px-3">

                <div
                  className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center fw-bold shadow-sm mb-4"
                  style={{
                    width: "72px",
                    height: "72px",
                    fontSize: "24px",
                  }}
                >
                  1
                </div>

                <h5 className="fw-bold">
                  Find an Event
                </h5>

                <p className="text-muted lh-lg mb-0">
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
                    fontSize: "24px",
                  }}
                >
                  2
                </div>

                <h5 className="fw-bold">
                  Select Your Seats
                </h5>

                <p className="text-muted lh-lg mb-0">
                  Choose your preferred seats and review
                  your booking amount before confirming.
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
                    fontSize: "24px",
                  }}
                >
                  3
                </div>

                <h5 className="fw-bold">
                  Confirm Booking
                </h5>

                <p className="text-muted lh-lg mb-0">
                  Confirm your booking and receive your
                  event ticket information instantly.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          WHY EVENTBOOK
      ========================================================= */}
      <section className="container py-5">

        <div className="row align-items-center g-5">

          {/* Left Content */}
          <div className="col-lg-6">

            <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-semibold">
              WHY EVENTBOOK?
            </span>

            <h2 className="fw-bold mt-3 mb-4">

              Your Events,

              <span className="text-primary">
                {" "}Your Way.
              </span>

            </h2>

            <p className="text-muted lh-lg mb-4">
              EventBook brings event discovery, seat selection,
              and ticket booking together in one convenient
              platform designed for a smooth experience.
            </p>


            {/* Benefit 1 */}
            <div className="d-flex gap-3 mb-4">

              <div
                className="bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 fw-bold"
                style={{
                  width: "46px",
                  height: "46px",
                }}
              >
                ✓
              </div>

              <div>

                <h6 className="fw-bold mb-1">
                  Simple Booking
                </h6>

                <p className="text-muted small mb-0">
                  Complete your booking without unnecessary
                  steps or complicated navigation.
                </p>

              </div>

            </div>


            {/* Benefit 2 */}
            <div className="d-flex gap-3 mb-4">

              <div
                className="bg-success-subtle text-success rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 fw-bold"
                style={{
                  width: "46px",
                  height: "46px",
                }}
              >
                ✓
              </div>

              <div>

                <h6 className="fw-bold mb-1">
                  Flexible Seat Selection
                </h6>

                <p className="text-muted small mb-0">
                  Choose the seats that work best for your
                  event experience.
                </p>

              </div>

            </div>


            {/* Benefit 3 */}
            <div className="d-flex gap-3">

              <div
                className="bg-warning-subtle text-warning rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 fw-bold"
                style={{
                  width: "46px",
                  height: "46px",
                }}
              >
                ✓
              </div>

              <div>

                <h6 className="fw-bold mb-1">
                  Quick Confirmation
                </h6>

                <p className="text-muted small mb-0">
                  Get your booking details immediately after
                  completing your reservation.
                </p>

              </div>

            </div>

          </div>


          {/* Right Visual */}
          <div className="col-lg-6">

            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">

              {/* Blue Header */}
              <div className="bg-primary text-white p-4 p-md-5">

                <div className="d-flex justify-content-between align-items-center mb-5">

                  <span className="fw-bold fs-5">
                    EventBook
                  </span>

                  <span className="badge bg-white text-primary rounded-pill px-3 py-2">
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


              {/* Categories */}
              <div className="p-4 bg-white">

                <div className="row g-3">

                  <div className="col-4">

                    <div className="bg-light rounded-3 p-3 text-center h-100">

                      <div className="fw-bold text-primary fs-5 mb-2">
                        MUSIC
                      </div>

                      <small className="fw-semibold text-muted">
                        Live events
                      </small>

                    </div>

                  </div>


                  <div className="col-4">

                    <div className="bg-light rounded-3 p-3 text-center h-100">

                      <div className="fw-bold text-primary fs-5 mb-2">
                        TECH
                      </div>

                      <small className="fw-semibold text-muted">
                        Conferences
                      </small>

                    </div>

                  </div>


                  <div className="col-4">

                    <div className="bg-light rounded-3 p-3 text-center h-100">

                      <div className="fw-bold text-primary fs-5 mb-2">
                        ARTS
                      </div>

                      <small className="fw-semibold text-muted">
                        Creative
                      </small>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="container pb-5">

        <div
          className="card border-0 rounded-4 overflow-hidden shadow-lg bg-primary text-white"
        >

          <div className="card-body text-center p-4 p-md-5">

            <div
              className="bg-white text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-4 fw-bold"
              style={{
                width: "70px",
                height: "70px",
                fontSize: "20px",
              }}
            >
              EB
            </div>

            <h2 className="fw-bold mb-3">
              Ready for Your Next Experience?
            </h2>

            <p
              className="mb-4 mx-auto opacity-75"
              style={{ maxWidth: "600px" }}
            >
              Explore upcoming events, choose your seats,
              and book your next experience with EventBook.
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


      {/* Bottom spacing */}
      <div className="pb-3" />

    </div>
  );
}

export default Home;
