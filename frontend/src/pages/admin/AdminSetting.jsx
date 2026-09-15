
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

  const SettingSwitch = ({
    name,
    checked,
    title,
    description,
  }) => (
    <div className="setting-row">
      <div className="setting-info">
        <div className="setting-icon">
          {name === "allowBookings" && "🎟️"}
          {name === "showAvailableSeats" && "💺"}
          {name === "allowCancellations" && "↩️"}
          {name === "bookingNotifications" && "🔔"}
          {name === "eventNotifications" && "📅"}
          {name === "maintenanceMode" && "🛠️"}
        </div>

        <div>
          <div className="setting-title">{title}</div>
          <div className="setting-description">
            {description}
          </div>
        </div>
      </div>

      <label className="modern-switch">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={handleChange}
        />
        <span className="switch-slider"></span>
      </label>
    </div>
  );

  return (
    <>
      <style>{`
        .admin-settings-page {
          min-height: calc(100vh - 70px);
          background: #f6f8fc;
          padding: 30px;
        }

        .settings-container {
          max-width: 1150px;
          margin: 0 auto;
        }

        /* HEADER */

        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
        }

        .header-left h2 {
          font-size: 28px;
          font-weight: 700;
          color: #172033;
          margin-bottom: 6px;
        }

        .header-left p {
          color: #7a8499;
          margin: 0;
          font-size: 14px;
        }

        .settings-badge {
          background: #eef2ff;
          color: #4f46e5;
          border: 1px solid #e0e7ff;
          padding: 9px 15px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 600;
        }

        /* SUCCESS */

        .success-alert {
          background: #ecfdf3;
          border: 1px solid #b7efcf;
          color: #137a45;
          border-radius: 12px;
          padding: 13px 17px;
          margin-bottom: 22px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 500;
        }

        .success-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #22c55e;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 13px;
          font-weight: bold;
        }

        /* MAIN GRID */

        .settings-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
        }

        .settings-card {
          background: white;
          border: 1px solid #e8ebf2;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 18px rgba(30, 41, 59, 0.04);
        }

        .settings-card.full-width {
          grid-column: 1 / -1;
        }

        .card-header {
          padding: 21px 24px;
          border-bottom: 1px solid #edf0f5;
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .card-header-icon {
          width: 40px;
          height: 40px;
          border-radius: 11px;
          background: #eef2ff;
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 19px;
        }

        .card-header h5 {
          margin: 0;
          color: #172033;
          font-size: 16px;
          font-weight: 700;
        }

        .card-header p {
          margin: 3px 0 0;
          color: #8a94a6;
          font-size: 12px;
        }

        .card-body {
          padding: 23px 24px;
        }

        /* FORM */

        .form-label-custom {
          display: block;
          color: #344054;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .custom-input,
        .custom-select {
          width: 100%;
          height: 46px;
          border: 1px solid #dfe3eb;
          border-radius: 9px;
          padding: 0 13px;
          font-size: 14px;
          color: #273142;
          background: #fff;
          outline: none;
          transition: 0.2s;
        }

        .custom-input:focus,
        .custom-select:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        /* SETTING ROW */

        .setting-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 17px 0;
          border-bottom: 1px solid #edf0f4;
          gap: 20px;
        }

        .setting-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .setting-row:first-child {
          padding-top: 0;
        }

        .setting-info {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .setting-icon {
          width: 39px;
          height: 39px;
          flex-shrink: 0;
          background: #f5f6ff;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
        }

        .setting-title {
          color: #273142;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 3px;
        }

        .setting-description {
          color: #8a94a6;
          font-size: 12px;
          line-height: 1.5;
        }

        /* SWITCH */

        .modern-switch {
          position: relative;
          width: 46px;
          height: 25px;
          flex-shrink: 0;
        }

        .modern-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .switch-slider {
          position: absolute;
          cursor: pointer;
          inset: 0;
          background: #d7dce5;
          border-radius: 30px;
          transition: 0.25s;
        }

        .switch-slider::before {
          content: "";
          position: absolute;
          width: 19px;
          height: 19px;
          left: 3px;
          top: 3px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
          transition: 0.25s;
        }

        .modern-switch input:checked + .switch-slider {
          background: #4f46e5;
        }

        .modern-switch input:checked + .switch-slider::before {
          transform: translateX(21px);
        }

        /* MAINTENANCE */

        .maintenance-box {
          background: #fffaf0;
          border: 1px solid #f8dfaa;
          border-radius: 11px;
          padding: 16px;
        }

        .maintenance-box .setting-icon {
          background: #fff3d6;
        }

        /* FOOTER ACTIONS */

        .settings-actions {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 10px;
          margin-top: 24px;
          padding-bottom: 10px;
        }

        .reset-btn,
        .save-btn {
          height: 44px;
          padding: 0 22px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }

        .reset-btn {
          background: white;
          border: 1px solid #dce1e8;
          color: #596579;
        }

        .reset-btn:hover {
          background: #f8f9fb;
        }

        .save-btn {
          border: none;
          background: #4f46e5;
          color: white;
          box-shadow: 0 4px 10px rgba(79, 70, 229, 0.18);
        }

        .save-btn:hover {
          background: #4338ca;
          transform: translateY(-1px);
        }

        /* RESPONSIVE */

        @media (max-width: 900px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }

          .settings-card.full-width {
            grid-column: auto;
          }
        }

        @media (max-width: 600px) {
          .admin-settings-page {
            padding: 18px 12px;
          }

          .settings-header {
            align-items: flex-start;
          }

          .settings-badge {
            display: none;
          }

          .header-left h2 {
            font-size: 23px;
          }

          .card-body,
          .card-header {
            padding: 18px;
          }

          .setting-description {
            max-width: 220px;
          }

          .settings-actions {
            width: 100%;
          }

          .reset-btn,
          .save-btn {
            flex: 1;
          }
        }
      `}</style>

      <div className="admin-settings-page">
        <div className="settings-container">

          {/* HEADER */}

          <div className="settings-header">
            <div className="header-left">
              <h2>Admin Settings</h2>
              <p>
                Configure your EventBook platform and manage system preferences.
              </p>
            </div>

            <div className="settings-badge">
              ⚙️ Platform Settings
            </div>
          </div>

          {/* SUCCESS */}

          {saved && (
            <div className="success-alert">
              <span className="success-icon">✓</span>
              <span>Settings saved successfully.</span>
            </div>
          )}

          <div className="settings-grid">

            {/* GENERAL */}

            <div className="settings-card">
              <div className="card-header">
                <div className="card-header-icon">
                  ⚙️
                </div>

                <div>
                  <h5>General Settings</h5>
                  <p>Basic platform configuration</p>
                </div>
              </div>

              <div className="card-body">
                <div className="mb-4">
                  <label className="form-label-custom">
                    Platform Name
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

                <div>
                  <label className="form-label-custom">
                    Currency
                  </label>

                  <select
                    name="currency"
                    value={settings.currency}
                    onChange={handleChange}
                    className="custom-select"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* BOOKING */}

            <div className="settings-card">
              <div className="card-header">
                <div className="card-header-icon">
                  🎟️
                </div>

                <div>
                  <h5>Booking Settings</h5>
                  <p>Control event booking rules</p>
                </div>
              </div>

              <div className="card-body">

                <SettingSwitch
                  name="allowBookings"
                  checked={settings.allowBookings}
                  title="Allow Bookings"
                  description="Users can book available event seats."
                />

                <SettingSwitch
                  name="showAvailableSeats"
                  checked={settings.showAvailableSeats}
                  title="Show Available Seats"
                  description="Display remaining seats to users."
                />

                <SettingSwitch
                  name="allowCancellations"
                  checked={settings.allowCancellations}
                  title="Allow Cancellations"
                  description="Users can cancel confirmed bookings."
                />

              </div>
            </div>

            {/* NOTIFICATIONS */}

            <div className="settings-card full-width">
              <div className="card-header">
                <div className="card-header-icon">
                  🔔
                </div>

                <div>
                  <h5>Notification Settings</h5>
                  <p>Manage EventBook notification preferences</p>
                </div>
              </div>

              <div className="card-body">

                <SettingSwitch
                  name="bookingNotifications"
                  checked={settings.bookingNotifications}
                  title="Booking Notifications"
                  description="Receive notifications related to booking activity."
                />

                <SettingSwitch
                  name="eventNotifications"
                  checked={settings.eventNotifications}
                  title="Event Notifications"
                  description="Receive notifications related to event activity."
                />

              </div>
            </div>

            {/* SYSTEM */}

            <div className="settings-card full-width">
              <div className="card-header">
                <div className="card-header-icon">
                  🛠️
                </div>

                <div>
                  <h5>System Settings</h5>
                  <p>Control the overall EventBook platform status</p>
                </div>
              </div>

              <div className="card-body">

                <div className="maintenance-box">
                  <SettingSwitch
                    name="maintenanceMode"
                    checked={settings.maintenanceMode}
                    title="Maintenance Mode"
                    description="Temporarily disable normal platform activity."
                  />
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
              Reset
            </button>

            <button
              type="button"
              className="save-btn"
              onClick={handleSave}
            >
              ✓ Save Settings
            </button>

          </div>

        </div>
      </div>
    </>
  );
}

export default AdminSetting;

