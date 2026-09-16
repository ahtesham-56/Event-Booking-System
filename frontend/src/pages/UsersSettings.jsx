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
  const [messageType, setMessageType] = useState("success");

  /* =========================================================
     LOAD USER
     ========================================================= */

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser =
          JSON.parse(localStorage.getItem("user")) || {};

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

        const preferences =
          storedUser.notificationPreferences || {};

        setBookingNotifications(
          preferences.bookingNotifications !== undefined
            ? preferences.bookingNotifications
            : true
        );

        setEventNotifications(
          preferences.eventNotifications !== undefined
            ? preferences.eventNotifications
            : true
        );

        setPromotionalNotifications(
          preferences.promotionalNotifications !== undefined
            ? preferences.promotionalNotifications
            : false
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

  /* =========================================================
     SAVE SETTINGS
     ========================================================= */

  const handleSave = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setMessageType("success");

    const notificationPreferences = {
      bookingNotifications,
      eventNotifications,
      promotionalNotifications,
    };

    try {
      const response = await api.put(
        "/users/profile",
        {
          name,
          email,
          notificationPreferences,
        }
      );

      const updatedUser =
        response.data?.user ||
        response.data;

      const finalUser = {
        ...updatedUser,
        name,
        email,
        notificationPreferences,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(finalUser)
      );

      setUser(finalUser);

      setMessage(
        "Your account settings have been updated successfully."
      );

      setMessageType("success");
    } catch (error) {
      console.error(
        "UPDATE USER SETTINGS:",
        error
      );

      /*
        Local fallback.
        This keeps the settings usable even when
        the backend profile endpoint is not connected.
      */

      const currentUser =
        JSON.parse(
          localStorage.getItem("user")
        ) || {};

      const updatedUser = {
        ...currentUser,
        name,
        email,
        notificationPreferences,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setUser(updatedUser);

      setMessage(
        "Settings saved on this device."
      );

      setMessageType("warning");
    } finally {
      setSaving(false);

      setTimeout(() => {
        setMessage("");
      }, 4000);
    }
  };

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <>
        <style>{`
          .user-settings-loading {
            min-height: calc(100vh - 70px);
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f7f8fc;
            padding: 30px;
          }

          .loading-box {
            text-align: center;
          }

          .loading-spinner {
            width: 38px;
            height: 38px;
            border: 3px solid #e5e7eb;
            border-top-color: #4f46e5;
            border-radius: 50%;
            animation: userSettingsSpin 0.8s linear infinite;
            margin: 0 auto;
          }

          .loading-box p {
            margin: 14px 0 0;
            color: #667085;
            font-size: 13px;
          }

          @keyframes userSettingsSpin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>

        <div className="user-settings-loading">
          <div className="loading-box">
            <div className="loading-spinner"></div>

            <p>
              Loading your settings...
            </p>
          </div>
        </div>
      </>
    );
  }

  /* =========================================================
     USER AVATAR
     ========================================================= */

  const avatarLetter =
    (name || "U")
      .charAt(0)
      .toUpperCase();

  return (
    <>
      <style>{`

        /* =====================================================
           USER SETTINGS PAGE
           ===================================================== */

        .user-settings-page {
          min-height: calc(100vh - 70px);
          padding: 32px;
          background:
            radial-gradient(
              circle at top right,
              rgba(79, 70, 229, 0.06),
              transparent 28%
            ),
            #f7f8fc;
        }

        .user-settings-container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
        }

        /* =====================================================
           HEADER
           ===================================================== */

        .user-settings-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 26px;
        }

        .user-header-left {
          min-width: 0;
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 12px;
          padding: 0;
          border: none;
          background: transparent;
          color: #667085;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .back-button:hover {
          color: #4f46e5;
        }

        .settings-eyebrow {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 8px;
          color: #4f46e5;
          font-size: 11px;
          font-weight: 750;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4f46e5;
        }

        .user-settings-header h2 {
          margin: 0;
          color: #111827;
          font-size: 30px;
          line-height: 1.2;
          font-weight: 750;
          letter-spacing: -0.02em;
        }

        .user-settings-header p {
          max-width: 650px;
          margin: 8px 0 0;
          color: #667085;
          font-size: 14px;
          line-height: 1.6;
        }

        .header-account-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          padding: 10px 14px;
          border: 1px solid #e4e7ec;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.9);
          color: #475467;
          font-size: 12px;
          font-weight: 650;
          box-shadow:
            0 3px 12px rgba(15, 23, 42, 0.03);
        }

        .account-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow:
            0 0 0 4px rgba(34, 197, 94, 0.10);
        }

        /* =====================================================
           ALERT
           ===================================================== */

        .settings-alert {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-bottom: 22px;
          padding: 13px 16px;
          border-radius: 13px;
          font-size: 12px;
          font-weight: 600;
          animation: userAlertIn 0.25s ease;
        }

        .settings-alert.success {
          border: 1px solid #b7efcf;
          background: #f0fdf4;
          color: #166534;
        }

        .settings-alert.warning {
          border: 1px solid #f3d7a2;
          background: #fffaf0;
          color: #946200;
        }

        .alert-icon {
          width: 27px;
          height: 27px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #22c55e;
          color: #fff;
          font-size: 13px;
          font-weight: 800;
        }

        .warning .alert-icon {
          background: #f59e0b;
        }

        @keyframes userAlertIn {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* =====================================================
           MAIN GRID
           ===================================================== */

        .settings-content-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.45fr) minmax(320px, 0.85fr);
          gap: 20px;
          align-items: start;
        }

        /* =====================================================
           CARDS
           ===================================================== */

        .user-settings-card {
          overflow: hidden;
          border: 1px solid #e8ebf2;
          border-radius: 17px;
          background: #fff;
          box-shadow:
            0 5px 20px rgba(15, 23, 42, 0.035),
            0 1px 3px rgba(15, 23, 42, 0.025);
          transition:
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }

        .user-settings-card:hover {
          border-color: #dde1ea;
          box-shadow:
            0 9px 28px rgba(15, 23, 42, 0.055),
            0 2px 5px rgba(15, 23, 42, 0.03);
        }

        .card-heading {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 19px 22px;
          border-bottom: 1px solid #eef0f4;
          background:
            linear-gradient(
              180deg,
              #ffffff 0%,
              #fcfcfd 100%
            );
        }

        .card-heading-icon {
          width: 41px;
          height: 41px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e4e7ff;
          border-radius: 12px;
          background: #f2f3ff;
          color: #4f46e5;
          font-size: 17px;
        }

        .card-heading-content {
          min-width: 0;
        }

        .card-heading h5 {
          margin: 0;
          color: #172033;
          font-size: 15px;
          line-height: 1.3;
          font-weight: 700;
        }

        .card-heading p {
          margin: 4px 0 0;
          color: #98a2b3;
          font-size: 11px;
          line-height: 1.4;
        }

        .card-heading-badge {
          margin-left: auto;
          flex-shrink: 0;
          padding: 5px 9px;
          border: 1px solid #e4e7ec;
          border-radius: 20px;
          background: #f9fafb;
          color: #667085;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .user-card-body {
          padding: 24px 22px;
        }

        /* =====================================================
           PROFILE FORM
           ===================================================== */

        .form-group {
          margin-bottom: 21px;
        }

        .form-group:last-of-type {
          margin-bottom: 24px;
        }

        .user-form-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
          color: #344054;
          font-size: 12px;
          font-weight: 700;
        }

        .label-hint {
          color: #98a2b3;
          font-size: 10px;
          font-weight: 500;
        }

        .user-input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #98a2b3;
          font-size: 14px;
          pointer-events: none;
        }

        .user-input {
          width: 100%;
          height: 47px;
          box-sizing: border-box;
          padding: 0 13px 0 39px;
          border: 1px solid #dfe3eb;
          border-radius: 10px;
          outline: none;
          background: #fff;
          color: #273142;
          font-family: inherit;
          font-size: 13px;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .user-input:hover {
          border-color: #c9ced8;
        }

        .user-input:focus {
          border-color: #6366f1;
          box-shadow:
            0 0 0 3px rgba(99, 102, 241, 0.10);
        }

        .user-input::placeholder {
          color: #a4acb9;
        }

        /* =====================================================
           SAVE BUTTON
           ===================================================== */

        .save-changes-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-width: 145px;
          height: 44px;
          padding: 0 20px;
          border: 1px solid #4f46e5;
          border-radius: 10px;
          background: #4f46e5;
          color: #fff;
          font-family: inherit;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          box-shadow:
            0 5px 13px rgba(79, 70, 229, 0.18);
          transition:
            background 0.2s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .save-changes-button:hover:not(:disabled) {
          border-color: #4338ca;
          background: #4338ca;
          transform: translateY(-1px);
          box-shadow:
            0 7px 16px rgba(79, 70, 229, 0.22);
        }

        .save-changes-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .save-changes-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .button-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: userSettingsSpin 0.7s linear infinite;
        }

        /* =====================================================
           ACCOUNT CARD
           ===================================================== */

        .account-profile {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 15px;
          border: 1px solid #edf0f4;
          border-radius: 13px;
          background: #fafbfc;
        }

        .profile-avatar {
          width: 52px;
          height: 52px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 15px;
          background:
            linear-gradient(
              135deg,
              #4f46e5,
              #6366f1
            );
          color: #fff;
          font-size: 19px;
          font-weight: 750;
          box-shadow:
            0 5px 12px rgba(79, 70, 229, 0.20);
        }

        .account-details {
          min-width: 0;
        }

        .account-name {
          margin-bottom: 3px;
          overflow: hidden;
          color: #1f2937;
          font-size: 13px;
          font-weight: 700;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .account-email {
          overflow: hidden;
          color: #8a94a6;
          font-size: 11px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .account-role {
          display: inline-flex;
          margin-top: 7px;
          padding: 3px 8px;
          border: 1px solid #dfe3ff;
          border-radius: 20px;
          background: #f3f4ff;
          color: #4f46e5;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
        }

        /* =====================================================
           NOTIFICATION SETTINGS
           ===================================================== */

        .notification-list {
          display: flex;
          flex-direction: column;
        }

        .notification-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 15px 0;
          border-bottom: 1px solid #eef0f4;
        }

        .notification-item:first-child {
          padding-top: 0;
        }

        .notification-item:last-child {
          padding-bottom: 0;
          border-bottom: none;
        }

        .notification-info {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: 0;
        }

        .notification-icon {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e8e9ff;
          border-radius: 10px;
          background: #f7f7ff;
          color: #4f46e5;
          font-size: 14px;
        }

        .notification-title {
          margin-bottom: 2px;
          color: #273142;
          font-size: 12px;
          font-weight: 650;
        }

        .notification-description {
          color: #98a2b3;
          font-size: 10px;
          line-height: 1.45;
        }

        /* =====================================================
           CUSTOM SWITCH
           ===================================================== */

        .notification-switch {
          position: relative;
          width: 45px;
          height: 25px;
          flex-shrink: 0;
          cursor: pointer;
        }

        .notification-switch input {
          position: absolute;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
        }

        .notification-slider {
          position: absolute;
          inset: 0;
          border-radius: 30px;
          background: #d8dde6;
          transition:
            background 0.25s ease,
            box-shadow 0.25s ease;
        }

        .notification-slider::before {
          content: "";
          position: absolute;
          top: 4px;
          left: 4px;
          width: 17px;
          height: 17px;
          border-radius: 50%;
          background: #fff;
          box-shadow:
            0 2px 5px rgba(15, 23, 42, 0.20);
          transition: transform 0.25s ease;
        }

        .notification-switch
        input:checked
        + .notification-slider {
          background: #4f46e5;
          box-shadow:
            0 0 0 3px rgba(79, 70, 229, 0.08);
        }

        .notification-switch
        input:checked
        + .notification-slider::before {
          transform: translateX(20px);
        }

        .notification-switch:hover
        .notification-slider {
          background: #cbd1dc;
        }

        .notification-switch:hover
        input:checked
        + .notification-slider {
          background: #4338ca;
        }

        /* =====================================================
           INFORMATION BOX
           ===================================================== */

        .settings-info-box {
          display: flex;
          gap: 10px;
          margin-top: 19px;
          padding: 12px 13px;
          border: 1px solid #e4e7ec;
          border-radius: 11px;
          background: #f9fafb;
          color: #667085;
          font-size: 10px;
          line-height: 1.55;
        }

        .info-icon {
          flex-shrink: 0;
          color: #4f46e5;
          font-size: 13px;
        }

        /* =====================================================
           MOBILE / TABLET
           ===================================================== */

        @media (max-width: 1000px) {
          .user-settings-page {
            padding: 26px 22px;
          }

          .settings-content-grid {
            grid-template-columns: 1fr;
          }

          .user-settings-card {
            width: 100%;
          }
        }

        @media (max-width: 700px) {
          .user-settings-page {
            min-height: calc(100vh - 60px);
            padding: 20px 14px;
          }

          .user-settings-header {
            flex-direction: column;
            gap: 13px;
            margin-bottom: 21px;
          }

          .user-settings-header h2 {
            font-size: 25px;
          }

          .user-settings-header p {
            font-size: 13px;
          }

          .header-account-badge {
            width: fit-content;
          }

          .card-heading {
            padding: 17px;
          }

          .user-card-body {
            padding: 20px 17px;
          }

          .card-heading-badge {
            display: none;
          }

          .settings-content-grid {
            gap: 15px;
          }
        }

        @media (max-width: 430px) {
          .user-settings-page {
            padding: 17px 10px;
          }

          .user-settings-header h2 {
            font-size: 22px;
          }

          .user-settings-header p {
            font-size: 12px;
          }

          .back-button {
            font-size: 11px;
          }

          .card-heading {
            padding: 15px;
            gap: 10px;
          }

          .user-card-body {
            padding: 18px 15px;
          }

          .card-heading-icon {
            width: 36px;
            height: 36px;
            border-radius: 10px;
          }

          .card-heading h5 {
            font-size: 13px;
          }

          .card-heading p {
            font-size: 10px;
          }

          .user-form-label {
            font-size: 11px;
          }

          .label-hint {
            display: none;
          }

          .user-input {
            height: 45px;
            font-size: 12px;
          }

          .save-changes-button {
            width: 100%;
          }

          .account-profile {
            padding: 13px;
          }

          .profile-avatar {
            width: 46px;
            height: 46px;
            border-radius: 13px;
            font-size: 17px;
          }

          .notification-item {
            align-items: flex-start;
          }

          .notification-info {
            align-items: flex-start;
          }

          .notification-icon {
            width: 34px;
            height: 34px;
          }

          .notification-switch {
            margin-top: 4px;
          }

          .settings-alert {
            align-items: flex-start;
            padding: 11px 12px;
          }
        }

      `}</style>

      <div className="user-settings-page">

        <div className="user-settings-container">

          {/* =====================================================
              HEADER
              ===================================================== */}

          <div className="user-settings-header">

            <div className="user-header-left">

              <button
                type="button"
                className="back-button"
                onClick={() => navigate("/dashboard")}
              >
                <span>←</span>
                <span>Back to Dashboard</span>
              </button>

              <div className="settings-eyebrow">
                <span className="eyebrow-dot"></span>
                Account
              </div>

              <h2>
                Account Settings
              </h2>

              <p>
                Manage your EventBook profile, account information,
                and personal notification preferences.
              </p>

            </div>

            <div className="header-account-badge">
              <span className="account-status-dot"></span>
              Account Active
            </div>

          </div>

          {/* =====================================================
              MESSAGE
              ===================================================== */}

          {message && (
            <div
              className={`settings-alert ${
                messageType === "warning"
                  ? "warning"
                  : "success"
              }`}
            >
              <span className="alert-icon">
                {messageType === "warning"
                  ? "!"
                  : "✓"}
              </span>

              <span>
                {message}
              </span>
            </div>
          )}

          {/* =====================================================
              CONTENT
              ===================================================== */}

          <div className="settings-content-grid">

            {/* ===================================================
                PROFILE INFORMATION
                =================================================== */}

            <div className="user-settings-card">

              <div className="card-heading">

                <div className="card-heading-icon">
                  👤
                </div>

                <div className="card-heading-content">
                  <h5>
                    Profile Information
                  </h5>

                  <p>
                    Update your personal account information
                  </p>
                </div>

                <span className="card-heading-badge">
                  Profile
                </span>

              </div>

              <div className="user-card-body">

                <form onSubmit={handleSave}>

                  {/* NAME */}

                  <div className="form-group">

                    <label className="user-form-label">
                      <span>
                        Full Name
                      </span>

                      <span className="label-hint">
                        Required
                      </span>
                    </label>

                    <div className="user-input-wrapper">

                      <span className="input-icon">
                        👤
                      </span>

                      <input
                        type="text"
                        className="user-input"
                        value={name}
                        onChange={(e) =>
                          setName(e.target.value)
                        }
                        placeholder="Enter your full name"
                        required
                      />

                    </div>

                  </div>

                  {/* EMAIL */}

                  <div className="form-group">

                    <label className="user-form-label">
                      <span>
                        Email Address
                      </span>

                      <span className="label-hint">
                        Required
                      </span>
                    </label>

                    <div className="user-input-wrapper">

                      <span className="input-icon">
                        ✉
                      </span>

                      <input
                        type="email"
                        className="user-input"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        placeholder="Enter your email address"
                        required
                      />

                    </div>

                  </div>

                  {/* SAVE */}

                  <button
                    type="submit"
                    className="save-changes-button"
                    disabled={saving}
                  >

                    {saving ? (
                      <>
                        <span className="button-spinner"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        ✓
                        Save Changes
                      </>
                    )}

                  </button>

                </form>

              </div>

            </div>

            {/* ===================================================
                RIGHT COLUMN
                =================================================== */}

            <div>

              {/* =================================================
                  ACCOUNT
                  ================================================= */}

              <div className="user-settings-card mb-3">

                <div className="card-heading">

                  <div className="card-heading-icon">
                    ◉
                  </div>

                  <div className="card-heading-content">
                    <h5>
                      Account
                    </h5>

                    <p>
                      Your EventBook account
                    </p>
                  </div>

                </div>

                <div className="user-card-body">

                  <div className="account-profile">

                    <div className="profile-avatar">
                      {avatarLetter}
                    </div>

                    <div className="account-details">

                      <div className="account-name">
                        {name || "User"}
                      </div>

                      <div className="account-email">
                        {email || "No email address"}
                      </div>

                      <span className="account-role">
                        {user?.role === "admin"
                          ? "Administrator"
                          : "Member"}
                      </span>

                    </div>

                  </div>

                </div>

              </div>

              {/* =================================================
                  NOTIFICATIONS
                  ================================================= */}

              <div className="user-settings-card">

                <div className="card-heading">

                  <div className="card-heading-icon">
                    🔔
                  </div>

                  <div className="card-heading-content">
                    <h5>
                      Notifications
                    </h5>

                    <p>
                      Manage your notification preferences
                    </p>
                  </div>

                  <span className="card-heading-badge">
                    Preferences
                  </span>

                </div>

                <div className="user-card-body">

                  <div className="notification-list">

                    {/* BOOKING */}

                    <div className="notification-item">

                      <div className="notification-info">

                        <div className="notification-icon">
                          🎟
                        </div>

                        <div>
                          <div className="notification-title">
                            Booking Notifications
                          </div>

                          <div className="notification-description">
                            Updates about your bookings and tickets.
                          </div>
                        </div>

                      </div>

                      <label className="notification-switch">

                        <input
                          type="checkbox"
                          checked={bookingNotifications}
                          onChange={(e) =>
                            setBookingNotifications(
                              e.target.checked
                            )
                          }
                        />

                        <span className="notification-slider"></span>

                      </label>

                    </div>

                    {/* EVENT */}

                    <div className="notification-item">

                      <div className="notification-info">

                        <div className="notification-icon">
                          📅
                        </div>

                        <div>
                          <div className="notification-title">
                            Event Updates
                          </div>

                          <div className="notification-description">
                            Important updates about your events.
                          </div>
                        </div>

                      </div>

                      <label className="notification-switch">

                        <input
                          type="checkbox"
                          checked={eventNotifications}
                          onChange={(e) =>
                            setEventNotifications(
                              e.target.checked
                            )
                          }
                        />

                        <span className="notification-slider"></span>

                      </label>

                    </div>

                    {/* PROMOTIONAL */}

                    <div className="notification-item">

                      <div className="notification-info">

                        <div className="notification-icon">
                          ✨
                        </div>

                        <div>
                          <div className="notification-title">
                            Event Recommendations
                          </div>

                          <div className="notification-description">
                            Discover events that may interest you.
                          </div>
                        </div>

                      </div>

                      <label className="notification-switch">

                        <input
                          type="checkbox"
                          checked={promotionalNotifications}
                          onChange={(e) =>
                            setPromotionalNotifications(
                              e.target.checked
                            )
                          }
                        />

                        <span className="notification-slider"></span>

                      </label>

                    </div>

                  </div>

                  {/* INFO */}

                  <div className="settings-info-box">

                    <span className="info-icon">
                      ⓘ
                    </span>

                    <span>
                      Your notification preferences are saved
                      with your account when you click
                      <strong> Save Changes</strong>.
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}

export default UsersSettings;