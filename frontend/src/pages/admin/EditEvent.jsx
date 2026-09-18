
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getEventById,
  updateEvent,
} from "../../services/eventService";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  
  // FETCH EVENT
  

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getEventById(id);

        console.log("SINGLE EVENT DATA:", data);

        const eventData = data.event || data;

        if (!eventData) {
          setError("Event not found.");
          return;
        }

        setEvent(eventData);
      } catch (error) {
        console.error("GET EVENT ERROR:", error);

        setError(
          error?.response?.data?.message ||
            "Unable to load event. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);


  // HANDLE INPUT CHANGE


  const handleChange = (e) => {
    const { name, value } = e.target;

    setEvent((previousEvent) => ({
      ...previousEvent,
      [name]: value,
    }));

    // Remove error when user starts editing
    if (error) {
      setError("");
    }
  };


  // UPDATE EVENT
  

  const handleUpdate = async () => {
    if (updating) return;

    setError("");

    // Basic validation
    if (!event.title?.trim()) {
      setError("Please enter an event title.");
      return;
    }

    if (!event.description?.trim()) {
      setError("Please enter an event description.");
      return;
    }

    if (!event.date) {
      setError("Please select an event date.");
      return;
    }

    if (
      event.ticketPrice === "" ||
      Number(event.ticketPrice) < 0
    ) {
      setError("Please enter a valid ticket price.");
      return;
    }

    if (
      event.totalSeats === "" ||
      Number(event.totalSeats) < 1
    ) {
      setError("Total seats must be at least 1.");
      return;
    }

    try {
      setUpdating(true);

   
      // ONLY THESE FIELDS ARE UPDATED

      const updatedData = {
        title: event.title.trim(),
        description: event.description.trim(),
        date: event.date,
        ticketPrice: Number(event.ticketPrice),
        totalSeats: Number(event.totalSeats),
      };

      console.log("UPDATING EVENT:", updatedData);

      const result = await updateEvent(id, updatedData);

      console.log("UPDATE RESPONSE:", result);

      // Show professional success popup
      setShowSuccess(true);

      // Redirect to Manage Events
      setTimeout(() => {
        navigate("/admin/events");
      }, 1800);
    } catch (error) {
      console.error("UPDATE EVENT ERROR:", error);

      setUpdating(false);

      setError(
        error?.response?.data?.message ||
          "Failed to update event. Please try again."
      );
    }
  };


  // LOADING

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center align-items-center flex-column">
          <div
            className="spinner-border text-primary mb-3"
            role="status"
          ></div>

          <h5 className="fw-semibold mb-1">
            Loading Event
          </h5>

          <p className="text-muted mb-0">
            Please wait...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // EVENT NOT FOUND
  // =========================================================

  if (!event) {
    return (
      <div className="container py-5">
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <div
              className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{
                width: "70px",
                height: "70px",
              }}
            >
              <span
                className="text-danger fw-bold"
                style={{ fontSize: "30px" }}
              >
                !
              </span>
            </div>

            <h4 className="fw-bold">
              Event Not Found
            </h4>

            <p className="text-muted">
              The event you are trying to edit could not be found.
            </p>

            <button
              className="btn btn-primary px-4"
              onClick={() => navigate("/admin/events")}
            >
              Back to Manage Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div
      className="container-fluid py-4"
      style={{
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <div className="container">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <button
                type="button"
                className="btn btn-light border"
                onClick={() => navigate("/admin/events")}
                disabled={updating}
              >
                ←
              </button>

              <span className="text-muted small">
                Manage Events / Edit Event
              </span>
            </div>

            <h2 className="fw-bold mb-1">
              Edit Event
            </h2>

            <p className="text-muted mb-0">
              Update the basic details of your event.
            </p>
          </div>
        </div>

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div
            className="alert alert-danger d-flex align-items-center mb-4"
            role="alert"
          >
            <span className="fw-bold me-2">
              !
            </span>

            <span>{error}</span>
          </div>
        )}

        {/* =================================================
            EDIT CARD
        ================================================= */}

        <div
          className="card border-0 shadow-sm"
          style={{
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          {/* CARD HEADER */}

          <div
            className="card-header bg-white border-bottom px-4 py-3"
          >
            <div className="d-flex align-items-center">
              <div
                className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center me-3"
                style={{
                  width: "46px",
                  height: "46px",
                }}
              >
                ✎
              </div>

              <div>
                <h5 className="fw-bold mb-1">
                  Event Information
                </h5>

                <p className="text-muted small mb-0">
                  Make changes to the information below.
                </p>
              </div>
            </div>
          </div>

          {/* CARD BODY */}

          <div className="card-body p-4">

            {/* EVENT TITLE */}

            <div className="mb-4">
              <label className="form-label fw-semibold">
                Event Title
              </label>

              <input
                type="text"
                name="title"
                className="form-control form-control-lg"
                placeholder="Enter event title"
                value={event.title || ""}
                onChange={handleChange}
                disabled={updating}
              />
            </div>

            {/* DESCRIPTION */}

            <div className="mb-4">
              <label className="form-label fw-semibold">
                Description
              </label>

              <textarea
                name="description"
                className="form-control"
                rows="5"
                placeholder="Enter event description"
                value={event.description || ""}
                onChange={handleChange}
                disabled={updating}
              />
            </div>

            {/* DATE + PRICE */}

            <div className="row">

              {/* DATE */}

              <div className="col-md-6 mb-4">
                <label className="form-label fw-semibold">
                  Event Date
                </label>

                <input
                  type="date"
                  name="date"
                  className="form-control"
                  value={
                    event.date
                      ? event.date.substring(0, 10)
                      : ""
                  }
                  onChange={handleChange}
                  disabled={updating}
                />
              </div>

              {/* PRICE */}

              <div className="col-md-6 mb-4">
                <label className="form-label fw-semibold">
                  Ticket Price
                </label>

                <div className="input-group">
                  <span className="input-group-text">
                    ₹
                  </span>

                  <input
                    type="number"
                    name="ticketPrice"
                    className="form-control"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={event.ticketPrice ?? ""}
                    onChange={handleChange}
                    disabled={updating}
                  />
                </div>

                <small className="text-muted">
                  Enter the price per ticket.
                </small>
              </div>
            </div>

            {/* TOTAL SEATS */}

            <div className="mb-4">
              <label className="form-label fw-semibold">
                Total Seats
              </label>

              <input
                type="number"
                name="totalSeats"
                className="form-control"
                min="1"
                step="1"
                placeholder="Enter total seats"
                value={event.totalSeats ?? ""}
                onChange={handleChange}
                disabled={updating}
              />

              <small className="text-muted">
                Set the total number of seats available for this event.
              </small>
            </div>

            {/* INFORMATION */}

            <div className="alert alert-light border mb-4">
              <div className="d-flex">
                <span className="text-primary fw-bold me-2">
                  ⓘ
                </span>

                <div>
                  <div className="fw-semibold mb-1">
                    Protected Event Details
                  </div>

                  <small className="text-muted">
                    Time, venue, location, banner and available
                    seats are not changed from this page.
                  </small>
                </div>
              </div>
            </div>

            {/* BUTTONS */}

            <div className="d-flex justify-content-end gap-2 pt-2">

              <button
                type="button"
                className="btn btn-light border px-4"
                onClick={() => navigate("/admin/events")}
                disabled={updating}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-primary px-4"
                onClick={handleUpdate}
                disabled={updating}
              >
                {updating ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>

                    Saving Changes...
                  </>
                ) : (
                  <>
                    ✓ Save Changes
                  </>
                )}
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          SUCCESS POPUP
      ===================================================== */}

      {showSuccess && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            className="bg-white text-center shadow-lg"
            style={{
              width: "430px",
              maxWidth: "100%",
              borderRadius: "20px",
              padding: "40px 30px",
            }}
          >
            {/* SUCCESS ICON */}

            <div
              className="mx-auto mb-4 d-flex align-items-center justify-content-center"
              style={{
                width: "75px",
                height: "75px",
                borderRadius: "50%",
                backgroundColor: "#dcfce7",
                color: "#16a34a",
                fontSize: "38px",
                fontWeight: "700",
              }}
            >
              ✓
            </div>

            <h3 className="fw-bold mb-2">
              Event Updated Successfully!
            </h3>

            <p className="text-muted mb-4">
              Your event changes have been saved successfully.
            </p>

            <div
              className="progress mb-3"
              style={{
                height: "5px",
                borderRadius: "10px",
              }}
            >
              <div
                className="progress-bar bg-success"
                style={{
                  width: "100%",
                  animation: "progressAnimation 1.8s linear",
                }}
              ></div>
            </div>

            <small className="text-muted">
              Redirecting to Manage Events...
            </small>
          </div>
        </div>
      )}

      {/* =====================================================
          POPUP ANIMATION
      ===================================================== */}

      <style>
        {`
          @keyframes progressAnimation {
            from {
              width: 0%;
            }

            to {
              width: 100%;
            }
          }
        `}
      </style>
    </div>
  );
}

export default EditEvent;