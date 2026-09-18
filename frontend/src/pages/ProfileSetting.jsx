import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getMyProfile,
  updateMyProfile,
  changePassword,
} from "../services/userService";

function ProfileSetting() {
  /* =========================================================
     PROFILE STATE
     ========================================================= */

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: "",
    role: "",
  });

  const [originalProfile, setOriginalProfile] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: "",
    role: "",
  });

  /* =========================================================
     PASSWORD STATE
     ========================================================= */

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /* =========================================================
     UI STATE
     ========================================================= */

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* =========================================================
     PROFILE MESSAGES
     ========================================================= */

  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  /* =========================================================
     PASSWORD MESSAGES
     ========================================================= */

  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  /* =========================================================
     LOAD PROFILE
     ========================================================= */

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setProfileError("");

      const response = await getMyProfile();

      const user = response?.user || response?.data || response;

      const profileData = {
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        profileImage: user?.profileImage || "",
        role: user?.role || "user",
      };

      setProfile(profileData);
      setOriginalProfile(profileData);
    } catch (error) {
      console.error("Profile loading error:", error);

      setProfileError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     PROFILE INPUT CHANGE
     ========================================================= */

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setProfileMessage("");
    setProfileError("");
  };

  /* =========================================================
     PASSWORD INPUT CHANGE
     ========================================================= */

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPasswordMessage("");
    setPasswordError("");
  };

  /* =========================================================
     SAVE PROFILE
     ========================================================= */

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    setProfileMessage("");
    setProfileError("");

    const name = profile.name.trim();
    const phone = profile.phone.trim();
    const profileImage = profile.profileImage.trim();

    if (!name) {
      setProfileError("Please enter your full name.");
      return;
    }

    try {
      setSaving(true);

      const response = await updateMyProfile({
        name,
        phone,
        profileImage,
      });

      const updatedUser =
        response?.user || response?.data || response;

      const updatedProfile = {
        name: updatedUser?.name ?? name,
        email: updatedUser?.email ?? profile.email,
        phone: updatedUser?.phone ?? phone,
        profileImage:
          updatedUser?.profileImage ?? profileImage,
        role: updatedUser?.role ?? profile.role,
      };

      setProfile(updatedProfile);
      setOriginalProfile(updatedProfile);

      setProfileMessage(
        "Your profile has been updated successfully."
      );
    } catch (error) {
      console.error("Profile update error:", error);

      setProfileError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     CANCEL PROFILE CHANGES
     ========================================================= */

  const handleCancelProfile = () => {
    setProfile(originalProfile);
    setProfileMessage("");
    setProfileError("");
  };

  /* =========================================================
     CHANGE PASSWORD
     ========================================================= */

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    const currentPassword = passwordData.currentPassword;
    const newPassword = passwordData.newPassword;
    const confirmPassword = passwordData.confirmPassword;

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        "New password must contain at least 6 characters."
      );
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError(
        "New password must be different from your current password."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      setChangingPassword(true);

      await changePassword({
        currentPassword,
        newPassword,
      });

      setPasswordMessage(
        "Your password has been changed successfully."
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Password change error:", error);

      setPasswordError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to change your password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  /* =========================================================
     RESET PASSWORD FORM
     ========================================================= */

  const handlePasswordReset = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setPasswordMessage("");
    setPasswordError("");

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  /* =========================================================
     PROFILE INITIAL
     ========================================================= */

  const initial = profile.name
    ? profile.name.charAt(0).toUpperCase()
    : "U";

  /* =========================================================
     LOADING SCREEN
     ========================================================= */

  if (loading) {
    return (
      <div className="container-fluid py-5">
        <div className="container">
          <div className="text-center py-5">

            <div
              className="spinner-border text-primary"
              role="status"
              style={{ width: "3rem", height: "3rem" }}
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <p className="text-muted mt-3 mb-0">
              Loading your profile...
            </p>

          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN UI
     ========================================================= */

  return (
    <div className="container-fluid py-4 profile-settings-page">
      <div className="container">

        {/* ===================================================
            PAGE HEADER
            =================================================== */}

        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">

          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <h2 className="fw-bold mb-0">
                Profile Settings
              </h2>
            </div>

            <p className="text-muted mb-0">
              Manage your personal information and account security.
            </p>
          </div>

          <Link
            to="/profile"
            className="btn btn-outline-primary"
          >
            View Profile
          </Link>

        </div>


        {/* ===================================================
            PROFILE ERROR
            =================================================== */}

        {profileError && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            {profileError}

            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setProfileError("")}
            />
          </div>
        )}


        {/* ===================================================
            PERSONAL INFORMATION CARD
            =================================================== */}

        <div className="card border-0 shadow-sm mb-4">

          <div className="card-body p-4">

            {/* CARD HEADER */}

            <div className="d-flex align-items-center gap-3 mb-4">

              <div
                className="profile-settings-avatar"
                title={profile.name || "User"}
              >
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={profile.name || "Profile"}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.parentElement.classList.add(
                        "profile-image-failed"
                      );
                    }}
                  />
                ) : (
                  initial
                )}
              </div>

              <div>
                <h5 className="fw-bold mb-1">
                  Personal Information
                </h5>

                <p className="text-muted mb-0">
                  Update your EventBook profile details.
                </p>
              </div>

            </div>


            {/* SUCCESS MESSAGE */}

            {profileMessage && (
              <div
                className="alert alert-success"
                role="alert"
              >
                {profileMessage}
              </div>
            )}


            {/* PROFILE FORM */}

            <form onSubmit={handleProfileSubmit}>

              <div className="row g-3">

                {/* NAME */}

                <div className="col-md-6">

                  <label
                    htmlFor="profile-name"
                    className="form-label fw-semibold"
                  >
                    Full Name
                  </label>

                  <input
                    id="profile-name"
                    type="text"
                    name="name"
                    className="form-control"
                    value={profile.name}
                    onChange={handleProfileChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                  />

                </div>


                {/* EMAIL */}

                <div className="col-md-6">

                  <label
                    htmlFor="profile-email"
                    className="form-label fw-semibold"
                  >
                    Email Address
                  </label>

                  <input
                    id="profile-email"
                    type="email"
                    className="form-control"
                    value={profile.email}
                    disabled
                  />

                  <small className="text-muted">
                    Your registered email cannot be changed here.
                  </small>

                </div>


                {/* PHONE */}

                <div className="col-md-6">

                  <label
                    htmlFor="profile-phone"
                    className="form-label fw-semibold"
                  >
                    Phone Number
                  </label>

                  <input
                    id="profile-phone"
                    type="tel"
                    name="phone"
                    className="form-control"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    placeholder="Enter phone number"
                    autoComplete="tel"
                  />

                </div>


                {/* ROLE */}

                <div className="col-md-6">

                  <label
                    htmlFor="profile-role"
                    className="form-label fw-semibold"
                  >
                    Account Role
                  </label>

                  <input
                    id="profile-role"
                    type="text"
                    className="form-control text-capitalize"
                    value={profile.role}
                    disabled
                  />

                </div>


                {/* PROFILE IMAGE */}

                <div className="col-12">

                  <label
                    htmlFor="profile-image"
                    className="form-label fw-semibold"
                  >
                    Profile Image URL
                  </label>

                  <input
                    id="profile-image"
                    type="url"
                    name="profileImage"
                    className="form-control"
                    value={profile.profileImage}
                    onChange={handleProfileChange}
                    placeholder="https://example.com/profile.jpg"
                  />

                  <small className="text-muted">
                    Paste a public image URL for your profile picture.
                  </small>

                </div>


                {/* PROFILE BUTTONS */}

                <div className="col-12">

                  <div className="d-flex flex-wrap gap-2 mt-2">

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
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
                      onClick={handleCancelProfile}
                      disabled={saving}
                    >
                      Cancel
                    </button>

                  </div>

                </div>

              </div>

            </form>

          </div>

        </div>


        {/* ===================================================
            CHANGE PASSWORD CARD
            =================================================== */}

        <div className="card border-0 shadow-sm">

          <div className="card-body p-4">

            {/* CARD HEADER */}

            <div className="mb-4">

              <h5 className="fw-bold mb-1">
                Change Password
              </h5>

              <p className="text-muted mb-0">
                Keep your EventBook account secure with a strong password.
              </p>

            </div>


            {/* PASSWORD ERROR */}

            {passwordError && (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                {passwordError}

                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setPasswordError("")}
                />
              </div>
            )}


            {/* PASSWORD SUCCESS */}

            {passwordMessage && (
              <div
                className="alert alert-success"
                role="alert"
              >
                {passwordMessage}
              </div>
            )}


            {/* PASSWORD FORM */}

            <form onSubmit={handlePasswordSubmit}>

              <div className="row g-3">

                {/* CURRENT PASSWORD */}

                <div className="col-12">

                  <label
                    htmlFor="current-password"
                    className="form-label fw-semibold"
                  >
                    Current Password
                  </label>

                  <div className="input-group">

                    <input
                      id="current-password"
                      type={
                        showCurrentPassword
                          ? "text"
                          : "password"
                      }
                      name="currentPassword"
                      className="form-control"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter your current password"
                      autoComplete="current-password"
                      required
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setShowCurrentPassword(
                          !showCurrentPassword
                        )
                      }
                    >
                      {showCurrentPassword
                        ? "Hide"
                        : "Show"}
                    </button>

                  </div>

                </div>


                {/* NEW PASSWORD */}

                <div className="col-md-6">

                  <label
                    htmlFor="new-password"
                    className="form-label fw-semibold"
                  >
                    New Password
                  </label>

                  <div className="input-group">

                    <input
                      id="new-password"
                      type={
                        showNewPassword
                          ? "text"
                          : "password"
                      }
                      name="newPassword"
                      className="form-control"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                      minLength="6"
                      autoComplete="new-password"
                      required
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setShowNewPassword(
                          !showNewPassword
                        )
                      }
                    >
                      {showNewPassword
                        ? "Hide"
                        : "Show"}
                    </button>

                  </div>

                  <small className="text-muted">
                    Minimum 6 characters.
                  </small>

                </div>


                {/* CONFIRM PASSWORD */}

                <div className="col-md-6">

                  <label
                    htmlFor="confirm-password"
                    className="form-label fw-semibold"
                  >
                    Confirm New Password
                  </label>

                  <div className="input-group">

                    <input
                      id="confirm-password"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      className="form-control"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      minLength="6"
                      autoComplete="new-password"
                      required
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                    >
                      {showConfirmPassword
                        ? "Hide"
                        : "Show"}
                    </button>

                  </div>

                </div>


                {/* PASSWORD BUTTONS */}

                <div className="col-12">

                  <div className="d-flex flex-wrap gap-2 mt-2">

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={changingPassword}
                    >
                      {changingPassword ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          />
                          Changing Password...
                        </>
                      ) : (
                        "Change Password"
                      )}
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handlePasswordReset}
                      disabled={changingPassword}
                    >
                      Clear
                    </button>

                  </div>

                </div>

              </div>

            </form>

          </div>

        </div>


        {/* ===================================================
            BACK LINK
            =================================================== */}

        <div className="mt-4">

          <Link
            to="/settings"
            className="text-decoration-none"
          >
            ← Back to Settings
          </Link>

        </div>

      </div>
    </div>
  );
}

export default ProfileSetting;

