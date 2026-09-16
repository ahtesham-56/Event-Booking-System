import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (error) {
      setError("");
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) {
      return {
        level: 0,
        text: "",
      };
    }

    let score = 0;

    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      return {
        level: 1,
        text: "Weak password",
      };
    }

    if (score <= 3) {
      return {
        level: 2,
        text: "Medium password",
      };
    }

    return {
      level: 3,
      text: "Strong password",
    };
  };

  const passwordStrength = getPasswordStrength(
    formData.password
  );

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      navigate("/login");
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .eventbook-register-page {
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

        .eventbook-register-container {
          width: 100%;
          max-width: 1050px;
          margin: 0 auto;
        }

        .eventbook-register-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 26px;
          overflow: hidden;
          box-shadow:
            0 25px 70px rgba(15, 23, 42, 0.10);
        }

        /* =========================
           BRAND PANEL
        ========================= */

        .eventbook-register-brand {
          min-height: 680px;
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

        .eventbook-register-brand::before {
          content: "";

          position: absolute;

          width: 270px;
          height: 270px;

          border-radius: 50%;

          right: -105px;
          top: -90px;

          background: rgba(255, 255, 255, 0.08);
        }

        .eventbook-register-brand::after {
          content: "";

          position: absolute;

          width: 230px;
          height: 230px;

          border-radius: 50%;

          left: -105px;
          bottom: -105px;

          background: rgba(255, 255, 255, 0.07);
        }

        .register-brand-content {
          position: relative;
          z-index: 2;
        }

        .register-logo {
          display: flex;
          align-items: center;
          gap: 12px;

          margin-bottom: 42px;
        }

        .register-logo-icon {
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

        .register-logo-text {
          font-size: 23px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .register-brand-heading {
          font-size: clamp(32px, 4vw, 44px);
          line-height: 1.12;

          font-weight: 800;
          letter-spacing: -1px;

          margin-bottom: 18px;
        }

        .register-brand-description {
          color: rgba(255, 255, 255, 0.82);

          font-size: 15px;
          line-height: 1.75;

          max-width: 410px;

          margin-bottom: 32px;
        }

        .register-features {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .register-feature {
          display: flex;
          align-items: center;

          gap: 13px;

          color: rgba(255, 255, 255, 0.92);

          font-size: 14px;
          font-weight: 600;
        }

        .register-feature-icon {
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

        .register-brand-footer {
          position: relative;
          z-index: 2;

          color: rgba(255, 255, 255, 0.62);

          font-size: 12px;

          margin-top: 30px;
        }

        /* =========================
           FORM PANEL
        ========================= */

        .eventbook-register-form-panel {
          min-height: 680px;

          padding: 45px 48px;

          display: flex;
          align-items: center;
        }

        .register-form-wrapper {
          width: 100%;
          max-width: 430px;

          margin: 0 auto;
        }

        .register-welcome {
          color: #2563eb;

          font-size: 12px;
          font-weight: 800;

          letter-spacing: 0.8px;

          text-transform: uppercase;

          margin-bottom: 9px;
        }

        .register-title {
          color: #0f172a;

          font-size: clamp(28px, 4vw, 35px);

          font-weight: 800;

          letter-spacing: -0.7px;

          margin-bottom: 8px;
        }

        .register-subtitle {
          color: #64748b;

          font-size: 14px;

          line-height: 1.6;

          margin-bottom: 26px;
        }

        /* =========================
           ERROR
        ========================= */

        .register-error {
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

        .register-error-icon {
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

        /* =========================
           INPUTS
        ========================= */

        .register-field {
          margin-bottom: 17px;
        }

        .register-label {
          display: block;

          color: #334155;

          font-size: 13px;
          font-weight: 700;

          margin-bottom: 8px;
        }

        .register-input-wrapper {
          position: relative;
        }

        .register-input-icon {
          position: absolute;

          left: 15px;
          top: 50%;

          transform: translateY(-50%);

          color: #94a3b8;

          font-size: 16px;

          pointer-events: none;

          z-index: 2;
        }

        .register-input {
          width: 100%;

          min-height: 49px;

          border: 1px solid #dbe2ea;

          border-radius: 12px;

          background: #ffffff;

          color: #0f172a;

          font-size: 14px;

          padding: 11px 15px 11px 44px;

          outline: none;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .register-input.password-input {
          padding-right: 48px;
        }

        .register-input::placeholder {
          color: #a0aec0;
        }

        .register-input:hover {
          border-color: #cbd5e1;
        }

        .register-input:focus {
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

        /* =========================
           PASSWORD STRENGTH
        ========================= */

        .password-strength {
          margin-top: 8px;
        }

        .strength-bars {
          display: flex;
          gap: 4px;

          margin-bottom: 5px;
        }

        .strength-bar {
          height: 4px;

          flex: 1;

          border-radius: 10px;

          background: #e2e8f0;

          transition:
            background 0.2s ease;
        }

        .strength-bar.active.weak {
          background: #ef4444;
        }

        .strength-bar.active.medium {
          background: #f59e0b;
        }

        .strength-bar.active.strong {
          background: #22c55e;
        }

        .strength-text {
          font-size: 11px;
          font-weight: 600;
        }

        .strength-text.weak {
          color: #dc2626;
        }

        .strength-text.medium {
          color: #d97706;
        }

        .strength-text.strong {
          color: #16a34a;
        }

        /* =========================
           PASSWORD MATCH
        ========================= */

        .password-match {
          font-size: 11px;

          margin-top: 7px;

          font-weight: 600;
        }

        .password-match.success {
          color: #16a34a;
        }

        .password-match.error {
          color: #dc2626;
        }

        /* =========================
           SUBMIT BUTTON
        ========================= */

        .register-submit-button {
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

          margin-top: 7px;

          box-shadow:
            0 10px 25px rgba(37, 99, 235, 0.22);

          transition: all 0.2s ease;
        }

        .register-submit-button:hover:not(:disabled) {
          transform: translateY(-2px);

          box-shadow:
            0 14px 30px rgba(37, 99, 235, 0.28);
        }

        .register-submit-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .register-submit-button:disabled {
          opacity: 0.72;

          cursor: not-allowed;

          box-shadow: none;
        }

        .register-spinner {
          width: 18px;
          height: 18px;

          border: 2px solid rgba(255, 255, 255, 0.4);

          border-top-color: #ffffff;

          border-radius: 50%;

          animation:
            registerSpin 0.7s linear infinite;
        }

        @keyframes registerSpin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =========================
           LOGIN LINK
        ========================= */

        .login-text {
          color: #64748b;

          font-size: 13px;

          text-align: center;

          margin-top: 22px;
        }

        .login-link {
          color: #2563eb;

          font-weight: 750;

          text-decoration: none;
        }

        .login-link:hover {
          color: #1d4ed8;

          text-decoration: underline;
        }

        /* =========================
           SECURITY
        ========================= */

        .register-security {
          display: flex;
          align-items: center;
          justify-content: center;

          gap: 7px;

          color: #94a3b8;

          font-size: 11px;

          margin-top: 17px;

          text-align: center;
        }

        /* =========================
           TABLET
        ========================= */

        @media (max-width: 991.98px) {
          .eventbook-register-page {
            padding: 30px 15px;
          }

          .eventbook-register-brand {
            min-height: 620px;

            padding: 38px;
          }

          .eventbook-register-form-panel {
            min-height: 620px;

            padding: 38px;
          }

          .register-brand-heading {
            font-size: 34px;
          }
        }

        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 767.98px) {
          .eventbook-register-page {
            min-height: 100vh;

            padding: 20px 12px;
          }

          .eventbook-register-card {
            border-radius: 20px;
          }

          .eventbook-register-brand {
            min-height: auto;

            padding: 25px 22px;

            display: block;
          }

          .register-logo {
            margin-bottom: 0;
          }

          .register-logo-icon {
            width: 42px;
            height: 42px;

            font-size: 19px;
          }

          .register-logo-text {
            font-size: 20px;
          }

          .register-brand-heading,
          .register-brand-description,
          .register-features,
          .register-brand-footer {
            display: none;
          }

          .eventbook-register-form-panel {
            min-height: auto;

            padding: 30px 22px 32px;
          }

          .register-form-wrapper {
            max-width: none;
          }

          .register-title {
            font-size: 29px;
          }

          .register-subtitle {
            margin-bottom: 24px;
          }
        }

        /* =========================
           SMALL MOBILE
        ========================= */

        @media (max-width: 400px) {
          .eventbook-register-page {
            padding: 12px 8px;
          }

          .eventbook-register-card {
            border-radius: 17px;
          }

          .eventbook-register-brand {
            padding: 20px 18px;
          }

          .eventbook-register-form-panel {
            padding: 26px 18px 28px;
          }

          .register-title {
            font-size: 27px;
          }

          .register-subtitle {
            font-size: 13px;
          }

          .register-input {
            min-height: 48px;
          }

          .register-submit-button {
            min-height: 50px;
          }
        }
      `}</style>

      <div className="eventbook-register-page">
        <div className="eventbook-register-container">

          <div className="eventbook-register-card">

            <div className="row g-0">

              {/* =========================
                  LEFT BRAND PANEL
              ========================= */}

              <div className="col-md-5">
                <div className="eventbook-register-brand">

                  <div className="register-brand-content">

                    <div className="register-logo">
                      <div className="register-logo-icon">
                        🎫
                      </div>

                      <div className="register-logo-text">
                        EventBook
                      </div>
                    </div>

                    <h1 className="register-brand-heading">
                      Your next
                      <br />
                      experience
                      <br />
                      starts here.
                    </h1>

                    <p className="register-brand-description">
                      Create your EventBook account and
                      discover exciting events, reserve your
                      favourite seats, and enjoy memorable
                      experiences.
                    </p>

                    <div className="register-features">

                      <div className="register-feature">
                        <div className="register-feature-icon">
                          ✓
                        </div>

                        <span>
                          Quick and easy registration
                        </span>
                      </div>

                      <div className="register-feature">
                        <div className="register-feature-icon">
                          🎟
                        </div>

                        <span>
                          Book your favourite events
                        </span>
                      </div>

                      <div className="register-feature">
                        <div className="register-feature-icon">
                          🔒
                        </div>

                        <span>
                          Secure account experience
                        </span>
                      </div>

                    </div>

                  </div>

                  <div className="register-brand-footer">
                    © 2026 EventBook. All rights reserved.
                  </div>

                </div>
              </div>

              {/* =========================
                  RIGHT REGISTER PANEL
              ========================= */}

              <div className="col-md-7">

                <div className="eventbook-register-form-panel">

                  <div className="register-form-wrapper">

                    <div className="register-welcome">
                      Get Started
                    </div>

                    <h2 className="register-title">
                      Create your account
                    </h2>

                    <p className="register-subtitle">
                      Join EventBook and start discovering
                      events you don't want to miss.
                    </p>

                    {/* ERROR */}

                    {error && (
                      <div
                        className="register-error"
                        role="alert"
                      >
                        <div className="register-error-icon">
                          !
                        </div>

                        <div>
                          {error}
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>

                      {/* NAME */}

                      <div className="register-field">

                        <label
                          htmlFor="name"
                          className="register-label"
                        >
                          Full Name
                        </label>

                        <div className="register-input-wrapper">

                          <span className="register-input-icon">
                            👤
                          </span>

                          <input
                            id="name"
                            type="text"
                            name="name"
                            className="register-input"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            autoComplete="name"
                            required
                          />

                        </div>

                      </div>

                      {/* EMAIL */}

                      <div className="register-field">

                        <label
                          htmlFor="email"
                          className="register-label"
                        >
                          Email Address
                        </label>

                        <div className="register-input-wrapper">

                          <span className="register-input-icon">
                            ✉
                          </span>

                          <input
                            id="email"
                            type="email"
                            name="email"
                            className="register-input"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                          />

                        </div>

                      </div>

                      {/* PASSWORD */}

                      <div className="register-field">

                        <label
                          htmlFor="password"
                          className="register-label"
                        >
                          Password
                        </label>

                        <div className="register-input-wrapper">

                          <span className="register-input-icon">
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
                            className="register-input password-input"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="new-password"
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

                        {/* PASSWORD STRENGTH */}

                        {formData.password && (
                          <div className="password-strength">

                            <div className="strength-bars">

                              {[1, 2, 3].map((bar) => (
                                <div
                                  key={bar}
                                  className={`
                                    strength-bar
                                    ${
                                      passwordStrength.level >=
                                      bar
                                        ? `active ${
                                            passwordStrength.level ===
                                            1
                                              ? "weak"
                                              : passwordStrength.level ===
                                                2
                                              ? "medium"
                                              : "strong"
                                          }`
                                        : ""
                                    }
                                  `}
                                />
                              ))}

                            </div>

                            <div
                              className={`
                                strength-text
                                ${
                                  passwordStrength.level ===
                                  1
                                    ? "weak"
                                    : passwordStrength.level ===
                                      2
                                    ? "medium"
                                    : "strong"
                                }
                              `}
                            >
                              {passwordStrength.text}
                            </div>

                          </div>
                        )}

                      </div>

                      {/* CONFIRM PASSWORD */}

                      <div className="register-field">

                        <label
                          htmlFor="confirmPassword"
                          className="register-label"
                        >
                          Confirm Password
                        </label>

                        <div className="register-input-wrapper">

                          <span className="register-input-icon">
                            🔐
                          </span>

                          <input
                            id="confirmPassword"
                            type={
                              showConfirmPassword
                                ? "text"
                                : "password"
                            }
                            name="confirmPassword"
                            className="register-input password-input"
                            placeholder="Confirm your password"
                            value={
                              formData.confirmPassword
                            }
                            onChange={handleChange}
                            autoComplete="new-password"
                            required
                          />

                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() =>
                              setShowConfirmPassword(
                                !showConfirmPassword
                              )
                            }
                            aria-label={
                              showConfirmPassword
                                ? "Hide confirm password"
                                : "Show confirm password"
                            }
                          >
                            {showConfirmPassword
                              ? "🙈"
                              : "👁"}
                          </button>

                        </div>

                        {formData.confirmPassword && (
                          <div
                            className={`
                              password-match
                              ${
                                passwordsMatch
                                  ? "success"
                                  : "error"
                              }
                            `}
                          >
                            {passwordsMatch
                              ? "✓ Passwords match"
                              : "✕ Passwords do not match"}
                          </div>
                        )}

                      </div>

                      {/* SUBMIT */}

                      <button
                        type="submit"
                        className="register-submit-button"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="register-spinner" />

                            <span>
                              Creating Account...
                            </span>
                          </>
                        ) : (
                          <>
                            <span>
                              Create Account
                            </span>

                            <span>
                              →
                            </span>
                          </>
                        )}
                      </button>

                    </form>

                    {/* LOGIN */}

                    <div className="login-text">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="login-link"
                      >
                        Sign in
                      </Link>
                    </div>

                    {/* SECURITY */}

                    <div className="register-security">
                      <span>🔒</span>

                      <span>
                        Your account information is securely
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

export default Register;

