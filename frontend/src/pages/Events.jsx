
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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();

        setEvents(
          Array.isArray(data)
            ? data
            : data.events || []
        );
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load events."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      !category || event.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-light min-vh-100">

      {/* ================= HEADER ================= */}
      <section className="bg-white border-bottom">
        <div className="container py-5">

          <div className="row align-items-center">

            <div className="col-lg-8">

              <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill mb-3">
                🎉 EXPLORE EVENTS
              </span>

              <h1 className="display-5 fw-bold mb-2">
                Discover Events
              </h1>

              <p className="lead text-muted mb-0">
                Find exciting events, choose your seats,
                and book your next experience.
              </p>

            </div>

            <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">

              <div className="d-inline-flex align-items-center gap-3">

                <div
                  className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "55px",
                    height: "55px",
                    fontSize: "25px"
                  }}
                >
                  🎟️
                </div>

                <div className="text-start">

                  <div className="fw-bold fs-5">
                    {events.length}
                  </div>

                  <small className="text-muted">
                    Events Available
                  </small>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ================= MAIN CONTENT ================= */}
      <div className="container py-5">

        {/* Filter Section */}
        <div className="card border-0 shadow-sm rounded-4 mb-5">

          <div className="card-body p-4">

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">

              <div>
                <h5 className="fw-bold mb-1">
                  Find Your Event
                </h5>

                <p className="text-muted small mb-0">
                  Search by event name or filter by category.
                </p>
              </div>

              {!loading && !error && (
                <span className="badge bg-light text-dark border px-3 py-2">
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

        </div>


        {/* ================= LOADING ================= */}
        {loading && (
          <div className="card border-0 shadow-sm rounded-4">

            <div className="card-body text-center py-5">

              <div
                className="spinner-border text-primary mb-3"
                role="status"
              >
                <span className="visually-hidden">
                  Loading...
                </span>
              </div>

              <h5 className="fw-semibold">
                Loading Events
              </h5>

              <p className="text-muted mb-0">
                Please wait while we fetch the latest events.
              </p>

            </div>

          </div>
        )}


        {/* ================= ERROR ================= */}
        {error && !loading && (
          <div className="card border-0 shadow-sm rounded-4">

            <div className="card-body text-center py-5">

              <div className="fs-1 mb-3">
                ⚠️
              </div>

              <h5 className="fw-bold text-danger">
                Unable to Load Events
              </h5>

              <p className="text-muted mb-0">
                {error}
              </p>

            </div>

          </div>
        )}


        {/* ================= EMPTY STATE ================= */}
        {!loading &&
          !error &&
          filteredEvents.length === 0 && (

            <div className="card border-0 shadow-sm rounded-4">

              <div className="card-body text-center py-5">

                <div
                  className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: "80px",
                    height: "80px",
                    fontSize: "35px"
                  }}
                >
                  🔍
                </div>

                <h5 className="fw-bold">
                  No Events Found
                </h5>

                <p className="text-muted mb-0">
                  Try another search term or select a different
                  category.
                </p>

              </div>

            </div>
          )}


        {/* ================= EVENTS ================= */}
        {!loading &&
          !error &&
          filteredEvents.length > 0 && (

            <>

              <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                  <h4 className="fw-bold mb-1">
                    Upcoming Events
                  </h4>

                  <p className="text-muted mb-0">
                    Choose an event and reserve your seats.
                  </p>
                </div>

                <span className="text-muted small">
                  Showing {filteredEvents.length} events
                </span>

              </div>


              <div className="row g-4">

                {filteredEvents.map((event) => (

                  <div
                    className="col-md-6 col-lg-4"
                    key={event._id}
                  >
                    <EventCard event={event} />
                  </div>

                ))}

              </div>

            </>
          )}

      </div>

    </div>
  );
}

export default Events;
