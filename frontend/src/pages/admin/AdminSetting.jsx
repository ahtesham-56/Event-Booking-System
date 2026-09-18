import { useEffect, useState } from "react";

function AdminSetting() {
  const defaultSettings = {
    platformName: "EventBook",
    currency: "INR",
    allowBookings: true,
    showAvailableSeats: true,
    allowCancellations: true,
    bookingNotifications: true,
    eventNotifications: true,
    maintenanceMode: false,
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem("eventbookAdminSettings");

    if (savedSettings) {
      try {
        setSettings({
          ...defaultSettings,
          ...JSON.parse(savedSettings),
        });
      } catch (error) {
        console.error("Invalid admin settings:", error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(
      "eventbookAdminSettings",
      JSON.stringify(settings)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const handleReset = () => {
    setSettings(defaultSettings);

    localStorage.setItem(
      "eventbookAdminSettings",
      JSON.stringify(defaultSettings)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  // SETTING SWITCH
  const SettingSwitch = ({
    name,
    checked,
    title,
    description,
    icon,
    danger = false,
  }) => {
    return (
      <div className={`setting-row ${danger ? "danger-setting" : ""}`}>
        <div className="setting-left">
          <div className={`setting-icon ${danger ? "danger-icon" : ""}`}>
            {icon}
          </div>

          <div className="setting-content">
            <div className="setting-title-row">
              <span className="setting-title">{title}</span>

              {danger && (
                <span className="warning-badge">
                  System
                </span>
              )}
            </div>

            <p className="setting-description">
              {description}
            </p>
          </div>
        </div>

        <label className="modern-switch">
          <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={handleChange}
          />

          <span className="switch-slider">
            <span className="switch-dot"></span>
          </span>
        </label>
      </div>
    );
  };

  return (
    <>
      <style>{`
        /* =========================================================
           EVENTBOOK ADMIN SETTINGS
           ========================================================= */

        .admin-settings-page {
          min-height: calc(100vh - 70px);
          background:
            radial-gradient(
              circle at top right,
              rgba(79, 70, 229, 0.06),
              transparent 28%
            ),
            #f7f8fc;
          padding: 32px;
        }

        .settings-container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
        }

        /* =========================================================
           PAGE HEADER
           ========================================================= */

        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 26px;
        }

        .header-left {
          min-width: 0;
        }

        .header-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 9px;
          color: #4f46e5;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4f46e5;
        }

        .header-left h2 {
          margin: 0;
          color: #111827;
          font-size: 30px;
          line-height: 1.2;
          font-weight: 750;
          letter-spacing: -0.02em;
        }

        .header-left p {
          margin: 8px 0 0;
          color: #667085;
          font-size: 14px;
          line-height: 1.6;
          max-width: 650px;
        }

        .settings-status {
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
          box-shadow: 0 3px 12px rgba(15, 23, 42, 0.03);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.10);
        }

        /* =========================================================
           SUCCESS ALERT
           ========================================================= */

        .success-alert {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 13px 16px;
          margin-bottom: 22px;
          border: 1px solid #b7efcf;
          border-radius: 13px;
          background: #f0fdf4;
          color: #166534;
          box-shadow: 0 4px 14px rgba(22, 101, 52, 0.04);
          animation: slideDown 0.25s ease;
        }

        .success-content {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: 0;
        }

        .success-icon {
          width: 29px;
          height: 29px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #22c55e;
          color: #fff;
          font-size: 14px;
          font-weight: 800;
        }

        .success-text strong {
          display: block;
          margin-bottom: 2px;
          font-size: 13px;
        }

        .success-text span {
          display: block;
          color: #4d7c5b;
          font-size: 12px;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-7px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* =========================================================
           MAIN GRID
           ========================================================= */

        .settings-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .settings-card {
          min-width: 0;
          overflow: hidden;
          border: 1px solid #e8ebf2;
          border-radius: 17px;
          background: #fff;
          box-shadow:
            0 5px 20px rgba(15, 23, 42, 0.035),
            0 1px 3px rgba(15, 23, 42, 0.025);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }

        .settings-card:hover {
          border-color: #dde1ea;
          box-shadow:
            0 9px 28px rgba(15, 23, 42, 0.06),
            0 2px 5px rgba(15, 23, 42, 0.03);
        }

        .settings-card.full-width {
          grid-column: 1 / -1;
        }

        /* =========================================================
           CARD HEADER
           ========================================================= */

        .card-header {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 19px 22px;
          border-bottom: 1px solid #eef0f4;
          background: linear-gradient(
            180deg,
            #ffffff 0%,
            #fcfcfd 100%
          );
        }

        .card-header-icon {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e4e7ff;
          border-radius: 12px;
          background: #f2f3ff;
          color: #4f46e5;
          font-size: 18px;
        }

        .card-header-content {
          min-width: 0;
        }

        .card-header h5 {
          margin: 0;
          color: #172033;
          font-size: 15px;
          line-height: 1.3;
          font-weight: 700;
        }

        .card-header p {
          margin: 4px 0 0;
          color: #98a2b3;
          font-size: 12px;
          line-height: 1.4;
        }

        .card-header-badge {
          margin-left: auto;
          flex-shrink: 0;
          padding: 5px 9px;
          border: 1px solid #e4e7ec;
          border-radius: 20px;
          background: #f9fafb;
          color: #667085;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        /* =========================================================
           CARD BODY
           ========================================================= */

        .card-body {
          padding: 23px 22px;
        }

        /* =========================================================
           FORM
           ========================================================= */

        .form-group {
          margin-bottom: 21px;
        }

        .form-group:last-child {
          margin-bottom: 0;
        }

        .form-label-custom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 8px;
          color: #344054;
          font-size: 12px;
          font-weight: 700;
        }

        .form-hint {
          color: #98a2b3;
          font-size: 10px;
          font-weight: 500;
        }

        .input-wrapper {
          position: relative;
        }

        .input-prefix {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #667085;
          font-size: 14px;
          pointer-events: none;
        }

        .custom-input,
        .custom-select {
          width: 100%;
          height: 46px;
          box-sizing: border-box;
          border: 1px solid #dfe3eb;
          border-radius: 10px;
          padding: 0 13px;
          outline: none;
          background: #fff;
          color: #273142;
          font-family: inherit;
          font-size: 13px;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .custom-input:hover,
        .custom-select:hover {
          border-color: #c9ced8;
        }

        .custom-input:focus,
        .custom-select:focus {
          border-color: #6366f1;
          background: #fff;
          box-shadow:
            0 0 0 3px rgba(99, 102, 241, 0.10);
        }

        .custom-input::placeholder {
          color: #a4acb9;
        }

        /* =========================================================
           SETTING ROWS
           ========================================================= */

        .setting-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 17px 0;
          border-bottom: 1px solid #eef0f4;
        }

        .setting-row:first-child {
          padding-top: 0;
        }

        .setting-row:last-child {
          padding-bottom: 0;
          border-bottom: none;
        }

        .setting-left {
          display: flex;
          align-items: center;
          gap: 13px;
          min-width: 0;
        }

        .setting-icon {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e7e9ff;
          border-radius: 11px;
          background: #f6f7ff;
          color: #4f46e5;
          font-size: 16px;
        }

        .setting-content {
          min-width: 0;
        }

        .setting-title-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 7px;
          margin-bottom: 3px;
        }

        .setting-title {
          color: #273142;
          font-size: 13px;
          line-height: 1.35;
          font-weight: 650;
        }

        .setting-description {
          max-width: 650px;
          margin: 0;
          color: #8a94a6;
          font-size: 11px;
          line-height: 1.55;
        }

        .warning-badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 7px;
          border: 1px solid #f3d7a2;
          border-radius: 20px;
          background: #fff8e8;
          color: #a16207;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
        }

        /* =========================================================
           MODERN SWITCH
           ========================================================= */

        .modern-switch {
          position: relative;
          width: 48px;
          height: 27px;
          flex-shrink: 0;
          cursor: pointer;
        }

        .modern-switch input {
          position: absolute;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
        }

        .switch-slider {
          position: absolute;
          inset: 0;
          border-radius: 30px;
          background: #d8dde6;
          box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.04);
          transition:
            background 0.25s ease,
            box-shadow 0.25s ease;
        }

        .switch-dot {
          position: absolute;
          top: 4px;
          left: 4px;
          width: 19px;
          height: 19px;
          border-radius: 50%;
          background: #fff;
          box-shadow:
            0 2px 5px rgba(15, 23, 42, 0.20),
            0 1px 2px rgba(15, 23, 42, 0.08);
          transition: transform 0.25s ease;
        }

        .modern-switch input:checked + .switch-slider {
          background: #4f46e5;
          box-shadow:
            0 0 0 3px rgba(79, 70, 229, 0.08);
        }

        .modern-switch input:checked + .switch-slider .switch-dot {
          transform: translateX(21px);
        }

        .modern-switch:hover .switch-slider {
          background: #cbd1dc;
        }

        .modern-switch:hover input:checked + .switch-slider {
          background: #4338ca;
        }

        /* =========================================================
           MAINTENANCE BOX
           ========================================================= */

        .maintenance-box {
          padding: 17px 18px;
          border: 1px solid #f2dfb5;
          border-radius: 13px;
          background:
            linear-gradient(
              135deg,
              #fffaf0 0%,
              #fffdf7 100%
            );
        }

        .maintenance-box .setting-row {
          border: none;
        }

        .maintenance-box .setting-icon {
          border-color: #f6dfac;
          background: #fff3d8;
          color: #b7791f;
        }

        .maintenance-info {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 12px;
          padding-top: 11px;
          border-top: 1px solid #f5e6c6;
          color: #94713a;
          font-size: 10px;
          line-height: 1.5;
        }

        /* =========================================================
           BOTTOM ACTIONS
           ========================================================= */

        .settings-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 22px;
          padding-bottom: 10px;
        }

        .reset-btn,
        .save-btn {
          min-width: 125px;
          height: 44px;
          padding: 0 20px;
          border-radius: 10px;
          font-family: inherit;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .reset-btn {
          border: 1px solid #dfe3e8;
          background: #fff;
          color: #596579;
        }

        .reset-btn:hover {
          border-color: #cfd4dc;
          background: #f9fafb;
          transform: translateY(-1px);
        }

        .save-btn {
          border: 1px solid #4f46e5;
          background: #4f46e5;
          color: #fff;
          box-shadow:
            0 5px 13px rgba(79, 70, 229, 0.18);
        }

        .save-btn:hover {
          border-color: #4338ca;
          background: #4338ca;
          transform: translateY(-1px);
          box-shadow:
            0 7px 16px rgba(79, 70, 229, 0.22);
        }

        .save-btn:active,
        .reset-btn:active {
          transform: translateY(0);
        }

        /* =========================================================
           TABLET
           ========================================================= */

        @media (max-width: 1000px) {
          .admin-settings-page {
            padding: 26px 22px;
          }

          .settings-grid {
            gap: 17px;
          }

          .card-header {
            padding: 18px;
          }

          .card-body {
            padding: 20px 18px;
          }
        }

        /* =========================================================
           MOBILE
           ========================================================= */

        @media (max-width: 760px) {
          .admin-settings-page {
            min-height: calc(100vh - 60px);
            padding: 20px 14px;
          }

          .settings-header {
            flex-direction: column;
            gap: 13px;
            margin-bottom: 21px;
          }

          .header-left h2 {
            font-size: 25px;
          }

          .header-left p {
            margin-top: 7px;
            font-size: 13px;
          }

          .settings-status {
            width: fit-content;
          }

          .settings-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .settings-card.full-width {
            grid-column: auto;
          }

          .card-header {
            padding: 17px;
          }

          .card-body {
            padding: 20px 17px;
          }

          .card-header-icon {
            width: 39px;
            height: 39px;
          }

          .card-header-badge {
            display: none;
          }

          .setting-row {
            gap: 12px;
            padding: 16px 0;
          }

          .setting-left {
            gap: 10px;
          }

          .setting-icon {
            width: 37px;
            height: 37px;
            border-radius: 10px;
            font-size: 15px;
          }

          .setting-title {
            font-size: 12px;
          }

          .setting-description {
            font-size: 10px;
            line-height: 1.5;
          }

          .modern-switch {
            width: 45px;
            height: 25px;
          }

          .switch-dot {
            width: 17px;
            height: 17px;
          }

          .modern-switch input:checked + .switch-slider .switch-dot {
            transform: translateX(20px);
          }

          .settings-actions {
            width: 100%;
            gap: 8px;
          }

          .reset-btn,
          .save-btn {
            flex: 1;
            min-width: 0;
          }
        }

        /* =========================================================
           SMALL MOBILE
           ========================================================= */

        @media (max-width: 430px) {
          .admin-settings-page {
            padding: 17px 10px;
          }

          .header-left h2 {
            font-size: 22px;
          }

          .header-left p {
            font-size: 12px;
          }

          .settings-status {
            font-size: 10px;
            padding: 8px 11px;
          }

          .card-header {
            padding: 15px;
            gap: 10px;
          }

          .card-body {
            padding: 18px 15px;
          }

          .card-header-icon {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            font-size: 16px;
          }

          .card-header h5 {
            font-size: 13px;
          }

          .card-header p {
            font-size: 10px;
          }

          .setting-row {
            align-items: flex-start;
          }

          .setting-left {
            align-items: flex-start;
          }

          .setting-icon {
            width: 34px;
            height: 34px;
          }

          .modern-switch {
            margin-top: 3px;
          }

          .maintenance-box {
            padding: 14px;
          }

          .success-alert {
            padding: 11px 12px;
          }

          .success-text strong {
            font-size: 12px;
          }

          .success-text span {
            font-size: 10px;
          }

          .settings-actions {
            flex-direction: column-reverse;
          }

          .reset-btn,
          .save-btn {
            width: 100%;
            flex: none;
          }
        }
      `}</style>

      <div className="admin-settings-page">
        <div className="settings-container">

          {/* HEADER */}

          <div className="settings-header">
            <div className="header-left">

              <div className="header-eyebrow">
                <span className="eyebrow-dot"></span>
                Administration
              </div>

              <h2>Admin Settings</h2>

              <p>
                Configure your EventBook platform, booking preferences,
                notifications, and system controls.
              </p>

            </div>

            <div className="settings-status">
              <span className="status-dot"></span>
              Platform Active
            </div>
          </div>

          {/* SUCCESS MESSAGE */}

          {saved && (
            <div className="success-alert">
              <div className="success-content">

                <span className="success-icon">
                  ✓
                </span>

                <div className="success-text">
                  <strong>Settings saved successfully</strong>

                  <span>
                    Your EventBook preferences have been updated.
                  </span>
                </div>

              </div>
            </div>
          )}

          {/* SETTINGS GRID */}

          <div className="settings-grid">

            {/* GENERAL SETTINGS */}

            <div className="settings-card">

              <div className="card-header">

                <div className="card-header-icon">
                  ⚙
                </div>

                <div className="card-header-content">
                  <h5>General Settings</h5>

                  <p>
                    Basic platform configuration
                  </p>
                </div>

                <span className="card-header-badge">
                  General
                </span>

              </div>

              <div className="card-body">

                <div className="form-group">

                  <label className="form-label-custom">
                    <span>Platform Name</span>

                    <span className="form-hint">
                      Public name
                    </span>
                  </label>

                  <input
                    type="text"
                    name="platformName"
                    value={settings.platformName}
                    onChange={handleChange}
                    className="custom-input"
                    placeholder="EventBook"
                  />

                </div>

                <div className="form-group">

                  <label className="form-label-custom">
                    <span>Currency</span>

                    <span className="form-hint">
                      Booking currency
                    </span>
                  </label>

                  <select
                    name="currency"
                    value={settings.currency}
                    onChange={handleChange}
                    className="custom-select"
                  >
                    <option value="INR">
                      INR (₹) — Indian Rupee
                    </option>

                    <option value="USD">
                      USD ($) — US Dollar
                    </option>

                    <option value="EUR">
                      EUR (€) — Euro
                    </option>

                    <option value="GBP">
                      GBP (£) — British Pound
                    </option>
                  </select>

                </div>

              </div>
            </div>

            {/* BOOKING SETTINGS */}

            <div className="settings-card">

              <div className="card-header">

                <div className="card-header-icon">
                  🎟
                </div>

                <div className="card-header-content">
                  <h5>Booking Settings</h5>

                  <p>
                    Control event booking rules
                  </p>
                </div>

                <span className="card-header-badge">
                  Booking
                </span>

              </div>

              <div className="card-body">

                <SettingSwitch
                  name="allowBookings"
                  checked={settings.allowBookings}
                  icon="🎟"
                  title="Allow Bookings"
                  description="Users can book available seats for active events."
                />

                <SettingSwitch
                  name="showAvailableSeats"
                  checked={settings.showAvailableSeats}
                  icon="💺"
                  title="Show Available Seats"
                  description="Display remaining seat availability to users."
                />

                <SettingSwitch
                  name="allowCancellations"
                  checked={settings.allowCancellations}
                  icon="↩"
                  title="Allow Cancellations"
                  description="Allow users to cancel their confirmed bookings."
                />

              </div>
            </div>

            {/* NOTIFICATION SETTINGS */}

            <div className="settings-card full-width">

              <div className="card-header">

                <div className="card-header-icon">
                  🔔
                </div>

                <div className="card-header-content">
                  <h5>Notification Settings</h5>

                  <p>
                    Manage EventBook notification preferences
                  </p>
                </div>

                <span className="card-header-badge">
                  Notifications
                </span>

              </div>

              <div className="card-body">

                <SettingSwitch
                  name="bookingNotifications"
                  checked={settings.bookingNotifications}
                  icon="🔔"
                  title="Booking Notifications"
                  description="Receive notifications related to new bookings, cancellations, and booking activity."
                />

                <SettingSwitch
                  name="eventNotifications"
                  checked={settings.eventNotifications}
                  icon="📅"
                  title="Event Notifications"
                  description="Receive notifications related to event creation, updates, and event activity."
                />

              </div>
            </div>

            {/* SYSTEM SETTINGS */}

            <div className="settings-card full-width">

              <div className="card-header">

                <div className="card-header-icon">
                  🛠
                </div>

                <div className="card-header-content">
                  <h5>System Settings</h5>

                  <p>
                    Control the overall EventBook platform status
                  </p>
                </div>

                <span className="card-header-badge">
                  System
                </span>

              </div>

              <div className="card-body">

                <div className="maintenance-box">

                  <SettingSwitch
                    name="maintenanceMode"
                    checked={settings.maintenanceMode}
                    icon="🛠"
                    title="Maintenance Mode"
                    description="Temporarily disable normal platform activity while system maintenance is being performed."
                    danger
                  />

                  <div className="maintenance-info">

                    <span>ⓘ</span>

                    <span>
                      Enable this option only when you need to temporarily
                      restrict normal platform activity.
                    </span>

                  </div>

                </div>

              </div>
            </div>

          </div>

          {/* ACTION BUTTONS */}

          <div className="settings-actions">

            <button
              type="button"
              className="reset-btn"
              onClick={handleReset}
            >
              Reset to Default
            </button>

            <button
              type="button"
              className="save-btn"
              onClick={handleSave}
            >
              ✓ &nbsp; Save Settings
            </button>

          </div>

        </div>
      </div>
    </>
  );
}

export default AdminSetting;