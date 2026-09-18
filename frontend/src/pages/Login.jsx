import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /* =========================================================
     HANDLE INPUT
     ========================================================= */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (error) {
      setError("");
    }
  };

  /* =========================================================
     LOGIN
     ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser(formData);

      if (data?.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/events");
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        /* =====================================================
           LOGIN PAGE
           ===================================================== */

        .eventbook-login-page {
          min-height: calc(100vh - 70px);

          background:
            radial-gradient(
              circle at 10% 10%,
              rgba(37, 99, 235, 0.10),
              transparent 30%
            ),
            radial-gradient(
              circle at 90% 90%,
              rgba(99, 102, 241, 0.08),
              transparent 30%
            ),
            #f8fafc;

          display: flex;
          align-items: center;

          padding: 45px 15px;
        }

        .eventbook-login-container {
          width: 100%;
          max-width: 1050px;
          margin: 0 auto;
        }

        /* =====================================================
           MAIN CARD
           ===================================================== */

        .eventbook-login-card {
          background: #ffffff;

          border: 1px solid #e2e8f0;

          border-radius: 26px;

          overflow: hidden;

          box-shadow:
            0 25px 70px rgba(15, 23, 42, 0.10);
        }

        /* =====================================================
           LEFT BRAND PANEL
           ===================================================== */

        .eventbook-brand-panel {
          min-height: 620px;
          height: 100%;

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

          color: #ffffff;

          padding: 48px;

          display: flex;
          flex-direction: column;
          justify-content: space-between;

          position: relative;
          overflow: hidden;
        }

        .eventbook-brand-panel::before {
          content: "";

          position: absolute;

          width: 260px;
          height: 260px;

          border-radius: 50%;

          right: -100px;
          top: -90px;

          background: rgba(255, 255, 255, 0.08);
        }

        .eventbook-brand-panel::after {
          content: "";

          position: absolute;

          width: 220px;
          height: 220px;

          border-radius: 50%;

          left: -100px;
          bottom: -100px;

          background: rgba(255, 255, 255, 0.07);
        }

        .brand-content {
          position: relative;
          z-index: 2;
        }

        /* =====================================================
           LOGO
           ===================================================== */

        .eventbook-logo {
          display: flex;
          align-items: center;

          gap: 12px;

          margin-bottom: 45px;
        }

        .eventbook-logo-icon {
          width: 48px;
          height: 48px;

          border-radius: 14px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: rgba(255, 255, 255, 0.16);

          border: 1px solid rgba(255, 255, 255, 0.22);

          font-size: 23px;

          box-shadow:
            0 8px 20px rgba(0, 0, 0, 0.12);
        }

        .eventbook-logo-text {
          font-size: 23px;

          font-weight: 800;

          letter-spacing: -0.5px;
        }

        /* =====================================================
           BRAND HEADING
           ===================================================== */

        .brand-heading {
          font-size: clamp(32px, 4vw, 45px);

          line-height: 1.12;

          font-weight: 800;

          letter-spacing: -1px;

          margin-bottom: 18px;
        }

        .brand-description {
          color: rgba(255, 255, 255, 0.82);

          font-size: 15px;

          line-height: 1.75;

          max-width: 410px;

          margin-bottom: 32px;
        }

        /* =====================================================
           FEATURES
           ===================================================== */

        .brand-features {
          display: flex;

          flex-direction: column;

          gap: 14px;
        }

        .brand-feature {
          display: flex;

          align-items: center;

          gap: 13px;

          color: rgba(255, 255, 255, 0.92);

          font-size: 14px;

          font-weight: 600;
        }

        .brand-feature-icon {
          width: 34px;
          height: 34px;

          border-radius: 10px;

          display: flex;

          align-items: center;
          justify-content: center;

          background: rgba(255, 255, 255, 0.12);

          font-size: 15px;

          flex-shrink: 0;
        }

        .brand-footer {
          position: relative;

          z-index: 2;

          color: rgba(255, 255, 255, 0.62);

          font-size: 12px;

          margin-top: 30px;
        }

        /* =====================================================
           RIGHT LOGIN PANEL
           ===================================================== */

        .eventbook-login-panel {
          padding: 48px;

          display: flex;

          align-items: center;

          min-height: 620px;
        }

        .login-form-wrapper {
          width: 100%;

          max-width: 420px;

          margin: 0 auto;
        }

        .login-welcome {
          color: #2563eb;

          font-size: 12px;

          font-weight: 800;

          letter-spacing: 0.8px;

          text-transform: uppercase;

          margin-bottom: 9px;
        }

        .login-title {
          color: #0f172a;

          font-size: clamp(28px, 4vw, 35px);

          font-weight: 800;

          letter-spacing: -0.7px;

          margin-bottom: 8px;
        }

        .login-subtitle {
          color: #64748b;

          font-size: 14px;

          line-height: 1.6;

          margin-bottom: 30px;
        }

        /* =====================================================
           ERROR
           ===================================================== */

        .login-error {
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

        .login-error-icon {
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
           FORM
           ===================================================== */

        .login-field {
          margin-bottom: 20px;
        }

        .login-label {
          display: block;

          color: #334155;

          font-size: 13px;

          font-weight: 700;

          margin-bottom: 8px;
        }

        .login-input-wrapper {
          position: relative;
        }

        .login-input-icon {
          position: absolute;

          left: 15px;

          top: 50%;

          transform: translateY(-50%);

          color: #94a3b8;

          font-size: 16px;

          pointer-events: none;

          z-index: 2;
        }

        .login-input {
          width: 100%;

          min-height: 50px;

          border: 1px solid #dbe2ea;

          border-radius: 12px;

          background: #ffffff;

          color: #0f172a;

          font-size: 14px;

          padding: 12px 15px 12px 44px;

          outline: none;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .login-input.password-input {
          padding-right: 48px;
        }

        .login-input::placeholder {
          color: #a0aec0;
        }

        .login-input:hover {
          border-color: #cbd5e1;
        }

        .login-input:focus {
          border-color: #2563eb;

          background: #ffffff;

          box-shadow:
            0 0 0 4px rgba(37, 99, 235, 0.10);
        }

        .password-toggle {
          position: absolute;

          right: 13px;

          top: 50%;

          transform: translateY(-50%);

          border: none;

          background: transparent;

          color: #64748b;

          font-size: 17px;

          padding: 5px;

          cursor: pointer;

          border-radius: 7px;
        }

        .password-toggle:hover {
          color: #2563eb;

          background: #eff6ff;
        }

        /* =====================================================
           FORGOT PASSWORD
           ===================================================== */

        .forgot-password-wrapper {
          display: flex;

          justify-content: flex-end;

          margin-top: -8px;

          margin-bottom: 20px;
        }

        .forgot-password-link {
          color: #2563eb;

          font-size: 13px;

          font-weight: 700;

          text-decoration: none;

          transition: color 0.2s ease;
        }

        .forgot-password-link:hover {
          color: #1d4ed8;

          text-decoration: underline;
        }

        /* =====================================================
           LOGIN BUTTON
           ===================================================== */

        .login-submit-button {
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

        .login-submit-button:hover:not(:disabled) {
          transform: translateY(-2px);

          box-shadow:
            0 14px 30px rgba(37, 99, 235, 0.28);
        }

        .login-submit-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-submit-button:disabled {
          opacity: 0.72;

          cursor: not-allowed;

          box-shadow: none;
        }

        .login-spinner {
          width: 18px;
          height: 18px;

          border: 2px solid rgba(255, 255, 255, 0.4);

          border-top-color: #ffffff;

          border-radius: 50%;

          animation: loginSpin 0.7s linear infinite;
        }

        @keyframes loginSpin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =====================================================
           REGISTER
           ===================================================== */

        .register-text {
          color: #64748b;

          font-size: 13px;

          text-align: center;

          margin-top: 25px;
        }

        .register-link {
          color: #2563eb;

          font-weight: 750;

          text-decoration: none;
        }

        .register-link:hover {
          color: #1d4ed8;

          text-decoration: underline;
        }

        /* =====================================================
           SECURITY NOTE
           ===================================================== */

        .login-security {
          display: flex;

          align-items: center;

          justify-content: center;

          gap: 7px;

          color: #94a3b8;

          font-size: 11px;

          margin-top: 20px;
        }

        /* =====================================================
           RESPONSIVE TABLET
           ===================================================== */

        @media (max-width: 991.98px) {
          .eventbook-login-page {
            padding: 30px 15px;
          }

          .eventbook-brand-panel {
            min-height: 560px;

            padding: 38px;
          }

          .eventbook-login-panel {
            min-height: 560px;

            padding: 38px;
          }

          .brand-heading {
            font-size: 34px;
          }
        }

        /* =====================================================
           MOBILE
           ===================================================== */

        @media (max-width: 767.98px) {
          .eventbook-login-page {
            min-height: 100vh;

            padding: 20px 12px;
          }

          .eventbook-login-card {
            border-radius: 20px;
          }

          .eventbook-brand-panel {
            min-height: auto;

            padding: 25px 22px;

            display: block;
          }

          .eventbook-logo {
            margin-bottom: 0;
          }

          .eventbook-logo-icon {
            width: 42px;
            height: 42px;

            font-size: 19px;
          }

          .eventbook-logo-text {
            font-size: 20px;
          }

          .brand-heading,
          .brand-description,
          .brand-features,
          .brand-footer {
            display: none;
          }

          .eventbook-login-panel {
            min-height: auto;

            padding: 30px 22px 32px;
          }

          .login-form-wrapper {
            max-width: none;
          }

          .login-title {
            font-size: 29px;
          }
        }

        /* =====================================================
           SMALL MOBILE
           ===================================================== */

        @media (max-width: 400px) {
          .eventbook-login-page {
            padding: 12px 8px;
          }

          .eventbook-login-card {
            border-radius: 17px;
          }

          .eventbook-brand-panel {
            padding: 20px 18px;
          }

          .eventbook-login-panel {
            padding: 26px 18px 28px;
          }

          .login-title {
            font-size: 27px;
          }

          .login-subtitle {
            font-size: 13px;
          }

          .login-input {
            min-height: 48px;
          }

          .login-submit-button {
            min-height: 50px;
          }

          .forgot-password-link {
            font-size: 12px;
          }
        }
      `}</style>

      <div className="eventbook-login-page">

        <div className="eventbook-login-container">

          <div className="eventbook-login-card">

            <div className="row g-0">

              {/* =================================================
                  LEFT BRANDING
                  ================================================= */}

              <div className="col-md-5">

                <div className="eventbook-brand-panel">

                  <div className="brand-content">

                    {/* LOGO */}

                    <div className="eventbook-logo">

                      <div className="eventbook-logo-icon">
                        🎫
                      </div>

                      <div className="eventbook-logo-text">
                        EventBook
                      </div>

                    </div>

                    {/* BRAND CONTENT */}

                    <h1 className="brand-heading">
                      Discover.
                      <br />
                      Book.
                      <br />
                      Experience.
                    </h1>

                    <p className="brand-description">
                      Your one-stop platform to discover
                      amazing events, reserve your seats,
                      and enjoy unforgettable experiences.
                    </p>

                    {/* FEATURES */}

                    <div className="brand-features">

                      <div className="brand-feature">

                        <div className="brand-feature-icon">
                          ✓
                        </div>

                        <span>
                          Easy and secure booking
                        </span>

                      </div>

                      <div className="brand-feature">

                        <div className="brand-feature-icon">
                          🎟
                        </div>

                        <span>
                          Instant digital tickets
                        </span>

                      </div>

                      <div className="brand-feature">

                        <div className="brand-feature-icon">
                          ★
                        </div>

                        <span>
                          Discover exciting events
                        </span>

                      </div>

                    </div>

                  </div>

                  <div className="brand-footer">
                    © 2026 EventBook. All rights reserved.
                  </div>

                </div>

              </div>

              {/* =================================================
                  LOGIN FORM
                  ================================================= */}

              <div className="col-md-7">

                <div className="eventbook-login-panel">

                  <div className="login-form-wrapper">

                    {/* HEADING */}

                    <div className="login-welcome">
                      Welcome Back
                    </div>

                    <h2 className="login-title">
                      Sign in to EventBook
                    </h2>

                    <p className="login-subtitle">
                      Enter your details below to access
                      your account and continue exploring
                      events.
                    </p>

                    {/* ERROR */}

                    {error && (
                      <div
                        className="login-error"
                        role="alert"
                      >

                        <div className="login-error-icon">
                          !
                        </div>

                        <div>
                          {error}
                        </div>

                      </div>
                    )}

                    {/* FORM */}

                    <form onSubmit={handleSubmit}>

                      {/* EMAIL */}

                      <div className="login-field">

                        <label
                          htmlFor="email"
                          className="login-label"
                        >
                          Email Address
                        </label>

                        <div className="login-input-wrapper">

                          <span className="login-input-icon">
                            ✉
                          </span>

                          <input
                            id="email"
                            type="email"
                            name="email"
                            className="login-input"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                          />

                        </div>

                      </div>

                      {/* PASSWORD */}

                      <div className="login-field">

                        <label
                          htmlFor="password"
                          className="login-label"
                        >
                          Password
                        </label>

                        <div className="login-input-wrapper">

                          <span className="login-input-icon">
                            🔒
                          </span>

                          <input
                            id="password"
                            type={
                              showPassword
                                ? "text"
                                : "password"
                            }
                            name="password"
                            className="login-input password-input"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            required
                          />

                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() =>
                              setShowPassword(
                                !showPassword
                              )
                            }
                            aria-label={
                              showPassword
                                ? "Hide password"
                                : "Show password"
                            }
                          >
                            {showPassword
                              ? "🙈"
                              : "👁"}
                          </button>

                        </div>

                      </div>

                      {/* =================================================
                          FORGOT PASSWORD
                          ================================================= */}

                      <div className="forgot-password-wrapper">

                        <Link
                          to="/forgot-password"
                          className="forgot-password-link"
                        >
                          Forgot Password?
                        </Link>

                      </div>

                      {/* LOGIN BUTTON */}

                      <button
                        type="submit"
                        className="login-submit-button"
                        disabled={loading}
                      >

                        {loading ? (
                          <>
                            <span className="login-spinner" />

                            <span>
                              Signing in...
                            </span>
                          </>
                        ) : (
                          <>
                            <span>
                              Sign In
                            </span>

                            <span>
                              →
                            </span>
                          </>
                        )}

                      </button>

                    </form>

                    {/* REGISTER */}

                    <div className="register-text">

                      Don't have an account?{" "}

                      <Link
                        to="/register"
                        className="register-link"
                      >
                        Create an account
                      </Link>

                    </div>

                    {/* SECURITY */}

                    <div className="login-security">

                      <span>🔒</span>

                      <span>
                        Your login information is securely
                        protected
                      </span>

                    </div>

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

export default Login;

