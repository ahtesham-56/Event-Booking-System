import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

function ManageBookings() {
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  // =========================================================
  // LOAD BOOKINGS
  // =========================================================

  const loadBookings = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get(
        "/bookings/all"
      );

      console.log(
        "ALL BOOKINGS RESPONSE:",
        response.data
      );

      const data =
        response.data?.bookings ||
        response.data ||
        [];

      setBookings(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "MANAGE BOOKINGS ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to load bookings. Please try again."
      );

      if (!isRefresh) {
        setBookings([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // =========================================================
  // HELPERS
  // =========================================================

  const getCustomerName = (booking) => {
    return (
      booking?.user?.name ||
      booking?.user?.fullName ||
      booking?.user?.email ||
      booking?.user ||
      "Unknown Customer"
    );
  };

  const getCustomerEmail = (booking) => {
    return (
      booking?.user?.email ||
      "No email available"
    );
  };

  const getEventName = (booking) => {
    return (
      booking?.event?.title ||
      booking?.event ||
      "Unknown Event"
    );
  };

  const getBookingId = (booking) => {
    if (booking?.id) {
      return booking.id;
    }

    if (booking?._id) {
      return `BK-${booking._id
        .slice(-8)
        .toUpperCase()}`;
    }

    return "N/A";
  };

  const getSeatsCount = (booking) => {
    if (Array.isArray(booking?.seats)) {
      return booking.seats.length;
    }

    return Number(
      booking?.quantity ||
        booking?.seats ||
        0
    );
  };

  const getInitials = (name) => {
    if (!name) {
      return "U";
    }

    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    try {
      const formatted = new Date(date);

      if (
        Number.isNaN(
          formatted.getTime()
        )
      ) {
        return "Date unavailable";
      }

      return formatted.toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "Date unavailable";
    }
  };

  const formatTime = (date) => {
    if (!date) {
      return "";
    }

    try {
      const formatted = new Date(date);

      if (
        Number.isNaN(
          formatted.getTime()
        )
      ) {
        return "";
      }

      return formatted.toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    } catch {
      return "";
    }
  };

  const formatCurrency = (amount) => {
    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN")}`;
  };

  const getStatus = (booking) => {
    return (
      booking?.status ||
      "Confirmed"
    );
  };

  // =========================================================
  // FILTER BOOKINGS
  // =========================================================

  const filteredBookings = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return bookings.filter(
      (booking) => {
        const bookingId =
          getBookingId(
            booking
          ).toLowerCase();

        const customer =
          getCustomerName(
            booking
          ).toLowerCase();

        const email =
          getCustomerEmail(
            booking
          ).toLowerCase();

        const event =
          getEventName(
            booking
          ).toLowerCase();

        const status =
          getStatus(
            booking
          ).toLowerCase();

        const matchesSearch =
          !searchValue ||
          bookingId.includes(
            searchValue
          ) ||
          customer.includes(
            searchValue
          ) ||
          email.includes(
            searchValue
          ) ||
          event.includes(
            searchValue
          );

        const matchesStatus =
          statusFilter === "All" ||
          status ===
            statusFilter.toLowerCase();

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    bookings,
    search,
    statusFilter,
  ]);

  // =========================================================
  // STATS
  // =========================================================

  const totalBookings =
    bookings.length;

  const confirmedBookings =
    bookings.filter(
      (booking) =>
        getStatus(booking).toLowerCase() ===
        "confirmed"
    ).length;

  const cancelledBookings =
    bookings.filter(
      (booking) =>
        getStatus(booking).toLowerCase() ===
        "cancelled"
    ).length;

  const totalSeats =
    bookings.reduce(
      (total, booking) =>
        total +
        getSeatsCount(booking),
      0
    );

  const totalRevenue =
    bookings.reduce(
      (total, booking) =>
        total +
        Number(
          booking?.totalAmount ||
            booking?.amount ||
            0
        ),
      0
    );

  const confirmedRevenue =
    bookings
      .filter(
        (booking) =>
          getStatus(
            booking
          ).toLowerCase() ===
          "confirmed"
      )
      .reduce(
        (total, booking) =>
          total +
          Number(
            booking?.totalAmount ||
              booking?.amount ||
              0
          ),
        0
      );

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <>
        <style>{`
          .manage-bookings-loading {
            min-height: 70vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            background: #f8fafc;
          }

          .manage-bookings-loading-card {
            width: 100%;
            max-width: 430px;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            padding: 42px 30px;
            text-align: center;
            box-shadow:
              0 15px 45px rgba(15, 23, 42, 0.07);
          }

          .booking-loading-spinner {
            width: 48px;
            height: 48px;
            border: 4px solid #dbeafe;
            border-top-color: #2563eb;
            border-radius: 50%;
            animation:
              bookingLoadingSpin 0.8s linear infinite;
            margin: 0 auto 18px;
          }

          @keyframes bookingLoadingSpin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>

        <div className="manage-bookings-loading">
          <div className="manage-bookings-loading-card">

            <div className="booking-loading-spinner" />

            <h5 className="fw-bold mb-2">
              Loading Bookings
            </h5>

            <p className="text-muted small mb-0">
              Please wait while we fetch
              customer booking information.
            </p>

          </div>
        </div>
      </>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <>
      <style>{`
        /* =====================================================
           PAGE
        ===================================================== */

        .manage-bookings-page {
          min-height: 100vh;

          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(37, 99, 235, 0.06),
              transparent 28%
            ),
            #f8fafc;

          padding: 30px 24px 45px;
        }

        .manage-bookings-container {
          width: 100%;
          max-width: 1500px;
          margin: 0 auto;
        }

        /* =====================================================
           HEADER
        ===================================================== */

        .manage-bookings-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;

          gap: 20px;

          margin-bottom: 25px;
        }

        .bookings-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;

          background: #eff6ff;
          color: #2563eb;

          border: 1px solid #dbeafe;
          border-radius: 999px;

          padding: 7px 12px;

          font-size: 10px;
          font-weight: 800;

          letter-spacing: 0.7px;
          text-transform: uppercase;

          margin-bottom: 11px;
        }

        .eyebrow-dot {
          width: 6px;
          height: 6px;

          border-radius: 50%;

          background: #2563eb;
        }

        .manage-bookings-title {
          color: #0f172a;

          font-size: clamp(
            27px,
            3vw,
            34px
          );

          font-weight: 800;

          letter-spacing: -0.8px;

          margin: 0 0 6px;
        }

        .manage-bookings-subtitle {
          color: #64748b;

          font-size: 14px;

          margin: 0;

          line-height: 1.6;
        }

        .header-refresh-button {
          min-height: 44px;

          border-radius: 11px;

          padding: 0 17px;

          font-size: 13px;
          font-weight: 700;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          gap: 7px;

          background: #ffffff;
          color: #475569;

          border: 1px solid #dbe2ea;

          transition: all 0.2s ease;
        }

        .header-refresh-button:hover:not(:disabled) {
          color: #2563eb;

          border-color: #bfdbfe;

          background: #eff6ff;
        }

        .header-refresh-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .refresh-spinner {
          width: 15px;
          height: 15px;

          border: 2px solid #cbd5e1;
          border-top-color: #2563eb;

          border-radius: 50%;

          animation:
            bookingRefreshSpin
            0.7s linear infinite;
        }

        @keyframes bookingRefreshSpin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =====================================================
           ERROR
        ===================================================== */

        .bookings-error {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 15px;

          padding: 14px 16px;

          margin-bottom: 20px;

          background: #fef2f2;

          border: 1px solid #fecaca;

          border-radius: 13px;

          color: #991b1b;
        }

        .error-content {
          display: flex;
          align-items: center;

          gap: 10px;

          font-size: 13px;
        }

        .error-icon {
          width: 28px;
          height: 28px;

          border-radius: 50%;

          display: flex;
          align-items: center;
          justify-content: center;

          background: #fee2e2;

          font-weight: 800;

          flex-shrink: 0;
        }

        .retry-button {
          border: 1px solid #fca5a5;

          background: #ffffff;

          color: #b91c1c;

          border-radius: 8px;

          padding: 7px 12px;

          font-size: 12px;

          font-weight: 700;

          cursor: pointer;

          white-space: nowrap;
        }

        .retry-button:hover {
          background: #fff1f2;
        }

        /* =====================================================
           STATS
        ===================================================== */

        .booking-stats-grid {
          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap: 15px;

          margin-bottom: 22px;
        }

        .booking-stat-card {
          background: #ffffff;

          border: 1px solid #e5eaf0;

          border-radius: 17px;

          padding: 20px;

          box-shadow:
            0 8px 28px rgba(
              15,
              23,
              42,
              0.045
            );

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .booking-stat-card:hover {
          transform: translateY(-2px);

          box-shadow:
            0 13px 32px rgba(
              15,
              23,
              42,
              0.075
            );
        }

        .stat-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;

          gap: 12px;
        }

        .stat-label {
          color: #64748b;

          font-size: 10px;

          font-weight: 800;

          letter-spacing: 0.6px;

          text-transform: uppercase;

          margin-bottom: 7px;
        }

        .stat-value {
          color: #0f172a;

          font-size: 27px;

          line-height: 1;

          font-weight: 800;

          letter-spacing: -0.8px;
        }

        .stat-icon {
          width: 44px;
          height: 44px;

          border-radius: 12px;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 19px;

          flex-shrink: 0;
        }

        .stat-blue {
          background: #eff6ff;
          color: #2563eb;
        }

        .stat-green {
          background: #ecfdf5;
          color: #059669;
        }

        .stat-orange {
          background: #fff7ed;
          color: #ea580c;
        }

        .stat-purple {
          background: #f5f3ff;
          color: #7c3aed;
        }

        .stat-footer {
          display: flex;
          align-items: center;

          gap: 5px;

          color: #94a3b8;

          font-size: 11px;

          margin-top: 12px;
        }

        .stat-footer.success {
          color: #059669;
        }

        /* =====================================================
           FILTER CARD
        ===================================================== */

        .booking-filter-card {
          background: #ffffff;

          border: 1px solid #e5eaf0;

          border-radius: 17px;

          padding: 16px;

          margin-bottom: 20px;

          box-shadow:
            0 8px 28px rgba(
              15,
              23,
              42,
              0.045
            );
        }

        .booking-filter-row {
          display: flex;
          align-items: center;

          gap: 11px;
        }

        .booking-search-wrapper {
          position: relative;

          flex: 1;
        }

        .search-icon {
          position: absolute;

          left: 14px;
          top: 50%;

          transform:
            translateY(-50%);

          color: #94a3b8;

          font-size: 15px;

          pointer-events: none;
        }

        .booking-search {
          width: 100%;

          height: 45px;

          border: 1px solid #dbe2ea;

          border-radius: 10px;

          padding:
            0 40px 0 40px;

          color: #0f172a;

          background: #ffffff;

          outline: none;

          font-size: 13px;

          transition: all 0.2s ease;
        }

        .booking-search::placeholder {
          color: #94a3b8;
        }

        .booking-search:focus {
          border-color: #2563eb;

          box-shadow:
            0 0 0 4px
            rgba(
              37,
              99,
              235,
              0.08
            );
        }

        .clear-search {
          position: absolute;

          right: 11px;
          top: 50%;

          transform:
            translateY(-50%);

          border: none;

          background: #f1f5f9;

          color: #64748b;

          width: 24px;
          height: 24px;

          border-radius: 50%;

          display: flex;
          align-items: center;
          justify-content: center;

          cursor: pointer;

          font-size: 13px;
        }

        .clear-search:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .status-select {
          height: 45px;

          min-width: 165px;

          border: 1px solid #dbe2ea;

          border-radius: 10px;

          padding:
            0 35px 0 13px;

          color: #334155;

          background-color: #ffffff;

          outline: none;

          font-size: 13px;

          cursor: pointer;
        }

        .status-select:focus {
          border-color: #2563eb;

          box-shadow:
            0 0 0 4px
            rgba(
              37,
              99,
              235,
              0.08
            );
        }

        .filter-result {
          white-space: nowrap;

          padding: 0 8px;

          color: #64748b;

          font-size: 12px;

          font-weight: 600;
        }

        .clear-filter-button {
          height: 45px;

          padding: 0 13px;

          border-radius: 9px;

          border: 1px solid #dbe2ea;

          background: #ffffff;

          color: #64748b;

          font-size: 12px;

          font-weight: 700;

          cursor: pointer;
        }

        .clear-filter-button:hover {
          background: #f8fafc;

          color: #2563eb;

          border-color: #bfdbfe;
        }

        /* =====================================================
           BOOKINGS CARD
        ===================================================== */

        .bookings-card {
          background: #ffffff;

          border: 1px solid #e5eaf0;

          border-radius: 19px;

          overflow: hidden;

          box-shadow:
            0 10px 35px rgba(
              15,
              23,
              42,
              0.05
            );
        }

        .bookings-card-header {
          padding: 20px 22px;

          border-bottom:
            1px solid #edf0f3;

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 15px;
        }

        .bookings-heading {
          color: #0f172a;

          font-size: 17px;

          font-weight: 800;

          margin: 0 0 3px;
        }

        .bookings-description {
          color: #94a3b8;

          font-size: 12px;

          margin: 0;
        }

        .booking-count-badge {
          background: #f8fafc;

          color: #475569;

          border: 1px solid #e2e8f0;

          border-radius: 999px;

          padding: 7px 12px;

          font-size: 11px;

          font-weight: 700;

          white-space: nowrap;
        }

        /* =====================================================
           TABLE
        ===================================================== */

        .bookings-table-wrapper {
          width: 100%;

          overflow-x: auto;
        }

        .bookings-table {
          width: 100%;

          min-width: 1050px;

          border-collapse: separate;

          border-spacing: 0;
        }

        .bookings-table thead th {
          background: #f8fafc;

          color: #64748b;

          font-size: 10px;

          font-weight: 800;

          letter-spacing: 0.45px;

          text-transform: uppercase;

          padding: 13px 14px;

          border-bottom:
            1px solid #e2e8f0;

          white-space: nowrap;
        }

        .bookings-table thead th:first-child {
          padding-left: 22px;
        }

        .bookings-table thead th:last-child {
          padding-right: 22px;
        }

        .bookings-table tbody td {
          padding: 15px 14px;

          border-bottom:
            1px solid #f1f5f9;

          vertical-align: middle;
        }

        .bookings-table tbody tr:last-child td {
          border-bottom: none;
        }

        .bookings-table tbody tr {
          transition:
            background 0.15s ease;
        }

        .bookings-table tbody tr:hover {
          background: #fafcff;
        }

        .bookings-table tbody td:first-child {
          padding-left: 22px;
        }

        .bookings-table tbody td:last-child {
          padding-right: 22px;
        }

        /* =====================================================
           BOOKING ID
        ===================================================== */

        .booking-id-cell {
          display: flex;
          align-items: center;

          gap: 11px;

          min-width: 160px;
        }

        .booking-id-icon {
          width: 42px;
          height: 42px;

          border-radius: 11px;

          background: #eff6ff;

          color: #2563eb;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 15px;
          font-weight: 800;

          flex-shrink: 0;
        }

        .booking-id {
          color: #0f172a;

          font-size: 12px;

          font-weight: 800;

          margin-bottom: 3px;
        }

        .booking-date {
          color: #94a3b8;

          font-size: 9px;
        }

        /* =====================================================
           CUSTOMER
        ===================================================== */

        .customer-cell {
          display: flex;
          align-items: center;

          gap: 10px;

          min-width: 205px;
        }

        .customer-avatar {
          width: 38px;
          height: 38px;

          border-radius: 50%;

          background:
            linear-gradient(
              135deg,
              #dbeafe,
              #e0e7ff
            );

          color: #3730a3;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 11px;

          font-weight: 800;

          flex-shrink: 0;
        }

        .customer-name {
          color: #334155;

          font-size: 12px;

          font-weight: 750;

          max-width: 180px;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;
        }

        .customer-email {
          color: #94a3b8;

          font-size: 9px;

          max-width: 180px;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;

          margin-top: 2px;
        }

        /* =====================================================
           EVENT
        ===================================================== */

        .booking-event-name {
          color: #334155;

          font-size: 12px;

          font-weight: 750;

          max-width: 190px;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;
        }

        .booking-event-category {
          color: #94a3b8;

          font-size: 9px;

          margin-top: 3px;
        }

        /* =====================================================
           SEATS
        ===================================================== */

        .booking-seats-badge {
          display: inline-flex;

          align-items: center;

          gap: 5px;

          background: #f8fafc;

          color: #475569;

          border: 1px solid #e2e8f0;

          border-radius: 7px;

          padding: 6px 9px;

          font-size: 10px;

          font-weight: 750;

          white-space: nowrap;
        }

        /* =====================================================
           AMOUNT
        ===================================================== */

        .booking-amount {
          color: #0f172a;

          font-size: 13px;

          font-weight: 800;

          white-space: nowrap;
        }

        /* =====================================================
           STATUS
        ===================================================== */

        .status-badge {
          display: inline-flex;

          align-items: center;

          gap: 6px;

          border-radius: 999px;

          padding: 6px 10px;

          font-size: 10px;

          font-weight: 750;

          white-space: nowrap;
        }

        .status-dot {
          width: 6px;
          height: 6px;

          border-radius: 50%;
        }

        .status-confirmed {
          background: #ecfdf5;

          color: #047857;

          border: 1px solid #a7f3d0;
        }

        .status-confirmed .status-dot {
          background: #10b981;
        }

        .status-cancelled {
          background: #fef2f2;

          color: #b91c1c;

          border: 1px solid #fecaca;
        }

        .status-cancelled .status-dot {
          background: #ef4444;
        }

        .status-default {
          background: #f8fafc;

          color: #64748b;

          border: 1px solid #e2e8f0;
        }

        .status-default .status-dot {
          background: #94a3b8;
        }

        /* =====================================================
           MOBILE CARDS
        ===================================================== */

        .mobile-bookings {
          display: none;
        }

        .mobile-booking-card {
          background: #ffffff;

          border: 1px solid #e5eaf0;

          border-radius: 15px;

          padding: 14px;

          margin-bottom: 11px;

          box-shadow:
            0 5px 18px rgba(
              15,
              23,
              42,
              0.035
            );
        }

        .mobile-booking-top {
          display: flex;

          align-items: flex-start;

          justify-content: space-between;

          gap: 10px;
        }

        .mobile-booking-id {
          display: flex;

          align-items: center;

          gap: 9px;
        }

        .mobile-booking-icon {
          width: 39px;
          height: 39px;

          border-radius: 10px;

          background: #eff6ff;

          color: #2563eb;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 14px;

          font-weight: 800;
        }

        .mobile-id-text {
          color: #0f172a;

          font-size: 12px;

          font-weight: 800;
        }

        .mobile-date-text {
          color: #94a3b8;

          font-size: 9px;

          margin-top: 2px;
        }

        .mobile-customer {
          display: flex;

          align-items: center;

          gap: 10px;

          margin-top: 15px;

          padding-top: 14px;

          border-top:
            1px solid #f1f5f9;
        }

        .mobile-customer-avatar {
          width: 37px;
          height: 37px;

          border-radius: 50%;

          background:
            linear-gradient(
              135deg,
              #dbeafe,
              #e0e7ff
            );

          color: #3730a3;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 10px;

          font-weight: 800;

          flex-shrink: 0;
        }

        .mobile-customer-name {
          color: #334155;

          font-size: 12px;

          font-weight: 750;
        }

        .mobile-customer-email {
          color: #94a3b8;

          font-size: 9px;

          margin-top: 2px;
        }

        .mobile-event {
          margin-top: 13px;

          background: #f8fafc;

          border-radius: 10px;

          padding: 11px;
        }

        .mobile-event-label {
          color: #94a3b8;

          font-size: 9px;

          font-weight: 800;

          letter-spacing: 0.4px;

          text-transform: uppercase;

          margin-bottom: 4px;
        }

        .mobile-event-name {
          color: #334155;

          font-size: 12px;

          font-weight: 750;
        }

        .mobile-booking-meta {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 10px;

          margin-top: 13px;
        }

        .mobile-meta-item {
          min-width: 0;
        }

        .mobile-meta-label {
          color: #94a3b8;

          font-size: 9px;

          font-weight: 800;

          letter-spacing: 0.4px;

          text-transform: uppercase;

          margin-bottom: 3px;
        }

        .mobile-meta-value {
          color: #334155;

          font-size: 11px;

          font-weight: 750;
        }

        /* =====================================================
           EMPTY
        ===================================================== */

        .booking-empty {
          padding: 70px 25px;

          text-align: center;
        }

        .booking-empty-icon {
          width: 75px;
          height: 75px;

          border-radius: 22px;

          background: #f1f5f9;

          color: #64748b;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 30px;

          margin:
            0 auto 18px;
        }

        .booking-empty-title {
          color: #0f172a;

          font-size: 18px;

          font-weight: 800;

          margin-bottom: 7px;
        }

        .booking-empty-description {
          max-width: 440px;

          margin:
            0 auto;

          color: #94a3b8;

          font-size: 13px;

          line-height: 1.6;
        }

        /* =====================================================
           INFO CARD
        ===================================================== */

        .booking-info-card {
          display: flex;

          align-items: flex-start;

          gap: 13px;

          background: #ffffff;

          border: 1px solid #e5eaf0;

          border-radius: 16px;

          padding: 17px;

          margin-top: 20px;

          box-shadow:
            0 8px 28px rgba(
              15,
              23,
              42,
              0.04
            );
        }

        .info-icon {
          width: 42px;
          height: 42px;

          border-radius: 11px;

          background: #eff6ff;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 18px;

          flex-shrink: 0;
        }

        .info-title {
          color: #0f172a;

          font-size: 13px;

          font-weight: 800;

          margin-bottom: 4px;
        }

        .info-text {
          color: #94a3b8;

          font-size: 11px;

          line-height: 1.6;

          margin: 0;
        }

        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 1199px) {
          .booking-stats-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .manage-bookings-page {
            padding-left: 20px;
            padding-right: 20px;
          }
        }

        @media (max-width: 991.98px) {
          .manage-bookings-header {
            align-items: flex-start;

            flex-direction: column;
          }

          .header-refresh-button {
            width: 100%;
          }

          .booking-filter-row {
            flex-wrap: wrap;
          }

          .booking-search-wrapper {
            min-width: 100%;
          }

          .status-select {
            flex: 1;
          }

          .filter-result {
            margin-left: auto;
          }
        }

        @media (max-width: 767.98px) {
          .manage-bookings-page {
            padding:
              20px 12px 35px;
          }

          .manage-bookings-title {
            font-size: 27px;
          }

          .manage-bookings-subtitle {
            font-size: 12px;
          }

          .booking-stats-grid {
            grid-template-columns:
              1fr 1fr;

            gap: 10px;
          }

          .booking-stat-card {
            padding: 15px;

            border-radius: 14px;
          }

          .stat-icon {
            width: 36px;
            height: 36px;

            border-radius: 10px;

            font-size: 16px;
          }

          .stat-value {
            font-size: 22px;
          }

          .stat-label {
            font-size: 8px;
          }

          .stat-footer {
            font-size: 9px;
          }

          .booking-filter-card {
            padding: 12px;

            border-radius: 14px;
          }

          .booking-filter-row {
            display: grid;

            grid-template-columns: 1fr;
          }

          .booking-search-wrapper {
            width: 100%;

            min-width: 0;
          }

          .status-select {
            width: 100%;

            min-width: 0;
          }

          .clear-filter-button {
            width: 100%;
          }

          .filter-result {
            margin-left: 0;

            padding: 0;
          }

          .bookings-card {
            border-radius: 15px;
          }

          .bookings-card-header {
            padding: 16px;
          }

          .bookings-heading {
            font-size: 15px;
          }

          .bookings-description {
            font-size: 10px;
          }

          .booking-count-badge {
            font-size: 9px;

            padding:
              6px 9px;
          }

          .bookings-table-wrapper {
            display: none;
          }

          .mobile-bookings {
            display: block;

            padding: 12px;
          }

          .bookings-error {
            align-items: flex-start;

            flex-direction: column;
          }

          .retry-button {
            width: 100%;
          }

          .booking-info-card {
            padding: 14px;
          }
        }

        @media (max-width: 420px) {
          .manage-bookings-page {
            padding-left: 9px;
            padding-right: 9px;
          }

          .manage-bookings-title {
            font-size: 24px;
          }

          .booking-stats-grid {
            gap: 8px;
          }

          .booking-stat-card {
            padding: 13px;
          }

          .stat-value {
            font-size: 20px;
          }

          .stat-icon {
            width: 32px;
            height: 32px;

            font-size: 14px;
          }
        }
      `}</style>

      <div className="manage-bookings-page">

        <div className="manage-bookings-container">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="manage-bookings-header">

            <div>

              <div className="bookings-eyebrow">
                <span className="eyebrow-dot" />

                Admin Panel

                <span>•</span>

                Booking Management
              </div>

              <h1 className="manage-bookings-title">
                Manage Bookings
              </h1>

              <p className="manage-bookings-subtitle">
                Monitor customer bookings,
                reserved seats and booking
                revenue across your events.
              </p>

            </div>

            <button
              type="button"
              className="header-refresh-button"
              onClick={() =>
                loadBookings(true)
              }
              disabled={refreshing}
            >
              {refreshing ? (
                <>
                  <span className="refresh-spinner" />
                  Refreshing...
                </>
              ) : (
                <>
                  ↻
                  Refresh Bookings
                </>
              )}
            </button>

          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="bookings-error">

              <div className="error-content">

                <div className="error-icon">
                  !
                </div>

                <span>
                  {error}
                </span>

              </div>

              <button
                type="button"
                className="retry-button"
                onClick={() =>
                  loadBookings()
                }
              >
                Try Again
              </button>

            </div>
          )}

          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="booking-stats-grid">

            {/* TOTAL BOOKINGS */}

            <div className="booking-stat-card">

              <div className="stat-top">

                <div>

                  <div className="stat-label">
                    Total Bookings
                  </div>

                  <div className="stat-value">
                    {totalBookings}
                  </div>

                </div>

                <div className="stat-icon stat-blue">
                  📋
                </div>

              </div>

              <div className="stat-footer">
                <span>•</span>

                <span>
                  All customer bookings
                </span>
              </div>

            </div>

            {/* CONFIRMED */}

            <div className="booking-stat-card">

              <div className="stat-top">

                <div>

                  <div className="stat-label">
                    Confirmed
                  </div>

                  <div className="stat-value">
                    {confirmedBookings}
                  </div>

                </div>

                <div className="stat-icon stat-green">
                  ✓
                </div>

              </div>

              <div className="stat-footer success">
                <span>●</span>

                <span>
                  {cancelledBookings}{" "}
                  cancelled
                </span>
              </div>

            </div>

            {/* SEATS */}

            <div className="booking-stat-card">

              <div className="stat-top">

                <div>

                  <div className="stat-label">
                    Booked Seats
                  </div>

                  <div className="stat-value">
                    {totalSeats.toLocaleString(
                      "en-IN"
                    )}
                  </div>

                </div>

                <div className="stat-icon stat-orange">
                  🎟️
                </div>

              </div>

              <div className="stat-footer">
                <span>•</span>

                <span>
                  Seats reserved
                </span>
              </div>

            </div>

            {/* REVENUE */}

            <div className="booking-stat-card">

              <div className="stat-top">

                <div>

                  <div className="stat-label">
                    Revenue
                  </div>

                  <div className="stat-value">
                    {formatCurrency(
                      totalRevenue
                    )}
                  </div>

                </div>

                <div className="stat-icon stat-purple">
                  ₹
                </div>

              </div>

              <div className="stat-footer">
                <span>•</span>

                <span>
                  {formatCurrency(
                    confirmedRevenue
                  )}{" "}
                  confirmed
                </span>
              </div>

            </div>

          </div>

          {/* =================================================
              SEARCH + FILTER
          ================================================= */}

          <div className="booking-filter-card">

            <div className="booking-filter-row">

              <div className="booking-search-wrapper">

                <span className="search-icon">
                  🔍
                </span>

                <input
                  type="search"
                  className="booking-search"
                  placeholder="Search by customer, email, event or booking ID..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />

                {search && (
                  <button
                    type="button"
                    className="clear-search"
                    onClick={() =>
                      setSearch("")
                    }
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}

              </div>

              <select
                className="status-select"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
              >
                <option value="All">
                  All Statuses
                </option>

                <option value="Confirmed">
                  Confirmed
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>
              </select>

              {(search ||
                statusFilter !==
                  "All") && (
                <button
                  type="button"
                  className="clear-filter-button"
                  onClick={
                    clearFilters
                  }
                >
                  Clear
                </button>
              )}

              <div className="filter-result">
                Showing{" "}
                <strong>
                  {filteredBookings.length}
                </strong>{" "}
                of{" "}
                {totalBookings}
              </div>

            </div>

          </div>

          {/* =================================================
              BOOKINGS CARD
          ================================================= */}

          <div className="bookings-card">

            <div className="bookings-card-header">

              <div>

                <h2 className="bookings-heading">
                  Customer Bookings
                </h2>

                <p className="bookings-description">
                  Review customer booking
                  information and payment
                  totals.
                </p>

              </div>

              <div className="booking-count-badge">
                {totalBookings}{" "}
                {totalBookings === 1
                  ? "Booking"
                  : "Bookings"}
              </div>

            </div>

            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {filteredBookings.length ===
            0 ? (

              <div className="booking-empty">

                <div className="booking-empty-icon">
                  {totalBookings === 0
                    ? "📋"
                    : "🔍"}
                </div>

                <h3 className="booking-empty-title">
                  {totalBookings === 0
                    ? "No Bookings Yet"
                    : "No Matching Bookings"}
                </h3>

                <p className="booking-empty-description">
                  {totalBookings === 0
                    ? "There are currently no customer bookings in the system."
                    : "No bookings match your current search or status filter. Try changing your filters."}
                </p>

              </div>

            ) : (

              <>
                {/* =================================================
                    DESKTOP TABLE
                ================================================= */}

                <div className="bookings-table-wrapper">

                  <table className="bookings-table">

                    <thead>

                      <tr>

                        <th>
                          Booking
                        </th>

                        <th>
                          Customer
                        </th>

                        <th>
                          Event
                        </th>

                        <th>
                          Seats
                        </th>

                        <th>
                          Amount
                        </th>

                        <th>
                          Status
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {filteredBookings.map(
                        (booking) => {

                          const customerName =
                            getCustomerName(
                              booking
                            );

                          const customerEmail =
                            getCustomerEmail(
                              booking
                            );

                          const eventName =
                            getEventName(
                              booking
                            );

                          const status =
                            getStatus(
                              booking
                            );

                          const seats =
                            getSeatsCount(
                              booking
                            );

                          const amount =
                            Number(
                              booking?.totalAmount ||
                                booking?.amount ||
                                0
                            );

                          const bookingId =
                            getBookingId(
                              booking
                            );

                          return (
                            <tr
                              key={
                                booking._id ||
                                booking.id ||
                                bookingId
                              }
                            >

                              {/* BOOKING */}

                              <td>

                                <div className="booking-id-cell">

                                  <div className="booking-id-icon">
                                    #
                                  </div>

                                  <div>

                                    <div className="booking-id">
                                      {bookingId}
                                    </div>

                                    <div className="booking-date">
                                      {formatDate(
                                        booking.createdAt
                                      )}

                                      {formatTime(
                                        booking.createdAt
                                      ) &&
                                        ` • ${formatTime(
                                          booking.createdAt
                                        )}`}
                                    </div>

                                  </div>

                                </div>

                              </td>

                              {/* CUSTOMER */}

                              <td>

                                <div className="customer-cell">

                                  <div className="customer-avatar">
                                    {getInitials(
                                      customerName
                                    )}
                                  </div>

                                  <div>

                                    <div className="customer-name">
                                      {customerName}
                                    </div>

                                    <div className="customer-email">
                                      {customerEmail}
                                    </div>

                                  </div>

                                </div>

                              </td>

                              {/* EVENT */}

                              <td>

                                <div className="booking-event-name">
                                  {eventName}
                                </div>

                                <div className="booking-event-category">
                                  {booking?.event
                                    ?.category ||
                                    "Event Booking"}
                                </div>

                              </td>

                              {/* SEATS */}

                              <td>

                                <span className="booking-seats-badge">
                                  🎟️{" "}
                                  {seats}{" "}
                                  {seats === 1
                                    ? "seat"
                                    : "seats"}
                                </span>

                              </td>

                              {/* AMOUNT */}

                              <td>

                                <div className="booking-amount">
                                  {formatCurrency(
                                    amount
                                  )}
                                </div>

                              </td>

                              {/* STATUS */}

                              <td>

                                <span
                                  className={`
                                    status-badge
                                    ${
                                      status.toLowerCase() ===
                                      "confirmed"
                                        ? "status-confirmed"
                                        : status.toLowerCase() ===
                                          "cancelled"
                                        ? "status-cancelled"
                                        : "status-default"
                                    }
                                  `}
                                >

                                  <span className="status-dot" />

                                  {status}

                                </span>

                              </td>

                            </tr>
                          );
                        }
                      )}

                    </tbody>

                  </table>

                </div>

                {/* =================================================
                    MOBILE CARDS
                ================================================= */}

                <div className="mobile-bookings">

                  {filteredBookings.map(
                    (booking) => {

                      const customerName =
                        getCustomerName(
                          booking
                        );

                      const customerEmail =
                        getCustomerEmail(
                          booking
                        );

                      const eventName =
                        getEventName(
                          booking
                        );

                      const status =
                        getStatus(
                          booking
                        );

                      const seats =
                        getSeatsCount(
                          booking
                        );

                      const amount =
                        Number(
                          booking?.totalAmount ||
                            booking?.amount ||
                            0
                        );

                      const bookingId =
                        getBookingId(
                          booking
                        );

                      return (
                        <div
                          className="mobile-booking-card"
                          key={
                            booking._id ||
                            booking.id ||
                            bookingId
                          }
                        >

                          {/* TOP */}

                          <div className="mobile-booking-top">

                            <div className="mobile-booking-id">

                              <div className="mobile-booking-icon">
                                #
                              </div>

                              <div>

                                <div className="mobile-id-text">
                                  {bookingId}
                                </div>

                                <div className="mobile-date-text">
                                  {formatDate(
                                    booking.createdAt
                                  )}

                                  {formatTime(
                                    booking.createdAt
                                  ) &&
                                    ` • ${formatTime(
                                      booking.createdAt
                                    )}`}
                                </div>

                              </div>

                            </div>

                            <span
                              className={`
                                status-badge
                                ${
                                  status.toLowerCase() ===
                                  "confirmed"
                                    ? "status-confirmed"
                                    : status.toLowerCase() ===
                                      "cancelled"
                                    ? "status-cancelled"
                                    : "status-default"
                                }
                              `}
                            >
                              <span className="status-dot" />
                              {status}
                            </span>

                          </div>

                          {/* CUSTOMER */}

                          <div className="mobile-customer">

                            <div className="mobile-customer-avatar">
                              {getInitials(
                                customerName
                              )}
                            </div>

                            <div>

                              <div className="mobile-customer-name">
                                {customerName}
                              </div>

                              <div className="mobile-customer-email">
                                {customerEmail}
                              </div>

                            </div>

                          </div>

                          {/* EVENT */}

                          <div className="mobile-event">

                            <div className="mobile-event-label">
                              Event
                            </div>

                            <div className="mobile-event-name">
                              {eventName}
                            </div>

                          </div>

                          {/* META */}

                          <div className="mobile-booking-meta">

                            <div className="mobile-meta-item">

                              <div className="mobile-meta-label">
                                Seats
                              </div>

                              <div className="mobile-meta-value">
                                🎟️{" "}
                                {seats}
                              </div>

                            </div>

                            <div className="mobile-meta-item">

                              <div className="mobile-meta-label">
                                Amount
                              </div>

                              <div className="mobile-meta-value">
                                {formatCurrency(
                                  amount
                                )}
                              </div>

                            </div>

                            <div className="mobile-meta-item">

                              <div className="mobile-meta-label">
                                Date
                              </div>

                              <div className="mobile-meta-value">
                                {formatDate(
                                  booking.createdAt
                                )}
                              </div>

                            </div>

                            <div className="mobile-meta-item">

                              <div className="mobile-meta-label">
                                Category
                              </div>

                              <div className="mobile-meta-value">
                                {booking?.event
                                  ?.category ||
                                  "General"}
                              </div>

                            </div>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>
              </>

            )}

          </div>

          {/* =================================================
              INFORMATION
          ================================================= */}

          <div className="booking-info-card">

            <div className="info-icon">
              💡
            </div>

            <div>

              <div className="info-title">
                Booking Overview
              </div>

              <p className="info-text">
                This dashboard displays booking
                information retrieved from your
                EventBook backend, including
                customers, events, seats, booking
                amounts and confirmation status.
              </p>

            </div>

          </div>

          <div
            style={{
              height: "30px",
            }}
          />

        </div>
      </div>
    </>
  );
}

export default ManageBookings;
