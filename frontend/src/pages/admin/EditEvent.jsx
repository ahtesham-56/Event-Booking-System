import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getEventById,
  updateEvent,
} from "../../services/eventService";

function EditEvent() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventById(id);

        console.log("SINGLE EVENT DATA:", data);

        setEvent(data.event || data);
      } catch (error) {
        console.error("GET EVENT ERROR:", error);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEvent({
      ...event,
      [name]: value,
    });
  };

  const handleUpdate = async () => {
    try {
      // ONLY these fields will be updated
      const updatedData = {
        title: event.title,
        description: event.description,
        date: event.date,
        ticketPrice: Number(event.ticketPrice),
        totalSeats: Number(event.totalSeats),
      };

      console.log("UPDATING EVENT:", updatedData);

      const result = await updateEvent(id, updatedData);

      console.log("UPDATE RESPONSE:", result);

      alert("Event updated successfully!");
    } catch (error) {
      console.error("UPDATE EVENT ERROR:", error);
      alert("Failed to update event.");
    }
  };

  if (!event) {
    return (
      <div className="container py-5">
        <h3>Loading event...</h3>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="card p-4 shadow">
        <h2 className="mb-4">Edit Event</h2>

        {/* Event Title */}
        <div className="mb-3">
          <label className="form-label">Event Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={event.title || ""}
            onChange={handleChange}
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            rows="4"
            value={event.description || ""}
            onChange={handleChange}
          />
        </div>

        {/* Date */}
        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            type="date"
            name="date"
            className="form-control"
            value={event.date ? event.date.substring(0, 10) : ""}
            onChange={handleChange}
          />
        </div>

        {/* Ticket Price */}
        <div className="mb-3">
          <label className="form-label">Ticket Price (₹)</label>
          <input
            type="number"
            name="ticketPrice"
            className="form-control"
            min="0"
            value={event.ticketPrice ?? ""}
            onChange={handleChange}
          />
        </div>

        {/* Total Seats */}
        <div className="mb-3">
          <label className="form-label">Total Seats</label>
          <input
            type="number"
            name="totalSeats"
            className="form-control"
            min="1"
            value={event.totalSeats ?? ""}
            onChange={handleChange}
          />
        </div>

        {/* Update Button */}
        <button
          type="button"
          className="btn btn-primary mt-3"
          onClick={handleUpdate}
        >
          Update Event
        </button>
      </div>
    </div>
  );
}

export default EditEvent;