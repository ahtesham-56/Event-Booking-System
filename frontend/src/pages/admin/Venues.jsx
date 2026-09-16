import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

function Venues() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadVenues();
  }, []);

  // =========================================================
  // LOAD EVENTS
  // =========================================================

  const loadVenues = async () => {
    try {
      setError("");

      if (events.length > 0) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get("/events");

      const data =
        response.data?.events ||
        response.data ||
        [];

      setEvents(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "VENUES ERROR:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Unable to load venue information. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =========================================================
  // GROUP EVENTS BY VENUE
  // =========================================================

  const venues = useMemo(() => {
    const venueMap = {};

    events.forEach((event) => {
      const venueName =
        event.venue ||
        "Venue Not Specified";

      const location =
        event.location ||
        "Location Not Specified";

      const key =
        `${venueName}|||${location}`.toLowerCase();

      if (!venueMap[key]) {
        venueMap[key] = {
          venue: venueName,
          location,
          events: [],
          totalSeats: 0,
        };
      }

      venueMap[key].events.push(event);

      venueMap[key].totalSeats +=
        Number(event.totalSeats) || 0;
    });

    return Object.values(venueMap);
  }, [events]);

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredVenues = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    if (!searchValue) {
      return venues;
    }

    return venues.filter(
      (venue) => {
        const venueName =
          String(
            venue.venue || ""
          ).toLowerCase();

        const location =
          String(
            venue.location || ""
          ).toLowerCase();

        return (
          venueName.includes(
            searchValue
          ) ||
          location.includes(
            searchValue
          )
        );
      }
    );
  }, [venues, search]);

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalVenues =
    venues.length;

  const totalEvents =
    events.length;

  const totalCapacity =
    venues.reduce(
      (total, venue) =>
        total +
        (Number(
          venue.totalSeats
        ) || 0),
      0
    );

  // =========================================================
  // HELPERS
  // =========================================================

  const getVenueInitials = (
    venue
  ) => {
    const name =
      venue.venue ||
      "Venue";

    const words = String(name)
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 1) {
      return words[0]
        .slice(0, 2)
        .toUpperCase();
    }

    return words
      .slice(0, 2)
      .map(
        (word) =>
          word.charAt(0)
      )
      .join("")
      .toUpperCase();
  };

  const formatNumber = (
    number
  ) => {
    return Number(
      number || 0
    ).toLocaleString("en-IN");
  };

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "—";
    }

    const formatted =
      new Date(date);

    if (
      Number.isNaN(
        formatted.getTime()
      )
    ) {
      return "—";
    }

    return formatted.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <>
      <style>{`
        /* =====================================================
           EVENTBOOK VENUES PAGE
           Same typography as Users.jsx
           ===================================================== */

        .venues-page {
          min-height: 100%;
          background: #f8fafc;
          padding: 28px 24px 40px;
        }

        .venues-container {
          width: 100%;
          max-width: 1500px;
          margin: 0 auto;
        }

        /* =====================================================
           HEADER
           ===================================================== */

        .venues-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 28px;
        }

        .venues-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .venues-page-icon {
          width: 52px;
          height: 52px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            135deg,
            #2563eb,
            #4f46e5
          );
          color: white;
          font-size: 23px;
          flex-shrink: 0;
          box-shadow:
            0 10px 24px rgba(
              37,
              99,
              235,
              .18
            );
        }

        .venues-title {
          margin: 0;
          color: #0f172a;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -.5px;
        }

        .venues-subtitle {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 14px;
        }

        .refresh-venues-btn {
          min-height: 44px;
          padding: 0 18px;
          border-radius: 11px;
          border: 1px solid #dbe3ef;
          background: white;
          color: #334155;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          transition: all .2s ease;
          white-space: nowrap;
        }

        .refresh-venues-btn:hover {
          background: #f8fafc;
          border-color: #93c5fd;
          color: #2563eb;
        }

        .refresh-venues-btn:disabled {
          opacity: .7;
          cursor: not-allowed;
        }

        .venue-refresh-icon {
          font-size: 18px;
        }

        .venue-refresh-spin {
          animation:
            venueSpin .8s linear infinite;
        }

        @keyframes venueSpin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        /* =====================================================
           STAT CARDS
           ===================================================== */

        .venues-stat-card {
          position: relative;
          overflow: hidden;
          height: 100%;
          border: 1px solid #e8edf5;
          border-radius: 18px;
          background: white;
          box-shadow:
            0 6px 20px rgba(
              15,
              23,
              42,
              .05
            );
          transition: all .2s ease;
        }

        .venues-stat-card:hover {
          transform: translateY(-3px);
          box-shadow:
            0 12px 30px rgba(
              15,
              23,
              42,
              .08
            );
        }

        .venues-stat-body {
          padding: 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .venues-stat-label {
          color: #64748b;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .venues-stat-number {
          color: #0f172a;
          font-size: 30px;
          line-height: 1;
          font-weight: 800;
          margin: 0;
        }

        .venues-stat-description {
          color: #94a3b8;
          font-size: 12px;
          margin-top: 8px;
        }

        .venues-stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
        }

        .venue-icon-blue {
          background: #eff6ff;
        }

        .venue-icon-green {
          background: #ecfdf5;
        }

        .venue-icon-purple {
          background: #f5f3ff;
        }

        /* =====================================================
           MAIN CARD
           ===================================================== */

        .venues-main-card {
          margin-top: 24px;
          border: 1px solid #e8edf5;
          border-radius: 18px;
          background: white;
          box-shadow:
            0 6px 20px rgba(
              15,
              23,
              42,
              .05
            );
          overflow: hidden;
        }

        .venues-card-header {
          padding: 22px 24px;
          border-bottom: 1px solid #eef2f7;
        }

        .venues-card-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 18px;
        }

        .venues-card-title {
          margin: 0;
          color: #0f172a;
          font-size: 17px;
          font-weight: 750;
        }

        .venues-result-count {
          min-width: 34px;
          height: 27px;
          padding: 0 9px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #eff6ff;
          color: #2563eb;
          font-size: 12px;
          font-weight: 700;
        }

        /* =====================================================
           SEARCH
           ===================================================== */

        .venues-search-wrapper {
          position: relative;
          width: 100%;
        }

        .venues-search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 16px;
        }

        .venues-search {
          width: 100%;
          height: 46px;
          padding: 0 95px 0 42px;
          border: 1px solid #dbe3ef;
          border-radius: 11px;
          outline: none;
          color: #0f172a;
          font-size: 14px;
        }

        .venues-search:focus {
          border-color: #60a5fa;
          box-shadow:
            0 0 0 3px rgba(
              37,
              99,
              235,
              .08
            );
        }

        .venue-clear-btn {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          height: 32px;
          padding: 0 11px;
          border: 0;
          border-radius: 8px;
          background: #f1f5f9;
          color: #475569;
          font-size: 12px;
          font-weight: 600;
        }

        /* =====================================================
           TABLE
           ===================================================== */

        .venues-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .venues-table {
          width: 100%;
          margin: 0;
          border-collapse: collapse;
        }

        .venues-table thead th {
          padding: 14px 24px;
          background: #f8fafc;
          color: #64748b;
          border-bottom: 1px solid #e8edf5;
          font-size: 11px;
          font-weight: 750;
          letter-spacing: .7px;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .venues-table tbody td {
          padding: 17px 24px;
          border-bottom: 1px solid #eef2f7;
          color: #334155;
          font-size: 14px;
          vertical-align: middle;
        }

        .venues-table tbody tr {
          transition: background .15s ease;
        }

        .venues-table tbody tr:hover {
          background: #f8fbff;
        }

        .venue-cell {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 230px;
        }

        .venue-avatar {
          width: 44px;
          height: 44px;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: linear-gradient(
            135deg,
            #2563eb,
            #4f46e5
          );
          color: white;
          font-size: 13px;
          font-weight: 800;
        }

        .venue-name {
          color: #0f172a;
          font-weight: 700;
          margin-bottom: 3px;
        }

        .venue-location {
          color: #64748b;
          font-size: 12px;
        }

        .venue-number {
          color: #334155;
          font-weight: 650;
        }

        .venue-event-badge {
          display: inline-flex;
          align-items: center;
          padding: 6px 10px;
          border-radius: 999px;
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
          font-size: 11px;
          font-weight: 750;
        }

        .venue-capacity {
          color: #334155;
          font-weight: 700;
        }

        /* =====================================================
           MOBILE VENUE CARDS
           ===================================================== */

        .mobile-venues-list {
          display: none;
        }

        .mobile-venue-card {
          border: 1px solid #e8edf5;
          border-radius: 15px;
          padding: 16px;
          background: white;
          margin-bottom: 12px;
          transition: all .2s ease;
        }

        .mobile-venue-card:hover {
          border-color: #bfdbfe;
          box-shadow:
            0 8px 20px rgba(
              15,
              23,
              42,
              .05
            );
        }

        .mobile-venue-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }

        .mobile-venue-info {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: 0;
        }

        .mobile-venue-name {
          color: #0f172a;
          font-size: 14px;
          font-weight: 750;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mobile-venue-location {
          color: #64748b;
          font-size: 12px;
          margin-top: 2px;
        }

        .mobile-venue-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          padding-top: 13px;
          border-top: 1px solid #eef2f7;
        }

        .mobile-detail-label {
          color: #94a3b8;
          font-size: 10px;
          font-weight: 750;
          text-transform: uppercase;
          letter-spacing: .5px;
          margin-bottom: 4px;
        }

        .mobile-detail-value {
          color: #334155;
          font-size: 12px;
          font-weight: 650;
        }

        /* =====================================================
           LOADING
           ===================================================== */

        .venues-skeleton {
          padding: 20px 24px;
        }

        .venue-skeleton-row {
          height: 62px;
          border-bottom: 1px solid #eef2f7;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .venue-skeleton-avatar {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: #eef2f7;
          animation:
            venueSkeleton 1.3s infinite;
        }

        .venue-skeleton-lines {
          flex: 1;
        }

        .venue-skeleton-line {
          height: 10px;
          border-radius: 5px;
          background: #eef2f7;
          margin-bottom: 7px;
          animation:
            venueSkeleton 1.3s infinite;
        }

        .venue-skeleton-line.short {
          width: 35%;
        }

        .venue-skeleton-line.medium {
          width: 60%;
        }

        @keyframes venueSkeleton {
          0%, 100% {
            opacity: .5;
          }

          50% {
            opacity: 1;
          }
        }

        /* =====================================================
           EMPTY / ERROR
           ===================================================== */

        .venues-state {
          padding: 60px 20px;
          text-align: center;
        }

        .venues-state-icon {
          width: 68px;
          height: 68px;
          margin: auto auto 16px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f5f9;
          font-size: 27px;
        }

        .venues-error-icon {
          background: #fef2f2;
        }

        .venues-state-title {
          margin: 0 0 6px;
          color: #0f172a;
          font-size: 17px;
          font-weight: 750;
        }

        .venues-state-text {
          max-width: 430px;
          margin: 0 auto 18px;
          color: #64748b;
          font-size: 13px;
          line-height: 1.6;
        }

        .venue-retry-btn {
          min-height: 42px;
          padding: 0 18px;
          border: 0;
          border-radius: 10px;
          background: #2563eb;
          color: white;
          font-size: 13px;
          font-weight: 700;
        }

        /* =====================================================
           RESPONSIVE
           ===================================================== */

        @media (max-width: 991px) {
          .venues-page {
            padding: 24px 18px 35px;
          }

          .venues-title {
            font-size: 25px;
          }

          .venues-stat-body {
            padding: 19px;
          }

          .venues-stat-number {
            font-size: 27px;
          }

          .venues-card-header {
            padding: 20px;
          }

          .venues-table thead th,
          .venues-table tbody td {
            padding-left: 18px;
            padding-right: 18px;
          }
        }

        @media (max-width: 767px) {
          .venues-page {
            padding: 20px 14px 30px;
          }

          .venues-header {
            align-items: flex-start;
            flex-direction: column;
            gap: 16px;
          }

          .venues-header-left {
            width: 100%;
          }

          .venues-page-icon {
            width: 46px;
            height: 46px;
            border-radius: 13px;
            font-size: 20px;
          }

          .venues-title {
            font-size: 23px;
          }

          .venues-subtitle {
            font-size: 13px;
          }

          .refresh-venues-btn {
            width: 100%;
          }

          .venues-main-card {
            margin-top: 18px;
            border-radius: 15px;
          }

          .venues-card-header {
            padding: 17px;
          }

          .venues-table-wrapper {
            display: none;
          }

          .mobile-venues-list {
            display: block;
            padding: 14px;
          }
        }

        @media (max-width: 575px) {
          .venues-page {
            padding: 16px 10px 25px;
          }

          .venues-title {
            font-size: 21px;
          }

          .venues-subtitle {
            font-size: 12px;
          }

          .venues-stat-body {
            padding: 17px;
          }

          .venues-stat-number {
            font-size: 25px;
          }

          .venues-stat-icon {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            font-size: 19px;
          }

          .mobile-venues-list {
            padding: 11px;
          }

          .mobile-venue-card {
            padding: 14px;
          }
        }
      `}</style>

      <div className="venues-page">
        <div className="venues-container">

          {/* =================================================
              HEADER
              ================================================= */}

          <div className="venues-header">

            <div className="venues-header-left">

              <div className="venues-page-icon">
                📍
              </div>

              <div>
                <h1 className="venues-title">
                  Venues
                </h1>

                <p className="venues-subtitle">
                  Manage event locations and
                  venue capacity.
                </p>
              </div>

            </div>

            <button
              type="button"
              className="refresh-venues-btn"
              onClick={loadVenues}
              disabled={
                loading || refreshing
              }
            >
              <span
                className={
                  refreshing
                    ? "venue-refresh-icon venue-refresh-spin"
                    : "venue-refresh-icon"
                }
              >
                ↻
              </span>

              {refreshing
                ? "Refreshing..."
                : "Refresh Venues"}
            </button>

          </div>

          {/* =================================================
              STATS
              ================================================= */}

          <div className="row g-3">

            <div className="col-12 col-md-4">

              <div className="venues-stat-card">

                <div className="venues-stat-body">

                  <div>

                    <div className="venues-stat-label">
                      Total Venues
                    </div>

                    <h3 className="venues-stat-number">
                      {totalVenues}
                    </h3>

                    <div className="venues-stat-description">
                      Event locations
                    </div>

                  </div>

                  <div className="venues-stat-icon venue-icon-blue">
                    📍
                  </div>

                </div>

              </div>

            </div>

            <div className="col-12 col-md-4">

              <div className="venues-stat-card">

                <div className="venues-stat-body">

                  <div>

                    <div className="venues-stat-label">
                      Active Events
                    </div>

                    <h3 className="venues-stat-number">
                      {totalEvents}
                    </h3>

                    <div className="venues-stat-description">
                      Events using venues
                    </div>

                  </div>

                  <div className="venues-stat-icon venue-icon-green">
                    🎫
                  </div>

                </div>

              </div>

            </div>

            <div className="col-12 col-md-4">

              <div className="venues-stat-card">

                <div className="venues-stat-body">

                  <div>

                    <div className="venues-stat-label">
                      Total Capacity
                    </div>

                    <h3 className="venues-stat-number">
                      {formatNumber(
                        totalCapacity
                      )}
                    </h3>

                    <div className="venues-stat-description">
                      Combined event seats
                    </div>

                  </div>

                  <div className="venues-stat-icon venue-icon-purple">
                    🪑
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              MAIN CARD
              ================================================= */}

          <div className="venues-main-card">

            <div className="venues-card-header">

              <div className="venues-card-title-row">

                <h2 className="venues-card-title">
                  Venue Directory
                </h2>

                <span className="venues-result-count">
                  {filteredVenues.length}
                </span>

              </div>

              <div className="venues-search-wrapper">

                <span className="venues-search-icon">
                  🔍
                </span>

                <input
                  type="search"
                  className="venues-search"
                  placeholder="Search by venue or location..."
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
                    className="venue-clear-btn"
                    onClick={clearSearch}
                  >
                    Clear
                  </button>
                )}

              </div>

            </div>

            {/* =================================================
                ERROR
                ================================================= */}

            {!loading && error ? (

              <div className="venues-state">

                <div className="venues-state-icon venues-error-icon">
                  ⚠️
                </div>

                <h3 className="venues-state-title">
                  Unable to load venues
                </h3>

                <p className="venues-state-text">
                  {error}
                </p>

                <button
                  type="button"
                  className="venue-retry-btn"
                  onClick={loadVenues}
                >
                  Try Again
                </button>

              </div>

            ) : loading ? (

              /* ===============================================
                 LOADING
                 =============================================== */

              <div className="venues-skeleton">

                {[1, 2, 3, 4, 5].map(
                  (item) => (
                    <div
                      className="venue-skeleton-row"
                      key={item}
                    >

                      <div className="venue-skeleton-avatar" />

                      <div className="venue-skeleton-lines">

                        <div className="venue-skeleton-line medium" />

                        <div className="venue-skeleton-line short" />

                      </div>

                    </div>
                  )
                )}

              </div>

            ) : filteredVenues.length === 0 ? (

              /* ===============================================
                 EMPTY
                 =============================================== */

              <div className="venues-state">

                <div className="venues-state-icon">
                  📍
                </div>

                <h3 className="venues-state-title">
                  No venues found
                </h3>

                <p className="venues-state-text">
                  {search
                    ? "No venues match your search."
                    : "No venue information is currently available from your events."}
                </p>

                {search && (
                  <button
                    type="button"
                    className="venue-retry-btn"
                    onClick={clearSearch}
                  >
                    Clear Search
                  </button>
                )}

              </div>

            ) : (

              <>
                {/* =============================================
                    DESKTOP TABLE
                    ============================================= */}

                <div className="venues-table-wrapper">

                  <table className="venues-table">

                    <thead>

                      <tr>
                        <th>Venue</th>
                        <th>Location</th>
                        <th>Events</th>
                        <th>Total Capacity</th>
                      </tr>

                    </thead>

                    <tbody>

                      {filteredVenues.map(
                        (venue, index) => (

                          <tr
                            key={
                              `${venue.venue}-${venue.location}-${index}`
                            }
                          >

                            <td>

                              <div className="venue-cell">

                                <div className="venue-avatar">
                                  {getVenueInitials(
                                    venue
                                  )}
                                </div>

                                <div>

                                  <div className="venue-name">
                                    {venue.venue}
                                  </div>

                                  <div className="venue-location">
                                    Event Venue
                                  </div>

                                </div>

                              </div>

                            </td>

                            <td>
                              {venue.location}
                            </td>

                            <td>

                              <span className="venue-event-badge">
                                {venue.events.length}{" "}
                                {venue.events.length ===
                                1
                                  ? "Event"
                                  : "Events"}
                              </span>

                            </td>

                            <td>

                              <span className="venue-capacity">
                                {formatNumber(
                                  venue.totalSeats
                                )}{" "}
                                seats
                              </span>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

                {/* =============================================
                    MOBILE CARDS
                    ============================================= */}

                <div className="mobile-venues-list">

                  {filteredVenues.map(
                    (venue, index) => (

                      <div
                        className="mobile-venue-card"
                        key={
                          `${venue.venue}-${venue.location}-${index}`
                        }
                      >

                        <div className="mobile-venue-top">

                          <div className="mobile-venue-info">

                            <div className="venue-avatar">
                              {getVenueInitials(
                                venue
                              )}
                            </div>

                            <div>

                              <div className="mobile-venue-name">
                                {venue.venue}
                              </div>

                              <div className="mobile-venue-location">
                                {venue.location}
                              </div>

                            </div>

                          </div>

                          <span className="venue-event-badge">
                            {venue.events.length}
                          </span>

                        </div>

                        <div className="mobile-venue-details">

                          <div>

                            <div className="mobile-detail-label">
                              Events
                            </div>

                            <div className="mobile-detail-value">
                              {venue.events.length}{" "}
                              {venue.events.length ===
                              1
                                ? "Event"
                                : "Events"}
                            </div>

                          </div>

                          <div>

                            <div className="mobile-detail-label">
                              Capacity
                            </div>

                            <div className="mobile-detail-value">
                              {formatNumber(
                                venue.totalSeats
                              )}{" "}
                              Seats
                            </div>

                          </div>

                        </div>

                      </div>

                    )
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

export default Venues;