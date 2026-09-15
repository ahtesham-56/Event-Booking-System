import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function UsersSettings() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [bookingNotifications, setBookingNotifications] =
    useState(true);

  const [eventNotifications, setEventNotifications] =
    useState(true);

  const [promotionalNotifications, setPromotionalNotifications] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser =
          JSON.parse(
            localStorage.getItem("user")
          ) || {};

        setUser(storedUser);

        setName(
          storedUser.name ||
          storedUser.fullName ||
          ""
        );

        setEmail(
          storedUser.email ||
          ""
        );
      } catch (error) {
        console.error(
          "USER SETTINGS ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleSave = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      /*
        Update user profile using existing API.
        This assumes your userService/backend supports
        the current-user update endpoint.
      */

      const response = await api.put(
        "/users/profile",
        {
          name,
          email,
          notificationPreferences: {
            bookingNotifications,
            eventNotifications,
            promotionalNotifications,
          },
        }
      );

      const updatedUser =
        response.data?.user ||
        response.data;

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setUser(updatedUser);

      setMessage(
        "Settings updated successfully."
      );
    } catch (error) {
      console.error(
        "UPDATE USER SETTINGS:",
        error
      );

      /*
        Keep the UI usable even if the backend
        endpoint is not connected yet.
      */

      const currentUser =
        JSON.parse(
          localStorage.getItem("user")
        ) || {};

      const updatedUser = {
        ...currentUser,
        name,
        email,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setUser(updatedUser);

      setMessage(
        "Profile settings saved locally."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-5">
        <div className="text-center">
          <div
            className="spinner-border text-primary"
            role="status"
          />
          <p className="text-muted mt-3 mb-0">
            Loading settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 py-lg-5">

      {/* HEADER */}

      <div className="mb-4">

        <button
          type="button"
          className="btn btn-link text-decoration-none px-0 mb-2"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <h2 className="fw-bold mb-1">
          Account Settings
        </h2>

        <p className="text-muted mb-0">
          Manage your EventBook profile and personal preferences.
        </p>

      </div>

      {message && (
        <div className="alert alert-success rounded-3">
          {message}
        </div>
      )}

      <div className="row g-4">

        {/* PROFILE */}

        <div className="col-12 col-lg-7">

          <div className="card border-0 shadow-sm rounded-4">

            <div className="card-body p-4">

              <h5 className="fw-bold mb-1">
                Profile Information
              </h5>

              <p className="text-muted small mb-4">
                Update your personal account information.
              </p>

              <form onSubmit={handleSave}>

                <div className="mb-3">

                  <label className="form-label fw-semibold">
                    Full Name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Enter your name"
                    required
                  />

                </div>

                <div className="mb-4">

                  <label className="form-label fw-semibold">
                    Email Address
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="Enter your email"
                    required
                  />

                </div>

                <button
                  type="submit"
                  className="btn btn-primary px-4"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </form>

            </div>

          </div>

        </div>

        {/* ACCOUNT */}

        <div className="col-12 col-lg-5">

          <div className="card border-0 shadow-sm rounded-4 mb-4">

            <div className="card-body p-4">

              <h5 className="fw-bold mb-1">
                Account
              </h5>

              <p className="text-muted small mb-4">
                Your EventBook account information.
              </p>

              <div className="d-flex align-items-center gap-3">

                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                  style={{
                    width: "52px",
                    height: "52px",
                  }}
                >
                  {(name || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>

                  <div className="fw-semibold">
                    {name || "User"}
                  </div>

                  <small className="text-muted">
                    {email || "No email"}
                  </small>

                </div>

              </div>

            </div>

          </div>

          {/* NOTIFICATIONS */}

          <div className="card border-0 shadow-sm rounded-4">

            <div className="card-body p-4">

              <h5 className="fw-bold mb-1">
                Notifications
              </h5>

              <p className="text-muted small mb-4">
                Choose which EventBook notifications you want to receive.
              </p>

              <div className="form-check form-switch mb-3">

                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={bookingNotifications}
                  onChange={(e) =>
                    setBookingNotifications(
                      e.target.checked
                    )
                  }
                  id="bookingNotifications"
                />

                <label
                  className="form-check-label"
                  htmlFor="bookingNotifications"
                >
                  Booking notifications
                </label>

              </div>

              <div className="form-check form-switch mb-3">

                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={eventNotifications}
                  onChange={(e) =>
                    setEventNotifications(
                      e.target.checked
                    )
                  }
                  id="eventNotifications"
                />

                <label
                  className="form-check-label"
                  htmlFor="eventNotifications"
                >
                  Event updates
                </label>

              </div>

              <div className="form-check form-switch">

                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={promotionalNotifications}
                  onChange={(e) =>
                    setPromotionalNotifications(
                      e.target.checked
                    )
                  }
                  id="promotionalNotifications"
                />

                <label
                  className="form-check-label"
                  htmlFor="promotionalNotifications"
                >
                  Event recommendations
                </label>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default UsersSettings;