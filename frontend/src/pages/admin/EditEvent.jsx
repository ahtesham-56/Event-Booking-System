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

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getEventById(id);
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEvent((previousEvent) => ({
      ...previousEvent,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleUpdate = async () => {
    if (updating) return;

    setError("");

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

      const updatedData = {
        title: event.title.trim(),
        description: event.description.trim(),
        date: event.date,
        ticketPrice: Number(event.ticketPrice),
        totalSeats: Number(event.totalSeats),
      };

      const result = await updateEvent(id, updatedData);

      console.log("UPDATE RESPONSE:", result);

      setShowSuccess(true);

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

  if (loading) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background:
            "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
        }}
      >
        <div className="text-center">
          <div
            className="d-flex align-items-center justify-content-center mx-auto mb-4"
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              background:
                "linear-gradient(135deg, #4f46e5, #7c3aed)",
              boxShadow:
                "0 12px 30px rgba(79, 70, 229, 0.25)",
            }}
          >
            <span
              className="spinner-border text-white"
              style={{
                width: "30px",
                height: "30px",
                borderWidth: "3px",
              }}
              role="status"
            />
          </div>

          <h4
            className="fw-bold mb-2"
            style={{ color: "#0f172a" }}
          >
            Loading Event
          </h4>

          <p
            className="mb-0"
            style={{ color: "#64748b" }}
          >
            Please wait while we load the event details.
          </p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center px-3"
        style={{
          background:
            "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
        }}
      >
        <div
          className="bg-white text-center p-5"
          style={{
            width: "100%",
            maxWidth: "520px",
            borderRadius: "24px",
            boxShadow:
              "0 20px 60px rgba(15, 23, 42, 0.10)",
            border: "1px solid rgba(226, 232, 240, 0.8)",
          }}
        >
          <div
            className="mx-auto mb-4 d-flex align-items-center justify-content-center"
            style={{
              width: "76px",
              height: "76px",
              borderRadius: "22px",
              background: "#fef2f2",
              color: "#dc2626",
              fontSize: "34px",
              fontWeight: "800",
            }}
          >
            !
          </div>

          <h3
            className="fw-bold mb-2"
            style={{ color: "#0f172a" }}
          >
            Event Not Found
          </h3>

          <p
            className="mb-4"
            style={{
              color: "#64748b",
              lineHeight: "1.7",
            }}
          >
            The event you are trying to edit could not be
            found or may no longer be available.
          </p>

          <button
            type="button"
            className="btn px-4 py-2"
            onClick={() => navigate("/admin/events")}
            style={{
              borderRadius: "10px",
              background:
                "linear-gradient(135deg, #4f46e5, #7c3aed)",
              color: "#fff",
              border: "none",
              fontWeight: "600",
              boxShadow:
                "0 8px 20px rgba(79, 70, 229, 0.20)",
            }}
          >
            ← Back to Manage Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100"
      style={{
        background:
          "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
        color: "#0f172a",
      }}
    >
      <style>
        {`
          .edit-event-page {
            padding: 32px 20px 60px;
          }

          .edit-event-container {
            max-width: 1050px;
            margin: 0 auto;
          }

          .edit-event-header {
            margin-bottom: 28px;
          }

          .breadcrumb-button {
            width: 40px;
            height: 40px;
            border-radius: 11px;
            border: 1px solid #e2e8f0;
            background: rgba(255, 255, 255, 0.9);
            color: #475569;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
          }

          .breadcrumb-button:hover:not(:disabled) {
            background: #ffffff;
            color: #4f46e5;
            border-color: #c7d2fe;
            transform: translateX(-2px);
            box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
          }

          .page-title {
            font-size: 32px;
            line-height: 1.2;
            letter-spacing: -0.6px;
          }

          .edit-card {
            border-radius: 24px;
            overflow: hidden;
            background: #ffffff;
            border: 1px solid rgba(226, 232, 240, 0.85);
            box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
          }

          .edit-card-header {
            padding: 26px 30px;
            border-bottom: 1px solid #eef2f7;
            background:
              linear-gradient(
                135deg,
                rgba(248, 250, 252, 1),
                rgba(255, 255, 255, 1)
              );
          }

          .section-icon {
            width: 52px;
            height: 52px;
            flex-shrink: 0;
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(
              135deg,
              rgba(79, 70, 229, 0.12),
              rgba(124, 58, 237, 0.10)
            );
            color: #4f46e5;
            font-size: 23px;
            font-weight: 700;
          }

          .edit-card-body {
            padding: 30px;
          }

          .form-section-label {
            color: #0f172a;
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 9px;
          }

          .form-control,
          .input-group-text {
            border-color: #dbe3ee;
          }

          .professional-input {
            min-height: 48px;
            border-radius: 11px;
            padding: 10px 14px;
            color: #0f172a;
            background: #ffffff;
            transition:
              border-color 0.2s ease,
              box-shadow 0.2s ease,
              background 0.2s ease;
          }

          .professional-input::placeholder {
            color: #94a3b8;
          }

          .professional-input:focus {
            border-color: #818cf8;
            background: #ffffff;
            box-shadow:
              0 0 0 4px rgba(99, 102, 241, 0.10);
          }

          textarea.professional-input {
            min-height: 145px;
            resize: vertical;
            line-height: 1.6;
          }

          .price-group .input-group-text {
            min-height: 48px;
            padding: 0 16px;
            border-radius: 11px 0 0 11px;
            background: #f8fafc;
            color: #475569;
            font-weight: 700;
          }

          .price-group .professional-input {
            border-radius: 0 11px 11px 0;
          }

          .field-help {
            display: block;
            margin-top: 7px;
            font-size: 12px;
            color: #94a3b8;
          }

          .protected-notice {
            border: 1px solid #dbeafe;
            border-radius: 15px;
            padding: 17px 18px;
            background:
              linear-gradient(
                135deg,
                #eff6ff,
                #f8fafc
              );
          }

          .notice-icon {
            width: 34px;
            height: 34px;
            flex-shrink: 0;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #dbeafe;
            color: #2563eb;
            font-weight: 800;
          }

          .form-actions {
            padding-top: 24px;
            border-top: 1px solid #eef2f7;
          }

          .cancel-button,
          .save-button {
            min-height: 48px;
            padding: 0 22px;
            border-radius: 11px;
            font-weight: 700;
            transition: all 0.2s ease;
          }

          .cancel-button {
            background: #ffffff;
            border: 1px solid #dbe3ee;
            color: #475569;
          }

          .cancel-button:hover:not(:disabled) {
            background: #f8fafc;
            border-color: #cbd5e1;
            color: #1e293b;
          }

          .save-button {
            border: none;
            color: #ffffff;
            background:
              linear-gradient(
                135deg,
                #4f46e5,
                #7c3aed
              );
            box-shadow:
              0 8px 20px rgba(79, 70, 229, 0.22);
          }

          .save-button:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow:
              0 12px 25px rgba(79, 70, 229, 0.28);
          }

          .save-button:active:not(:disabled) {
            transform: translateY(0);
          }

          .error-alert {
            border: 1px solid #fecaca;
            border-radius: 14px;
            background: #fff7f7;
            color: #991b1b;
            padding: 15px 17px;
            margin-bottom: 22px;
          }

          .error-icon {
            width: 30px;
            height: 30px;
            border-radius: 9px;
            background: #fee2e2;
            color: #dc2626;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            font-weight: 800;
          }

          .success-overlay {
            position: fixed;
            inset: 0;
            z-index: 9999;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(15, 23, 42, 0.58);
            backdrop-filter: blur(8px);
          }

          .success-modal {
            width: 100%;
            max-width: 450px;
            padding: 42px 32px;
            border-radius: 26px;
            background: #ffffff;
            text-align: center;
            box-shadow:
              0 30px 90px rgba(15, 23, 42, 0.25);
            animation: successModalIn 0.3s ease-out;
          }

          .success-icon {
            width: 78px;
            height: 78px;
            margin: 0 auto 22px;
            border-radius: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(
              135deg,
              #dcfce7,
              #bbf7d0
            );
            color: #16a34a;
            font-size: 38px;
            font-weight: 800;
            box-shadow:
              0 12px 30px rgba(22, 163, 74, 0.14);
          }

          .success-title {
            color: #0f172a;
            font-size: 24px;
            letter-spacing: -0.3px;
          }

          .success-description {
            color: #64748b;
            line-height: 1.65;
          }

          .progress-track {
            height: 6px;
            overflow: hidden;
            border-radius: 999px;
            background: #e2e8f0;
          }

          .progress-fill {
            height: 100%;
            width: 0;
            border-radius: inherit;
            background:
              linear-gradient(
                90deg,
                #22c55e,
                #16a34a
              );
            animation: progressAnimation 1.8s linear forwards;
          }

          .redirect-text {
            color: #94a3b8;
            font-size: 12px;
          }

          @keyframes progressAnimation {
            from {
              width: 0%;
            }

            to {
              width: 100%;
            }
          }

          @keyframes successModalIn {
            from {
              opacity: 0;
              transform: translateY(12px) scale(0.97);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @media (max-width: 767px) {
            .edit-event-page {
              padding: 22px 14px 45px;
            }

            .page-title {
              font-size: 26px;
            }

            .edit-card {
              border-radius: 18px;
            }

            .edit-card-header {
              padding: 21px 18px;
            }

            .edit-card-body {
              padding: 20px 18px;
            }

            .section-icon {
              width: 46px;
              height: 46px;
              border-radius: 13px;
            }

            .form-actions {
              flex-direction: column-reverse;
            }

            .form-actions button {
              width: 100%;
            }

            .success-modal {
              padding: 35px 23px;
              border-radius: 22px;
            }
          }
        `}
      </style>

      <div className="edit-event-page">
        <div className="edit-event-container">
          <div className="edit-event-header">
            <div className="d-flex align-items-center gap-2 mb-3">
              <button
                type="button"
                className="breadcrumb-button"
                onClick={() => navigate("/admin/events")}
                disabled={updating}
                aria-label="Back to manage events"
              >
                ←
              </button>

              <span
                className="small fw-semibold"
                style={{ color: "#64748b" }}
              >
                Manage Events
              </span>

              <span style={{ color: "#cbd5e1" }}>
                /
              </span>

              <span
                className="small"
                style={{ color: "#94a3b8" }}
              >
                Edit Event
              </span>
            </div>

            <div>
              <h1
                className="page-title fw-bold mb-2"
                style={{ color: "#0f172a" }}
              >
                Edit Event
              </h1>

              <p
                className="mb-0"
                style={{
                  color: "#64748b",
                  fontSize: "15px",
                }}
              >
                Update your event information and keep
                everything accurate for your attendees.
              </p>
            </div>
          </div>

          {error && (
            <div
              className="error-alert d-flex align-items-center gap-3"
              role="alert"
            >
              <div className="error-icon">
                !
              </div>

              <div>
                <div
                  className="fw-bold mb-1"
                  style={{ fontSize: "14px" }}
                >
                  Unable to save changes
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    color: "#b91c1c",
                  }}
                >
                  {error}
                </div>
              </div>
            </div>
          )}

          <div className="edit-card">
            <div className="edit-card-header">
              <div className="d-flex align-items-center">
                <div className="section-icon me-3">
                  ✎
                </div>

                <div>
                  <h2
                    className="h5 fw-bold mb-1"
                    style={{ color: "#0f172a" }}
                  >
                    Event Information
                  </h2>

                  <p
                    className="mb-0 small"
                    style={{ color: "#64748b" }}
                  >
                    Update the essential details of your
                    event below.
                  </p>
                </div>
              </div>
            </div>

            <div className="edit-card-body">
              <div className="mb-4">
                <label
                  htmlFor="event-title"
                  className="form-section-label"
                >
                  Event Title
                </label>

                <input
                  id="event-title"
                  type="text"
                  name="title"
                  className="form-control professional-input"
                  placeholder="Enter a clear and engaging event title"
                  value={event.title || ""}
                  onChange={handleChange}
                  disabled={updating}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="event-description"
                  className="form-section-label"
                >
                  Description
                </label>

                <textarea
                  id="event-description"
                  name="description"
                  className="form-control professional-input"
                  placeholder="Describe what attendees can expect from this event..."
                  rows="5"
                  value={event.description || ""}
                  onChange={handleChange}
                  disabled={updating}
                />

                <small className="field-help">
                  Provide useful information that helps
                  attendees understand your event.
                </small>
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <label
                    htmlFor="event-date"
                    className="form-section-label"
                  >
                    Event Date
                  </label>

                  <input
                    id="event-date"
                    type="date"
                    name="date"
                    className="form-control professional-input"
                    value={
                      event.date
                        ? event.date.substring(0, 10)
                        : ""
                    }
                    onChange={handleChange}
                    disabled={updating}
                  />
                </div>

                <div className="col-md-6 mb-4">
                  <label
                    htmlFor="ticket-price"
                    className="form-section-label"
                  >
                    Ticket Price
                  </label>

                  <div className="input-group price-group">
                    <span className="input-group-text">
                      ₹
                    </span>

                    <input
                      id="ticket-price"
                      type="number"
                      name="ticketPrice"
                      className="form-control professional-input"
                      min="0"
                      step="1"
                      placeholder="0"
                      value={event.ticketPrice ?? ""}
                      onChange={handleChange}
                      disabled={updating}
                    />
                  </div>

                  <small className="field-help">
                    Enter the price for one ticket.
                  </small>
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="total-seats"
                  className="form-section-label"
                >
                  Total Seats
                </label>

                <input
                  id="total-seats"
                  type="number"
                  name="totalSeats"
                  className="form-control professional-input"
                  min="1"
                  step="1"
                  placeholder="Enter total available seats"
                  value={event.totalSeats ?? ""}
                  onChange={handleChange}
                  disabled={updating}
                />

                <small className="field-help">
                  Set the total number of seats available
                  for this event.
                </small>
              </div>

              <div className="protected-notice mb-4">
                <div className="d-flex gap-3">
                  <div className="notice-icon">
                    i
                  </div>

                  <div>
                    <div
                      className="fw-bold mb-1"
                      style={{
                        color: "#1e3a8a",
                        fontSize: "14px",
                      }}
                    >
                      Protected Event Details
                    </div>

                    <div
                      style={{
                        color: "#64748b",
                        fontSize: "13px",
                        lineHeight: "1.6",
                      }}
                    >
                      Time, venue, location, banner and
                      available seats are not changed from
                      this page.
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn cancel-button"
                  onClick={() => navigate("/admin/events")}
                  disabled={updating}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn save-button"
                  onClick={handleUpdate}
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />

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
      </div>

      {showSuccess && (
        <div className="success-overlay">
          <div className="success-modal">
            <div className="success-icon">
              ✓
            </div>

            <h2 className="success-title fw-bold mb-2">
              Event Updated Successfully
            </h2>

            <p className="success-description mb-4">
              Your event changes have been saved
              successfully. You will be redirected to
              Manage Events shortly.
            </p>

            <div className="progress-track mb-3">
              <div className="progress-fill" />
            </div>

            <div className="redirect-text">
              Redirecting to Manage Events...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditEvent;