import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyProfile,
  updateMyProfile,
} from "../services/userService";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    profileImage: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================================================
  // LOAD PROFILE
  // =========================================================

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyProfile();

      setUser(data.user);

      setFormData({
        name: data.user.name || "",
        phone: data.user.phone || "",
        profileImage: data.user.profileImage || "",
      });
    } catch (error) {
      console.error("Profile error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  // =========================================================
  // UPDATE PROFILE
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const data = await updateMyProfile(formData);

      setUser(data.user);

      setFormData({
        name: data.user.name || "",
        phone: data.user.phone || "",
        profileImage: data.user.profileImage || "",
      });

      setMessage(
        data.message || "Profile updated successfully"
      );
    } catch (error) {
      console.error("Update profile error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div
            className="spinner-border text-primary"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <p className="mt-3 text-muted">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (!user) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error || "Unable to load profile"}
        </div>

        <button
          className="btn btn-primary"
          onClick={loadProfile}
        >
          Try Again
        </button>
      </div>
    );
  }

  // =========================================================
  // PROFILE UI
  // =========================================================

  return (
    <div className="container-fluid py-4">
      <div className="container">

        {/* PAGE HEADER */}
        <div className="mb-4">
          <h2 className="fw-bold mb-1">
            My Profile
          </h2>

          <p className="text-muted mb-0">
            Manage your personal information and profile.
          </p>
        </div>

        {/* ALERTS */}
        {message && (
          <div className="alert alert-success">
            {message}
          </div>
        )}

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <div className="row g-4">

          {/* PROFILE CARD */}
          <div className="col-lg-4">

            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center p-4">

                {/* PROFILE IMAGE */}
                <div className="mb-3">

                  {formData.profileImage ? (
                    <img
                      src={formData.profileImage}
                      alt="Profile"
                      className="rounded-circle border"
                      style={{
                        width: "130px",
                        height: "130px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display =
                          "none";
                        e.currentTarget.nextSibling.style.display =
                          "flex";
                      }}
                    />
                  ) : null}

                  <div
                    className="rounded-circle bg-primary text-white mx-auto d-flex align-items-center justify-content-center fw-bold"
                    style={{
                      width: "130px",
                      height: "130px",
                      fontSize: "48px",
                      display: formData.profileImage
                        ? "none"
                        : "flex",
                    }}
                  >
                    {user.name
                      ? user.name
                          .charAt(0)
                          .toUpperCase()
                      : "U"}
                  </div>

                </div>

                <h4 className="fw-bold mb-1">
                  {user.name}
                </h4>

                <p className="text-muted mb-3">
                  {user.email}
                </p>

                <span
                  className={`badge ${
                    user.role === "admin"
                      ? "bg-danger"
                      : "bg-primary"
                  } px-3 py-2`}
                >
                  {user.role === "admin"
                    ? "Administrator"
                    : "User"}
                </span>

                <hr className="my-4" />

                <button
                  type="button"
                  className="btn btn-outline-primary w-100"
                  onClick={() =>
                    navigate("/settings")
                  }
                >
                  Account Settings
                </button>

              </div>
            </div>

          </div>

          {/* PROFILE FORM */}
          <div className="col-lg-8">

            <div className="card border-0 shadow-sm">

              <div className="card-body p-4">

                <h5 className="fw-bold mb-1">
                  Personal Information
                </h5>

                <p className="text-muted mb-4">
                  Update your profile information below.
                </p>

                <form onSubmit={handleSubmit}>

                  {/* NAME */}
                  <div className="mb-3">

                    <label
                      htmlFor="name"
                      className="form-label fw-semibold"
                    >
                      Full Name
                    </label>

                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />

                  </div>

                  {/* EMAIL */}
                  <div className="mb-3">

                    <label className="form-label fw-semibold">
                      Email Address
                    </label>

                    <input
                      type="email"
                      className="form-control"
                      value={user.email}
                      disabled
                    />

                    <small className="text-muted">
                      Email address cannot be changed here.
                    </small>

                  </div>

                  {/* PHONE */}
                  <div className="mb-3">

                    <label
                      htmlFor="phone"
                      className="form-label fw-semibold"
                    >
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="form-control"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                    />

                  </div>

                  {/* PROFILE IMAGE */}
                  <div className="mb-4">

                    <label
                      htmlFor="profileImage"
                      className="form-label fw-semibold"
                    >
                      Profile Picture URL
                    </label>

                    <input
                      type="url"
                      id="profileImage"
                      name="profileImage"
                      className="form-control"
                      placeholder="https://example.com/profile.jpg"
                      value={formData.profileImage}
                      onChange={handleChange}
                    />

                    <small className="text-muted">
                      We will add direct image upload later.
                    </small>

                  </div>

                  {/* BUTTONS */}
                  <div className="d-flex gap-2">

                    <button
                      type="submit"
                      className="btn btn-primary px-4"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={loadProfile}
                      disabled={saving}
                    >
                      Cancel
                    </button>

                  </div>

                </form>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Profile;