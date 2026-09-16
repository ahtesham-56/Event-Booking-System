import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setError("");

      if (users.length > 0) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get("/users");

      const data =
        response.data?.users ||
        response.data ||
        [];

      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("USERS ERROR:", error);

      setError(
        error?.response?.data?.message ||
          "Unable to load users. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return users.filter((user) => {
      const name = String(
        user.name ||
          user.fullName ||
          ""
      ).toLowerCase();

      const email = String(
        user.email || ""
      ).toLowerCase();

      const role = String(
        user.role || "user"
      ).toLowerCase();

      const matchesSearch =
        !searchValue ||
        name.includes(searchValue) ||
        email.includes(searchValue);

      const matchesRole =
        roleFilter === "All" ||
        role === roleFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesRole
      );
    });
  }, [users, search, roleFilter]);

  const totalUsers = users.length;

  const adminUsers = users.filter(
    (user) =>
      String(
        user.role || "user"
      ).toLowerCase() === "admin"
  ).length;

  const normalUsers =
    totalUsers - adminUsers;

  const getUserName = (user) => {
    return (
      user.name ||
      user.fullName ||
      "Unnamed User"
    );
  };

  const getInitials = (user) => {
    const name =
      user.name ||
      user.fullName ||
      user.email ||
      "User";

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
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };

  const getRole = (user) => {
    return user.role || "user";
  };

  const getStatus = (user) => {
    const status = String(
      user.status || ""
    ).toLowerCase();

    if (status === "inactive") {
      return "Inactive";
    }

    if (status === "blocked") {
      return "Blocked";
    }

    return "Active";
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const formatted = new Date(date);

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

  const getUserId = (user) => {
    if (!user._id && !user.id) {
      return "—";
    }

    return String(
      user._id || user.id
    ).slice(-8);
  };

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("All");
  };

  const hasFilters =
    search.trim() !== "" ||
    roleFilter !== "All";

  const getRoleStyle = (role) => {
    if (
      String(role).toLowerCase() ===
      "admin"
    ) {
      return {
        background: "#eff6ff",
        color: "#2563eb",
        border: "1px solid #bfdbfe",
      };
    }

    return {
      background: "#f8fafc",
      color: "#475569",
      border: "1px solid #e2e8f0",
    };
  };

  const getStatusStyle = (status) => {
    if (status === "Inactive") {
      return {
        background: "#f8fafc",
        color: "#64748b",
        border: "1px solid #e2e8f0",
      };
    }

    if (status === "Blocked") {
      return {
        background: "#fef2f2",
        color: "#dc2626",
        border: "1px solid #fecaca",
      };
    }

    return {
      background: "#ecfdf5",
      color: "#059669",
      border: "1px solid #a7f3d0",
    };
  };

  return (
    <>
      <style>{`
        .users-page {
          min-height: 100%;
          background: #f8fafc;
          padding: 28px 24px 40px;
        }

        .users-container {
          width: 100%;
          max-width: 1500px;
          margin: auto;
        }

        .users-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 28px;
        }

        .users-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .users-page-icon {
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
            0 10px 24px rgba(37, 99, 235, 0.18);
        }

        .users-title {
          margin: 0;
          color: #0f172a;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .users-subtitle {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 14px;
        }

        .refresh-users-btn {
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
        }

        .refresh-users-btn:hover {
          background: #f8fafc;
          border-color: #93c5fd;
          color: #2563eb;
        }

        .refresh-users-btn:disabled {
          opacity: .7;
          cursor: not-allowed;
        }

        .refresh-icon {
          font-size: 18px;
        }

        .refresh-spin {
          animation: userSpin .8s linear infinite;
        }

        @keyframes userSpin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        .users-stat-card {
          position: relative;
          overflow: hidden;
          height: 100%;
          border: 1px solid #e8edf5;
          border-radius: 18px;
          background: white;
          box-shadow:
            0 6px 20px rgba(15, 23, 42, .05);
          transition: all .2s ease;
        }

        .users-stat-card:hover {
          transform: translateY(-3px);
          box-shadow:
            0 12px 30px rgba(15, 23, 42, .08);
        }

        .users-stat-body {
          padding: 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .users-stat-label {
          color: #64748b;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .users-stat-number {
          color: #0f172a;
          font-size: 30px;
          line-height: 1;
          font-weight: 800;
          margin: 0;
        }

        .users-stat-description {
          color: #94a3b8;
          font-size: 12px;
          margin-top: 8px;
        }

        .users-stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
        }

        .users-icon-blue {
          background: #eff6ff;
        }

        .users-icon-green {
          background: #ecfdf5;
        }

        .users-icon-purple {
          background: #f5f3ff;
        }

        .users-main-card {
          margin-top: 24px;
          border: 1px solid #e8edf5;
          border-radius: 18px;
          background: white;
          box-shadow:
            0 6px 20px rgba(15, 23, 42, .05);
          overflow: hidden;
        }

        .users-card-header {
          padding: 22px 24px;
          border-bottom: 1px solid #eef2f7;
        }

        .users-card-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .users-card-title {
          margin: 0;
          color: #0f172a;
          font-size: 17px;
          font-weight: 750;
        }

        .users-result-count {
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

        .users-filters {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .users-search-wrapper {
          position: relative;
          flex: 1;
        }

        .users-search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 16px;
        }

        .users-search {
          width: 100%;
          height: 46px;
          padding: 0 15px 0 42px;
          border: 1px solid #dbe3ef;
          border-radius: 11px;
          outline: none;
          color: #0f172a;
          font-size: 14px;
        }

        .users-search:focus {
          border-color: #60a5fa;
          box-shadow:
            0 0 0 3px rgba(37,99,235,.08);
        }

        .users-role-select {
          width: 190px;
          height: 46px;
          padding: 0 14px;
          border: 1px solid #dbe3ef;
          border-radius: 11px;
          background: white;
          color: #334155;
          font-size: 14px;
          outline: none;
        }

        .clear-filters-btn {
          height: 46px;
          padding: 0 14px;
          border-radius: 11px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #475569;
          font-size: 13px;
          font-weight: 600;
        }

        .users-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .users-table {
          width: 100%;
          margin: 0;
          border-collapse: collapse;
        }

        .users-table thead th {
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

        .users-table tbody td {
          padding: 17px 24px;
          border-bottom: 1px solid #eef2f7;
          color: #334155;
          font-size: 14px;
          vertical-align: middle;
        }

        .users-table tbody tr:hover {
          background: #f8fbff;
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 210px;
        }

        .user-avatar {
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

        .user-name {
          color: #0f172a;
          font-weight: 700;
          margin-bottom: 3px;
        }

        .user-id {
          color: #94a3b8;
          font-size: 11px;
          font-family: monospace;
        }

        .user-email {
          color: #475569;
          word-break: break-word;
        }

        .user-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 750;
          white-space: nowrap;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
        }

        .mobile-users-list {
          display: none;
        }

        .mobile-user-card {
          border: 1px solid #e8edf5;
          border-radius: 15px;
          padding: 16px;
          background: white;
          margin-bottom: 12px;
        }

        .mobile-user-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }

        .mobile-user-info {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: 0;
        }

        .mobile-user-name {
          color: #0f172a;
          font-size: 14px;
          font-weight: 750;
        }

        .mobile-user-email {
          color: #64748b;
          font-size: 12px;
          margin-top: 2px;
          word-break: break-word;
        }

        .mobile-user-details {
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
          font-weight: 600;
        }

        .users-skeleton {
          padding: 20px 24px;
        }

        .skeleton-row {
          height: 62px;
          border-bottom: 1px solid #eef2f7;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .skeleton-avatar {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: #eef2f7;
          animation: skeletonPulse 1.3s infinite;
        }

        .skeleton-lines {
          flex: 1;
        }

        .skeleton-line {
          height: 10px;
          border-radius: 5px;
          background: #eef2f7;
          margin-bottom: 7px;
          animation: skeletonPulse 1.3s infinite;
        }

        .skeleton-line.short {
          width: 35%;
        }

        .skeleton-line.medium {
          width: 60%;
        }

        @keyframes skeletonPulse {
          0%, 100% {
            opacity: .5;
          }

          50% {
            opacity: 1;
          }
        }

        .users-state {
          padding: 60px 20px;
          text-align: center;
        }

        .users-state-icon {
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

        .users-error-icon {
          background: #fef2f2;
        }

        .users-state-title {
          margin: 0 0 6px;
          color: #0f172a;
          font-size: 17px;
          font-weight: 750;
        }

        .users-state-text {
          max-width: 430px;
          margin: 0 auto 18px;
          color: #64748b;
          font-size: 13px;
          line-height: 1.6;
        }

        .retry-btn {
          min-height: 42px;
          padding: 0 18px;
          border: 0;
          border-radius: 10px;
          background: #2563eb;
          color: white;
          font-size: 13px;
          font-weight: 700;
        }

        @media (max-width: 767px) {
          .users-page {
            padding: 20px 14px 30px;
          }

          .users-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .users-header-left {
            width: 100%;
          }

          .refresh-users-btn {
            width: 100%;
          }

          .users-main-card {
            margin-top: 18px;
          }

          .users-card-header {
            padding: 17px;
          }

          .users-filters {
            flex-direction: column;
            align-items: stretch;
          }

          .users-search-wrapper,
          .users-role-select,
          .clear-filters-btn {
            width: 100%;
          }

          .users-table-wrapper {
            display: none;
          }

          .mobile-users-list {
            display: block;
            padding: 14px;
          }
        }

        @media (max-width: 575px) {
          .users-page {
            padding: 16px 10px 25px;
          }

          .users-title {
            font-size: 21px;
          }

          .users-subtitle {
            font-size: 12px;
          }

          .users-stat-body {
            padding: 17px;
          }

          .users-stat-number {
            font-size: 25px;
          }

          .mobile-users-list {
            padding: 11px;
          }
        }
      `}</style>

      <div className="users-page">
        <div className="users-container">

          <div className="users-header">

            <div className="users-header-left">

              <div className="users-page-icon">
                👥
              </div>

              <div>
                <h1 className="users-title">
                  Users
                </h1>

                <p className="users-subtitle">
                  Manage EventBook users and
                  account access.
                </p>
              </div>

            </div>

            <button
              type="button"
              className="refresh-users-btn"
              onClick={loadUsers}
              disabled={
                loading || refreshing
              }
            >
              <span
                className={
                  refreshing
                    ? "refresh-icon refresh-spin"
                    : "refresh-icon"
                }
              >
                ↻
              </span>

              {refreshing
                ? "Refreshing..."
                : "Refresh Users"}
            </button>

          </div>

          <div className="row g-3">

            <div className="col-12 col-md-4">
              <div className="users-stat-card">
                <div className="users-stat-body">

                  <div>
                    <div className="users-stat-label">
                      Total Users
                    </div>

                    <h3 className="users-stat-number">
                      {totalUsers}
                    </h3>

                    <div className="users-stat-description">
                      Registered accounts
                    </div>
                  </div>

                  <div className="users-stat-icon users-icon-blue">
                    👥
                  </div>

                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="users-stat-card">
                <div className="users-stat-body">

                  <div>
                    <div className="users-stat-label">
                      Regular Users
                    </div>

                    <h3 className="users-stat-number">
                      {normalUsers}
                    </h3>

                    <div className="users-stat-description">
                      Standard accounts
                    </div>
                  </div>

                  <div className="users-stat-icon users-icon-green">
                    👤
                  </div>

                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="users-stat-card">
                <div className="users-stat-body">

                  <div>
                    <div className="users-stat-label">
                      Administrators
                    </div>

                    <h3 className="users-stat-number">
                      {adminUsers}
                    </h3>

                    <div className="users-stat-description">
                      Admin access accounts
                    </div>
                  </div>

                  <div className="users-stat-icon users-icon-purple">
                    🛡️
                  </div>

                </div>
              </div>
            </div>

          </div>

          <div className="users-main-card">

            <div className="users-card-header">

              <div className="users-card-title-row">

                <h2 className="users-card-title">
                  User Directory
                </h2>

                <span className="users-result-count">
                  {filteredUsers.length}
                </span>

              </div>

              <div className="users-filters">

                <div className="users-search-wrapper">

                  <span className="users-search-icon">
                    🔍
                  </span>

                  <input
                    type="search"
                    className="users-search"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                  />

                </div>

                <select
                  className="users-role-select"
                  value={roleFilter}
                  onChange={(e) =>
                    setRoleFilter(
                      e.target.value
                    )
                  }
                >
                  <option value="All">
                    All Roles
                  </option>

                  <option value="user">
                    Regular Users
                  </option>

                  <option value="admin">
                    Administrators
                  </option>
                </select>

                {hasFilters && (
                  <button
                    type="button"
                    className="clear-filters-btn"
                    onClick={clearFilters}
                  >
                    Clear
                  </button>
                )}

              </div>

            </div>

            {!loading && error ? (

              <div className="users-state">

                <div className="users-state-icon users-error-icon">
                  ⚠️
                </div>

                <h3 className="users-state-title">
                  Unable to load users
                </h3>

                <p className="users-state-text">
                  {error}
                </p>

                <button
                  type="button"
                  className="retry-btn"
                  onClick={loadUsers}
                >
                  Try Again
                </button>

              </div>

            ) : loading ? (

              <div className="users-skeleton">

                {[1, 2, 3, 4, 5].map(
                  (item) => (
                    <div
                      className="skeleton-row"
                      key={item}
                    >
                      <div className="skeleton-avatar" />

                      <div className="skeleton-lines">
                        <div className="skeleton-line medium" />
                        <div className="skeleton-line short" />
                      </div>
                    </div>
                  )
                )}

              </div>

            ) : filteredUsers.length === 0 ? (

              <div className="users-state">

                <div className="users-state-icon">
                  👥
                </div>

                <h3 className="users-state-title">
                  No users found
                </h3>

                <p className="users-state-text">
                  {hasFilters
                    ? "No users match your current search or role filter."
                    : "There are currently no registered users."}
                </p>

                {hasFilters && (
                  <button
                    type="button"
                    className="retry-btn"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </button>
                )}

              </div>

            ) : (

              <>
                <div className="users-table-wrapper">

                  <table className="users-table">

                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>

                      {filteredUsers.map(
                        (user, index) => {

                          const role =
                            getRole(user);

                          const status =
                            getStatus(user);

                          return (
                            <tr
                              key={
                                user._id ||
                                user.id ||
                                index
                              }
                            >

                              <td>

                                <div className="user-cell">

                                  <div className="user-avatar">
                                    {getInitials(
                                      user
                                    )}
                                  </div>

                                  <div>

                                    <div className="user-name">
                                      {getUserName(
                                        user
                                      )}
                                    </div>

                                    <div className="user-id">
                                      ID:{" "}
                                      {getUserId(
                                        user
                                      )}
                                    </div>

                                  </div>

                                </div>

                              </td>

                              <td>
                                <span className="user-email">
                                  {user.email ||
                                    "—"}
                                </span>
                              </td>

                              <td>

                                <span
                                  className="user-badge"
                                  style={getRoleStyle(
                                    role
                                  )}
                                >
                                  {String(
                                    role
                                  ).toLowerCase() ===
                                  "admin"
                                    ? "🛡️"
                                    : "👤"}

                                  {role}
                                </span>

                              </td>

                              <td>
                                {formatDate(
                                  user.createdAt
                                )}
                              </td>

                              <td>

                                <span
                                  className="user-badge"
                                  style={getStatusStyle(
                                    status
                                  )}
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

                <div className="mobile-users-list">

                  {filteredUsers.map(
                    (user, index) => {

                      const role =
                        getRole(user);

                      const status =
                        getStatus(user);

                      return (
                        <div
                          className="mobile-user-card"
                          key={
                            user._id ||
                            user.id ||
                            index
                          }
                        >

                          <div className="mobile-user-top">

                            <div className="mobile-user-info">

                              <div className="user-avatar">
                                {getInitials(
                                  user
                                )}
                              </div>

                              <div>

                                <div className="mobile-user-name">
                                  {getUserName(
                                    user
                                  )}
                                </div>

                                <div className="mobile-user-email">
                                  {user.email ||
                                    "No email"}
                                </div>

                              </div>

                            </div>

                            <span
                              className="user-badge"
                              style={getRoleStyle(
                                role
                              )}
                            >
                              {role}
                            </span>

                          </div>

                          <div className="mobile-user-details">

                            <div>
                              <div className="mobile-detail-label">
                                User ID
                              </div>

                              <div className="mobile-detail-value">
                                {getUserId(
                                  user
                                )}
                              </div>
                            </div>

                            <div>
                              <div className="mobile-detail-label">
                                Joined
                              </div>

                              <div className="mobile-detail-value">
                                {formatDate(
                                  user.createdAt
                                )}
                              </div>
                            </div>

                            <div>
                              <div className="mobile-detail-label">
                                Status
                              </div>

                              <span
                                className="user-badge"
                                style={getStatusStyle(
                                  status
                                )}
                              >
                                <span className="status-dot" />
                                {status}
                              </span>
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

        </div>
      </div>
    </>
  );
}

export default Users;