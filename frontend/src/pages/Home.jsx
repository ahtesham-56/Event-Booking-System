
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="bg-light">

      {/* ================= HERO SECTION ================= */}
      <section className="bg-white py-5">
        <div className="container py-5">

          <div className="row align-items-center g-5">

            {/* Hero Content */}
            <div className="col-lg-6">

              <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill mb-3">
                🎉 Event Booking Made Easy
              </span>

              <h1 className="display-3 fw-bold mb-4">
                Book Your Next
                <span className="text-primary d-block">
                  Experience
                </span>
              </h1>

              <p className="lead text-muted mb-4">
                Discover exciting events, choose your seats,
                and book your tickets quickly and easily.
              </p>

              <div className="d-flex flex-wrap gap-3">

                <Link
                  to="/events"
                  className="btn btn-primary btn-lg px-4"
                >
                  Explore Events →
                </Link>

                <Link
                  to="/register"
                  className="btn btn-outline-dark btn-lg px-4"
                >
                  Get Started
                </Link>

              </div>

              {/* Small Highlights */}
              <div className="d-flex flex-wrap gap-4 mt-5">

                <div>
                  <h5 className="fw-bold mb-0">
                    🎟️ Easy
                  </h5>
                  <small className="text-muted">
                    Quick booking
                  </small>
                </div>

                <div>
                  <h5 className="fw-bold mb-0">
                    💺 Flexible
                  </h5>
                  <small className="text-muted">
                    Choose your seats
                  </small>
                </div>

                <div>
                  <h5 className="fw-bold mb-0">
                    ✓ Simple
                  </h5>
                  <small className="text-muted">
                    Instant confirmation
                  </small>
                </div>

              </div>

            </div>

            {/* Hero Visual */}
            <div className="col-lg-6">

              <div
                className="card border-0 shadow-lg rounded-4 overflow-hidden"
              >

                <div className="bg-primary p-4 p-md-5 text-white">

                  <div className="d-flex justify-content-between align-items-center mb-5">

                    <span className="fw-bold fs-5">
                      EventBook
                    </span>

                    <span className="badge bg-white text-primary px-3 py-2">
                      LIVE EVENTS
                    </span>

                  </div>

                  <div className="text-center py-4">

                    <div
                      className="bg-white text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                      style={{
                        width: "110px",
                        height: "110px",
                        fontSize: "52px"
                      }}
                    >
                      🎫
                    </div>

                    <h2 className="fw-bold">
                      Your Event Journey
                    </h2>

                    <p className="mb-0 opacity-75">
                      Discover • Book • Enjoy
                    </p>

                  </div>

                </div>

                <div className="card-body p-4">

                  <div className="row text-center">

                    <div className="col-4">
                      <div className="fw-bold fs-5">
                        🔎
                      </div>
                      <small className="text-muted">
                        Discover
                      </small>
                    </div>

                    <div className="col-4 border-start border-end">
                      <div className="fw-bold fs-5">
                        💺
                      </div>
                      <small className="text-muted">
                        Select
                      </small>
                    </div>

                    <div className="col-4">
                      <div className="fw-bold fs-5">
                        ✓
                      </div>
                      <small className="text-muted">
                        Confirm
                      </small>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ================= FEATURES ================= */}
      <section className="container py-5">

        <div className="text-center mb-5">

          <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill mb-2">
            SIMPLE & FAST
          </span>

          <h2 className="fw-bold mt-2">
            Everything You Need
          </h2>

          <p className="text-muted">
            A simple and convenient way to discover and book events.
          </p>

        </div>

        <div className="row g-4">

          {/* Feature 1 */}
          <div className="col-md-4">

            <div className="card border-0 shadow-sm rounded-4 h-100">

              <div className="card-body p-4">

                <div
                  className="bg-primary-subtle text-primary rounded-3 d-inline-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "55px",
                    height: "55px",
                    fontSize: "25px"
                  }}
                >
                  🔎
                </div>

                <h5 className="fw-bold">
                  Discover Events
                </h5>

                <p className="text-muted mb-0">
                  Explore upcoming events and find something
                  exciting to attend.
                </p>

              </div>

            </div>

          </div>


          {/* Feature 2 */}
          <div className="col-md-4">

            <div className="card border-0 shadow-sm rounded-4 h-100">

              <div className="card-body p-4">

                <div
                  className="bg-success-subtle text-success rounded-3 d-inline-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "55px",
                    height: "55px",
                    fontSize: "25px"
                  }}
                >
                  💺
                </div>

                <h5 className="fw-bold">
                  Choose Your Seats
                </h5>

                <p className="text-muted mb-0">
                  Select the seats you want before confirming
                  your event booking.
                </p>

              </div>

            </div>

          </div>


          {/* Feature 3 */}
          <div className="col-md-4">

            <div className="card border-0 shadow-sm rounded-4 h-100">

              <div className="card-body p-4">

                <div
                  className="bg-warning-subtle text-warning rounded-3 d-inline-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "55px",
                    height: "55px",
                    fontSize: "25px"
                  }}
                >
                  ✓
                </div>

                <h5 className="fw-bold">
                  Instant Confirmation
                </h5>

                <p className="text-muted mb-0">
                  Get your booking information immediately
                  after completing your reservation.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-white py-5">

        <div className="container py-4">

          <div className="text-center mb-5">

            <span className="badge bg-dark px-3 py-2 rounded-pill mb-2">
              HOW IT WORKS
            </span>

            <h2 className="fw-bold mt-2">
              Book Your Event in 3 Steps
            </h2>

            <p className="text-muted">
              Getting your event ticket is quick and simple.
            </p>

          </div>

          <div className="row g-4">

            {/* Step 1 */}
            <div className="col-md-4">

              <div className="text-center px-3">

                <div
                  className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center fw-bold fs-4 mb-3"
                  style={{
                    width: "65px",
                    height: "65px"
                  }}
                >
                  1
                </div>

                <h5 className="fw-bold">
                  Find an Event
                </h5>

                <p className="text-muted">
                  Browse our collection of upcoming events
                  and choose your favourite.
                </p>

              </div>

            </div>


            {/* Step 2 */}
            <div className="col-md-4">

              <div className="text-center px-3">

                <div
                  className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center fw-bold fs-4 mb-3"
                  style={{
                    width: "65px",
                    height: "65px"
                  }}
                >
                  2
                </div>

                <h5 className="fw-bold">
                  Select Your Seats
                </h5>

                <p className="text-muted">
                  Pick your preferred seats and review
                  your booking details.
                </p>

              </div>

            </div>


            {/* Step 3 */}
            <div className="col-md-4">

              <div className="text-center px-3">

                <div
                  className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center fw-bold fs-4 mb-3"
                  style={{
                    width: "65px",
                    height: "65px"
                  }}
                >
                  3
                </div>

                <h5 className="fw-bold">
                  Confirm Booking
                </h5>

                <p className="text-muted">
                  Complete your booking and receive your
                  confirmation details.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="container py-5">

        <div className="card border-0 shadow-sm rounded-4 bg-primary text-white overflow-hidden">

          <div className="card-body p-5 text-center">

            <div className="fs-1 mb-3">
              🎉
            </div>

            <h2 className="fw-bold mb-3">
              Ready to Find Your Next Event?
            </h2>

            <p className="mb-4 opacity-75">
              Explore upcoming events and book your seats today.
            </p>

            <Link
              to="/events"
              className="btn btn-light btn-lg px-4"
            >
              Explore Events →
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;
