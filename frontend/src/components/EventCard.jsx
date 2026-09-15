import { Link } from "react-router-dom";

function EventCard({ event }) {
  console.log("BANNER URL:", event.banner);

  const fallbackImage =
    "https://placehold.co/600x400?text=No+Event+Image";

  // Format date for display
  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString("en-IN")
    : "";

  // Format time for display
  const formattedTime = event.time
    ? new Date(`1970-01-01T${event.time}`).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="card h-100 border-0 shadow-sm">
      <img
        src={event.banner || fallbackImage}
        className="card-img-top"
        alt={event.title || "Event"}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = fallbackImage;
        }}
        style={{
          height: "200px",
          objectFit: "cover",
        }}
      />

      <div className="card-body d-flex flex-column">
        <span className="badge bg-primary align-self-start mb-2">
          {event.category || "Event"}
        </span>

        <h5 className="card-title fw-bold">
          {event.title}
        </h5>

        <p className="text-muted mb-2">
          📅 {formattedDate}
        </p>

        <p className="text-muted mb-2">
          ⏰ {formattedTime}
        </p>

        <p className="text-muted mb-2">
          📍 {event.venue}
        </p>

        <p className="fw-bold text-success">
          ₹{event.ticketPrice}
        </p>

        <Link
          to={`/events/${event._id}`}
          className="btn btn-primary mt-auto"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default EventCard;