import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import EventFilter from "../components/EventFilter";
import { getEvents } from "../services/eventService";

function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     FETCH EVENTS
     ========================================================= */
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getEvents();

        setEvents(
          Array.isArray(data)
            ? data
            : data?.events || []
        );
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load events. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  /* =========================================================
     FILTER EVENTS
     ========================================================= */
  const filteredEvents = events.filter((event) => {
    const title = event.title?.toLowerCase() || "";
    const searchText = search.toLowerCase();

    const matchesSearch = title.includes(searchText);

    const matchesCategory =
      !category || event.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="eventbook-events-page">

      {/* =====================================================
          PAGE STYLES
          ===================================================== */}
      <style>
        {`
          .eventbook-events-page {
            min-height: 100vh;
            background: #f8fafc;
            color: #0f172a;
          }

          /* -----------------------------------------------
             HERO
             ----------------------------------------------- */

          .eventbook-events-hero {
            background:
              radial-gradient(
                circle at 85% 20%,
                rgba(37, 99, 235, 0.08),
                transparent 30%
              ),
              #ffffff;

            border-bottom: 1px solid #e5e7eb;
          }

          .eventbook-hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 7px;

            padding: 7px 13px;

            border-radius: 999px;

            background: #eff6ff;
            color: #2563eb;

            font-size: 11px;
            font-weight: 700;

            letter-spacing: 0.6px;
          }

          .eventbook-hero-title {
            font-size: clamp(30px, 4vw, 46px);
            line-height: 1.1;
            font-weight: 800;

            letter-spacing: -1.2px;

            color: #0f172a;
          }

          .eventbook-hero-text {
            max-width: 650px;

            color: #64748b;

            font-size: 16px;
            line-height: 1.7;
          }

          .eventbook-event-counter {
            display: inline-flex;
            align-items: center;
            gap: 14px;

            padding: 13px 18px;

            background: #ffffff;

            border: 1px solid #e5e7eb;

            border-radius: 14px;

            box-shadow:
              0 6px 20px rgba(15, 23, 42, 0.05);
          }

          .eventbook-counter-icon {
            width: 46px;
            height: 46px;

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 12px;

            background: #eff6ff;

            color: #2563eb;

            font-size: 21px;
          }

          .eventbook-counter-number {
            font-size: 20px;
            font-weight: 800;

            color: #0f172a;

            line-height: 1;
          }

          .eventbook-counter-label {
            font-size: 12px;
            color: #64748b;

            margin-top: 4px;
          }


          /* -----------------------------------------------
             FILTER CARD
             ----------------------------------------------- */

          .eventbook-filter-card {
            background: #ffffff;

            border: 1px solid #e5e7eb;

            border-radius: 18px;

            box-shadow:
              0 8px 25px rgba(15, 23, 42, 0.05);
          }

          .eventbook-section-title {
            color: #0f172a;

            font-weight: 750;

            letter-spacing: -0.2px;
          }

          .eventbook-found-badge {
            background: #f8fafc;

            color: #475569;

            border: 1px solid #e2e8f0;

            border-radius: 999px;

            font-size: 12px;

            padding: 7px 12px;
          }


          /* -----------------------------------------------
             EVENT GRID
             ----------------------------------------------- */

          .eventbook-event-grid {
            display: grid;

            grid-template-columns:
              repeat(3, minmax(0, 1fr));

            gap: 24px;
          }


          /* -----------------------------------------------
             EVENT CARD WRAPPER
             ----------------------------------------------- */

          .eventbook-event-item {
            min-width: 0;

            transition:
              transform 0.2s ease,
              filter 0.2s ease;
          }

          .eventbook-event-item:hover {
            transform: translateY(-4px);
          }


          /* -----------------------------------------------
             IMPORTANT IMAGE FIX
             ----------------------------------------------- */

          /*
             This fixes the image problem shown in your
             screenshot.

             Every EventCard image gets the same professional
             aspect ratio and never stretches.
          */

          .eventbook-events-page .eventbook-event-item img {
            width: 100% !important;

            height: 220px !important;

            display: block;

            object-fit: cover !important;

            object-position: center center;

            background: #e2e8f0;
          }

          /*
             If EventCard uses a normal Bootstrap card,
             this makes the card image corners clean.
          */

          .eventbook-events-page .eventbook-event-item .card {
            height: 100%;

            overflow: hidden;

            border: 1px solid #e5e7eb !important;

            border-radius: 16px !important;

            box-shadow:
              0 5px 18px rgba(15, 23, 42, 0.06) !important;

            transition:
              box-shadow 0.2s ease,
              transform 0.2s ease,
              border-color 0.2s ease;
          }

          .eventbook-events-page .eventbook-event-item .card:hover {
            border-color: #dbeafe !important;

            box-shadow:
              0 12px 30px rgba(15, 23, 42, 0.10) !important;
          }


          /* -----------------------------------------------
             LOADING
             ----------------------------------------------- */

          .eventbook-state-card {
            background: #ffffff;

            border: 1px solid #e5e7eb;

            border-radius: 18px;

            box-shadow:
              0 8px 25px rgba(15, 23, 42, 0.04);
          }

          .eventbook-loading-spinner {
            width: 42px;
            height: 42px;
          }


          /* -----------------------------------------------
             EMPTY STATE
             ----------------------------------------------- */

          .eventbook-empty-icon {
            width: 76px;
            height: 76px;

            display: flex;
            align-items: center;
            justify-content: center;

            margin: 0 auto 18px;

            border-radius: 20px;

            background: #eff6ff;

            font-size: 30px;
          }


          /* -----------------------------------------------
             RESPONSIVE
             ----------------------------------------------- */

          @media (max-width: 1199px) {
            .eventbook-event-grid {
              grid-template-columns:
                repeat(2, minmax(0, 1fr));

              gap: 20px;
            }

            .eventbook-events-page .eventbook-event-item img {
              height: 230px !important;
            }
          }


          @media (max-width: 767px) {

            .eventbook-events-hero {
              border-bottom: 1px solid #e5e7eb;
            }

            .eventbook-hero-title {
              font-size: 32px;
            }

            .eventbook-hero-text {
              font-size: 14px;
            }

            .eventbook-event-counter {
              width: 100%;
              justify-content: flex-start;
            }

            .eventbook-event-grid {
              grid-template-columns: 1fr;

              gap: 18px;
            }

            .eventbook-events-page .eventbook-event-item img {
              height: 220px !important;
            }
          }


          @media (max-width: 480px) {

            .eventbook-hero-title {
              font-size: 29px;
            }

            .eventbook-filter-card {
              border-radius: 14px;
            }

            .eventbook-events-page .eventbook-event-item img {
              height: 205px !important;
            }
          }
        `}
      </style>


      {/* =====================================================
          HERO / PAGE HEADER
          ===================================================== */}
      <section className="eventbook-events-hero">

        <div className="container-fluid px-3 px-md-4 px-xl-5">

          <div className="py-4 py-md-5">

            <div className="row align-items-center g-4">

              {/* LEFT */}
              <div className="col-lg-8">

                <div className="eventbook-hero-badge mb-3">
                  <span>✦</span>
                  EXPLORE EVENTS
                </div>

                <h1 className="eventbook-hero-title mb-3">
                  Discover Your Next
                  <br className="d-none d-md-block" />
                  <span style={{ color: "#2563eb" }}>
                    Great Experience
                  </span>
                </h1>

                <p className="eventbook-hero-text mb-0">
                  Explore upcoming events, find something you love,
                  choose your seats and reserve your experience
                  in just a few clicks.
                </p>

              </div>


              {/* RIGHT */}
              <div className="col-lg-4">

                <div className="d-flex justify-content-lg-end">

                  <div className="eventbook-event-counter">

                    <div className="eventbook-counter-icon">
                      🎟
                    </div>

                    <div>
                      <div className="eventbook-counter-number">
                        {events.length}
                      </div>

                      <div className="eventbook-counter-label">
                        Events Available
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
          MAIN CONTENT
          ===================================================== */}
      <main className="container-fluid px-3 px-md-4 px-xl-5 py-4 py-md-5">


        {/* ===================================================
            SEARCH + FILTER
            =================================================== */}
        <section className="eventbook-filter-card mb-5">

          <div className="p-3 p-md-4">

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

              <div>

                <h5 className="eventbook-section-title mb-1">
                  Find Your Event
                </h5>

                <p className="text-muted small mb-0">
                  Search by event name or filter events by category.
                </p>

              </div>


              {!loading && !error && (
                <span className="eventbook-found-badge">
                  {filteredEvents.length}{" "}
                  {filteredEvents.length === 1
                    ? "event"
                    : "events"}{" "}
                  found
                </span>
              )}

            </div>


            <EventFilter
              search={search}
              setSearch={setSearch}
              category={category}
              setCategory={setCategory}
            />

          </div>

        </section>


        {/* ===================================================
            LOADING STATE
            =================================================== */}
        {loading && (

          <div className="eventbook-state-card">

            <div className="text-center py-5 px-3">

              <div
                className="spinner-border text-primary eventbook-loading-spinner mb-3"
                role="status"
              >
                <span className="visually-hidden">
                  Loading...
                </span>
              </div>

              <h5 className="fw-bold mb-2">
                Loading Events
              </h5>

              <p className="text-muted small mb-0">
                Please wait while we fetch the latest events.
              </p>

            </div>

          </div>

        )}


        {/* ===================================================
            ERROR STATE
            =================================================== */}
        {error && !loading && (

          <div className="eventbook-state-card">

            <div className="text-center py-5 px-3">

              <div
                className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "18px",
                  background: "#fef2f2",
                  fontSize: "28px",
                }}
              >
                ⚠️
              </div>

              <h5 className="fw-bold text-danger mb-2">
                Unable to Load Events
              </h5>

              <p className="text-muted small mb-0">
                {error}
              </p>

            </div>

          </div>

        )}


        {/* ===================================================
            EMPTY STATE
            =================================================== */}
        {!loading &&
          !error &&
          filteredEvents.length === 0 && (

            <div className="eventbook-state-card">

              <div className="text-center py-5 px-3">

                <div className="eventbook-empty-icon">
                  🔍
                </div>

                <h5 className="fw-bold mb-2">
                  No Events Found
                </h5>

                <p
                  className="text-muted small mb-3"
                  style={{ maxWidth: "450px", margin: "0 auto" }}
                >
                  We couldn't find any events matching your
                  current search or category filter.
                </p>

                {(search || category) && (

                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm px-4"
                    onClick={() => {
                      setSearch("");
                      setCategory("");
                    }}
                  >
                    Clear Filters
                  </button>

                )}

              </div>

            </div>

          )}


        {/* ===================================================
            EVENTS SECTION
            =================================================== */}
        {!loading &&
          !error &&
          filteredEvents.length > 0 && (

            <section>

              {/* SECTION HEADER */}
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-end gap-2 mb-4">

                <div>

                  <div className="d-flex align-items-center gap-2 mb-1">

                    <h4
                      className="fw-bold mb-0"
                      style={{
                        color: "#0f172a",
                        letterSpacing: "-0.4px",
                      }}
                    >
                      Upcoming Events
                    </h4>

                    <span
                      className="badge rounded-pill"
                      style={{
                        background: "#eff6ff",
                        color: "#2563eb",
                        fontSize: "11px",
                      }}
                    >
                      {filteredEvents.length}
                    </span>

                  </div>

                  <p className="text-muted small mb-0">
                    Choose an event and reserve your seats.
                  </p>

                </div>


                <span className="text-muted small">
                  Showing {filteredEvents.length}{" "}
                  {filteredEvents.length === 1
                    ? "event"
                    : "events"}
                </span>

              </div>


              {/* EVENT GRID */}
              <div className="eventbook-event-grid">

                {filteredEvents.map((event) => (

                  <div
                    className="eventbook-event-item"
                    key={event._id}
                  >
                    <EventCard event={event} />
                  </div>

                ))}

              </div>

            </section>

          )}

      </main>


      {/* =====================================================
          FOOTER SPACING
          ===================================================== */}
      <div style={{ height: "20px" }} />

    </div>
  );
}

export default Events;