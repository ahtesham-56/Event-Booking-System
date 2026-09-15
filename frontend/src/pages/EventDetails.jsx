import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getEventById } from "../services/eventService";

function EventDetails() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventById(id);

        setEvent(data.event || data);
      } catch (error) {
        console.error(error);
        setError("Unable to load event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h4>Loading event...</h4>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Event not found.
        </div>
      </div>
    );
  }

  // Format date
  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "Not available";

  // Format time
  const formattedTime = event.time
    ? new Date(`1970-01-01T${event.time}`).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Not available";

  return (
    <div className="container py-5">

      <Link to="/events" className="btn btn-outline-secondary mb-4">
        ← Back to Events
      </Link>

      <div className="card border-0 shadow-sm overflow-hidden">

        <img
          src={
            event.banner ||
            "https://placehold.co/1200x500?text=Event"
          }
          alt={event.title || "Event"}
          className="w-100"
          style={{
            height: "400px",
            objectFit: "cover",
          }}
        />

        <div className="card-body p-4">

          <span className="badge bg-primary mb-3">
            {event.category || "Event"}
          </span>

          <h1 className="mb-3">
            {event.title}
          </h1>

          <p className="text-muted">
            {event.description}
          </p>

          <hr />

          <div className="row g-3 mb-4">

            <div className="col-md-6">
              <strong>📅 Date</strong>
              <p className="text-muted mb-0">
                {formattedDate}
              </p>
            </div>

            <div className="col-md-6">
              <strong>⏰ Time</strong>
              <p className="text-muted mb-0">
                {formattedTime}
              </p>
            </div>

            <div className="col-md-6">
              <strong>📍 Venue</strong>
              <p className="text-muted mb-0">
                {event.venue || "Not available"}
              </p>
            </div>

            <div className="col-md-6">
              <strong>🌍 Location</strong>
              <p className="text-muted mb-0">
                {event.location || "Not available"}
              </p>
            </div>

            <div className="col-md-6">
              <strong>🎟️ Ticket Price</strong>
              <p className="text-muted mb-0">
                ₹{event.ticketPrice || 0}
              </p>
            </div>

            <div className="col-md-6">
              <strong>💺 Total Seats</strong>
              <p className="text-muted mb-0">
                {event.totalSeats || 0}
              </p>
            </div>

          </div>

          <Link
            to={`/booking/${event._id}`}
            className="btn btn-primary btn-lg"
          >
            Book Now
          </Link>

        </div>
      </div>
    </div>
  );
}

export default EventDetails;

