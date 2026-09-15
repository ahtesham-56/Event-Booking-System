
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../services/eventService";

function AddEvent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "Technology",
    date: "",
    time: "",
    location: "",
    venue: "",
    ticketPrice: "",
    totalSeats: "",
    description: "",
    banner: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bannerError, setBannerError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "banner") {
      setBannerError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    // Check banner URL
    if (formData.banner) {
      try {
        const url = new URL(formData.banner);

        // Reject search-result URLs
        if (
          url.hostname.includes("bing.com") ||
          url.hostname.includes("google.com") ||
          url.pathname.includes("/images/search")
        ) {
          setError(
            "Please enter a direct image URL, not a Google/Bing image search URL."
          );
          setLoading(false);
          return;
        }
      } catch (error) {
        setError("Please enter a valid Banner URL.");
        setLoading(false);
        return;
      }
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,

        banner:
          formData.banner ||
          "https://placehold.co/600x400?text=No+Event+Image",

        date: formData.date,
        time: formData.time,
        venue: formData.venue,
        location: formData.location,
        ticketPrice: Number(formData.ticketPrice),
        totalSeats: Number(formData.totalSeats),
      };

      console.log("Sending:", payload);

      await createEvent(payload);

      alert("Event added successfully!");

      navigate("/admin/events");
    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.message || "Failed to add event"
      );
    } finally {
      setLoading(false);
    }
  };

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
                Event Management
              </span>
            </div>

            <h2 className="fw-bold mb-1">
              Create New Event
            </h2>

            <p className="text-muted mb-0">
              Add a new event and make it available for bookings.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-light border shadow-sm px-4"
            onClick={() => navigate("/admin/events")}
          >
            ← Back to Events
          </button>

        </div>
      </div>

      {/* ================= ERROR ================= */}
      {error && (
        <div
          className="alert alert-danger border-0 shadow-sm d-flex align-items-center"
          role="alert"
        >
          <span className="me-2 fs-5">⚠</span>
          <div>{error}</div>
        </div>
      )}

      {/* ================= MAIN CARD ================= */}
      <div className="card border-0 shadow-sm overflow-hidden">

        {/* Card Header */}
        <div className="card-header bg-white border-bottom p-4">
          <div className="d-flex align-items-center gap-3">

            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-primary text-white"
              style={{
                width: "48px",
                height: "48px",
                fontSize: "22px",
              }}
            >
              +
            </div>

            <div>
              <h5 className="fw-bold mb-1">
                Event Information
              </h5>

              <p className="text-muted small mb-0">
                Enter the basic details of your event below.
              </p>
            </div>

          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          <div className="card-body p-4 p-md-5">

            {/* ================= BASIC INFORMATION ================= */}
            <div className="mb-4">

              <h6 className="fw-bold mb-1">
                Basic Information
              </h6>

              <p className="text-muted small mb-4">
                Provide the name, category and schedule of the event.
              </p>

              {/* Title */}
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Event Title <span className="text-danger">*</span>
                </label>

                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-control form-control-lg"
                  placeholder="Enter event title"
                  required
                />
              </div>

              {/* Category / Date / Time */}
              <div className="row">

                <div className="col-lg-5 mb-4">
                  <label className="form-label fw-semibold">
                    Category <span className="text-danger">*</span>
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-select form-select-lg"
                  >
                    <option>Technology</option>
                    <option>Music</option>
                    <option>Sports</option>
                    <option>Business</option>
                    <option>Education</option>
                  </select>
                </div>

                <div className="col-lg-4 col-md-6 mb-4">
                  <label className="form-label fw-semibold">
                    Event Date <span className="text-danger">*</span>
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="form-control form-control-lg"
                    required
                  />
                </div>

                <div className="col-lg-3 col-md-6 mb-4">
                  <label className="form-label fw-semibold">
                    Event Time <span className="text-danger">*</span>
                  </label>

                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="form-control form-control-lg"
                    required
                  />
                </div>

              </div>
            </div>

            <hr className="my-4" />

            {/* ================= LOCATION ================= */}
            <div className="mb-4">

              <h6 className="fw-bold mb-1">
                Location & Venue
              </h6>

              <p className="text-muted small mb-4">
                Tell attendees where the event will take place.
              </p>

              <div className="row">

                {/* Location */}
                <div className="col-md-6 mb-4">
                  <label className="form-label fw-semibold">
                    Location <span className="text-danger">*</span>
                  </label>

                  <div className="input-group input-group-lg">

                    <span className="input-group-text bg-light">
                      📍
                    </span>

                    <input
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="e.g. Mohali, Punjab"
                      required
                    />

                  </div>
                </div>

                {/* Venue */}
                <div className="col-md-6 mb-4">
                  <label className="form-label fw-semibold">
                    Venue <span className="text-danger">*</span>
                  </label>

                  <div className="input-group input-group-lg">

                    <span className="input-group-text bg-light">
                      🏢
                    </span>

                    <input
                      name="venue"
                      value={formData.venue}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="e.g. CGC University Auditorium"
                      required
                    />

                  </div>
                </div>

              </div>
            </div>

            <hr className="my-4" />

            {/* ================= TICKETS ================= */}
            <div className="mb-4">

              <h6 className="fw-bold mb-1">
                Ticket & Seating
              </h6>

              <p className="text-muted small mb-4">
                Set the ticket price and total number of available seats.
              </p>

              <div className="row">

                {/* Price */}
                <div className="col-md-6 mb-4">

                  <label className="form-label fw-semibold">
                    Ticket Price <span className="text-danger">*</span>
                  </label>

                  <div className="input-group input-group-lg">

                    <span className="input-group-text bg-light">
                      ₹
                    </span>

                    <input
                      type="number"
                      name="ticketPrice"
                      value={formData.ticketPrice}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="0"
                      min="0"
                      required
                    />

                  </div>

                  <small className="text-muted">
                    Enter 0 for a free event.
                  </small>

                </div>

                {/* Seats */}
                <div className="col-md-6 mb-4">

                  <label className="form-label fw-semibold">
                    Total Seats <span className="text-danger">*</span>
                  </label>

                  <input
                    type="number"
                    name="totalSeats"
                    value={formData.totalSeats}
                    onChange={handleChange}
                    className="form-control form-control-lg"
                    placeholder="e.g. 100"
                    min="1"
                    required
                  />

                  <small className="text-muted">
                    Maximum number of attendees allowed.
                  </small>

                </div>

              </div>
            </div>

            <hr className="my-4" />

            {/* ================= BANNER ================= */}
            <div className="mb-4">

              <h6 className="fw-bold mb-1">
                Event Banner
              </h6>

              <p className="text-muted small mb-4">
                Add a direct image URL to display your event banner.
              </p>

              <label className="form-label fw-semibold">
                Banner URL
              </label>

              <input
                type="url"
                name="banner"
                value={formData.banner}
                onChange={handleChange}
                className="form-control form-control-lg"
                placeholder="https://images.unsplash.com/..."
              />

              <div className="d-flex align-items-start gap-2 mt-2">
                <span className="text-muted">ⓘ</span>

                <small className="text-muted">
                  Use a direct image URL. Google/Bing image search
                  URLs are not supported.
                </small>
              </div>

              {/* Banner Preview */}
              {formData.banner && !bannerError && (
                <div className="mt-4">

                  <label className="form-label fw-semibold">
                    Banner Preview
                  </label>

                  <div
                    className="rounded-4 overflow-hidden border shadow-sm"
                    style={{
                      backgroundColor: "#f8f9fa",
                    }}
                  >

                    <img
                      src={formData.banner}
                      alt="Banner Preview"
                      className="img-fluid"
                      style={{
                        width: "100%",
                        height: "260px",
                        objectFit: "cover",
                      }}
                      onError={() => setBannerError(true)}
                    />

                  </div>

                </div>
              )}

              {/* Invalid Banner */}
              {bannerError && (
                <div className="alert alert-warning mt-3 border-0">
                  <strong>Invalid image:</strong>{" "}
                  This URL does not appear to be a valid image.
                  Please enter a direct image URL.
                </div>
              )}

            </div>

            <hr className="my-4" />

            {/* ================= DESCRIPTION ================= */}
            <div className="mb-2">

              <h6 className="fw-bold mb-1">
                Event Description
              </h6>

              <p className="text-muted small mb-4">
                Give attendees some information about the event.
              </p>

              <label className="form-label fw-semibold">
                Description <span className="text-danger">*</span>
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                rows="6"
                placeholder="Write a detailed description of your event..."
                required
              />

            </div>

          </div>

          {/* ================= FOOTER ================= */}
          <div className="card-footer bg-light border-top p-4">

            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">

              <div>
                <small className="text-muted">
                  <span className="text-danger">*</span> Required fields
                </small>
              </div>

              <div className="d-flex gap-2">

                <button
                  type="button"
                  className="btn btn-light border px-4"
                  onClick={() => navigate("/admin/events")}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary px-4"
                  disabled={loading || bannerError}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>

                      Adding Event...
                    </>
                  ) : (
                    <>
                      + Add Event
                    </>
                  )}
                </button>

              </div>

            </div>

          </div>

        </form>

      </div>

      {/* Bottom spacing */}
      <div style={{ height: "30px" }}></div>

    </div>
  );
}

export default AddEvent;

