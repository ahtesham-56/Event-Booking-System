import { useState } from "react";
import {
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";

import { resetPassword } from "../services/userService";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!token) {
      setError(
        "Invalid or missing password reset token."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await resetPassword(
        token,
        password,
        confirmPassword
      );

      setMessage(
        response?.message ||
          "Your password has been reset successfully."
      );

      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(
        "Reset password error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`

        /* =========================================================
           EVENTBOOK RESET PASSWORD PAGE
           ========================================================= */

        .eventbook-reset-page {
          min-height: calc(100vh - 70px);
          padding: 45px 18px;
          display: flex;
          align-items: center;
          justify-content: center;

          background:
            radial-gradient(
              circle at 8% 12%,
              rgba(37, 99, 235, 0.10),
              transparent 30%
            ),
            radial-gradient(
              circle at 92% 88%,
              rgba(79, 70, 229, 0.09),
              transparent 30%
            ),
            #f8fafc;
        }

        .eventbook-reset-container {
          width: 100%;
          max-width: 1000px;
        }

        .eventbook-reset-card {
          width: 100%;
          display: grid;
          grid-template-columns: 43% 57%;

          background: #ffffff;

          border: 1px solid #e2e8f0;
          border-radius: 26px;

          overflow: hidden;

          box-shadow:
            0 25px 70px rgba(15, 23, 42, 0.10);
        }

        /* =========================================================
           LEFT BRAND PANEL
           ========================================================= */

        .reset-brand-panel {
          min-height: 610px;
          padding: 48px;

          position: relative;
          overflow: hidden;

          display: flex;
          flex-direction: column;
          justify-content: space-between;

          color: #ffffff;

          background:
            radial-gradient(
              circle at 85% 12%,
              rgba(96, 165, 250, 0.30),
              transparent 30%
            ),
            radial-gradient(
              circle at 8% 92%,
              rgba(129, 140, 248, 0.25),
              transparent 32%
            ),
            linear-gradient(
              145deg,
              #1d4ed8,
              #2563eb 55%,
              #4338ca
            );
        }

        .reset-brand-panel::before {
          content: "";

          position: absolute;

          width: 280px;
          height: 280px;

          border-radius: 50%;

          right: -120px;
          top: -100px;

          background:
            rgba(255, 255, 255, 0.08);
        }

        .reset-brand-panel::after {
          content: "";

          position: absolute;

          width: 230px;
          height: 230px;

          border-radius: 50%;

          left: -110px;
          bottom: -110px;

          background:
            rgba(255, 255, 255, 0.07);
        }

        .reset-brand-content {
          position: relative;
          z-index: 2;
        }

        /* =========================================================
           LOGO
           ========================================================= */

        .reset-logo {
          display: flex;
          align-items: center;
          gap: 12px;

          margin-bottom: 58px;
        }

        .reset-logo-icon {
          width: 48px;
          height: 48px;

          border-radius: 14px;

          display: flex;
          align-items: center;
          justify-content: center;

          background:
            rgba(255, 255, 255, 0.15);

          border:
            1px solid rgba(255, 255, 255, 0.22);

          font-size: 21px;
          font-weight: 800;

          box-shadow:
            0 8px 22px rgba(0, 0, 0, 0.12);
        }

        .reset-logo-text {
          font-size: 23px;
          font-weight: 800;

          letter-spacing: -0.5px;
        }

        /* =========================================================
           BRAND CONTENT
           ========================================================= */

        .reset-brand-title {
          margin: 0 0 18px;

          font-size: 38px;
          line-height: 1.15;

          font-weight: 800;

          letter-spacing: -1px;
        }

        .reset-brand-description {
          margin: 0 0 32px;

          max-width: 350px;

          color:
            rgba(255, 255, 255, 0.82);

          font-size: 14px;
          line-height: 1.75;
        }

        /* =========================================================
           SECURITY ITEMS
           ========================================================= */

        .reset-security-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .reset-security-item {
          display: flex;
          align-items: center;
          gap: 12px;

          color:
            rgba(255, 255, 255, 0.93);

          font-size: 13px;
          font-weight: 600;
        }

        .reset-security-icon {
          width: 35px;
          height: 35px;

          flex-shrink: 0;

          border-radius: 10px;

          display: flex;
          align-items: center;
          justify-content: center;

          background:
            rgba(255, 255, 255, 0.12);

          border:
            1px solid rgba(255, 255, 255, 0.08);

          font-size: 15px;
        }

        .reset-brand-footer {
          position: relative;
          z-index: 2;

          color:
            rgba(255, 255, 255, 0.60);

          font-size: 12px;
        }

        /* =========================================================
           RIGHT FORM PANEL
           ========================================================= */

        .reset-form-panel {
          min-height: 610px;
          padding: 55px;

          display: flex;
          align-items: center;
        }

        .reset-form-wrapper {
          width: 100%;
          max-width: 440px;
          margin: 0 auto;
        }

        .reset-welcome {
          margin-bottom: 9px;

          color: #2563eb;

          font-size: 12px;
          font-weight: 800;

          letter-spacing: 0.8px;
          text-transform: uppercase;
        }

        .reset-title {
          margin: 0 0 10px;

          color: #0f172a;

          font-size: 34px;
          line-height: 1.2;

          font-weight: 800;

          letter-spacing: -0.8px;
        }

        .reset-subtitle {
          margin: 0 0 30px;

          color: #64748b;

          font-size: 14px;
          line-height: 1.7;
        }

        /* =========================================================
           ALERTS
           ========================================================= */

        .reset-error {
          display: flex;
          align-items: flex-start;
          gap: 10px;

          margin-bottom: 22px;
          padding: 13px 14px;

          border:
            1px solid #fecaca;

          border-radius: 12px;

          background: #fef2f2;
          color: #b91c1c;

          font-size: 13px;
          line-height: 1.5;
        }

        .reset-error-icon {
          width: 22px;
          height: 22px;

          flex-shrink: 0;

          border-radius: 50%;

          display: flex;
          align-items: center;
          justify-content: center;

          background: #fee2e2;

          font-size: 12px;
          font-weight: 800;
        }

        .reset-success {
          display: flex;
          align-items: flex-start;
          gap: 10px;

          margin-bottom: 22px;
          padding: 13px 14px;

          border:
            1px solid #bbf7d0;

          border-radius: 12px;

          background: #f0fdf4;
          color: #15803d;

          font-size: 13px;
          line-height: 1.5;
        }

        .reset-success-icon {
          width: 22px;
          height: 22px;

          flex-shrink: 0;

          border-radius: 50%;

          display: flex;
          align-items: center;
          justify-content: center;

          background: #dcfce7;

          font-size: 12px;
          font-weight: 800;
        }

        /* =========================================================
           FORM
           ========================================================= */

        .reset-field {
          margin-bottom: 20px;
        }

        .reset-label {
          display: block;

          margin-bottom: 8px;

          color: #334155;

          font-size: 13px;
          font-weight: 700;
        }

        .reset-input-wrapper {
          position: relative;
        }

        .reset-input-icon {
          position: absolute;

          left: 15px;
          top: 50%;

          transform:
            translateY(-50%);

          color: #94a3b8;

          font-size: 16px;

          pointer-events: none;

          z-index: 2;
        }

        .reset-input {
          width: 100%;
          min-height: 52px;

          padding:
            12px 48px 12px 44px;

          border:
            1px solid #dbe2ea;

          border-radius: 12px;

          outline: none;

          background: #ffffff;
          color: #0f172a;

          font-size: 14px;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .reset-input::placeholder {
          color: #a0aec0;
        }

        .reset-input:hover {
          border-color: #cbd5e1;
        }

        .reset-input:focus {
          border-color: #2563eb;

          box-shadow:
            0 0 0 4px
            rgba(37, 99, 235, 0.10);
        }

        .reset-input:disabled {
          background: #f8fafc;
          cursor: not-allowed;
        }

        /* =========================================================
           PASSWORD TOGGLE
           ========================================================= */

        .reset-password-toggle {
          position: absolute;

          right: 12px;
          top: 50%;

          transform:
            translateY(-50%);

          width: 32px;
          height: 32px;

          border: none;
          border-radius: 8px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: transparent;
          color: #64748b;

          font-size: 14px;

          cursor: pointer;

          transition:
            background 0.2s ease,
            color 0.2s ease;
        }

        .reset-password-toggle:hover {
          background: #f1f5f9;
          color: #2563eb;
        }

        /* =========================================================
           PASSWORD HINT
           ========================================================= */

        .reset-password-hint {
          display: flex;
          align-items: center;
          gap: 7px;

          margin-top: 8px;

          color: #94a3b8;

          font-size: 11px;
        }

        .reset-password-hint-dot {
          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: #94a3b8;
        }

        /* =========================================================
           SUBMIT BUTTON
           ========================================================= */

        .reset-submit-button {
          width: 100%;
          min-height: 52px;

          margin-top: 4px;

          border: none;
          border-radius: 12px;

          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #1d4ed8
            );

          color: #ffffff;

          font-size: 14px;
          font-weight: 800;

          box-shadow:
            0 10px 25px
            rgba(37, 99, 235, 0.22);

          cursor: pointer;

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            opacity 0.2s ease;
        }

        .reset-submit-button:hover:not(:disabled) {
          transform:
            translateY(-2px);

          box-shadow:
            0 14px 30px
            rgba(37, 99, 235, 0.28);
        }

        .reset-submit-button:active:not(:disabled) {
          transform:
            translateY(0);
        }

        .reset-submit-button:disabled {
          opacity: 0.70;
          cursor: not-allowed;

          box-shadow: none;
        }

        /* =========================================================
           SPINNER
           ========================================================= */

        .reset-spinner {
          width: 18px;
          height: 18px;

          border:
            2px solid
            rgba(255, 255, 255, 0.40);

          border-top-color: #ffffff;

          border-radius: 50%;

          animation:
            resetSpin 0.7s linear infinite;
        }

        @keyframes resetSpin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =========================================================
           BACK TO LOGIN
           ========================================================= */

        .reset-back-wrapper {
          text-align: center;

          margin-top: 24px;
        }

        .reset-back-link {
          color: #64748b;

          font-size: 13px;
          font-weight: 600;

          text-decoration: none;

          transition:
            color 0.2s ease;
        }

        .reset-back-link:hover {
          color: #2563eb;
        }

        /* =========================================================
           SECURITY NOTE
           ========================================================= */

        .reset-security-note {
          display: flex;
          align-items: flex-start;
          gap: 10px;

          margin-top: 26px;
          padding: 13px 14px;

          border:
            1px solid #e2e8f0;

          border-radius: 12px;

          background: #f8fafc;

          color: #64748b;

          font-size: 11px;
          line-height: 1.55;
        }

        .reset-security-note-icon {
          color: #2563eb;

          font-size: 14px;

          flex-shrink: 0;
        }

        /* =========================================================
           TABLET
           ========================================================= */

        @media (max-width: 991.98px) {

          .eventbook-reset-page {
            padding:
              30px 15px;
          }

          .eventbook-reset-card {
            grid-template-columns:
              42% 58%;
          }

          .reset-brand-panel {
            min-height: 570px;
            padding: 38px;
          }

          .reset-form-panel {
            min-height: 570px;
            padding: 40px;
          }

          .reset-brand-title {
            font-size: 32px;
          }

          .reset-title {
            font-size: 30px;
          }

        }

        /* =========================================================
           MOBILE
           ========================================================= */

        @media (max-width: 767.98px) {

          .eventbook-reset-page {
            min-height: 100vh;

            padding:
              18px 12px;
          }

          .eventbook-reset-card {
            grid-template-columns: 1fr;

            border-radius: 20px;
          }

          /* Mobile brand header */

          .reset-brand-panel {
            min-height: auto;

            padding:
              23px 22px;

            display: block;
          }

          .reset-logo {
            margin-bottom: 0;
          }

          .reset-logo-icon {
            width: 42px;
            height: 42px;

            font-size: 19px;
          }

          .reset-logo-text {
            font-size: 20px;
          }

          .reset-brand-title,
          .reset-brand-description,
          .reset-security-list,
          .reset-brand-footer {
            display: none;
          }

          /* Mobile form */

          .reset-form-panel {
            min-height: auto;

            padding:
              32px 22px 35px;
          }

          .reset-form-wrapper {
            max-width: none;
          }

          .reset-title {
            font-size: 28px;
          }

          .reset-subtitle {
            font-size: 13px;

            margin-bottom: 25px;
          }

        }

        /* =========================================================
           SMALL MOBILE
           ========================================================= */

        @media (max-width: 400px) {

          .eventbook-reset-page {
            padding:
              10px 8px;
          }

          .eventbook-reset-card {
            border-radius: 17px;
          }

          .reset-brand-panel {
            padding:
              20px 18px;
          }

          .reset-form-panel {
            padding:
              27px 18px 30px;
          }

          .reset-title {
            font-size: 26px;
          }

          .reset-input {
            min-height: 49px;
          }

          .reset-submit-button {
            min-height: 50px;
          }

        }

      `}</style>

      <div className="eventbook-reset-page">

        <div className="eventbook-reset-container">

          <div className="eventbook-reset-card">

            {/* =====================================================
                LEFT BRAND PANEL
                ===================================================== */}

            <div className="reset-brand-panel">

              <div className="reset-brand-content">

                <div className="reset-logo">

                  <div className="reset-logo-icon">
                    E
                  </div>

                  <div className="reset-logo-text">
                    EventBook
                  </div>

                </div>

                <h1 className="reset-brand-title">
                  Create a
                  <br />
                  new password.
                </h1>

                <p className="reset-brand-description">
                  Choose a strong new password to
                  secure your EventBook account and
                  continue enjoying your events.
                </p>

                <div className="reset-security-list">

                  <div className="reset-security-item">

                    <div className="reset-security-icon">
                      🔒
                    </div>

                    <span>
                      Secure password recovery
                    </span>

                  </div>

                  <div className="reset-security-item">

                    <div className="reset-security-icon">
                      ✓
                    </div>

                    <span>
                      Protected account access
                    </span>

                  </div>

                  <div className="reset-security-item">

                    <div className="reset-security-icon">
                      •
                    </div>

                    <span>
                      Minimum 6 character password
                    </span>

                  </div>

                </div>

              </div>

              <div className="reset-brand-footer">
                © 2026 EventBook. All rights reserved.
              </div>

            </div>

            {/* =====================================================
                RIGHT FORM PANEL
                ===================================================== */}

            <div className="reset-form-panel">

              <div className="reset-form-wrapper">

                <div className="reset-welcome">
                  Account Recovery
                </div>

                <h2 className="reset-title">
                  Reset Password
                </h2>

                <p className="reset-subtitle">
                  Create a new password for your
                  EventBook account. Make sure it is
                  at least 6 characters long.
                </p>

                {/* ERROR */}

                {error && (
                  <div
                    className="reset-error"
                    role="alert"
                  >

                    <div className="reset-error-icon">
                      !
                    </div>

                    <div>
                      {error}
                    </div>

                  </div>
                )}

                {/* SUCCESS */}

                {message && (
                  <div
                    className="reset-success"
                    role="alert"
                  >

                    <div className="reset-success-icon">
                      ✓
                    </div>

                    <div>

                      <div>
                        {message}
                      </div>

                      <div className="small mt-1">
                        Redirecting to login...
                      </div>

                    </div>

                  </div>
                )}

                <form onSubmit={handleSubmit}>

                  {/* =================================================
                      NEW PASSWORD
                      ================================================= */}

                  <div className="reset-field">

                    <label
                      htmlFor="reset-password"
                      className="reset-label"
                    >
                      New Password
                    </label>

                    <div className="reset-input-wrapper">

                      <span className="reset-input-icon">
                        🔑
                      </span>

                      <input
                        id="reset-password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        className="reset-input"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => {
                          setPassword(
                            e.target.value
                          );

                          if (error) {
                            setError("");
                          }
                        }}
                        minLength="6"
                        autoComplete="new-password"
                        disabled={loading || !!message}
                        required
                      />

                      <button
                        type="button"
                        className="reset-password-toggle"
                        onClick={() =>
                          setShowPassword(
                            !showPassword
                          )
                        }
                        disabled={
                          loading || !!message
                        }
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? "◉" : "○"}
                      </button>

                    </div>

                    <div className="reset-password-hint">

                      <span className="reset-password-hint-dot" />

                      <span>
                        Minimum 6 characters
                      </span>

                    </div>

                  </div>

                  {/* =================================================
                      CONFIRM PASSWORD
                      ================================================= */}

                  <div className="reset-field">

                    <label
                      htmlFor="reset-confirm-password"
                      className="reset-label"
                    >
                      Confirm Password
                    </label>

                    <div className="reset-input-wrapper">

                      <span className="reset-input-icon">
                        🔐
                      </span>

                      <input
                        id="reset-confirm-password"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        className="reset-input"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(
                            e.target.value
                          );

                          if (error) {
                            setError("");
                          }
                        }}
                        minLength="6"
                        autoComplete="new-password"
                        disabled={loading || !!message}
                        required
                      />

                      <button
                        type="button"
                        className="reset-password-toggle"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                        disabled={
                          loading || !!message
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword
                          ? "◉"
                          : "○"}
                      </button>

                    </div>

                  </div>

                  {/* =================================================
                      SUBMIT
                      ================================================= */}

                  <button
                    type="submit"
                    className="reset-submit-button"
                    disabled={
                      loading || !!message
                    }
                  >

                    {loading ? (
                      <>
                        <span
                          className="reset-spinner"
                          aria-hidden="true"
                        />

                        <span>
                          Resetting Password...
                        </span>
                      </>
                    ) : (
                      <>
                        <span>
                          Reset Password
                        </span>

                        <span>
                          →
                        </span>
                      </>
                    )}

                  </button>

                  {/* =================================================
                      SECURITY NOTE
                      ================================================= */}

                  <div className="reset-security-note">

                    <span className="reset-security-note-icon">
                      🔒
                    </span>

                    <span>
                      Your new password is securely
                      encrypted before it is stored.
                    </span>

                  </div>

                  {/* =================================================
                      BACK TO LOGIN
                      ================================================= */}

                  <div className="reset-back-wrapper">

                    <Link
                      to="/login"
                      className="reset-back-link"
                    >
                      ← Back to Login
                    </Link>

                  </div>

                </form>

              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}

export default ResetPassword;

