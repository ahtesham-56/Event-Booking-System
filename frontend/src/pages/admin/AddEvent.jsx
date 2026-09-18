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

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "banner") {
      setBannerError(false);
    }

    setError("");
  };

  const handleBannerError = () => {
    setBannerError(true);
  };

  const formatDate = (date) => {
    if (!date) return "Select date";

    try {
      return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return date;
    }
  };

  const formatTime = (time) => {
    if (!time) return "Select time";

    try {
      const [hours, minutes] = time.split(":");
      const date = new Date();
      date.setHours(Number(hours), Number(minutes), 0, 0);

      return date.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return time;
    }
  };

  const getBannerUrl = () => {
    return (
      formData.banner ||
      "https://placehold.co/900x600?text=Event+Preview"
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.title.trim()) {
      setError("Please enter an event title.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please enter an event description.");
      return;
    }

    if (Number(formData.ticketPrice) < 0) {
      setError("Ticket price cannot be negative.");
      return;
    }

    if (Number(formData.totalSeats) < 1) {
      setError("Total seats must be at least 1.");
      return;
    }

    if (formData.banner) {
      try {
        const url = new URL(formData.banner);

        if (
          url.hostname.includes("bing.com") ||
          url.hostname.includes("google.com") ||
          url.pathname.includes("/images/search")
        ) {
          setError(
            "Please enter a direct image URL, not a Google/Bing image search URL."
          );
          return;
        }
      } catch {
        setError("Please enter a valid Banner URL.");
        return;
      }

      if (bannerError) {
        setError(
          "The banner image could not be loaded. Please use a valid direct image URL."
        );
        return;
      }
    }

    setLoading(true);

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,

        banner:
          formData.banner.trim() ||
          "https://placehold.co/600x400?text=No+Event+Image",

        date: formData.date,
        time: formData.time,
        venue: formData.venue.trim(),
        location: formData.location.trim(),
        ticketPrice: Number(formData.ticketPrice),
        totalSeats: Number(formData.totalSeats),
      };

      console.log("Sending Event:", payload);

      await createEvent(payload);

      alert("Event added successfully!");

      navigate("/admin/events");
    } catch (err) {
      console.error("ADD EVENT ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Failed to add event. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .add-event-page {
          min-height: calc(100vh - 70px);
          background: #f8fafc;
          padding: 28px 0 50px;
        }

        .add-event-container {
          max-width: 1500px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .add-event-header {
          margin-bottom: 24px;
        }

        .add-event-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #dbeafe;
          border-radius: 999px;
          padding: 7px 13px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .06em;
        }

        .add-event-title {
          color: #0f172a;
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin: 12px 0 5px;
        }

        .add-event-subtitle {
          color: #64748b;
          margin: 0;
          font-size: 14px;
        }

        .add-event-back {
          border: 1px solid #e2e8f0;
          background: white;
          color: #334155;
          font-weight: 600;
          border-radius: 10px;
          padding: 11px 17px;
          transition: all .2s ease;
          white-space: nowrap;
        }

        .add-event-back:hover {
          border-color: #2563eb;
          color: #2563eb;
          background: #eff6ff;
          transform: translateY(-1px);
        }

        .add-event-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 360px;
          gap: 24px;
          align-items: start;
        }

        .add-event-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          box-shadow: 0 10px 35px rgba(15, 23, 42, .06);
          overflow: hidden;
        }

        .add-event-card-header {
          padding: 22px 26px;
          border-bottom: 1px solid #e2e8f0;
          background: linear-gradient(135deg, #ffffff, #f8fbff);
        }

        .add-event-card-icon {
          width: 46px;
          height: 46px;
          border-radius: 13px;
          background: #2563eb;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 500;
          box-shadow: 0 8px 20px rgba(37, 99, 235, .22);
        }

        .add-event-section {
          padding: 28px;
        }

        .add-event-section + .add-event-section {
          border-top: 1px solid #e2e8f0;
        }

        .add-event-section-title {
          color: #0f172a;
          font-size: 16px;
          font-weight: 800;
          margin-bottom: 4px;
        }

        .add-event-section-description {
          color: #64748b;
          font-size: 13px;
          margin-bottom: 22px;
        }

        .add-event-label {
          color: #334155;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .add-event-required {
          color: #ef4444;
        }

        .add-event-input,
        .add-event-select,
        .add-event-textarea {
          border: 1px solid #dbe2ea !important;
          border-radius: 11px !important;
          color: #0f172a !important;
          background: #fff !important;
          box-shadow: none !important;
          transition: all .2s ease !important;
        }

        .add-event-input,
        .add-event-select {
          min-height: 48px;
        }

        .add-event-input:focus,
        .add-event-select:focus,
        .add-event-textarea:focus {
          border-color: #2563eb !important;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, .10) !important;
        }

        .add-event-input::placeholder,
        .add-event-textarea::placeholder {
          color: #94a3b8;
        }

        .add-event-input-group {
          display: flex;
          align-items: stretch;
        }

        .add-event-prefix {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 48px;
          padding: 0 13px;
          background: #f8fafc;
          border: 1px solid #dbe2ea;
          border-right: 0;
          border-radius: 11px 0 0 11px;
          color: #64748b;
          font-weight: 700;
        }

        .add-event-input-group .add-event-input {
          border-radius: 0 11px 11px 0 !important;
        }

        .add-event-help {
          color: #94a3b8;
          font-size: 11px;
          margin-top: 7px;
        }

        .add-event-textarea {
          resize: vertical;
          min-height: 145px;
        }

        .add-event-counter {
          text-align: right;
          color: #94a3b8;
          font-size: 11px;
          margin-top: 5px;
        }

        .add-event-footer {
          padding: 20px 28px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }

        .add-event-cancel {
          border: 1px solid #dbe2ea;
          background: white;
          color: #475569;
          border-radius: 10px;
          padding: 11px 20px;
          font-weight: 700;
        }

        .add-event-submit {
          border: 0;
          background: #2563eb;
          color: white;
          border-radius: 10px;
          padding: 11px 22px;
          font-weight: 700;
          box-shadow: 0 7px 18px rgba(37, 99, 235, .20);
          transition: all .2s ease;
        }

        .add-event-submit:hover:not(:disabled) {
          background: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(37, 99, 235, .26);
        }

        .add-event-submit:disabled,
        .add-event-cancel:disabled {
          opacity: .65;
          cursor: not-allowed;
        }

        .add-event-preview-card {
          position: sticky;
          top: 90px;
        }

        .add-event-preview-header {
          padding: 20px;
          border-bottom: 1px solid #e2e8f0;
        }

        .add-event-preview-image {
          position: relative;
          width: 100%;
          height: 215px;
          background: #f1f5f9;
          overflow: hidden;
        }

        .add-event-preview-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .add-event-preview-overlay {
          position: absolute;
          left: 14px;
          top: 14px;
          background: rgba(15, 23, 42, .82);
          color: white;
          padding: 6px 10px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .05em;
        }

        .add-event-preview-body {
          padding: 20px;
        }

        .add-event-preview-category {
          display: inline-flex;
          background: #eff6ff;
          color: #2563eb;
          padding: 5px 9px;
          border-radius: 7px;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .04em;
        }

        .add-event-preview-title {
          color: #0f172a;
          font-size: 20px;
          font-weight: 800;
          line-height: 1.3;
          margin: 12px 0 15px;
          word-break: break-word;
        }

        .add-event-preview-description {
          color: #64748b;
          font-size: 13px;
          line-height: 1.6;
          margin-bottom: 20px;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .add-event-preview-detail {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          padding: 11px 0;
          border-top: 1px solid #eef2f7;
        }

        .add-event-preview-detail-icon {
          width: 30px;
          height: 30px;
          min-width: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: #f1f5f9;
          font-size: 13px;
        }

        .add-event-preview-detail-label {
          color: #94a3b8;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .04em;
        }

        .add-event-preview-detail-value {
          color: #334155;
          font-size: 12px;
          font-weight: 600;
          margin-top: 2px;
          word-break: break-word;
        }

        .add-event-summary {
          margin-top: 16px;
          padding: 15px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #eef2f7;
        }

        .add-event-summary-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 6px 0;
          font-size: 12px;
        }

        .add-event-summary-row span:first-child {
          color: #64748b;
        }

        .add-event-summary-row span:last-child {
          color: #0f172a;
          font-weight: 800;
        }

        .add-event-error {
          border: 1px solid #fecaca;
          background: #fff7f7;
          color: #b91c1c;
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 13px;
          box-shadow: 0 5px 20px rgba(127, 29, 29, .05);
        }

        .add-event-error-icon {
          width: 30px;
          height: 30px;
          min-width: 30px;
          border-radius: 50%;
          background: #fee2e2;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
        }

        .add-event-image-error {
          border: 1px solid #fed7aa;
          background: #fff7ed;
          color: #c2410c;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 12px;
          margin-top: 10px;
        }

        .add-event-image-info {
          display: flex;
          gap: 8px;
          align-items: flex-start;
          margin-top: 8px;
          color: #64748b;
          font-size: 11px;
          line-height: 1.5;
        }

        @media (max-width: 1100px) {
          .add-event-layout {
            grid-template-columns: minmax(0, 1fr);
          }

          .add-event-preview-card {
            position: static;
          }

          .add-event-preview-content {
            display: grid;
            grid-template-columns: 280px minmax(0, 1fr);
          }

          .add-event-preview-image {
            height: 100%;
            min-height: 280px;
          }
        }

        @media (max-width: 768px) {
          .add-event-page {
            padding: 20px 0 35px;
          }

          .add-event-container {
            padding: 0 14px;
          }

          .add-event-title {
            font-size: 25px;
          }

          .add-event-header-actions {
            width: 100%;
          }

          .add-event-back {
            width: 100%;
          }

          .add-event-card-header {
            padding: 18px;
          }

          .add-event-section {
            padding: 20px 18px;
          }

          .add-event-footer {
            padding: 18px;
          }

          .add-event-preview-content {
            display: block;
          }

          .add-event-preview-image {
            height: 220px;
          }

          .add-event-footer-buttons {
            width: 100%;
          }

          .add-event-footer-buttons button {
            flex: 1;
          }
        }

        @media (max-width: 480px) {
          .add-event-container {
            padding: 0 10px;
          }

          .add-event-title {
            font-size: 23px;
          }

          .add-event-subtitle {
            font-size: 13px;
          }

          .add-event-section {
            padding: 18px 14px;
          }

          .add-event-card-header {
            padding: 16px 14px;
          }

          .add-event-card-icon {
            width: 40px;
            height: 40px;
            font-size: 20px;
          }

          .add-event-footer {
            padding: 16px 14px;
          }

          .add-event-footer-buttons {
            flex-direction: column;
          }

          .add-event-footer-buttons button {
            width: 100%;
          }
        }
      `}</style>

      <div className="add-event-page">
        <div className="add-event-container">

          {/* ================= HEADER ================= */}
          <div className="add-event-header">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

              <div>
                <div className="add-event-badge">
                  <span>●</span>
                  ADMIN PANEL
                </div>

                <h1 className="add-event-title">
                  Create New Event
                </h1>

                <p className="add-event-subtitle">
                  Add an event, configure tickets and publish it for attendees.
                </p>
              </div>

              <div className="add-event-header-actions">
                <button
                  type="button"
                  className="add-event-back"
                  onClick={() => navigate("/admin/events")}
                  disabled={loading}
                >
                  ← Back to Events
                </button>
              </div>

            </div>
          </div>

          {/* ================= ERROR MESSAGE ================= */}
          {error && (
            <div className="add-event-error d-flex align-items-center gap-3 mb-4">
              <div className="add-event-error-icon">
                !
              </div>

              <div className="flex-grow-1">
                <div className="fw-bold mb-1">
                  Unable to create event
                </div>

                <div>
                  {error}
                </div>
              </div>

              <button
                type="button"
                className="btn-close"
                onClick={() => setError("")}
                aria-label="Close"
              />
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="add-event-layout">

              {/* ================= LEFT FORM ================= */}
              <div className="add-event-card">

                {/* ================= CARD HEADER ================= */}
                <div className="add-event-card-header">
                  <div className="d-flex align-items-center gap-3">

                    <div className="add-event-card-icon">
                      +
                    </div>

                    <div>
                      <h5 className="fw-bold mb-1">
                        Event Information
                      </h5>

                      <p className="text-muted small mb-0">
                        Complete the details below to create your event.
                      </p>
                    </div>

                  </div>
                </div>

                {/* ================= BASIC INFORMATION ================= */}
                <div className="add-event-section">

                  <div className="add-event-section-title">
                    Basic Information
                  </div>

                  <div className="add-event-section-description">
                    Add the event name, category and schedule.
                  </div>

                  {/* Title */}
                  <div className="mb-4">
                    <label className="add-event-label">
                      Event Title <span className="add-event-required">*</span>
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="form-control add-event-input"
                      placeholder="e.g. Annual Technology Fest 2026"
                      maxLength={100}
                      required
                    />

                    <div className="add-event-help">
                      Use a clear and memorable event name.
                    </div>
                  </div>

                  <div className="row">

                    {/* Category */}
                    <div className="col-lg-5 mb-4">
                      <label className="add-event-label">
                        Category <span className="add-event-required">*</span>
                      </label>

                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="form-select add-event-select"
                        required
                      >
                        <option value="Technology">
                          Technology
                        </option>

                        <option value="Music">
                          Music
                        </option>

                        <option value="Sports">
                          Sports
                        </option>

                        <option value="Business">
                          Business
                        </option>

                        <option value="Education">
                          Education
                        </option>
                      </select>
                    </div>

                    {/* Date */}
                    <div className="col-lg-4 col-md-6 mb-4">
                      <label className="add-event-label">
                        Event Date <span className="add-event-required">*</span>
                      </label>

                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        min={today}
                        className="form-control add-event-input"
                        required
                      />
                    </div>

                    {/* Time */}
                    <div className="col-lg-3 col-md-6 mb-4">
                      <label className="add-event-label">
                        Event Time <span className="add-event-required">*</span>
                      </label>

                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="form-control add-event-input"
                        required
                      />
                    </div>

                  </div>
                </div>

                {/* ================= LOCATION ================= */}
                <div className="add-event-section">

                  <div className="add-event-section-title">
                    Location & Venue
                  </div>

                  <div className="add-event-section-description">
                    Tell attendees exactly where the event will happen.
                  </div>

                  <div className="row">

                    {/* Location */}
                    <div className="col-md-6 mb-3 mb-md-0">

                      <label className="add-event-label">
                        Location <span className="add-event-required">*</span>
                      </label>

                      <div className="add-event-input-group">

                        <span className="add-event-prefix">
                          📍
                        </span>

                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="form-control add-event-input"
                          placeholder="Mohali, Punjab"
                          required
                        />

                      </div>

                    </div>

                    {/* Venue */}
                    <div className="col-md-6">

                      <label className="add-event-label">
                        Venue <span className="add-event-required">*</span>
                      </label>

                      <div className="add-event-input-group">

                        <span className="add-event-prefix">
                          🏢
                        </span>

                        <input
                          type="text"
                          name="venue"
                          value={formData.venue}
                          onChange={handleChange}
                          className="form-control add-event-input"
                          placeholder="CGC University Auditorium"
                          required
                        />

                      </div>

                    </div>

                  </div>
                </div>

                {/* ================= TICKET & SEATING ================= */}
                <div className="add-event-section">

                  <div className="add-event-section-title">
                    Ticket & Seating
                  </div>

                  <div className="add-event-section-description">
                    Configure pricing and the maximum number of attendees.
                  </div>

                  <div className="row">

                    {/* Ticket Price */}
                    <div className="col-md-6 mb-4 mb-md-0">

                      <label className="add-event-label">
                        Ticket Price <span className="add-event-required">*</span>
                      </label>

                      <div className="add-event-input-group">

                        <span className="add-event-prefix">
                          ₹
                        </span>

                        <input
                          type="number"
                          name="ticketPrice"
                          value={formData.ticketPrice}
                          onChange={handleChange}
                          className="form-control add-event-input"
                          placeholder="499"
                          min="0"
                          step="1"
                          required
                        />

                      </div>

                      <div className="add-event-help">
                        Enter 0 if this is a free event.
                      </div>

                    </div>

                    {/* Total Seats */}
                    <div className="col-md-6">

                      <label className="add-event-label">
                        Total Seats <span className="add-event-required">*</span>
                      </label>

                      <input
                        type="number"
                        name="totalSeats"
                        value={formData.totalSeats}
                        onChange={handleChange}
                        className="form-control add-event-input"
                        placeholder="100"
                        min="1"
                        step="1"
                        required
                      />

                      <div className="add-event-help">
                        Maximum number of attendees allowed.
                      </div>

                    </div>

                  </div>
                </div>

                {/* ================= BANNER ================= */}
                <div className="add-event-section">

                  <div className="add-event-section-title">
                    Event Banner
                  </div>

                  <div className="add-event-section-description">
                    Add a direct image URL for your event cover.
                  </div>

                  <label className="add-event-label">
                    Banner URL
                  </label>

                  <input
                    type="url"
                    name="banner"
                    value={formData.banner}
                    onChange={handleChange}
                    className="form-control add-event-input"
                    placeholder="https://images.unsplash.com/..."
                  />

                  <div className="add-event-image-info">
                    <span>ⓘ</span>

                    <span>
                      Use a direct image URL. Google/Bing search result
                      URLs are not supported. Leave empty to use the default
                      EventBook placeholder.
                    </span>
                  </div>

                  {formData.banner && bannerError && (
                    <div className="add-event-image-error">
                      <strong>Image could not be loaded.</strong>{" "}
                      Please check the URL and use a direct image link.
                    </div>
                  )}

                  {formData.banner && !bannerError && (
                    <div className="mt-3">

                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <label className="add-event-label mb-0">
                          Banner Preview
                        </label>

                        <span className="text-muted small">
                          Live preview
                        </span>
                      </div>

                      <div
                        className="rounded-4 overflow-hidden border"
                        style={{
                          background: "#f1f5f9",
                          minHeight: "180px",
                        }}
                      >
                        <img
                          src={formData.banner}
                          alt="Event banner preview"
                          onError={handleBannerError}
                          style={{
                            width: "100%",
                            height: "240px",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </div>

                    </div>
                  )}

                </div>

                {/* ================= EVENT DESCRIPTION ================= */}
                <div className="add-event-section">

                  <div className="add-event-section-title">
                    Event Description
                  </div>

                  <div className="add-event-section-description">
                    Give attendees useful information about your event.
                  </div>

                  <label className="add-event-label">
                    Description <span className="add-event-required">*</span>
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-control add-event-textarea"
                    rows="6"
                    maxLength={1000}
                    placeholder="Write a detailed description of your event..."
                    required
                  />

                  <div className="add-event-counter">
                    {formData.description.length}/1000 characters
                  </div>

                </div>

                {/* ================= FORM FOOTER ================= */}
                <div className="add-event-footer">

                  <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">

                    <div>
                      <small className="text-muted">
                        <span className="text-danger">*</span>{" "}
                        Required fields
                      </small>
                    </div>

                    <div className="add-event-footer-buttons d-flex gap-2">

                      <button
                        type="button"
                        className="add-event-cancel"
                        onClick={() => navigate("/admin/events")}
                        disabled={loading}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="add-event-submit"
                        disabled={loading || bannerError}
                      >
                        {loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            />

                            Creating Event...
                          </>
                        ) : (
                          <>
                            + Create Event
                          </>
                        )}
                      </button>

                    </div>

                  </div>

                </div>

              </div>

              {/* ================= LIVE PREVIEW ================= */}
              <div className="add-event-preview-card">

                <div className="add-event-card">

                  <div className="add-event-preview-header">
                    <div className="d-flex justify-content-between align-items-center">

                      <div>
                        <h6 className="fw-bold mb-1">
                          Event Preview
                        </h6>

                        <small className="text-muted">
                          See how attendees will view your event.
                        </small>
                      </div>

                      <span
                        className="badge rounded-pill"
                        style={{
                          background: "#dcfce7",
                          color: "#15803d",
                          fontSize: "10px",
                        }}
                      >
                        LIVE
                      </span>

                    </div>
                  </div>

                  <div className="add-event-preview-content">

                    {/* ================= PREVIEW IMAGE ================= */}
                    <div className="add-event-preview-image">

                      <img
                        src={getBannerUrl()}
                        alt="Event preview"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/900x600?text=Event+Preview";
                        }}
                      />

                      <div className="add-event-preview-overlay">
                        EVENTBOOK
                      </div>

                    </div>

                    {/* ================= PREVIEW BODY ================= */}
                    <div className="add-event-preview-body">

                      <span className="add-event-preview-category">
                        {formData.category || "Technology"}
                      </span>

                      <div className="add-event-preview-title">
                        {formData.title.trim() ||
                          "Your Event Title"}
                      </div>

                      <div className="add-event-preview-description">
                        {formData.description.trim() ||
                          "Your event description will appear here. Add useful information to help attendees understand what your event is about."}
                      </div>

                      {/* Date & Time */}
                      <div className="add-event-preview-detail">

                        <div className="add-event-preview-detail-icon">
                          📅
                        </div>

                        <div>
                          <div className="add-event-preview-detail-label">
                            Date & Time
                          </div>

                          <div className="add-event-preview-detail-value">
                            {formatDate(formData.date)}
                            {" • "}
                            {formatTime(formData.time)}
                          </div>
                        </div>

                      </div>

                      {/* Location */}
                      <div className="add-event-preview-detail">

                        <div className="add-event-preview-detail-icon">
                          📍
                        </div>

                        <div>
                          <div className="add-event-preview-detail-label">
                            Location
                          </div>

                          <div className="add-event-preview-detail-value">
                            {formData.location ||
                              "Event location"}
                          </div>
                        </div>

                      </div>

                      {/* Venue */}
                      <div className="add-event-preview-detail">

                        <div className="add-event-preview-detail-icon">
                          🏢
                        </div>

                        <div>
                          <div className="add-event-preview-detail-label">
                            Venue
                          </div>

                          <div className="add-event-preview-detail-value">
                            {formData.venue ||
                              "Event venue"}
                          </div>
                        </div>

                      </div>

                      {/* Booking Summary */}
                      <div className="add-event-summary">

                        <div className="add-event-summary-row">
                          <span>
                            Ticket Price
                          </span>

                          <span>
                            ₹
                            {Number(formData.ticketPrice || 0).toLocaleString(
                              "en-IN"
                            )}
                          </span>
                        </div>

                        <div className="add-event-summary-row">
                          <span>
                            Available Seats
                          </span>

                          <span>
                            {Number(formData.totalSeats || 0).toLocaleString(
                              "en-IN"
                            )}
                          </span>
                        </div>

                        <div className="add-event-summary-row">
                          <span>
                            Status
                          </span>

                          <span style={{ color: "#16a34a" }}>
                            Ready to Publish
                          </span>
                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </form>

        </div>
      </div>
    </>
  );
}

export default AddEvent;