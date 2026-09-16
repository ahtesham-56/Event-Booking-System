
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getEvents,
  deleteEvent,
} from "../../services/eventService";

function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // =========================================================
  // LOAD EVENTS
  // =========================================================

  const loadEvents = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getEvents();

      console.log("EVENT DATA:", data);

      const eventList = Array.isArray(data)
        ? data
        : Array.isArray(data?.events)
        ? data.events
        : [];

      setEvents(eventList);
    } catch (err) {
      console.error("MANAGE EVENTS ERROR:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load events. Please try again."
      );

      if (!isRefresh) {
        setEvents([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // =========================================================
  // DELETE EVENT
  // =========================================================

  const handleDelete = async (id) => {
    const selectedEvent = events.find(
      (event) => event._id === id
    );

    const eventName =
      selectedEvent?.title || "this event";

    const confirmed = window.confirm(
      `Are you sure you want to delete "${eventName}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await deleteEvent(id);

      setEvents((previousEvents) =>
        previousEvents.filter(
          (event) => event._id !== id
        )
      );
    } catch (err) {
      console.error("DELETE EVENT ERROR:", err);

      window.alert(
        err?.response?.data?.message ||
          "Failed to delete event. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================================
  // IMAGE URL
  // =========================================================

  const getImageUrl = (banner) => {
    if (!banner) {
      return "https://placehold.co/600x400?text=No+Event+Image";
    }

    let imageUrl = String(banner).trim();

    // Handles accidental Markdown image format:
    // ![image](https://...)
    const markdownMatch = imageUrl.match(
      /!\[.*?\]\((.*?)\)/
    );

    if (markdownMatch?.[1]) {
      imageUrl = markdownMatch[1];
    }

    // Handles accidental markdown link:
    // [image](https://...)
    const linkMatch = imageUrl.match(
      /^\[.*?\]\((.*?)\)$/
    );

    if (linkMatch?.[1]) {
      imageUrl = linkMatch[1];
    }

    return imageUrl || "https://placehold.co/600x400?text=No+Event+Image";
  };

  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "Date not set";
    }

    try {
      const rawDate = String(date);

      // Prevent timezone shifting for YYYY-MM-DD values.
      const datePart = rawDate.split("T")[0];

      const parts = datePart.split("-");

      if (parts.length === 3) {
        const [year, month, day] = parts;

        const safeDate = new Date(
          Number(year),
          Number(month) - 1,
          Number(day)
        );

        if (!Number.isNaN(safeDate.getTime())) {
          return safeDate.toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          );
        }
      }

      const formatted = new Date(date);

      if (Number.isNaN(formatted.getTime())) {
        return "Date not set";
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
      return "Date not set";
    }
  };

  // =========================================================
  // TIME FORMAT
  // =========================================================

  const formatTime = (time) => {
    if (!time) {
      return "Time not set";
    }

    try {
      const value = String(time).trim();

      // Already in simple HH:mm format.
      const match = value.match(
        /^(\d{1,2}):(\d{2})/
      );

      if (match) {
        const hours = Number(match[1]);
        const minutes = Number(match[2]);

        if (
          hours >= 0 &&
          hours <= 23 &&
          minutes >= 0 &&
          minutes <= 59
        ) {
          const tempDate = new Date();

          tempDate.setHours(
            hours,
            minutes,
            0,
            0
          );

          return tempDate.toLocaleTimeString(
            "en-IN",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          );
        }
      }

      return value;
    } catch {
      return String(time);
    }
  };

  // =========================================================
  // CATEGORIES
  // =========================================================

  const categories = useMemo(() => {
    const categorySet = new Set();

    events.forEach((event) => {
      if (event.category) {
        categorySet.add(event.category);
      }
    });

    return Array.from(categorySet).sort(
      (a, b) => a.localeCompare(b)
    );
  }, [events]);

  // =========================================================
  // FILTER EVENTS
  // =========================================================

  const filteredEvents = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return events.filter((event) => {
      const title =
        event.title?.toLowerCase() || "";

      const category =
        event.category?.toLowerCase() || "";

      const venue =
        event.venue?.toLowerCase() || "";

      const location =
        event.location?.toLowerCase() || "";

      const matchesSearch =
        !searchValue ||
        title.includes(searchValue) ||
        category.includes(searchValue) ||
        venue.includes(searchValue) ||
        location.includes(searchValue);

      const matchesCategory =
        categoryFilter === "All" ||
        category === categoryFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    events,
    search,
    categoryFilter,
  ]);

  // =========================================================
  // SUMMARY
  // =========================================================

  const totalEvents = events.length;

  const totalCategories = categories.length;

  const totalSeats = events.reduce(
    (total, event) =>
      total +
      Number(
        event.totalSeats ??
          event.seats ??
          0
      ),
    0
  );

  const availableSeats = events.reduce(
    (total, event) =>
      total +
      Number(
        event.availableSeats ?? 0
      ),
    0
  );

  const bookedSeats = Math.max(
    0,
    totalSeats - availableSeats
  );

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("All");
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <>
        <style>{`
          .manage-events-loading {
            min-height: 70vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            background: #f8fafc;
          }

          .manage-events-loading-card {
            width: 100%;
            max-width: 430px;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            padding: 42px 30px;
            text-align: center;
            box-shadow: 0 15px 45px rgba(15, 23, 42, 0.07);
          }

          .loading-circle {
            width: 48px;
            height: 48px;
            border: 4px solid #dbeafe;
            border-top-color: #2563eb;
            border-radius: 50%;
            animation: manageEventsSpin 0.8s linear infinite;
            margin: 0 auto 18px;
          }

          @keyframes manageEventsSpin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>

        <div className="manage-events-loading">
          <div className="manage-events-loading-card">
            <div className="loading-circle" />

            <h5 className="fw-bold mb-2">
              Loading Events
            </h5>

            <p className="text-muted mb-0 small">
              Please wait while we fetch your
              event information.
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

        .manage-events-page {
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

        .manage-events-container {
          width: 100%;
          max-width: 1500px;
          margin: 0 auto;
        }

        /* =====================================================
           HEADER
        ===================================================== */

        .manage-events-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 25px;
        }

        .manage-events-eyebrow {
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

        .manage-events-title {
          color: #0f172a;
          font-size: clamp(27px, 3vw, 34px);
          font-weight: 800;
          letter-spacing: -0.8px;
          margin: 0 0 6px;
        }

        .manage-events-subtitle {
          color: #64748b;
          font-size: 14px;
          margin: 0;
          line-height: 1.6;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-shrink: 0;
        }

        .manage-action-btn {
          min-height: 44px;
          border-radius: 11px;
          padding: 0 17px;
          font-size: 13px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .manage-refresh-btn {
          background: #ffffff;
          color: #475569;
          border: 1px solid #dbe2ea;
        }

        .manage-refresh-btn:hover:not(:disabled) {
          color: #2563eb;
          border-color: #bfdbfe;
          background: #eff6ff;
        }

        .manage-refresh-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .manage-add-btn {
          background: linear-gradient(
            135deg,
            #2563eb,
            #1d4ed8
          );
          color: #ffffff;
          border: 1px solid #2563eb;
          box-shadow:
            0 8px 20px rgba(37, 99, 235, 0.18);
        }

        .manage-add-btn:hover {
          color: #ffffff;
          transform: translateY(-1px);
          box-shadow:
            0 11px 25px rgba(37, 99, 235, 0.24);
        }

        .refresh-spinner {
          width: 15px;
          height: 15px;
          border: 2px solid #cbd5e1;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: refreshSpin 0.7s linear infinite;
        }

        @keyframes refreshSpin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =====================================================
           ERROR
        ===================================================== */

        .manage-events-error {
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
           STAT CARDS
        ===================================================== */

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-bottom: 22px;
        }

        .event-stat-card {
          background: #ffffff;
          border: 1px solid #e5eaf0;
          border-radius: 17px;
          padding: 20px;
          box-shadow:
            0 8px 28px rgba(15, 23, 42, 0.045);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .event-stat-card:hover {
          transform: translateY(-2px);
          box-shadow:
            0 13px 32px rgba(15, 23, 42, 0.075);
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
          font-size: 28px;
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
          font-size: 20px;
          flex-shrink: 0;
        }

        .stat-blue {
          background: #eff6ff;
          color: #2563eb;
        }

        .stat-purple {
          background: #f5f3ff;
          color: #7c3aed;
        }

        .stat-green {
          background: #ecfdf5;
          color: #059669;
        }

        .stat-orange {
          background: #fff7ed;
          color: #ea580c;
        }

        .stat-footer {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #94a3b8;
          font-size: 11px;
          margin-top: 12px;
        }

        /* =====================================================
           FILTER CARD
        ===================================================== */

        .filter-card {
          background: #ffffff;
          border: 1px solid #e5eaf0;
          border-radius: 17px;
          padding: 16px;
          margin-bottom: 20px;
          box-shadow:
            0 8px 28px rgba(15, 23, 42, 0.045);
        }

        .filter-row {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .search-wrapper {
          position: relative;
          flex: 1;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 15px;
          pointer-events: none;
        }

        .event-search {
          width: 100%;
          height: 45px;
          border: 1px solid #dbe2ea;
          border-radius: 10px;
          padding: 0 40px 0 40px;
          color: #0f172a;
          background: #ffffff;
          outline: none;
          font-size: 13px;
          transition: all 0.2s ease;
        }

        .event-search::placeholder {
          color: #94a3b8;
        }

        .event-search:focus {
          border-color: #2563eb;
          box-shadow:
            0 0 0 4px rgba(37, 99, 235, 0.08);
        }

        .clear-search {
          position: absolute;
          right: 11px;
          top: 50%;
          transform: translateY(-50%);
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

        .category-select {
          height: 45px;
          min-width: 175px;
          border: 1px solid #dbe2ea;
          border-radius: 10px;
          padding: 0 35px 0 13px;
          color: #334155;
          background-color: #ffffff;
          outline: none;
          font-size: 13px;
          cursor: pointer;
        }

        .category-select:focus {
          border-color: #2563eb;
          box-shadow:
            0 0 0 4px rgba(37, 99, 235, 0.08);
        }

        .result-count {
          white-space: nowrap;
          padding: 0 8px;
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
        }

        /* =====================================================
           EVENTS CARD
        ===================================================== */

        .events-card {
          background: #ffffff;
          border: 1px solid #e5eaf0;
          border-radius: 19px;
          overflow: hidden;
          box-shadow:
            0 10px 35px rgba(15, 23, 42, 0.05);
        }

        .events-card-header {
          padding: 20px 22px;
          border-bottom: 1px solid #edf0f3;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .events-heading {
          color: #0f172a;
          font-size: 17px;
          font-weight: 800;
          margin: 0 0 3px;
        }

        .events-description {
          color: #94a3b8;
          font-size: 12px;
          margin: 0;
        }

        .event-count-badge {
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

        .events-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .events-table {
          width: 100%;
          min-width: 1050px;
          border-collapse: separate;
          border-spacing: 0;
        }

        .events-table thead th {
          background: #f8fafc;
          color: #64748b;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.45px;
          text-transform: uppercase;
          padding: 13px 14px;
          border-bottom: 1px solid #e2e8f0;
          white-space: nowrap;
        }

        .events-table thead th:first-child {
          padding-left: 22px;
        }

        .events-table thead th:last-child {
          padding-right: 22px;
        }

        .events-table tbody td {
          padding: 15px 14px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }

        .events-table tbody tr:last-child td {
          border-bottom: none;
        }

        .events-table tbody tr {
          transition: background 0.15s ease;
        }

        .events-table tbody tr:hover {
          background: #fafcff;
        }

        .events-table tbody td:first-child {
          padding-left: 22px;
        }

        .events-table tbody td:last-child {
          padding-right: 22px;
        }

        /* =====================================================
           EVENT CELL
        ===================================================== */

        .event-info {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 245px;
        }

        .event-image {
          width: 72px;
          height: 52px;
          border-radius: 9px;
          object-fit: cover;
          flex-shrink: 0;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
        }

        .event-title {
          color: #0f172a;
          font-size: 13px;
          font-weight: 750;
          line-height: 1.35;
          max-width: 190px;
          margin-bottom: 4px;
        }

        .event-id {
          color: #94a3b8;
          font-size: 10px;
        }

        .category-badge {
          display: inline-flex;
          align-items: center;
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #dbeafe;
          border-radius: 7px;
          padding: 5px 9px;
          font-size: 10px;
          font-weight: 750;
          white-space: nowrap;
        }

        .date-main {
          color: #334155;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }

        .date-time {
          color: #94a3b8;
          font-size: 10px;
          margin-top: 3px;
        }

        .venue-main {
          color: #334155;
          font-size: 12px;
          font-weight: 700;
          max-width: 155px;
        }

        .venue-location {
          color: #94a3b8;
          font-size: 10px;
          margin-top: 3px;
          max-width: 155px;
        }

        .price-value {
          color: #0f172a;
          font-size: 13px;
          font-weight: 800;
          white-space: nowrap;
        }

        .seat-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #f8fafc;
          color: #475569;
          border: 1px solid #e2e8f0;
          border-radius: 7px;
          padding: 5px 9px;
          font-size: 10px;
          font-weight: 700;
          white-space: nowrap;
        }

        .action-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 6px;
        }

        .table-action {
          min-width: 55px;
          height: 34px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 750;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .edit-action {
          color: #2563eb;
          background: #eff6ff;
          border: 1px solid #dbeafe;
        }

        .edit-action:hover {
          color: #1d4ed8;
          background: #dbeafe;
        }

        .delete-action {
          color: #dc2626;
          background: #fef2f2;
          border: 1px solid #fecaca;
        }

        .delete-action:hover:not(:disabled) {
          color: #b91c1c;
          background: #fee2e2;
        }

        .delete-action:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .mini-spinner {
          width: 13px;
          height: 13px;
          border: 2px solid #fecaca;
          border-top-color: #dc2626;
          border-radius: 50%;
          animation: miniSpin 0.65s linear infinite;
        }

        @keyframes miniSpin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =====================================================
           MOBILE EVENT CARD
        ===================================================== */

        .mobile-events {
          display: none;
        }

        .mobile-event-card {
          background: #ffffff;
          border: 1px solid #e5eaf0;
          border-radius: 15px;
          padding: 13px;
          margin-bottom: 12px;
          box-shadow:
            0 5px 18px rgba(15, 23, 42, 0.035);
        }

        .mobile-event-top {
          display: flex;
          gap: 12px;
        }

        .mobile-event-image {
          width: 82px;
          height: 65px;
          border-radius: 10px;
          object-fit: cover;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          flex-shrink: 0;
        }

        .mobile-event-content {
          min-width: 0;
          flex: 1;
        }

        .mobile-event-title {
          color: #0f172a;
          font-size: 14px;
          font-weight: 800;
          line-height: 1.35;
          margin-bottom: 4px;
        }

        .mobile-event-id {
          color: #94a3b8;
          font-size: 9px;
          margin-bottom: 7px;
        }

        .mobile-event-meta {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
          margin-top: 14px;
          padding-top: 13px;
          border-top: 1px solid #f1f5f9;
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
          font-weight: 700;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .mobile-event-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 13px;
        }

        .mobile-action {
          height: 38px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 750;
          text-decoration: none;
        }

        .mobile-edit {
          color: #2563eb;
          background: #eff6ff;
          border: 1px solid #dbeafe;
        }

        .mobile-delete {
          color: #dc2626;
          background: #fef2f2;
          border: 1px solid #fecaca;
        }

        .mobile-delete:disabled {
          opacity: 0.55;
        }

        /* =====================================================
           EMPTY STATE
        ===================================================== */

        .empty-state {
          padding: 70px 25px;
          text-align: center;
        }

        .empty-icon {
          width: 75px;
          height: 75px;
          border-radius: 22px;
          background: #f1f5f9;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          margin: 0 auto 18px;
        }

        .empty-title {
          color: #0f172a;
          font-size: 18px;
          font-weight: 800;
          margin-bottom: 7px;
        }

        .empty-description {
          max-width: 430px;
          margin: 0 auto 20px;
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.6;
        }

        .empty-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          padding: 0 18px;
          border-radius: 9px;
          background: #2563eb;
          color: #ffffff;
          font-size: 12px;
          font-weight: 750;
          text-decoration: none;
          border: none;
        }

        .empty-button:hover {
          color: #ffffff;
          background: #1d4ed8;
        }

        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 1199px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .manage-events-page {
            padding-left: 20px;
            padding-right: 20px;
          }
        }

        @media (max-width: 991.98px) {
          .manage-events-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .header-actions {
            width: 100%;
          }

          .manage-action-btn {
            flex: 1;
          }

          .filter-row {
            flex-wrap: wrap;
          }

          .search-wrapper {
            min-width: 100%;
          }

          .category-select {
            flex: 1;
          }

          .result-count {
            margin-left: auto;
          }
        }

        @media (max-width: 767.98px) {
          .manage-events-page {
            padding: 20px 12px 35px;
          }

          .manage-events-header {
            margin-bottom: 20px;
          }

          .manage-events-title {
            font-size: 27px;
          }

          .manage-events-subtitle {
            font-size: 12px;
          }

          .header-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .manage-action-btn {
            width: 100%;
            padding: 0 10px;
            font-size: 12px;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }

          .event-stat-card {
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
            font-size: 23px;
          }

          .stat-label {
            font-size: 8px;
          }

          .stat-footer {
            font-size: 9px;
          }

          .filter-card {
            padding: 12px;
            border-radius: 14px;
          }

          .filter-row {
            display: grid;
            grid-template-columns: 1fr;
          }

          .search-wrapper {
            width: 100%;
            min-width: 0;
          }

          .category-select {
            width: 100%;
            min-width: 0;
          }

          .result-count {
            margin-left: 0;
            padding: 0;
          }

          .events-card {
            border-radius: 15px;
          }

          .events-card-header {
            padding: 16px;
          }

          .events-heading {
            font-size: 15px;
          }

          .events-description {
            font-size: 10px;
          }

          .event-count-badge {
            font-size: 9px;
            padding: 6px 9px;
          }

          .events-table-wrapper {
            display: none;
          }

          .mobile-events {
            display: block;
            padding: 12px;
          }

          .empty-state {
            padding: 55px 18px;
          }

          .manage-events-error {
            align-items: flex-start;
            flex-direction: column;
          }

          .retry-button {
            width: 100%;
          }
        }

        @media (max-width: 420px) {
          .manage-events-page {
            padding-left: 9px;
            padding-right: 9px;
          }

          .manage-events-title {
            font-size: 24px;
          }

          .stats-grid {
            gap: 8px;
          }

          .event-stat-card {
            padding: 13px;
          }

          .stat-value {
            font-size: 21px;
          }

          .stat-icon {
            width: 32px;
            height: 32px;
            font-size: 14px;
          }

          .mobile-event-meta {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>

      <div className="manage-events-page">
        <div className="manage-events-container">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="manage-events-header">

            <div>
              <div className="manage-events-eyebrow">
                <span className="eyebrow-dot" />
                Admin Panel
                <span>•</span>
                Event Management
              </div>

              <h1 className="manage-events-title">
                Manage Events
              </h1>

              <p className="manage-events-subtitle">
                Create, edit and manage all events
                available on your EventBook platform.
              </p>
            </div>

            <div className="header-actions">

              <button
                type="button"
                className="manage-action-btn manage-refresh-btn"
                onClick={() => loadEvents(true)}
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
                    Refresh
                  </>
                )}
              </button>

              <Link
                to="/admin/events/add"
                className="manage-action-btn manage-add-btn"
              >
                +
                Add Event
              </Link>

            </div>

          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="manage-events-error">

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
                onClick={() => loadEvents()}
              >
                Try Again
              </button>

            </div>
          )}

          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="stats-grid">

            {/* TOTAL EVENTS */}

            <div className="event-stat-card">
              <div className="stat-top">

                <div>
                  <div className="stat-label">
                    Total Events
                  </div>

                  <div className="stat-value">
                    {totalEvents}
                  </div>
                </div>

                <div className="stat-icon stat-blue">
                  📅
                </div>

              </div>

              <div className="stat-footer">
                <span>•</span>
                <span>
                  Events currently listed
                </span>
              </div>
            </div>

            {/* CATEGORIES */}

            <div className="event-stat-card">
              <div className="stat-top">

                <div>
                  <div className="stat-label">
                    Categories
                  </div>

                  <div className="stat-value">
                    {totalCategories}
                  </div>
                </div>

                <div className="stat-icon stat-purple">
                  🏷️
                </div>

              </div>

              <div className="stat-footer">
                <span>•</span>
                <span>
                  Unique event categories
                </span>
              </div>
            </div>

            {/* TOTAL SEATS */}

            <div className="event-stat-card">
              <div className="stat-top">

                <div>
                  <div className="stat-label">
                    Total Seats
                  </div>

                  <div className="stat-value">
                    {totalSeats.toLocaleString(
                      "en-IN"
                    )}
                  </div>
                </div>

                <div className="stat-icon stat-green">
                  🎟️
                </div>

              </div>

              <div className="stat-footer">
                <span>•</span>
                <span>
                  Capacity across all events
                </span>
              </div>
            </div>

            {/* AVAILABLE */}

            <div className="event-stat-card">
              <div className="stat-top">

                <div>
                  <div className="stat-label">
                    Available Seats
                  </div>

                  <div className="stat-value">
                    {availableSeats.toLocaleString(
                      "en-IN"
                    )}
                  </div>
                </div>

                <div className="stat-icon stat-orange">
                  🪑
                </div>

              </div>

              <div className="stat-footer">
                <span>•</span>

                <span>
                  {bookedSeats.toLocaleString(
                    "en-IN"
                  )}{" "}
                  seats booked
                </span>
              </div>
            </div>

          </div>

          {/* =================================================
              SEARCH + FILTER
          ================================================= */}

          <div className="filter-card">

            <div className="filter-row">

              <div className="search-wrapper">

                <span className="search-icon">
                  🔍
                </span>

                <input
                  type="search"
                  className="event-search"
                  placeholder="Search by event name, category, venue or location..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
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
                className="category-select"
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(
                    e.target.value
                  )
                }
              >
                <option value="All">
                  All Categories
                </option>

                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>

              {(search ||
                categoryFilter !== "All") && (
                <button
                  type="button"
                  className="manage-action-btn manage-refresh-btn"
                  onClick={clearFilters}
                  style={{
                    minHeight: "45px",
                  }}
                >
                  Clear
                </button>
              )}

              <div className="result-count">
                Showing{" "}
                <strong>
                  {filteredEvents.length}
                </strong>{" "}
                of {events.length}
              </div>

            </div>

          </div>

          {/* =================================================
              EVENTS CARD
          ================================================= */}

          <div className="events-card">

            <div className="events-card-header">

              <div>
                <h2 className="events-heading">
                  All Events
                </h2>

                <p className="events-description">
                  Manage your currently listed
                  events and their details.
                </p>
              </div>

              <div className="event-count-badge">
                {events.length}{" "}
                {events.length === 1
                  ? "Event"
                  : "Events"}
              </div>

            </div>

            {/* =================================================
                EMPTY / NO SEARCH RESULTS
            ================================================= */}

            {filteredEvents.length === 0 ? (

              <div className="empty-state">

                <div className="empty-icon">
                  {events.length === 0
                    ? "📅"
                    : "🔍"}
                </div>

                <h3 className="empty-title">
                  {events.length === 0
                    ? "No Events Yet"
                    : "No Matching Events"}
                </h3>

                <p className="empty-description">
                  {events.length === 0
                    ? "You haven't created any events yet. Create your first event to start managing your event platform."
                    : "No events match your current search or category filter. Try changing your search criteria."}
                </p>

                {events.length === 0 ? (

                  <Link
                    to="/admin/events/add"
                    className="empty-button"
                  >
                    + Create First Event
                  </Link>

                ) : (

                  <button
                    type="button"
                    className="empty-button"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </button>

                )}

              </div>

            ) : (

              <>
                {/* =================================================
                    DESKTOP TABLE
                ================================================= */}

                <div className="events-table-wrapper">

                  <table className="events-table">

                    <thead>
                      <tr>

                        <th>
                          Event
                        </th>

                        <th>
                          Category
                        </th>

                        <th>
                          Date & Time
                        </th>

                        <th>
                          Venue
                        </th>

                        <th>
                          Price
                        </th>

                        <th>
                          Seats
                        </th>

                        <th
                          style={{
                            textAlign: "right",
                          }}
                        >
                          Actions
                        </th>

                      </tr>
                    </thead>

                    <tbody>

                      {filteredEvents.map(
                        (event) => {

                          const totalEventSeats =
                            Number(
                              event.totalSeats ??
                                event.seats ??
                                0
                            );

                          const eventAvailableSeats =
                            Math.max(
                              0,
                              Number(
                                event.availableSeats ??
                                  totalEventSeats
                              )
                            );

                          return (
                            <tr
                              key={event._id}
                            >

                              {/* EVENT */}

                              <td>

                                <div className="event-info">

                                  <img
                                    src={getImageUrl(
                                      event.banner
                                    )}
                                    alt={
                                      event.title ||
                                      "Event"
                                    }
                                    className="event-image"
                                    loading="lazy"
                                    onError={(e) => {
                                      e.currentTarget.onerror =
                                        null;

                                      e.currentTarget.src =
                                        "https://placehold.co/600x400?text=No+Event+Image";
                                    }}
                                  />

                                  <div>
                                    <div className="event-title">
                                      {event.title ||
                                        "Untitled Event"}
                                    </div>

                                    <div className="event-id">
                                      ID:{" "}
                                      {event._id
                                        ? event._id.slice(
                                            -8
                                          ).toUpperCase()
                                        : "N/A"}
                                    </div>
                                  </div>

                                </div>

                              </td>

                              {/* CATEGORY */}

                              <td>

                                <span className="category-badge">
                                  {event.category ||
                                    "General"}
                                </span>

                              </td>

                              {/* DATE */}

                              <td>

                                <div className="date-main">
                                  {formatDate(
                                    event.date
                                  )}
                                </div>

                                <div className="date-time">
                                  {formatTime(
                                    event.time
                                  )}
                                </div>

                              </td>

                              {/* VENUE */}

                              <td>

                                <div className="venue-main">
                                  {event.venue ||
                                    "Venue not set"}
                                </div>

                                {event.location && (
                                  <div className="venue-location">
                                    📍{" "}
                                    {event.location}
                                  </div>
                                )}

                              </td>

                              {/* PRICE */}

                              <td>

                                <div className="price-value">
                                  ₹
                                  {Number(
                                    event.ticketPrice ||
                                      0
                                  ).toLocaleString(
                                    "en-IN"
                                  )}
                                </div>

                              </td>

                              {/* SEATS */}

                              <td>

                                <span className="seat-badge">
                                  {eventAvailableSeats}
                                  /
                                  {totalEventSeats}
                                  {" "}available
                                </span>

                              </td>

                              {/* ACTIONS */}

                              <td>

                                <div className="action-buttons">

                                  <Link
                                    to={`/admin/events/edit/${event._id}`}
                                    className="table-action edit-action"
                                  >
                                    Edit
                                  </Link>

                                  <button
                                    type="button"
                                    className="table-action delete-action"
                                    onClick={() =>
                                      handleDelete(
                                        event._id
                                      )
                                    }
                                    disabled={
                                      deletingId ===
                                      event._id
                                    }
                                  >
                                    {deletingId ===
                                    event._id ? (
                                      <span className="mini-spinner" />
                                    ) : (
                                      "Delete"
                                    )}
                                  </button>

                                </div>

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

                <div className="mobile-events">

                  {filteredEvents.map(
                    (event) => {

                      const totalEventSeats =
                        Number(
                          event.totalSeats ??
                            event.seats ??
                            0
                        );

                      const eventAvailableSeats =
                        Math.max(
                          0,
                          Number(
                            event.availableSeats ??
                              totalEventSeats
                          )
                        );

                      return (
                        <div
                          className="mobile-event-card"
                          key={event._id}
                        >

                          <div className="mobile-event-top">

                            <img
                              src={getImageUrl(
                                event.banner
                              )}
                              alt={
                                event.title ||
                                "Event"
                              }
                              className="mobile-event-image"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.onerror =
                                  null;

                                e.currentTarget.src =
                                  "https://placehold.co/600x400?text=No+Event+Image";
                              }}
                            />

                            <div className="mobile-event-content">

                              <div className="mobile-event-title">
                                {event.title ||
                                  "Untitled Event"}
                              </div>

                              <div className="mobile-event-id">
                                ID:{" "}
                                {event._id
                                  ? event._id
                                      .slice(-8)
                                      .toUpperCase()
                                  : "N/A"}
                              </div>

                              <span className="category-badge">
                                {event.category ||
                                  "General"}
                              </span>

                            </div>

                          </div>

                          <div className="mobile-event-meta">

                            <div className="mobile-meta-item">

                              <div className="mobile-meta-label">
                                Date
                              </div>

                              <div className="mobile-meta-value">
                                {formatDate(
                                  event.date
                                )}
                              </div>

                            </div>

                            <div className="mobile-meta-item">

                              <div className="mobile-meta-label">
                                Time
                              </div>

                              <div className="mobile-meta-value">
                                {formatTime(
                                  event.time
                                )}
                              </div>

                            </div>

                            <div className="mobile-meta-item">

                              <div className="mobile-meta-label">
                                Venue
                              </div>

                              <div className="mobile-meta-value">
                                {event.venue ||
                                  event.location ||
                                  "Not set"}
                              </div>

                            </div>

                            <div className="mobile-meta-item">

                              <div className="mobile-meta-label">
                                Price
                              </div>

                              <div className="mobile-meta-value">
                                ₹
                                {Number(
                                  event.ticketPrice ||
                                    0
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </div>

                            </div>

                            <div className="mobile-meta-item">

                              <div className="mobile-meta-label">
                                Available
                              </div>

                              <div className="mobile-meta-value">
                                {
                                  eventAvailableSeats
                                }{" "}
                                /{" "}
                                {totalEventSeats}
                              </div>

                            </div>

                            <div className="mobile-meta-item">

                              <div className="mobile-meta-label">
                                Location
                              </div>

                              <div className="mobile-meta-value">
                                {event.location ||
                                  "Not set"}
                              </div>

                            </div>

                          </div>

                          <div className="mobile-event-actions">

                            <Link
                              to={`/admin/events/edit/${event._id}`}
                              className="mobile-action mobile-edit"
                            >
                              ✎ Edit Event
                            </Link>

                            <button
                              type="button"
                              className="mobile-action mobile-delete"
                              onClick={() =>
                                handleDelete(
                                  event._id
                                )
                              }
                              disabled={
                                deletingId ===
                                event._id
                              }
                            >
                              {deletingId ===
                              event._id ? (
                                <>
                                  <span
                                    className="mini-spinner"
                                    style={{
                                      marginRight:
                                        "6px",
                                    }}
                                  />
                                  Deleting...
                                </>
                              ) : (
                                "🗑 Delete"
                              )}
                            </button>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>
              </>

            )}

          </div>

        </div>
      </div>
    </>
  );
}

export default ManageEvents;

