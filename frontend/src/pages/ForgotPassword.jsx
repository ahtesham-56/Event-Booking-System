import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/userService";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [resetUrl, setResetUrl] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================================================
     HANDLE SUBMIT
     ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSubmitted(false);
    setResetUrl("");

    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    setLoading(true);

    try {
      const data = await forgotPassword(email.trim());

      setSubmitted(true);

      /*
        Development mode:
        Backend returns resetUrl because email service
        is not connected yet.
      */
      if (data?.resetUrl) {
        setResetUrl(data.resetUrl);
      }
    } catch (error) {
      console.error("FORGOT PASSWORD ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Unable to process your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     RESET FORM
     ========================================================= */

  const handleTryAgain = () => {
    setSubmitted(false);
    setResetUrl("");
    setError("");
  };

  return (
    <>
      <style>{`
        /* =====================================================
           FORGOT PASSWORD PAGE
           ===================================================== */

        .eventbook-forgot-page {
          min-height: calc(100vh - 70px);

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 45px 15px;

          background:
            radial-gradient(
              circle at 10% 10%,
              rgba(37, 99, 235, 0.10),
              transparent 30%
            ),
            radial-gradient(
              circle at 90% 90%,
              rgba(99, 102, 241, 0.10),
              transparent 30%
            ),
            #f8fafc;
        }

        .eventbook-forgot-container {
          width: 100%;
          max-width: 1000px;

          margin: 0 auto;
        }

        /* =====================================================
           MAIN CARD
           ===================================================== */

        .eventbook-forgot-card {
          display: grid;

          grid-template-columns: 42% 58%;

          background: #ffffff;

          border: 1px solid #e2e8f0;

          border-radius: 26px;

          overflow: hidden;

          box-shadow:
            0 25px 70px rgba(15, 23, 42, 0.10);
        }

        /* =====================================================
           LEFT PANEL
           ===================================================== */

        .forgot-brand-panel {
          min-height: 590px;

          padding: 48px;

          color: #ffffff;

          display: flex;

          flex-direction: column;

          justify-content: space-between;

          position: relative;

          overflow: hidden;

          background:
            radial-gradient(
              circle at 85% 15%,
              rgba(96, 165, 250, 0.30),
              transparent 30%
            ),
            radial-gradient(
              circle at 10% 90%,
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

        .forgot-brand-panel::before {
          content: "";

          position: absolute;

          width: 260px;
          height: 260px;

          border-radius: 50%;

          right: -100px;
          top: -90px;

          background: rgba(255, 255, 255, 0.08);
        }

        .forgot-brand-panel::after {
          content: "";

          position: absolute;

          width: 220px;
          height: 220px;

          border-radius: 50%;

          left: -100px;
          bottom: -100px;

          background: rgba(255, 255, 255, 0.07);
        }

        .forgot-brand-content {
          position: relative;

          z-index: 2;
        }

        /* =====================================================
           LOGO
           ===================================================== */

        .forgot-logo {
          display: flex;

          align-items: center;

          gap: 12px;

          margin-bottom: 55px;
        }

        .forgot-logo-icon {
          width: 48px;
          height: 48px;

          border-radius: 14px;

          display: flex;

          align-items: center;
          justify-content: center;

          background: rgba(255, 255, 255, 0.16);

          border: 1px solid rgba(255, 255, 255, 0.22);

          font-size: 22px;

          box-shadow:
            0 8px 20px rgba(0, 0, 0, 0.12);
        }

        .forgot-logo-text {
          font-size: 23px;

          font-weight: 800;

          letter-spacing: -0.5px;
        }

        /* =====================================================
           BRAND CONTENT
           ===================================================== */

        .forgot-brand-title {
          font-size: 38px;

          line-height: 1.15;

          font-weight: 800;

          letter-spacing: -1px;

          margin-bottom: 18px;
        }

        .forgot-brand-description {
          color: rgba(255, 255, 255, 0.82);

          font-size: 14px;

          line-height: 1.75;

          margin-bottom: 30px;
        }

        /* =====================================================
           SECURITY ITEMS
           ===================================================== */

        .forgot-security-list {
          display: flex;

          flex-direction: column;

          gap: 14px;
        }

        .forgot-security-item {
          display: flex;

          align-items: center;

          gap: 12px;

          color: rgba(255, 255, 255, 0.92);

          font-size: 13px;

          font-weight: 600;
        }

        .forgot-security-icon {
          width: 34px;
          height: 34px;

          border-radius: 10px;

          display: flex;

          align-items: center;
          justify-content: center;

          background: rgba(255, 255, 255, 0.12);

          flex-shrink: 0;
        }

        .forgot-brand-footer {
          position: relative;

          z-index: 2;

          color: rgba(255, 255, 255, 0.62);

          font-size: 12px;
        }

        /* =====================================================
           RIGHT FORM PANEL
           ===================================================== */

        .forgot-form-panel {
          min-height: 590px;

          padding: 55px 55px;

          display: flex;

          align-items: center;
        }

        .forgot-form-wrapper {
          width: 100%;

          max-width: 440px;

          margin: 0 auto;
        }

        /* =====================================================
           HEADER
           ===================================================== */

        .forgot-welcome {
          color: #2563eb;

          font-size: 12px;

          font-weight: 800;

          letter-spacing: 0.8px;

          text-transform: uppercase;

          margin-bottom: 9px;
        }

        .forgot-title {
          color: #0f172a;

          font-size: 34px;

          font-weight: 800;

          letter-spacing: -0.8px;

          margin-bottom: 10px;
        }

        .forgot-subtitle {
          color: #64748b;

          font-size: 14px;

          line-height: 1.7;

          margin-bottom: 30px;
        }

        /* =====================================================
           ERROR
           ===================================================== */

        .forgot-error {
          display: flex;

          align-items: flex-start;

          gap: 10px;

          background: #fef2f2;

          border: 1px solid #fecaca;

          color: #b91c1c;

          border-radius: 12px;

          padding: 12px 14px;

          font-size: 13px;

          line-height: 1.5;

          margin-bottom: 20px;
        }

        .forgot-error-icon {
          width: 22px;
          height: 22px;

          border-radius: 50%;

          background: #fee2e2;

          display: flex;

          align-items: center;
          justify-content: center;

          font-weight: 800;

          flex-shrink: 0;
        }

        /* =====================================================
           FORM FIELD
           ===================================================== */

        .forgot-field {
          margin-bottom: 20px;
        }

        .forgot-label {
          display: block;

          color: #334155;

          font-size: 13px;

          font-weight: 700;

          margin-bottom: 8px;
        }

        .forgot-input-wrapper {
          position: relative;
        }

        .forgot-input-icon {
          position: absolute;

          left: 15px;

          top: 50%;

          transform: translateY(-50%);

          color: #94a3b8;

          font-size: 16px;

          pointer-events: none;
        }

        .forgot-input {
          width: 100%;

          min-height: 52px;

          border: 1px solid #dbe2ea;

          border-radius: 12px;

          background: #ffffff;

          color: #0f172a;

          font-size: 14px;

          padding: 12px 15px 12px 44px;

          outline: none;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .forgot-input::placeholder {
          color: #a0aec0;
        }

        .forgot-input:hover {
          border-color: #cbd5e1;
        }

        .forgot-input:focus {
          border-color: #2563eb;

          box-shadow:
            0 0 0 4px rgba(37, 99, 235, 0.10);
        }

        /* =====================================================
           SUBMIT BUTTON
           ===================================================== */

        .forgot-submit-button {
          width: 100%;

          min-height: 52px;

          border: none;

          border-radius: 12px;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #1d4ed8
            );

          color: #ffffff;

          font-size: 14px;

          font-weight: 800;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 9px;

          box-shadow:
            0 10px 25px rgba(37, 99, 235, 0.22);

          transition: all 0.2s ease;
        }

        .forgot-submit-button:hover:not(:disabled) {
          transform: translateY(-2px);

          box-shadow:
            0 14px 30px rgba(37, 99, 235, 0.28);
        }

        .forgot-submit-button:disabled {
          opacity: 0.7;

          cursor: not-allowed;

          box-shadow: none;
        }

        .forgot-spinner {
          width: 18px;
          height: 18px;

          border: 2px solid rgba(255, 255, 255, 0.4);

          border-top-color: #ffffff;

          border-radius: 50%;

          animation: forgotSpin 0.7s linear infinite;
        }

        @keyframes forgotSpin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =====================================================
           BACK TO LOGIN
           ===================================================== */

        .forgot-back-wrapper {
          text-align: center;

          margin-top: 24px;
        }

        .forgot-back-link {
          color: #64748b;

          font-size: 13px;

          font-weight: 600;

          text-decoration: none;
        }

        .forgot-back-link:hover {
          color: #2563eb;
        }

        /* =====================================================
           SUCCESS
           ===================================================== */

        .forgot-success {
          text-align: center;
        }

        .forgot-success-icon {
          width: 64px;
          height: 64px;

          margin: 0 auto 18px;

          border-radius: 18px;

          display: flex;

          align-items: center;
          justify-content: center;

          background: #dcfce7;

          color: #15803d;

          font-size: 28px;

          font-weight: 800;

          border: 1px solid #bbf7d0;
        }

        .forgot-success-title {
          color: #0f172a;

          font-size: 24px;

          font-weight: 800;

          margin-bottom: 10px;
        }

        .forgot-success-text {
          color: #64748b;

          font-size: 14px;

          line-height: 1.7;

          margin-bottom: 22px;
        }

        .forgot-email {
          color: #0f172a;

          word-break: break-word;
        }

        /* =====================================================
           RESET PASSWORD BOX
           ===================================================== */

        .reset-password-box {
          background: #eff6ff;

          border: 1px solid #bfdbfe;

          border-radius: 16px;

          padding: 18px;

          margin-bottom: 16px;

          text-align: left;
        }

        .reset-password-box-title {
          color: #1e40af;

          font-size: 14px;

          font-weight: 800;

          margin-bottom: 7px;
        }

        .reset-password-box-text {
          color: #475569;

          font-size: 12px;

          line-height: 1.6;

          margin-bottom: 15px;
        }

        .reset-password-button {
          width: 100%;

          min-height: 48px;

          border: none;

          border-radius: 11px;

          background: #2563eb;

          color: #ffffff;

          display: flex;

          align-items: center;

          justify-content: center;

          text-decoration: none;

          font-size: 13px;

          font-weight: 800;

          transition: all 0.2s ease;
        }

        .reset-password-button:hover {
          background: #1d4ed8;

          color: #ffffff;

          transform: translateY(-1px);
        }

        /* =====================================================
           TRY AGAIN
           ===================================================== */

        .try-again-button {
          width: 100%;

          min-height: 48px;

          border: 1px solid #dbe2ea;

          border-radius: 11px;

          background: #ffffff;

          color: #334155;

          font-size: 13px;

          font-weight: 700;

          transition: all 0.2s ease;
        }

        .try-again-button:hover {
          border-color: #2563eb;

          color: #2563eb;

          background: #eff6ff;
        }

        /* =====================================================
           DEVELOPMENT NOTE
           ===================================================== */

        .development-note {
          margin-top: 14px;

          padding: 10px 12px;

          border-radius: 10px;

          background: #f8fafc;

          color: #64748b;

          font-size: 11px;

          line-height: 1.5;

          text-align: left;
        }

        /* =====================================================
           TABLET
           ===================================================== */

        @media (max-width: 991.98px) {
          .eventbook-forgot-page {
            padding: 30px 15px;
          }

          .forgot-brand-panel {
            min-height: 560px;

            padding: 38px;
          }

          .forgot-form-panel {
            min-height: 560px;

            padding: 40px;
          }

          .forgot-brand-title {
            font-size: 32px;
          }

          .forgot-title {
            font-size: 30px;
          }
        }

        /* =====================================================
           MOBILE
           ===================================================== */

        @media (max-width: 767.98px) {
          .eventbook-forgot-page {
            min-height: 100vh;

            padding: 20px 12px;
          }

          .eventbook-forgot-card {
            grid-template-columns: 1fr;

            border-radius: 20px;
          }

          .forgot-brand-panel {
            min-height: auto;

            padding: 25px 22px;

            display: block;
          }

          .forgot-logo {
            margin-bottom: 0;
          }

          .forgot-logo-icon {
            width: 42px;
            height: 42px;

            font-size: 19px;
          }

          .forgot-logo-text {
            font-size: 20px;
          }

          .forgot-brand-title,
          .forgot-brand-description,
          .forgot-security-list,
          .forgot-brand-footer {
            display: none;
          }

          .forgot-form-panel {
            min-height: auto;

            padding: 32px 22px 35px;
          }

          .forgot-form-wrapper {
            max-width: none;
          }

          .forgot-title {
            font-size: 28px;
          }

          .forgot-subtitle {
            font-size: 13px;
          }
        }

        /* =====================================================
           SMALL MOBILE
           ===================================================== */

        @media (max-width: 400px) {
          .eventbook-forgot-page {
            padding: 12px 8px;
          }

          .eventbook-forgot-card {
            border-radius: 17px;
          }

          .forgot-brand-panel {
            padding: 20px 18px;
          }

          .forgot-form-panel {
            padding: 27px 18px 30px;
          }

          .forgot-title {
            font-size: 26px;
          }

          .forgot-input {
            min-height: 49px;
          }

          .forgot-submit-button {
            min-height: 50px;
          }
        }
      `}</style>

      <div className="eventbook-forgot-page">

        <div className="eventbook-forgot-container">

          <div className="eventbook-forgot-card">

            {/* =================================================
                LEFT BRAND PANEL
                ================================================= */}

            <div className="forgot-brand-panel">

              <div className="forgot-brand-content">

                {/* LOGO */}

                <div className="forgot-logo">

                  <div className="forgot-logo-icon">
                    🎫
                  </div>

                  <div className="forgot-logo-text">
                    EventBook
                  </div>

                </div>

                {/* CONTENT */}

                <h1 className="forgot-brand-title">
                  Secure your
                  <br />
                  account.
                </h1>

                <p className="forgot-brand-description">
                  Don't worry if you've forgotten your
                  password. We'll help you get back into
                  your EventBook account securely.
                </p>

                {/* SECURITY */}

                <div className="forgot-security-list">

                  <div className="forgot-security-item">

                    <div className="forgot-security-icon">
                      🔒
                    </div>

                    <span>
                      Secure password recovery
                    </span>

                  </div>

                  <div className="forgot-security-item">

                    <div className="forgot-security-icon">
                      ✓
                    </div>

                    <span>
                      Protected account access
                    </span>

                  </div>

                  <div className="forgot-security-item">

                    <div className="forgot-security-icon">
                      ↗
                    </div>

                    <span>
                      Simple recovery process
                    </span>

                  </div>

                </div>

              </div>

              <div className="forgot-brand-footer">
                © 2026 EventBook. All rights reserved.
              </div>

            </div>

            {/* =================================================
                RIGHT FORM PANEL
                ================================================= */}

            <div className="forgot-form-panel">

              <div className="forgot-form-wrapper">

                {!submitted ? (

                  <>
                    {/* HEADER */}

                    <div className="forgot-welcome">
                      Account Recovery
                    </div>

                    <h2 className="forgot-title">
                      Forgot Password?
                    </h2>

                    <p className="forgot-subtitle">
                      Enter your registered email address
                      and we'll help you reset your
                      password.
                    </p>

                    {/* ERROR */}

                    {error && (
                      <div
                        className="forgot-error"
                        role="alert"
                      >

                        <div className="forgot-error-icon">
                          !
                        </div>

                        <div>
                          {error}
                        </div>

                      </div>
                    )}

                    {/* FORM */}

                    <form onSubmit={handleSubmit}>

                      <div className="forgot-field">

                        <label
                          htmlFor="forgot-email"
                          className="forgot-label"
                        >
                          Email Address
                        </label>

                        <div className="forgot-input-wrapper">

                          <span className="forgot-input-icon">
                            ✉
                          </span>

                          <input
                            id="forgot-email"
                            type="email"
                            className="forgot-input"
                            placeholder="Enter your registered email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);

                              if (error) {
                                setError("");
                              }
                            }}
                            autoComplete="email"
                            required
                          />

                        </div>

                      </div>

                      {/* SUBMIT */}

                      <button
                        type="submit"
                        className="forgot-submit-button"
                        disabled={loading}
                      >

                        {loading ? (
                          <>
                            <span className="forgot-spinner" />

                            <span>
                              Processing...
                            </span>
                          </>
                        ) : (
                          <>
                            <span>
                              Send Reset Instructions
                            </span>

                            <span>
                              →
                            </span>
                          </>
                        )}

                      </button>

                    </form>

                    {/* BACK TO LOGIN */}

                    <div className="forgot-back-wrapper">

                      <Link
                        to="/login"
                        className="forgot-back-link"
                      >
                        ← Back to Login
                      </Link>

                    </div>
                  </>

                ) : (

                  /* =================================================
                     SUCCESS SCREEN
                     ================================================= */

                  <div className="forgot-success">

                    <div className="forgot-success-icon">
                      ✓
                    </div>

                    <h2 className="forgot-success-title">
                      Request Submitted
                    </h2>

                    <p className="forgot-success-text">
                      Password recovery has been started
                      for{" "}
                      <strong className="forgot-email">
                        {email}
                      </strong>
                      .
                    </p>

                    {/* RESET PASSWORD BUTTON */}

                    {resetUrl && (
                      <div className="reset-password-box">

                        <div className="reset-password-box-title">
                          Reset your password
                        </div>

                        <div className="reset-password-box-text">
                          Your development reset link is
                          ready. Click the button below to
                          create a new password.
                        </div>

                        <a
                          href={resetUrl}
                          className="reset-password-button"
                        >
                          Reset Password →
                        </a>

                      </div>
                    )}

                    {/* DEVELOPMENT NOTE */}

                    {resetUrl && (
                      <div className="development-note">
                        Development mode: email sending is
                        not connected yet. This button opens
                        the password reset page directly.
                      </div>
                    )}

                    {!resetUrl && (
                      <div className="development-note">
                        If this email belongs to an account,
                        password reset instructions will be
                        provided through the configured
                        recovery method.
                      </div>
                    )}

                    {/* TRY AGAIN */}

                    <button
                      type="button"
                      className="try-again-button mt-3"
                      onClick={handleTryAgain}
                    >
                      Try Another Email
                    </button>

                    {/* LOGIN */}

                    <div className="forgot-back-wrapper">

                      <Link
                        to="/login"
                        className="forgot-back-link"
                      >
                        ← Back to Login
                      </Link>

                    </div>

                  </div>
                )}

              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}

export default ForgotPassword;

